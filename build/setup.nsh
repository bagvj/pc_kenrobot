
# ===================== �ⲿ����Լ��� =============================
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
# ===================== ��װ���汾 =============================
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

# �Զ���ҳ��
Page custom DUIPage

# ж�س�����ʾ����
UninstPage custom un.DUIPage

# ======================= DUILIB �Զ���ҳ�� =========================
Var hInstallDlg
Var sSetupPath 
Var sReserveData   #ж��ʱ�Ƿ������� 
Var InstallState   #���ڰ�װ�л��ǰ�װ���  
Var UnInstallValue  #ж�صĽ���  

Function DUIPage
    StrCpy $InstallState "0"	#����δ��װ���״̬
	InitPluginsDir   	
	SetOutPath "$PLUGINSDIR"
	File "${INSTALL_LICENCE_FILENAME}"
    File "${INSTALL_RES_PATH}"
	File /oname=logo.ico "${INSTALL_ICO}" 		#�˴���Ŀ���ļ�һ����logo.ico������ؼ����Ҳ����ļ� 
	nsNiuniuSkin::InitSkinPage "$PLUGINSDIR\" "${INSTALL_LICENCE_FILENAME}" #ָ�����·����Э���ļ�����
    Pop $hInstallDlg
   	
	#���ɰ�װ·��������ʶ��ɵİ�װ·��  
    Call GenerateSetupAddress
	
	#���ÿؼ���ʾ��װ·�� 
    nsNiuniuSkin::SetDirValue "$INSTDIR\"
	Call OnRichEditTextChange
	#���ð�װ���ı��⼰��������ʾ  
	nsNiuniuSkin::SetWindowTile "${PRODUCT_NAME}��װ����"
	nsNiuniuSkin::ShowPageItem "wizardTab" ${INSTALL_PAGE_CONFIG}
	
	nsNiuniuSkin::SetControlAttribute "licensename" "text" "${PRODUCT_NAME}�����ɼ�����Э��"
		
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
	#���ð�װ���ı��⼰��������ʾ  
	nsNiuniuSkin::SetWindowTile "${PRODUCT_NAME}ж�س���"
	nsNiuniuSkin::SetWindowSize $hInstallDlg 508 418

	nsNiuniuSkin::SetControlAttribute "uninstallSureTxt" "text" "ȷ��Ҫж��${PRODUCT_NAME}��"

	Call un.BindUnInstUIControls
	
	nsNiuniuSkin::SetControlAttribute "chkAutoRun" "selected" "true"
	
    nsNiuniuSkin::ShowPage
FunctionEnd

#��ж�ص��¼� 
Function un.BindUnInstUIControls
	GetFunctionAddress $0 un.ExitDUISetup
    nsNiuniuSkin::BindCallBack "btnUninstalled" $0
	
	GetFunctionAddress $0 un.onUninstall
    nsNiuniuSkin::BindCallBack "btnUnInstall" $0
	
	GetFunctionAddress $0 un.ExitDUISetup
    nsNiuniuSkin::BindCallBack "btnClose" $0
FunctionEnd

#�󶨰�װ�Ľ����¼� 
Function BindUIControls
	# Licenseҳ��
    GetFunctionAddress $0 OnExitDUISetup
    nsNiuniuSkin::BindCallBack "btnLicenseClose" $0
    
    GetFunctionAddress $0 OnBtnMin
    nsNiuniuSkin::BindCallBack "btnLicenseMin" $0
    
	
	GetFunctionAddress $0 OnBtnLicenseClick
    nsNiuniuSkin::BindCallBack "btnAgreement" $0
	
    # Ŀ¼ѡ�� ҳ��
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
    
    # ��װ���� ҳ��
    GetFunctionAddress $0 OnExitDUISetup
    nsNiuniuSkin::BindCallBack "btnDetailClose" $0
    
    GetFunctionAddress $0 OnBtnMin
    nsNiuniuSkin::BindCallBack "btnDetailMin" $0

    # ��װ��� ҳ��
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
	
	#�󶨴���ͨ��alt+f4�ȷ�ʽ�ر�ʱ��֪ͨ�¼� 
	GetFunctionAddress $0 OnSysCommandCloseEvent
    nsNiuniuSkin::BindCallBack "syscommandclose" $0
	
	#��·���仯��֪ͨ�¼� 
	GetFunctionAddress $0 OnRichEditTextChange
    nsNiuniuSkin::BindCallBack "editDir" $0
FunctionEnd

