!define PRODUCT_NAME                "���ܲ�"                       ; ��װж�����õ���KEY
!define PRODUCT_PATHNAME            "kenrobot"                     ; ��װж�����õ���KEY
!define INSTALL_APPEND_PATH         "kenrobot"                     ; ��װ·��׷�ӵ����� 
!define EXE_NAME                    "kenrobot.exe"                 ; ��ִ���ļ���
!define PRODUCT_PUBLISHER           "�������ܲ���Ϣ�������޹�˾"     ; ������
!define PRODUCT_LEGAL               "���ܲ� Copyright��c��2017"     ; ��Ȩ

!define INSTALL_LICENCE_FILENAME    "license.txt"                  ; ʹ�����
!define INSTALL_ICO                 "icon.ico"                     ; ��װͼ��
!define UNINSTALL_ICO               "icon.ico"                     ; ж��ͼ��
!define INSTALL_REQUIRE_SIZE        300                            ; ��װ����Ĵ�С(MB)

!define INSTALL_7Z_NAME             "app.7z"                       ; 
!define INSTALL_7Z_PATH             "output\app.7z"                ;
!define INSTALL_RES_PATH            "output\skin.zip"              ;

; ���¶���ĳ������ⲿ����
; !define PRODUCT_DISPLAY_VERSION     "0.1.1"                      ; ��ʾ�İ汾��
; !define PRODUCT_VERSION             "0.1.1.0"                    ; �汾��
; !define INSTALL_OUTPUT_NAME         "kenrobot_v0.1.1.exe"        ; ����İ�װ�ļ���
; !define OUT_DIR                     "output"                     ; ���Ŀ¼

!include "setup.nsh"

RequestExecutionLevel admin

; ��װ������.
Name "${PRODUCT_NAME}"

OutFile "${OUT_DIR}\${INSTALL_OUTPUT_NAME}"
InstallDir "$PROGRAMFILES\${INSTALL_APPEND_PATH}"

; ��װ��ж�س���ͼ��
Icon "${INSTALL_ICO}"
UninstallIcon "${UNINSTALL_ICO}"
