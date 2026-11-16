#include <Arduino.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <ESP32Servo.h>
#include <time.h>

#if __has_include("secrets.h")
#include "../secrets.h"
#else
#include "../secrets.example.h"
#endif

namespace {
constexpr char FIRMWARE_VERSION[] = "0.1.0";
constexpr bool REMOTE_CONTROL_ENABLED = false;
constexpr bool MOTOR_OUTPUT_ENABLED = false;
constexpr int SERVO_PIN = -1;
constexpr int SERVO_STOP_US = 1500;
constexpr int SERVO_ROTATE_US = 1600;
constexpr uint32_t SERVO_ROTATION_MS = 1000;
constexpr uint32_t MAX_ROTATION_MS = 10000;
constexpr uint32_t HEARTBEAT_INTERVAL_MS = 5000;
constexpr uint32_t COMMAND_POLL_INTERVAL_MS = 2000;
constexpr uint32_t WIFI_RETRY_INTERVAL_MS = 10000;

Servo turntableServo;
bool motorReady = false;
bool rotationActive = false;
bool remoteControlReady = false;
uint32_t rotationStartedAt = 0;
uint32_t lastHeartbeatAt = 0;
uint32_t lastCommandPollAt = 0;
uint32_t lastWifiAttemptAt = 0;
String activeCommandId;

void reportCommandResult(const String& commandId, const char* status, const char* message);

bool secretsConfigured() {
  return strlen(WIFI_SSID) > 0
      && strlen(WIFI_PASSWORD) > 0
      && strlen(WORKER_BASE_URL) > 0
      && strlen(DEVICE_TOKEN) > 0
      && strlen(CLOUDFLARE_ROOT_CA) > 0;
}

void stopMotor() {
  if (MOTOR_OUTPUT_ENABLED && turntableServo.attached()) {
    turntableServo.writeMicroseconds(SERVO_STOP_US);
  }
  rotationActive = false;
}

void startRotation(const String& commandId) {
  if (!MOTOR_OUTPUT_ENABLED || !motorReady || rotationActive) {
    Serial.println("{\"event\":\"rotate_rejected\",\"reason\":\"motor_not_ready\"}");
    return;
  }
  activeCommandId = commandId;
  rotationStartedAt = millis();
  rotationActive = true;
  turntableServo.writeMicroseconds(SERVO_ROTATE_US);
  Serial.println("{\"event\":\"rotation_started\"}");
}

void serviceMotor() {
  if (!rotationActive) return;
  const bool timedOut = millis() - rotationStartedAt >= MAX_ROTATION_MS;
  const bool completed = millis() - rotationStartedAt >= SERVO_ROTATION_MS;
  const bool disconnected = WiFi.status() != WL_CONNECTED;
  if (timedOut || completed || disconnected) {
    const String commandId = activeCommandId;
    stopMotor();
    if (timedOut || disconnected) {
      Serial.println("{\"event\":\"rotation_stopped\",\"status\":\"failed\"}");
      if (!commandId.isEmpty() && WiFi.status() == WL_CONNECTED) {
        reportCommandResult(commandId, "failed", timedOut ? "motor_timeout" : "wifi_disconnected");
      }
    } else {
      Serial.println("{\"event\":\"rotation_stopped\",\"status\":\"completed\"}");
      if (!commandId.isEmpty()) reportCommandResult(commandId, "completed", "timed_profile_finished");
    }
    activeCommandId = "";
  }
}

bool waitForClock() {
  configTime(0, 0, "pool.ntp.org", "time.cloudflare.com");
  const uint32_t startedAt = millis();
  while (time(nullptr) < 1700000000 && millis() - startedAt < 15000) {
    delay(250);
  }
  return time(nullptr) >= 1700000000;
}

bool beginSecureRequest(WiFiClientSecure& client, HTTPClient& http, const char* path) {
  if (!remoteControlReady) return false;
  String baseUrl = WORKER_BASE_URL;
  while (baseUrl.endsWith("/")) baseUrl.remove(baseUrl.length() - 1);
  if (!baseUrl.startsWith("https://")) {
    Serial.println("{\"event\":\"secure_request_rejected\",\"reason\":\"worker_url_must_use_https\"}");
    return false;
  }
  if (!waitForClock()) {
    Serial.println("{\"event\":\"secure_request_failed\",\"reason\":\"system_clock_unavailable\"}");
    return false;
  }
  client.setCACert(CLOUDFLARE_ROOT_CA);
  const String url = baseUrl + path;
  if (!http.begin(client, url)) {
    Serial.println("{\"event\":\"secure_request_failed\",\"reason\":\"http_begin_failed\"}");
    return false;
  }
  http.setTimeout(4000);
  http.addHeader("Authorization", String("Bearer ") + DEVICE_TOKEN);
  http.addHeader("Content-Type", "application/json");
  return true;
}

void sendHeartbeat() {
  if (!remoteControlReady || rotationActive || WiFi.status() != WL_CONNECTED
      || millis() - lastHeartbeatAt < HEARTBEAT_INTERVAL_MS) return;
  lastHeartbeatAt = millis();

  WiFiClientSecure client;
  HTTPClient http;
  if (!beginSecureRequest(client, http, "/device/heartbeat")) return;

  JsonDocument body;
  body["motorReady"] = motorReady && MOTOR_OUTPUT_ENABLED;
  body["pirDetected"] = nullptr;
  body["firmware"] = FIRMWARE_VERSION;
  String payload;
  serializeJson(body, payload);
  const int statusCode = http.POST(payload);
  http.end();
  if (statusCode < 200 || statusCode >= 300) {
    Serial.printf("{\"event\":\"heartbeat_failed\",\"httpStatus\":%d}\n", statusCode);
  }
}

void reportCommandResult(const String& commandId, const char* status, const char* message) {
  WiFiClientSecure client;
  HTTPClient http;
  if (!beginSecureRequest(client, http, "/device/result")) return;

  JsonDocument body;
  body["commandId"] = commandId;
  body["status"] = status;
  body["message"] = message;
  String payload;
  serializeJson(body, payload);
  const int statusCode = http.POST(payload);
  http.end();
  if (statusCode < 200 || statusCode >= 300) {
    Serial.printf("{\"event\":\"result_report_failed\",\"httpStatus\":%d}\n", statusCode);
  }
}

void pollCommand() {
  if (!remoteControlReady || !motorReady || rotationActive || WiFi.status() != WL_CONNECTED
      || millis() - lastCommandPollAt < COMMAND_POLL_INTERVAL_MS) return;
  lastCommandPollAt = millis();

  WiFiClientSecure client;
  HTTPClient http;
  if (!beginSecureRequest(client, http, "/device/next")) return;
  const int statusCode = http.GET();
  if (statusCode != HTTP_CODE_OK) {
    http.end();
    return;
  }

  JsonDocument response;
  const DeserializationError error = deserializeJson(response, http.getString());
  http.end();
  if (error || response["command"].isNull()) return;

  const String command = response["command"]["command"] | "";
  const String commandId = response["command"]["id"] | "";
  if (command != "rotate_360_once" || commandId.isEmpty()) {
    reportCommandResult(commandId, "failed", "unsupported_command");
    return;
  }
  startRotation(commandId);
}

void connectWifi() {
  if (strlen(WIFI_SSID) == 0 || WiFi.status() == WL_CONNECTED
      || millis() - lastWifiAttemptAt < WIFI_RETRY_INTERVAL_MS) return;
  lastWifiAttemptAt = millis();
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("{\"event\":\"wifi_connecting\"}");
}

void readSerialCommands() {
  if (!Serial.available()) return;
  String command = Serial.readStringUntil('\n');
  command.trim();
  if (command.equalsIgnoreCase("STATUS")) {
    Serial.printf(
      "{\"firmware\":\"%s\",\"wifiConnected\":%s,\"motorReady\":%s,\"remoteControlEnabled\":%s,\"motorOutputEnabled\":%s}\n",
      FIRMWARE_VERSION,
      WiFi.status() == WL_CONNECTED ? "true" : "false",
      motorReady ? "true" : "false",
      remoteControlReady ? "true" : "false",
      MOTOR_OUTPUT_ENABLED ? "true" : "false"
    );
  } else if (command.equalsIgnoreCase("STOP")) {
    const String commandId = activeCommandId;
    stopMotor();
    if (!commandId.isEmpty() && WiFi.status() == WL_CONNECTED) {
      reportCommandResult(commandId, "failed", "manual_stop");
    }
    activeCommandId = "";
    Serial.println("{\"event\":\"stop_requested\"}");
  } else {
    Serial.println("{\"error\":\"supported_commands_are_STATUS_and_STOP\"}");
  }
}
}

