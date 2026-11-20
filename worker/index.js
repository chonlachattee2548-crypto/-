"use strict";

const DEVICE_ONLINE_MS = 15_000;
const COMMAND_TIMEOUT_MS = 20_000;
const GLOBAL_COOLDOWN_MS = 60_000;
const VISITOR_COOLDOWN_MS = 60_000;
const MAX_COOLDOWN_ENTRIES = 512;
const ROTATE_COMMAND = "rotate_360_once";
const SHOWROOM_RELATION_TYPE = "jewelryShowroomTodiamondPedestal";
const SHOWROOM_LATEST_KEYS = ["authorized", "itemPresent", "coverOpen", "weight", "vibration", "battery", "dailyMaxVibration"];
const SHOWROOM_HISTORY_KEYS = ["vibration", "dailyMaxVibration"];

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers }
  });
}

function allowedOrigins(env) {
  return String(env.WEB_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function withCors(response, origin, env) {
  const headers = new Headers(response.headers);
  if (origin && allowedOrigins(env).includes(origin)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
    headers.set("access-control-allow-headers", "Authorization, Content-Type");
    headers.set("access-control-max-age", "600");
    headers.append("vary", "Origin");
  }
  headers.set("x-content-type-options", "nosniff");
  return new Response(response.body, { status: response.status, headers });
}

async function readJson(request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 4096) return null;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > 4096) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function hashClientAddress(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value || "unknown"));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function secureEqual(left, right) {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  let difference = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (a[index] || 0) ^ (b[index] || 0);
  }
  return difference === 0;
}

async function verifyTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET || !token) return false;
  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET,
    response: token
  });
  const remoteIp = request.headers.get("cf-connecting-ip");
  if (remoteIp) body.set("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body
  });
  if (!response.ok) return false;
  const result = await response.json();
  const origin = request.headers.get("origin");
  const host = origin ? new URL(origin).hostname : "";
  return result.success === true
    && result.action === "rotate"
    && (!host || result.hostname === host);
}

function roomStub(env) {
  const id = env.TURN_TABLE.idFromName("showroom");
  return env.TURN_TABLE.get(id);
}

async function authorizeDevice(request, env) {
  const expected = String(env.DEVICE_TOKEN || "");
  const received = request.headers.get("authorization") || "";
  if (!expected || !received.startsWith("Bearer ")) return false;
  return secureEqual(received.slice(7), expected);
}

function showroomViewerAuthorized(request, env) {
  const expected = String(env.SHOWROOM_DASHBOARD_PASSWORD || "");
  const received = request.headers.get("authorization") || "";
  if (expected.length < 32 || !received.startsWith("Bearer ")) return false;
  return secureEqual(received.slice(7), expected);
}

function thingsBoardBaseUrl(env) {
  const baseUrl = new URL(env.THINGSBOARD_URL || "https://thingsboard.cloud");
  if (baseUrl.protocol !== "https:" || baseUrl.username || baseUrl.password) {
    throw new Error("invalid_thingsboard_url");
  }
  return baseUrl;
}

async function thingsBoardLogin(env) {
  const username = String(env.THINGSBOARD_USERNAME || "").trim();
  const password = String(env.THINGSBOARD_PASSWORD || "");
  const baseUrl = thingsBoardBaseUrl(env);
  const response = await fetch(new URL("/api/auth/login", baseUrl.origin), {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    const error = new Error("thingsboard_login_failed");
    error.status = response.status;
    throw error;
  }
  const session = await response.json();
  if (typeof session.token !== "string" || !session.token) {
    throw new Error("thingsboard_login_response_invalid");
  }
  return session.token;
}

async function thingsBoardAuthorization(env) {
  const apiKey = String(env.THINGSBOARD_API_KEY || "").trim();
  if (apiKey) return `ApiKey ${apiKey}`;
  return `Bearer ${await thingsBoardLogin(env)}`;
}

async function thingsBoardGet(env, path, authorization) {
  const baseUrl = thingsBoardBaseUrl(env);
  const url = new URL(path, `${baseUrl.origin}/`);
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "X-Authorization": authorization
    }
  });
  if (!response.ok) {
    const error = new Error("thingsboard_request_failed");
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function valueAsBoolean(value) {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1 || value === "1") return true;
  if (value === "false" || value === 0 || value === "0") return false;
  return null;
}

function valueAsNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function latestTelemetry(data, key, convert = (value) => value) {
  const point = data?.[key]?.[0];
  if (!point) return { value: null, ts: null };
  return { value: convert(point.value), ts: valueAsNumber(point.ts) };
}

