# ====================== �Զ���� ��Ʒ��Ϣ==============================
!define PRODUCT_NAME           		"���ܲ�"
!define PRODUCT_PATHNAME 			"kenrobot"                     #��װж�����õ���KEY
!define INSTALL_APPEND_PATH         "kenrobot"	                   #��װ·��׷�ӵ����� 
!define EXE_NAME               		"kenrobot.exe"
!define PRODUCT_PUBLISHER      		"�������ܲ���Ϣ�������޹�˾"
!define PRODUCT_LEGAL          		"���ܲ� Copyright��c��2017"

; !define PRODUCT_VERSION        		"0.1.1.0"
; !define INSTALL_OUTPUT_NAME    		"kenrobot_v0.1.1.exe"
; !define OUT_DIR                     "output"

# ====================== �Զ���� ��װ��Ϣ==============================
!define INSTALL_7Z_PATH 	   		"output\app.7z"
!define INSTALL_7Z_NAME 	   		"app.7z"
!define INSTALL_RES_PATH       		"output\skin.zip"
!define INSTALL_LICENCE_FILENAME    "license.txt"
!define INSTALL_ICO 				"icon.ico"
!define UNINSTALL_ICO 				"icon.ico"

!include "setup.nsh"

# ==================== NSIS���� ================================
RequestExecutionLevel admin

; ��װ������.
Name "${PRODUCT_NAME}"

OutFile "${OUT_DIR}\${INSTALL_OUTPUT_NAME}"
InstallDir "$PROGRAMFILES\${INSTALL_APPEND_PATH}"

# ��װ��ж�س���ͼ��
Icon              "${INSTALL_ICO}"
UninstallIcon     "${UNINSTALL_ICO}"
