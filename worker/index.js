"use strict";

const DEVICE_ONLINE_MS = 15_000;
const COMMAND_TIMEOUT_MS = 20_000;
const GLOBAL_COOLDOWN_MS = 60_000;
const VISITOR_COOLDOWN_MS = 60_000;
const MAX_COOLDOWN_ENTRIES = 512;
const ROTATE_COMMAND = "rotate_360_once";

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
