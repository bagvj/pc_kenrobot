
# ===================== 外部插件以及宏 =============================
!include "StrFunc.nsh"
!include "WordFunc.nsh"
${StrRep}
${StrStr}
!include "LogicLib.nsh"
!include "nsDialogs.nsh"
!include "common.nsh"
!include "x64.nsh"
!include "MUI.nsh"
!include "WinVer.nsh" 

!insertmacro MUI_LANGUAGE "SimpChinese"
# ===================== 安装包版本 =============================
VIProductVersion             		"${PRODUCT_VERSION}"
VIAddVersionKey "ProductVersion"    "${PRODUCT_VERSION}"
VIAddVersionKey "ProductName"       "${PRODUCT_NAME}"
VIAddVersionKey "CompanyName"       "${PRODUCT_PUBLISHER}"
VIAddVersionKey "FileVersion"       "${PRODUCT_VERSION}"
VIAddVersionKey "InternalName"      "${EXE_NAME}"
VIAddVersionKey "FileDescription"   "${PRODUCT_NAME}"
VIAddVersionKey "LegalCopyright"    "${PRODUCT_LEGAL}"

!define INSTALL_PAGE_CONFIG 			0
!define INSTALL_PAGE_PROCESSING 		1
!define INSTALL_PAGE_FINISH 			2
!define INSTALL_PAGE_UNISTCONFIG 		3
!define INSTALL_PAGE_UNISTPROCESSING 	4
!define INSTALL_PAGE_UNISTFINISH 		5

# 自定义页面
Page custom DUIPage

# 卸载程序显示进度
UninstPage custom un.DUIPage

# ======================= DUILIB 自定义页面 =========================
Var hInstallDlg
Var sSetupPath 
Var sReserveData   #卸载时是否保留数据 
Var InstallState   #是在安装中还是安装完成  
Var UnInstallValue  #卸载的进度  

Function DUIPage
    StrCpy $InstallState "0"	#设置未安装完成状态
	InitPluginsDir   	
	SetOutPath "$PLUGINSDIR"
	File "${INSTALL_LICENCE_FILENAME}"
    File "${INSTALL_RES_PATH}"
	File /oname=logo.ico "${INSTALL_ICO}" 		#此处的目标文件一定是logo.ico，否则控件将找不到文件 
	nsNiuniuSkin::InitSkinPage "$PLUGINSDIR\" "${INSTALL_LICENCE_FILENAME}" #指定插件路径及协议文件名称
    Pop $hInstallDlg
   	
	#生成安装路径，包含识别旧的安装路径  
    Call GenerateSetupAddress
	
	#设置控件显示安装路径 
    nsNiuniuSkin::SetDirValue "$INSTDIR\"
	Call OnRichEditTextChange
	#设置安装包的标题及任务栏显示  
	nsNiuniuSkin::SetWindowTile "${PRODUCT_NAME}安装程序"
	nsNiuniuSkin::ShowPageItem "wizardTab" ${INSTALL_PAGE_CONFIG}
	
	nsNiuniuSkin::SetControlAttribute "licensename" "text" "${PRODUCT_NAME}软件许可及服务协议"
		
    Call BindUIControls	
    nsNiuniuSkin::ShowPage	
FunctionEnd

Function un.DUIPage
	StrCpy $InstallState "0"
    InitPluginsDir
	SetOutPath "$PLUGINSDIR"
    File "${INSTALL_RES_PATH}"
	nsNiuniuSkin::InitSkinPage "$PLUGINSDIR\" "" 
    Pop $hInstallDlg
	nsNiuniuSkin::ShowPageItem "wizardTab" ${INSTALL_PAGE_UNISTCONFIG}
	#设置安装包的标题及任务栏显示  
	nsNiuniuSkin::SetWindowTile "${PRODUCT_NAME}卸载程序"
	nsNiuniuSkin::SetWindowSize $hInstallDlg 508 418

	nsNiuniuSkin::SetControlAttribute "uninstallSureTxt" "text" "确定要卸载${PRODUCT_NAME}？"

	Call un.BindUnInstUIControls
	
	nsNiuniuSkin::SetControlAttribute "chkAutoRun" "selected" "true"
	
    nsNiuniuSkin::ShowPage
