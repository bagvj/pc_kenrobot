#include "uper_RFID.h"

/** 定义RFID */
UPER_RFID_Module uper_rfid;
char *block;
char *dates;
void setup(void)
{
  Serial.begin(9600);
  uper_rfid.begin();
  Serial.println("RFID DEMO!");
  
  uint32_t versiondata = uper_rfid.get_version();
  if (! versiondata) {
    Serial.print("没有发现设备");
    while (1); // halt
  }
  /** Set normal mode, and disable SAM */
  uper_rfid.SAMConfiguration();
}

void loop(void)
{
  u8 buf[32],sta;
  
  
  /** Polling the mifar card, buf[0] is the length of the UID */
  sta = uper_rfid.InListPassiveTarget(buf);
  
  /** check state and UID length */
  if(sta && buf[0] == 4){
    /** factory default KeyA: 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF */
    u8 key[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
    u8 blocknum = 4;
    /** Authentication blok 4 */
    sta = uper_rfid.MifareAuthentication(0, blocknum, buf+1, buf[0], key);
    if(sta){
      /** save read block data */
      u8 block[16];
      strcpy(block, "UPER - RFID");
      sta = uper_rfid.MifareWriteBlock(blocknum, block);
      if(sta){
        Serial.println("Write block successfully!");
      }
  

      /** read block 4 */
      sta = uper_rfid.MifareReadBlock(blocknum, block);
      if(sta){
         u8 dates[16];
         Serial.println("Read block successfully:");
        Serial.println(strcpy(dates, block));
      }
      
    }  
  }
}