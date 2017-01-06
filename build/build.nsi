# ====================== 自定义宏 产品信息==============================
!define PRODUCT_NAME           		"啃萝卜"
!define PRODUCT_PATHNAME 			"kenrobot"  #安装卸载项用到的KEY
!define INSTALL_APPEND_PATH         "kenrobot"	#安装路径追加的名称 
!define INSTALL_DEFALT_SETUPPATH    ""          #默认生成的安装路径  
!define EXE_NAME               		"kenrobot.exe"
!define PRODUCT_VERSION        		"1.1.0.0"
!define PRODUCT_PUBLISHER      		"北京啃萝卜信息技术有限公司"
!define PRODUCT_LEGAL          		"啃萝卜 Copyright（c）2017"
!define INSTALL_OUTPUT_NAME    		"kenrobot_v1.1.0.exe"

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

;SetCompressor lzma

; 安装包名字.
Name "${PRODUCT_NAME}"

# 安装程序文件名.

# OutFile "C:\Users\string-sb\Desktop\${INSTALL_OUTPUT_NAME}"
OutFile "output\${INSTALL_OUTPUT_NAME}"

InstallDir "$PROGRAMFILES\${INSTALL_APPEND_PATH}"

# 安装和卸载程序图标
Icon              "${INSTALL_ICO}"
UninstallIcon     "${UNINSTALL_ICO}"
