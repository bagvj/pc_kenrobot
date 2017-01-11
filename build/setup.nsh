; ===================== �ⲿ����Լ��� =============================
!include "WordFunc.nsh"
!include "LogicLib.nsh"
!include "nsDialogs.nsh"
!include "FileFunc.nsh"
!include "x64.nsh"
!include "MUI.nsh"
!include "WinVer.nsh" 

!insertmacro MUI_LANGUAGE "SimpChinese"

; ===================== ��װ���汾 =============================
VIProductVersion             		"${PRODUCT_VERSION}"
VIAddVersionKey "ProductVersion"    "${PRODUCT_VERSION}"
VIAddVersionKey "ProductName"       "${PRODUCT_NAME}"
VIAddVersionKey "CompanyName"       "${PRODUCT_PUBLISHER}"
VIAddVersionKey "FileVersion"       "${PRODUCT_VERSION}"
VIAddVersionKey "InternalName"      "${EXE_NAME}"
VIAddVersionKey "FileDescription"   "${PRODUCT_NAME}"
VIAddVersionKey "LegalCopyright"    "${PRODUCT_LEGAL}"

!define INSTALL_PAGE                0  ; ��װ����
!define UNINSTALL_PAGE              1  ; ж�ؽ���

!define TAB_ONE_STEP_INSTALL		"tab-one-step-install"   ; һ����װ����
!define TAB_LICENSE					"tab-license"            ; Э�����
!define TAB_CUSTOM_INSTALL 			"tab-custom-install"     ; �Զ��尲װ����
!define TAB_INSTALLING 				"tab-installing"         ; ��װ�н���
!define TAB_INSTALL_COMPLETE 		"tab-install-complete"   ; ��װ��ɽ���

!define TAB_UNINSTALL_CONFIRM 		"tab-uninstall-confirm"  ; ж�ؽ���
!define TAB_UNINSTALLING 	        "tab-uninstalling"       ; ж���н���
!define TAB_UNINSTALL_COMPLETE 		"tab-uninstall-complete" ; ж����ɽ���


; ��װ����
Page custom installPage
; ж�ؽ���
UninstPage custom un.installPage

; ��װ�Ի���
Var installDialog
; ���ڰ�װ�л��ǰ�װ��� 
Var installState
; ж�صĽ���
Var uninstallValue
; ��ǰtab
Var currentTab

; ���һ���յ�Section����ֹ����������
Section "None"
SectionEnd

; ��װ����
Function installPage
    ; ����δ��װ���״̬
    StrCpy $installState "0"

	InitPluginsDir   	
	SetOutPath "$PLUGINSDIR"

	File "${INSTALL_LICENCE_FILENAME}"
    File "${INSTALL_RES_PATH}"
	File /oname=logo.ico "${INSTALL_ICO}"

	; ��ʼ��
	nsNiuniuSkin::InitSkinPage "$PLUGINSDIR\" "${INSTALL_LICENCE_FILENAME}"
    Pop $installDialog

    ; ���ð�װ���ı��⼰��������ʾ
    nsNiuniuSkin::SetWindowTile "${PRODUCT_NAME}��װ����"

    ; Э������
   	nsNiuniuSkin::SetControlAttribute "licenseNameLabel" "text" "${PRODUCT_NAME}��������û����Э��"
   	; ���ð汾��
   	nsNiuniuSkin::SetControlAttribute "versionLabel_0" "text" "ver ${PRODUCT_DISPLAY_VERSION}"
   	nsNiuniuSkin::SetControlAttribute "versionLabel_1" "text" "ver ${PRODUCT_DISPLAY_VERSION}"
   	nsNiuniuSkin::SetControlAttribute "versionLabel_2" "text" "ver ${PRODUCT_DISPLAY_VERSION}"
   	nsNiuniuSkin::SetControlAttribute "versionLabel_3" "text" "ver ${PRODUCT_DISPLAY_VERSION}"

   	nsNiuniuSkin::SetControlAttribute "installCompleteLabel" "text" "${PRODUCT_NAME}�ѳɹ���װ��"

	; ���ɰ�װ·��������ʶ��ɵİ�װ·��  
    Call genInstallPath

	; ���ÿؼ���ʾ��װ·��
    nsNiuniuSkin::SetDirValue "$INSTDIR"
	Call onInstallPathChange

	; һ����װ����
	nsNiuniuSkin::ShowPageItem "tabs" ${INSTALL_PAGE}
	
	; �󶨰�װ�����¼�
    Call bindInstallEvents

    StrCpy $currentTab ${TAB_ONE_STEP_INSTALL}
    Call showTab

    ; ��ʾ����
    nsNiuniuSkin::ShowPage	
