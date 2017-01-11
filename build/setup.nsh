; ===================== 外部插件以及宏 =============================
!include "WordFunc.nsh"
!include "LogicLib.nsh"
!include "nsDialogs.nsh"
!include "FileFunc.nsh"
!include "x64.nsh"
!include "MUI.nsh"
!include "WinVer.nsh" 

!insertmacro MUI_LANGUAGE "SimpChinese"

; ===================== 安装包版本 =============================
VIProductVersion             		"${PRODUCT_VERSION}"
VIAddVersionKey "ProductVersion"    "${PRODUCT_VERSION}"
VIAddVersionKey "ProductName"       "${PRODUCT_NAME}"
VIAddVersionKey "CompanyName"       "${PRODUCT_PUBLISHER}"
VIAddVersionKey "FileVersion"       "${PRODUCT_VERSION}"
VIAddVersionKey "InternalName"      "${EXE_NAME}"
VIAddVersionKey "FileDescription"   "${PRODUCT_NAME}"
VIAddVersionKey "LegalCopyright"    "${PRODUCT_LEGAL}"

!define INSTALL_PAGE                0  ; 安装界面
!define UNINSTALL_PAGE              1  ; 卸载界面

!define TAB_ONE_STEP_INSTALL		"tab-one-step-install"   ; 一键安装界面
!define TAB_LICENSE					"tab-license"            ; 协议界面
!define TAB_CUSTOM_INSTALL 			"tab-custom-install"     ; 自定义安装界面
!define TAB_INSTALLING 				"tab-installing"         ; 安装中界面
!define TAB_INSTALL_COMPLETE 		"tab-install-complete"   ; 安装完成界面

!define TAB_UNINSTALL_CONFIRM 		"tab-uninstall-confirm"  ; 卸载界面
!define TAB_UNINSTALLING 	        "tab-uninstalling"       ; 卸载中界面
!define TAB_UNINSTALL_COMPLETE 		"tab-uninstall-complete" ; 卸载完成界面


; 安装界面
Page custom installPage
; 卸载界面
UninstPage custom un.installPage

; 安装对话框
Var installDialog
; 是在安装中还是安装完成 
Var installState
; 卸载的进度
Var uninstallValue
; 当前tab
Var currentTab

; 添加一个空的Section，防止编译器报错
Section "None"
SectionEnd

; 安装界面
Function installPage
    ; 设置未安装完成状态
    StrCpy $installState "0"

	InitPluginsDir   	
	SetOutPath "$PLUGINSDIR"

	File "${INSTALL_LICENCE_FILENAME}"
    File "${INSTALL_RES_PATH}"
	File /oname=logo.ico "${INSTALL_ICO}"

	; 初始化
	nsNiuniuSkin::InitSkinPage "$PLUGINSDIR\" "${INSTALL_LICENCE_FILENAME}"
    Pop $installDialog

    ; 设置安装包的标题及任务栏显示
    nsNiuniuSkin::SetWindowTile "${PRODUCT_NAME}安装程序"

    ; 协议名字
   	nsNiuniuSkin::SetControlAttribute "licenseNameLabel" "text" "${PRODUCT_NAME}软件最终用户许可协议"
   	; 设置版本号
   	nsNiuniuSkin::SetControlAttribute "versionLabel_0" "text" "ver ${PRODUCT_DISPLAY_VERSION}"
   	nsNiuniuSkin::SetControlAttribute "versionLabel_1" "text" "ver ${PRODUCT_DISPLAY_VERSION}"
   	nsNiuniuSkin::SetControlAttribute "versionLabel_2" "text" "ver ${PRODUCT_DISPLAY_VERSION}"
   	nsNiuniuSkin::SetControlAttribute "versionLabel_3" "text" "ver ${PRODUCT_DISPLAY_VERSION}"

   	nsNiuniuSkin::SetControlAttribute "installCompleteLabel" "text" "${PRODUCT_NAME}已成功安装。"

	; 生成安装路径，包含识别旧的安装路径  
    Call genInstallPath

	; 设置控件显示安装路径
    nsNiuniuSkin::SetDirValue "$INSTDIR"
	Call onInstallPathChange

	; 一键安装界面
	nsNiuniuSkin::ShowPageItem "tabs" ${INSTALL_PAGE}
	
	; 绑定安装界面事件
    Call bindInstallEvents

    StrCpy $currentTab ${TAB_ONE_STEP_INSTALL}
    Call showTab

    ; 显示界面
    nsNiuniuSkin::ShowPage	