FunctionEnd

#绑定卸载的事件 
Function un.BindUnInstUIControls
	GetFunctionAddress $0 un.ExitDUISetup
    nsNiuniuSkin::BindCallBack "btnUninstalled" $0
	
	GetFunctionAddress $0 un.onUninstall
    nsNiuniuSkin::BindCallBack "btnUnInstall" $0
	
	GetFunctionAddress $0 un.ExitDUISetup
    nsNiuniuSkin::BindCallBack "btnClose" $0
FunctionEnd

#绑定安装的界面事件 
Function BindUIControls
	# License页面
    GetFunctionAddress $0 OnExitDUISetup
    nsNiuniuSkin::BindCallBack "btnLicenseClose" $0
    
    GetFunctionAddress $0 OnBtnMin
    nsNiuniuSkin::BindCallBack "btnLicenseMin" $0
    
	
	GetFunctionAddress $0 OnBtnLicenseClick
    nsNiuniuSkin::BindCallBack "btnAgreement" $0
	
    # 目录选择 页面
    GetFunctionAddress $0 OnExitDUISetup
    nsNiuniuSkin::BindCallBack "btnDirClose" $0
	
	GetFunctionAddress $0 OnExitDUISetup
    nsNiuniuSkin::BindCallBack "btnLicenseCancel" $0
    
    GetFunctionAddress $0 OnBtnMin
    nsNiuniuSkin::BindCallBack "btnDirMin" $0
    
    GetFunctionAddress $0 OnBtnSelectDir
    nsNiuniuSkin::BindCallBack "btnSelectDir" $0
    
    GetFunctionAddress $0 OnBtnDirPre
    nsNiuniuSkin::BindCallBack "btnDirPre" $0
    
	GetFunctionAddress $0 OnBtnShowConfig
    nsNiuniuSkin::BindCallBack "btnAgree" $0
	
    GetFunctionAddress $0 OnBtnCancel
    nsNiuniuSkin::BindCallBack "btnDirCancel" $0
        
    GetFunctionAddress $0 OnBtnInstall
    nsNiuniuSkin::BindCallBack "btnInstall" $0
    
    # 安装进度 页面
    GetFunctionAddress $0 OnExitDUISetup
    nsNiuniuSkin::BindCallBack "btnDetailClose" $0
    
    GetFunctionAddress $0 OnBtnMin
    nsNiuniuSkin::BindCallBack "btnDetailMin" $0

    # 安装完成 页面
    GetFunctionAddress $0 OnFinished
    nsNiuniuSkin::BindCallBack "btnRun" $0
    
    GetFunctionAddress $0 OnBtnMin
    nsNiuniuSkin::BindCallBack "btnFinishedMin" $0
    
    GetFunctionAddress $0 OnExitDUISetup
    nsNiuniuSkin::BindCallBack "btnClose" $0
	
	GetFunctionAddress $0 OnCheckLicenseClick
    nsNiuniuSkin::BindCallBack "chkAgree" $0
	
	GetFunctionAddress $0 OnBtnShowMore
    nsNiuniuSkin::BindCallBack "btnShowMore" $0
	
	GetFunctionAddress $0 OnBtnHideMore
    nsNiuniuSkin::BindCallBack "btnHideMore" $0
	
	#绑定窗口通过alt+f4等方式关闭时的通知事件 
	GetFunctionAddress $0 OnSysCommandCloseEvent
    nsNiuniuSkin::BindCallBack "syscommandclose" $0
	
	#绑定路径变化的通知事件 
	GetFunctionAddress $0 OnRichEditTextChange
    nsNiuniuSkin::BindCallBack "editDir" $0
FunctionEnd

