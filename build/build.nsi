!define PRODUCT_NAME                "啃萝卜"                       ; 安装卸载项用到的KEY
!define PRODUCT_PATHNAME            "kenrobot"                     ; 安装卸载项用到的KEY
!define INSTALL_APPEND_PATH         "kenrobot"                     ; 安装路径追加的名称 
!define EXE_NAME                    "kenrobot.exe"                 ; 可执行文件名
!define PRODUCT_PUBLISHER           "北京啃萝卜信息技术有限公司"     ; 发布者
!define PRODUCT_LEGAL               "啃萝卜 Copyright（c）2017"     ; 版权

!define INSTALL_LICENCE_FILENAME    "license.txt"                  ; 使用许可
!define INSTALL_ICO                 "icon.ico"                     ; 安装图标
!define UNINSTALL_ICO               "icon.ico"                     ; 卸载图标
!define INSTALL_REQUIRE_SIZE        300                            ; 安装所需的大小(MB)

!define INSTALL_7Z_NAME             "app.7z"                       ; 
!define INSTALL_7Z_PATH             "output\app.7z"                ;
!define INSTALL_RES_PATH            "output\skin.zip"              ;

; 以下定义的常量由外部传入
; !define PRODUCT_DISPLAY_VERSION     "0.1.1"                      ; 显示的版本号
; !define PRODUCT_VERSION             "0.1.1.0"                    ; 版本号
; !define INSTALL_OUTPUT_NAME         "kenrobot_v0.1.1.exe"        ; 输出的安装文件名
; !define OUT_DIR                     "output"                     ; 输出目录

!include "setup.nsh"

RequestExecutionLevel admin

; 安装包名字.
Name "${PRODUCT_NAME}"

OutFile "${OUT_DIR}\${INSTALL_OUTPUT_NAME}"
InstallDir "$PROGRAMFILES\${INSTALL_APPEND_PATH}"

; 安装和卸载程序图标
Icon "${INSTALL_ICO}"
UninstallIcon "${UNINSTALL_ICO}"