FunctionEnd

; ж�ؽ���
Function un.installPage
	; ����δ��װ���״̬
	StrCpy $installState "0"

    InitPluginsDir
	SetOutPath "$PLUGINSDIR"
    File "${INSTALL_RES_PATH}"

    ; ��ʼ��
	nsNiuniuSkin::InitSkinPage "$PLUGINSDIR\" "" 
    Pop $installDialog

    ; ���ð�װ���ı��⼰��������ʾ  
    nsNiuniuSkin::SetWindowTile "${PRODUCT_NAME}ж�س���"

    ; ���ð汾��
    nsNiuniuSkin::SetControlAttribute "versionLabel_4" "text" "ver ${PRODUCT_DISPLAY_VERSION}"
    nsNiuniuSkin::SetControlAttribute "versionLabel_5" "text" "ver ${PRODUCT_DISPLAY_VERSION}"
    nsNiuniuSkin::SetControlAttribute "versionLabel_6" "text" "ver ${PRODUCT_DISPLAY_VERSION}"

    nsNiuniuSkin::SetControlAttribute "uninstallDirLabel" "text" "$INSTDIR"
    nsNiuniuSkin::SetControlAttribute "uninstallConfirmLabel" "text" "����򵼽������ļ����ж��${PRODUCT_NAME}"
    nsNiuniuSkin::SetControlAttribute "uninstallCompleteLabel" "text" "��л�����${PRODUCT_NAME}һ��ɳ�"

    ; ж��ȷ�Ͻ���
	nsNiuniuSkin::ShowPageItem "tabs" ${UNINSTALL_PAGE}

	; ��ж�ؽ����¼�
	Call un.bindUninstallEvents

	StrCpy $currentTab ${TAB_UNINSTALL_CONFIRM}
	Call un.showTab
	
	; ��ʾ����
    nsNiuniuSkin::ShowPage
FunctionEnd

; �󶨰�װ�Ľ����¼� 
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
		
	; �󶨴���ͨ��alt+f4�ȷ�ʽ�ر�ʱ��֪ͨ�¼� 
	GetFunctionAddress $0 onForceClose
	nsNiuniuSkin::BindCallBack "syscommandclose" $0
	
	; ��·���仯��֪ͨ�¼� 
	GetFunctionAddress $0 onInstallPathChange
	nsNiuniuSkin::BindCallBack "editDir" $0
FunctionEnd

; ��ж�ص��¼� 
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

; ��ʾtab
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

; �˳���װ
Function onExitSetup
	${If} $installState == "0"		
		nsNiuniuSkin::ShowMsgBox "��ʾ" "ȷ���˳�${PRODUCT_NAME}��װ������" 1
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

; ��װ·���ı�
Function onInstallPathChange
	; ��ȡ��װ·��
	nsNiuniuSkin::GetDirValue
    Pop $0	
	StrCpy $INSTDIR "$0"
	
	Call checkInstallPath
	${If} $R5 == "0"
		nsNiuniuSkin::SetControlAttribute "spaceRemainLabel" "text" "·���Ƿ�"
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
		nsNiuniuSkin::SetControlAttribute "spaceRemainLabel" "text" "ʣ��ռ䣺$R0.$R1GB"
	${Else}
		nsNiuniuSkin::SetControlAttribute "spaceRemainLabel" "text" "ʣ��ռ䣺$R0.$R1MB"
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

; һ����װ
Function onOneStepInstallBtn
	Call onInstallBtn
FunctionEnd

; �Զ��尲װ
Function onCustomBtn
	StrCpy $currentTab ${TAB_CUSTOM_INSTALL}
	Call showTab
FunctionEnd

; Э�����
Function onLicenseBtn
	StrCpy $currentTab ${TAB_LICENSE}
	Call showTab
FunctionEnd

; Э����淵��
Function onLicenseBackBtn
	StrCpy $currentTab ${TAB_ONE_STEP_INSTALL}
	Call showTab
FunctionEnd

; ͬ��Э��
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