FunctionEnd

; 卸载界面
Function un.installPage
	; 设置未安装完成状态
	StrCpy $installState "0"

    InitPluginsDir
	SetOutPath "$PLUGINSDIR"
    File "${INSTALL_RES_PATH}"

    ; 初始化
	nsNiuniuSkin::InitSkinPage "$PLUGINSDIR\" "" 
    Pop $installDialog

    ; 设置安装包的标题及任务栏显示  
    nsNiuniuSkin::SetWindowTile "${PRODUCT_NAME}卸载程序"

    ; 设置版本号
    nsNiuniuSkin::SetControlAttribute "versionLabel_4" "text" "ver ${PRODUCT_DISPLAY_VERSION}"
    nsNiuniuSkin::SetControlAttribute "versionLabel_5" "text" "ver ${PRODUCT_DISPLAY_VERSION}"
    nsNiuniuSkin::SetControlAttribute "versionLabel_6" "text" "ver ${PRODUCT_DISPLAY_VERSION}"

    nsNiuniuSkin::SetControlAttribute "uninstallDirLabel" "text" "$INSTDIR"
    nsNiuniuSkin::SetControlAttribute "uninstallConfirmLabel" "text" "这个向导将从您的计算机卸载${PRODUCT_NAME}"
    nsNiuniuSkin::SetControlAttribute "uninstallCompleteLabel" "text" "感谢您陪伴${PRODUCT_NAME}一起成长"

    ; 卸载确认界面
	nsNiuniuSkin::ShowPageItem "tabs" ${UNINSTALL_PAGE}

	; 绑定卸载界面事件
	Call un.bindUninstallEvents

	StrCpy $currentTab ${TAB_UNINSTALL_CONFIRM}
	Call un.showTab
	
	; 显示界面
    nsNiuniuSkin::ShowPage
FunctionEnd

; 绑定安装的界面事件 
Function bindInstallEvents
	GetFunctionAddress $0 onMinBtn
	nsNiuniuSkin::BindCallBack "minBtn" $0

	GetFunctionAddress $0 onExitSetup
	nsNiuniuSkin::BindCallBack "closeBtn" $0

	GetFunctionAddress $0 onOneStepInstallBtn
	nsNiuniuSkin::BindCallBack "oneStepInstallBtn" $0

	GetFunctionAddress $0 onCustomBtn
	nsNiuniuSkin::BindCallBack "customBtn" $0

	GetFunctionAddress $0 onAgreeChk
	nsNiuniuSkin::BindCallBack "agreeChk" $0

	GetFunctionAddress $0 onLicenseBtn
	nsNiuniuSkin::BindCallBack "licenseBtn" $0

	GetFunctionAddress $0 onLicenseBackBtn
	nsNiuniuSkin::BindCallBack "licenseBackBtn" $0
    
	GetFunctionAddress $0 onSelectDirBtn
	nsNiuniuSkin::BindCallBack "selectDirBtn" $0

	GetFunctionAddress $0 onInstallBtn
	nsNiuniuSkin::BindCallBack "installBtn" $0

	GetFunctionAddress $0 onInstallCompleteBtn
	nsNiuniuSkin::BindCallBack "installCompleteBtn" $0
		
	; 绑定窗口通过alt+f4等方式关闭时的通知事件 
	GetFunctionAddress $0 onForceClose
	nsNiuniuSkin::BindCallBack "syscommandclose" $0
	
	; 绑定路径变化的通知事件 
	GetFunctionAddress $0 onInstallPathChange
	nsNiuniuSkin::BindCallBack "editDir" $0
FunctionEnd

