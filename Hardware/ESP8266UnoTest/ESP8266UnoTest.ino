#include <SoftwareSerial.h>

SoftwareSerial wifiSerial(7, 6); // RX, TX

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);3
  wifiSerial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:

  // This loop receives the respond from ESP8266 and write it down on the Serial monitor
  if (wifiSerial.available()) {
    while (wifiSerial.available()) {
      Serial.write(wifiSerial.read());3
    }
  }

  // This loop receives the COMMAND from the Serial monitor and send it to the ESP8266
  if (Serial.available()) {
    // This delay is needed to wait for most of the command given from the Serial monitor to be received
    // before sending it into ESP826
    delay(100);

    String command = "";
    while (Serial.available()) {
      command += (char) Serial.read();
    }

    wifiSerial.println(command);
    Serial.println(command);
  }
}