function latestAttribute(data, key, convert = (value) => value) {
  const attribute = data.find((item) => item.key === key);
  return attribute
    ? { value: convert(attribute.value), ts: valueAsNumber(attribute.lastUpdateTs) }
    : { value: null, ts: null };
}

function sanitizeHistory(data) {
  return Object.fromEntries(SHOWROOM_HISTORY_KEYS.map((key) => [
    key,
    (Array.isArray(data?.[key]) ? data[key] : [])
      .map((point) => ({ ts: valueAsNumber(point.ts), value: valueAsNumber(point.value) }))
      .filter((point) => point.ts !== null && point.value !== null)
  ]));
}

function showroomAlerts(device) {
  const alerts = [];
  if (device.active === false) alerts.push("อุปกรณ์ไม่ทำงาน");
  if (device.authorized.value === false) alerts.push("ตรวจพบการเข้าถึงที่ไม่ได้รับอนุญาต");
  if (device.coverOpen.value === true) alerts.push("ฝาครอบตู้เปิดอยู่");
  if (device.itemPresent.value === false) alerts.push("ไม่พบเครื่องประดับบนแท่น");
  if (device.vibration.value !== null && device.maxVibrationThreshold.value !== null
    && device.vibration.value > device.maxVibrationThreshold.value) {
    alerts.push("แรงสั่นสะเทือนเกินค่าที่กำหนด");
  }
  return alerts;
}

