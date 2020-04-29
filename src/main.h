/*
 * main.h
 *
 *  Created on: Mar 18, 2020
 *      Author: prageeth
 */

#ifndef SRC_MAIN_H_
#define SRC_MAIN_H_

#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <FS.h>
#include <Ticker.h>
#include <SoftwareSerial.h>
#include <WiFiClient.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <ArduinoOTA.h>

#define ARRAY_SIZE(arr) (sizeof(arr) / sizeof((arr)[0]))
#define WIFI_LED 2
#define FMT_BASIC_INFO "[%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d]"
#define FMT_VOLTAGES "[%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d]"
#define CONTENT_TYPE_APPLICATION_JSON "application/json"

#define SERIAL_RETRIES 128

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
	char *array;
	volatile unsigned int used;
	volatile unsigned int size;
} Array;

void setupPins();
void bmsWrite(char *data, int len);
void bmsRead(Array *a);
void initBms();
void initBmsStub(char * data, int len);
void bmsDrainSerial();
bool setupWiFi();
void setupWebServer();
void notFound(AsyncWebServerRequest *request);
void setupNTPClient();
void setupOTA();
void handleRoot();
void bmsv();
void bmsb();
void initArray(Array *a, unsigned int initialSize);
void insertArray(Array *a, char element);
void freeArray(Array *a);
void printCharArrayHex(Array *a);
String readProperty(String props, String key);

#ifdef __cplusplus
} // extern "C"
#endif
#endif /* SRC_MAIN_H_ */
