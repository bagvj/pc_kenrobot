# ====================== 自定义宏 产品信息==============================
!define PRODUCT_NAME           		"啃萝卜"
!define PRODUCT_PATHNAME 			"kenrobot"                     #安装卸载项用到的KEY
!define INSTALL_APPEND_PATH         "kenrobot"	                   #安装路径追加的名称 
!define EXE_NAME               		"kenrobot.exe"
!define PRODUCT_PUBLISHER      		"北京啃萝卜信息技术有限公司"
!define PRODUCT_LEGAL          		"啃萝卜 Copyright（c）2017"

; !define PRODUCT_VERSION        		"0.1.1.0"
; !define INSTALL_OUTPUT_NAME    		"kenrobot_v0.1.1.exe"
; !define OUT_DIR                     "output"

# ====================== 自定义宏 安装信息==============================
!define INSTALL_7Z_PATH 	   		"output\app.7z"
!define INSTALL_7Z_NAME 	   		"app.7z"
!define INSTALL_RES_PATH       		"output\skin.zip"
!define INSTALL_LICENCE_FILENAME    "license.txt"
!define INSTALL_ICO 				"icon.ico"
!define UNINSTALL_ICO 				"icon.ico"

!include "setup.nsh"

# ==================== NSIS属性 ================================
RequestExecutionLevel admin

; 安装包名字.
Name "${PRODUCT_NAME}"

OutFile "${OUT_DIR}\${INSTALL_OUTPUT_NAME}"
InstallDir "$PROGRAMFILES\${INSTALL_APPEND_PATH}"

# 安装和卸载程序图标
Icon              "${INSTALL_ICO}"
UninstallIcon     "${UNINSTALL_ICO}"
