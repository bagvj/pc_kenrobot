/*

www.uper.cc
*/

#include "uper_U8glib.h"



uint8_t U8GLIB::initSPI(u8g_dev_t *dev, uint8_t sck, uint8_t mosi, uint8_t cs, uint8_t a0, uint8_t reset)
{
  prepare();
  return u8g_InitSPI(&u8g, dev, sck, mosi, cs, a0, reset);
}

uint8_t U8GLIB::initHWSPI(u8g_dev_t *dev, uint8_t cs, uint8_t a0, uint8_t reset)
{
  prepare();
  return u8g_InitHWSPI(&u8g, dev, cs, a0, reset);
}

uint8_t U8GLIB::initI2C(u8g_dev_t *dev, uint8_t options)
{
  prepare();
  return u8g_InitI2C(&u8g, dev, options);
}

uint8_t U8GLIB::init8Bit(u8g_dev_t *dev, uint8_t d0, uint8_t d1, uint8_t d2, uint8_t d3, uint8_t d4, uint8_t d5, uint8_t d6, uint8_t d7, 
    uint8_t en, uint8_t cs1, uint8_t cs2, uint8_t di, uint8_t rw, uint8_t reset)
{
  prepare();
  return u8g_Init8Bit(&u8g, dev, d0, d1, d2, d3, d4, d5, d6, d7, en, cs1, cs2, di, rw, reset); 
}

uint8_t U8GLIB::init8BitFixedPort(u8g_dev_t *dev, uint8_t en, uint8_t cs, uint8_t di, uint8_t rw, uint8_t reset)
{
  prepare();
  return u8g_Init8BitFixedPort(&u8g, dev, en, cs, di, rw, reset);
}

uint8_t U8GLIB::initRW8Bit(u8g_dev_t *dev, uint8_t d0, uint8_t d1, uint8_t d2, uint8_t d3, uint8_t d4, uint8_t d5, uint8_t d6, uint8_t d7, 
    uint8_t cs, uint8_t a0, uint8_t wr, uint8_t rd, uint8_t reset)
{
  prepare();
  return u8g_InitRW8Bit(&u8g, dev, d0, d1, d2, d3, d4, d5, d6, d7, cs, a0, wr, rd, reset); 
}