; 绑定卸载的事件 
Function un.bindUninstallEvents
	GetFunctionAddress $0 un.onMinBtn
	nsNiuniuSkin::BindCallBack "minBtn" $0

	GetFunctionAddress $0 un.onExitSetup
	nsNiuniuSkin::BindCallBack "closeBtn" $0

	GetFunctionAddress $0 un.onUninstallBtn
	nsNiuniuSkin::BindCallBack "uninstallBtn" $0

	GetFunctionAddress $0 un.onExitSetup
	nsNiuniuSkin::BindCallBack "uninstallCancelBtn" $0

	GetFunctionAddress $0 un.onUninstallCompleteBtn
	nsNiuniuSkin::BindCallBack "uninstallCompleteBtn" $0
FunctionEnd

; 显示tab
Function showTab
	nsNiuniuSkin::SetControlAttribute ${TAB_ONE_STEP_INSTALL} "visible" "false"
	nsNiuniuSkin::SetControlAttribute ${TAB_LICENSE} "visible" "false"
	nsNiuniuSkin::SetControlAttribute ${TAB_CUSTOM_INSTALL} "visible" "false"
	nsNiuniuSkin::SetControlAttribute ${TAB_INSTALLING} "visible" "false"
	nsNiuniuSkin::SetControlAttribute ${TAB_INSTALL_COMPLETE} "visible" "false"
	nsNiuniuSkin::SetControlAttribute ${TAB_ONE_STEP_INSTALL} "mousechild" "false"
	nsNiuniuSkin::SetControlAttribute ${TAB_LICENSE} "mousechild" "false"
	nsNiuniuSkin::SetControlAttribute ${TAB_CUSTOM_INSTALL} "mousechild" "false"
	nsNiuniuSkin::SetControlAttribute ${TAB_INSTALLING} "mousechild" "false"
	nsNiuniuSkin::SetControlAttribute ${TAB_INSTALL_COMPLETE} "mousechild" "false"

	nsNiuniuSkin::SetControlAttribute $currentTab "visible" "true"
	nsNiuniuSkin::SetControlAttribute $currentTab "mousechild" "true"
FunctionEnd

Function un.showTab
	nsNiuniuSkin::SetControlAttribute ${TAB_UNINSTALL_CONFIRM} "visible" "false"
	nsNiuniuSkin::SetControlAttribute ${TAB_UNINSTALLING} "visible" "false"
	nsNiuniuSkin::SetControlAttribute ${TAB_UNINSTALL_COMPLETE} "visible" "false"
	nsNiuniuSkin::SetControlAttribute ${TAB_UNINSTALL_CONFIRM} "mousechild" "false"
	nsNiuniuSkin::SetControlAttribute ${TAB_UNINSTALLING} "mousechild" "false"
	nsNiuniuSkin::SetControlAttribute ${TAB_UNINSTALL_COMPLETE} "mousechild" "false"

	nsNiuniuSkin::SetControlAttribute $currentTab "visible" "true"
	nsNiuniuSkin::SetControlAttribute $currentTab "mousechild" "true"
FunctionEnd

; 退出安装
Function onExitSetup
	${If} $installState == "0"		
		nsNiuniuSkin::ShowMsgBox "提示" "确定退出${PRODUCT_NAME}安装程序吗？" 1
		Pop $0
		${If} $0 == 0
			Goto exitSetupAbort
		${EndIf}
	${EndIf}
	nsNiuniuSkin::exitDUISetup
exitSetupAbort: 
FunctionEnd

Function un.onExitSetup
	nsNiuniuSkin::exitDUISetup
FunctionEnd

Function onMinBtn
    SendMessage $installDialog ${WM_SYSCOMMAND} 0xF020 0
FunctionEnd

Function un.onMinBtn
    SendMessage $installDialog ${WM_SYSCOMMAND} 0xF020 0
FunctionEnd