#此处是路径变化时的事件通知 
Function OnRichEditTextChange
	#可在此获取路径，判断是否合法等处理 
	nsNiuniuSkin::GetDirValue
    Pop $0	
	StrCpy $INSTDIR "$0"
	
	Call IsSetupPathIlleagal
	${If} $R5 == "0"
		nsNiuniuSkin::SetControlAttribute "local_space" "text" "路径非法"
		nsNiuniuSkin::SetControlAttribute "local_space" "textcolor" "#ffff0000"
		nsNiuniuSkin::SetControlAttribute "btnInstall" "enabled" "false"
		goto TextChangeAbort
    ${EndIf}
	
	nsNiuniuSkin::SetControlAttribute "local_space" "textcolor" "#FF999999"
	${If} $R0 > 1024                                #400即程序安装后需要占用的实际空间，单位：MB  
	    IntOp $R0  $R0 / 1024;
		IntOp $R1  $R0 % 1024		
		nsNiuniuSkin::SetControlAttribute "local_space" "text" "剩余空间：$R0.$R1GB"
	${Else}
		nsNiuniuSkin::SetControlAttribute "local_space" "text" "剩余空间：$R0.$R1MB"
     ${Endif}
	
	nsNiuniuSkin::GetCheckboxStatus "chkAgree"
    Pop $0
	${If} $0 == "1"        
		nsNiuniuSkin::SetControlAttribute "btnInstall" "enabled" "true"
	${Else}
		nsNiuniuSkin::SetControlAttribute "btnInstall" "enabled" "false"
    ${EndIf}
TextChangeAbort:
FunctionEnd

#根据选中的情况来控制按钮是否灰度显示 
Function OnCheckLicenseClick
	nsNiuniuSkin::GetCheckboxStatus "chkAgree"
    Pop $0
	${If} $0 == "0"        
		nsNiuniuSkin::SetControlAttribute "btnInstall" "enabled" "true"
	${Else}
		nsNiuniuSkin::SetControlAttribute "btnInstall" "enabled" "false"
    ${EndIf}
FunctionEnd

Function OnBtnLicenseClick
	nsNiuniuSkin::SetControlAttribute "licenseshow" "visible" "true"
	nsNiuniuSkin::IsControlVisible "moreconfiginfo"
	Pop $0
	${If} $0 = 0        
		;pos="10,35,560,405"
		nsNiuniuSkin::SetControlAttribute "licenseshow" "pos" "5,35,475,385"
		nsNiuniuSkin::SetControlAttribute "editLicense" "height" "270"		
	${Else}
		nsNiuniuSkin::SetControlAttribute "licenseshow" "pos" "5,35,475,495"
		nsNiuniuSkin::SetControlAttribute "editLicense" "height" "375"
    ${EndIf}
FunctionEnd

# 添加一个空的Section，防止编译器报错
Section "None"
SectionEnd

# 开始安装
Function OnBtnInstall
    nsNiuniuSkin::GetCheckboxStatus "chkAgree"
    Pop $0
	StrCpy $0 "1"
		
	#如果未同意，直接退出 
	StrCmp $0 "0" InstallAbort 0
	
	#此处检测当前是否有程序正在运行，如果正在运行，提示先卸载再安装 
	nsProcess::_FindProcess "${EXE_NAME}"
	Pop $R0
	
	${If} $R0 == 0
        nsNiuniuSkin::ShowMsgBox "提示" "${PRODUCT_NAME}正在运行，请退出后重试!" 0
		goto InstallAbort
    ${EndIf}		

	nsNiuniuSkin::GetDirValue
    Pop $0
    StrCmp $0 "" InstallAbort 0
	
	#校正路径（追加）  
	Call AdjustInstallPath
	StrCpy $sSetupPath "$INSTDIR"	
	
	Call IsSetupPathIlleagal
	${If} $R5 == "0"
		nsNiuniuSkin::ShowMsgBox "提示" "路径非法，请使用正确的路径安装!" 0
		goto InstallAbort
    ${EndIf}	
	${If} $R5 == "-1"
		nsNiuniuSkin::ShowMsgBox "提示" "目标磁盘空间不足，请使用其他的磁盘安装!" 0
		goto InstallAbort
    ${EndIf}
	
	nsNiuniuSkin::SetWindowSize $hInstallDlg 508 418
	nsNiuniuSkin::SetControlAttribute "btnClose" "enabled" "false"
	nsNiuniuSkin::ShowPageItem "wizardTab" ${INSTALL_PAGE_PROCESSING}
    nsNiuniuSkin::SetSliderRange "slrProgress" 0 100
	
    # 将这些文件暂存到临时目录
    #Call BakFiles
    
    #启动一个低优先级的后台线程
    GetFunctionAddress $0 ExtractFunc
    BgWorker::CallAndWait
    
	Call CreateShortcut
	Call CreateUninstall
    	
	nsNiuniuSkin::SetControlAttribute "btnClose" "enabled" "true"		
	StrCpy $InstallState "1"
	#如果不想完成立即启动的话，需要屏蔽下面的OnFinished的调用，并且打开显示INSTALL_PAGE_FINISH
	#Call OnFinished
	#以下这行如果打开，则是跳转到完成页面 
	nsNiuniuSkin::ShowPageItem "wizardTab" ${INSTALL_PAGE_FINISH}
