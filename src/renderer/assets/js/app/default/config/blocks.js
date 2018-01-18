define(function() {
	var blocks = [{
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
		"code": "// {COMMENT}",
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
	}];

	return blocks;
});
