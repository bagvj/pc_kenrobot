define(['vendor/lodash'], function($1) {
	var schema = {
		"packages": [],
		"boards": [],
		"components": [],
		"blocks": [{
			"type": "group",
			"name": "group",
			"content": [],
			"connectors": [{
				"type": "connector-empty"
			}, {
				"type": "connector-empty"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}],
			"code": "{STATEMENTS}",
			"tags": [],
			"uid": "62W6Gd"
		}, {
			"type": "output",
			"name": "returnSensor",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "读取"
			}, {
				"id": "SENSOR",
				"type": "dynamic-select",
				"options": "sensors"
			}],
			"code": "{SENSOR.type}",
			"returnType": {
				"type": "fromDynamicSelect",
				"id": "SENSOR",
				"options": "sensors"
			},
			"tags": ["module"],
			"module": "sensor",
			"uid": "ujAaFv"
		}, {
			"type": "output",
			"name": "digitalRead",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "读取引脚"
			}, {
				"id": "PIN",
				"type": "dynamic-select",
				"options": "raws"
			}, {
				"type": "text",
				"value": "的数字量"
			}],
			"code": "digitalRead({PIN})",
			"returnType": {
				"type": "simple",
				"value": "int"
			},
			"tags": ["module"],
			"module": "default",
			"uid": "GwndZo"
		}, {
			"type": "output",
			"name": "analogRead",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "读取引脚"
			}, {
				"id": "PIN",
				"type": "dynamic-select",
				"options": "raws"
			}, {
				"type": "text",
				"value": "的模拟量"
			}],
			"code": "analogRead({PIN})",
			"returnType": {
				"type": "simple",
				"value": "int"
			},
			"tags": ["module"],
			"module": "default",
			"uid": "tv3Wpb"
		}, {
			"type": "statement",
			"name": "digitalWrite",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "EYkzKw"
			}],
			"content": [{
				"type": "text",
				"value": "设置引脚"
			}, {
				"id": "PIN",
				"type": "dynamic-select",
				"options": "raws"
			}, {
				"type": "text",
				"value": "数字量为"
			}, {
				"blockInputId": "DATA",
				"type": "block-input",
				"acceptType": "all",
				"name": "EYkzKw"
			}],
			"code": "digitalWrite({PIN},{DATA});",
			"tags": ["module"],
			"module": "default",
			"uid": "iRGIlz"
		}, {
			"type": "statement",
			"name": "analogWrite",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "oiP7fl"
			}],
			"content": [{
				"type": "text",
				"value": "设置引脚"
			}, {
				"id": "PIN",
				"type": "dynamic-select",
				"options": "raws"
			}, {
				"type": "text",
				"value": "模拟量为"
			}, {
				"blockInputId": "DATA",
				"type": "block-input",
				"acceptType": "all",
				"name": "oiP7fl"
			}],
			"code": "analogWrite({PIN},{DATA});",
			"tags": ["module"],
			"module": "default",
			"uid": "XikIW2"
		}, {
			"type": "output",
			"name": "hardwareVariable",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "返回"
			}, {
				"id": "VARIABLE",
				"type": "dynamic-select",
				"options": "hardwareVariables"
			}, {
				"type": "text",
				"value": "的引脚"
			}],
			"code": "{VARIABLE}",
			"returnType": {
				"type": "fromDynamicSelect",
				"id": "VARIABLE",
				"options": "hardwareVariables"
			},
			"tags": ["module", "advanced"],
			"module": "hardwareVariable",
			"uid": "2DFZNm"
		}, {
			"type": "statement",
			"name": "pinMode",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "设置引脚"
			}, {
				"id": "PIN",
				"type": "dynamic-select",
				"options": "raws"
			}, {
				"type": "text",
				"value": "的模式为"
			}, {
				"id": "MODE",
				"type": "static-select",
				"options": [{
					"label": "输入",
					"value": "INPUT"
				}, {
					"label": "输出",
					"value": "OUTPUT"
				}, {
					"label": "上拉",
					"value": "INPUT_PULLUP"
				}]
			}],
			"code": "pinMode({PIN},{MODE});",
			"tags": ["module", "advanced"],
			"module": "default",
			"uid": "Ndr6KO"
		}, {
			"type": "statement",
			"name": "pinMode2",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "设置引脚"
			}, {
				"id": "PIN",
				"type": "string-input",
			}, {
				"type": "text",
				"value": "的模式为"
			}, {
				"id": "MODE",
				"type": "static-select",
				"options": [{
					"label": "输入",
					"value": "INPUT"
				}, {
					"label": "输出",
					"value": "OUTPUT"
				}, {
					"label": "上拉",
					"value": "INPUT_PULLUP"
				}]
			}],
			"code": "pinMode({PIN},{MODE});",
			"tags": ["module", "advanced"],
			"module": "default",
			"uid": "7flgZS"
		}, {
			"type": "statement",
			"name": "motorRun",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "小功率电机"
			}, {
				"id": "MOTOR",
				"type": "dynamic-select",
				"options": "motors"
			}, {
				"type": "text",
				"value": "转动，速度为"
			}, {
				"id": "SPEED",
				"type": "number-input"
			}],
			"code": "{MOTOR}.run({SPEED});",
			"tags": ["module"],
			"module": "motor",
			"uid": "Dp0uBY"
		}, {
			"type": "statement",
			"name": "motorStop",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "小功率电机"
			}, {
				"id": "MOTOR",
				"type": "dynamic-select",
				"options": "motors"
			}, {
				"type": "text",
				"value": "停止转动"
			}],
			"code": "{MOTOR}.stop();",
			"tags": ["module"],
			"module": "motor",
			"uid": "rXvmfz"
		}, {
			"type": "output",
			"name": "returnComponent",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "返回"
			}, {
				"id": "COMPONENT",
				"type": "dynamic-select",
				"options": "components"
			}],
			"code": "{COMPONENT}",
			"returnType": {
				"type": "fromDynamicSelect",
				"id": "COMPONENT",
				"options": "components"
			},
			"tags": ["module", "advanced"],
			"module": "component",
			"uid": "ZgUO0e"
		}, {
			"type": "output",
			"name": "digitalReadAdvanced",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "0ucjX5"
			}],
			"content": [{
				"type": "text",
				"value": "读取引脚"
			}, {
				"blockInputId": "PIN",
				"type": "block-input",
				"acceptType": "all",
				"name": "0ucjX5"
			}, {
				"type": "text",
				"value": "的数字量"
			}],
			"code": "digitalRead({PIN})",
			"returnType": {
				"type": "simple",
				"value": "int"
			},
			"tags": ["module", "advanced"],
			"module": "default",
			"uid": "xhc6IF"
		}, {
			"type": "output",
			"name": "analogReadAdvanced",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "OAFY87"
			}],
			"content": [{
				"type": "text",
				"value": "读取引脚"
			}, {
				"blockInputId": "PIN",
				"type": "block-input",
				"acceptType": "all",
				"name": "OAFY87"
			}, {
				"type": "text",
				"value": "的模拟量"
			}],
			"code": "analogRead({PIN})",
			"returnType": {
				"type": "simple",
				"value": "int"
			},
			"tags": ["module", "advanced"],
			"module": "default",
			"uid": "CrAfJs"
		}, {
			"type": "statement",
			"name": "analogWriteAdvanced",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "o0Lbdw"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "qwtp3O"
			}],
			"content": [{
				"type": "text",
				"value": "设置引脚"
			}, {
				"blockInputId": "PIN",
				"type": "block-input",
				"acceptType": "all",
				"name": "o0Lbdw"
			}, {
				"type": "text",
				"value": "模拟量为"
			}, {
				"blockInputId": "DATA",
				"type": "block-input",
				"acceptType": "all",
				"name": "qwtp3O"
			}],
			"code": "analogWrite({PIN},{DATA});",
			"tags": ["module", "advanced"],
			"module": "default",
			"uid": "pf9d0N"
		}, {
			"type": "statement",
			"name": "digitalWriteAdvanced",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "8nQwAR"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "yd6jNr"
			}],
			"content": [{
				"type": "text",
				"value": "设置引脚"
			}, {
				"blockInputId": "PIN",
				"type": "block-input",
				"acceptType": "all",
				"name": "8nQwAR"
			}, {
				"type": "text",
				"value": "数字量为"
			}, {
				"blockInputId": "DATA",
				"type": "block-input",
				"acceptType": "all",
				"name": "yd6jNr"
			}],
			"code": "digitalWrite({PIN},{DATA});",
			"tags": ["module", "advanced"],
			"module": "default",
			"uid": "fJeoIf"
		}, {
			"type": "statement",
			"name": "motorRunAdvanced",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "QPrCkn"
			}],
			"content": [{
				"type": "text",
				"value": "小功率电机"
			}, {
				"id": "MOTOR",
				"type": "dynamic-select",
				"options": "motors"
			}, {
				"type": "text",
				"value": "转动，速度为"
			}, {
				"blockInputId": "SPEED",
				"type": "block-input",
				"acceptType": "all",
				"name": "QPrCkn"
			}],
			"code": "{MOTOR}.run({SPEED});",
			"tags": ["module", "advanced"],
			"module": "motor",
			"uid": "EH9wYs"
		}, {
			"type": "output",
			"name": "number",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"id": "VALUE",
				"type": "number-input",
				"value": 0,
				"placeholder": "数字"
			}],
			"code": "{VALUE}",
			"returnType": {
				"type": "simple",
				"value": "float"
			},
			"tags": ["data"],
			"uid": "6kmKjU"
		}, {
			"type": "output",
			"name": "boolean",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"id": "STATE",
				"type": "static-select",
				"options": [{
					"label": "True",
					"value": "true"
				}, {
					"label": "False",
					"value": "false"
				}]
			}],
			"code": "{STATE}",
			"returnType": {
				"type": "simple",
				"value": "bool"
			},
			"tags": ["data"],
			"uid": "nllNTV"
		}, {
			"type": "output",
			"name": "highLow",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"id": "STATE",
				"type": "static-select",
				"options": [{
					"label": "HIGH",
					"value": "HIGH"
				}, {
					"label": "LOW",
					"value": "LOW"
				}]
			}],
			"code": "{STATE}",
			"returnType": {
				"type": "simple",
				"value": "int"
			},
			"tags": ["data"],
			"uid": "UgUd3U"
		}, {
			"type": "output",
			"name": "dataFormat",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"id": "FORMAT",
				"type": "static-select",
				"options": [{
					"label": "二进制",
					"value": "BIN"
				}, {
					"label": "八进制",
					"value": "OCT"
				}, {
					"label": "十进制",
					"value": "DEC"
				}, {
					"label": "十六进制",
					"value": "HEX"
				}]
			}],
			"code": "{FORMAT}",
			"returnType": {
				"type": "simple",
				"value": "int"
			},
			"tags": ["data"],
			"uid": "WkMlbG"
		}, {
			"type": "output",
			"name": "string",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "\""
			}, {
				"id": "TEXT",
				"type": "string-input",
				"placeholder": "文本"
			}, {
				"type": "text",
				"value": "\""
			}],
			"code": "\"{TEXT}\"",
			"returnType": {
				"type": "simple",
				"value": "String"
			},
			"tags": ["data"],
			"uid": "kp7kKD"
		}, {
			"type": "output",
			"name": "rawInput",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"id": "VALUE",
				"type": "string-input",
				"placeholder": "内容"
			}],
			"code": "{VALUE}",
			"returnType": {
				"type": "rawInput",
				"id": "VALUE"
			},
			"tags": ["data"],
			"uid": "Qw6JBY"
		}, {
			"type": "output",
			"name": "stringArray",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "大小为"
			}, {
				"id": "VALUE",
				"type": "number-input",
				"value": 3
			}, {
				"type": "text",
				"value": "的文本数组"
			}],
			"code": "(String *)malloc({VALUE}*sizeof(String))",
			"returnType": {
				"type": "simple",
				"value": "String *"
			},
			"tags": ["data"],
			"uid": "AXBfge"
		}, {
			"type": "output",
			"name": "length",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "String",
				"name": "DmY3cY"
			}],
			"content": [{
				"type": "text",
				"value": "文本长度"
			}, {
				"blockInputId": "TEXT",
				"type": "block-input",
				"acceptType": "String",
				"name": "DmY3cY"
			}],
			"code": "{TEXT}.length()",
			"returnType": {
				"type": "simple",
				"value": "float"
			},
			"tags": ["data"],
			"uid": "zWVg0E"
		}, {
			"type": "output",
			"name": "stringCreate",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "tIQZ0R"
			}],
			"content": [{
				"type": "text",
				"value": "创建一个文本"
			}, {
				"blockInputId": "TEXT",
				"type": "block-input",
				"acceptType": "all",
				"name": "tIQZ0R"
			}],
			"code": "String({TEXT})",
			"returnType": {
				"type": "simple",
				"value": "String"
			},
			"tags": ["data"],
			"uid": "1ZtonP"
		}, {
			"type": "output",
			"name": "boolArray",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "大小为"
			}, {
				"id": "VALUE",
				"type": "number-input",
				"value": 0
			}, {
				"type": "text",
				"value": "的布尔数组"
			}],
			"code": "(bool *)malloc({VALUE}*sizeof(bool))",
			"returnType": {
				"type": "simple",
				"value": "bool *"
			},
			"tags": ["data"],
			"uid": "KiTI7b"
		}, {
			"type": "output",
			"name": "stringSum",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "String",
				"name": "nkbOkw"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "String",
				"name": "4kdQw8"
			}],
			"content": [{
				"type": "text",
				"value": "拼接"
			}, {
				"blockInputId": "ARG1",
				"type": "block-input",
				"acceptType": "String",
				"name": "nkbOkw"
			}, {
				"type": "text",
				"value": "和"
			}, {
				"blockInputId": "ARG2",
				"type": "block-input",
				"acceptType": "String",
				"name": "4kdQw8"
			}],
			"code": "String({ARG1})+String({ARG2})",
			"returnType": {
				"type": "simple",
				"value": "String"
			},
			"tags": ["data"],
			"uid": "9sXabi"
		}, {
			"type": "output",
			"name": "numberArray",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "大小为"
			}, {
				"id": "VALUE",
				"type": "number-input",
				"value": 3
			}, {
				"type": "text",
				"value": "的浮点数数组"
			}],
			"code": "(float*)malloc({VALUE}*sizeof(float))",
			"returnType": {
				"type": "simple",
				"value": "float *"
			},
			"tags": ["data"],
			"uid": "HishdZ"
		}, {
			"type": "output",
			"name": "numberArrayAdvanced",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "mjLjIp"
			}],
			"content": [{
				"type": "text",
				"value": "数组，大小:"
			}, {
				"blockInputId": "VALUE",
				"type": "block-input",
				"acceptType": "all",
				"name": "mjLjIp"
			}, {
				"type": "text",
				"value": "类型:"
			}, {
				"id": "TYPE",
				"type": "static-select",
				"options": [{
					"label": "浮点数",
					"value": "float *",
					"type": "float *"
				}, {
					"label": "整数",
					"value": "int *",
					"type": "int *"
				}]
			}],
			"code": "({TYPE})malloc({VALUE}*sizeof({TYPE.withoutAsterisk}))",
			"returnType": {
				"type": "fromSelect",
				"id": "TYPE"
			},
			"tags": ["data", "advanced"],
			"uid": "QEMney"
		}, {
			"type": "output",
			"name": "char",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "'"
			}, {
				"id": "VALUE",
				"type": "char-input",
				"placeholder": "字符"
			}, {
				"type": "text",
				"value": "'"
			}],
			"code": "'{VALUE}'",
			"returnType": {
				"type": "simple",
				"value": "char"
			},
			"tags": ["data"],
			"uid": "iltYPk"
		}, {
			"type": "output",
			"name": "stringArrayAdvanced",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "pYYLrj"
			}],
			"content": [{
				"type": "text",
				"value": "数组，大小:"
			}, {
				"blockInputId": "VALUE",
				"type": "block-input",
				"acceptType": "all",
				"name": "pYYLrj"
			}, {
				"type": "text",
				"value": "类型:"
			}, {
				"id": "TYPE",
				"type": "static-select",
				"options": [{
					"label": "文本",
					"value": "String *",
					"type": "String *"
				}, {
					"label": "字符",
					"value": "char *",
					"type": "char *"
				}]
			}],
			"code": "({TYPE})malloc({VALUE}*sizeof({TYPE.withoutAsterisk}))",
			"returnType": {
				"type": "fromSelect",
				"id": "TYPE"
			},
			"tags": ["data", "advanced"],
			"uid": "vQnRye"
		}, {
			"type": "statement",
			"name": "declareVariable",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "lTv4pX"
			}],
			"content": [{
				"type": "text",
				"value": "定义变量"
			}, {
				"id": "NAME",
				"type": "var-input",
				"value": ""
			}, {
				"type": "text",
				"value": "="
			}, {
				"blockInputId": "VALUE",
				"type": "block-input",
				"acceptType": "all",
				"name": "lTv4pX"
			}],
			"returnType": {
				"type": "fromInput",
				"blockInputId": "VALUE"
			},
			"createDynamicContent": "vars",
			"code": "{VALUE.connectionType} {NAME} = {VALUE};",
			"tags": ["variable"],
			"uid": "UUlc76"
		}, {
			"type": "output",
			"name": "selectVariable",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "变量"
			}, {
				"id": "VAR",
				"type": "dynamic-select",
				"options": "vars"
			}],
			"code": "{VAR}",
			"returnType": {
				"type": "fromDynamicSelect",
				"id": "VAR",
				"options": "vars"
			},
			"tags": ["variable"],
			"uid": "eY9sHc"
		}, {
			"type": "statement",
			"name": "setVariable",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "3heG3z"
			}],
			"content": [{
				"type": "text",
				"value": "变量"
			}, {
				"id": "NAME",
				"type": "dynamic-select",
				"options": "vars"
			}, {
				"type": "text",
				"value": "="
			}, {
				"blockInputId": "VALUE",
				"type": "block-input",
				"acceptType": {
					"type": "fromDynamicSelect",
					"id": "NAME",
					"options": "vars"
				},
				"name": "3heG3z"
			}],
			"code": "{NAME} = {VALUE};",
			"tags": ["variable"],
			"uid": "R5KH9G"
		}, {
			"type": "statement",
			"name": "createArray",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "定义变量"
			}, {
				"id": "NAME",
				"type": "string-input"
			}, {
				"type": "text",
				"value": "为从字符串"
			}, {
				"id": "VALUE",
				"type": "string-input",
				"placeholder": "内容"
			}, {
				"type": "text",
				"value": "创建的"
			}, {
				"id": "TYPE",
				"type": "static-select",
				"options": [{
					"label": "整数",
					"value": "int"
				}, {
					"label": "浮点数",
					"value": "float"
				}, {
					"label": "字符",
					"value": "char"
				}, {
					"label": "uint8_t",
					"value": "uint8_t"
				}, {
					"label": "uint16_t",
					"value": "uint16_t"
				}, {
					"label": "uint32_t",
					"value": "uint32_t"
				}]
			}, {
				"type": "text",
				"value": "数组"
			}],
			"code": "{TYPE} {NAME}[] = {{VALUE}};",
			"tags": ["variable"],
			"uid": "5riNPJ"
		}, {
			"type": "statement",
			"name": "createArrayAdvanced",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "E9YCZZ"
			}],
			"content": [{
				"type": "text",
				"value": "定义变量"
			}, {
				"id": "NAME",
				"type": "string-input"
			}, {
				"type": "text",
				"value": "为从字符串"
			}, {
				"id": "VALUE",
				"type": "string-input",
				"placeholder": "内容"
			}, {
				"type": "text",
				"value": "创建的"
			}, {
				"blockInputId": "TYPE",
				"type": "block-input",
				"acceptType": "all",
				"name": "E9YCZZ",
				"value": {
					"content": [{
						"id": "VALUE",
						"type": "string-input",
						"value": "unsigned char*"
					}],
					"name": "rawInput"
				}
			}, {
				"type": "text",
				"value": "数组"
			}],
			"code": "{TYPE} {NAME}[] = {{VALUE}};",
			"tags": ["variable", "advanced"],
			"uid": "HnJfIt"
		}, {
			"type": "output",
			"name": "arrayVariable",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "变量"
			}, {
				"id": "VAR",
				"type": "dynamic-select",
				"options": "vars"
			}, {
				"type": "text",
				"value": "["
			}, {
				"id": "POSITION",
				"type": "number-input",
				"value": 0
			}, {
				"type": "text",
				"value": "]"
			}],
			"code": "{VAR}[{POSITION}]",
			"returnType": {
				"type": "fromDynamicSelect",
				"id": "VAR",
				"pointer": true,
				"options": "vars"
			},
			"tags": ["variable"],
			"uid": "Wp89X0"
		}, {
			"type": "statement",
			"name": "setArrayVariable",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "mWxqPh"
			}],
			"content": [{
				"type": "text",
				"value": "变量"
			}, {
				"id": "NAME",
				"type": "dynamic-select",
				"options": "vars"
			}, {
				"type": "text",
				"value": "["
			}, {
				"id": "ITERATOR",
				"type": "number-input",
				"value": 0
			}, {
				"type": "text",
				"value": "]"
			}, {
				"type": "text",
				"value": "="
			}, {
				"blockInputId": "VALUE",
				"type": "block-input",
				"acceptType": "all",
				"name": "mWxqPh"
			}],
			"code": "{NAME}[{ITERATOR}] = {VALUE};",
			"tags": ["variable"],
			"uid": "NCcGrH"
		}, {
			"type": "output",
			"name": "arrayVariableAdvanced",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "7Fu0OD"
			}],
			"content": [{
				"type": "text",
				"value": "变量"
			}, {
				"id": "VAR",
				"type": "dynamic-select",
				"options": "vars"
			}, {
				"type": "text",
				"value": "["
			}, {
				"blockInputId": "POSITION",
				"type": "block-input",
				"acceptType": "all",
				"name": "7Fu0OD"
			}, {
				"type": "text",
				"value": "]"
			}],
			"code": "{VAR}[{POSITION}]",
			"returnType": {
				"type": "fromDynamicSelect",
				"id": "VAR",
				"pointer": true,
				"options": "vars"
			},
			"tags": ["variable", "advanced"],
			"uid": "EYPRz3"
		}, {
			"type": "statement",
			"name": "setArrayVariableAdvanced",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "LFEXe6"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "BppPJp"
			}],
			"content": [{
				"type": "text",
				"value": "变量"
			}, {
				"id": "NAME",
				"type": "dynamic-select",
				"options": "vars"
			}, {
				"type": "text",
				"value": "["
			}, {
				"blockInputId": "ITERATOR",
				"type": "block-input",
				"acceptType": "all",
				"name": "LFEXe6"
			}, {
				"type": "text",
				"value": "]"
			}, {
				"type": "text",
				"value": "="
			}, {
				"blockInputId": "VALUE",
				"type": "block-input",
				"acceptType": "all",
				"name": "BppPJp"
			}],
			"code": "{NAME}[{ITERATOR}] = {VALUE};",
			"tags": ["variable", "advanced"],
			"uid": "V73XC2"
		}, {
			"type": "statement",
			"name": "declareVariableAdvanced",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "FfAMeF"
			}],
			"content": [{
				"type": "text",
				"value": "定义变量"
			}, {
				"id": "NAME",
				"type": "var-input",
				"value": ""
			}, {
				"type": "text",
				"value": "为类型"
			}, {
				"id": "TYPE",
				"type": "static-select",
				"options": [{
					"label": "整数",
					"value": "int",
					"type": "int"
				}, {
					"label": "浮点数",
					"value": "float",
					"type": "float"
				}, {
					"label": "文本",
					"value": "String",
					"type": "String"
				}, {
					"label": "字符",
					"value": "char",
					"type": "char"
				}, {
					"label": "布尔",
					"value": "bool",
					"type": "bool"
				}, {
					"label": "uint8_t",
					"value": "uint8_t",
					"type": "uint8_t"
				}, {
					"label": "uint16_t",
					"value": "uint16_t",
					"type": "uint16_t"
				}, {
					"label": "uint32_t",
					"value": "uint32_t",
					"type": "uint32_t"
				}]
			}, {
				"type": "text",
				"value": "="
			}, {
				"blockInputId": "VALUE",
				"type": "block-input",
				"acceptType": "all",
				"name": "FfAMeF"
			}],
			"returnType": {
				"type": "fromSelect",
				"id": "TYPE"
			},
			"createDynamicContent": "vars",
			"code": "{TYPE} {NAME} = {VALUE};",
			"tags": ["variable", "advanced"],
			"uid": "CNa5uK"
		}, {
			"type": "statement-input",
			"name": "voidFunction",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "定义函数"
			}, {
				"id": "FUNCNAME",
				"type": "var-input",
				"placeholder": "名字"
			}],
			"createDynamicContent": "voidFunctions",
			"returnType": {
				"type": "simple",
				"value": "void"
			},
			"code": "void {FUNCNAME}(){\n{STATEMENTS}\n}",
			"tags": ["function"],
			"uid": "lZ0xnG"
		}, {
			"type": "statement",
			"name": "invokeFunction",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "调用函数"
			}, {
				"id": "FUNCTION",
				"type": "dynamic-select",
				"options": "voidFunctions"
			}],
			"code": "{FUNCTION}();",
			"tags": ["function"],
			"uid": "bnrwD0"
		}, {
			"type": "statement-input",
			"name": "returnFunction",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "0pHzep"
			}],
			"content": [{
				"type": "text",
				"value": "定义函数"
			}, {
				"id": "FUNCNAME",
				"type": "var-input",
				"placeholder": "名字"
			}, {
				"extra": true,
				"type": "text",
				"value": "返回"
			}, {
				"extra": true,
				"blockInputId": "RETURN",
				"type": "block-input",
				"acceptType": "all",
				"name": "0pHzep"
			}],
			"createDynamicContent": "returnFunctions",
			"returnType": {
				"type": "fromInput",
				"blockInputId": "RETURN"
			},
			"code": "{RETURN.connectionType} {FUNCNAME}() {\n{STATEMENTS}\nreturn {RETURN};\n}",
			"tags": ["function"],
			"uid": "ZWKexM"
		}, {
			"type": "output",
			"name": "invokeReturnFunction",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "调用函数"
			}, {
				"id": "FUNCTION",
				"type": "dynamic-select",
				"options": "returnFunctions"
			}],
			"code": "{FUNCTION}()",
			"returnType": {
				"type": "fromDynamicSelect",
				"id": "FUNCTION",
				"options": "returnFunctions"
			},
			"tags": ["function"],
			"uid": "t34utI"
		}, {
			"type": "statement-input",
			"name": "voidFunctionWithArguments",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "XKzcFz"
			}],
			"content": [{
				"type": "text",
				"value": "定义函数"
			}, {
				"id": "FUNCNAME",
				"type": "var-input",
				"placeholder": "名字"
			}, {
				"type": "text",
				"value": "并带这些参数:"
			}, {
				"blockInputId": "ARGS",
				"type": "block-input",
				"acceptType": "all",
				"name": "XKzcFz"
			}],
			"createDynamicContent": "voidFunctions",
			"returnType": {
				"type": "simple",
				"value": "void"
			},
			"arguments": {
				"type": "fromInput",
				"blockInputId": "ARGS"
			},
			"code": "void {FUNCNAME} ({ARGS}){\n{STATEMENTS}\n}",
			"tags": ["function", "advanced"],
			"uid": "JsiS6Y"
		}, {
			"type": "statement",
			"name": "invokeFunctionWithArguments",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "zwFm5B"
			}],
			"content": [{
				"type": "text",
				"value": "调用函数"
			}, {
				"id": "FUNCTION",
				"type": "dynamic-select",
				"options": "voidFunctions"
			}, {
				"type": "text",
				"value": "用这些参数:"
			}, {
				"blockInputId": "ARGS",
				"type": "block-input",
				"acceptType": "all",
				"name": "zwFm5B"
			}],
			"code": "{FUNCTION}({ARGS});",
			"tags": ["function", "advanced"],
			"uid": "spCTvj"
		}, {
			"type": "statement-input",
			"name": "returnFunctionWithArguments",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "zHAqkO"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "S8Mu9l"
			}],
			"content": [{
				"type": "text",
				"value": "定义函数"
			}, {
				"id": "FUNCNAME",
				"type": "var-input",
				"placeholder": "名字"
			}, {
				"type": "text",
				"value": "并带这些参数:"
			}, {
				"blockInputId": "ARGS",
				"type": "block-input",
				"acceptType": "all",
				"name": "zHAqkO"
			}, {
				"extra": true,
				"type": "text",
				"value": "返回"
			}, {
				"extra": true,
				"blockInputId": "RETURN",
				"type": "block-input",
				"acceptType": "all",
				"name": "S8Mu9l"
			}],
			"createDynamicContent": "returnFunctions",
			"returnType": {
				"type": "fromInput",
				"blockInputId": "RETURN"
			},
			"arguments": {
				"type": "fromInput",
				"blockInputId": "ARGS"
			},
			"code": "{RETURN.connectionType} {FUNCNAME} ({ARGS}) {\n{STATEMENTS}\nreturn {RETURN};\n}",
			"tags": ["function", "advanced"],
			"uid": "iagCN1"
		}, {
			"type": "output",
			"name": "invokeReturnFunctionWithArguments",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "vHCPW5"
			}],
			"content": [{
				"type": "text",
				"value": "调用函数"
			}, {
				"id": "FUNCTION",
				"type": "dynamic-select",
				"options": "returnFunctions"
			}, {
				"type": "text",
				"value": "用这些参数:"
			}, {
				"blockInputId": "ARGS",
				"type": "block-input",
				"acceptType": "all",
				"name": "vHCPW5"
			}],
			"code": "{FUNCTION}({ARGS})",
			"returnType": {
				"type": "fromDynamicSelect",
				"id": "FUNCTION",
				"options": "returnFunctions"
			},
			"tags": ["function", "advanced"],
			"uid": "E2jsga"
		}, {
			"type": "output",
			"name": "argument",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "变量"
			}, {
				"id": "TYPE",
				"type": "static-select",
				"options": [{
					"label": "整数",
					"value": "int"
				}, {
					"label": "浮点数",
					"value": "float"
				}, {
					"label": "文本",
					"value": "String"
				}, {
					"label": "字符",
					"value": "char"
				}, {
					"label": "布尔",
					"value": "bool"
				}]
			}, {
				"id": "VARNAME",
				"type": "var-input",
				"value": ""
			}],
			"createDynamicContent": "vars",
			"code": "{TYPE} {VARNAME}",
			"returnType": {
				"type": "fromSelect",
				"id": "TYPE",
				"options": "vars"
			},
			"tags": ["function", "advanced"],
			"uid": "5Ev42F"
		}, {
			"type": "output",
			"name": "arguments",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "IHkVh9"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "W3BCw8"
			}],
			"content": [{
				"blockInputId": "ARG1",
				"type": "block-input",
				"acceptType": "all",
				"name": "IHkVh9"
			}, {
				"type": "text",
				"value": ","
			}, {
				"blockInputId": "ARG2",
				"type": "block-input",
				"acceptType": "all",
				"name": "W3BCw8"
			}],
			"createDynamicContent": "vars",
			"code": "{ARG1},{ARG2}",
			"returnType": {
				"type": "simple",
				"value": "var"
			},
			"tags": ["function", "advanced"],
			"uid": "IWkSja"
		}, {
			"type": "statement",
			"name": "return",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "i7RIin"
			}],
			"content": [{
				"type": "text",
				"value": "返回"
			}, {
				"blockInputId": "RETURN",
				"type": "block-input",
				"acceptType": "all",
				"name": "i7RIin"
			}],
			"code": "return {RETURN};",
			"tags": ["function", "advanced"],
			"uid": "fkkekW"
		}, {
			"type": "statement-input",
			"name": "if",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "OI44Ub"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "jLrfjv"
			}],
			"content": [{
				"type": "text",
				"value": "如果"
			}, {
				"blockInputId": "ARG1",
				"type": "block-input",
				"acceptType": "all",
				"name": "OI44Ub"
			}, {
				"id": "OPERATOR",
				"type": "static-select",
				"options": [{
					"label": "=",
					"value": "=="
				}, {
					"label": "!=",
					"value": "!="
				}, {
					"label": ">",
					"value": ">"
				}, {
					"label": ">=",
					"value": ">="
				}, {
					"label": "<",
					"value": "<"
				}, {
					"label": "<=",
					"value": "<="
				}]
			}, {
				"blockInputId": "ARG2",
				"type": "block-input",
				"acceptType": "all",
				"name": "jLrfjv"
			}, {
				"type": "text",
				"value": "那么"
			}],
			"code": "if({ARG1} {OPERATOR} {ARG2}){\n{STATEMENTS}\n}",
			"tags": ["logic"],
			"uid": "heBaUa"
		}, {
			"type": "statement-input",
			"name": "elseif",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "2zRq0N"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "Tr9bYT"
			}],
			"content": [{
				"type": "text",
				"value": "否则如果"
			}, {
				"blockInputId": "ARG1",
				"type": "block-input",
				"acceptType": "all",
				"name": "2zRq0N"
			}, {
				"id": "OPERATOR",
				"type": "static-select",
				"options": [{
					"label": "=",
					"value": "=="
				}, {
					"label": "!=",
					"value": "!="
				}, {
					"label": ">",
					"value": ">"
				}, {
					"label": ">=",
					"value": ">="
				}, {
					"label": "<",
					"value": "<"
				}, {
					"label": "<=",
					"value": "<="
				}]
			}, {
				"blockInputId": "ARG2",
				"type": "block-input",
				"acceptType": "all",
				"name": "Tr9bYT"
			}, {
				"type": "text",
				"value": "那么"
			}],
			"code": "else if ({ARG1} {OPERATOR} {ARG2}){\n{STATEMENTS}\n}",
			"tags": ["logic"],
			"uid": "yaqR8I"
		}, {
			"type": "statement-input",
			"name": "else",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "否则，那么"
			}],
			"code": "else {\n{STATEMENTS}\n}",
			"tags": ["logic"],
			"uid": "ZfRdU7"
		}, {
			"type": "statement-input",
			"name": "switch",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "判断变量"
			}, {
				"id": "VAR",
				"type": "dynamic-select",
				"options": "vars"
			}, {
				"type": "text",
				"value": "的值为"
			}],
			"code": "switch (int({VAR})) {\n{STATEMENTS}\n}",
			"tags": ["logic"],
			"uid": "3zhrCA"
		}, {
			"type": "statement-input",
			"name": "for",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "计数循环变量"
			}, {
				"id": "VAR",
				"type": "dynamic-select",
				"options": "vars"
			}, {
				"type": "text",
				"value": "从"
			}, {
				"id": "INIT",
				"type": "number-input",
				"value": 0
			}, {
				"type": "text",
				"value": "到"
			}, {
				"id": "FINAL",
				"type": "number-input",
				"value": 10
			}, {
				"id": "MODE",
				"type": "static-select",
				"options": [{
					"label": "自增",
					"value": "+"
				}, {
					"label": "自减",
					"value": "-"
				}]
			}, {
				"id": "ADD",
				"type": "number-input",
				"value": 1
			}, {
				"type": "text",
				"value": "执行"
			}],
			"code": "'for({VAR}={INIT};{VAR}' + ('{MODE}' === '+'?'<=':'>=' ) + '{FINAL};{VAR}{MODE}={ADD}){\\n{STATEMENTS}\\n}'",
			"eval": true,
			"tags": ["logic"],
			"uid": "0ByIUU"
		}, {
			"type": "statement-input",
			"name": "forever",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "永远循环"
			}],
			"code": "for(;;) {\n{STATEMENTS}\n}",
			"tags": ["logic"],
			"uid": "EXxo6w"
		}, {
			"type": "statement-input",
			"name": "while",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "1FYyjA"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "TpgKyQ"
			}],
			"content": [{
				"type": "text",
				"value": "如果"
			}, {
				"blockInputId": "ARG1",
				"type": "block-input",
				"acceptType": "all",
				"name": "1FYyjA"
			}, {
				"id": "OPERATOR",
				"type": "static-select",
				"options": [{
					"label": "=",
					"value": "=="
				}, {
					"label": "!=",
					"value": "!="
				}, {
					"label": ">",
					"value": ">"
				}, {
					"label": ">=",
					"value": ">="
				}, {
					"label": "<",
					"value": "<"
				}, {
					"label": "<=",
					"value": "<="
				}]
			}, {
				"blockInputId": "ARG2",
				"type": "block-input",
				"acceptType": "all",
				"name": "TpgKyQ"
			}, {
				"type": "text",
				"value": "则一直循环执行"
			}],
			"code": "while ({ARG1} {OPERATOR} {ARG2}){\n{STATEMENTS}\n}",
			"tags": ["logic"],
			"uid": "5RidrE"
		}, {
			"type": "statement-input",
			"name": "case",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "如果变量值为"
			}, {
				"id": "VAR",
				"type": "number-input",
				"value": 0
			}, {
				"type": "text",
				"value": "那么"
			}],
			"code": "case {VAR}:{\n{STATEMENTS}\nbreak;\n}",
			"tags": ["logic"],
			"uid": "ff0qMf"
		}, {
			"type": "statement-input",
			"name": "caseDefault",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "如果都不是，那么"
			}],
			"code": "default:{\n{STATEMENTS}\nbreak;\n}",
			"tags": ["logic"],
			"uid": "vkklu3"
		}, {
			"type": "statement",
			"name": "continue",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "开始下一次循环"
			}],
			"code": "continue;",
			"tags": ["logic"],
			"uid": "CmAGXf"
		}, {
			"type": "statement",
			"name": "break",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "结束本轮循环"
			}],
			"code": "break;",
			"tags": ["logic"],
			"uid": "vbxsf7"
		}, {
			"type": "statement-input",
			"name": "ifAdvanced",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "zgnZL5"
			}],
			"content": [{
				"type": "text",
				"value": "如果"
			}, {
				"blockInputId": "CONDITION",
				"type": "block-input",
				"acceptType": "all",
				"name": "zgnZL5"
			}, {
				"type": "text",
				"value": "那么"
			}],
			"code": "if({CONDITION}){\n{STATEMENTS}\n}",
			"tags": ["logic", "advanced"],
			"uid": "LoJkxZ"
		}, {
			"type": "statement-input",
			"name": "elseifAdvanced",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "FH6cUn"
			}],
			"content": [{
				"type": "text",
				"value": "否则如果"
			}, {
				"blockInputId": "VAR",
				"type": "block-input",
				"acceptType": "all",
				"name": "FH6cUn"
			}, {
				"type": "text",
				"value": "那么"
			}],
			"code": "else if ({VAR}){\n{STATEMENTS}\n}",
			"tags": ["logic", "advanced"],
			"uid": "SB5Ph7"
		}, {
			"type": "statement-input",
			"name": "forAdvanced",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "9cShpo"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "NMURWf"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "2vdfRL"
			}],
			"content": [{
				"type": "text",
				"value": "计数循环变量"
			}, {
				"blockInputId": "VAR",
				"type": "block-input",
				"acceptType": "all",
				"name": "9cShpo"
			}, {
				"type": "text",
				"value": "从"
			}, {
				"blockInputId": "INIT",
				"type": "block-input",
				"acceptType": "all",
				"name": "NMURWf"
			}, {
				"type": "text",
				"value": "到"
			}, {
				"blockInputId": "FINAL",
				"type": "block-input",
				"acceptType": "all",
				"name": "2vdfRL"
			}, {
				"id": "MODE",
				"type": "static-select",
				"options": [{
					"label": "自增",
					"value": "+"
				}, {
					"label": "自减",
					"value": "-"
				}]
			}, {
				"id": "ADD",
				"type": "number-input",
				"value": 1
			}, {
				"type": "text",
				"value": "执行"
			}],
			"code": "'for({VAR}={INIT};{VAR}' + ('{MODE}' === '+'?'<=':'>=' ) + '{FINAL};{VAR}{MODE}={ADD}){\\n{STATEMENTS}\\n}'",
			"eval": true,
			"tags": ["logic", "advanced"],
			"uid": "0sHb8t"
		}, {
			"type": "statement-input",
			"name": "switchAdvanced",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "kyrV6g"
			}],
			"content": [{
				"type": "text",
				"value": "判断变量"
			}, {
				"blockInputId": "VAR",
				"type": "block-input",
				"acceptType": "all",
				"name": "kyrV6g"
			}],
			"code": "switch (int({VAR})) {\n{STATEMENTS}\n}",
			"tags": ["logic", "advanced"],
			"uid": "Mjse7L"
		}, {
			"type": "statement-input",
			"name": "whileAdvanced",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-root",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "Co2L2T"
			}],
			"content": [{
				"type": "text",
				"value": "如果"
			}, {
				"blockInputId": "CONDITION",
				"type": "block-input",
				"acceptType": "all",
				"name": "Co2L2T"
			}, {
				"type": "text",
				"value": "则一直循环执行"
			}],
			"code": "while ({CONDITION}){\n{STATEMENTS}\n}",
			"tags": ["logic", "advanced"],
			"uid": "3N9W0i"
		}, {
			"type": "output",
			"name": "not",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "Ii8UU4"
			}],
			"content": [{
				"type": "text",
				"value": "非"
			}, {
				"blockInputId": "CONDITION",
				"type": "block-input",
				"acceptType": "all",
				"name": "Ii8UU4"
			}],
			"code": "!{CONDITION}",
			"returnType": {
				"type": "simple",
				"value": "bool"
			},
			"tags": ["operation"],
			"uid": "PPCqQ0"
		}, {
			"type": "output",
			"name": "equalityOperations",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "ImBd30"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "hlOlws"
			}],
			"content": [{
				"blockInputId": "ARG1",
				"type": "block-input",
				"acceptType": "all",
				"name": "ImBd30"
			}, {
				"id": "OPERATOR",
				"type": "static-select",
				"options": [{
					"label": "=",
					"value": "=="
				}, {
					"label": "!=",
					"value": "!="
				}, {
					"label": ">",
					"value": ">"
				}, {
					"label": ">=",
					"value": ">="
				}, {
					"label": "<",
					"value": "<"
				}, {
					"label": "<=",
					"value": "<="
				}]
			}, {
				"blockInputId": "ARG2",
				"type": "block-input",
				"acceptType": "all",
				"name": "hlOlws"
			}],
			"code": "{ARG1} {OPERATOR} {ARG2}",
			"returnType": {
				"type": "simple",
				"value": "bool"
			},
			"tags": ["operation"],
			"uid": "W0ekQd"
		}, {
			"type": "output",
			"name": "logicOperations",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "9wgdRq"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "gEDZ41"
			}],
			"content": [{
				"blockInputId": "ARG1",
				"type": "block-input",
				"acceptType": "all",
				"name": "9wgdRq"
			}, {
				"id": "OPERATOR",
				"type": "static-select",
				"options": [{
					"label": "且",
					"value": "&&"
				}, {
					"label": "或",
					"value": "||"
				}]
			}, {
				"blockInputId": "ARG2",
				"type": "block-input",
				"acceptType": "all",
				"name": "gEDZ41"
			}],
			"code": "({ARG1}) {OPERATOR} ({ARG2})",
			"returnType": {
				"type": "simple",
				"value": "bool"
			},
			"tags": ["operation"],
			"uid": "pfjv98"
		}, {
			"type": "output",
			"name": "basicOperations",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "lDtRbp"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "lZGLaD"
			}],
			"content": [{
				"blockInputId": "ARG1",
				"type": "block-input",
				"acceptType": "all",
				"name": "lDtRbp"
			}, {
				"id": "OPERATOR",
				"type": "static-select",
				"options": [{
					"label": "+",
					"value": "+"
				}, {
					"label": "-",
					"value": "-"
				}, {
					"label": "x",
					"value": "*"
				}, {
					"label": "/",
					"value": "/"
				}, {
					"label": "^",
					"value": "^"
				}, {
					"label": "%",
					"value": "%"
				}]
			}, {
				"blockInputId": "ARG2",
				"type": "block-input",
				"acceptType": "all",
				"name": "lZGLaD"
			}],
			"code": "'{OPERATOR}' === '^'? 'pow({ARG1},{ARG2})' : '({ARG1} {OPERATOR} {ARG2})'",
			"eval": true,
			"returnType": {
				"type": "simple",
				"value": "float"
			},
			"tags": ["operation"],
			"uid": "E2DpR9"
		}, {
			"type": "output",
			"name": "map",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "GN92uZ"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "1Cxk4b"
			}],
			"content": [{
				"type": "text",
				"value": "把"
			}, {
				"blockInputId": "VAR",
				"type": "block-input",
				"acceptType": "all",
				"name": "GN92uZ"
			}, {
				"type": "text",
				"value": "从0-1023映射到[0-"
			}, {
				"blockInputId": "MAXVAL",
				"type": "block-input",
				"acceptType": "all",
				"name": "1Cxk4b"
			}, {
				"type": "text",
				"value": "]"
			}],
			"code": "map({VAR},0,1023,0,{MAXVAL})",
			"returnType": {
				"type": "simple",
				"value": "float"
			},
			"tags": ["operation"],
			"uid": "2qFcus"
		}, {
			"type": "statement",
			"name": "randomSeed",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "随机数种子初始化"
			}],
			"code": "randomSeed(micros());",
			"returnType": {
				"type": "simple",
				"value": "float"
			},
			"tags": ["operation"],
			"uid": "6XxLmC"
		}, {
			"type": "output",
			"name": "random",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "float",
				"name": "IatmVV"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "float",
				"name": "UcOJwd"
			}],
			"content": [{
				"type": "text",
				"value": "随机数从"
			}, {
				"blockInputId": "ARG1",
				"type": "block-input",
				"acceptType": "float",
				"name": "IatmVV"
			}, {
				"type": "text",
				"value": "到"
			}, {
				"blockInputId": "ARG2",
				"type": "block-input",
				"acceptType": "float",
				"name": "UcOJwd"
			}],
			"code": "random({ARG1},{ARG2}+1)",
			"returnType": {
				"type": "simple",
				"value": "float"
			},
			"tags": ["operation"],
			"uid": "Vc9dLY"
		}, {
			"type": "output",
			"name": "mathOperations",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "7PMBSm"
			}],
			"content": [{
				"id": "OPERATOR",
				"type": "static-select",
				"options": [{
					"label": "平方根",
					"value": "sqrt"
				}, {
					"label": "绝对值",
					"value": "abs"
				}, {
					"label": "ln",
					"value": "log"
				}, {
					"label": "log10",
					"value": "log10"
				}, {
					"label": "e^",
					"value": "exp"
				}]
			}, {
				"blockInputId": "ARG",
				"type": "block-input",
				"acceptType": "all",
				"name": "7PMBSm"
			}],
			"code": "{OPERATOR}({ARG})",
			"returnType": {
				"type": "simple",
				"value": "float"
			},
			"tags": ["operation"],
			"uid": "Wmd0Ua"
		}, {
			"type": "output",
			"name": "numConversion",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "doo9Sc"
			}],
			"content": [{
				"type": "text",
				"value": "把"
			}, {
				"blockInputId": "NUMBER",
				"type": "block-input",
				"acceptType": "all",
				"name": "doo9Sc"
			}, {
				"type": "text",
				"value": "转换为"
			}, {
				"id": "TYPE",
				"type": "static-select",
				"options": [{
					"label": "整数",
					"value": "int"
				}, {
					"label": "浮点数",
					"value": "float"
				}]
			}],
			"code": "({TYPE}) {NUMBER}",
			"returnType": {
				"type": "fromSelect",
				"id": "TYPE"
			},
			"tags": ["operation"],
			"uid": "uRiJr0"
		}, {
			"type": "output",
			"name": "mapAdvanced",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "CoyGcy"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "KmRZUx"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "jPtORE"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "t2wN4F"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "hcWS8R"
			}],
			"content": [{
				"type": "text",
				"value": "把"
			}, {
				"blockInputId": "VAR",
				"type": "block-input",
				"acceptType": "all",
				"name": "CoyGcy"
			}, {
				"type": "text",
				"value": "从 ["
			}, {
				"blockInputId": "INITMIN",
				"type": "block-input",
				"acceptType": "all",
				"name": "KmRZUx"
			}, {
				"type": "text",
				"value": "-"
			}, {
				"blockInputId": "INITMAX",
				"type": "block-input",
				"acceptType": "all",
				"name": "jPtORE"
			}, {
				"type": "text",
				"value": "]映射到["
			}, {
				"blockInputId": "FINMIN",
				"type": "block-input",
				"acceptType": "all",
				"name": "t2wN4F"
			}, {
				"type": "text",
				"value": "-"
			}, {
				"blockInputId": "FINMAX",
				"type": "block-input",
				"acceptType": "all",
				"name": "hcWS8R"
			}, {
				"type": "text",
				"value": "]"
			}],
			"code": "map({VAR},{INITMIN},{INITMAX},{FINMIN},{FINMAX})",
			"returnType": {
				"type": "simple",
				"value": "float"
			},
			"tags": ["operation", "advanced"],
			"uid": "SGhMsC"
		}, {
			"type": "statement",
			"name": "comment",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "注释 //"
			}, {
				"id": "COMMENT",
				"type": "comment-input",
				"placeholder": "输入你的注释"
			}],
			"code": "/*\n{COMMENT}\n*/",
			"tags": ["code"],
			"uid": "iKZF8b"
		}, {
			"type": "statement",
			"name": "code",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}],
			"content": [{
				"id": "CODE",
				"type": "code-input",
				"value": "",
				"placeholder": "输入你自己的代码"
			}],
			"code": "{CODE}\n",
			"tags": ["code"],
			"uid": "fRkMEy"
		}, {
			"type": "statement",
			"name": "wait",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}],
			"content": [{
				"type": "text",
				"value": "延时"
			}, {
				"id": "TIME",
				"type": "number-input",
				"value": 2000
			}, {
				"type": "text",
				"value": "毫秒"
			}],
			"code": "delay({TIME});",
			"tags": ["time"],
			"uid": "s5clkj"
		}, {
			"type": "output",
			"name": "millis",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"type": "text",
				"value": "获取执行到此刻的时间"
			}],
			"code": "millis()",
			"returnType": {
				"type": "simple",
				"value": "float"
			},
			"tags": ["time"],
			"uid": "M5LFrv"
		}, {
			"type": "statement",
			"name": "waitAdvanced",
			"connectors": [{
				"type": "connector-top",
				"accept": "connector-bottom"
			}, {
				"type": "connector-bottom",
				"accept": "connector-top"
			}, {
				"type": "connector-input",
				"accept": "connector-output",
				"acceptType": "all",
				"name": "elQYZ8"
			}],
			"content": [{
				"type": "text",
				"value": "延时"
			}, {
				"blockInputId": "TIME",
				"type": "block-input",
				"acceptType": "all",
				"name": "elQYZ8"
			}],
			"code": "delay({TIME});",
			"tags": ["time", "advanced"],
			"uid": "795c8s"
		}]
	};

	var builtInPackage = {
		"name": "Arduino",
		"company": "Arduino",
		"version": "0.5.5",
		"author": "Kenrobot",
		"category": "built-in",
		"help": "http://www.kenrobot.com/",
		"order": 0,
		"path": "..",
		"protocol": "",
		"logo": "assets/image/arduino.png",
		"boards": [{
			"label": "Arduino UNO",
			"name": "ArduinoUNO",
			"type": "uno",
			"build": {
				"fqbn": "arduino:avr:uno:cpu=atmega328p"
			},
			"upload": {
				"mcu": "atmega328p"
			},
			"tags": ["Arduino"],
			"pins": [{
				"uid": "PL8qqZ",
				"width": 10,
				"height": 10,
				"x": 0.438,
				"y": 0.05,
				"name": "GND-1",
				"value": "\"GND\"",
				"tags": ["GND"],
				"overlay": [0.5, -1.5],
				"label": "GND",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "VB05cG",
				"width": 10,
				"height": 10,
				"x": 0.471,
				"y": 0.046,
				"name": "13",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "13",
				"value": "13"
			}, {
				"uid": "7kNSUd",
				"width": 10,
				"height": 10,
				"x": 0.504,
				"y": 0.046,
				"name": "12",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "12",
				"value": "12"
			}, {
				"uid": "p0Yjne",
				"width": 10,
				"height": 10,
				"x": 0.537,
				"y": 0.046,
				"name": "11",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "11",
				"value": "11"
			}, {
				"uid": "q6rOYR",
				"width": 10,
				"height": 10,
				"x": 0.57,
				"y": 0.046,
				"name": "10",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "10",
				"value": "10"
			}, {
				"uid": "Z29m2f",
				"width": 10,
				"height": 10,
				"x": 0.603,
				"y": 0.046,
				"name": "9",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "9",
				"value": "9"
			}, {
				"uid": "8aVQDp",
				"width": 10,
				"height": 10,
				"x": 0.636,
				"y": 0.046,
				"name": "8",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "8",
				"value": "8"
			}, {
				"uid": "PnAa1t",
				"width": 10,
				"height": 10,
				"x": 0.695,
				"y": 0.046,
				"name": "7",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "7",
				"value": "7"
			}, {
				"uid": "xKpFzi",
				"width": 10,
				"height": 10,
				"x": 0.728,
				"y": 0.046,
				"name": "6",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "6",
				"value": "6"
			}, {
				"uid": "0gRT2X",
				"width": 10,
				"height": 10,
				"x": 0.761,
				"y": 0.046,
				"name": "5",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "5",
				"value": "5"
			}, {
				"uid": "q1DUJD",
				"width": 10,
				"height": 10,
				"x": 0.794,
				"y": 0.046,
				"name": "4",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "4",
				"value": "4"
			}, {
				"uid": "5XIyXm",
				"width": 10,
				"height": 10,
				"x": 0.827,
				"y": 0.046,
				"name": "3",
				"tags": ["digital", "analog-out", "init", "ir-send"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "3",
				"value": "3"
			}, {
				"uid": "Z9Y9P2",
				"width": 10,
				"height": 10,
				"x": 0.86,
				"y": 0.046,
				"name": "2",
				"tags": ["digital", "init"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "2",
				"value": "2"
			}, {
				"uid": "Zpi42g",
				"width": 10,
				"height": 10,
				"x": 0.893,
				"y": 0.046,
				"name": "1",
				"tags": ["digital", "serial-rx"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "1",
				"value": "1"
			}, {
				"uid": "Zpi42g",
				"width": 10,
				"height": 10,
				"x": 0.926,
				"y": 0.046,
				"name": "0",
				"tags": ["digital", "serial-tx"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "0",
				"value": "0"
			}, {
				"uid": "cYwRBD",
				"width": 10,
				"height": 10,
				"x": 0.557,
				"y": 0.95,
				"name": "VCC-1",
				"value": "\"VCC\"",
				"tags": ["VCC"],
				"overlay": [0.5, -1.5],
				"label": "VCC-3.3V",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "KbZble",
				"width": 10,
				"height": 10,
				"x": 0.59,
				"y": 0.95,
				"name": "VCC-2",
				"value": "\"VCC\"",
				"tags": ["VCC"],
				"overlay": [0.5, -1.5],
				"label": "VCC-5V",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "U0Z2S0",
				"width": 10,
				"height": 10,
				"x": 0.626,
				"y": 0.95,
				"name": "GND-2",
				"value": "\"GND\"",
				"tags": ["GND"],
				"overlay": [0.5, -1.5],
				"label": "GND",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "3IrLxh",
				"width": 10,
				"height": 10,
				"x": 0.659,
				"y": 0.95,
				"name": "GND-3",
				"value": "\"GND\"",
				"tags": ["GND"],
				"overlay": [0.5, -1.5],
				"label": "GND",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "1jcO2Y",
				"width": 10,
				"height": 10,
				"x": 0.763,
				"y": 0.95,
				"name": "A0",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A0",
				"value": "A0"
			}, {
				"uid": "qiTIRc",
				"width": 10,
				"height": 10,
				"x": 0.796,
				"y": 0.95,
				"name": "A1",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A1",
				"value": "A1"
			}, {
				"uid": "AihHpE",
				"width": 10,
				"height": 10,
				"x": 0.83,
				"y": 0.95,
				"name": "A2",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A2",
				"value": "A2"
			}, {
				"uid": "M4KhMo",
				"width": 10,
				"height": 10,
				"x": 0.863,
				"y": 0.95,
				"name": "A3",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A3",
				"value": "A3"
			}, {
				"uid": "PBQRkE",
				"width": 10,
				"height": 10,
				"x": 0.896,
				"y": 0.95,
				"name": "A4",
				"tags": ["analog-in", "sda"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A4",
				"value": "A4"
			}, {
				"uid": "rjJtrb",
				"width": 10,
				"height": 10,
				"x": 0.929,
				"y": 0.95,
				"name": "A5",
				"tags": ["analog-in", "scl"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A5",
				"value": "A5"
			}, {
				"width": 32,
				"height": 60,
				"x": 0.041,
				"y": 0.288,
				"name": "Serial",
				"tags": ["serial"],
				"uid": "q9OAeR",
				"overlay": [-1.3, 0.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "Serial",
				"value": "Serial"
			}],
			"uid": "8gEwUv",
			"imageUrl": "assets/image/boards/ArduinoUNO.svg",
			"width": 393,
			"height": 281
		}, {
			"label": "Arduino Leonardo",
			"name": "ArduinoLeonardo",
			"type": "leonardo",
			"build": {
				"fqbn": "arduino:avr:leonardo:cpu=atmega32u4"
			},
			"upload": {
				"mcu": "atmega32u4"
			},
			"tags": ["Arduino"],
			"pins": [{
				"uid": "evYegD",
				"width": 10,
				"height": 10,
				"x": 0.402,
				"y": 0.049,
				"name": "GND-1",
				"value": "\"GND\"",
				"tags": ["GND"],
				"overlay": [0.5, -1.5],
				"label": "GND",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "B54jYH",
				"width": 10,
				"height": 10,
				"x": 0.44,
				"y": 0.049,
				"name": "13",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "13",
				"value": "13"
			}, {
				"uid": "nPk3wi",
				"width": 10,
				"height": 10,
				"x": 0.475,
				"y": 0.049,
				"name": "12",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "12",
				"value": "12"
			}, {
				"uid": "5f8Iu5",
				"width": 10,
				"height": 10,
				"x": 0.509,
				"y": 0.049,
				"name": "11",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "11",
				"value": "11"
			}, {
				"uid": "mYZ8m1",
				"width": 10,
				"height": 10,
				"x": 0.547,
				"y": 0.049,
				"name": "10",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "10",
				"value": "10"
			}, {
				"uid": "R0NsXG",
				"width": 10,
				"height": 10,
				"x": 0.582,
				"y": 0.049,
				"name": "9",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "9",
				"value": "9"
			}, {
				"uid": "e8Cir0",
				"width": 10,
				"height": 10,
				"x": 0.617,
				"y": 0.049,
				"name": "8",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "8",
				"value": "8"
			}, {
				"uid": "c3BtK4",
				"width": 10,
				"height": 10,
				"x": 0.676,
				"y": 0.049,
				"name": "7",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "7",
				"value": "7"
			}, {
				"uid": "xGtGX9",
				"width": 10,
				"height": 10,
				"x": 0.71,
				"y": 0.049,
				"name": "6",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "6",
				"value": "6"
			}, {
				"uid": "q01tAI",
				"width": 10,
				"height": 10,
				"x": 0.745,
				"y": 0.049,
				"name": "5",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "5",
				"value": "5"
			}, {
				"uid": "VkPW5i",
				"width": 10,
				"height": 10,
				"x": 0.783,
				"y": 0.049,
				"name": "4",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "4",
				"value": "4"
			}, {
				"uid": "BDDbG4",
				"width": 10,
				"height": 10,
				"x": 0.818,
				"y": 0.049,
				"name": "3",
				"tags": ["digital", "analog-out", "init", "ir-send"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "3",
				"value": "3"
			}, {
				"uid": "ZHqDKX",
				"width": 10,
				"height": 10,
				"x": 0.853,
				"y": 0.049,
				"name": "2",
				"tags": ["digital", "init"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "2",
				"value": "2"
			}, {
				"uid": "HOxHq3",
				"width": 10,
				"height": 10,
				"x": 0.89,
				"y": 0.049,
				"name": "1",
				"tags": ["digital", "serial-rx", "init"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "1",
				"value": "1"
			}, {
				"uid": "lFZMVY",
				"width": 10,
				"height": 10,
				"x": 0.925,
				"y": 0.049,
				"name": "0",
				"tags": ["digital", "serial-tx", "init"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "0",
				"value": "0"
			}, {
				"uid": "hbHzLy",
				"width": 10,
				"height": 10,
				"x": 0.528,
				"y": 0.951,
				"name": "VCC-1",
				"value": "\"VCC\"",
				"tags": ["VCC"],
				"overlay": [0.5, -1.5],
				"label": "VCC-3.3V",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "wayAih",
				"width": 10,
				"height": 10,
				"x": 0.566,
				"y": 0.951,
				"name": "VCC-2",
				"value": "\"VCC\"",
				"tags": ["VCC"],
				"overlay": [0.5, -1.5],
				"label": "VCC-5V",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "afiVbe",
				"width": 10,
				"height": 10,
				"x": 0.601,
				"y": 0.951,
				"name": "GND-2",
				"value": "\"GND\"",
				"tags": ["GND"],
				"overlay": [0.5, -1.5],
				"label": "GND",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "Zc2T51",
				"width": 10,
				"height": 10,
				"x": 0.638,
				"y": 0.951,
				"name": "GND-3",
				"value": "\"GND\"",
				"tags": ["GND"],
				"overlay": [0.5, -1.5],
				"label": "GND",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "vrii22",
				"width": 10,
				"height": 10,
				"x": 0.743,
				"y": 0.951,
				"name": "A0",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A0",
				"value": "A0"
			}, {
				"uid": "BmWSfi",
				"width": 10,
				"height": 10,
				"x": 0.777,
				"y": 0.951,
				"name": "A1",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A1",
				"value": "A1"
			}, {
				"uid": "1XiZOV",
				"width": 10,
				"height": 10,
				"x": 0.812,
				"y": 0.951,
				"name": "A2",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A2",
				"value": "A2"
			}, {
				"uid": "1tGtL0",
				"width": 10,
				"height": 10,
				"x": 0.847,
				"y": 0.951,
				"name": "A3",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A3",
				"value": "A3"
			}, {
				"uid": "Z9hMY9",
				"width": 10,
				"height": 10,
				"x": 0.885,
				"y": 0.951,
				"name": "A4",
				"tags": ["analog-in", "sda"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A4",
				"value": "A4"
			}, {
				"uid": "JYrcfH",
				"width": 10,
				"height": 10,
				"x": 0.92,
				"y": 0.951,
				"name": "A5",
				"tags": ["analog-in", "scl"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A5",
				"value": "A5"
			}, {
				"width": 32,
				"height": 36,
				"x": 0.048,
				"y": 0.286,
				"name": "Serial",
				"tags": ["serial"],
				"uid": "lx6ESF",
				"overlay": [-1.3, 0.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "Serial",
				"value": "Serial"
			}],
			"uid": "LBgQBg",
			"imageUrl": "assets/image/boards/ArduinoLeonardo.svg",
			"width": 373,
			"height": 283
		}, {
			"label": "Arduino Nano",
			"name": "ArduinoNano",
			"type": "nano",
			"build": {
				"fqbn": "arduino:avr:nano:cpu=atmega328"
			},
			"upload": {
				"mcu": "atmega328"
			},
			"tags": ["Arduino"],
			"pins": [{
				"uid": "vhk6ph",
				"x": 0.122,
				"y": 0.078,
				"name": "12",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"label": "D12",
				"shape": "Dot",
				"radius": 4,
				"value": "12"
			}, {
				"uid": "LdyiLN",
				"x": 0.18,
				"y": 0.078,
				"name": "11",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"label": "11",
				"shape": "Dot",
				"radius": 4,
				"value": "D11"
			}, {
				"uid": "tBijHq",
				"x": 0.235,
				"y": 0.078,
				"name": "10",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"label": "D10",
				"shape": "Dot",
				"radius": 4,
				"value": "10"
			}, {
				"uid": "P2wXjz",
				"x": 0.294,
				"y": 0.078,
				"name": "9",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"label": "D9",
				"shape": "Dot",
				"radius": 4,
				"value": "9"
			}, {
				"uid": "dnChSr",
				"x": 0.349,
				"y": 0.078,
				"name": "8",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"label": "D8",
				"shape": "Dot",
				"radius": 4,
				"value": "8"
			}, {
				"uid": "C9nfQW",
				"x": 0.404,
				"y": 0.078,
				"name": "7",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"label": "D7",
				"shape": "Dot",
				"radius": 4,
				"value": "7"
			}, {
				"uid": "ogwXSx",
				"x": 0.463,
				"y": 0.078,
				"name": "6",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"label": "D6",
				"shape": "Dot",
				"radius": 4,
				"value": "6"
			}, {
				"uid": "zu6pty",
				"x": 0.518,
				"y": 0.078,
				"name": "5",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"label": "D5",
				"shape": "Dot",
				"radius": 4,
				"value": "5"
			}, {
				"uid": "M9woPq",
				"x": 0.576,
				"y": 0.078,
				"name": "4",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"label": "D4",
				"shape": "Dot",
				"radius": 4,
				"value": "4"
			}, {
				"uid": "rk36KI",
				"x": 0.631,
				"y": 0.078,
				"name": "3",
				"tags": ["digital", "analog-out", "init", "ir-send"],
				"overlay": [0.5, -1.5],
				"label": "D3",
				"shape": "Dot",
				"radius": 4,
				"value": "3"
			}, {
				"uid": "LXk68E",
				"x": 0.686,
				"y": 0.078,
				"name": "2",
				"tags": ["digital", "init"],
				"overlay": [0.5, -1.5],
				"label": "D2",
				"shape": "Dot",
				"radius": 4,
				"value": "2"
			}, {
				"uid": "bTY8Vo",
				"x": 0.741,
				"y": 0.069,
				"name": "GND-1",
				"value": "\"GND\"",
				"tags": ["GND"],
				"overlay": [0.5, -1.5],
				"label": "GND",
				"shape": "Dot",
				"radius": 5
			}, {
				"uid": "7E0kTK",
				"x": 0.855,
				"y": 0.078,
				"name": "1",
				"tags": ["digital", "serial-rx"],
				"overlay": [0.5, -1.5],
				"label": "RX0",
				"shape": "Dot",
				"radius": 4,
				"value": "1"
			}, {
				"uid": "Fb2du0",
				"x": 0.914,
				"y": 0.078,
				"name": "0",
				"tags": ["digital", "serial-tx"],
				"overlay": [0.5, -1.5],
				"label": "TX1",
				"shape": "Dot",
				"radius": 4,
				"value": "0"
			}, {
				"uid": "vSLvD4",
				"x": 0.122,
				"y": 0.922,
				"name": "13",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"label": "D13",
				"shape": "Dot",
				"radius": 4,
				"value": "13"
			}, {
				"uid": "JBQaT8",
				"x": 0.18,
				"y": 0.922,
				"name": "VCC-1",
				"value": "\"VCC\"",
				"tags": ["VCC"],
				"overlay": [0.5, -1.5],
				"label": "VCC-3.3V",
				"shape": "Dot",
				"radius": 5
			}, {
				"uid": "aRtN0J",
				"x": 0.29,
				"y": 0.922,
				"name": "A0",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"label": "A0",
				"shape": "Dot",
				"radius": 4,
				"value": "A0"
			}, {
				"uid": "pEcC8b",
				"x": 0.353,
				"y": 0.922,
				"name": "A1",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"label": "A1",
				"shape": "Dot",
				"radius": 4,
				"value": "A1"
			}, {
				"uid": "sWzXSN",
				"x": 0.404,
				"y": 0.922,
				"name": "A2",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"label": "A2",
				"shape": "Dot",
				"radius": 4,
				"value": "A2"
			}, {
				"uid": "kSujwm",
				"x": 0.463,
				"y": 0.922,
				"name": "A3",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"label": "A3",
				"shape": "Dot",
				"radius": 4,
				"value": "A3"
			}, {
				"uid": "KErlDM",
				"x": 0.518,
				"y": 0.922,
				"name": "A4",
				"tags": ["analog-in", "sda"],
				"overlay": [0.5, -1.5],
				"label": "A4",
				"shape": "Dot",
				"radius": 4,
				"value": "A4"
			}, {
				"uid": "Xuwemj",
				"x": 0.576,
				"y": 0.922,
				"name": "A5",
				"tags": ["analog-in", "scl"],
				"overlay": [0.5, -1.5],
				"label": "A5",
				"shape": "Dot",
				"radius": 4,
				"value": "A5"
			}, {
				"uid": "qZsHbG",
				"x": 0.631,
				"y": 0.922,
				"name": "A6",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"label": "A6",
				"shape": "Dot",
				"radius": 4,
				"value": "A6"
			}, {
				"uid": "Tbge4E",
				"x": 0.686,
				"y": 0.922,
				"name": "A7",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"label": "A7",
				"shape": "Dot",
				"radius": 4,
				"value": "A7"
			}, {
				"uid": "Jt8S64",
				"x": 0.745,
				"y": 0.922,
				"name": "VCC-2",
				"value": "\"VCC\"",
				"tags": ["VCC"],
				"overlay": [0.5, -1.5],
				"label": "VCC-5V",
				"shape": "Dot",
				"radius": 5
			}, {
				"uid": "8YKHsA",
				"x": 0.855,
				"y": 0.922,
				"name": "GND-2",
				"value": "\"GND\"",
				"tags": ["GND"],
				"overlay": [0.5, -1.5],
				"label": "GND",
				"shape": "Dot",
				"radius": 5
			}, {
				"width": 26,
				"height": 43,
				"x": 0.055,
				"y": 0.495,
				"name": "Serial",
				"tags": ["serial"],
				"uid": "O1ZIQG",
				"overlay": [-1.5, 0.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "Serial",
				"value": "Serial"
			}],
			"uid": "DqkZ3k",
			"imageUrl": "assets/image/boards/ArduinoNano.svg",
			"width": 255,
			"height": 102
		}, {
			"label": "Arduino/Genuino Mega or Mega 2560",
			"name": "ArduinoMega2560",
			"type": "mega",
			"build": {
				"fqbn": "arduino:avr:mega:cpu=atmega2560"
			},
			"upload": {
				"programer": "wiring",
				"mcu": "atmega2560"
			},
			"tags": ["Arduino"],
			"pins": [{
				"uid": "OT8b5M",
				"width": 10,
				"height": 10,
				"x": 0.303,
				"y": 0.049,
				"name": "GND-1",
				"value": "\"GND\"",
				"tags": ["GND"],
				"overlay": [0.5, -1.5],
				"label": "GND",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "zltfL6",
				"width": 10,
				"height": 10,
				"x": 0.325,
				"y": 0.049,
				"name": "13",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "13",
				"value": "13"
			}, {
				"uid": "PX77cb",
				"width": 10,
				"height": 10,
				"x": 0.35,
				"y": 0.049,
				"name": "12",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "12",
				"value": "12"
			}, {
				"uid": "ES49ZK",
				"width": 10,
				"height": 10,
				"x": 0.374,
				"y": 0.053,
				"name": "11",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "11",
				"value": "11"
			}, {
				"uid": "umtmQa",
				"width": 10,
				"height": 10,
				"x": 0.398,
				"y": 0.053,
				"name": "10",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "10",
				"value": "10"
			}, {
				"uid": "IHZZgD",
				"width": 10,
				"height": 10,
				"x": 0.423,
				"y": 0.053,
				"name": "9",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "9",
				"value": "9"
			}, {
				"uid": "BHgAPb",
				"width": 10,
				"height": 10,
				"x": 0.445,
				"y": 0.053,
				"name": "8",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "8",
				"value": "8"
			}, {
				"uid": "ToNIou",
				"width": 10,
				"height": 10,
				"x": 0.483,
				"y": 0.053,
				"name": "7",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "7",
				"value": "7"
			}, {
				"uid": "FP6QOQ",
				"width": 10,
				"height": 10,
				"x": 0.506,
				"y": 0.053,
				"name": "6",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "6",
				"value": "6"
			}, {
				"uid": "vwXyic",
				"width": 10,
				"height": 10,
				"x": 0.529,
				"y": 0.053,
				"name": "5",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "5",
				"value": "5"
			}, {
				"uid": "A7SHeA",
				"width": 10,
				"height": 10,
				"x": 0.553,
				"y": 0.053,
				"name": "4",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "4",
				"value": "4"
			}, {
				"uid": "B5E0GW",
				"width": 10,
				"height": 10,
				"x": 0.576,
				"y": 0.053,
				"name": "3",
				"tags": ["digital", "analog-out", "ir-send"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "3",
				"value": "3"
			}, {
				"uid": "LueaF8",
				"width": 10,
				"height": 10,
				"x": 0.6,
				"y": 0.053,
				"name": "2",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "2",
				"value": "2"
			}, {
				"uid": "PdMfXy",
				"width": 10,
				"height": 10,
				"x": 0.623,
				"y": 0.053,
				"name": "1",
				"tags": ["digital", "serial-rx"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "1",
				"value": "1",
				"extra": {
					"serial": "Serial"
				}
			}, {
				"uid": "qUfzo2",
				"width": 10,
				"height": 10,
				"x": 0.645,
				"y": 0.053,
				"name": "0",
				"tags": ["digital", "serial-tx"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "0",
				"value": "0",
				"extra": {
					"serial": "Serial"
				}
			}, {
				"uid": "UjYyq3",
				"width": 10,
				"height": 10,
				"x": 0.694,
				"y": 0.053,
				"name": "14",
				"tags": ["digital", "serial-rx"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "14",
				"value": "14",
				"extra": {
					"serial": "Serial3"
				}
			}, {
				"uid": "mCt2UL",
				"width": 10,
				"height": 10,
				"x": 0.717,
				"y": 0.053,
				"name": "15",
				"tags": ["digital", "serial-tx"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "15",
				"value": "15",
				"extra": {
					"serial": "Serial3"
				}
			}, {
				"uid": "cygRtE",
				"width": 10,
				"height": 10,
				"x": 0.741,
				"y": 0.053,
				"name": "16",
				"tags": ["digital", "serial-rx"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "16",
				"value": "16",
				"extra": {
					"serial": "Serial2"
				}
			}, {
				"uid": "qhvGEN",
				"width": 10,
				"height": 10,
				"x": 0.763,
				"y": 0.053,
				"name": "17",
				"tags": ["digital", "serial-tx"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "17",
				"value": "17",
				"extra": {
					"serial": "Serial2"
				}
			}, {
				"uid": "CGqTJF",
				"width": 10,
				"height": 10,
				"x": 0.788,
				"y": 0.053,
				"name": "18",
				"tags": ["digital", "serial-rx"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "18",
				"value": "18",
				"extra": {
					"serial": "Serial1"
				}
			}, {
				"uid": "8UAejv",
				"width": 10,
				"height": 10,
				"x": 0.812,
				"y": 0.053,
				"name": "19",
				"tags": ["digital", "serial-tx"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "19",
				"value": "19",
				"extra": {
					"serial": "Serial1"
				}
			}, {
				"uid": "YXsiaw",
				"width": 10,
				"height": 10,
				"x": 0.835,
				"y": 0.053,
				"name": "20",
				"tags": ["digital", "sda"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "20",
				"value": "20"
			}, {
				"uid": "yu32To",
				"width": 10,
				"height": 10,
				"x": 0.859,
				"y": 0.053,
				"name": "21",
				"tags": ["digital", "scl"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "21",
				"value": "21"
			}, {
				"uid": "mFTtpe",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.098,
				"name": "22",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "22",
				"value": "22"
			}, {
				"uid": "gSX6YX",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.098,
				"name": "23",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "23",
				"value": "23"
			}, {
				"uid": "QMwijS",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.144,
				"name": "24",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "24",
				"value": "24"
			}, {
				"uid": "ZoJjQS",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.144,
				"name": "25",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "25",
				"value": "25"
			}, {
				"uid": "eKaHpk",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.189,
				"name": "26",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "26",
				"value": "26"
			}, {
				"uid": "shanZf",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.189,
				"name": "27",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "27",
				"value": "27"
			}, {
				"uid": "odld69",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.235,
				"name": "28",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "28",
				"value": "28"
			}, {
				"uid": "s9vJIS",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.235,
				"name": "29",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "29",
				"value": "29"
			}, {
				"uid": "PuBuJU",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.284,
				"name": "30",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "30",
				"value": "30"
			}, {
				"uid": "d7MQ1w",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.284,
				"name": "31",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "31",
				"value": "31"
			}, {
				"uid": "0w6OgK",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.333,
				"name": "32",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "32",
				"value": "32"
			}, {
				"uid": "gl90dx",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.333,
				"name": "33",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "33",
				"value": "33"
			}, {
				"uid": "aHX91w",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.379,
				"name": "34",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "34",
				"value": "34"
			}, {
				"uid": "1z3eHr",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.379,
				"name": "35",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "35",
				"value": "35"
			}, {
				"uid": "eT0GsW",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.425,
				"name": "36",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "36",
				"value": "36"
			}, {
				"uid": "KQFBIy",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.425,
				"name": "37",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "37",
				"value": "37"
			}, {
				"uid": "1Wz6tZ",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.474,
				"name": "38",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "38",
				"value": "38"
			}, {
				"uid": "rQ2tVy",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.474,
				"name": "39",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "39",
				"value": "39"
			}, {
				"uid": "KE8oDx",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.526,
				"name": "40",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "40",
				"value": "40"
			}, {
				"uid": "nnYL5m",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.526,
				"name": "41",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "41",
				"value": "41"
			}, {
				"uid": "W21u0m",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.572,
				"name": "42",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "42",
				"value": "42"
			}, {
				"uid": "MnmkBw",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.572,
				"name": "43",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "43",
				"value": "43"
			}, {
				"uid": "Gkt7pT",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.621,
				"name": "44",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "44",
				"value": "44"
			}, {
				"uid": "xCg0YZ",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.621,
				"name": "45",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "45",
				"value": "45"
			}, {
				"uid": "YUI4wV",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.667,
				"name": "46",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "46",
				"value": "46"
			}, {
				"uid": "7WppFV",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.667,
				"name": "47",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "47",
				"value": "47"
			}, {
				"uid": "UNkxht",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.712,
				"name": "48",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "48",
				"value": "48"
			}, {
				"uid": "ofoBEn",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.712,
				"name": "49",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "49",
				"value": "49"
			}, {
				"uid": "u8PJKT",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.761,
				"name": "50",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "50",
				"value": "50"
			}, {
				"uid": "4TWFGZ",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.761,
				"name": "51",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "51",
				"value": "51"
			}, {
				"uid": "1WtoEH",
				"width": 10,
				"height": 10,
				"x": 0.93,
				"y": 0.811,
				"name": "52",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "52",
				"value": "52"
			}, {
				"uid": "GgBIYS",
				"width": 10,
				"height": 10,
				"x": 0.953,
				"y": 0.811,
				"name": "53",
				"tags": ["digital"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "53",
				"value": "53"
			}, {
				"uid": "Sol4gS",
				"width": 10,
				"height": 10,
				"x": 0.388,
				"y": 0.951,
				"name": "VCC-1",
				"value": "\"VCC\"",
				"tags": ["VCC"],
				"overlay": [0.5, -1.5],
				"label": "VCC-3.3V",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "s1AZZw",
				"width": 10,
				"height": 10,
				"x": 0.41,
				"y": 0.951,
				"name": "VCC-2",
				"value": "\"VCC\"",
				"tags": ["VCC"],
				"overlay": [0.5, -1.5],
				"label": "VCC-5V",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "ps5J8U",
				"width": 10,
				"height": 10,
				"x": 0.433,
				"y": 0.951,
				"name": "GND-2",
				"value": "\"GND\"",
				"tags": ["GND"],
				"overlay": [0.5, -1.5],
				"label": "GND",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "v1T5qy",
				"width": 10,
				"height": 10,
				"x": 0.457,
				"y": 0.951,
				"name": "GND-3",
				"value": "\"GND\"",
				"tags": ["GND"],
				"overlay": [0.5, -1.5],
				"label": "GND",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "1vaRff",
				"width": 10,
				"height": 10,
				"x": 0.529,
				"y": 0.954,
				"name": "A0",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A0",
				"value": "A0"
			}, {
				"uid": "azBHjw",
				"width": 10,
				"height": 10,
				"x": 0.551,
				"y": 0.954,
				"name": "A1",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A1",
				"value": "A1"
			}, {
				"uid": "Xn8uau",
				"width": 10,
				"height": 10,
				"x": 0.576,
				"y": 0.954,
				"name": "A2",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A2",
				"value": "A2"
			}, {
				"uid": "JPLu5C",
				"width": 10,
				"height": 10,
				"x": 0.6,
				"y": 0.954,
				"name": "A3",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A3",
				"value": "A3"
			}, {
				"uid": "oaNas1",
				"width": 10,
				"height": 10,
				"x": 0.623,
				"y": 0.954,
				"name": "A4",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A4",
				"value": "A4"
			}, {
				"uid": "RjJ6v7",
				"width": 10,
				"height": 10,
				"x": 0.645,
				"y": 0.954,
				"name": "A5",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A5",
				"value": "A5"
			}, {
				"uid": "JlxRXD",
				"width": 10,
				"height": 10,
				"x": 0.67,
				"y": 0.954,
				"name": "A6",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A6",
				"value": "A6"
			}, {
				"uid": "RazoQH",
				"width": 10,
				"height": 10,
				"x": 0.694,
				"y": 0.954,
				"name": "A7",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A7",
				"value": "A7"
			}, {
				"uid": "7O5jzl",
				"width": 10,
				"height": 10,
				"x": 0.741,
				"y": 0.954,
				"name": "A8",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A8",
				"value": "A8"
			}, {
				"uid": "3R0czm",
				"width": 10,
				"height": 10,
				"x": 0.763,
				"y": 0.954,
				"name": "A9",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A9",
				"value": "A9"
			}, {
				"uid": "yxqIg4",
				"width": 10,
				"height": 10,
				"x": 0.786,
				"y": 0.954,
				"name": "A10",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A10",
				"value": "A10"
			}, {
				"uid": "NUdu5m",
				"width": 10,
				"height": 10,
				"x": 0.81,
				"y": 0.954,
				"name": "A11",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A11",
				"value": "A11"
			}, {
				"uid": "vlpUPQ",
				"width": 10,
				"height": 10,
				"x": 0.835,
				"y": 0.954,
				"name": "A12",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A12",
				"value": "A12"
			}, {
				"uid": "MYgibP",
				"width": 10,
				"height": 10,
				"x": 0.857,
				"y": 0.954,
				"name": "A13",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A13",
				"value": "A13"
			}, {
				"uid": "jhn41S",
				"width": 10,
				"height": 10,
				"x": 0.882,
				"y": 0.954,
				"name": "A14",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A14",
				"value": "A14"
			}, {
				"uid": "xl0bCE",
				"width": 10,
				"height": 10,
				"x": 0.904,
				"y": 0.954,
				"name": "A15",
				"tags": ["analog-in"],
				"overlay": [0.5, -1.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "A15",
				"value": "A15"
			}, {
				"width": 34,
				"height": 62,
				"x": 0.03,
				"y": 0.288,
				"name": "Serial",
				"tags": ["serial"],
				"uid": "p5ee6l",
				"overlay": [-1.4, 0.5],
				"shape": "Rectangle",
				"rotate": false,
				"label": "Serial",
				"value": "Serial"
			}],
			"uid": "b6Y98i",
			"imageUrl": "assets/image/boards/ArduinoMega2560.svg",
			"width": 575,
			"height": 285
		}],
		"components": [{
			"uid": "VUrwFj",
			"name": "button",
			"label": "按键",
			"type": "button",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["digital"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"var": "int {NAME} = {s};",
				"setup": "pinMode({NAME}, INPUT);"
			},
			"raw": true,
			"blocks": [],
			"imageUrl": "assets/image/components/button.svg"
		}, {
			"uid": "jOXP4w",
			"name": "pot",
			"label": "电位器",
			"type": "pot",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["analog-in"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"var": "int {NAME} = {s};",
				"setup": "pinMode({NAME}, INPUT);"
			},
			"raw": true,
			"blocks": [],
			"imageUrl": "assets/image/components/pot.svg"
		}, {
			"uid": "L5MW3R",
			"name": "dht11",
			"label": "温湿度传感器(DHT11)",
			"type": "dht11",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["digital"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"include": "#include <DHT.h>",
				"var": "DHT {NAME}({s}, DHT11);",
				"setup": "{NAME}.begin();"
			},
			"blocks": [{
				"type": "output",
				"name": "dht11Temperature",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "读取"
				}, {
					"id": "SENSOR",
					"type": "dynamic-select",
					"options": "dht11s"
				}, {
					"type": "text",
					"value": "的"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "温度",
						"value": "readTemperature"
					}, {
						"label": "湿度",
						"value": "readHumidity"
					}]
				}],
				"code": "{SENSOR}.{OP}()",
				"returnType": {
					"type": "simple",
					"value": "float"
				},
				"tags": ["module"],
				"module": "dht11",
				"uid": "DhzpFn"
			}],
			"imageUrl": "assets/image/components/dht11.svg"
		}, {
			"uid": "11HXi6",
			"name": "dht22",
			"label": "温湿度传感器(DHT22)",
			"type": "dht22",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["digital"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"include": "#include <DHT.h>",
				"var": "DHT {NAME}({s}, DHT22);",
				"setup": "{NAME}.begin();"
			},
			"blocks": [{
				"type": "output",
				"name": "dht22Temperature",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "读取"
				}, {
					"id": "SENSOR",
					"type": "dynamic-select",
					"options": "dht22s"
				}, {
					"type": "text",
					"value": "的"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "温度",
						"value": "readTemperature"
					}, {
						"label": "湿度",
						"value": "readHumidity"
					}]
				}],
				"code": "{SENSOR}.{OP}()",
				"returnType": {
					"type": "simple",
					"value": "float"
				},
				"tags": ["module"],
				"module": "dht22",
				"uid": "NnuP9M"
			}],
			"imageUrl": "assets/image/components/dht22.svg"
		}, {
			"uid": "HRwNap",
			"name": "encoder",
			"label": "旋转编码器",
			"type": "encoder",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 90,
			"height": 90,
			"pins": [{
				"name": "k",
				"anchor": [0.25, 1],
				"tags": ["digital"],
				"label": "k",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "sa",
				"anchor": [0.5, 1],
				"tags": ["init"],
				"spec": ["name", "3"],
				"label": "sa",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "sb",
				"anchor": [0.75, 1],
				"tags": ["init"],
				"spec": ["name", "2"],
				"label": "sb",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"include": "#include <Encoder.h>",
				"var": "Encoder {NAME}({sa}, {sb});"
			},
			"blocks": [{
				"type": "output",
				"name": "encoderRead",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "读取旋转编码器"
				}, {
					"id": "SENSOR",
					"type": "dynamic-select",
					"options": "encoders"
				}, {
					"type": "text",
					"value": "的值"
				}],
				"code": "{SENSOR}.read()",
				"returnType": {
					"type": "simple",
					"value": "int"
				},
				"tags": ["module"],
				"module": "encoder",
				"uid": "1voV2T"
			}, {
				"type": "statement",
				"name": "encoderWrite",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "旋转编码器"
				}, {
					"id": "SENSOR",
					"type": "dynamic-select",
					"options": "encoders"
				}, {
					"type": "text",
					"value": "写入"
				}, {
					"type": "number-input",
					"id": "VALUE"
				}],
				"code": "{SENSOR}.write({VALUE});",
				"tags": ["module"],
				"module": "encoder",
				"uid": "bVEFNF"
			}, {
				"type": "statement",
				"name": "encoderWriteAdvanced",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "HpBKqq"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "aTPm3X"
				}],
				"content": [{
					"type": "text",
					"value": "旋转编码器"
				}, {
					"blockInputId": "ENCODER",
					"type": "block-input",
					"acceptType": "all",
					"name": "HpBKqq"
				}, {
					"type": "text",
					"value": "写入"
				}, {
					"blockInputId": "VALUE",
					"type": "block-input",
					"acceptType": "all",
					"name": "aTPm3X"
				}],
				"code": "{ENCODER}.write({VALUE});",
				"tags": ["module", "advanced"],
				"module": "encoder",
				"uid": "uQirVf"
			}],
			"imageUrl": "assets/image/components/encoder.svg"
		}, {
			"uid": "smMsxb",
			"name": "infraredSensor",
			"label": "光电对管",
			"type": "infraredSensor",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["digital", "analog-in"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"var": "int {NAME} = {s};",
				"setup": "pinMode({NAME}, INPUT);"
			},
			"raw": true,
			"blocks": [],
			"imageUrl": "assets/image/components/infraredSensor.svg"
		}, {
			"uid": "p4XQGM",
			"name": "lightSensor",
			"label": "光敏传感器",
			"type": "lightSensor",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["analog-in"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"var": "int {NAME} = {s};",
				"setup": "pinMode({NAME}, INPUT);"
			},
			"raw": true,
			"blocks": [],
			"imageUrl": "assets/image/components/lightSensor.svg"
		}, {
			"uid": "M1Rtcm",
			"name": "soundSensor",
			"label": "声音传感器",
			"type": "soundSensor",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["digital", "analog-in"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"var": "int {NAME} = {s};",
				"setup": "pinMode({NAME}, INPUT);"
			},
			"raw": true,
			"blocks": [],
			"imageUrl": "assets/image/components/soundSensor.svg"
		}, {
			"uid": "ZFBwUm",
			"name": "limitSwitch",
			"label": "碰撞传感器",
			"type": "limitSwitch",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["digital"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"var": "int {NAME} = {s};",
				"setup": "pinMode({NAME}, INPUT);"
			},
			"raw": true,
			"blocks": [],
			"imageUrl": "assets/image/components/limitSwitch.svg"
		}, {
			"uid": "Hkm7ip",
			"name": "touchSensor",
			"label": "触摸传感器",
			"type": "touchSensor",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["digital"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"var": "int {NAME} = {s};",
				"setup": "pinMode({NAME}, INPUT);"
			},
			"raw": true,
			"blocks": [],
			"imageUrl": "assets/image/components/touchSensor.svg"
		}, {
			"uid": "0bVzdu",
			"name": "ultrasound",
			"label": "超声波",
			"type": "ultrasound",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 90,
			"height": 90,
			"pins": [{
				"name": "tri",
				"anchor": [0.333, 1],
				"tags": ["digital"],
				"label": "tri",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "ech",
				"anchor": [0.667, 1],
				"tags": ["digital"],
				"label": "ech",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"include": "#include <SR04.h>",
				"var": "SR04 {NAME}({ech}, {tri});"
			},
			"blocks": [{
				"type": "output",
				"name": "ultrasoundDistance",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "超声波"
				}, {
					"id": "SENSOR",
					"type": "dynamic-select",
					"options": "ultrasounds"
				}, {
					"type": "text",
					"value": "测量距离"
				}],
				"code": "{SENSOR}.Distance()",
				"returnType": {
					"type": "simple",
					"value": "float"
				},
				"tags": ["module"],
				"module": "ultrasound",
				"uid": "Uuo6ia"
			}, {
				"type": "output",
				"name": "ultrasoundDistanceAvg",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "超声波"
				}, {
					"id": "SENSOR",
					"type": "dynamic-select",
					"options": "ultrasounds"
				}, {
					"type": "text",
					"value": "测量平均距离"
				}],
				"code": "{SENSOR}.DistanceAvg()",
				"returnType": {
					"type": "simple",
					"value": "float"
				},
				"tags": ["module", "advanced"],
				"module": "ultrasound",
				"uid": "KZOY8K"
			}, {
				"type": "statement",
				"name": "ultrasoundPing",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "超声波"
				}, {
					"id": "SENSOR",
					"type": "dynamic-select",
					"options": "ultrasounds"
				}, {
					"type": "text",
					"value": "Ping"
				}],
				"code": "{SENSOR}.Ping();",
				"tags": ["module", "advanced"],
				"module": "ultrasound",
				"uid": "8mCcky"
			}, {
				"type": "output",
				"name": "ultrasoundGetDistance",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "获取超声波"
				}, {
					"id": "SENSOR",
					"type": "dynamic-select",
					"options": "ultrasounds"
				}, {
					"type": "text",
					"value": "上次测量的距离"
				}],
				"code": "{SENSOR}.getDistance()",
				"returnType": {
					"type": "simple",
					"value": "float"
				},
				"tags": ["module", "advanced"],
				"module": "ultrasound",
				"uid": "KsZVo2"
			}],
			"imageUrl": "assets/image/components/ultrasound.svg"
		}, {
			"uid": "Upqst6",
			"name": "lm35",
			"label": "LM35温度传感器",
			"type": "lm35",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["analog-in"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"include": "#include <LM35.h>",
				"var": "LM35 {NAME}({s});"
			},
			"raw": true,
			"blocks": [{
				"type": "output",
				"name": "lm35Read",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "温度传感器"
				}, {
					"id": "SENSOR",
					"type": "dynamic-select",
					"options": "lm35s"
				}, {
					"type": "text",
					"value": "读取"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "摄氏",
						"value": "cel"
					}, {
						"label": "华氏",
						"value": "fah"
					}, {
						"label": "开尔文",
						"value": "kel"
					}]
				}, {
					"type": "text",
					"value": "温度"
				}],
				"code": "{SENSOR}.{OP}()",
				"returnType": {
					"type": "simple",
					"value": "float"
				},
				"tags": ["module"],
				"module": "lm35",
				"uid": "6IcaG6"
			}],
			"imageUrl": "assets/image/components/lm35.svg"
		}, {
			"uid": "Ecl6qj",
			"name": "pir",
			"label": "人体红外感知模块",
			"type": "pir",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["digital"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"var": "int {NAME} = {s};"
			},
			"blocks": [{
				"type": "output",
				"name": "pirRead",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "人体红外感知模块"
				}, {
					"id": "SENSOR",
					"type": "dynamic-select",
					"options": "pirs"
				}, {
					"type": "text",
					"value": "有信号"
				}],
				"code": "digitalRead({SENSOR})",
				"returnType": {
					"type": "simple",
					"value": "int"
				},
				"tags": ["module"],
				"module": "pir",
				"uid": "hnhNlI"
			}],
			"imageUrl": "assets/image/components/pir.svg"
		}, {
			"uid": "lcgpAz",
			"name": "irRecv",
			"label": "红外接收模块",
			"type": "irRecv",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["analog-out", "analog-in"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"include": "#include <IRremote.h>",
				"var": "IRrecv {NAME}({s});\ndecode_results {NAME}_results;",
				"setup": "{NAME}.enableIRIn();"
			},
			"blocks": [{
				"type": "output",
				"name": "irRecvAvailable",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "红外接收"
				}, {
					"id": "SENSOR",
					"type": "dynamic-select",
					"options": "irRecvs"
				}, {
					"type": "text",
					"value": "有信号"
				}],
				"code": "{SENSOR}.decode(&{SENSOR}_results)",
				"returnType": {
					"type": "simple",
					"value": "int"
				},
				"tags": ["module"],
				"module": "irRecv",
				"uid": "E7ytFC"
			}, {
				"type": "output",
				"name": "irRecvKey",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "红外接收"
				}, {
					"id": "SENSOR",
					"type": "dynamic-select",
					"options": "irRecvs"
				}, {
					"type": "text",
					"value": "按键值"
				}],
				"code": "{SENSOR}_results.value",
				"returnType": {
					"type": "simple",
					"value": "int"
				},
				"tags": ["module"],
				"module": "irRecv",
				"uid": "fdfBtm"
			}, {
				"type": "statement",
				"name": "irRecvResume",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "红外接收"
				}, {
					"id": "SENSOR",
					"type": "dynamic-select",
					"options": "irRecvs"
				}, {
					"type": "text",
					"value": "等待接收下一组信号"
				}],
				"code": "{SENSOR}.resume();",
				"tags": ["module"],
				"module": "irRecv",
				"uid": "gvmYRo"
			}],
			"imageUrl": "assets/image/components/irRecv.svg"
		}, {
			"uid": "qurwAO",
			"name": "soilHumidity",
			"label": "土壤湿度模块",
			"type": "soilHumidity",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 90,
			"height": 90,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 0],
				"tags": ["analog-in"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"var": "int {NAME} = {s};",
				"setup": "pinMode({NAME}, INPUT);"
			},
			"blocks": [{
				"type": "output",
				"name": "soilHumidityRead",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "读取土壤湿度模块"
				}, {
					"id": "SENSOR",
					"type": "dynamic-select",
					"options": "soilHumiditys"
				}, {
					"type": "text",
					"value": "的值"
				}],
				"code": "analogRead({SENSOR})",
				"returnType": {
					"type": "simple",
					"value": "int"
				},
				"tags": ["module"],
				"module": "soilHumidity",
				"uid": "15vrNF"
			}],
			"imageUrl": "assets/image/components/soilHumidity.svg"
		}, {
			"uid": "E2ZSBW",
			"name": "led",
			"label": "LED",
			"type": "led",
			"category": "action",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["digital"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"var": "int {NAME} = {s};",
				"setup": "pinMode({NAME}, OUTPUT);"
			},
			"raw": true,
			"blocks": [{
				"type": "statement",
				"name": "led",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"id": "STATE",
					"type": "static-select",
					"options": [{
						"label": "点亮",
						"value": "HIGH"
					}, {
						"label": "关闭",
						"value": "LOW"
					}]
				}, {
					"type": "text",
					"value": "LED"
				}, {
					"id": "LED",
					"type": "dynamic-select",
					"options": "leds"
				}],
				"code": "digitalWrite({LED},{STATE});",
				"tags": ["module"],
				"module": "led",
				"uid": "kAYJem"
			}, {
				"type": "statement",
				"name": "ledAdvanced",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "xSxDCC"
				}],
				"content": [{
					"id": "STATE",
					"type": "static-select",
					"options": [{
						"label": "点亮",
						"value": "HIGH"
					}, {
						"label": "关闭",
						"value": "LOW"
					}]
				}, {
					"type": "text",
					"value": "LED"
				}, {
					"blockInputId": "LED",
					"type": "block-input",
					"acceptType": "all",
					"name": "xSxDCC"
				}],
				"code": "digitalWrite({LED},{STATE});",
				"tags": ["module", "advanced"],
				"module": "led",
				"uid": "U7dzAq"
			}],
			"imageUrl": "assets/image/components/led.svg"
		}, {
			"uid": "SnHrBC",
			"name": "rgb",
			"label": "三色LED(共阴)",
			"type": "rgb",
			"category": "action",
			"boards": ["Arduino"],
			"width": 90,
			"height": 90,
			"pins": [{
				"name": "r",
				"anchor": [0.25, 1],
				"tags": ["analog-out", "any"],
				"label": "r",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "g",
				"anchor": [0.5, 1],
				"tags": ["analog-out", "any"],
				"label": "g",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "b",
				"anchor": [0.75, 1],
				"tags": ["analog-out", "any"],
				"label": "b",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"include": "#include <RGBLed.h>",
				"var": "RGBLed {NAME}({r}, {g}, {b});"
			},
			"blocks": [{
				"type": "statement",
				"name": "rgbLedSimple",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "点亮三色LED(共阴)"
				}, {
					"id": "LED",
					"type": "dynamic-select",
					"options": "rgbs"
				}, {
					"type": "text",
					"value": "设置为"
				}, {
					"id": "COLOR",
					"type": "static-select",
					"options": [{
						"label": "白色",
						"value": "255,255,255"
					}, {
						"label": "黄色",
						"value": "255,255,0"
					}, {
						"label": "橙色",
						"value": "200,50,0"
					}, {
						"label": "红色",
						"value": "255,0,0"
					}, {
						"label": "深绿",
						"value": "0,60,102"
					}, {
						"label": "蓝色",
						"value": "40,40,255"
					}, {
						"label": "深蓝",
						"value": "0,0,255"
					}, {
						"label": "粉红",
						"value": "255,0,255"
					}]
				}],
				"code": "{LED}.setRGBcolor({COLOR});",
				"tags": ["module"],
				"module": "rgb",
				"uid": "ti6LLp"
			}, {
				"type": "statement",
				"name": "rgbLed",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "点亮三色LED(共阴)"
				}, {
					"id": "LED",
					"type": "dynamic-select",
					"options": "rgbs"
				}, {
					"type": "text",
					"value": "色值红色为"
				}, {
					"id": "RED",
					"type": "number-input",
					"value": 0
				}, {
					"type": "text",
					"value": "绿色为"
				}, {
					"id": "GREEN",
					"type": "number-input",
					"value": 0
				}, {
					"type": "text",
					"value": "蓝色为"
				}, {
					"id": "BLUE",
					"type": "number-input",
					"value": 0
				}],
				"code": "{LED}.setRGBcolor({RED},{GREEN},{BLUE});",
				"tags": ["module"],
				"module": "rgb",
				"uid": "hMtr51"
			}, {
				"type": "statement",
				"name": "rgbLedOff",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "熄灭三色LED(共阴)"
				}, {
					"id": "LED",
					"type": "dynamic-select",
					"options": "rgbs"
				}],
				"code": "{LED}.setRGBcolor(0, 0, 0);",
				"tags": ["module"],
				"module": "rgb",
				"uid": "IFYIMn"
			}, {
				"type": "statement",
				"name": "rgbLedFade",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "让三色LED(共阴)渐变"
				}, {
					"id": "LED",
					"type": "dynamic-select",
					"options": "rgbs"
				}, {
					"type": "text",
					"value": "色值红色为"
				}, {
					"id": "RED",
					"type": "number-input",
					"value": 0
				}, {
					"type": "text",
					"value": "绿色为"
				}, {
					"id": "GREEN",
					"type": "number-input",
					"value": 0
				}, {
					"type": "text",
					"value": "蓝色为"
				}, {
					"id": "BLUE",
					"type": "number-input",
					"value": 0
				}],
				"code": "{LED}.crossFade({RED},{GREEN},{BLUE});",
				"tags": ["module"],
				"module": "rgb",
				"uid": "FUFTYU"
			}, {
				"type": "statement",
				"name": "rgbLedAdvanced",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "b07Kyc"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "mycMlO"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "D1j5vR"
				}],
				"content": [{
					"type": "text",
					"value": "点亮三色LED(共阴)"
				}, {
					"id": "LED",
					"type": "dynamic-select",
					"options": "rgbs"
				}, {
					"type": "text",
					"value": "色值红色为"
				}, {
					"blockInputId": "RED",
					"type": "block-input",
					"acceptType": "all",
					"name": "b07Kyc"
				}, {
					"type": "text",
					"value": "绿色为"
				}, {
					"blockInputId": "GREEN",
					"type": "block-input",
					"acceptType": "all",
					"name": "mycMlO"
				}, {
					"type": "text",
					"value": "蓝色为"
				}, {
					"blockInputId": "BLUE",
					"type": "block-input",
					"acceptType": "all",
					"name": "D1j5vR"
				}],
				"code": "{LED}.setRGBcolor({RED},{GREEN},{BLUE});",
				"tags": ["module", "advanced"],
				"module": "rgb",
				"uid": "GrE8rY"
			}],
			"imageUrl": "assets/image/components/rgb.svg"
		}, {
			"uid": "PU6Gq5",
			"name": "rgb2",
			"label": "三色LED(共阳)",
			"type": "rgb2",
			"category": "action",
			"boards": ["Arduino"],
			"width": 90,
			"height": 90,
			"pins": [{
				"name": "r",
				"anchor": [0.25, 1],
				"tags": ["analog-out", "any"],
				"label": "r",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "g",
				"anchor": [0.5, 1],
				"tags": ["analog-out", "any"],
				"label": "g",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "b",
				"anchor": [0.75, 1],
				"tags": ["analog-out", "any"],
				"label": "b",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"include": "#include <RGBLed.h>",
				"var": "RGBLed {NAME}({r}, {g}, {b});"
			},
			"blocks": [{
				"type": "statement",
				"name": "rgb2LedSimple",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "点亮三色LED(共阳)"
				}, {
					"id": "LED",
					"type": "dynamic-select",
					"options": "rgb2s"
				}, {
					"type": "text",
					"value": "设置为"
				}, {
					"id": "COLOR",
					"type": "static-select",
					"options": [{
						"label": "白色",
						"value": "0,0,0"
					}, {
						"label": "黄色",
						"value": "0,0,255"
					}, {
						"label": "橙色",
						"value": "55,205,255"
					}, {
						"label": "红色",
						"value": "0,255,255"
					}, {
						"label": "深绿",
						"value": "255,195,153"
					}, {
						"label": "蓝色",
						"value": "215,215,0"
					}, {
						"label": "深紫",
						"value": "255,255,0"
					}, {
						"label": "粉红",
						"value": "0,255,0"
					}]
				}],
				"code": "{LED}.setRGBcolor({COLOR});",
				"tags": ["module"],
				"module": "rgb2",
				"uid": "ukelNY"
			}, {
				"type": "statement",
				"name": "rgb2Led",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "点亮三色LED(共阳)"
				}, {
					"id": "LED",
					"type": "dynamic-select",
					"options": "rgb2s"
				}, {
					"type": "text",
					"value": "色值红色为"
				}, {
					"id": "RED",
					"type": "number-input",
					"value": 0
				}, {
					"type": "text",
					"value": "绿色为"
				}, {
					"id": "GREEN",
					"type": "number-input",
					"value": 0
				}, {
					"type": "text",
					"value": "蓝色为"
				}, {
					"id": "BLUE",
					"type": "number-input",
					"value": 0
				}],
				"code": "{LED}.setRGBcolor({RED},{GREEN},{BLUE});",
				"tags": ["module"],
				"module": "rgb2",
				"uid": "kPdsKa"
			}, {
				"type": "statement",
				"name": "rgb2LedOff",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "熄灭三色LED(共阳)"
				}, {
					"id": "LED",
					"type": "dynamic-select",
					"options": "rgb2s"
				}],
				"code": "{LED}.setRGBcolor(255, 255, 255);",
				"tags": ["module"],
				"module": "rgb2",
				"uid": "nKE4FL"
			}, {
				"type": "statement",
				"name": "rgb2LedFade",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "让三色LED(共阳)渐变"
				}, {
					"id": "LED",
					"type": "dynamic-select",
					"options": "rgb2s"
				}, {
					"type": "text",
					"value": "色值红色为"
				}, {
					"id": "RED",
					"type": "number-input",
					"value": 0
				}, {
					"type": "text",
					"value": "绿色为"
				}, {
					"id": "GREEN",
					"type": "number-input",
					"value": 0
				}, {
					"type": "text",
					"value": "蓝色为"
				}, {
					"id": "BLUE",
					"type": "number-input",
					"value": 0
				}],
				"code": "{LED}.crossFade({RED},{GREEN},{BLUE});",
				"tags": ["module"],
				"module": "rgb2",
				"uid": "ak1IYh"
			}, {
				"type": "statement",
				"name": "rgb2LedAdvanced",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "98c9mu"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "7RGiRj"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "5nyHcj"
				}],
				"content": [{
					"type": "text",
					"value": "点亮三色LED(共阳)"
				}, {
					"id": "LED",
					"type": "dynamic-select",
					"options": "rgb2s"
				}, {
					"type": "text",
					"value": "色值红色为"
				}, {
					"blockInputId": "RED",
					"type": "block-input",
					"acceptType": "all",
					"name": "98c9mu"
				}, {
					"type": "text",
					"value": "绿色为"
				}, {
					"blockInputId": "GREEN",
					"type": "block-input",
					"acceptType": "all",
					"name": "7RGiRj"
				}, {
					"type": "text",
					"value": "蓝色为"
				}, {
					"blockInputId": "BLUE",
					"type": "block-input",
					"acceptType": "all",
					"name": "5nyHcj"
				}],
				"code": "{LED}.setRGBcolor({RED},{GREEN},{BLUE});",
				"tags": ["module", "advanced"],
				"module": "rgb2",
				"uid": "YDhkmh"
			}],
			"imageUrl": "assets/image/components/rgb.svg"
		}, {
			"uid": "0dp9Yl",
			"name": "lcd",
			"label": "液晶模块",
			"type": "lcd",
			"category": "action",
			"boards": ["Arduino"],
			"width": 90,
			"height": 90,
			"pins": [{
				"name": "sda",
				"anchor": [0.33, 0],
				"tags": ["analog-in", "sda"],
				"spec": ["tag", "sda"],
				"label": "sda",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "scl",
				"anchor": [0.67, 0],
				"tags": ["analog-in", "scl"],
				"spec": ["tag", "scl"],
				"label": "scl",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"include": "#include <LiquidCrystal_I2C.h>",
				"var": "LiquidCrystal_I2C {NAME}(0x27, 16, 2);",
				"setup": "{NAME}.begin();{NAME}.clear();"
			},
			"blocks": [{
				"type": "statement",
				"name": "lcdTurnOnOff",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"id": "STATE",
					"type": "static-select",
					"options": [{
						"label": "打开",
						"value": "backlight"
					}, {
						"label": "关闭",
						"value": "noBacklight"
					}]
				}, {
					"id": "LCD",
					"type": "dynamic-select",
					"options": "lcds"
				}, {
					"type": "text",
					"value": "的背光"
				}],
				"code": "{LCD}.{STATE}();",
				"tags": ["module"],
				"module": "lcd",
				"uid": "wzKQ12"
			}, {
				"type": "statement",
				"name": "lcdWrite",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "在液晶"
				}, {
					"id": "LCD",
					"type": "dynamic-select",
					"options": "lcds"
				}, {
					"type": "text",
					"value": "上显示"
				}, {
					"id": "TEXT",
					"type": "string-input",
					"placeholder": "Hi!"
				}],
				"code": "{LCD}.print(\"{TEXT}\");",
				"tags": ["module"],
				"module": "lcd",
				"uid": "cAzykL"
			}, {
				"type": "statement",
				"name": "lcdWrite2",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "pptQtL"
				}],
				"content": [{
					"type": "text",
					"value": "在液晶"
				}, {
					"id": "LCD",
					"type": "dynamic-select",
					"options": "lcds"
				}, {
					"type": "text",
					"value": "上显示"
				}, {
					"blockInputId": "TEXT",
					"type": "block-input",
					"acceptType": "all",
					"name": "pptQtL"
				}],
				"code": "{LCD}.print({TEXT});",
				"tags": ["module"],
				"module": "lcd",
				"uid": "0YbNn7"
			}, {
				"type": "statement",
				"name": "lcdWritePosition",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "在液晶"
				}, {
					"id": "LCD",
					"type": "dynamic-select",
					"options": "lcds"
				}, {
					"id": "ROW",
					"type": "number-input",
					"value": 0
				}, {
					"type": "text",
					"value": "行"
				}, {
					"id": "COLUMN",
					"type": "number-input",
					"value": 0
				}, {
					"type": "text",
					"value": "列"
				}, {
					"type": "text",
					"value": "上显示"
				}, {
					"id": "TEXT",
					"type": "string-input",
					"placeholder": "Hi!"
				}],
				"code": "{LCD}.setCursor({COLUMN},{ROW});{LCD}.print(\"{TEXT}\");",
				"tags": ["module"],
				"module": "lcd",
				"uid": "YpzjBM"
			}, {
				"type": "statement",
				"name": "lcdWritePosition2",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "KgCJ7q"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "CSZpue"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "Hsbc7o"
				}],
				"content": [{
					"type": "text",
					"value": "在液晶"
				}, {
					"id": "LCD",
					"type": "dynamic-select",
					"options": "lcds"
				}, {
					"blockInputId": "ROW",
					"type": "block-input",
					"acceptType": "all",
					"name": "KgCJ7q"
				}, {
					"type": "text",
					"value": "行"
				}, {
					"blockInputId": "COLUMN",
					"type": "block-input",
					"acceptType": "all",
					"name": "CSZpue"
				}, {
					"type": "text",
					"value": "列"
				}, {
					"type": "text",
					"value": "上显示"
				}, {
					"blockInputId": "TEXT",
					"type": "block-input",
					"acceptType": "all",
					"name": "Hsbc7o"
				}],
				"code": "{LCD}.setCursor({COLUMN},{ROW});{LCD}.print({TEXT});",
				"tags": ["module"],
				"module": "lcd",
				"uid": "bnATsX"
			}, {
				"type": "statement",
				"name": "lcdClear",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "清屏"
				}, {
					"id": "LCD",
					"type": "dynamic-select",
					"options": "lcds"
				}],
				"code": "{LCD}.clear();",
				"tags": ["module"],
				"module": "lcd",
				"uid": "XXhFiq"
			}, {
				"type": "statement",
				"name": "lcdSetAddress",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "设置液晶"
				}, {
					"id": "LCD",
					"type": "dynamic-select",
					"options": "lcds"
				}, {
					"type": "text",
					"value": "的地址"
				}, {
					"id": "ADDR",
					"type": "number-input"
				}],
				"code": "{LCD}.setAddress({ADDR});{LCD}.begin();",
				"tags": ["module", "advanced"],
				"module": "lcd",
				"uid": "nayhFh"
			}, {
				"type": "statement",
				"name": "lcdTurnOnOffAdvanced",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "brQLRK"
				}],
				"content": [{
					"id": "STATE",
					"type": "static-select",
					"options": [{
						"label": "打开",
						"value": "backlight"
					}, {
						"label": "关闭",
						"value": "noBacklight"
					}]
				}, {
					"blockInputId": "LCD",
					"type": "block-input",
					"acceptType": "all",
					"name": "brQLRK"
				}, {
					"type": "text",
					"value": "的背光"
				}],
				"code": "{LCD}.{STATE}();",
				"tags": ["module", "advanced"],
				"module": "lcd",
				"uid": "eQxZOO"
			}, {
				"type": "statement",
				"name": "lcdWriteAdvanced",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "EAB78q"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "o04q1D"
				}],
				"content": [{
					"type": "text",
					"value": "在液晶"
				}, {
					"blockInputId": "LCD",
					"type": "block-input",
					"acceptType": "all",
					"name": "EAB78q"
				}, {
					"type": "text",
					"value": "上显示"
				}, {
					"blockInputId": "TEXT",
					"type": "block-input",
					"acceptType": "all",
					"name": "o04q1D"
				}],
				"code": "{LCD}.print({TEXT});",
				"tags": ["module", "advanced"],
				"module": "lcd",
				"uid": "Zfk1gV"
			}, {
				"type": "statement",
				"name": "lcdWritePositionAdvanced",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "LzNxml"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "Wh3LVs"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "oHLs1N"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "ohuavW"
				}],
				"content": [{
					"type": "text",
					"value": "在液晶"
				}, {
					"blockInputId": "LCD",
					"type": "block-input",
					"acceptType": "all",
					"name": "LzNxml"
				}, {
					"blockInputId": "ROW",
					"type": "block-input",
					"acceptType": "all",
					"name": "Wh3LVs"
				}, {
					"type": "text",
					"value": "行"
				}, {
					"blockInputId": "COLUMN",
					"type": "block-input",
					"acceptType": "all",
					"name": "oHLs1N"
				}, {
					"type": "text",
					"value": "列"
				}, {
					"type": "text",
					"value": "上显示"
				}, {
					"blockInputId": "TEXT",
					"type": "block-input",
					"acceptType": "all",
					"name": "ohuavW"
				}],
				"code": "{LCD}.setCursor({COLUMN},{ROW});{LCD}.print({TEXT});",
				"tags": ["module", "advanced"],
				"module": "lcd",
				"uid": "nDEGXV"
			}],
			"imageUrl": "assets/image/components/lcd.svg"
		}, {
			"uid": "EzeAXy",
			"name": "buzzer",
			"label": "蜂鸣器",
			"type": "buzzer",
			"category": "action",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["digital"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"var": "int {NAME} = {s};",
				"setup": "pinMode({NAME}, OUTPUT);"
			},
			"blocks": [{
				"type": "statement",
				"name": "buzzer",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "蜂鸣器"
				}, {
					"id": "BUZZER",
					"type": "dynamic-select",
					"options": "buzzers"
				}, {
					"type": "text",
					"value": "发出音阶"
				}, {
					"id": "NOTE",
					"type": "static-select",
					"options": [{
						"label": "Do",
						"value": "261"
					}, {
						"label": "Re",
						"value": "293"
					}, {
						"label": "Mi",
						"value": "329"
					}, {
						"label": "Fa",
						"value": "349"
					}, {
						"label": "Sol",
						"value": "392"
					}, {
						"label": "La",
						"value": "440"
					}, {
						"label": "Si",
						"value": "494"
					}]
				}, {
					"type": "text",
					"value": "持续"
				}, {
					"id": "SECONDS",
					"type": "number-input",
					"value": 2000
				}, {
					"type": "text",
					"value": "毫秒"
				}],
				"code": "tone({BUZZER},{NOTE},{SECONDS});\ndelay({SECONDS});",
				"tags": ["module"],
				"module": "buzzer",
				"uid": "VzCbs8"
			}, {
				"type": "statement",
				"name": "buzzerTone",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "6EeYYf"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "Hahl8q"
				}],
				"content": [{
					"type": "text",
					"value": "蜂鸣器"
				}, {
					"id": "BUZZER",
					"type": "dynamic-select",
					"options": "buzzers"
				}, {
					"type": "text",
					"value": "发出频率"
				}, {
					"blockInputId": "NOTE",
					"type": "block-input",
					"acceptType": "all",
					"name": "6EeYYf"
				}, {
					"type": "text",
					"value": "持续"
				}, {
					"blockInputId": "SECONDS",
					"type": "block-input",
					"acceptType": "all",
					"name": "Hahl8q"
				}, {
					"type": "text",
					"value": "毫秒"
				}],
				"code": "tone({BUZZER},{NOTE},{SECONDS});\ndelay({SECONDS});",
				"tags": ["module"],
				"module": "buzzer",
				"uid": "wWi5EW"
			}, {
				"type": "statement",
				"name": "buzzerClose",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "打开",
						"value": "open"
					}, {
						"label": "关闭",
						"value": "close"
					}]
				}, {
					"type": "text",
					"value": "蜂鸣器"
				}, {
					"id": "BUZZER",
					"type": "dynamic-select",
					"options": "buzzers"
				}],
				"eval": true,
				"code": "'{OP}' === 'open' ? 'digitalWrite({BUZZER}, HIGH);' : 'noTone({BUZZER});'",
				"tags": ["module"],
				"module": "buzzer",
				"uid": "DSWgJ7"
			}, {
				"type": "statement",
				"name": "buzzerAdvanced",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "QPnJ6Z"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "IM4Mj2"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "uUhZbi"
				}],
				"content": [{
					"type": "text",
					"value": "蜂鸣器"
				}, {
					"blockInputId": "BUZZER",
					"type": "block-input",
					"acceptType": "all",
					"name": "QPnJ6Z"
				}, {
					"type": "text",
					"value": "发出频率"
				}, {
					"blockInputId": "NOTE",
					"type": "block-input",
					"acceptType": "all",
					"name": "IM4Mj2"
				}, {
					"type": "text",
					"value": "持续"
				}, {
					"blockInputId": "SECONDS",
					"type": "block-input",
					"acceptType": "all",
					"name": "uUhZbi"
				}, {
					"type": "text",
					"value": "毫秒"
				}],
				"code": "tone({BUZZER},{NOTE},{SECONDS});\ndelay({SECONDS});",
				"tags": ["module", "advanced"],
				"module": "buzzer",
				"uid": "IOYb1Y"
			}],
			"imageUrl": "assets/image/components/buzzer.svg"
		}, {
			"uid": "gqwDEu",
			"name": "dcMotor",
			"label": "小功率电机",
			"type": "dcMotor",
			"category": "action",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "a",
				"anchor": [0.333, 1],
				"tags": ["analog-out"],
				"label": "a",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "b",
				"anchor": [0.667, 1],
				"tags": ["analog-out"],
				"label": "b",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"include": "#include <DCMotor.h>",
				"var": "DCMotor {NAME}({a}, {b});"
			},
			"blocks": [{
				"type": "statement",
				"name": "dcMotorRun",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "设置小功率电机"
				}, {
					"id": "DC",
					"type": "dynamic-select",
					"options": "dcMotors"
				}, {
					"type": "text",
					"value": "速度为"
				}, {
					"id": "SPEED",
					"type": "number-input"
				}],
				"code": "{DC}.run({SPEED});",
				"tags": ["module"],
				"module": "dcMotor",
				"uid": "fnIYDN"
			}, {
				"type": "statement",
				"name": "dcMotorStop",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "停止小功率电机"
				}, {
					"id": "DC",
					"type": "dynamic-select",
					"options": "dcMotors"
				}],
				"code": "{DC}.stop();",
				"tags": ["module"],
				"module": "dcMotor",
				"uid": "29o9wz"
			}, {
				"type": "statement",
				"name": "dcMotorRunAdvanced",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "skSSuQ"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "lOOvO2"
				}],
				"content": [{
					"type": "text",
					"value": "设置小功率电机"
				}, {
					"blockInputId": "DC",
					"type": "block-input",
					"acceptType": "all",
					"name": "skSSuQ"
				}, {
					"type": "text",
					"value": "速度为"
				}, {
					"blockInputId": "SPEED",
					"type": "block-input",
					"acceptType": "all",
					"name": "lOOvO2"
				}],
				"code": "{DC}.run({SPEED});",
				"tags": ["module", "advanced"],
				"module": "dcMotor",
				"uid": "vBhAoh"
			}],
			"imageUrl": "assets/image/components/dcMotor.svg"
		}, {
			"uid": "wiWnL4",
			"name": "servo",
			"label": "舵机",
			"type": "servo",
			"category": "action",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["digital"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"include": "#include <Servo.h>",
				"var": "Servo {NAME};",
				"setup": "{NAME}.attach({s});"
			},
			"blocks": [{
				"type": "statement",
				"name": "servoNormal",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "设置舵机"
				}, {
					"id": "SERVO",
					"type": "dynamic-select",
					"options": "servos"
				}, {
					"type": "text",
					"value": "角度为"
				}, {
					"id": "ANGLE",
					"type": "static-select",
					"options": [{
						"label": "0",
						"value": "0"
					}, {
						"label": "45",
						"value": "45"
					}, {
						"label": "90",
						"value": "90"
					}, {
						"label": "135",
						"value": "135"
					}, {
						"label": "180",
						"value": "180"
					}],
					"value": "90"
				}, {
					"type": "text",
					"value": "度"
				}],
				"code": "{SERVO}.write({ANGLE});",
				"tags": ["module"],
				"module": "servo",
				"uid": "i7pG0w"
			}, {
				"type": "statement",
				"name": "servoNormalAdvanced",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "ubp4vK"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "0f6d3s"
				}],
				"content": [{
					"type": "text",
					"value": "设置舵机"
				}, {
					"blockInputId": "SERVO",
					"type": "block-input",
					"acceptType": "all",
					"name": "ubp4vK"
				}, {
					"type": "text",
					"value": "角度为"
				}, {
					"blockInputId": "POSITION",
					"type": "block-input",
					"acceptType": "all",
					"name": "0f6d3s"
				}, {
					"type": "text",
					"value": "度"
				}],
				"code": "{SERVO}.write({POSITION});",
				"tags": ["module", "advanced"],
				"module": "servo",
				"uid": "wFdxeI"
			}],
			"imageUrl": "assets/image/components/servo.svg"
		}, {
			"uid": "Q5Etxw",
			"name": "continuousServo",
			"label": "全角度舵机",
			"type": "continuousServo",
			"category": "action",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["digital"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"include": "#include <Servo.h>",
				"var": "Servo {NAME};",
				"setup": "{NAME}.attach({s});"
			},
			"blocks": [{
				"type": "statement",
				"name": "continuousServoStart",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "全角度舵机"
				}, {
					"id": "SERVO",
					"type": "dynamic-select",
					"options": "continuousServos"
				}, {
					"id": "DIRECTION",
					"type": "static-select",
					"options": [{
						"label": "顺时针",
						"value": "180"
					}, {
						"label": "逆时针",
						"value": "0"
					}]
				}, {
					"type": "text",
					"value": "转动"
				}],
				"code": "{SERVO}.write({DIRECTION});",
				"tags": ["module"],
				"module": "continuousServo",
				"uid": "Rh7nKH"
			}, {
				"type": "statement",
				"name": "continuousServoStop",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "全角度舵机"
				}, {
					"id": "SERVO",
					"type": "dynamic-select",
					"options": "continuousServos"
				}, {
					"type": "text",
					"value": "停止转动"
				}],
				"code": "{SERVO}.write(90);",
				"tags": ["module"],
				"module": "continuousServo",
				"uid": "0zPjpO"
			}, {
				"type": "statement",
				"name": "continuousServoStartAdvanced",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "cZPm47"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "TyJJe0"
				}],
				"content": [{
					"type": "text",
					"value": "全角度舵机"
				}, {
					"blockInputId": "SERVO",
					"type": "block-input",
					"acceptType": "all",
					"name": "cZPm47"
				}, {
					"type": "text",
					"value": "方向为"
				}, {
					"blockInputId": "DIRECTION",
					"type": "block-input",
					"acceptType": "all",
					"name": "TyJJe0"
				}],
				"code": "{SERVO}.write({DIRECTION});",
				"tags": ["module", "advanced"],
				"module": "continuousServo",
				"uid": "4qHqiF"
			}, {
				"type": "statement",
				"name": "continuousServoStopAdvanced",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "nEt27Q"
				}],
				"content": [{
					"type": "text",
					"value": "全角度舵机"
				}, {
					"blockInputId": "SERVO",
					"type": "block-input",
					"acceptType": "all",
					"name": "nEt27Q"
				}, {
					"type": "text",
					"value": "停止转动"
				}],
				"code": "{SERVO}.write(90);",
				"tags": ["module", "advanced"],
				"module": "continuousServo",
				"uid": "PNFLTP"
			}],
			"imageUrl": "assets/image/components/continuousServo.svg"
		}, {
			"uid": "Uf0rkg",
			"name": "L298P",
			"label": "L298P驱动板",
			"type": "L298P",
			"category": "action",
			"boards": ["Arduino"],
			"width": 120,
			"height": 120,
			"pins": [{
				"name": "pwm1",
				"anchor": [0.25, 0],
				"tags": ["analog-out"],
				"label": "pwm1",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "dir1",
				"anchor": [0.5, 0],
				"tags": ["digital", "analog-in"],
				"label": "dir1",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "en1",
				"anchor": [0.75, 0],
				"tags": ["digital", "analog-in", "GND", "VCC"],
				"label": "en1",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "pwm2",
				"anchor": [0.25, 1],
				"tags": ["analog-out"],
				"label": "pwm2",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "dir2",
				"anchor": [0.5, 1],
				"tags": ["digital", "analog-in"],
				"label": "dir2",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "en2",
				"anchor": [0.75, 1],
				"tags": ["digital", "analog-in", "GND", "VCC"],
				"label": "en2",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"include": "#include <Motor.h>",
				"var": "if('{en2}' != '') {'Motor {NAME}({pwm1}, {dir1}, {en1}, {pwm2}, {dir2}, {en2});'} else if('{en1}' != '' && ('{dir2}' != '' || '{pwm2}' != '')) {'Motor {NAME}({pwm1}, {dir1}, {en1}, {pwm2}, {dir2});'} else if('{dir2}' != '' || '{pwm2}' != '') {'Motor {NAME}({pwm1}, {dir1}, {pwm2}, {dir2});'} else if('{en1}' !== '') {'Motor {NAME}({pwm1}, {dir1}, {en1});'} else {'Motor {NAME}({pwm1}, {dir1});'}",
				"eval": true
			},
			"blocks": [{
				"type": "statement",
				"name": "L298PSetSpeed",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "TsTLTk"
				}],
				"content": [{
					"type": "text",
					"value": "设置电机驱动板模块"
				}, {
					"id": "MOTOR",
					"type": "dynamic-select",
					"options": "L298Ps"
				}, {
					"id": "INDEX",
					"type": "static-select",
					"options": [{
						"label": "1",
						"value": "1"
					}, {
						"label": "2",
						"value": "2"
					}]
				}, {
					"type": "text",
					"value": "号电机转速为"
				}, {
					"blockInputId": "SPEED",
					"type": "block-input",
					"acceptType": "all",
					"name": "TsTLTk"
				}],
				"code": "{MOTOR}.setSpeed({INDEX}, {SPEED});",
				"tags": ["module"],
				"module": "L298P",
				"uid": "9bBKXv"
			}, {
				"type": "statement",
				"name": "L298PSetDirection",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "设置电机驱动板模块"
				}, {
					"id": "MOTOR",
					"type": "dynamic-select",
					"options": "L298Ps"
				}, {
					"id": "INDEX",
					"type": "static-select",
					"options": [{
						"label": "1",
						"value": "1"
					}, {
						"label": "2",
						"value": "2"
					}]
				}, {
					"type": "text",
					"value": "号电机方向为"
				}, {
					"id": "DIR",
					"type": "static-select",
					"options": [{
						"label": "正",
						"value": "true"
					}, {
						"label": "反",
						"value": "false"
					}]
				}],
				"code": "{MOTOR}.setDirection({INDEX}, {DIR});",
				"tags": ["module", "advanced"],
				"module": "L298P",
				"uid": "KuYvM6"
			}, {
				"type": "statement",
				"name": "L298PRun",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "uSYWse"
				}],
				"content": [{
					"type": "text",
					"value": "设置电机驱动板模块"
				}, {
					"id": "MOTOR",
					"type": "dynamic-select",
					"options": "L298Ps"
				}, {
					"id": "INDEX",
					"type": "static-select",
					"options": [{
						"label": "1",
						"value": "1"
					}, {
						"label": "2",
						"value": "2"
					}]
				}, {
					"type": "text",
					"value": "号电机转动，方向为"
				}, {
					"id": "DIR",
					"type": "static-select",
					"options": [{
						"label": "正",
						"value": "true"
					}, {
						"label": "反",
						"value": "false"
					}]
				}, {
					"type": "text",
					"value": "转速为"
				}, {
					"blockInputId": "SPEED",
					"type": "block-input",
					"acceptType": "all",
					"name": "uSYWse"
				}],
				"code": "{MOTOR}.run({INDEX}, {DIR}, {SPEED});",
				"tags": ["module", "advanced"],
				"module": "L298P",
				"uid": "ym7Mdx"
			}, {
				"type": "statement",
				"name": "L298PStop",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "设置电机驱动板模块"
				}, {
					"id": "MOTOR",
					"type": "dynamic-select",
					"options": "L298Ps"
				}, {
					"id": "INDEX",
					"type": "static-select",
					"options": [{
						"label": "1",
						"value": "1"
					}, {
						"label": "2",
						"value": "2"
					}]
				}, {
					"type": "text",
					"value": "号电机停止"
				}],
				"code": "{MOTOR}.stop({INDEX});",
				"tags": ["module"],
				"module": "L298P",
				"uid": "tziV6k"
			}],
			"imageUrl": "assets/image/components/L298P.svg"
		}, {
			"uid": "aCrRQU",
			"name": "L298N",
			"label": "L298N驱动板",
			"type": "L298N",
			"category": "action",
			"boards": ["Arduino"],
			"width": 120,
			"height": 120,
			"pins": [{
				"name": "pwm1",
				"anchor": [0.25, 0],
				"tags": ["analog-out"],
				"label": "pwm1",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "in1",
				"anchor": [0.5, 0],
				"tags": ["digital", "analog-in"],
				"label": "in1",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "in2",
				"anchor": [0.75, 0],
				"tags": ["digital", "analog-in", "GND", "VCC"],
				"label": "in2",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "pwm2",
				"anchor": [0.25, 1],
				"tags": ["analog-out"],
				"label": "pwm2",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "in3",
				"anchor": [0.5, 1],
				"tags": ["digital", "analog-in"],
				"label": "in3",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "in4",
				"anchor": [0.75, 1],
				"tags": ["digital", "analog-in", "GND", "VCC"],
				"label": "in4",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"include": "#include <Motor.h>",
				"var": "if('{in4}' != '') {'Motor {NAME}({pwm1}, {in1}, {in2}, {pwm2}, {in3}, {in4});'} else if('{in2}' != '' && ('{in3}' != '' || '{pwm2}' != '')) {'Motor {NAME}({pwm1}, {in1}, {in2}, {pwm2}, {in3});'} else if('{in3}' != '' || '{pwm2}' != '') {'Motor {NAME}({pwm1}, {in1}, {pwm2}, {in3});'} else if('{in2}' !== '') {'Motor {NAME}({pwm1}, {in1}, {in2});'} else {'Motor {NAME}({pwm1}, {in1});'}",
				"eval": true
			},
			"blocks": [{
				"type": "statement",
				"name": "L298NSetSpeed",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "ypOMoN"
				}],
				"content": [{
					"type": "text",
					"value": "设置电机驱动板模块"
				}, {
					"id": "MOTOR",
					"type": "dynamic-select",
					"options": "L298Ns"
				}, {
					"id": "INDEX",
					"type": "static-select",
					"options": [{
						"label": "1",
						"value": "1"
					}, {
						"label": "2",
						"value": "2"
					}]
				}, {
					"type": "text",
					"value": "号电机转速为"
				}, {
					"blockInputId": "SPEED",
					"type": "block-input",
					"acceptType": "all",
					"name": "ypOMoN"
				}],
				"code": "{MOTOR}.setSpeed({INDEX}, {SPEED});",
				"tags": ["module"],
				"module": "L298N",
				"uid": "6O9eNg"
			}, {
				"type": "statement",
				"name": "L298NSetDirection",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "设置电机驱动板模块"
				}, {
					"id": "MOTOR",
					"type": "dynamic-select",
					"options": "L298Ns"
				}, {
					"id": "INDEX",
					"type": "static-select",
					"options": [{
						"label": "1",
						"value": "1"
					}, {
						"label": "2",
						"value": "2"
					}]
				}, {
					"type": "text",
					"value": "号电机方向为"
				}, {
					"id": "DIR",
					"type": "static-select",
					"options": [{
						"label": "正",
						"value": "true"
					}, {
						"label": "反",
						"value": "false"
					}]
				}],
				"code": "{MOTOR}.setDirection({INDEX}, {DIR});",
				"tags": ["module", "advanced"],
				"module": "L298N",
				"uid": "wO7ugx"
			}, {
				"type": "statement",
				"name": "L298NRun",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "gJSJfn"
				}],
				"content": [{
					"type": "text",
					"value": "设置电机驱动板模块"
				}, {
					"id": "MOTOR",
					"type": "dynamic-select",
					"options": "L298Ns"
				}, {
					"id": "INDEX",
					"type": "static-select",
					"options": [{
						"label": "1",
						"value": "1"
					}, {
						"label": "2",
						"value": "2"
					}]
				}, {
					"type": "text",
					"value": "号电机转动，方向为"
				}, {
					"id": "DIR",
					"type": "static-select",
					"options": [{
						"label": "正",
						"value": "true"
					}, {
						"label": "反",
						"value": "false"
					}]
				}, {
					"type": "text",
					"value": "转速为"
				}, {
					"blockInputId": "SPEED",
					"type": "block-input",
					"acceptType": "all",
					"name": "gJSJfn"
				}],
				"code": "{MOTOR}.run({INDEX}, {DIR}, {SPEED});",
				"tags": ["module", "advanced"],
				"module": "L298N",
				"uid": "fZxjFy"
			}, {
				"type": "statement",
				"name": "L298NStop",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "设置电机驱动板模块"
				}, {
					"id": "MOTOR",
					"type": "dynamic-select",
					"options": "L298Ns"
				}, {
					"id": "INDEX",
					"type": "static-select",
					"options": [{
						"label": "1",
						"value": "1"
					}, {
						"label": "2",
						"value": "2"
					}]
				}, {
					"type": "text",
					"value": "号电机停止"
				}],
				"code": "{MOTOR}.stop({INDEX});",
				"tags": ["module"],
				"module": "L298N",
				"uid": "WAvwCh"
			}],
			"imageUrl": "assets/image/components/L298N.svg"
		}, {
			"uid": "Ps9VEj",
			"name": "car",
			"label": "小车",
			"type": "car",
			"category": "action",
			"boards": ["Arduino"],
			"width": 90,
			"height": 90,
			"pins": [{
				"name": "leftPin",
				"anchor": [0.333, 1],
				"tags": ["analog-out"],
				"label": "leftPin",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "rightPin",
				"anchor": [0.667, 1],
				"tags": ["analog-out"],
				"label": "rightPin",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"include": "#include <curieBot.h>",
				"var": "Servo_Motor {NAME}({leftPin}, {rightPin});"
			},
			"blocks": [{
				"type": "statement",
				"name": "carRun",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "hAmvWG"
				}],
				"content": [{
					"type": "text",
					"value": "小车"
				}, {
					"id": "CAR",
					"type": "dynamic-select",
					"options": "cars"
				}, {
					"type": "text",
					"value": "运行，速度为"
				}, {
					"blockInputId": "SPEED",
					"type": "block-input",
					"acceptType": "all",
					"name": "hAmvWG"
				}],
				"code": "{CAR}.run({SPEED});",
				"tags": ["module"],
				"module": "car",
				"uid": "lURiJV"
			}, {
				"type": "statement",
				"name": "carTurn0",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "小车"
				}, {
					"id": "CAR",
					"type": "dynamic-select",
					"options": "cars"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "左转",
						"value": "turnLeft"
					}, {
						"label": "右转",
						"value": "turnRight"
					}]
				}],
				"code": "{CAR}.{OP}();",
				"tags": ["module"],
				"module": "car",
				"uid": "DUHqhx"
			}, {
				"type": "statement",
				"name": "carTurn1",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "NhyLFz"
				}],
				"content": [{
					"type": "text",
					"value": "小车"
				}, {
					"id": "CAR",
					"type": "dynamic-select",
					"options": "cars"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "左转",
						"value": "turnLeft"
					}, {
						"label": "右转",
						"value": "turnRight"
					}]
				}, {
					"blockInputId": "ANGLE",
					"type": "block-input",
					"acceptType": "all",
					"name": "NhyLFz"
				}, {
					"type": "text",
					"value": "度"
				}],
				"code": "{CAR}.{OP}({ANGLE});",
				"tags": ["module"],
				"module": "car",
				"uid": "h6lY4O"
			}, {
				"type": "statement",
				"name": "carTurn2",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "h457tm"
				}],
				"content": [{
					"type": "text",
					"value": "小车"
				}, {
					"id": "CAR",
					"type": "dynamic-select",
					"options": "cars"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "左转",
						"value": "left"
					}, {
						"label": "右转",
						"value": "right"
					}]
				}, {
					"type": "text",
					"value": "速度"
				}, {
					"blockInputId": "SPEED",
					"type": "block-input",
					"acceptType": "all",
					"name": "h457tm"
				}],
				"code": "'{OP}' === 'left' ? '{CAR}.turnLeft();{CAR}.motorL({SPEED});' : '{CAR}.turnRight();{CAR}.motorR({SPEED});'",
				"eval": true,
				"tags": ["module"],
				"module": "car",
				"uid": "ORA7Bd"
			}, {
				"type": "statement",
				"name": "carStop",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "小车"
				}, {
					"id": "CAR",
					"type": "dynamic-select",
					"options": "cars"
				}, {
					"type": "text",
					"value": "停止"
				}],
				"code": "{CAR}.stop();",
				"tags": ["module"],
				"module": "car",
				"uid": "LV0hxJ"
			}, {
				"type": "statement",
				"name": "carCalibrate",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "校准小车"
				}, {
					"id": "CAR",
					"type": "dynamic-select",
					"options": "cars"
				}],
				"code": "{CAR}.calibrate();",
				"tags": ["module"],
				"module": "car",
				"uid": "oaNZtO"
			}, {
				"type": "output",
				"name": "carTrackCheck",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "读取小车"
				}, {
					"id": "PIN",
					"type": "dynamic-select",
					"options": "cars"
				}, {
					"type": "text",
					"value": "循迹板"
				}, {
					"id": "INDEX",
					"type": "static-select",
					"options": [{
						"label": "左",
						"value": "14"
					}, {
						"label": "中",
						"value": "15"
					}, {
						"label": "右",
						"value": "16"
					}]
				}, {
					"type": "text",
					"value": "监测点的数字量"
				}],
				"code": "digitalRead({INDEX})",
				"returnType": {
					"type": "simple",
					"value": "int"
				},
				"tags": ["module"],
				"module": "car",
				"uid": "xWylGC"
			}],
			"imageUrl": "assets/image/components/car.svg"
		}, {
			"uid": "JulbGU",
			"name": "irSend",
			"label": "红外发射模块",
			"type": "irSend",
			"category": "action",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [0.5, 1],
				"tags": ["ir-send"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"include": "#include <IRremote.h>",
				"var": "IRsend {NAME};"
			},
			"blocks": [{
				"type": "statement",
				"name": "irSendSend",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "T0upij"
				}],
				"content": [{
					"type": "text",
					"value": "红外发射模块"
				}, {
					"id": "IR_SEND",
					"type": "dynamic-select",
					"options": "irSends"
				}, {
					"type": "text",
					"value": "发射编码"
				}, {
					"blockInputId": "DATA",
					"type": "block-input",
					"acceptType": "all",
					"name": "T0upij"
				}],
				"code": "{IR_SEND}.sendNEC({DATA}, 32);",
				"tags": ["module"],
				"module": "irSend",
				"uid": "jC5Tqn"
			}],
			"imageUrl": "assets/image/components/irSend.svg"
		}, {
			"uid": "1vspZl",
			"name": "u8g",
			"label": "OLED模块(IIC)",
			"type": "u8g",
			"category": "action",
			"boards": ["Arduino"],
			"width": 90,
			"height": 90,
			"pins": [{
				"name": "sda",
				"anchor": [0.33, 0],
				"tags": ["sda"],
				"spec": ["tag", "sda"],
				"label": "sda",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "scl",
				"anchor": [0.67, 0],
				"tags": ["scl"],
				"spec": ["tag", "scl"],
				"label": "scl",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"include": "#include <U8glib.h>",
				"var": "U8GLIB_SSD1306_128X64 {NAME}(U8G_I2C_OPT_NONE);"
			},
			"blocks": [{
				"type": "statement-input",
				"name": "u8gLoop",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-root",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "显示"
				}],
				"code": "{U8G}.firstPage();do{\n{STATEMENTS}\n}while({U8G}.nextPage());",
				"tags": ["module"],
				"module": "u8g",
				"uid": "aKR4YK"
			}, {
				"type": "statement",
				"name": "u8gDrawPoint",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "Tpj4Kp"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "ntOnvb"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "画点，X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "Tpj4Kp",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "ntOnvb",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{U8G}.drawPixel({XPOS}, {YPOS});",
				"tags": ["module"],
				"module": "u8g",
				"uid": "ayHyd8"
			}, {
				"type": "statement",
				"name": "u8gDrawLine",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "jJFyT6"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "aSWdZu"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "4JQ5HO"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "elSZ6f"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "画线段，X1"
				}, {
					"blockInputId": "XPOS1",
					"type": "block-input",
					"acceptType": "all",
					"name": "jJFyT6",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y1"
				}, {
					"blockInputId": "YPOS1",
					"type": "block-input",
					"acceptType": "all",
					"name": "aSWdZu",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "X2"
				}, {
					"blockInputId": "XPOS2",
					"type": "block-input",
					"acceptType": "all",
					"name": "4JQ5HO",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y2"
				}, {
					"blockInputId": "YPOS2",
					"type": "block-input",
					"acceptType": "all",
					"name": "elSZ6f",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{U8G}.drawLine({XPOS1}, {YPOS1}, {XPOS2}, {YPOS2});",
				"tags": ["module"],
				"module": "u8g",
				"uid": "hJ13tM"
			}, {
				"type": "statement",
				"name": "u8gDrawLineHV",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "lbkKZe"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "SEGhXA"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "dHWKqE"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "画"
				}, {
					"id": "SHAPE",
					"type": "static-select",
					"options": [{
						"label": "平行线",
						"value": "drawHLine"
					}, {
						"label": "垂直线",
						"value": "drawVLine"
					}]
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "lbkKZe",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "SEGhXA",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "L"
				}, {
					"blockInputId": "LENGTH",
					"type": "block-input",
					"acceptType": "all",
					"name": "dHWKqE",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{U8G}.{SHAPE}({XPOS}, {YPOS}, {LENGTH});",
				"tags": ["module"],
				"module": "u8g",
				"uid": "00D7ya"
			}, {
				"type": "statement",
				"name": "u8gDrawTriangle",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "kxokiW"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "jJK0ze"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "JEVt8g"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "H3CHGd"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "biIyJ1"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "Pn94Ok"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "画实心三角形"
				}, {
					"type": "text",
					"value": "X1"
				}, {
					"blockInputId": "X1",
					"type": "block-input",
					"acceptType": "all",
					"name": "kxokiW",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y1"
				}, {
					"blockInputId": "Y1",
					"type": "block-input",
					"acceptType": "all",
					"name": "jJK0ze",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "X2"
				}, {
					"blockInputId": "X2",
					"type": "block-input",
					"acceptType": "all",
					"name": "JEVt8g",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y2"
				}, {
					"blockInputId": "Y2",
					"type": "block-input",
					"acceptType": "all",
					"name": "H3CHGd",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "X3"
				}, {
					"blockInputId": "X3",
					"type": "block-input",
					"acceptType": "all",
					"name": "biIyJ1",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y3"
				}, {
					"blockInputId": "Y3",
					"type": "block-input",
					"acceptType": "all",
					"name": "Pn94Ok",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{U8G}.drawTriangle({X1}, {Y1}, {X2}, {Y2}, {X3}, {Y3});",
				"tags": ["module"],
				"module": "u8g",
				"uid": "M0RJJA"
			}, {
				"type": "statement",
				"name": "u8gDrawRect",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "JH1Y67"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "Vw0dYH"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "AnzxrR"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "bSkaTH"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "画"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "空心矩形",
						"value": "drawFrame"
					}, {
						"label": "实心矩形",
						"value": "drawBox"
					}]
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "JH1Y67",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "Vw0dYH",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "W"
				}, {
					"blockInputId": "WIDTH",
					"type": "block-input",
					"acceptType": "all",
					"name": "AnzxrR",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "H"
				}, {
					"blockInputId": "HEIGHT",
					"type": "block-input",
					"acceptType": "all",
					"name": "bSkaTH",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{U8G}.{OP}({XPOS}, {YPOS}, {WIDTH}, {HEIGHT});",
				"tags": ["module"],
				"module": "u8g",
				"uid": "Nmrn2S"
			}, {
				"type": "statement",
				"name": "u8gDrawRoundRect",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "nb3uCx"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "5aUbfv"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "PIE9cE"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "tDwdrr"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "AMYved"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "画"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "空心圆角矩形",
						"value": "drawRFrame"
					}, {
						"label": "实心圆角矩形",
						"value": "drawRBox"
					}]
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "nb3uCx",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "5aUbfv",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "W"
				}, {
					"blockInputId": "WIDTH",
					"type": "block-input",
					"acceptType": "all",
					"name": "PIE9cE",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "H"
				}, {
					"blockInputId": "HEIGHT",
					"type": "block-input",
					"acceptType": "all",
					"name": "tDwdrr",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "R"
				}, {
					"blockInputId": "RADIUS",
					"type": "block-input",
					"acceptType": "all",
					"name": "AMYved",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{U8G}.{OP}({XPOS}, {YPOS}, {WIDTH}, {HEIGHT}, {RADIUS});",
				"tags": ["module"],
				"module": "u8g",
				"uid": "i8wV2q"
			}, {
				"type": "statement",
				"name": "u8gDrawCircle",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "fG7SZz"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "31qIsz"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "U2QAOb"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "画"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "空心圆",
						"value": "drawCircle"
					}, {
						"label": "实心圆",
						"value": "drawDisc"
					}]
				}, {
					"id": "SHAPE",
					"type": "static-select",
					"options": [{
						"label": "整圆",
						"value": "U8G_DRAW_ALL"
					}, {
						"label": "左上半圆",
						"value": "U8G_DRAW_UPPER_LEFT"
					}, {
						"label": "左下半圆",
						"value": "U8G_DRAW_LOWER_LEFT"
					}, {
						"label": "右上半圆",
						"value": "U8G_DRAW_UPPER_RIGHT"
					}, {
						"label": "右下半圆",
						"value": "U8G_DRAW_LOWER_RIGHT"
					}]
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "fG7SZz",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "31qIsz",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "R"
				}, {
					"blockInputId": "RADIUS",
					"type": "block-input",
					"acceptType": "all",
					"name": "U2QAOb",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{U8G}.{OP}({XPOS}, {YPOS}, {RADIUS}, {SHAPE});",
				"tags": ["module"],
				"module": "u8g",
				"uid": "DbMrHZ"
			}, {
				"type": "statement",
				"name": "u8gDrawEllipse",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "WwbbY1"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "ZhL5EO"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "8AX8x8"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "pYtefg"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "画"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "空心椭圆",
						"value": "drawEllipse"
					}, {
						"label": "实心椭圆",
						"value": "drawFilledEllipse"
					}]
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "WwbbY1",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "ZhL5EO",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Rx"
				}, {
					"blockInputId": "RX",
					"type": "block-input",
					"acceptType": "all",
					"name": "8AX8x8",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "RY"
				}, {
					"blockInputId": "RY",
					"type": "block-input",
					"acceptType": "all",
					"name": "pYtefg",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{U8G}.{OP}({XPOS}, {YPOS}, {RX}, {RY});",
				"tags": ["module"],
				"module": "u8g",
				"uid": "H9l4b9"
			}, {
				"type": "statement",
				"name": "u8gSetFont",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "设置字体"
				}, {
					"id": "FONT",
					"type": "static-select",
					"options": [{
						"label": "小",
						"value": "u8g_font_fixed_v0r"
					}, {
						"label": "中",
						"value": "u8g_font_9x18"
					}, {
						"label": "大",
						"value": "u8g_font_fur20"
					}]
				}],
				"code": "{U8G}.setFont({FONT});",
				"tags": ["module"],
				"module": "u8g",
				"uid": "aqWpYA"
			}, {
				"type": "statement",
				"name": "u8gRotate",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "下句旋转"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "90度",
						"value": "setRot90"
					}, {
						"label": "180度",
						"value": "setRot180"
					}, {
						"label": "270度",
						"value": "setRot270"
					}]
				}],
				"code": "{U8G}.{OP}();",
				"tags": ["module"],
				"module": "u8g",
				"uid": "oXQBh4"
			}, {
				"type": "statement",
				"name": "u8gSetPos",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "KAVXZY"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "T3J3Z4"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "下句显示位置"
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "KAVXZY",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "T3J3Z4",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{U8G}.setPrintPos({XPOS}, {YPOS});",
				"tags": ["module"],
				"module": "u8g",
				"uid": "xKEnPe"
			}, {
				"type": "statement",
				"name": "u8gPrint",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "mRSMnU"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "显示"
				}, {
					"blockInputId": "DATA",
					"type": "block-input",
					"acceptType": "all",
					"name": "mRSMnU"
				}],
				"code": "{U8G}.print({DATA});",
				"tags": ["module"],
				"module": "u8g",
				"uid": "iPq7WP"
			}, {
				"type": "statement",
				"name": "u8gSetColor",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "下句"
				}, {
					"id": "TYPE",
					"type": "static-select",
					"options": [{
						"label": "透明",
						"value": "0"
					}, {
						"label": "不透明",
						"value": "1"
					}]
				}],
				"code": "{U8G}.setColorIndex({TYPE});",
				"tags": ["module"],
				"module": "u8g",
				"uid": "eYypEN"
			}, {
				"type": "statement",
				"name": "u8gPrintStr",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "DTkGZA"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "ngF8HQ"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "gDKyhr"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "显示字符"
				}, {
					"blockInputId": "DATA",
					"type": "block-input",
					"acceptType": "all",
					"name": "DTkGZA"
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "ngF8HQ",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "gDKyhr",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "不旋转",
						"value": "drawStr"
					}, {
						"label": "旋转90度",
						"value": "drawStr90"
					}, {
						"label": "旋转180",
						"value": "drawStr180"
					}, {
						"label": "旋转270",
						"value": "drawStr270"
					}]
				}],
				"code": "{U8G}.{OP}({XPOS}, {YPOS}, {DATA});",
				"tags": ["module"],
				"module": "u8g",
				"uid": "kwnsvN"
			}, {
				"type": "statement",
				"name": "u8gPrintBitmap",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "O4ZiEY"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "OglmwV"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "sWUvE6"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "ar1aPN"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "gptfLo"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (IIC)"
				}, {
					"id": "U8G",
					"type": "dynamic-select",
					"options": "u8gs"
				}, {
					"type": "text",
					"value": "显示位图"
				}, {
					"blockInputId": "DATA",
					"type": "block-input",
					"acceptType": "all",
					"name": "O4ZiEY"
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "OglmwV",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "sWUvE6",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "W"
				}, {
					"blockInputId": "WIDTH",
					"type": "block-input",
					"acceptType": "all",
					"name": "ar1aPN",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "H"
				}, {
					"blockInputId": "HEIGHT",
					"type": "block-input",
					"acceptType": "all",
					"name": "gptfLo",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{U8G}.drawXBMP({XPOS}, {YPOS}, {WIDTH}, {HEIGHT}, {DATA});",
				"tags": ["module"],
				"module": "u8g",
				"uid": "kwnsvN"
			}, {
				"type": "statement",
				"name": "u8gDefineBitmap",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "r067kz"
				}],
				"content": [{
					"type": "text",
					"value": "定义OLED (IIC)位图"
				}, {
					"id": "NAME",
					"type": "string-input",
					"placeholder": "名字"
				}, {
					"type": "text",
					"value": "="
				}, {
					"blockInputId": "DATA",
					"type": "block-input",
					"acceptType": "all",
					"name": "r067kz",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "rawInput",
							"placeholder": "位图数据"
						}],
						"name": "rawInput"
					}
				}],
				"code": "static unsigned char {NAME}[] U8G_PROGMEM = {{DATA}};",
				"tags": ["module"],
				"module": "u8g",
				"uid": "KkS3LQ"
			}],
			"imageUrl": "assets/image/components/u8g.svg"
		}, {
			"uid": "VGhS46",
			"name": "ssd1306",
			"defaultVarName": "display",
			"label": "OLED模块(SPI)",
			"type": "ssd1306",
			"category": "action",
			"boards": ["Arduino"],
			"width": 90,
			"height": 90,
			"pins": [{
				"name": "SCK",
				"anchor": [0.1, 0],
				"tags": ["digital"],
				"label": "SCK",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "SDA",
				"anchor": [0.3, 0],
				"tags": ["digital"],
				"label": "SDA",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "RES",
				"anchor": [0.5, 0],
				"tags": ["digital"],
				"label": "RES",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "DC",
				"anchor": [0.7, 0],
				"tags": ["digital"],
				"label": "DC",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "CS",
				"anchor": [0.9, 0],
				"tags": ["digital"],
				"label": "CS",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"include": "#include <SPI.h>\n#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>",
				"var": "Adafruit_SSD1306 {NAME}({SDA}, {SCK}, {DC}, {RES}, {CS});",
				"setup": "{NAME}.begin();\n{NAME}.clearDisplay();"
			},
			"blocks": [{
				"type": "statement",
				"name": "ssd1306Display",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (SPI)"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "ssd1306s"
				}, {
					"type": "text",
					"value": "显示"
				}],
				"code": "{OLED}.display();",
				"tags": ["module"],
				"module": "ssd1306",
				"uid": "ngyLp4"
			}, {
				"type": "statement",
				"name": "ssd1306ClearDisplay",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (SPI)"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "ssd1306s"
				}, {
					"type": "text",
					"value": "清屏"
				}],
				"code": "{OLED}.clearDisplay();",
				"tags": ["module"],
				"module": "ssd1306",
				"uid": "ngyLp4"
			}, {
				"type": "statement",
				"name": "ssd1306DrawPixel",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "u8Zc5O"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "9sfpOM"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (SPI)"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "ssd1306s"
				}, {
					"type": "text",
					"value": "画点"
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "u8Zc5O",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "9sfpOM",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.drawPixel({XPOS}, {YPOS}, WHITE);",
				"tags": ["module"],
				"module": "ssd1306",
				"uid": "kWQHav"
			}, {
				"type": "statement",
				"name": "ssd1306DrawLine",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "xnFKUV"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "TuY7sW"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "SWFhxn"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "DzhmtY"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (SPI)"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "ssd1306s"
				}, {
					"type": "text",
					"value": "画线"
				}, {
					"type": "text",
					"value": "X1"
				}, {
					"blockInputId": "X1",
					"type": "block-input",
					"acceptType": "all",
					"name": "xnFKUV",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y1"
				}, {
					"blockInputId": "Y1",
					"type": "block-input",
					"acceptType": "all",
					"name": "TuY7sW",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "X2"
				}, {
					"blockInputId": "X2",
					"type": "block-input",
					"acceptType": "all",
					"name": "SWFhxn",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y2"
				}, {
					"blockInputId": "Y2",
					"type": "block-input",
					"acceptType": "all",
					"name": "DzhmtY",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.drawLine({X1}, {Y1}, {X2}, {Y2}, WHITE);",
				"tags": ["module"],
				"module": "ssd1306",
				"uid": "tvtUyz"
			}, {
				"type": "statement",
				"name": "ssd1306DrawRect",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "LKZ9hb"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "yT4PyN"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "Av2U9R"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "Ub0iW1"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (SPI)"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "ssd1306s"
				}, {
					"type": "text",
					"value": "画"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "空心矩形",
						"value": "drawRect"
					}, {
						"label": "实心矩形",
						"value": "fillRect"
					}]
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "LKZ9hb",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "yT4PyN",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "W"
				}, {
					"blockInputId": "WIDTH",
					"type": "block-input",
					"acceptType": "all",
					"name": "Av2U9R",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "H"
				}, {
					"blockInputId": "HEIGHT",
					"type": "block-input",
					"acceptType": "all",
					"name": "Ub0iW1",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.{OP}({XPOS}, {YPOS}, {WIDTH}, {HEIGHT}, WHITE);",
				"tags": ["module"],
				"module": "ssd1306",
				"uid": "Co4kKp"
			}, {
				"type": "statement",
				"name": "ssd1306DrawCircle",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "hWuQ5u"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "v3vs50"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "VTo0gu"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (SPI)"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "ssd1306s"
				}, {
					"type": "text",
					"value": "画"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "空心圆",
						"value": "drawCircle"
					}, {
						"label": "实心圆",
						"value": "fillCircle"
					}]
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "hWuQ5u",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "v3vs50",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "R"
				}, {
					"blockInputId": "RADIUS",
					"type": "block-input",
					"acceptType": "all",
					"name": "VTo0gu",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.{OP}({XPOS}, {YPOS}, {RADIUS}, WHITE);",
				"tags": ["module"],
				"module": "ssd1306",
				"uid": "PrgK44"
			}, {
				"type": "statement",
				"name": "ssd1306DrawRoundRect",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "Ng7zJB"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "S5fEIQ"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "qkCny5"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "D4WITz"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "CMsREi"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (SPI)"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "ssd1306s"
				}, {
					"type": "text",
					"value": "画"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "空心圆角矩形",
						"value": "drawRoundRect"
					}, {
						"label": "实心圆角矩形",
						"value": "fillRoundRect"
					}]
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "Ng7zJB",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "S5fEIQ",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "W"
				}, {
					"blockInputId": "W",
					"type": "block-input",
					"acceptType": "all",
					"name": "qkCny5",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "H"
				}, {
					"blockInputId": "HEIGHT",
					"type": "block-input",
					"acceptType": "all",
					"name": "D4WITz",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "R"
				}, {
					"blockInputId": "RADIUS",
					"type": "block-input",
					"acceptType": "all",
					"name": "CMsREi",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.{OP}({XPOS}, {YPOS}, {WIDTH}, {HEIGHT}, {RADIUS}, WHITE);",
				"tags": ["module"],
				"module": "ssd1306",
				"uid": "ICRqMG"
			}, {
				"type": "statement",
				"name": "ssd1306DrawTriangle",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "gYpfOt"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "pFmUa0"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "aumLdg"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "nm7qe0"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "8UpNXP"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "HqabR7"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (SPI)"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "ssd1306s"
				}, {
					"type": "text",
					"value": "画"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "空心三角形",
						"value": "drawTriangle"
					}, {
						"label": "实心三角形",
						"value": "fillTriangle"
					}]
				}, {
					"type": "text",
					"value": "X1"
				}, {
					"blockInputId": "X1",
					"type": "block-input",
					"acceptType": "all",
					"name": "gYpfOt",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y1"
				}, {
					"blockInputId": "Y1",
					"type": "block-input",
					"acceptType": "all",
					"name": "pFmUa0",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "X2"
				}, {
					"blockInputId": "X2",
					"type": "block-input",
					"acceptType": "all",
					"name": "aumLdg",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y2"
				}, {
					"blockInputId": "Y2",
					"type": "block-input",
					"acceptType": "all",
					"name": "nm7qe0",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "X3"
				}, {
					"blockInputId": "X3",
					"type": "block-input",
					"acceptType": "all",
					"name": "8UpNXP",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y3"
				}, {
					"blockInputId": "Y3",
					"type": "block-input",
					"acceptType": "all",
					"name": "HqabR7",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.{OP}({X1}, {Y2}, {X2}, {Y2}, {X3}, {Y3}, WHITE);",
				"tags": ["module"],
				"module": "ssd1306",
				"uid": "byzUZ5"
			}, {
				"type": "statement",
				"name": "ssd1306SetFont",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (SPI)"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "ssd1306s"
				}, {
					"type": "text",
					"value": "设置字体大小"
				}, {
					"id": "FONT",
					"type": "static-select",
					"options": [{
						"label": "小",
						"value": "1"
					}, {
						"label": "中",
						"value": "2"
					}, {
						"label": "大",
						"value": "3"
					}, {
						"label": "超大",
						"value": "4"
					}]
				}],
				"code": "{OLED}.setTextSize({FONT});",
				"tags": ["module"],
				"module": "ssd1306",
				"uid": "4XPzRS"
			}, {
				"type": "statement",
				"name": "ssd1306SetColor",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (SPI)"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "ssd1306s"
				}, {
					"type": "text",
					"value": "设置下句颜色"
				}, {
					"id": "COLOR",
					"type": "static-select",
					"options": [{
						"label": "白字",
						"value": "WHITE"
					}, {
						"label": "白底黑字",
						"value": "BLACK"
					}]
				}],
				"code": "{OLED}.setTextColor({COLOR});",
				"tags": ["module"],
				"module": "ssd1306",
				"uid": "xMlvvd"
			}, {
				"type": "statement",
				"name": "ssd1306SetCursor",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "A7chav"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "yKUwqp"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (SPI)"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "ssd1306s"
				}, {
					"type": "text",
					"value": "下句显示位置"
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "A7chav",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "yKUwqp",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.setCursor({XPOS}, {YPOS});",
				"tags": ["module"],
				"module": "ssd1306",
				"uid": "ZldNQF"
			}, {
				"type": "statement",
				"name": "ssd1306Print",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "4OZOMV"
				}],
				"content": [{
					"type": "text",
					"value": "OLED (SPI)"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "ssd1306s"
				}, {
					"type": "text",
					"value": "显示"
				}, {
					"blockInputId": "DATA",
					"type": "block-input",
					"acceptType": "all",
					"name": "4OZOMV",
					"value": {
						"content": [{
							"id": "TEXT",
							"type": "string-input",
							"value": "Hello, world",
							"placeholder": "内容"
						}],
						"name": "string"
					}
				}],
				"code": "{OLED}.println({DATA});",
				"tags": ["module"],
				"module": "ssd1306",
				"uid": "adiYhp"
			}],
			"imageUrl": "assets/image/components/ssd1306.svg"
		}, {
			"uid": "8a8l6X",
			"name": "nokia5110",
			"defaultVarName": "display",
			"label": "Nokia 5110(硬SPI)",
			"type": "nokia5110",
			"category": "action",
			"boards": ["Arduino"],
			"width": 90,
			"height": 90,
			"pins": [{
				"name": "RST",
				"anchor": [0.25, 0],
				"tags": ["digital"],
				"label": "RST",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "CE",
				"anchor": [0.5, 0],
				"tags": ["digital"],
				"label": "CE",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "DC",
				"anchor": [0.75, 0],
				"tags": ["digital"],
				"label": "DC",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"include": "#include <SPI.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_PCD8544.h>",
				"var": "Adafruit_PCD8544 {NAME}({DC}, {CE}, {RST});",
				"setup": "{NAME}.begin();\n{NAME}.clearDisplay();\n{NAME}.setContrast(50);"
			},
			"blocks": [{
				"type": "statement",
				"name": "nokia5110Display",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "Nokia 5110"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "nokia5110s"
				}, {
					"type": "text",
					"value": "显示"
				}],
				"code": "{OLED}.display();",
				"tags": ["module"],
				"module": "nokia5110",
				"uid": "NNTt1j"
			}, {
				"type": "statement",
				"name": "nokia5110ClearDisplay",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "Nokia 5110"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "nokia5110s"
				}, {
					"type": "text",
					"value": "清屏"
				}],
				"code": "{OLED}.clearDisplay();",
				"tags": ["module"],
				"module": "nokia5110",
				"uid": "NNTt1j"
			}, {
				"type": "statement",
				"name": "nokia5110DrawPixel",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "DGJAen"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "33eEeC"
				}],
				"content": [{
					"type": "text",
					"value": "Nokia 5110"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "nokia5110s"
				}, {
					"type": "text",
					"value": "画点"
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "DGJAen",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "33eEeC",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.drawPixel({XPOS}, {YPOS}, BLACK);",
				"tags": ["module"],
				"module": "nokia5110",
				"uid": "Gt1bgv"
			}, {
				"type": "statement",
				"name": "nokia5110DrawLine",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "cX7nPX"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "lVjfU1"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "PPqUtp"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "Ng8eps"
				}],
				"content": [{
					"type": "text",
					"value": "Nokia 5110"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "nokia5110s"
				}, {
					"type": "text",
					"value": "画线"
				}, {
					"type": "text",
					"value": "X1"
				}, {
					"blockInputId": "X1",
					"type": "block-input",
					"acceptType": "all",
					"name": "cX7nPX",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y1"
				}, {
					"blockInputId": "Y1",
					"type": "block-input",
					"acceptType": "all",
					"name": "lVjfU1",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "X2"
				}, {
					"blockInputId": "X2",
					"type": "block-input",
					"acceptType": "all",
					"name": "PPqUtp",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y2"
				}, {
					"blockInputId": "Y2",
					"type": "block-input",
					"acceptType": "all",
					"name": "Ng8eps",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.drawLine({X1}, {Y1}, {X2}, {Y2}, BLACK);",
				"tags": ["module"],
				"module": "nokia5110",
				"uid": "gLtihA"
			}, {
				"type": "statement",
				"name": "nokia5110DrawRect",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "80g43g"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "uHZLPA"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "iu6Ap4"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "WXs2zc"
				}],
				"content": [{
					"type": "text",
					"value": "Nokia 5110"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "nokia5110s"
				}, {
					"type": "text",
					"value": "画"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "空心矩形",
						"value": "drawRect"
					}, {
						"label": "实心矩形",
						"value": "fillRect"
					}]
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "80g43g",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "uHZLPA",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "W"
				}, {
					"blockInputId": "WIDTH",
					"type": "block-input",
					"acceptType": "all",
					"name": "iu6Ap4",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "H"
				}, {
					"blockInputId": "HEIGHT",
					"type": "block-input",
					"acceptType": "all",
					"name": "WXs2zc",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.{OP}({XPOS}, {YPOS}, {WIDTH}, {HEIGHT}, BLACK);",
				"tags": ["module"],
				"module": "nokia5110",
				"uid": "OXeXoD"
			}, {
				"type": "statement",
				"name": "nokia5110DrawCircle",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "cwtbyL"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "ieKL2j"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "s1M6Vr"
				}],
				"content": [{
					"type": "text",
					"value": "Nokia 5110"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "nokia5110s"
				}, {
					"type": "text",
					"value": "画"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "空心圆",
						"value": "drawCircle"
					}, {
						"label": "实心圆",
						"value": "fillCircle"
					}]
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "cwtbyL",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "ieKL2j",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "R"
				}, {
					"blockInputId": "RADIUS",
					"type": "block-input",
					"acceptType": "all",
					"name": "s1M6Vr",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.{OP}({XPOS}, {YPOS}, {RADIUS}, BLACK);",
				"tags": ["module"],
				"module": "nokia5110",
				"uid": "bDrZIU"
			}, {
				"type": "statement",
				"name": "nokia5110DrawRoundRect",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "nHXMnZ"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "dFmsAr"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "u9FV4q"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "3lATbH"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "6UG0Fj"
				}],
				"content": [{
					"type": "text",
					"value": "Nokia 5110"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "nokia5110s"
				}, {
					"type": "text",
					"value": "画"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "空心圆角矩形",
						"value": "drawRoundRect"
					}, {
						"label": "实心圆角矩形",
						"value": "fillRoundRect"
					}]
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "nHXMnZ",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "dFmsAr",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "W"
				}, {
					"blockInputId": "W",
					"type": "block-input",
					"acceptType": "all",
					"name": "u9FV4q",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "H"
				}, {
					"blockInputId": "HEIGHT",
					"type": "block-input",
					"acceptType": "all",
					"name": "3lATbH",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "R"
				}, {
					"blockInputId": "RADIUS",
					"type": "block-input",
					"acceptType": "all",
					"name": "6UG0Fj",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.{OP}({XPOS}, {YPOS}, {WIDTH}, {HEIGHT}, {RADIUS}, BLACK);",
				"tags": ["module"],
				"module": "nokia5110",
				"uid": "W6tzsc"
			}, {
				"type": "statement",
				"name": "nokia5110DrawTriangle",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "tqWpjK"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "3WAhaz"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "4DNV2v"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "iKS3Gw"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "tkLkSB"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "7wwBfG"
				}],
				"content": [{
					"type": "text",
					"value": "Nokia 5110"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "nokia5110s"
				}, {
					"type": "text",
					"value": "画"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "空心三角形",
						"value": "drawTriangle"
					}, {
						"label": "实心三角形",
						"value": "fillTriangle"
					}]
				}, {
					"type": "text",
					"value": "X1"
				}, {
					"blockInputId": "X1",
					"type": "block-input",
					"acceptType": "all",
					"name": "tqWpjK",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y1"
				}, {
					"blockInputId": "Y1",
					"type": "block-input",
					"acceptType": "all",
					"name": "3WAhaz",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "X2"
				}, {
					"blockInputId": "X2",
					"type": "block-input",
					"acceptType": "all",
					"name": "4DNV2v",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y2"
				}, {
					"blockInputId": "Y2",
					"type": "block-input",
					"acceptType": "all",
					"name": "iKS3Gw",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "X3"
				}, {
					"blockInputId": "X3",
					"type": "block-input",
					"acceptType": "all",
					"name": "tkLkSB",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y3"
				}, {
					"blockInputId": "Y3",
					"type": "block-input",
					"acceptType": "all",
					"name": "7wwBfG",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.{OP}({X1}, {Y2}, {X2}, {Y2}, {X3}, {Y3}, BLACK);",
				"tags": ["module"],
				"module": "nokia5110",
				"uid": "MfwMhm"
			}, {
				"type": "statement",
				"name": "nokia5110SetContrast",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "WsVahq"
				}],
				"content": [{
					"type": "text",
					"value": "Nokia 5110"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "nokia5110s"
				}, {
					"type": "text",
					"value": "设置对比度"
				}, {
					"blockInputId": "VALUE",
					"type": "block-input",
					"acceptType": "all",
					"name": "WsVahq",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "50"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.setContrast({VALUE});",
				"tags": ["module"],
				"module": "nokia5110",
				"uid": "ZCYX4H"
			}, {
				"type": "statement",
				"name": "nokia5110SetFont",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "Nokia 5110"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "nokia5110s"
				}, {
					"type": "text",
					"value": "设置字体大小"
				}, {
					"id": "FONT",
					"type": "static-select",
					"options": [{
						"label": "小",
						"value": "1"
					}, {
						"label": "中",
						"value": "2"
					}, {
						"label": "大",
						"value": "3"
					}, {
						"label": "超大",
						"value": "4"
					}]
				}],
				"code": "{OLED}.setTextSize({FONT});",
				"tags": ["module"],
				"module": "nokia5110",
				"uid": "4hk8uT"
			}, {
				"type": "statement",
				"name": "nokia5110SetColor",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "Nokia 5110"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "nokia5110s"
				}, {
					"type": "text",
					"value": "设置下句颜色"
				}, {
					"id": "COLOR",
					"type": "static-select",
					"options": [{
						"label": "白字",
						"value": "BLACK"
					}, {
						"label": "白底黑字",
						"value": "WHITE"
					}]
				}],
				"code": "{OLED}.setTextColor({COLOR});",
				"tags": ["module"],
				"module": "nokia5110",
				"uid": "BP70mj"
			}, {
				"type": "statement",
				"name": "nokia5110SetCursor",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "nXQNHt"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "0XhVUD"
				}],
				"content": [{
					"type": "text",
					"value": "Nokia 5110"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "nokia5110s"
				}, {
					"type": "text",
					"value": "下句显示位置"
				}, {
					"type": "text",
					"value": "X"
				}, {
					"blockInputId": "XPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "nXQNHt",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "Y"
				}, {
					"blockInputId": "YPOS",
					"type": "block-input",
					"acceptType": "all",
					"name": "0XhVUD",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{OLED}.setCursor({XPOS}, {YPOS});",
				"tags": ["module"],
				"module": "nokia5110",
				"uid": "Ou1BTm"
			}, {
				"type": "statement",
				"name": "nokia5110Print",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "wuBiHi"
				}],
				"content": [{
					"type": "text",
					"value": "Nokia 5110"
				}, {
					"id": "OLED",
					"type": "dynamic-select",
					"options": "nokia5110s"
				}, {
					"type": "text",
					"value": "显示"
				}, {
					"blockInputId": "DATA",
					"type": "block-input",
					"acceptType": "all",
					"name": "wuBiHi",
					"value": {
						"content": [{
							"id": "TEXT",
							"type": "string-input",
							"value": "Hello, world",
							"placeholder": "内容"
						}],
						"name": "string"
					}
				}],
				"code": "{OLED}.println({DATA});",
				"tags": ["module"],
				"module": "nokia5110",
				"uid": "fy6FEr"
			}],
			"imageUrl": "assets/image/components/nokia5110.svg"
		}, {
			"uid": "QQoXzM",
			"name": "rfid",
			"label": "RFID模块",
			"type": "mfrc522",
			"category": "action",
			"boards": ["Arduino"],
			"width": 90,
			"height": 120,
			"pins": [{
				"name": "SDA",
				"anchor": [0.33, 1],
				"tags": ["digital"],
				"label": "SDA",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "RST",
				"anchor": [0.67, 1],
				"tags": ["digital"],
				"label": "RST",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"include": "#include <SPI.h>\n#include <MFRC522.h>",
				"var": "MFRC522 {NAME}({SDA}, {RST});",
				"setup": "SPI.begin();\n{NAME}.PCD_Init();"
			},
			"blocks": [{
				"type": "output",
				"name": "mfrc522IsCardPresent",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "RFID"
				}, {
					"id": "{RFID}",
					"type": "dynamic-select",
					"options": "mfrc522s"
				}, {
					"type": "text",
					"value": "检测到有卡"
				}],
				"code": "{RFID}.PICC_IsNewCardPresent()",
				"returnType": {
					"type": "simple",
					"value": "bool"
				},
				"tags": ["module"],
				"module": "mfrc522",
				"uid": "pmRm5L"
			}, {
				"type": "output",
				"name": "mfrc522ReadCardSerial",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "RFID"
				}, {
					"id": "{RFID}",
					"type": "dynamic-select",
					"options": "mfrc522s"
				}, {
					"type": "text",
					"value": "当前卡号可读"
				}],
				"code": "{RFID}.PICC_ReadCardSerial()",
				"returnType": {
					"type": "simple",
					"value": "bool"
				},
				"tags": ["module"],
				"module": "mfrc522",
				"uid": "tZEcHX"
			}, {
				"type": "output",
				"name": "mfrc522GetTypeName",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "RFID"
				}, {
					"id": "{RFID}",
					"type": "dynamic-select",
					"options": "mfrc522s"
				}, {
					"type": "text",
					"value": "读取卡的类型"
				}],
				"code": "{RFID}.PICC_GetTypeName({RFID}.PICC_GetType({RFID}.uid.sak))",
				"returnType": {
					"type": "simple",
					"value": "String"
				},
				"tags": ["module"],
				"module": "mfrc522",
				"uid": "wLKwIb"
			}, {
				"type": "statement",
				"name": "mfrc522DumpCard",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "RFID"
				}, {
					"id": "RFID",
					"type": "dynamic-select",
					"options": "mfrc522s"
				}, {
					"type": "text",
					"value": "串口显示卡号"
				}],
				"code": "for(byte i = 0; i < {RFID}.uid.size; i++) {\n    Serial.print({RFID}.uid.uidByte[i] < 0x10 ? \" 0\" : \" \");\n    Serial.print({RFID}.uid.uidByte[i], HEX);\n}",
				"tags": ["module"],
				"module": "mfrc522",
				"uid": "hEl4fn"
			}, {
				"type": "statement",
				"name": "mfrc522DumpAllCard",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "RFID"
				}, {
					"id": "RFID",
					"type": "dynamic-select",
					"options": "mfrc522s"
				}, {
					"type": "text",
					"value": "串口显示卡片全部内容"
				}],
				"code": "{RFID}.PICC_DumpToSerial(&({RFID}.uid));",
				"tags": ["module"],
				"module": "mfrc522",
				"uid": "PdcmRD"
			}, {
				"type": "statement",
				"name": "mfrc522StopReadCard",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "RFID"
				}, {
					"id": "RFID",
					"type": "dynamic-select",
					"options": "mfrc522s"
				}, {
					"type": "text",
					"value": "停止读卡"
				}],
				"code": "{RFID}.PICC_HaltA();",
				"tags": ["module"],
				"module": "mfrc522",
				"uid": "duyrI6"
			}, {
				"type": "statement",
				"name": "mfrc522StopCryptol",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "RFID"
				}, {
					"id": "RFID",
					"type": "dynamic-select",
					"options": "mfrc522s"
				}, {
					"type": "text",
					"value": "准备读取下一张卡"
				}],
				"code": "{RFID}.PCD_StopCrypto1();",
				"tags": ["module"],
				"module": "mfrc522",
				"uid": "NozatW"
			}],
			"imageUrl": "assets/image/components/rfid.svg"
		}, {
			"uid": "siuztb",
			"name": "rtc",
			"defaultVarName": "rtc",
			"label": "时钟模块",
			"type": "rtc",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 90,
			"height": 90,
			"pins": [{
				"name": "RST",
				"anchor": [0.25, 0],
				"tags": ["digital", "analog-in"],
				"label": "RST",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "CLK",
				"anchor": [0.5, 0],
				"tags": ["digital", "analog-in"],
				"label": "CLK",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "DAT",
				"anchor": [0.75, 0],
				"tags": ["digital", "analog-in"],
				"label": "DAT",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"include": "#include <Wire.h>\n#include <RTClib.h>",
				"var": "DS1302 {NAME}({RST}, {CLK}, {DAT});",
				"setup": "Wire.begin();\n{NAME}.begin();\nif(!{NAME}.isrunning())\n{{NAME}.adjust(DateTime(__DATE__, __TIME__));\n}"
			},
			"blocks": [{
				"type": "statement",
				"name": "rtcSetTime",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "设置RTC"
				}, {
					"id": "RTC",
					"type": "dynamic-select",
					"options": "rtcs"
				}, {
					"type": "text",
					"value": "时间为系统时间"
				}],
				"code": "{RTC}.adjust(DateTime(__DATE__, __TIME__));",
				"tags": ["module"],
				"module": "rtc",
				"uid": "llRGTy"
			}, {
				"type": "statement",
				"name": "rtcSetTime2",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "6W6RzZ"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "TseaAD"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "GOmgpM"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "owt2Sx"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "h8kvnf"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "BEvJ2b"
				}],
				"content": [{
					"type": "text",
					"value": "设置RTC"
				}, {
					"id": "RTC",
					"type": "dynamic-select",
					"options": "rtcs"
				}, {
					"type": "text",
					"value": "时间为 年"
				}, {
					"blockInputId": "YEAR",
					"type": "block-input",
					"acceptType": "all",
					"name": "6W6RzZ",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "2018"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "/月"
				}, {
					"blockInputId": "MONTH",
					"type": "block-input",
					"acceptType": "all",
					"name": "TseaAD",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "1"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "/日"
				}, {
					"blockInputId": "DAY",
					"type": "block-input",
					"acceptType": "all",
					"name": "GOmgpM",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "1"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": "时"
				}, {
					"blockInputId": "HOUR",
					"type": "block-input",
					"acceptType": "all",
					"name": "owt2Sx",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "12"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": ":分"
				}, {
					"blockInputId": "MIN",
					"type": "block-input",
					"acceptType": "all",
					"name": "h8kvnf",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}, {
					"type": "text",
					"value": ":秒"
				}, {
					"blockInputId": "SEC",
					"type": "block-input",
					"acceptType": "all",
					"name": "BEvJ2b",
					"value": {
						"content": [{
							"id": "VALUE",
							"type": "number-input",
							"value": "0"
						}],
						"name": "number"
					}
				}],
				"code": "{RTC}.adjust(DateTime({YEAR}, {MONTH}, {DAY}, {HOUR}, {MIN}, {SEC}));",
				"tags": ["module"],
				"module": "rtc",
				"uid": "6LtoXb"
			}, {
				"type": "output",
				"name": "rtcGetTime",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "获取"
				}, {
					"id": "RTC",
					"type": "dynamic-select",
					"options": "rtcs"
				}, {
					"type": "text",
					"value": "的"
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "年",
						"value": "year",
						"type": "uint16_t"
					}, {
						"label": "月",
						"value": "month",
						"type": "uint8_t"
					}, {
						"label": "日",
						"value": "day",
						"type": "uint8_t"
					}, {
						"label": "星期几",
						"value": "getDayOfTheWeek",
						"type": "uint8_t"
					}, {
						"label": "时",
						"value": "hour",
						"type": "uint8_t"
					}, {
						"label": "分",
						"value": "minute",
						"type": "uint8_t"
					}, {
						"label": "秒",
						"value": "second",
						"type": "uint8_t"
					}]
				}],
				"code": "{RTC}.now().{OP}()",
				"returnType": {
					"type": "fromSelect",
					"id": "OP"
				},
				"tags": ["module"],
				"module": "rtc",
				"uid": "apjdJ2"
			}],
			"imageUrl": "assets/image/components/rtc.svg"
		}, {
			"uid": "hr5P4L",
			"name": "serial",
			"label": "串口模块",
			"type": "serial",
			"category": "function",
			"boards": ["Arduino", "upDuino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [1, 0.5],
				"tags": ["serial"],
				"spec": ["tag", "serial"],
				"label": "s",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"setup": "Serial.begin(9600);"
			},
			"blocks": [{
				"type": "statement",
				"name": "serialSend",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "KBtYqi"
				}],
				"content": [{
					"type": "text",
					"value": "串口"
				}, {
					"id": "SERIAL",
					"type": "dynamic-select",
					"options": "serials"
				}, {
					"type": "text",
					"value": "发送"
				}, {
					"blockInputId": "DATA",
					"type": "block-input",
					"acceptType": "all",
					"name": "KBtYqi"
				}, {
					"id": "LN",
					"type": "static-select",
					"options": [{
						"label": "有换行符",
						"value": "println"
					}, {
						"label": "没有换行符",
						"value": "print"
					}, {
						"label": "二进制",
						"value": "write"
					}]
				}],
				"code": "{SERIAL}.{LN}({DATA});",
				"tags": ["always", "module"],
				"module": "serial",
				"uid": "p3UznJ"
			}, {
				"type": "statement",
				"name": "serialPrint",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "0eigsZ"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "GK7wF0"
				}],
				"content": [{
					"type": "text",
					"value": "串口"
				}, {
					"id": "SERIAL",
					"type": "dynamic-select",
					"options": "serials"
				}, {
					"type": "text",
					"value": "发送"
				}, {
					"blockInputId": "DATA",
					"type": "block-input",
					"acceptType": "all",
					"name": "0eigsZ"
				}, {
					"type": "text",
					"value": "格式"
				}, {
					"blockInputId": "FORMAT",
					"type": "block-input",
					"acceptType": "all",
					"name": "GK7wF0",
					"value": {
						"content": [{
							"id": "FORMAT",
							"type": "static-select",
							"value": "DEC"
						}],
						"name": "dataFormat"
					}
				}, {
					"id": "OP",
					"type": "static-select",
					"options": [{
						"label": "有换行符",
						"value": "println"
					}, {
						"label": "没有换行符",
						"value": "print"
					}]
				}],
				"code": "{SERIAL}.{OP}({DATA}, {FORMAT});",
				"tags": ["always", "module", "advanced"],
				"module": "serial",
				"uid": "zLOiPK"
			}, {
				"type": "statement",
				"name": "serialSendAdvanced",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "串口"
				}, {
					"id": "SERIAL",
					"type": "dynamic-select",
					"options": "serials"
				}, {
					"type": "text",
					"value": "打印"
				}, {
					"id": "LN",
					"type": "static-select",
					"options": [{
						"label": "有换行符",
						"value": "println"
					}, {
						"label": "没有换行符",
						"value": "write"
					}]
				}],
				"code": "while({SERIAL}.available() > 0) {{SERIAL}.{LN}({SERIAL}.read());}",
				"tags": ["module", "advanced"],
				"module": "serial",
				"uid": "jlHqUs"
			}, {
				"type": "output",
				"name": "serialReceive",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "接收串口"
				}, {
					"id": "SERIAL",
					"type": "dynamic-select",
					"options": "serials"
				}, {
					"type": "text",
					"value": "的数据"
				}],
				"code": "{SERIAL}.read()",
				"returnType": {
					"type": "simple",
					"value": "char"
				},
				"tags": ["module"],
				"module": "serial",
				"uid": "riThuE"
			}, {
				"type": "output",
				"name": "serialAvailable",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "返回串口"
				}, {
					"id": "SERIAL",
					"type": "dynamic-select",
					"options": "serials"
				}, {
					"type": "text",
					"value": "可读数据长度"
				}],
				"code": "{SERIAL}.available()",
				"returnType": {
					"type": "simple",
					"value": "bool"
				},
				"tags": ["module", "advanced"],
				"module": "serial",
				"uid": "lBwj1v"
			}, {
				"type": "statement-input",
				"name": "serialIfAvailable",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-root",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "如果串口"
				}, {
					"id": "SERIAL",
					"type": "dynamic-select",
					"options": "serials"
				}, {
					"type": "text",
					"value": "有数据可读"
				}],
				"code": "if({SERIAL}.available()){\n{STATEMENTS}\n}",
				"tags": ["module"],
				"module": "serial",
				"uid": "9T7K8X"
			}, {
				"type": "statement",
				"name": "serialWrite",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}, {
					"type": "connector-input",
					"accept": "connector-output",
					"acceptType": "all",
					"name": "PzDXZH"
				}],
				"content": [{
					"type": "text",
					"value": "串口"
				}, {
					"id": "SERIAL",
					"type": "dynamic-select",
					"options": "serials"
				}, {
					"type": "text",
					"value": "输出二进制流"
				}, {
					"blockInputId": "DATA",
					"type": "block-input",
					"acceptType": "all",
					"name": "PzDXZH"
				}],
				"code": "{SERIAL}.write({DATA});",
				"tags": ["module", "advanced"],
				"module": "serial",
				"uid": "6yQc6n"
			}, {
				"type": "statement",
				"name": "serialBeginAdvanced",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "串口"
				}, {
					"id": "SERIAL",
					"type": "dynamic-select",
					"options": "serials"
				}, {
					"type": "text",
					"value": "设置波特率"
				}, {
					"id": "BAUDRATE",
					"type": "static-select",
					"options": [{
						"label": "300",
						"value": "300"
					}, {
						"label": "1200",
						"value": "1200"
					}, {
						"label": "2400",
						"value": "2400"
					}, {
						"label": "4800",
						"value": "4800"
					}, {
						"label": "9600",
						"value": "9600"
					}, {
						"label": "19200",
						"value": "19200"
					}, {
						"label": "38400",
						"value": "38400"
					}, {
						"label": "57600",
						"value": "57600"
					}, {
						"label": "115200",
						"value": "115200"
					}],
					"value": "9600"
				}],
				"code": "{SERIAL}.begin({BAUDRATE});",
				"tags": ["module", "advanced"],
				"module": "serial",
				"uid": "fkhrsR"
			}],
			"imageUrl": "assets/image/components/serial.svg"
		}, {
			"uid": "AyR8kQ",
			"name": "serial2",
			"label": "软串口",
			"type": "serial",
			"category": "function",
			"boards": ["Arduino", "upDuino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "rxd",
				"anchor": [0.333, 1],
				"tags": ["digital", "analog-in"],
				"label": "rxd",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "txd",
				"anchor": [0.667, 1],
				"tags": ["digital", "analog-in"],
				"label": "txd",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"setup": "Serial.begin(9600);"
			},
			"blocks": [],
			"imageUrl": "assets/image/components/serial.svg"
		}, {
			"uid": "4erQi6",
			"name": "bluetooth",
			"label": "蓝牙模块",
			"type": "serial",
			"category": "function",
			"boards": ["Arduino"],
			"width": 90,
			"height": 90,
			"pins": [{
				"name": "rxd",
				"anchor": [0.33, 1],
				"tags": ["digital", "analog-in"],
				"label": "rxd",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "txd",
				"anchor": [0.67, 1],
				"tags": ["digital", "analog-in"],
				"label": "txd",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"setup": "Serial.begin(9600);"
			},
			"blocks": [],
			"imageUrl": "assets/image/components/bluetooth.svg"
		}, {
			"uid": "XHqwvv",
			"name": "wifi",
			"label": "wifi模块",
			"type": "serial",
			"category": "function",
			"boards": ["Arduino"],
			"width": 90,
			"height": 90,
			"pins": [{
				"name": "rxd",
				"anchor": [0.33, 1],
				"tags": ["digital", "analog-in"],
				"label": "rxd",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}, {
				"name": "txd",
				"anchor": [0.67, 1],
				"tags": ["digital", "analog-in"],
				"label": "txd",
				"shape": "Dot",
				"rotate": false,
				"overlay": [0.5, -1]
			}],
			"code": {
				"setup": "Serial.begin(9600);"
			},
			"blocks": [],
			"imageUrl": "assets/image/components/wifi.svg"
		}]
	};

	schema.packages.push(builtInPackage);

	return schema;
});