void setup() {
  Serial.begin(115200);
  Serial.setTimeout(50);
  delay(300);

  if (MOTOR_OUTPUT_ENABLED && SERVO_PIN >= 0) {
    turntableServo.setPeriodHertz(50);
    turntableServo.attach(SERVO_PIN, 1000, 2000);
    turntableServo.writeMicroseconds(SERVO_STOP_US);
    motorReady = turntableServo.attached() && SERVO_ROTATION_MS > 0
        && SERVO_ROTATION_MS <= MAX_ROTATION_MS;
  }

  remoteControlReady = REMOTE_CONTROL_ENABLED && secretsConfigured();
  if (remoteControlReady) {
    connectWifi();
  } else if (REMOTE_CONTROL_ENABLED) {
    Serial.println("{\"event\":\"remote_control_disabled\",\"reason\":\"configuration_incomplete\"}");
  }
  Serial.printf(
    "{\"event\":\"boot\",\"firmware\":\"%s\",\"motorOutputEnabled\":%s,\"remoteControlEnabled\":%s}\n",
    FIRMWARE_VERSION,
    MOTOR_OUTPUT_ENABLED ? "true" : "false",
    remoteControlReady ? "true" : "false"
  );
}

void loop() {
  readSerialCommands();
  serviceMotor();
  if (!remoteControlReady) return;
  connectWifi();
  sendHeartbeat();
  pollCommand();
  delay(10);
}
