/*
  LightCoffeeButton
  [0-99]: Data from the light sensor
  -1: Data from the button
 
*/
const int buttonPin = 2;     // Interrupt 0 is on DIGITAL PIN 2!
const int ledPin =  13;      // the number of the LED pin
const int wait_time_sec = 60;
const int flashSpeed = 60;

// variables will change:
int buttonState = 0;         // variable for reading the pushbutton status

void setup() {
  pinMode(ledPin, OUTPUT);      
  pinMode(buttonPin, INPUT); 
  
  Serial.begin(9600);
  digitalWrite(ledPin, HIGH);
}

void loop(){
   buttonState = digitalRead(buttonPin);

  // check if the pushbutton is pressed.
  // if it is, the buttonState is HIGH:
  if (buttonState == HIGH) { 
    Serial.println("OMFGOMFGKAFFE");
    fancyLight(flashSpeed);
    delay(wait_time_sec*1000);
  } 
}

void fancyLight(int speed) {
  for ( int i = 0; i<5; i++) {
    digitalWrite(ledPin, LOW);
    delay(speed);
    digitalWrite(ledPin, HIGH);
    delay(speed);
  }
}