; 安装路径改变
Function onInstallPathChange
	; 获取安装路径
	nsNiuniuSkin::GetDirValue
    Pop $0	
	StrCpy $INSTDIR "$0"
	
	Call checkInstallPath
	${If} $R5 == "0"
		nsNiuniuSkin::SetControlAttribute "spaceRemainLabel" "text" "路径非法"
		nsNiuniuSkin::SetControlAttribute "spaceRemainLabel" "textcolor" "#ffff0000"
		nsNiuniuSkin::SetControlAttribute "installBtn" "enabled" "false"
		Goto installPathChangeAbort
    ${EndIf}
	
	nsNiuniuSkin::SetControlAttribute "installDirLabel" "text" "$INSTDIR"
	nsNiuniuSkin::SetControlAttribute "editDir" "text" "$INSTDIR"
	nsNiuniuSkin::SetControlAttribute "spaceRemainLabel" "textcolor" "#FF999999"
	${If} $R0 > 1024
	    IntOp $R0  $R0 / 1024;
		IntOp $R1  $R0 % 1024		
		nsNiuniuSkin::SetControlAttribute "spaceRemainLabel" "text" "剩余空间：$R0.$R1GB"
	${Else}
		nsNiuniuSkin::SetControlAttribute "spaceRemainLabel" "text" "剩余空间：$R0.$R1MB"
    ${Endif}
	
	nsNiuniuSkin::GetCheckboxStatus "agreeChk"
    Pop $0
	${If} $0 == "1"        
		nsNiuniuSkin::SetControlAttribute "oneStepInstallBtn" "enabled" "true"
		nsNiuniuSkin::SetControlAttribute "installBtn" "enabled" "true"
	${Else}
		nsNiuniuSkin::SetControlAttribute "oneStepInstallBtn" "enabled" "false"
		nsNiuniuSkin::SetControlAttribute "installBtn" "enabled" "true"
    ${EndIf}
installPathChangeAbort:
FunctionEnd

; 一键安装
Function onOneStepInstallBtn
	Call onInstallBtn
FunctionEnd

; 自定义安装
Function onCustomBtn
	StrCpy $currentTab ${TAB_CUSTOM_INSTALL}
	Call showTab
FunctionEnd

; 协议界面
Function onLicenseBtn
	StrCpy $currentTab ${TAB_LICENSE}
	Call showTab
FunctionEnd

; 协议界面返回
Function onLicenseBackBtn
	StrCpy $currentTab ${TAB_ONE_STEP_INSTALL}
	Call showTab
FunctionEnd

; 同意协议
Function onAgreeChk
	nsNiuniuSkin::GetCheckboxStatus "agreeChk"
    Pop $0
	${If} $0 == "0"        
		nsNiuniuSkin::SetControlAttribute "oneStepInstallBtn" "enabled" "true"
		nsNiuniuSkin::SetControlAttribute "customBtn" "enabled" "true"
	${Else}
		nsNiuniuSkin::SetControlAttribute "oneStepInstallBtn" "enabled" "false"
		nsNiuniuSkin::SetControlAttribute "customBtn" "enabled" "false"
    ${EndIf}
FunctionEnd

;  开始安装
Function onInstallBtn
	nsNiuniuSkin::GetCheckboxStatus "agreeChk"
	Pop $0
	; 如果未同意，直接退出 
	StrCmp $0 "0" installAbort 0

	; 此处检测当前是否有程序正在运行，如果正在运行，提示先卸载再安装 
	nsProcess::_FindProcess "${EXE_NAME}"
	Pop $R0

	${If} $R0 == 0
		nsNiuniuSkin::ShowMsgBox "提示" "${PRODUCT_NAME}正在运行，请退出后重试!" 0
		Goto installAbort
	${EndIf}		

	nsNiuniuSkin::GetDirValue
	Pop $0
	StrCmp $0 "" installAbort 0

	; 校正路径
	Call adjustInstallPath
	; 检查路径
	Call checkInstallPath
	${If} $R5 == "0"
		nsNiuniuSkin::ShowMsgBox "提示" "路径非法，请使用正确的路径安装!" 0
	Goto installAbort
	${EndIf}	
	${If} $R5 == "-1"
		nsNiuniuSkin::ShowMsgBox "提示" "目标磁盘空间不足，请使用其他的磁盘安装!" 0
		Goto installAbort
	${EndIf}

	; 禁用关闭按钮
	nsNiuniuSkin::SetControlAttribute "closeBtn" "enabled" "false"
	nsNiuniuSkin::SetSliderRange "installProgressSlider" 0 100

	; 显示安装中界面
	StrCpy $currentTab ${TAB_INSTALLING}
	Call showTab

	; 启动一个低优先级的后台线程，解压文件
	GetFunctionAddress $0 extractFiles
	BgWorker::CallAndWait

	; 创建快捷方式
	Call createShortcut
	; 创建卸载文件
	Call createUninstall

	nsNiuniuSkin::SetControlAttribute "closeBtn" "enabled" "true"		
	StrCpy $installState "1"
	
	; 显示安装完成界面
	StrCpy $currentTab ${TAB_INSTALL_COMPLETE}
	Call showTab
