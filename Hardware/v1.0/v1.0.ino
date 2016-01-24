#define LED_PIN 13
#define VELOSTAT_PIN A3 // Analog Pin
int pressure;

void setup() {
  Serial.begin(9600);
  pinMode(VELOSTAT_PIN, INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  pressure = analogRead(VELOSTAT_PIN);
  Serial.print("Pressure: ");
  Serial.println(pressure);
  delay(300);
}
