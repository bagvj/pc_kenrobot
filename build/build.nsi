# ====================== �Զ���� ��Ʒ��Ϣ==============================
!define PRODUCT_NAME           		"���ܲ�"
!define PRODUCT_PATHNAME 			"kenrobot"  #��װж�����õ���KEY
!define INSTALL_APPEND_PATH         "kenrobot"	#��װ·��׷�ӵ����� 
!define INSTALL_DEFALT_SETUPPATH    ""          #Ĭ�����ɵİ�װ·��  
!define EXE_NAME               		"kenrobot.exe"
!define PRODUCT_VERSION        		"1.1.0.0"
!define PRODUCT_PUBLISHER      		"�������ܲ���Ϣ�������޹�˾"
!define PRODUCT_LEGAL          		"���ܲ� Copyright��c��2017"
!define INSTALL_OUTPUT_NAME    		"kenrobot_v1.1.0.exe"

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

;SetCompressor lzma

; ��װ������.
Name "${PRODUCT_NAME}"

# ��װ�����ļ���.

# OutFile "C:\Users\string-sb\Desktop\${INSTALL_OUTPUT_NAME}"
OutFile "output\${INSTALL_OUTPUT_NAME}"

InstallDir "$PROGRAMFILES\${INSTALL_APPEND_PATH}"

# ��װ��ж�س���ͼ��
Icon              "${INSTALL_ICO}"
UninstallIcon     "${UNINSTALL_ICO}"