async function showroomSecurityData(env) {
  const apiKey = String(env.THINGSBOARD_API_KEY || "").trim();
  const username = String(env.THINGSBOARD_USERNAME || "").trim();
  const password = String(env.THINGSBOARD_PASSWORD || "");
  const assetId = String(env.SHOWROOM_ASSET_ID || "");
  if ((!apiKey && (!username || !password)) || !assetId
    || String(env.SHOWROOM_DASHBOARD_PASSWORD || "").length < 32) {
    return jsonResponse({ error: "showroom_api_not_configured" }, 503, { "cache-control": "no-store" });
  }

  const relationsQuery = new URLSearchParams({
    fromId: assetId,
    fromType: "ASSET",
    relationType: SHOWROOM_RELATION_TYPE,
    relationTypeGroup: "COMMON"
  }).toString();

  try {
    const authorization = await thingsBoardAuthorization(env);
    const relations = await thingsBoardGet(env, `/api/relations?${relationsQuery}`, authorization);
    const targets = (Array.isArray(relations) ? relations : [])
      .filter((relation) => relation.from?.id === assetId && relation.to?.entityType === "DEVICE")
      .map((relation) => relation.to.id)
      .filter((id) => typeof id === "string")
      .slice(0, 20);
    const endTs = Date.now();
    const startTs = endTs - 7 * 24 * 60 * 60 * 1000;
    const devices = await Promise.all(targets.map(async (deviceId, index) => {
      const encodedId = encodeURIComponent(deviceId);
      const latestQuery = new URLSearchParams({ keys: SHOWROOM_LATEST_KEYS.join(",") });
      const attributeQuery = new URLSearchParams({ keys: "active,maxVibrationThreshold" });
      const historyQuery = new URLSearchParams({
        keys: SHOWROOM_HISTORY_KEYS.join(","),
        startTs: String(startTs),
        endTs: String(endTs),
        limit: "250",
        agg: "NONE",
        orderBy: "ASC"
      });
      const [deviceInfo, latest, attributes, history] = await Promise.all([
        thingsBoardGet(env, `/api/device/${encodedId}`, authorization),
        thingsBoardGet(env, `/api/plugins/telemetry/DEVICE/${encodedId}/values/timeseries?${latestQuery}`, authorization),
        thingsBoardGet(env, `/api/plugins/telemetry/DEVICE/${encodedId}/values/attributes?${attributeQuery}`, authorization),
        thingsBoardGet(env, `/api/plugins/telemetry/DEVICE/${encodedId}/values/timeseries?${historyQuery}`, authorization)
      ]);
      const attributeList = Array.isArray(attributes) ? attributes : [];
      const active = latestAttribute(attributeList, "active", valueAsBoolean).value;
      const securityDevice = {
        key: index,
        name: typeof deviceInfo.name === "string" ? deviceInfo.name.slice(0, 80) : `แท่นจัดแสดง ${index + 1}`,
        active,
        authorized: latestTelemetry(latest, "authorized", valueAsBoolean),
        itemPresent: latestTelemetry(latest, "itemPresent", valueAsBoolean),
        coverOpen: latestTelemetry(latest, "coverOpen", valueAsBoolean),
        weight: latestTelemetry(latest, "weight", valueAsNumber),
        vibration: latestTelemetry(latest, "vibration", valueAsNumber),
        battery: latestTelemetry(latest, "battery", valueAsNumber),
        dailyMaxVibration: latestTelemetry(latest, "dailyMaxVibration", valueAsNumber),
        maxVibrationThreshold: latestAttribute(attributeList, "maxVibrationThreshold", valueAsNumber),
        history: sanitizeHistory(history)
      };
      const timestamps = [
        ...Object.values(securityDevice)
          .filter((item) => item && typeof item === "object" && "ts" in item)
          .map((item) => item.ts),
        ...attributeList.map((item) => valueAsNumber(item.lastUpdateTs))
      ].filter((timestamp) => timestamp !== null);
      securityDevice.lastSeen = timestamps.length ? Math.max(...timestamps) : null;
      securityDevice.alerts = showroomAlerts(securityDevice);
      securityDevice.status = securityDevice.alerts.length
        ? "attention"
        : active === true ? "secure" : active === false ? "inactive" : "unknown";
      return securityDevice;
    }));

    return jsonResponse({
      source: "ThingsBoard Cloud REST API",
      updatedAt: endTs,
      devices
    }, 200, { "cache-control": "no-store" });
  } catch (error) {
    console.error("ThingsBoard showroom API request failed", error.status || "network_error");
    return jsonResponse({
      error: "thingsboard_request_failed",
      upstreamStatus: Number.isInteger(error.status) ? error.status : null
    }, 502, { "cache-control": "no-store" });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin");
    const origins = allowedOrigins(env);

    if (request.method === "OPTIONS") {
      if (!origin || !origins.includes(origin)) return jsonResponse({ error: "origin_not_allowed" }, 403);
      return withCors(new Response(null, { status: 204 }), origin, env);
    }

    if (url.pathname === "/health" && request.method === "GET") {
      const stateResponse = await roomStub(env).fetch("https://room.internal/_/status");
      const state = await stateResponse.json();
      return withCors(jsonResponse({
        service: "พร้อม",
        turnstileConfigured: Boolean(env.TURNSTILE_SECRET),
        remoteControlEnabled: env.REMOTE_CONTROL_ENABLED === "true",
        deviceOnline: state.deviceOnline
      }), origin, env);
    }

    if (url.pathname.startsWith("/api/") && (!origin || !origins.includes(origin))) {
      return jsonResponse({ error: "origin_not_allowed" }, 403);
    }

    if (url.pathname === "/api/status" && request.method === "GET") {
      const response = await roomStub(env).fetch("https://room.internal/_/status");
      return withCors(response, origin, env);
    }

    if (url.pathname === "/api/showroom/security" && request.method === "GET") {
      if (!showroomViewerAuthorized(request, env)) {
        return withCors(jsonResponse({ error: "showroom_unauthorized" }, 401, { "cache-control": "no-store" }), origin, env);
      }
      return withCors(await showroomSecurityData(env), origin, env);
    }

    if (url.pathname === "/api/commands/rotate" && request.method === "POST") {
      if (env.REMOTE_CONTROL_ENABLED !== "true") {
        return withCors(jsonResponse({ error: "remote_control_disabled" }, 503), origin, env);
      }
      const data = await readJson(request);
      if (!(await verifyTurnstile(data?.turnstileToken, request, env))) {
        return withCors(jsonResponse({ error: "verification_required" }, 403), origin, env);
      }
      const addressHash = await hashClientAddress(request.headers.get("cf-connecting-ip"));
      const response = await roomStub(env).fetch("https://room.internal/_/commands/rotate", {
        method: "POST",
        headers: { "content-type": "application/json", "x-client-key": addressHash }
      });
      return withCors(response, origin, env);
    }

    if (url.pathname.startsWith("/device/")) {
      if (!(await authorizeDevice(request, env))) {
        return jsonResponse({ error: "device_unauthorized" }, 401);
      }
      const internal = new URL(request.url);
      internal.hostname = "room.internal";
      internal.pathname = `/_${url.pathname}`;
      const response = await roomStub(env).fetch(new Request(internal, request));
      return jsonResponse(await response.json(), response.status);
    }

    return withCors(jsonResponse({ error: "not_found" }, 404), origin, env);
  }
};