#�˴���·���仯ʱ���¼�֪ͨ 
Function OnRichEditTextChange
	#���ڴ˻�ȡ·�����ж��Ƿ�Ϸ��ȴ��� 
	nsNiuniuSkin::GetDirValue
    Pop $0	
	StrCpy $INSTDIR "$0"
	
	Call IsSetupPathIlleagal
	${If} $R5 == "0"
		nsNiuniuSkin::SetControlAttribute "local_space" "text" "·���Ƿ�"
		nsNiuniuSkin::SetControlAttribute "local_space" "textcolor" "#ffff0000"
		nsNiuniuSkin::SetControlAttribute "btnInstall" "enabled" "false"
		goto TextChangeAbort
    ${EndIf}
	
	nsNiuniuSkin::SetControlAttribute "local_space" "textcolor" "#FF999999"
	${If} $R0 > 1024                                #400������װ����Ҫռ�õ�ʵ�ʿռ䣬��λ��MB  
	    IntOp $R0  $R0 / 1024;
		IntOp $R1  $R0 % 1024		
		nsNiuniuSkin::SetControlAttribute "local_space" "text" "ʣ��ռ䣺$R0.$R1GB"
	${Else}
		nsNiuniuSkin::SetControlAttribute "local_space" "text" "ʣ��ռ䣺$R0.$R1MB"
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

#����ѡ�е���������ư�ť�Ƿ�Ҷ���ʾ 
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

# ���һ���յ�Section����ֹ����������
Section "None"
SectionEnd

# ��ʼ��װ
Function OnBtnInstall
    nsNiuniuSkin::GetCheckboxStatus "chkAgree"
    Pop $0
	StrCpy $0 "1"
		
	#���δͬ�⣬ֱ���˳� 
	StrCmp $0 "0" InstallAbort 0
	
	#�˴���⵱ǰ�Ƿ��г����������У�����������У���ʾ��ж���ٰ�װ 
	nsProcess::_FindProcess "${EXE_NAME}"
	Pop $R0
	
	${If} $R0 == 0
        nsNiuniuSkin::ShowMsgBox "��ʾ" "${PRODUCT_NAME}�������У����˳�������!" 0
		goto InstallAbort
    ${EndIf}		

	nsNiuniuSkin::GetDirValue
    Pop $0
    StrCmp $0 "" InstallAbort 0
	
	#У��·����׷�ӣ�  
	Call AdjustInstallPath
	StrCpy $sSetupPath "$INSTDIR"	
	
	Call IsSetupPathIlleagal
	${If} $R5 == "0"
		nsNiuniuSkin::ShowMsgBox "��ʾ" "·���Ƿ�����ʹ����ȷ��·����װ!" 0
		goto InstallAbort
    ${EndIf}	
	${If} $R5 == "-1"
		nsNiuniuSkin::ShowMsgBox "��ʾ" "Ŀ����̿ռ䲻�㣬��ʹ�������Ĵ��̰�װ!" 0
		goto InstallAbort
    ${EndIf}
	
	nsNiuniuSkin::SetWindowSize $hInstallDlg 508 418
	nsNiuniuSkin::SetControlAttribute "btnClose" "enabled" "false"
	nsNiuniuSkin::ShowPageItem "wizardTab" ${INSTALL_PAGE_PROCESSING}
    nsNiuniuSkin::SetSliderRange "slrProgress" 0 100
	
    # ����Щ�ļ��ݴ浽��ʱĿ¼
    #Call BakFiles
    
    #����һ�������ȼ��ĺ�̨�߳�
    GetFunctionAddress $0 ExtractFunc
    BgWorker::CallAndWait
    
	Call CreateShortcut
	Call CreateUninstall
    	
	nsNiuniuSkin::SetControlAttribute "btnClose" "enabled" "true"		
	StrCpy $InstallState "1"
	#�������������������Ļ�����Ҫ���������OnFinished�ĵ��ã����Ҵ���ʾINSTALL_PAGE_FINISH
	#Call OnFinished
	#������������򿪣�������ת�����ҳ�� 
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

#CTRL+F4�ر�ʱ���¼�֪ͨ 
Function OnSysCommandCloseEvent
	Call OnExitDUISetup
FunctionEnd

#��װ�������˳���������ʾ 
Function OnExitDUISetup
	${If} $InstallState == "0"		
		nsNiuniuSkin::ShowMsgBox "��ʾ" "��װ��δ��ɣ���ȷ���˳���װô��" 1
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
	#��������
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
	;�������ڸ߶� 
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
	;�������ڸ߶� 
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

#ִ�о����ж�� 
Function un.onUninstall
	nsNiuniuSkin::GetCheckboxStatus "reserveDataChk"
    Pop $0
	StrCpy $sReserveData $0
		
	#�˴���⵱ǰ�Ƿ��г����������У�����������У���ʾ��ж���ٰ�װ 
	nsProcess::_FindProcess "${EXE_NAME}"
	Pop $R0
	
	${If} $R0 == 0
		nsNiuniuSkin::ShowMsgBox "��ʾ" "${PRODUCT_NAME} �������У����˳�������!" 0
		goto InstallAbort
    ${EndIf}
	nsNiuniuSkin::SetControlAttribute "btnClose" "enabled" "false"
	nsNiuniuSkin::ShowPageItem "wizardTab" ${INSTALL_PAGE_UNISTPROCESSING}
	nsNiuniuSkin::SetSliderRange "slrProgress" 0 100
	IntOp $UnInstallValue 0 + 1
	
	Call un.DeleteShotcutAndInstallInfo
	
	IntOp $UnInstallValue $UnInstallValue + 8
    
	#ɾ���ļ� 
	GetFunctionAddress $0 un.RemoveFiles
    BgWorker::CallAndWait