installAbort:
FunctionEnd

; CTRL+F4关闭时的事件通知 
Function onForceClose
	Call onExitSetup
FunctionEnd

; 选择安装目录
Function onSelectDirBtn
    nsNiuniuSkin::SelectInstallDir
    Pop $0
FunctionEnd

; 完成
Function onInstallCompleteBtn		    
	; 立即启动
    Exec "$INSTDIR\${EXE_NAME}"
    Call onExitSetup
FunctionEnd

; 校正路径
Function adjustInstallPath	
	nsNiuniuSkin::StringHelper "$0" "\" "" "trimright"
	Pop $0
	nsNiuniuSkin::StringHelper "$0" "\" "" "getrightbychar"
	Pop $1	
		
	${If} "$1" == "${INSTALL_APPEND_PATH}"
		StrCpy $INSTDIR "$0"
	${Else}
		StrCpy $INSTDIR "$0\${INSTALL_APPEND_PATH}"
	${EndIf}
FunctionEnd

; 判断选定的安装路径是否合法，主要检测硬盘是否存在[只能是HDD]，路径是否包含非法字符 结果保存在$R5中 
Function checkInstallPath
	; 获取安装根目录
	${GetRoot} "$INSTDIR" $R3
	StrCpy $R0 "$R3\"
	StrCpy $R1 "invalid"
	;获取将要安装的根目录磁盘类型
	${GetDrives} "HDD" "HDDDetection"

	;是硬盘
	${If} $R1 == "HDD"
		 StrCpy $R5 "1"
		 ; 获取指定盘符的剩余可用空间，/D=F剩余空间， /S=M单位兆字节
		 ${DriveSpace} "$R3\" "/D=F /S=M" $R0
		 ; 安装所需要大小，单位MB 
		 ${If} $R0 < ${INSTALL_REQUIRE_SIZE}
		    ; 表示空间不足
		    StrCpy $R5 "-1"
	     ${Endif}
	${Else}
	     ; 0表示不合法 
		 StrCpy $R5 "0"
	${Endif}
FunctionEnd

Function HDDDetection
	${If} "$R0" == "$9"
		StrCpy $R1 "HDD"
		Goto hddDetectionAbort
	${Endif}
	Push $0
hddDetectionAbort:
FunctionEnd

; 获取默认的安装路径 
Function genInstallPath
	; 读取注册表安装路径 
	SetRegView 32	
	ReadRegStr $0 HKLM "Software\${PRODUCT_PATHNAME}" "InstPath"
	${If} "$0" != ""	
		; 路径读取到了，判断一下这个路径是否有效 
		nsNiuniuSkin::StringHelper "$0" "\\" "\" "replace"
		Pop $0
		StrCpy $INSTDIR "$0"
	${EndIf}
	
	; 如果从注册表读的地址非法，则还需要写上默认地址      
	Call checkInstallPath
	${If} $R5 == "0"
		StrCpy $INSTDIR "$PROGRAMFILES\${INSTALL_APPEND_PATH}"
	${EndIf}	
FunctionEnd

; 解压文件
Function extractFiles
	; 安装文件的7Z压缩包
	SetOutPath $INSTDIR
	File /oname=logo.ico "${INSTALL_ICO}" 	

    File "${INSTALL_7Z_PATH}"
    GetFunctionAddress $R9 extractCallback
    ; 设置解压回调
    nsis7z::ExtractWithCallback "$INSTDIR\${INSTALL_7Z_NAME}" $R9
	Delete "$INSTDIR\${INSTALL_7Z_NAME}"
	
	Sleep 500
FunctionEnd

; 解压回调，用于显示进度
Function extractCallback
    Pop $1
    Pop $2
    System::Int64Op $1 * 100
    Pop $3
    System::Int64Op $3 / $2
    Pop $0
	
    nsNiuniuSkin::SetSliderValue "installProgressSlider" $0
    ${If} $1 == $2
        nsNiuniuSkin::SetSliderValue "installProgressSlider" 100
    ${EndIf}