export class TurntableRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async readState() {
    return await this.state.storage.get("room") || {
      heartbeat: null,
      queuedCommand: null,
      activeCommand: null,
      lastCommandAt: 0,
      cooldowns: {},
      lastResult: null
    };
  }

  expireCommand(room, now) {
    if (!room.activeCommand || now - room.activeCommand.startedAt < COMMAND_TIMEOUT_MS) return false;
    room.lastResult = {
      id: room.activeCommand.id,
      status: "timeout",
      completedAt: now,
      message: "หมดเวลารอผลจากบอร์ด ต้องตรวจสอบว่าอุปกรณ์หยุดหมุนแล้ว"
    };
    room.activeCommand = null;
    return true;
  }

  publicStatus(room, now) {
    const heartbeat = room.heartbeat;
    const deviceOnline = Boolean(heartbeat && now - heartbeat.receivedAt <= DEVICE_ONLINE_MS);
    return {
      deviceOnline,
      lastSeen: heartbeat?.receivedAt || null,
      motorReady: deviceOnline && heartbeat.motorReady === true,
      pirDetected: deviceOnline && typeof heartbeat.pirDetected === "boolean" ? heartbeat.pirDetected : null,
      firmware: deviceOnline ? heartbeat.firmware : null,
      commandBusy: Boolean(room.queuedCommand || room.activeCommand),
      lastResult: room.lastResult,
      remoteControlEnabled: this.env.REMOTE_CONTROL_ENABLED === "true"
    };
  }

  async fetch(request) {
    const url = new URL(request.url);
    return this.state.blockConcurrencyWhile(async () => {
      const now = Date.now();
      const room = await this.readState();
      let changed = this.expireCommand(room, now);
      let response;

      if (url.pathname === "/_/status" && request.method === "GET") {
        response = jsonResponse(this.publicStatus(room, now));
      } else if (url.pathname === "/_/commands/rotate" && request.method === "POST") {
        const clientKey = request.headers.get("x-client-key") || "unknown";
        const lastVisitorCommand = room.cooldowns[clientKey] || 0;
        const remainingVisitor = VISITOR_COOLDOWN_MS - (now - lastVisitorCommand);
        const remainingGlobal = GLOBAL_COOLDOWN_MS - (now - room.lastCommandAt);
        const status = this.publicStatus(room, now);

        if (this.env.REMOTE_CONTROL_ENABLED !== "true") {
          response = jsonResponse({ error: "remote_control_disabled" }, 503);
        } else if (!status.deviceOnline || !status.motorReady) {
          response = jsonResponse({ error: "device_not_ready" }, 409);
        } else if (room.queuedCommand || room.activeCommand) {
          response = jsonResponse({ error: "command_busy" }, 409);
        } else if (remainingVisitor > 0 || remainingGlobal > 0) {
          response = jsonResponse({
            error: "cooldown",
            retryAfterSeconds: Math.ceil(Math.max(remainingVisitor, remainingGlobal) / 1000)
          }, 429);
        } else {
          const command = { id: crypto.randomUUID(), command: ROTATE_COMMAND, issuedAt: now };
          room.queuedCommand = command;
          room.lastCommandAt = now;
          room.cooldowns[clientKey] = now;
          const entries = Object.entries(room.cooldowns)
            .filter(([, timestamp]) => now - timestamp < VISITOR_COOLDOWN_MS)
            .slice(-MAX_COOLDOWN_ENTRIES);
          room.cooldowns = Object.fromEntries(entries);
          changed = true;
          response = jsonResponse({ accepted: true, commandId: command.id, status: "queued" }, 202);
        }
      } else if (url.pathname === "/_/device/heartbeat" && request.method === "POST") {
        const data = await readJson(request);
        if (!data || typeof data.motorReady !== "boolean") {
          response = jsonResponse({ error: "invalid_heartbeat" }, 400);
        } else {
          room.heartbeat = {
            receivedAt: now,
            motorReady: data.motorReady,
            pirDetected: typeof data.pirDetected === "boolean" ? data.pirDetected : null,
            firmware: typeof data.firmware === "string" ? data.firmware.slice(0, 40) : "ไม่ระบุ"
          };
          changed = true;
          response = jsonResponse({ accepted: true });
        }
      } else if (url.pathname === "/_/device/next" && request.method === "GET") {
        if (room.queuedCommand) {
          room.activeCommand = { ...room.queuedCommand, startedAt: now };
          room.queuedCommand = null;
          changed = true;
          response = jsonResponse({ command: room.activeCommand });
        } else {
          response = jsonResponse({ command: null });
        }
      } else if (url.pathname === "/_/device/result" && request.method === "POST") {
        const data = await readJson(request);
        if (!data || !room.activeCommand || data.commandId !== room.activeCommand.id
          || !["completed", "failed"].includes(data.status)) {
          response = jsonResponse({ error: "invalid_command_result" }, 409);
        } else {
          room.lastResult = {
            id: room.activeCommand.id,
            status: data.status,
            completedAt: now,
            message: typeof data.message === "string" ? data.message.slice(0, 120) : ""
          };
          room.activeCommand = null;
          changed = true;
          response = jsonResponse({ accepted: true });
        }
      } else {
        response = jsonResponse({ error: "not_found" }, 404);
      }

      if (changed) await this.state.storage.put("room", room);
      return response;
    });
  }
}
