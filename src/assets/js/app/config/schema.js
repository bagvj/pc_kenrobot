define(['vendor/lodash'], function($1) {
	var schema = {
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
				"value": "float"
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
				"value": "float"
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
				"value": "电机"
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
				"value": "电机"
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
				"value": "float"
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
				"value": "float"
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
				"value": "电机"
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
				"blockInputId": "ARG1",
				"type": "block-input",
				"acceptType": "String",
				"name": "nkbOkw"
			}, {
				"type": "text",
				"value": "+"
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
			"name": "number",
			"connectors": [{
				"type": "connector-output",
				"accept": "connector-input"
			}],
			"content": [{
				"id": "VALUE",
				"type": "number-input",
				"value": 0
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
					"value": "String *"
				}, {
					"label": "字符",
					"value": "char *"
				}]
			}],
			"code": "({TYPE})malloc({VALUE}*sizeof({TYPE.withoutAsterisk}))",
			"returnType": {
				"type": "fromDropdown",
				"id": "TYPE",
				"options": "vars"
			},
			"tags": ["data", "advanced"],
			"uid": "vQnRye"
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
				"id": "TEXT",
				"type": "char-input",
				"placeholder": "字符"
			}, {
				"type": "text",
				"value": "'"
			}],
			"code": "'{TEXT}'",
			"returnType": {
				"type": "simple",
				"value": "char"
			},
			"tags": ["data", "advanced"],
			"uid": "iltYPk"
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
					"value": "float *"
				}, {
					"label": "整数",
					"value": "int *"
				}]
			}],
			"code": "({TYPE})malloc({VALUE}*sizeof({TYPE.withoutAsterisk}))",
			"returnType": {
				"type": "fromSelect",
				"id": "TYPE",
				"options": "vars"
			},
			"tags": ["data", "advanced"],
			"uid": "QEMney"
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
				"pointer": "true",
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
				"acceptType": {
					"type": "fromDynamicSelect",
					"id": "NAME",
					"pointer": "true",
					"options": "vars"
				},
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
				"acceptType": {
					"type": "fromDynamicSelect",
					"id": "NAME",
					"pointer": "true",
					"options": "vars"
				},
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
				"pointer": "true",
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
				"type": "text",
				"value": "="
			}, {
				"blockInputId": "VALUE",
				"type": "block-input",
				"acceptType": "all",
				"name": "FfAMeF"
			}],
			"returnType": {
				"type": "fromDropdown",
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
			"code": "void {FUNCNAME}(){{STATEMENTS}}",
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
			"code": "{RETURN.connectionType} {FUNCNAME}() {{STATEMENTS}return {RETURN};}",
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
			"code": "void {FUNCNAME} ({ARGS}){{STATEMENTS}}",
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
			"code": "{RETURN.connectionType} {FUNCNAME} ({ARGS}) {{STATEMENTS}return {RETURN};}",
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
				"type": "fromDropdown",
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
			"code": "if({ARG1} {OPERATOR} {ARG2}){{STATEMENTS}}",
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
			"code": "else if ({ARG1} {OPERATOR} {ARG2}){{STATEMENTS}}",
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
			"code": "else {{STATEMENTS}}",
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
			"code": "switch (int({VAR})) {{STATEMENTS}}",
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
			"code": "'for({VAR}={INIT};{VAR}' + ('{MODE}' === '+'?'<=':'>=' ) + '{FINAL};{VAR}{MODE}={ADD}){{STATEMENTS}}'",
			"eval": true,
			"tags": ["logic"],
			"uid": "0ByIUU"
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
			"code": "while ({ARG1} {OPERATOR} {ARG2}){{STATEMENTS}}",
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
			"code": "case {VAR}:{{STATEMENTS}break;}",
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
			"code": "default:{{STATEMENTS}break;}",
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
			"code": "else {{STATEMENTS}}",
			"tags": ["logic"],
			"uid": "kEK1px"
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
			"code": "if({CONDITION}){{STATEMENTS}}",
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
			"code": "else if ({VAR}){{STATEMENTS}}",
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
			"code": "'for({VAR}={INIT};{VAR}' + ('{MODE}' === '+'?'<=':'>=' ) + '{FINAL};{VAR}{MODE}={ADD}){{STATEMENTS}}'",
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
			"code": "switch (int({VAR})) {{STATEMENTS}}",
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
			"code": "while ({CONDITION}){{STATEMENTS}}",
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
		"name": "kenrobot",
		"boards": [{
			"label": "Arduino UNO",
			"name": "ArduinoUNO",
			"type": "uno",
			"fqbn": "arduino:avr:uno:cpu=atmega328p",
			"tags": ["Arduino"],
			"pins": [{
				"uid": "VB05cG",
				"width": 9,
				"height": 12,
				"x": 0.479,
				"y": 0.088,
				"name": "13",
				"tags": ["digital"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "7kNSUd",
				"width": 9,
				"height": 12,
				"x": 0.513,
				"y": 0.088,
				"name": "12",
				"tags": ["digital"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "p0Yjne",
				"width": 9,
				"height": 12,
				"x": 0.547,
				"y": 0.088,
				"name": "11",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "q6rOYR",
				"width": 9,
				"height": 12,
				"x": 0.581,
				"y": 0.088,
				"name": "10",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "Z29m2f",
				"width": 9,
				"height": 12,
				"x": 0.615,
				"y": 0.088,
				"name": "9",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "8aVQDp",
				"width": 9,
				"height": 12,
				"x": 0.649,
				"y": 0.088,
				"name": "8",
				"tags": ["digital"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "PnAa1t",
				"width": 9,
				"height": 12,
				"x": 0.704,
				"y": 0.088,
				"name": "7",
				"tags": ["digital"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "xKpFzi",
				"width": 9,
				"height": 12,
				"x": 0.738,
				"y": 0.088,
				"name": "6",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "0gRT2X",
				"width": 9,
				"height": 12,
				"x": 0.772,
				"y": 0.088,
				"name": "5",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "q1DUJD",
				"width": 9,
				"height": 12,
				"x": 0.804,
				"y": 0.088,
				"name": "4",
				"tags": ["digital"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "5XIyXm",
				"width": 9,
				"height": 12,
				"x": 0.838,
				"y": 0.088,
				"name": "3",
				"tags": ["digital", "analog-out", "init"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "Z9Y9P2",
				"width": 9,
				"height": 12,
				"x": 0.872,
				"y": 0.088,
				"name": "2",
				"tags": ["digital", "init"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "Zpi42g",
				"width": 9,
				"height": 12,
				"x": 0.906,
				"y": 0.088,
				"name": "1",
				"tags": ["digital", "serial-rx"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "Zpi42g",
				"width": 9,
				"height": 12,
				"x": 0.94,
				"y": 0.088,
				"name": "0",
				"tags": ["digital", "serial-tx"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "1jcO2Y",
				"width": 9,
				"height": 12,
				"x": 0.77,
				"y": 0.935,
				"name": "A0",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "qiTIRc",
				"width": 9,
				"height": 12,
				"x": 0.804,
				"y": 0.935,
				"name": "A1",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "AihHpE",
				"width": 9,
				"height": 12,
				"x": 0.838,
				"y": 0.935,
				"name": "A2",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "M4KhMo",
				"width": 9,
				"height": 12,
				"x": 0.872,
				"y": 0.935,
				"name": "A3",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "PBQRkE",
				"width": 9,
				"height": 12,
				"x": 0.906,
				"y": 0.935,
				"name": "A4",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "rjJtrb",
				"width": 9,
				"height": 12,
				"x": 0.94,
				"y": 0.935,
				"name": "A5",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"width": 32,
				"height": 62,
				"x": 0.045,
				"y": 0.321,
				"name": "Serial",
				"tags": ["serial"],
				"uid": "q9OAeR",
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}],
			"uid": "8gEwUv",
			"imageUrl": "assets/image/boards/ArduinoUNO.png"
		}, {
			"label": "Arduino Leonardo",
			"name": "ArduinoLeonardo",
			"type": "leonardo",
			"fqbn": "arduino:avr:leonardo:cpu=atmega32u4",
			"tags": ["Arduino"],
			"pins": [{
				"uid": "B54jYH",
				"width": 9,
				"height": 12,
				"x": 0.432,
				"y": 0.049,
				"name": "13",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "nPk3wi",
				"width": 9,
				"height": 12,
				"x": 0.469,
				"y": 0.049,
				"name": "12",
				"tags": ["digital"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "5f8Iu5",
				"width": 9,
				"height": 12,
				"x": 0.506,
				"y": 0.049,
				"name": "11",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "mYZ8m1",
				"width": 9,
				"height": 12,
				"x": 0.542,
				"y": 0.049,
				"name": "10",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "R0NsXG",
				"width": 9,
				"height": 12,
				"x": 0.579,
				"y": 0.049,
				"name": "9",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "e8Cir0",
				"width": 9,
				"height": 12,
				"x": 0.615,
				"y": 0.049,
				"name": "8",
				"tags": ["digital"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "c3BtK4",
				"width": 9,
				"height": 12,
				"x": 0.669,
				"y": 0.049,
				"name": "7",
				"tags": ["digital"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "xGtGX9",
				"width": 9,
				"height": 12,
				"x": 0.706,
				"y": 0.049,
				"name": "6",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "q01tAI",
				"width": 9,
				"height": 12,
				"x": 0.742,
				"y": 0.049,
				"name": "5",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "VkPW5i",
				"width": 9,
				"height": 12,
				"x": 0.779,
				"y": 0.049,
				"name": "4",
				"tags": ["digital"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "BDDbG4",
				"width": 9,
				"height": 12,
				"x": 0.815,
				"y": 0.049,
				"name": "3",
				"tags": ["digital", "analog-out", "init"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "ZHqDKX",
				"width": 9,
				"height": 12,
				"x": 0.852,
				"y": 0.049,
				"name": "2",
				"tags": ["digital", "init"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "HOxHq3",
				"width": 9,
				"height": 12,
				"x": 0.889,
				"y": 0.049,
				"name": "1",
				"tags": ["digital", "serial-rx", "init"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "lFZMVY",
				"width": 9,
				"height": 12,
				"x": 0.925,
				"y": 0.049,
				"name": "0",
				"tags": ["digital", "serial-tx", "init"],
				"overlay": [0.5, 1.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "vrii22",
				"width": 9,
				"height": 12,
				"x": 0.742,
				"y": 0.953,
				"name": "A0",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "BmWSfi",
				"width": 9,
				"height": 12,
				"x": 0.779,
				"y": 0.953,
				"name": "A1",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "1XiZOV",
				"width": 9,
				"height": 12,
				"x": 0.815,
				"y": 0.953,
				"name": "A2",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "1tGtL0",
				"width": 9,
				"height": 12,
				"x": 0.852,
				"y": 0.953,
				"name": "A3",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "Z9hMY9",
				"width": 9,
				"height": 12,
				"x": 0.889,
				"y": 0.953,
				"name": "A4",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "JYrcfH",
				"width": 9,
				"height": 12,
				"x": 0.925,
				"y": 0.953,
				"name": "A5",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"shape": "Rectangle",
				"rotate": false
			}],
			"uid": "LBgQBg",
			"imageUrl": "assets/image/boards/ArduinoLeonardo.png"
		}, {
			"label": "Arduino Nano",
			"name": "ArduinoNano",
			"type": "nano",
			"fqbn": "arduino:avr:nano:cpu=atmega328",
			"tags": ["Arduino"],
			"pins": [{
				"uid": "vSLvD4",
				"width": 9,
				"height": 12,
				"x": 0.123,
				"y": 0.723,
				"name": "13",
				"tags": ["digital"],
				"overlay": [0.5, 1.5],
				"label": "D13",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "vhk6ph",
				"width": 9,
				"height": 12,
				"x": 0.123,
				"y": 0.270,
				"name": "12",
				"tags": ["digital"],
				"overlay": [0.5, 1.5],
				"label": "D12",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "LdyiLN",
				"width": 9,
				"height": 12,
				"x": 0.179,
				"y": 0.270,
				"name": "11",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"label": "D11",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "tBijHq",
				"width": 9,
				"height": 12,
				"x": 0.235,
				"y": 0.270,
				"name": "10",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"label": "D10",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "P2wXjz",
				"width": 9,
				"height": 12,
				"x": 0.291,
				"y": 0.270,
				"name": "9",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"label": "D9",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "dnChSr",
				"width": 9,
				"height": 12,
				"x": 0.347,
				"y": 0.270,
				"name": "8",
				"tags": ["digital"],
				"overlay": [0.5, 1.5],
				"label": "D8",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "C9nfQW",
				"width": 9,
				"height": 12,
				"x": 0.403,
				"y": 0.270,
				"name": "7",
				"tags": ["digital"],
				"overlay": [0.5, 1.5],
				"label": "D7",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "ogwXSx",
				"width": 9,
				"height": 12,
				"x": 0.459,
				"y": 0.270,
				"name": "6",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"label": "D6",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "zu6pty",
				"width": 9,
				"height": 12,
				"x": 0.515,
				"y": 0.270,
				"name": "5",
				"tags": ["digital", "analog-out"],
				"overlay": [0.5, 1.5],
				"label": "D5",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "M9woPq",
				"width": 9,
				"height": 12,
				"x": 0.573,
				"y": 0.270,
				"name": "4",
				"tags": ["digital"],
				"overlay": [0.5, 1.5],
				"label": "D4",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "rk36KI",
				"width": 9,
				"height": 12,
				"x": 0.630,
				"y": 0.270,
				"name": "3",
				"tags": ["digital", "analog-out", "init"],
				"overlay": [0.5, 1.5],
				"label": "D3",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "LXk68E",
				"width": 9,
				"height": 12,
				"x": 0.686,
				"y": 0.270,
				"name": "2",
				"tags": ["digital", "init"],
				"overlay": [0.5, 1.5],
				"label": "D2",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "7E0kTK",
				"width": 9,
				"height": 12,
				"x": 0.910,
				"y": 0.270,
				"name": "1",
				"tags": ["digital", "serial-rx"],
				"overlay": [0.5, 1.5],
				"label": "RX0",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "Fb2du0",
				"width": 9,
				"height": 12,
				"x": 0.970,
				"y": 0.270,
				"name": "0",
				"tags": ["digital", "serial-tx"],
				"overlay": [0.5, 1.5],
				"label": "TX1",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "aRtN0J",
				"width": 9,
				"height": 12,
				"x": 0.291,
				"y": 0.723,
				"name": "A0",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"label": "A0",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "pEcC8b",
				"width": 9,
				"height": 12,
				"x": 0.347,
				"y": 0.723,
				"name": "A1",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"label": "A1",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "sWzXSN",
				"width": 9,
				"height": 12,
				"x": 0.403,
				"y": 0.723,
				"name": "A2",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"label": "A2",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "kSujwm",
				"width": 9,
				"height": 12,
				"x": 0.459,
				"y": 0.723,
				"name": "A3",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"label": "A3",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "KErlDM",
				"width": 9,
				"height": 12,
				"x": 0.515,
				"y": 0.723,
				"name": "A4",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"label": "A4",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "Xuwemj",
				"width": 9,
				"height": 12,
				"x": 0.573,
				"y": 0.723,
				"name": "A5",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"label": "A5",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "qZsHbG",
				"width": 9,
				"height": 12,
				"x": 0.630,
				"y": 0.723,
				"name": "A6",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"label": "A6",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "Tbge4E",
				"width": 9,
				"height": 12,
				"x": 0.686,
				"y": 0.723,
				"name": "A7",
				"tags": ["analog-in"],
				"overlay": [0.5, -0.5],
				"label": "A7",
				"shape": "Rectangle",
				"rotate": false
			}],
			"uid": "DqkZ3k",
			"imageUrl": "assets/image/boards/ArduinoNano.png"
		}, {
			"label": "Arduino/Genuino 101",
			"name": "Arduino101",
			"type": "genuino101",
			"fqbn": "Intel:arc32:arduino_101",
			"tags": ["Arduino"],
			"pins": [{
				"uid": "4KSv7l",
				"width": 9,
				"height": 12,
				"x": 0.475,
				"y": 0.07,
				"name": "13",
				"tags": ["digital", "init", "any"],
				"overlay": [0.5, 1.5],
				"label": "13",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "dNbH9e",
				"width": 9,
				"height": 12,
				"x": 0.506,
				"y": 0.07,
				"name": "12",
				"tags": ["digital", "init", "any"],
				"overlay": [0.5, 1.5],
				"label": "12",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "jYjBXk",
				"width": 9,
				"height": 12,
				"x": 0.537,
				"y": 0.07,
				"name": "11",
				"tags": ["digital", "init", "any"],
				"overlay": [0.5, 1.5],
				"label": "11",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "Q7rNbn",
				"width": 9,
				"height": 12,
				"x": 0.568,
				"y": 0.07,
				"name": "10",
				"tags": ["digital", "init", "any"],
				"overlay": [0.5, 1.5],
				"label": "10",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "ZWdX8a",
				"width": 9,
				"height": 12,
				"x": 0.599,
				"y": 0.07,
				"name": "9",
				"tags": ["digital", "analog-out", "init", "any"],
				"overlay": [0.5, 1.5],
				"label": "9",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "6ujNmZ",
				"width": 9,
				"height": 12,
				"x": 0.63,
				"y": 0.07,
				"name": "8",
				"tags": ["digital", "init", "any"],
				"overlay": [0.5, 1.5],
				"label": "8",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "uZgWrY",
				"width": 9,
				"height": 12,
				"x": 0.697,
				"y": 0.07,
				"name": "7",
				"tags": ["digital", "init", "any"],
				"overlay": [0.5, 1.5],
				"label": "7",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "6fx4LE",
				"width": 9,
				"height": 12,
				"x": 0.728,
				"y": 0.07,
				"name": "6",
				"tags": ["digital", "analog-out", "init", "any"],
				"overlay": [0.5, 1.5],
				"label": "6",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "6CpW3l",
				"width": 9,
				"height": 12,
				"x": 0.759,
				"y": 0.07,
				"name": "5",
				"tags": ["digital", "analog-out", "init", "any"],
				"overlay": [0.5, 1.5],
				"label": "5",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "GmUHNr",
				"width": 9,
				"height": 12,
				"x": 0.79,
				"y": 0.07,
				"name": "4",
				"tags": ["digital", "init", "any"],
				"overlay": [0.5, 1.5],
				"label": "4",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "k0H5GM",
				"width": 9,
				"height": 12,
				"x": 0.832,
				"y": 0.07,
				"name": "3",
				"tags": ["digital", "analog-out", "init", "any"],
				"overlay": [0.5, 1.5],
				"label": "3",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "Ixnbf8",
				"width": 9,
				"height": 12,
				"x": 0.864,
				"y": 0.07,
				"name": "2",
				"tags": ["digital", "init", "any"],
				"overlay": [0.5, 1.5],
				"label": "2",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "PteBrp",
				"width": 9,
				"height": 12,
				"x": 0.894,
				"y": 0.07,
				"name": "1",
				"tags": ["digital", "serial-rx", "init", "any"],
				"overlay": [0.5, 1.5],
				"label": "1",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "T4IYSf",
				"width": 9,
				"height": 12,
				"x": 0.925,
				"y": 0.07,
				"name": "0",
				"tags": ["digital", "serial-tx", "init", "any"],
				"overlay": [0.5, 1.5],
				"label": "0",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "NwwKuu",
				"width": 9,
				"height": 12,
				"x": 0.77,
				"y": 0.935,
				"name": "A0",
				"tags": ["analog-in", "init", "any"],
				"overlay": [0.5, -0.5],
				"label": "A0",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "xDgAlg",
				"width": 9,
				"height": 12,
				"x": 0.804,
				"y": 0.935,
				"name": "A1",
				"tags": ["analog-in", "init", "any"],
				"overlay": [0.5, -0.5],
				"label": "A1",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "Qy6B2J",
				"width": 9,
				"height": 12,
				"x": 0.838,
				"y": 0.935,
				"name": "A2",
				"tags": ["analog-in", "init", "any"],
				"overlay": [0.5, -0.5],
				"label": "A2",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "C3th8k",
				"width": 9,
				"height": 12,
				"x": 0.872,
				"y": 0.935,
				"name": "A3",
				"tags": ["analog-in", "init", "any"],
				"overlay": [0.5, -0.5],
				"label": "A3",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "9gAnIa",
				"width": 9,
				"height": 12,
				"x": 0.906,
				"y": 0.935,
				"name": "A4",
				"tags": ["analog-in", "init", "any"],
				"overlay": [0.5, -0.5],
				"label": "A4",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"uid": "zNiM0h",
				"width": 9,
				"height": 12,
				"x": 0.94,
				"y": 0.935,
				"name": "A5",
				"tags": ["analog-in", "init", "any"],
				"overlay": [0.5, -0.5],
				"label": "A5",
				"shape": "Rectangle",
				"rotate": false
			}, {
				"width": 32,
				"height": 60,
				"x": 0.04,
				"y": 0.296,
				"name": "Serial",
				"tags": ["serial"],
				"uid": "Ma1a8g",
				"overlay": [0.5, 1.5],
				"label": "Serial",
				"shape": "Rectangle",
				"rotate": false
			}],
			"uid": "o8qZHI",
			"imageUrl": "assets/image/boards/Arduino101.png",
			"hidden": true
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
			"imageUrl": "assets/image/components/button.png"
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
			"imageUrl": "assets/image/components/pot.png"
		}, {
			"uid": "Eeifb8",
			"name": "hts221",
			"label": "温湿度传感器",
			"type": "hts221",
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
				"name": "hts221Temperature",
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
					"options": "hts221s"
				}, {
					"type": "text",
					"value": "的温度"
				}],
				"code": "{SENSOR}.readTemperature()",
				"returnType": {
					"type": "simple",
					"value": "float"
				},
				"tags": ["module"],
				"module": "hts221",
				"uid": "d2guSS"
			}, {
				"type": "output",
				"name": "hts221Humidity",
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
					"options": "hts221s"
				}, {
					"type": "text",
					"value": "的湿度"
				}],
				"code": "{SENSOR}.readHumidity()",
				"returnType": {
					"type": "simple",
					"value": "float"
				},
				"tags": ["module"],
				"module": "hts221",
				"uid": "0o473f"
			}],
			"imageUrl": "assets/image/components/hts221.png"
		}, {
			"uid": "HRwNap",
			"name": "encoder",
			"label": "旋转编码器",
			"type": "encoder",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "k",
				"anchor": [0.25, 1],
				"tags": ["digital"],
				"label": "k",
				"shape": "Dot",
				"rotate": false
			}, {
				"name": "sa",
				"anchor": [0.5, 1],
				"tags": ["init"],
				"spec": "3",
				"label": "sa",
				"shape": "Dot",
				"rotate": false
			}, {
				"name": "sb",
				"anchor": [0.75, 1],
				"tags": ["init"],
				"spec": "2",
				"label": "sb",
				"shape": "Dot",
				"rotate": false
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
			"imageUrl": "assets/image/components/encoder.png"
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
			"imageUrl": "assets/image/components/infraredSensor.png"
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
			"imageUrl": "assets/image/components/lightSensor.png"
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
			"imageUrl": "assets/image/components/soundSensor.png"
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
			"imageUrl": "assets/image/components/limitSwitch.png"
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
			"imageUrl": "assets/image/components/touchSensor.png"
		}, {
			"uid": "0bVzdu",
			"name": "ultrasound",
			"label": "超声波",
			"type": "ultrasound",
			"category": "sensor",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "tri",
				"anchor": [0.333, 1],
				"tags": ["digital"],
				"label": "tri",
				"shape": "Dot",
				"rotate": false
			}, {
				"name": "ech",
				"anchor": [0.667, 1],
				"tags": ["digital"],
				"label": "ech",
				"shape": "Dot",
				"rotate": false
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
					"value": "long"
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
					"value": "long"
				},
				"tags": ["module"],
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
				"tags": ["module"],
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
					"value": "long"
				},
				"tags": ["module"],
				"module": "ultrasound",
				"uid": "KsZVo2"
			}],
			"imageUrl": "assets/image/components/ultrasound.png"
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
			"imageUrl": "assets/image/components/led.png"
		}, {
			"uid": "SnHrBC",
			"name": "rgb",
			"label": "三色LED",
			"type": "rgb",
			"category": "action",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "r",
				"anchor": [0.25, 1],
				"tags": ["analog-out", "any"],
				"label": "r",
				"shape": "Dot",
				"rotate": false
			}, {
				"name": "g",
				"anchor": [0.5, 1],
				"tags": ["analog-out", "any"],
				"label": "g",
				"shape": "Dot",
				"rotate": false
			}, {
				"name": "b",
				"anchor": [0.75, 1],
				"tags": ["analog-out", "any"],
				"label": "b",
				"shape": "Dot",
				"rotate": false
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
					"value": "点亮三色LED"
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
					"value": "点亮三色LED"
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
					"value": "熄灭三色LED"
				}, {
					"id": "LED",
					"type": "dynamic-select",
					"options": "rgbs"
				}, {
					"id": "TYPE",
					"type": "static-select",
					"options": [{
						"label": "共阴",
						"value": "0, 0, 0"
					}, {
						"label": "共阳",
						"value": "255, 255, 255"
					}]
				}],
				"code": "{LED}.setRGBcolor({TYPE});",
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
					"value": "让三色LED渐变"
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
					"value": "点亮三色LED"
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
			"imageUrl": "assets/image/components/rgb.png"
		}, {
			"uid": "0dp9Yl",
			"name": "lcd",
			"label": "液晶模块",
			"type": "lcd",
			"category": "action",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "sda",
				"anchor": [0.33, 0],
				"tags": ["analog-in"],
				"spec": "A4",
				"label": "sda",
				"shape": "Dot",
				"rotate": false
			}, {
				"name": "scl",
				"anchor": [0.67, 0],
				"tags": ["analog-in"],
				"spec": "A5",
				"label": "scl",
				"shape": "Dot",
				"rotate": false
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
				"code": "{LCD}.setAddress({ADDR});",
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
					"name": "o04q1D"
				}, {
					"type": "text",
					"value": "上显示"
				}, {
					"blockInputId": "TEXT",
					"type": "block-input",
					"acceptType": "all",
					"name": "EAB78q"
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
			"imageUrl": "assets/image/components/lcd.png"
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
				"name": "buzzerClose",
				"connectors": [{
					"type": "connector-top",
					"accept": "connector-bottom"
				}, {
					"type": "connector-bottom",
					"accept": "connector-top"
				}],
				"content": [{
					"type": "text",
					"value": "关闭蜂鸣器"
				}, {
					"id": "BUZZER",
					"type": "dynamic-select",
					"options": "buzzers"
				}],
				"code": "noTone({BUZZER});",
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
			"imageUrl": "assets/image/components/buzzer.png"
		}, {
			"uid": "gqwDEu",
			"name": "dcMotor",
			"label": "电机",
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
				"rotate": false
			}, {
				"name": "b",
				"anchor": [0.667, 1],
				"tags": ["analog-out"],
				"label": "b",
				"shape": "Dot",
				"rotate": false
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
					"value": "设置电机"
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
					"value": "停止电机"
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
					"value": "设置电机"
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
			"imageUrl": "assets/image/components/dcMotor.png"
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
					"id": "POSITION",
					"type": "number-input",
					"value": 90
				}, {
					"type": "text",
					"value": "度"
				}],
				"code": "{SERVO}.write({POSITION});",
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
			"imageUrl": "assets/image/components/servo.png"
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
					"value": "设置舵机"
				}, {
					"id": "SERVO",
					"type": "dynamic-select",
					"options": "continuousServos"
				}, {
					"type": "text",
					"value": "方向为"
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
					"value": "停止舵机"
				}, {
					"id": "SERVO",
					"type": "dynamic-select",
					"options": "continuousServos"
				}, {
					"type": "text",
					"value": "转动"
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
					"value": "设置舵机"
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
					"value": "停止舵机"
				}, {
					"blockInputId": "SERVO",
					"type": "block-input",
					"acceptType": "all",
					"name": "nEt27Q"
				}, {
					"type": "text",
					"value": "转动"
				}],
				"code": "{SERVO}.write(90);",
				"tags": ["module", "advanced"],
				"module": "continuousServo",
				"uid": "PNFLTP"
			}],
			"imageUrl": "assets/image/components/continuousServo.png"
		}, {
			"uid": "Uf0rkg",
			"name": "L298P",
			"label": "L298P驱动板",
			"type": "L298P",
			"category": "action",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "pwm1",
				"anchor": [0.25, 0],
				"tags": ["analog-out"],
				"label": "pwm1",
				"shape": "Dot",
				"rotate": false
			}, {
				"name": "dir1",
				"anchor": [0.5, 0],
				"tags": ["digital", "analog-in"],
				"label": "dir1",
				"shape": "Dot",
				"rotate": false
			}, {
				"name": "en1",
				"anchor": [0.75, 0],
				"tags": ["digital", "analog-in"],
				"label": "en1",
				"shape": "Dot",
				"rotate": false
			}, {
				"name": "pwm2",
				"anchor": [0.25, 1],
				"tags": ["analog-out"],
				"label": "pwm2",
				"shape": "Dot",
				"rotate": false
			}, {
				"name": "dir2",
				"anchor": [0.5, 1],
				"tags": ["digital", "analog-in"],
				"label": "dir2",
				"shape": "Dot",
				"rotate": false
			}, {
				"name": "en2",
				"anchor": [0.75, 1],
				"tags": ["digital", "analog-in"],
				"label": "en2",
				"shape": "Dot",
				"rotate": false
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
					"value": "设置电机驱动板"
				}, {
					"id": "MOTOR",
					"type": "dynamic-select",
					"options": "L298Ps"
				}, {
					"type": "text",
					"value": "上第"
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
					"value": "号电机速度为"
				}, {
					"blockInputId": "SPEED",
					"type": "block-input",
					"acceptType": "all",
					"name": "TsTLTk"
				}],
				"code": "{MOTOR}.setSpeed({INDEX}, {SPEED});",
				"tags": ["module"],
				"module": "L298P",
				"uid": "9bBKXv",
				"hidden": false
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
					"value": "设置电机驱动板"
				}, {
					"id": "MOTOR",
					"type": "dynamic-select",
					"options": "L298Ps"
				}, {
					"type": "text",
					"value": "上第"
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
				"tags": ["module"],
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
					"value": "设置电机驱动板"
				}, {
					"id": "MOTOR",
					"type": "dynamic-select",
					"options": "L298Ps"
				}, {
					"type": "text",
					"value": "上第"
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
					"value": "速度为"
				}, {
					"blockInputId": "SPEED",
					"type": "block-input",
					"acceptType": "all",
					"name": "uSYWse"
				}],
				"code": "{MOTOR}.run({INDEX}, {DIR}, {SPEED});",
				"tags": ["module"],
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
					"value": "设置电机驱动板"
				}, {
					"id": "MOTOR",
					"type": "dynamic-select",
					"options": "L298Ps"
				}, {
					"type": "text",
					"value": "上第"
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
			"imageUrl": "assets/image/components/L298P.png",
			"hidden": true
		}, {
			"uid": "hr5P4L",
			"name": "serial",
			"label": "串口模块",
			"type": "serial",
			"category": "function",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "s",
				"anchor": [1, 0.5],
				"tags": ["serial"],
				"spec": "Serial",
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
					"value": "串口发送"
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
					}]
				}],
				"code": "Serial.{LN}({DATA});",
				"tags": ["module"],
				"module": "serial",
				"uid": "p3UznJ"
			}, {
				"type": "output",
				"name": "serialReceive",
				"connectors": [{
					"type": "connector-output",
					"accept": "connector-input"
				}],
				"content": [{
					"type": "text",
					"value": "接收串口数据"
				}],
				"code": "Serial.read()",
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
					"value": "返回串口可读数据长度"
				}],
				"code": "Serial.available()",
				"returnType": {
					"type": "simple",
					"value": "bool"
				},
				"tags": ["module", "advanced"],
				"module": "serial",
				"uid": "lBwj1v"
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
					"value": "串口输出二进制流"
				}, {
					"blockInputId": "DATA",
					"type": "block-input",
					"acceptType": "all",
					"name": "PzDXZH"
				}],
				"code": "Serial.write({DATA});",
				"tags": ["module", "advanced"],
				"module": "serial",
				"uid": "6yQc6n"
			}],
			"imageUrl": "assets/image/components/serial.png"
		}, {
			"uid": "4erQi6",
			"name": "bluetooth",
			"label": "蓝牙模块",
			"type": "serial",
			"category": "function",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "rxd",
				"anchor": [0.33, 1],
				"tags": ["digital", "analog-in"],
				"label": "rxd",
				"shape": "Dot",
				"rotate": false
			}, {
				"name": "txd",
				"anchor": [0.67, 1],
				"tags": ["digital", "analog-in"],
				"label": "txd",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"setup": "Serial.begin(9600);"
			},
			"blocks": [],
			"imageUrl": "assets/image/components/bluetooth.png"
		}, {
			"uid": "XHqwvv",
			"name": "wifi",
			"label": "wifi模块",
			"type": "serial",
			"category": "function",
			"boards": ["Arduino"],
			"width": 72,
			"height": 72,
			"pins": [{
				"name": "rxd",
				"anchor": [0.33, 1],
				"tags": ["digital", "analog-in"],
				"label": "rxd",
				"shape": "Dot",
				"rotate": false
			}, {
				"name": "txd",
				"anchor": [0.67, 1],
				"tags": ["digital", "analog-in"],
				"label": "txd",
				"shape": "Dot",
				"rotate": false
			}],
			"code": {
				"setup": "Serial.begin(9600);"
			},
			"blocks": [],
			"imageUrl": "assets/image/components/wifi.png"
		}]
	};

	_.pullAll(schema.boards, _.filter(schema.boards, function(board) {
		return board.hidden;
	}));

	_.pullAll(schema.components, _.filter(schema.components, function(component) {
		return component.hidden;
	}));

	_.pullAll(schema.blocks, _.filter(schema.blocks, function(block) {
		return block.hidden;
	}));

	builtInPackage.boards.forEach(function(board) {
		!board.hidden && schema.boards.push(board);
	});

	builtInPackage.components.forEach(function(component) {
		!component.hidden && schema.components.push(component);

		!component.hidden && component.blocks.forEach(function(block) {
			!block.hidden && schema.blocks.push(block);
		});
	});

	return schema;
});