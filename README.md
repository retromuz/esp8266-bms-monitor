A web based battery monitoring system for SP15S020 BMS
=

Uses ESP8266 as brain. You can monitor with a browser either on mobile or desktop. Uses SVG.js for rendering cell icons. Ask for anymore features needed. Happy to implement.


![Sample Screenshot - Balancing](https://raw.githubusercontent.com/retromuz/esp8266-bms-monitor/master/screens/sample.png)
![Sample Screenshot - Charging](https://raw.githubusercontent.com/retromuz/esp8266-bms-monitor/master/screens/sample-charging.png)

Voltages are being shown below each cell.
Capacity for each cell is currently based purely on voltage.
When a cell is being balanced, the outline animates back and forth between black and purple.
Currently configured for a 14S battery. As of now this is not easily configurable to support other cell configurations.

Connection from ESP8266 to SP15S020 BMS
=
SP15S020 BMS has a UART serial port which works on 9600 baud rate. It provides 4 wires. 12V, TX, RX, GND.
ESP8266 will open up a software based serial UART port when using this code on RX: GPIO4, TX:GPIO5.

Below are the connections:

BMS GND <> ESP8266 GND

BMS 12V <> ESP8266 VIN (nodemcu v3 has one)

BMS TX <> ESP8266 GPIO4 (software RX)

BMS RX <> ESP8266 GPIO5 (software TX)

Update 2020-04-22 - Temperature monitoring implemented
=
![Sample Screenshot - Temperature monitoring](https://raw.githubusercontent.com/retromuz/esp8266-bms-monitor/master/screens/sample-temps.png)

LICENSE: MIT