FunctionEnd

; 创建快捷方式
Function createShortcut
	; 添加桌面快捷方式
	nsNiuniuSkin::GetCheckboxStatus "shortcutChk"
	Pop $0
	${If} $0 == "1"
		CreateShortCut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${EXE_NAME}"
	${EndIf}

	; 添加到快速启动栏
	nsNiuniuSkin::GetCheckboxStatus "quickStartChk"
	Pop $0
	${If} $0 == "1"
		CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
		CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk" "$INSTDIR\${EXE_NAME}" "" "$INSTDIR\logo.ico"
		CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\卸载${PRODUCT_NAME}.lnk" "$INSTDIR\uninst.exe"
	${EndIf}
FunctionEnd

;  生成卸载入口 
Function createUninstall
	; 获取安装后的大小
	${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
	; 写入注册信息 
	SetRegView 32
	WriteRegStr HKLM "Software\${PRODUCT_PATHNAME}" "InstPath" "$INSTDIR"
	
	WriteUninstaller "$INSTDIR\uninst.exe"
	
	;  添加卸载信息到控制面板
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "DisplayName" "${PRODUCT_NAME}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "UninstallString" "$INSTDIR\uninst.exe"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "DisplayIcon" "$INSTDIR\${EXE_NAME}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "Publisher" "${PRODUCT_PUBLISHER}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "DisplayVersion" "${PRODUCT_VERSION}"
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "NoModify" 1
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "NoRepair" 1
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "EstimatedSize" $0
FunctionEnd

; 执行具体的卸载 
Function un.onUninstallBtn
	; 显示卸载中界面
	StrCpy $currentTab ${TAB_UNINSTALLING}
	Call un.showTab

	nsNiuniuSkin::SetControlAttribute "closeBtn" "enabled" "false"
	nsNiuniuSkin::SetSliderRange "uninstallProgressSlider" 0 100
	IntOp $uninstallValue 0 + 1
	
	Call un.deleteShotcutAndInstallInfo
	
	IntOp $uninstallValue $uninstallValue + 8
    
	; 删除文件 
	GetFunctionAddress $0 un.removeFiles
    BgWorker::CallAndWait

    ; 显示卸载完成界面
    StrCpy $currentTab ${TAB_UNINSTALL_COMPLETE}
    Call un.showTab
FunctionEnd

; 在线程中删除文件，以便显示进度 
Function un.removeFiles
	${Locate} "$INSTDIR" "" "un.onDeleteFileFound"
	${Locate} "$APPDATA\${PRODUCT_PATHNAME}" "" "un.onDeleteFileFound"

	RMDir /r /REBOOTOK "$INSTDIR"
	RMDir /r /REBOOTOK "$APPDATA\${PRODUCT_PATHNAME}"

	StrCpy $installState "1"
	nsNiuniuSkin::SetControlAttribute "closeBtn" "enabled" "true"
	nsNiuniuSkin::SetSliderValue "uninstallProgressSlider" 100
FunctionEnd

; 卸载程序时删除文件的流程，如果有需要过滤的文件，在此函数中添加  
Function un.onDeleteFileFound	
	Delete "$R9"
	RMDir /r "$R9"
    RMDir "$R9"
	
	IntOp $uninstallValue $uninstallValue + 2
	${If} $uninstallValue > 100
		IntOp $uninstallValue 100 + 0
		nsNiuniuSkin::SetSliderValue "uninstallProgressSlider" 100
	${Else}
		nsNiuniuSkin::SetSliderValue "uninstallProgressSlider" $uninstallValue
		Sleep 100
	${EndIf}
	Push "LocateNext"
FunctionEnd

Function un.deleteShotcutAndInstallInfo
	SetRegView 32
	DeleteRegKey HKLM "Software\${PRODUCT_PATHNAME}"	
	DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}"
	
	; 删除快捷方式
	Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
	Delete "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk"
	Delete "$SMPROGRAMS\${PRODUCT_NAME}\卸载${PRODUCT_NAME}.lnk"
	RMDir "$SMPROGRAMS\${PRODUCT_NAME}\"
FunctionEnd

Function un.onUninstallCompleteBtn
	nsNiuniuSkin::exitDUISetup
FunctionEnd