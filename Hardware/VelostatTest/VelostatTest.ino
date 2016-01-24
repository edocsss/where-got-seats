const int velostatPin = A0;
int pressureReading;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  digitalWrite(velostatPin, HIGH);
}

void loop() {
  // put your main code here, to run repeatedly:
  pressureReading = getVelostatAverageReading(50);

  Serial.println(pressureReading);
//  Serial.println(map(pressureReading, 0, 1023, 0, 10230));
  Serial.println();
  delay(500);
}

int getVelostatAverageReading (int sampleCount) {
  int total = 0;
  for (int i = 0; i < sampleCount; i++) {
    total += analogRead(velostatPin);
    delay(10);
  }

  Serial.print("Total: ");
  Serial.println(total);
  return total / sampleCount;
}