InstallAbort:
FunctionEnd

Function ExtractCallback
    Pop $1
    Pop $2
    System::Int64Op $1 * 100
    Pop $3
    System::Int64Op $3 / $2
    Pop $0
	
    nsNiuniuSkin::SetSliderValue "slrProgress" $0
	nsNiuniuSkin::SetControlAttribute "progress_pos" "text" "$0%"
    ${If} $1 == $2
        nsNiuniuSkin::SetSliderValue "slrProgress" 100    
		nsNiuniuSkin::SetControlAttribute "progress_pos" "text" "100%"
    ${EndIf}
FunctionEnd

#CTRL+F4关闭时的事件通知 
Function OnSysCommandCloseEvent
	Call OnExitDUISetup
FunctionEnd

#安装界面点击退出，给出提示 
Function OnExitDUISetup
	${If} $InstallState == "0"		
		nsNiuniuSkin::ShowMsgBox "提示" "安装尚未完成，您确定退出安装么？" 1
		pop $0
		${If} $0 == 0
			goto endfun
		${EndIf}
	${EndIf}
	nsNiuniuSkin::ExitDUISetup
endfun: 
FunctionEnd

Function OnBtnMin
    SendMessage $hInstallDlg ${WM_SYSCOMMAND} 0xF020 0
FunctionEnd

Function OnBtnCancel
	nsNiuniuSkin::ExitDUISetup
FunctionEnd

Function OnFinished		    
	#立即启动
    Exec "$INSTDIR\${EXE_NAME}"
    Call OnExitDUISetup
FunctionEnd

Function OnBtnSelectDir
    nsNiuniuSkin::SelectInstallDir
    Pop $0
FunctionEnd

Function StepHeightSizeAsc
	${ForEach} $R0 418 528 + 10
		nsNiuniuSkin::SetWindowSize $hInstallDlg 508 $R0
		Sleep 5
	${Next}
FunctionEnd

Function StepHeightSizeDsc
	${ForEach} $R0 528 418 - 10
		nsNiuniuSkin::SetWindowSize $hInstallDlg 508 $R0
		Sleep 5
	${Next}
FunctionEnd

Function OnBtnShowMore	
	nsNiuniuSkin::SetControlAttribute "btnShowMore" "enabled" "false"
	nsNiuniuSkin::SetControlAttribute "btnHideMore" "enabled" "false"
	nsNiuniuSkin::SetControlAttribute "moreconfiginfo" "visible" "true"
	nsNiuniuSkin::SetControlAttribute "btnHideMore" "visible" "true"
	nsNiuniuSkin::SetControlAttribute "btnShowMore" "visible" "false"
	;调整窗口高度 
	GetFunctionAddress $0 StepHeightSizeAsc
    BgWorker::CallAndWait
	
	nsNiuniuSkin::SetWindowSize $hInstallDlg 508 528
	nsNiuniuSkin::SetControlAttribute "btnShowMore" "enabled" "true"
	nsNiuniuSkin::SetControlAttribute "btnHideMore" "enabled" "true"
FunctionEnd

