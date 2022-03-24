#include <Arduino.h>
#include <FastLED.h>

#define NUM_LEDS 25
#define DATA_PIN 6

CRGB leds[NUM_LEDS];

long randColor[10] = {
  CRGB::Red,
  CRGB::White,
  CRGB::Blue,
  CRGB::Green,
  CRGB::Violet,
  CRGB::Teal,
  CRGB::Pink,
  CRGB::Orange,
  CRGB::Brown,
  CRGB::Yellow
};

void setup()
{
  FastLED.addLeds<WS2812B, DATA_PIN>(leds, NUM_LEDS);
}

void loop()
{
  for (int dot = 0; dot < NUM_LEDS; dot++)
  {
    leds[dot] = randColor[random(0,10)];
    FastLED.show();
    // clear this led for the next time around the loop
    leds[dot] = CRGB::Black;
    delay(200);
  }
}