;  ��ʼ��װ
Function onInstallBtn
	nsNiuniuSkin::GetCheckboxStatus "agreeChk"
	Pop $0
	; ���δͬ�⣬ֱ���˳� 
	StrCmp $0 "0" installAbort 0

	; �˴���⵱ǰ�Ƿ��г����������У�����������У���ʾ��ж���ٰ�װ 
	nsProcess::_FindProcess "${EXE_NAME}"
	Pop $R0

	${If} $R0 == 0
		nsNiuniuSkin::ShowMsgBox "��ʾ" "${PRODUCT_NAME}�������У����˳�������!" 0
		Goto installAbort
	${EndIf}		

	nsNiuniuSkin::GetDirValue
	Pop $0
	StrCmp $0 "" installAbort 0

	; У��·��
	Call adjustInstallPath
	; ���·��
	Call checkInstallPath
	${If} $R5 == "0"
		nsNiuniuSkin::ShowMsgBox "��ʾ" "·���Ƿ�����ʹ����ȷ��·����װ!" 0
	Goto installAbort
	${EndIf}	
	${If} $R5 == "-1"
		nsNiuniuSkin::ShowMsgBox "��ʾ" "Ŀ����̿ռ䲻�㣬��ʹ�������Ĵ��̰�װ!" 0
		Goto installAbort
	${EndIf}

	; ���ùرհ�ť
	nsNiuniuSkin::SetControlAttribute "closeBtn" "enabled" "false"
	nsNiuniuSkin::SetSliderRange "installProgressSlider" 0 100

	; ��ʾ��װ�н���
	StrCpy $currentTab ${TAB_INSTALLING}
	Call showTab

	; ����һ�������ȼ��ĺ�̨�̣߳���ѹ�ļ�
	GetFunctionAddress $0 extractFiles
	BgWorker::CallAndWait

	; ������ݷ�ʽ
	Call createShortcut
	; ����ж���ļ�
	Call createUninstall

	nsNiuniuSkin::SetControlAttribute "closeBtn" "enabled" "true"		
	StrCpy $installState "1"
	
	; ��ʾ��װ��ɽ���
	StrCpy $currentTab ${TAB_INSTALL_COMPLETE}
	Call showTab
installAbort:
FunctionEnd

; CTRL+F4�ر�ʱ���¼�֪ͨ 
Function onForceClose
	Call onExitSetup
FunctionEnd

; ѡ��װĿ¼
Function onSelectDirBtn
    nsNiuniuSkin::SelectInstallDir
    Pop $0
FunctionEnd

; ���
Function onInstallCompleteBtn		    
	; ��������
    Exec "$INSTDIR\${EXE_NAME}"
    Call onExitSetup
FunctionEnd

; У��·��
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

; �ж�ѡ���İ�װ·���Ƿ�Ϸ�����Ҫ���Ӳ���Ƿ����[ֻ����HDD]��·���Ƿ�����Ƿ��ַ� ���������$R5�� 
Function checkInstallPath
	; ��ȡ��װ��Ŀ¼
	${GetRoot} "$INSTDIR" $R3
	StrCpy $R0 "$R3\"
	StrCpy $R1 "invalid"
	;��ȡ��Ҫ��װ�ĸ�Ŀ¼��������
	${GetDrives} "HDD" "HDDDetection"

	;��Ӳ��
	${If} $R1 == "HDD"
		 StrCpy $R5 "1"
		 ; ��ȡָ���̷���ʣ����ÿռ䣬/D=Fʣ��ռ䣬 /S=M��λ���ֽ�
		 ${DriveSpace} "$R3\" "/D=F /S=M" $R0
		 ; ��װ����Ҫ��С����λMB 
		 ${If} $R0 < ${INSTALL_REQUIRE_SIZE}
		    ; ��ʾ�ռ䲻��
		    StrCpy $R5 "-1"
	     ${Endif}
	${Else}
	     ; 0��ʾ���Ϸ� 
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

; ��ȡĬ�ϵİ�װ·�� 
Function genInstallPath
	; ��ȡע���װ·�� 
	SetRegView 32	
	ReadRegStr $0 HKLM "Software\${PRODUCT_PATHNAME}" "InstPath"
	${If} "$0" != ""	
		; ·����ȡ���ˣ��ж�һ�����·���Ƿ���Ч 
		nsNiuniuSkin::StringHelper "$0" "\\" "\" "replace"
		Pop $0
		StrCpy $INSTDIR "$0"
	${EndIf}
	
	; �����ע�����ĵ�ַ�Ƿ�������Ҫд��Ĭ�ϵ�ַ      
	Call checkInstallPath
	${If} $R5 == "0"
		StrCpy $INSTDIR "$PROGRAMFILES\${INSTALL_APPEND_PATH}"
	${EndIf}	