Function OnBtnHideMore
	nsNiuniuSkin::SetControlAttribute "btnShowMore" "enabled" "false"
	nsNiuniuSkin::SetControlAttribute "btnHideMore" "enabled" "false"
	nsNiuniuSkin::SetControlAttribute "moreconfiginfo" "visible" "false"
	nsNiuniuSkin::SetControlAttribute "btnHideMore" "visible" "false"
	nsNiuniuSkin::SetControlAttribute "btnShowMore" "visible" "true"
	;调整窗口高度 
	GetFunctionAddress $0 StepHeightSizeDsc
    BgWorker::CallAndWait
	nsNiuniuSkin::SetWindowSize $hInstallDlg 508 418
	nsNiuniuSkin::SetControlAttribute "btnShowMore" "enabled" "true"
	nsNiuniuSkin::SetControlAttribute "btnHideMore" "enabled" "true"
FunctionEnd


Function OnBtnShowConfig
	nsNiuniuSkin::SetControlAttribute "licenseshow" "visible" "false"
FunctionEnd

Function OnBtnDirPre
    nsNiuniuSkin::PrePage "wizardTab"
FunctionEnd

Function un.ExitDUISetup
	nsNiuniuSkin::ExitDUISetup
FunctionEnd

#执行具体的卸载 
Function un.onUninstall
	nsNiuniuSkin::GetCheckboxStatus "reserveDataChk"
    Pop $0
	StrCpy $sReserveData $0
		
	#此处检测当前是否有程序正在运行，如果正在运行，提示先卸载再安装 
	nsProcess::_FindProcess "${EXE_NAME}"
	Pop $R0
	
	${If} $R0 == 0
		nsNiuniuSkin::ShowMsgBox "提示" "${PRODUCT_NAME} 正在运行，请退出后重试!" 0
		goto InstallAbort
    ${EndIf}
	nsNiuniuSkin::SetControlAttribute "btnClose" "enabled" "false"
	nsNiuniuSkin::ShowPageItem "wizardTab" ${INSTALL_PAGE_UNISTPROCESSING}
	nsNiuniuSkin::SetSliderRange "slrProgress" 0 100
	IntOp $UnInstallValue 0 + 1
	
	Call un.DeleteShotcutAndInstallInfo
	
	IntOp $UnInstallValue $UnInstallValue + 8
    
	#删除文件 
	GetFunctionAddress $0 un.RemoveFiles
    BgWorker::CallAndWait
InstallAbort:
FunctionEnd

#在线程中删除文件，以便显示进度 
Function un.RemoveFiles
	${Locate} "$INSTDIR" "/G=0 /M=*.*" "un.onDeleteFileFound"
	StrCpy $InstallState "1"
	nsNiuniuSkin::SetControlAttribute "btnClose" "enabled" "true"
	nsNiuniuSkin::SetSliderValue "slrProgress" 100
	nsNiuniuSkin::SetControlAttribute "uninstalledTxt" "text" "${PRODUCT_NAME}已卸载"
	nsNiuniuSkin::ShowPageItem "wizardTab" ${INSTALL_PAGE_UNISTFINISH}
FunctionEnd


#卸载程序时删除文件的流程，如果有需要过滤的文件，在此函数中添加  
Function un.onDeleteFileFound	
	Delete "$R9"
	RMDir /r "$R9"
    RMDir "$R9"
	
	IntOp $UnInstallValue $UnInstallValue + 2
	${If} $UnInstallValue > 100
		IntOp $UnInstallValue 100 + 0
		nsNiuniuSkin::SetSliderValue "slrUnInstProgress" 100
	${Else}
		nsNiuniuSkin::SetSliderValue "slrUnInstProgress" $UnInstallValue
		nsNiuniuSkin::SetControlAttribute "un_progress_pos" "text" "$UnInstallValue%"
		
		Sleep 100
	${EndIf}	
undelete:
	Push "LocateNext"	
FunctionEnd

Function AdjustInstallPath
	#此处判断最后一段，如果已经是与我要追加的目录名一样，就不再追加了，如果不一样，则还需要追加 同时记录好写入注册表的路径  	
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


