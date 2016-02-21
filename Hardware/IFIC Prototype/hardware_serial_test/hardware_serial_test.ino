#define VELOSTAT_PIN A0
#define HARDWARE_ID "99999999"
#define SEAT_AVAILABLE true
#define SEAT_NOT_AVAILABLE false
#define SEAT_UPDATE_SUCCESSFUL_CODE 1
#define SEAT_UPDATE_UNSUCCESSFUL_CODE 0
#define SAMPLE_COUNT 50
#define PRESSURE_THRESHOLD 200 // Beyond this threshold, we can assume there is NOBODY using the table
#define SUCCESSFUL_UPDATE_INTERLOOP_DELAY 200
#define UNSUCCESSFUL_UPDATE_INTERLOOP_DELAY 100

int prev = -1, cur, pressureReading, seatUpdateStatus = -1;
void setup() {
  Serial.begin(9600);
  digitalWrite(VELOSTAT_PIN, HIGH);
  pinMode(13, OUTPUT);
}

void loop() {
  pressureReading = getVelostatAverageReading(SAMPLE_COUNT);
  if (pressureReading > PRESSURE_THRESHOLD) cur = SEAT_AVAILABLE;
  else cur = SEAT_NOT_AVAILABLE;

  // Only update the server if the reading changes
  // This reduces unnecessary internet usage
  if (cur != prev) {
    // Tell which hardware this is
    Serial.println(HARDWARE_ID);
    
    Serial.println(pressureReading);

    // Tell the current seat availability
    Serial.println(cur);

    // Only continue operating after the previous updating process is done
    // Otherwise, there will be too much availability update in the pipe
    while (!Serial.available());

    // Read the seat update process status
    seatUpdateStatus = Serial.read();
    
  }

  // Update prev
  prev = cur;

  // For reliability in reading the sensor
  if (seatUpdateStatus == SEAT_UPDATE_SUCCESSFUL_CODE) delay(SUCCESSFUL_UPDATE_INTERLOOP_DELAY);
  else delay(UNSUCCESSFUL_UPDATE_INTERLOOP_DELAY);

  digitalWrite(13, HIGH);
  delay(500);
  digitalWrite(13, LOW);
  delay(500);
}

int getVelostatAverageReading (int sampleCount) {
  int total = 0;
  for (int i = 0; i < sampleCount; i++) {
    total += analogRead(VELOSTAT_PIN);
    delay(10);
  }

  return total / sampleCount;
}

