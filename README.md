# Flask_MQTT_ESP32
Sensor tracking system using Flask_MQTT and ESP32
Using:
Download the project zip file, split the MQTT_ESP zip folder and run it in a separate project, the remaining files run in another project. Project MQTT_ESP is the algorithm code for ESP to receive sensors, display to Oled and push to broker, the other project is run with Flask_MQTT to initialize WebSever for monitoring. Carefully read the main file of the 2 projects to change the local Wifi and the broker accordingly