#判断选定的安装路径是否合法，主要检测硬盘是否存在[只能是HDD]，路径是否包含非法字符 结果保存在$R5中 
Function IsSetupPathIlleagal
	${GetRoot} "$INSTDIR" $R3   ;获取安装根目录
	StrCpy $R0 "$R3\"
	StrCpy $R1 "invalid"  
	${GetDrives} "HDD" "HDDDetection"            ;获取将要安装的根目录磁盘类型

	${If} $R1 == "HDD"              ;是硬盘       
		 StrCpy $R5 "1"	 
		 ${DriveSpace} "$R3\" "/D=F /S=M" $R0           #获取指定盘符的剩余可用空间，/D=F剩余空间， /S=M单位兆字节  
		 ${If} $R0 < 100                                #即程序安装后需要占用的实际空间，单位：MB  
		    StrCpy $R5 "-1"		#表示空间不足 
	     ${Endif}
	${Else}  
	     #0表示不合法 
		 StrCpy $R5 "0"
	${Endif}
FunctionEnd

Function HDDDetection
	${If} "$R0" == "$9"
		StrCpy $R1 "HDD"
		goto funend
	${Endif}
	Push $0
funend:
FunctionEnd

#获取默认的安装路径 
Function GenerateSetupAddress
	#读取注册表安装路径 
	SetRegView 32	
	ReadRegStr $0 HKLM "Software\${PRODUCT_PATHNAME}" "InstPath"
	${If} "$0" != ""		#路径不存在，则重新选择路径  	
		#路径读取到了，直接使用 
		#再判断一下这个路径是否有效 
		nsNiuniuSkin::StringHelper "$0" "\\" "\" "replace"
		Pop $0
		StrCpy $INSTDIR "$0"
	${EndIf}
	
	#如果从注册表读的地址非法，则还需要写上默认地址      
	Call IsSetupPathIlleagal
	${If} $R5 == "0"
		StrCpy $INSTDIR "$PROGRAMFILES\${INSTALL_APPEND_PATH}"		
	${EndIf}	
FunctionEnd

# 生成卸载入口 
Function CreateUninstall
	#写入注册信息 
	SetRegView 32
	WriteRegStr HKLM "Software\${PRODUCT_PATHNAME}" "InstPath" "$INSTDIR"
	
	WriteUninstaller "$INSTDIR\uninst.exe"
	
	# 添加卸载信息到控制面板
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "DisplayName" "${PRODUCT_NAME}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "UninstallString" "$INSTDIR\uninst.exe"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "DisplayIcon" "$INSTDIR\${EXE_NAME}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "Publisher" "${PRODUCT_PUBLISHER}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "DisplayVersion" "${PRODUCT_VERSION}"
FunctionEnd

# ========================= 安装步骤 ===============================
Function CreateShortcut
	CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
	CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk" "$INSTDIR\${EXE_NAME}" "" "$INSTDIR\logo.ico"
	CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\卸载${PRODUCT_NAME}.lnk" "$INSTDIR\uninst.exe"
	CreateShortCut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${EXE_NAME}"
FunctionEnd

Function ExtractFunc
	#安装文件的7Z压缩包
	SetOutPath $INSTDIR
	File /oname=logo.ico "${INSTALL_ICO}" 	

    File "${INSTALL_7Z_PATH}"
    GetFunctionAddress $R9 ExtractCallback
    nsis7z::ExtractWithCallback "$INSTDIR\${INSTALL_7Z_NAME}" $R9
	Delete "$INSTDIR\${INSTALL_7Z_NAME}"
	
	Sleep 500
FunctionEnd

Function un.DeleteShotcutAndInstallInfo
	SetRegView 32
	DeleteRegKey HKLM "Software\${PRODUCT_PATHNAME}"	
	DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}"
	
	; 删除快捷方式
	Delete "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk"
	Delete "$SMPROGRAMS\${PRODUCT_NAME}\卸载${PRODUCT_NAME}.lnk"
	RMDir "$SMPROGRAMS\${PRODUCT_NAME}\"
	Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
FunctionEnd