InstallAbort:
FunctionEnd

#���߳���ɾ���ļ����Ա���ʾ���� 
Function un.RemoveFiles
	${Locate} "$INSTDIR" "/G=0 /M=*.*" "un.onDeleteFileFound"
	StrCpy $InstallState "1"
	nsNiuniuSkin::SetControlAttribute "btnClose" "enabled" "true"
	nsNiuniuSkin::SetSliderValue "slrProgress" 100
	nsNiuniuSkin::SetControlAttribute "uninstalledTxt" "text" "${PRODUCT_NAME}��ж��"
	nsNiuniuSkin::ShowPageItem "wizardTab" ${INSTALL_PAGE_UNISTFINISH}
FunctionEnd


#ж�س���ʱɾ���ļ������̣��������Ҫ���˵��ļ����ڴ˺��������  
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
	#�˴��ж����һ�Σ�����Ѿ�������Ҫ׷�ӵ�Ŀ¼��һ�����Ͳ���׷���ˣ������һ��������Ҫ׷�� ͬʱ��¼��д��ע����·��  	
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


#�ж�ѡ���İ�װ·���Ƿ�Ϸ�����Ҫ���Ӳ���Ƿ����[ֻ����HDD]��·���Ƿ�����Ƿ��ַ� ���������$R5�� 
Function IsSetupPathIlleagal
	${GetRoot} "$INSTDIR" $R3   ;��ȡ��װ��Ŀ¼
	StrCpy $R0 "$R3\"
	StrCpy $R1 "invalid"  
	${GetDrives} "HDD" "HDDDetection"            ;��ȡ��Ҫ��װ�ĸ�Ŀ¼��������

	${If} $R1 == "HDD"              ;��Ӳ��       
		 StrCpy $R5 "1"	 
		 ${DriveSpace} "$R3\" "/D=F /S=M" $R0           #��ȡָ���̷���ʣ����ÿռ䣬/D=Fʣ��ռ䣬 /S=M��λ���ֽ�  
		 ${If} $R0 < 100                                #������װ����Ҫռ�õ�ʵ�ʿռ䣬��λ��MB  
		    StrCpy $R5 "-1"		#��ʾ�ռ䲻�� 
	     ${Endif}
	${Else}  
	     #0��ʾ���Ϸ� 
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

#��ȡĬ�ϵİ�װ·�� 
Function GenerateSetupAddress
	#��ȡע���װ·�� 
	SetRegView 32	
	ReadRegStr $0 HKLM "Software\${PRODUCT_PATHNAME}" "InstPath"
	${If} "$0" != ""		#·�������ڣ�������ѡ��·��  	
		#·����ȡ���ˣ�ֱ��ʹ�� 
		#���ж�һ�����·���Ƿ���Ч 
		nsNiuniuSkin::StringHelper "$0" "\\" "\" "replace"
		Pop $0
		StrCpy $INSTDIR "$0"
	${EndIf}
	
	#�����ע�����ĵ�ַ�Ƿ�������Ҫд��Ĭ�ϵ�ַ      
	Call IsSetupPathIlleagal
	${If} $R5 == "0"
		StrCpy $INSTDIR "$PROGRAMFILES\${INSTALL_APPEND_PATH}"		
	${EndIf}	
FunctionEnd

# ����ж����� 
Function CreateUninstall
	#д��ע����Ϣ 
	SetRegView 32
	WriteRegStr HKLM "Software\${PRODUCT_PATHNAME}" "InstPath" "$INSTDIR"
	
	WriteUninstaller "$INSTDIR\uninst.exe"
	
	# ���ж����Ϣ���������
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "DisplayName" "${PRODUCT_NAME}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "UninstallString" "$INSTDIR\uninst.exe"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "DisplayIcon" "$INSTDIR\${EXE_NAME}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "Publisher" "${PRODUCT_PUBLISHER}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}" "DisplayVersion" "${PRODUCT_VERSION}"
FunctionEnd

# ========================= ��װ���� ===============================
Function CreateShortcut
	CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
	CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk" "$INSTDIR\${EXE_NAME}" "" "$INSTDIR\logo.ico"
	CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\ж��${PRODUCT_NAME}.lnk" "$INSTDIR\uninst.exe"
	CreateShortCut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${EXE_NAME}"
FunctionEnd

Function ExtractFunc
	#��װ�ļ���7Zѹ����
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
	
	; ɾ����ݷ�ʽ
	Delete "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk"
	Delete "$SMPROGRAMS\${PRODUCT_NAME}\ж��${PRODUCT_NAME}.lnk"
	RMDir "$SMPROGRAMS\${PRODUCT_NAME}\"
	Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
FunctionEnd