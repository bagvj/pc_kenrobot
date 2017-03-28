###修复用electron-builder nsis打包，安装完成时不能运行的BUG
	1. 进入./node_modules/electron-builder/templates/nsis/
	
	2. 用$startMenuLink替换boringInstaller.nsh中第11行和第13行的$SMPROGRAMS\${PRODUCT_FILENAME}.lnk
```
	Function StartApp
	  ${if} ${Updated}
	    ${StdUtils.ExecShellAsUser} $0 "$startMenuLink" "open" "--updated"
	    # ${StdUtils.ExecShellAsUser} $0 "$SMPROGRAMS\${PRODUCT_FILENAME}.lnk" "open" "--updated"
	  ${else}
	    ${StdUtils.ExecShellAsUser} $0 "$startMenuLink" "open" ""
	    # ${StdUtils.ExecShellAsUser} $0 "$SMPROGRAMS\${PRODUCT_FILENAME}.lnk" "open" ""
	  ${endif}
	FunctionEnd
```
	3. 把installer.nsh中第26-27行调整到第5行下面
```
!include "allowOnlyOneInstallerInstance.nsh"

Var startMenuLink
Var desktopLink
```