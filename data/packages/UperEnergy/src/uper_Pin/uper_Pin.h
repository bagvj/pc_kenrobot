#ifndef UPER_PIN_H
#define UPER_PIN_H

#undef PD0
#undef PD1
#undef PD2
#undef PD3
#undef PD4
#undef PD5
#undef PD6

// 引脚未使用
#define P_NC (255)
// 2P数字口(12, 13)
#define PD0 (0)
// 2P数字口(10, 11)
#define PD1 (1)
// 2P数字口(8, 9)
#define PD2 (2)
// 2P数字口(6, 7)
#define PD3 (3)
// 2P数字口(4, 5)
#define PD4 (4)
// 2P数字口(2, 3)
#define PD5 (5)
// 2P数字口(0, 1)
#define PD6 (6)

// 检查2P数字口
#define CHECK_PD_PIN(pin) ((pin) >= PD0 && (pin) <= PD6 ? (pin) : P_NC)

// 2P数字口结构体定义
typedef struct {
	uint8_t d1;
	uint8_t d2;
} Uper2PDigitalDef;

// 2P数字口
Uper2PDigitalDef Uper2PDigitalPort[7] = {
	{12, 13}, {10, 11}, {8, 9}, {6, 7}, {4, 5}, {2, 3}, {0, 1}
};

#endif // UPER_PIN_H