FunctionEnd

; ��ѹ�ļ�
Function extractFiles
	; ��װ�ļ���7Zѹ����
	SetOutPath $INSTDIR
	File /oname=logo.ico "${INSTALL_ICO}" 	

    File "${INSTALL_7Z_PATH}"
    GetFunctionAddress $R9 extractCallback
    ; ���ý�ѹ�ص�
    nsis7z::ExtractWithCallback "$INSTDIR\${INSTALL_7Z_NAME}" $R9
	Delete "$INSTDIR\${INSTALL_7Z_NAME}"
	
	Sleep 500
FunctionEnd

; ��ѹ�ص���������ʾ����
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

; ������ݷ�ʽ
Function createShortcut
	; ��������ݷ�ʽ
	nsNiuniuSkin::GetCheckboxStatus "shortcutChk"
	Pop $0
	${If} $0 == "1"
		CreateShortCut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${EXE_NAME}"
	${EndIf}

	; ��ӵ�����������
	nsNiuniuSkin::GetCheckboxStatus "quickStartChk"
	Pop $0
	${If} $0 == "1"
		CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
		CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk" "$INSTDIR\${EXE_NAME}" "" "$INSTDIR\logo.ico"
		CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\ж��${PRODUCT_NAME}.lnk" "$INSTDIR\uninst.exe"
	${EndIf}
FunctionEnd

;  ����ж����� 
Function createUninstall
	; ��ȡ��װ��Ĵ�С
	${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
	; д��ע����Ϣ 
	SetRegView 32
	WriteRegStr HKLM "Software\${PRODUCT_PATHNAME}" "InstPath" "$INSTDIR"
	
	WriteUninstaller "$INSTDIR\uninst.exe"
	
	;  ���ж����Ϣ���������
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "DisplayName" "${PRODUCT_NAME}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "UninstallString" "$INSTDIR\uninst.exe"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "DisplayIcon" "$INSTDIR\${EXE_NAME}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "Publisher" "${PRODUCT_PUBLISHER}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "DisplayVersion" "${PRODUCT_VERSION}"
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "NoModify" 1
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "NoRepair" 1
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "EstimatedSize" $0
FunctionEnd

; ִ�о����ж�� 
Function un.onUninstallBtn
	; ��ʾж���н���
	StrCpy $currentTab ${TAB_UNINSTALLING}
	Call un.showTab

	nsNiuniuSkin::SetControlAttribute "closeBtn" "enabled" "false"
	nsNiuniuSkin::SetSliderRange "uninstallProgressSlider" 0 100
	IntOp $uninstallValue 0 + 1
	
	Call un.deleteShotcutAndInstallInfo
	
	IntOp $uninstallValue $uninstallValue + 8
    
	; ɾ���ļ� 
	GetFunctionAddress $0 un.removeFiles
    BgWorker::CallAndWait

    ; ��ʾж����ɽ���
    StrCpy $currentTab ${TAB_UNINSTALL_COMPLETE}
    Call un.showTab
FunctionEnd

; ���߳���ɾ���ļ����Ա���ʾ���� 
Function un.removeFiles
	${Locate} "$INSTDIR" "" "un.onDeleteFileFound"
	${Locate} "$APPDATA\${PRODUCT_PATHNAME}" "" "un.onDeleteFileFound"

	RMDir /r /REBOOTOK "$INSTDIR"
	RMDir /r /REBOOTOK "$APPDATA\${PRODUCT_PATHNAME}"

	StrCpy $installState "1"
	nsNiuniuSkin::SetControlAttribute "closeBtn" "enabled" "true"
	nsNiuniuSkin::SetSliderValue "uninstallProgressSlider" 100
FunctionEnd

; ж�س���ʱɾ���ļ������̣��������Ҫ���˵��ļ����ڴ˺��������  
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
	
	; ɾ����ݷ�ʽ
	Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
	Delete "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk"
	Delete "$SMPROGRAMS\${PRODUCT_NAME}\ж��${PRODUCT_NAME}.lnk"
	RMDir "$SMPROGRAMS\${PRODUCT_NAME}\"
FunctionEnd

Function un.onUninstallCompleteBtn
	nsNiuniuSkin::exitDUISetup
FunctionEnd