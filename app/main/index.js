function init(){app.makeSingleInstance((e,n)=>{mainWindow&&(mainWindow.isMinimized()&&mainWindow.restore(),mainWindow.focus())})&&app.quit(),i.transports.file.format="[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}",o.dev()||args.dev?i.transports.file.level="debug":(i.transports.console=!1,i.transports.file.level="error"),i.debug(`app start, version ${app.getVersion()}`),listenEvent(),listenMessage()}function createWindow(){mainWindow=new BrowserWindow({width:1280,height:800,minWidth:1024,minHeight:768,frame:!1,show:!1}),args.fullscreen&&mainWindow.setFullScreen(!0),mainWindow.loadURL(`file://${__dirname}/../index.html`),mainWindow.focus(),mainWindow.on("closed",e=>{mainWindow=null}).once("ready-to-show",()=>{mainWindow.show()}),mainWindow.webContents.on("devtools-reload-page",e=>{closeAllSerialPort()}),mainWindow.webContents.session.on("will-download",(e,r,o)=>{var t=n.join(app.getPath("appData"),app.getName(),"temp",r.getFilename());r.setSavePath(t);var a=r.getURL(),s=a.lastIndexOf("#"),d=a.substring(s+1);a=a.substring(0,s),r.on("updated",(e,n)=>{"interrupted"==n?i.debug(`download interrupted: ${a}`):"progressing"===n&&r.isPaused()&&i.debug(`download paused: ${a}`)}),r.once("done",(e,n)=>{"completed"==n?(i.debug(`download success: ${a}, at ${t}`),postMessage("app:onDownloadSuccess",t,d)):i.debug(`download fail: ${a}`)})})}function listenEvent(){app.on("ready",e=>{i.debug("app ready"),o.dev()&&args.dev&&t({showDevTools:!0}),createWindow(),loadBoards()}).on("window-all-closed",e=>{"darwin"!==process.platform&&app.quit()}).on("activate",e=>{null===mainWindow&&createWindow()}).on("will-quit",e=>{closeAllSerialPort()}).on("quit",e=>{i.debug("app quit")})}function listenMessage(){ipcMain.on("app:getVersion",(e,n)=>{e.sender.send("app:getVersion",n,!0,app.getVersion())}).on("app:reload",(e,n)=>{mainWindow.reload(),e.sender.send("app:reload",n,!0,!0)}).on("app:min",(e,n)=>{mainWindow.minimize(),e.sender.send("app:min",n,!0,!0)}).on("app:max",(e,n)=>{mainWindow.isFullScreen()?mainWindow.setFullScreen(!1):mainWindow.isMaximized()?mainWindow.unmaximize():mainWindow.maximize(),e.sender.send("app:max",n,!0,!0)}).on("app:fullscreen",(e,n)=>{var r=!mainWindow.isFullScreen();mainWindow.setFullScreen(r),e.sender.send("app:fullscreen",n,!0,r)}).on("app:quit",(e,n)=>{app.quit()}).on("app:openUrl",(e,n,r)=>{var o=r&&shell.openExternal(r);e.sender.send("app:openUrl",n,o,o)}).on("app:netRequest",(e,n,r)=>{var o=net.request(r);if(r.header)for(var t in r.header)o.setHeader(t,r.header[t]);o.on("response",o=>{var t=[],i=0;o.on("data",e=>{t.push(e),i+=e.length}).on("end",o=>{var a;switch(t.length){case 0:a=new Buffer(0);break;case 1:a=t[0];break;default:a=new Buffer(i);var s=0;t.forEach(e=>{e.copy(a,s),s+=e.len})}if(a=a.toString(),r.json){var d;try{d=JSON.parse(a)}catch(r){return void e.sender.send("app:netRequest",n,!1,a)}a=d}e.sender.send("app:netRequest",n,!0,a)})}).on("abort",r=>{i.error(err),e.sender.send("app:netRequest",n,!1,"abort")}).on("error",r=>{i.error(r),e.sender.send("app:netRequest",n,!1,r)}).end()}).on("app:execCommand",(e,n,r,o)=>{execCommand(r,o).then(r=>{e.sender.send("app:execCommand",n,!0,r)},r=>{e.sender.send("app:execCommand",n,!1,r)})}).on("app:readFile",(e,n,r,o)=>{readFile(r,o).then(r=>{e.sender.send("app:readFile",n,!0,r)},r=>{e.sender.send("app:readFile",n,!1,r)})}).on("app:writeFile",(e,n,r,o)=>{writeFile(r,o).then(r=>{e.sender.send("app:writeFile",n,!0,!0)},r=>{e.sender.send("app:writeFile",n,!1,r)})}).on("app:removeFile",(e,n,r)=>{removeFile(r).then(r=>{e.sender.send("app:removeFile",n,!0,!0)},r=>{e.sender.send("app:removeFile",n,!1,r)})}).on("app:saveProject",(e,n,r,o,t)=>{saveProject(r,o,t).then(r=>{e.sender.send("app:saveProject",n,!0,r)},r=>{e.sender.send("app:saveProject",n,!1,r)})}).on("app:openProject",(e,n,r)=>{openProject(r).then(r=>{e.sender.send("app:openProject",n,!0,r)},r=>{e.sender.send("app:openProject",n,!1,r)})}).on("app:buildProject",(e,n,r,o)=>{buildProject(r,o).then(r=>{e.sender.send("app:buildProject",n,!0,r)},r=>{e.sender.send("app:buildProject",n,!1,r)})}).on("app:getSerialPorts",(e,n)=>{getSerialPorts().then(r=>{e.sender.send("app:getSerialPorts",n,!0,r)},r=>{e.sender.send("app:getSerialPorts",n,!1,r)})}).on("app:openSerialPort",(e,n,r,o)=>{openSerialPort(r,o).then(r=>{e.sender.send("app:openSerialPort",n,!0,r)},r=>{e.sender.send("app:openSerialPort",n,!1,r)})}).on("app:writeSerialPort",(e,n,r,o)=>{writeSerialPort(r,o).then(r=>{e.sender.send("app:writeSerialPort",n,!0,!0)},r=>{e.sender.send("app:writeSerialPort",n,!1,r)})}).on("app:closeSerialPort",(e,n,r)=>{closeSerialPort(r).then(r=>{e.sender.send("app:closeSerialPort",n,!0,!0)},r=>{e.sender.send("app:closeSerialPort",n,!1,r)})}).on("app:updateSerialPort",(e,n,r,o)=>{updateSerialPort(r,o).then(r=>{e.sender.send("app:updateSerialPort",n,!0,!0)},r=>{e.sender.send("app:updateSerialPort",n,!1,r)})}).on("app:flushSerialPort",(e,n,r)=>{flushSerialPort(r).then(r=>{e.sender.send("app:flushSerialPort",n,!0,!0)},r=>{e.sender.send("app:flushSerialPort",n,!1,r)})}).on("app:upload",(e,n,r,o)=>{getSerialPorts().then(t=>{1==t.length?upload(r,t[0].comName,o).then(r=>{e.sender.send("app:upload",n,!0,!0)},r=>{e.sender.send("app:upload",n,!1,r)}):e.sender.send("app:upload",n,!1,{status:"SELECT_PORT",ports:t})},r=>{e.sender.send("app:upload",n,!1,{status:"NOT_FOUND_PORT"})})}).on("app:upload2",(e,n,r,o,t)=>{upload(r,o,t).then(r=>{e.sender.send("app:upload2",n,!0,!0)},r=>{e.sender.send("app:upload2",n,!1,r)})}).on("app:errorReport",(e,n,r)=>{i.error(`------ error message ------`),i.error(`${r.message}(${r.src} at line ${r.line}:${r.col})`),i.error(`${r.stack}`),e.sender.send("app:errorReport",n,!0,!0)}).on("app:log",(e,n,r,o)=>{i.log(o||"debug",r),e.sender.send("app:log",n,!0,!0)}).on("app:getOSInfo",(e,n)=>{e.sender.send("app:getOSInfo",n,!0,getOSInfo())}).on("app:download",(e,n,r,o)=>{i.debug(`download ${r}, action ${o}`),mainWindow.webContents.downloadURL(`${r}#${o}`),e.sender.send("app:download",n,!0,!0)}).on("app:installDriver",(e,n,r)=>{installDriver(r).then(n=>{e.sender.send("app:installDriver",deferId,!0,!0)},n=>{e.sender.send("app:installDriver",deferId,!1,n)})})}function postMessage(e){mainWindow&&mainWindow.webContents.send(e,Array.from(arguments).slice(1))}function getOSInfo(){return{bit:o.x86()?32:64,platform:getSystemSuffix()}}function installDriver(e){var r=a.defer();i.debug(`installDriver: ${e}`);var o=n.dirname(e);return p(e,{dir:o},t=>{if(t)return i.error(t),void r.reject(t);var a=n.join(o,n.basename(e,n.extname(e)),"arduino驱动安装.exe"),s=`start /WAIT ${a}`;execCommand(s).then(e=>{r.resolve()},e=>{i.error(e),r.reject(e)})}),r.promise}function getSerialPorts(){var e=a.defer();return i.debug("getSerialPorts"),u.list((n,r)=>{return n?(i.error(n),void e.reject(n)):0==r.length?void e.reject():void matchBoardNames(r).then(n=>{i.debug(r.map(e=>`${e.comName}, pid: ${e.productId}, vid: ${e.vendorId}, boardName: ${e.boardName||""}`).join("\n")),e.resolve(r)},n=>{n&&(i.error(n),e.reject(n))})}),e.promise}function openSerialPort(e,n){var r=a.defer();if(i.debug(`openSerialPort: ${e}, options: ${JSON.stringify(n)}`),n.autoOpen=!1,"raw"==n.parser)n.parser=u.parsers.raw;else{var o=n.parser.replace("NL","\n").replace("CR","\r");n.parser=u.parsers.readline(o)}var t=new u(e,n);return t.open(e=>{if(e)return i.error(e),void r.reject(e);var n=addPort(t);t.flush(e=>{r.resolve(n)})}),r.promise}function writeSerialPort(e,n){var r=a.defer();i.debug(`writeSerialPort: ${e}, ${n}`);var o=connectedPorts.ports[e];return o?(o.write(n,e=>{return e?(i.error(e),void r.reject(e)):void o.drain(e=>{r.resolve()})}),r.promise):(setTimeout(e=>{r.reject()},10),r.promise)}function closeSerialPort(e){var n=a.defer(),r=connectedPorts.ports[e];return r?(r.close(e=>{n.resolve()}),n.promise):(setTimeout(e=>{n.reject()},10),n.promise)}function closeAllSerialPort(){for(var e in connectedPorts.ports)connectedPorts.ports[e].close();connectedPorts.ports={}}function updateSerialPort(e,n){var r=a.defer(),o=connectedPorts.ports[e];return o?(o.update(n,e=>{r.resolve()}),r.promise):(setTimeout(e=>{r.reject()},10),r.promise)}function flushSerialPort(e,n){var r=a.defer(),o=connectedPorts.ports[e];return o?(o.flush(e=>{r.resolve()}),r.promise):(setTimeout(e=>{r.reject()},10),r.promise)}function addPort(e){var n=++connectedPorts.autoPortId;return connectedPorts.ports[n]=e,e.on("error",e=>{postMessage("app:onSerialPortError",n,e)}).on("close",e=>{delete connectedPorts.ports[n],postMessage("app:onSerialPortClose",n)}).on("data",e=>{postMessage("app:onSerialPortData",n,e)}),n}function getScript(e,r){var t="genuino101"==r?"_101":"";return o.windows()?n.join("scripts",`${e}${t}.bat`):o.macOS()?o.dev()?n.join(`scripts`,`${e}${t}.sh`):n.join(app.getAppPath(),"..","..","scripts",`${e}${t}.sh`):n.join("scripts",`${e}${t}.sh`)}function showOpenDialog(e){var n=a.defer();return e=e||{},e.title="打开",e.defaultPath=app.getPath("documents"),e.buttonLabel="打开",i.debug(`showOpenDialog: options: ${JSON.stringify(e)}`),dialog.showOpenDialog(mainWindow,e,e=>{return e?void n.resolve(e[0]):void n.reject()}),n.promise}function showSaveDialog(e){var n=a.defer();return e=e||{},e.title="保存",e.defaultPath=app.getPath("documents"),e.buttonLabel="保存",i.debug(`showSaveDialog: options: ${JSON.stringify(e)}`),dialog.showSaveDialog(mainWindow,e,e=>{return e?void n.resolve(e):void n.reject()}),n.promise}function readJson(e,n){var r=a.defer();return n=n||{},i.debug(`readJson:${e}, options: ${JSON.stringify(n)}`),s.readJson(e,n,(e,n)=>{return e?(i.error(e),void r.reject(e)):void r.resolve(n)}),r.promise}function writeJson(e,n,r){var o=a.defer();return r=r||{},i.debug(`writeJson:${e}, options: ${JSON.stringify(r)}`),s.outputJson(e,n,r,e=>{return e?(i.error(e),void o.reject(e)):void o.resolve()}),o.promise}function readFile(e,n){var r=a.defer();return n=n||"utf8",i.debug(`readFile:${e}, options: ${JSON.stringify(n)}`),s.readFile(e,n,(e,n)=>{return e?(i.error(e),void r.reject(e)):void r.resolve(n)}),r.promise}function writeFile(e,n){var r=a.defer();return i.debug(`writeFile:${e}`),s.outputFile(e,n,e=>{return e?(i.error(e),void r.reject(e)):void r.resolve()}),r.promise}function removeFile(e){var n=a.defer();return i.debug(`removeFile:${e}`),s.remove(e,data,e=>{return e?(i.error(e),void n.reject(e)):void n.resolve()}),n.promise}function saveProject(e,r,o){var t=a.defer();o=o===!0,i.debug(`saveProject: isTemp:${o}`);var s=e=>{var o=new Date;r.updated_at=o,r.project_name=n.basename(e),a.all([writeFile(n.join(e,n.basename(e)+".ino"),r.project_data.code),writeJson(n.join(e,"project.json"),r)]).then(n=>{t.resolve({path:e,updated_at:r.updated_at,project_name:r.project_name})},e=>{t.reject()})};if(e)s(e);else if(o){var d=n.join(app.getPath("temp"),"build","sketch"+(new Date).getTime());s(d)}else showSaveDialog().then(e=>{s(e)},e=>{t.reject()});return t.promise}function openProject(e){var r=a.defer(),o=e=>{readJson(n.join(e,"project.json")).then(n=>{r.resolve({path:e,projectInfo:n})},e=>{r.reject(e)})};return e?o(e):showOpenDialog({properties:["openDirectory"]}).then(e=>{o(e)},e=>{r.reject(e)}),r.promise}function buildProject(e,r){var o=a.defer();r=r||{},r.board_type=r.board_type||"uno";var t=getScript("build",r.board_type);i.debug(n.resolve(t));var s;return s="genuino101"==r.board_type?`${t} ${e}`:`${t} ${e} ${r.board_type}`,i.debug(`buildProject:${e}, options: ${JSON.stringify(r)}`),execCommand(s).then(t=>{o.resolve(n.join(e,"build",n.basename(e)+`.ino.${"genuino101"==r.board_type?"bin":"hex"}`))},e=>{o.reject(e)}),o.promise}function upload(e,r,o){var t=a.defer();return i.debug(`upload:${e}, ${r}, options: ${JSON.stringify(o)}`),preUpload(r,o.board_type).then(a=>{var s=getScript("upload",o.board_type);i.debug(n.resolve(s));var d=`${s} ${e} ${r}`;execCommand(d).then(e=>{t.resolve()},e=>{t.reject(e)})},e=>{t.reject(e)}),t.promise}function preUpload(e,n){var r=a.defer();if("genuino101"!=n)return setTimeout(e=>{r.resolve()},10),r.promise;var o=new u(e,{baudRate:1200});return o.on("open",e=>{o.set({rts:!0,dtr:!1}),setTimeout(e=>{o.close(e=>{r.resolve()})},650)}).on("error",e=>{i.error(e),o.close(n=>{r.reject(e)})}),r.promise}function getSystemSuffix(){if(o.windows())return"win";if(o.macOS())return"mac";var e=r.arch();return e.indexOf("arm")>=0?"arm":"linux"}function loadBoards(e){var n=a.defer();if(boardNames&&!e)return setTimeout(e=>{n.resolve(boardNames)},10),n.promise;var r={},o=/\n(([^\.\n]+)\.pid(\.\d)?)=([^\r\n]+)/g,t=/\n(([^\.\n]+)\.vid(\.\d)?)=([^\r\n]+)/g,s=/\n([^\.\n]+)\.name=([^\r\n]+)/g,d="arduino-"+getSystemSuffix();return c(`${d}/**/boards.txt`,{},(e,a)=>{if(e)return i.error(e),void n.reject(e);var d=a.length;a.forEach(e=>{readFile(e).then(e=>{var i=e.match(o),a=e.match(t),u=e.match(s),c=[];u.forEach(e=>{var n=e.substring(0,e.indexOf(".name")).trim(),r=e.substring(e.indexOf("=")+1).trim();c[n]=r});var p=i.map(e=>e.substring(0,e.indexOf(".pid")).trim());i=i.map(e=>e.substring(e.indexOf("=")+3)),a=a.map(e=>e.substring(e.indexOf("=")+3));for(var f=0;f<i.length;f++)r[i[f]+"_"+a[f]]={pid:i[f],vid:a[f],type:p[f],name:c[p[f]]};d--,0==d&&(boardNames=r,n.resolve(boardNames))},e=>{i.error(e),n.reject(e)})})}),n.promise}function matchBoardNames(e){var n=a.defer();return loadBoards().then(r=>{e.forEach(e=>{if(e.productId&&e.vendorId){var n=boardNames[e.productId+"_"+e.vendorId];n&&(e.boardName=n.name)}}),n.resolve(e)},e=>{i.error(e),n.reject(e)}),n.promise}function execCommand(n,r){var o=a.defer();return r=r||{},i.debug(`execCommand:${n}, options: ${JSON.stringify(r)}`),e.exec(n,r,(e,n,r)=>{return e?(i.error(e),void o.reject(e)):void o.resolve(n)}),o.promise}const{app:app,BrowserWindow:BrowserWindow,ipcMain:ipcMain,net:net,dialog:dialog,shell:shell}=require("electron"),e=require("child_process"),n=require("path"),r=require("os"),o=require("electron-is"),t=require("electron-debug"),i=require("electron-log"),a=require("q"),s=require("fs-extra"),d=require("minimist"),u=require("serialport"),c=require("glob"),p=require("extract-zip");var boardNames,mainWindow,args=d(process.argv.slice(1)),connectedPorts={autoPortId:0,ports:{}};init();