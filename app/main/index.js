"use strict";!function e(r,n,t){function o(a,u){if(!n[a]){if(!r[a]){var s="function"==typeof require&&require;if(!u&&s)return s(a,!0);if(i)return i(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var f=n[a]={exports:{}};r[a][0].call(f.exports,function(e){var n=r[a][1][e];return o(n||e)},f,f.exports,e,r,n,t)}return n[a].exports}for(var i="function"==typeof require&&require,a=0;a<t.length;a++)o(t[a]);return o}({1:[function(e,r,n){function t(){ue.transports.file.format="[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}",ie.dev()&&me.dev?ue.transports.file.level="debug":(ue.transports.console=!1,ue.transports.file.level="error")}function o(){var e=ie.windows()?"pepflashplayer.dll":ie.macOS()?"PepperFlashPlayer.plugin":"libpepflashplayer.so";e=$.join(L("FlashPlayer"),e),ue.debug("initFlashPlugin: "+e+", version: 23.0.0.207"),W.commandLine.appendSwitch("ppapi-flash-path",e),W.commandLine.appendSwitch("ppapi-flash-version","23.0.0.207")}function i(){var e=$.join(__dirname,".."),r=de();r.use("/",de.static($.join(e,"public"))),r.listen(pe)}function a(){K=new X({width:1200,height:720,minWidth:1200,minHeight:720,frame:!1,show:!1,webPreferences:{plugins:!0,webSecurity:!1}}),me.fullscreen&&K.setFullScreen(!0),K.on("closed",function(e){ue.debug("mainWindow closed"),K=null}).once("ready-to-show",function(){K.show()}).on("enter-full-screen",function(e){re.postMessage("app:onFullscreenChange",!0)}).on("leave-full-screen",function(e){re.postMessage("app:onFullscreenChange",!1)}),K.webContents.on("devtools-reload-page",function(e){te.closeAllSerialPort()}),K.webContents.session.on("will-download",x),K.loadURL(ve),K.focus()}function u(){W.on("ready",f).on("window-all-closed",function(e){return"darwin"!==process.platform&&W.quit()}).on("activate",function(e){return null===K&&a()}).on("will-quit",l).on("quit",function(e){return ue.debug("app quit")})}function s(){c("getAppInfo",function(e){return re.resolvePromise(re.getAppInfo())}),c("getBaseUrl",function(e){return re.resolvePromise(ve)}),c("execFile",function(e){return re.execFile(e)}),c("execCommand",function(e,r){return re.execCommand(e,r)}),c("spawnCommand",function(e,r,n){return re.spawnCommand(e,r,n)}),c("readFile",function(e,r){return re.readFile(e,r)}),c("writeFile",function(e,r){return re.writeFile(e,r)}),c("moveFile",function(e,r,n){return re.moveFile(e,r,n)}),c("removeFile",function(e){return re.removeFile(e)}),c("showOpenDialog",function(e){return re.showOpenDialog(K,e)}),c("showSaveDialog",function(e){return re.showSaveDialog(K,e)}),c("request",function(e,r,n){return re.request(e,r,n)}),c("showItemInFolder",function(e){return Y.showItemInFolder($.normalize(e))}),c("openUrl",function(e){return e&&Y.openExternal(e)}),c("listSerialPort",function(e){return T()}),c("openSerialPort",function(e,r){return A(e,r)}),c("writeSerialPort",function(e,r){return te.writeSerialPort(e,r)}),c("closeSerialPort",function(e){return te.closeSerialPort(e)}),c("updateSerialPort",function(e,r){return te.updateSerialPort(e,r)}),c("flushSerialPort",function(e){return te.flushSerialPort(e)}),c("saveProject",function(e,r,n){return _(e,r,n)}),c("openProject",function(e,r){return N(e,r)}),c("buildProject",function(e,r){return R(e,r)}),c("upload",function(e,r){return C(e,r)}),c("upload2",function(e,r,n){return E(e,r,n)}),c("download",function(e,r){return y(e,r)}),c("installDriver",function(e){return S(e)}),c("loadExamples",function(e){return P()}),c("openExample",function(e,r){return w(e,r)}),c("unzipPackage",function(e){return g(e)}),c("loadPackages",function(e){return b()}),c("deletePackage",function(e){return j(e)}),c("checkUpdate",function(e){return p(e)}),c("removeOldVersions",function(e){return v(e)}),c("setToken",function(e){return ne.set(e)}),c("saveToken",function(e){return ne.save(e)}),c("loadToken",function(e){return ne.load(e)}),c("removeToken",function(e){return ne.remove()}),c("syncSetBaseUrl",function(e){return oe.setBaseUrl(e)}),c("syncList",function(e){return oe.list()}),c("syncUpload",function(e,r){return oe.upload(e,r)}),c("syncDelete",function(e,r){return oe.remove(e,r)}),c("syncDownload",function(e,r){return oe.download(e,r)}),c("log",function(e,r){return(ue[r]||ue.debug).bind(ue).call(e)}),c("copy",function(e,r){return Z.writeText(e,r)}),c("quit",function(e){return W.quit()}),c("reload",function(e){return K.reload()}),c("fullscreen",function(e){return K.setFullScreen(!K.isFullScreen())}),c("min",function(e){return K.minimize()}),c("max",function(e){K.isFullScreen()?K.setFullScreen(!1):K.isMaximized()?K.unmaximize():K.maximize()}),c("errorReport",function(e){ue.error("------ error message ------"),ue.error(e.message+"("+e.src+" at line "+e.line+":"+e.col+")"),ue.error(""+e.stack)})}function c(e,r){var n=this,t="app:"+e;V.on(t,function(e,o){for(var i=arguments.length,a=Array(i>2?i-2:0),u=2;u<i;u++)a[u-2]=arguments[u];(r.apply(n,a)||re.resolvePromise()).then(function(r){e.sender.send(t,o,!0,r)},function(r){e.sender.send(t,o,!1,r)},function(r){e.sender.send(t,o,"notify",r)})})}function f(){ue.debug("app ready"),ie.dev()&&me.devTool&&ae({showDevTools:!0}),m().then(function(e){G=e,a(),q()})}function l(){te.closeAllSerialPort(),re.removeFile($.join(re.getAppDataPath(),"temp"),!0)}function d(){if(!ie.dev()&&G.installReportFail){var e=re.getAppInfo(),r={version:e.version,platform:e.platform,bit:e.bit,ext:e.ext,branch:e.branch,feature:e.feature,installTime:parseInt((new Date).getTime()/1e3)};re.request("http://userver.kenrobot.com/statistics/installations",{method:"post",data:{data:JSON.stringify(r)}}).then(function(e){delete G.installReportFail},function(e){e&&ue.error(e),G.installReportFail=!0}).fin(function(e){h()})}}function p(e){var r=se.defer(),n=re.getAppInfo(),t=e+"&version="+n.version+"&platform="+n.platform+"&arch="+n.arch+"&features="+n.feature+"&ext="+n.ext;return ue.debug("checkUpdate: "+t),re.request(t).then(function(e){r.resolve(e)},function(e){e&&ue.error(e),r.reject(e)}),r.promise}function v(e){var r=se.defer();if(ie.dev())return setTimeout(function(e){r.resolve()},10),r.promise;var n=re.getAppInfo(),t=$.join(re.getAppDataPath(),"download");return re.searchFiles(t+"/"+n.name+"-*."+n.ext).then(function(n){var o=/\d+\.\d+\.\d+/;n.map(function(e){return $.basename(e)}).filter(function(r){var n=r.match(o);return!!n&&re.versionCompare(n[0],e)<0}).forEach(function(e){re.removeFile($.join(t,e),!0)}),r.resolve()},function(e){e&&ue.error(e),r.reject(e)}),r.promise}function m(){var e=se.defer();ue.debug("loadConfig");var r=$.join(re.getAppDataPath(),"config.json");return ce.existsSync(r)?(re.readJson(r).then(function(r){e.resolve(r)},function(r){e.resolve({})}),e.promise):(setTimeout(function(r){e.resolve({})},10),e.promise)}function h(e){e=1==e;var r=$.join(re.getAppDataPath(),"config.json");return ue.debug("writeConfig, path: "+r+", sync: "+e),re.writeJson(r,G,e)}function g(e){var r=se.defer();return re.unzip(e,z(),!0).then(function(n){var t=$.basename(e);t=t.substring(0,t.indexOf("-"));var o=ie.windows()?"bat":"sh";re.searchFiles($.join(z(),t)+"/**/post_install."+o).then(function(e){if(0!=e.length){var n=e[0];re.execCommand('"'+n+'"',{cwd:$.dirname(n)}).then(function(e){r.resolve()},function(e){e&&ue.error(e),r.reject(e)})}else r.resolve()},function(e){e&&ue.error(e),r.reject(e)})},function(e){e&&ue.error(e),r.reject(e)},function(e){r.notify(e)}),r.promise}function b(){var e=se.defer(),r=[],n=z();return ue.debug("loadPackages: "+n),re.searchFiles(n+"/*/package.json").then(function(n){se.all(n.map(function(e){var n=se.defer();return re.readJson(e).then(function(n){n.path=$.dirname(e),n.boards&&n.boards.forEach(function(e){e.build&&e.build.prefs&&Object.keys(e.build.prefs).forEach(function(r){e.build.prefs[r]=e.build.prefs[r].replace("PACKAGE_PATH",n.path)}),e.upload&&e.upload.command&&(e.upload.command=e.upload.command.replace(/PACKAGE_PATH/g,n.path))});var t=$.join(n.path,"src");ce.existsSync(t)&&!he.librariesPath.includes(t)&&he.librariesPath.push(t),r.push(n)}).fin(function(e){n.resolve()}),n.promise})).then(function(n){e.resolve(r)})},function(r){r&&ue.error(r),e.reject(r)}),e.promise}function j(e){var r=se.defer();return ue.debug("deletePackage: "+e),re.removeFile($.join(z(),e)).then(function(e){r.resolve()},function(e){e&&ue.error(e),r.reject(e)}),r.promise}function w(e,r){var n=se.defer(),t=$.join(re.getResourcePath(),"examples",e,r);return ue.debug("openExample: "+t),re.readJson($.join(t,"project.json")).then(function(e){n.resolve(e)},function(e){e&&ue.error(e),n.reject(e)}),n.promise}function P(){var e=se.defer();return ue.debug("loadExamples"),re.readJson($.join(re.getResourcePath(),"examples","examples.json")).then(function(r){e.resolve(r)},function(r){r&&ue.error(r),e.reject(r)}),e.promise}function x(e,r,n){var t=r.getURL(),o=t.lastIndexOf("#"),i=ee.parse(t.substring(o+1));t=t.substring(0,o);var a=i.deferId,u=$.join(re.getAppDataPath(),"download",r.getFilename());if(i.checksum&&ce.existsSync(u)){o=i.checksum.indexOf(":");var s=i.checksum.substring(0,o);if(i.checksum.substring(o+1)==le.fromFileSync(u,{algorithm:s}))return r.cancel(),ue.debug("download cancel, "+t+" has cache"),void re.callDefer(a,!0,{path:u})}r.setSavePath(u);var c=r.getTotalBytes();r.on("updated",function(e,n){"interrupted"==n?(ue.debug("download interrupted: "+t),re.callDefer(a,!1,{path:u})):"progressing"===n&&(r.isPaused()?(ue.debug("download paused: "+t),re.callDefer(a,!1,{path:u})):re.callDefer(a,"notify",{path:u,totalSize:c,size:r.getReceivedBytes()}))}),r.once("done",function(e,r){"completed"==r?(ue.debug("download success: "+t+", at "+u),re.callDefer(a,!0,{path:u})):(ue.debug("download fail: "+t),re.callDefer(a,!1,{path:u}))})}function y(e,r){var n=se.defer(),t=re.getDefer(),o=t.deferId,i=t.promise;r.deferId=o;var a=ee.stringify(r);return ue.debug("download "+e+", options: "+a),i.then(function(e){n.resolve(e)},function(e){e&&ue.error(e),n.reject(e)},function(e){n.notify(e)}),K.webContents.downloadURL(e+"#"+a),n.promise}function S(e){var r=se.defer();ue.debug("installDriver: "+e);var n=$.join(re.getAppDataPath(),"temp");return re.unzip(e,n).then(function(t){var o=$.join(n,$.basename(e,$.extname(e)),"setup.exe");re.execFile(o).then(function(e){r.resolve()})},function(e){e&&ue.error(e),r.reject(e)}),r.promise}function A(e,r){return te.openSerialPort(e,r,{onError:D,onData:I,onClose:O})}function D(e,r){re.postMessage("app:onSerialPortError",e,r)}function I(e,r){re.postMessage("app:onSerialPortData",e,r)}function O(e){re.postMessage("app:onSerialPortClose",e)}function T(){var e=se.defer();return te.listSerialPort().then(function(r){0!=(r=F(r)).length?B(r).then(function(n){ue.debug(r.map(function(e){return e.comName+", pid: "+e.productId+", vid: "+e.vendorId+", boardName: "+(e.boardName||"")}).join("\n")),e.resolve(r)},function(r){r&&ue.error(r),e.reject(r)}):e.reject()},function(r){r&&ue.error(r),e.reject(r)}),e.promise}function F(e){var r=/(COM\d+)|(usb-serial)|(arduino)|(\/dev\/cu\.usbmodem)|(\/dev\/(ttyUSB|ttyACM|ttyAMA))/;return e.filter(function(e){return r.test(e.comName)})}function _(e,r,n){var t=se.defer();n=!0===n,ue.debug("saveProject: isTemp:"+n);var o=function(e){var n=new Date;r.updated_at=n,r.project_name=$.basename(e),se.all([re.writeFile($.join(e,$.basename(e)+".ino"),r.project_data.code),re.writeJson($.join(e,"project.json"),r)]).then(function(n){t.resolve({path:e,updated_at:r.updated_at,project_name:r.project_name})},function(e){t.reject()})};if(e)o(e);else if(n){var i=$.join(W.getPath("temp"),"build","sketch"+(new Date).getTime());o(i)}else re.showSaveDialog(K).then(function(e){o(e)},function(e){t.reject()});return t.promise}function N(e,r){var n=se.defer();r=r||"project",ue.debug("openProject "+e);var t=function(e){if("project"==r)re.readJson($.join(e,"project.json")).then(function(r){n.resolve({path:e,projectInfo:r})},function(e){e&&ue.error(e),n.reject(e)});else{var t=$.dirname(e),o=$.basename(e,$.extname(e));if($.basename(t)!=o)return void setTimeout(function(r){n.reject({path:e,newPath:$.join(t,o,o+".ino"),status:"DIR_INVALID"})},10);re.readFile(e).then(function(e){n.resolve({path:t,code:e})},function(e){e&&ue.error(e),n.reject(e)})}};if(e)t(e);else{var o="project"==r?null:[{name:"ino",extensions:["ino"]}],i="project"==r?["openDirectory"]:["openFile"];re.showOpenDialog(K,{properties:i,filters:o}).then(function(e){t(e)},function(e){e&&ue.error(e),n.reject(e)})}return n.promise}function R(e,r){var n=se.defer();return U(e,r).then(function(r){ue.debug("buildProject: "+e+", command path: "+r);var t=J("call");re.spawnCommand('"'+t+'"',['"'+r+'"'],{shell:!0}).then(function(e){n.resolve()},function(e){e&&ue.error(e),n.reject(e)},function(e){n.notify(e)})},function(e){e&&ue.error(e),n.reject(e)}),n.promise}function U(e,r){var n=se.defer();ue.debug("pre-build");var t=[];r=Object.assign({},he.default.build,r);var o=z();ce.existsSync(o)&&t.push("-hardware="+o),t.push("-fqbn="+r.fqbn);var i=H();Object.keys(r.prefs).forEach(function(e){var n=re.handleQuotes(r.prefs[e]);n=n.replace(/ARDUINO_PATH/g,i),t.push("-prefs="+e+"="+n)}),he.librariesPath.forEach(function(e){t.push('-libraries="'+e+'"')});var a=$.join(e,"build");ce.ensureDirSync(a),re.removeFile($.join(a,"sketch","build"),!0);var u=M("build"),s=re.handleQuotes(r.command);return s=s.replace(/ARDUINO_PATH/g,H()).replace("BUILD_SPECS",t.join(" ")).replace("PROJECT_BUILD_PATH",a).replace("PROJECT_ARDUINO_FILE",$.join(e,$.basename(e)+".ino")),re.writeFile(u,s).then(function(t){var o=$.join(e,"build","build.options.json");if(!ce.existsSync(o))return setTimeout(function(e){n.resolve(u)},10),n.promise;re.readJson(o).then(function(t){r.fqbn!=t.fqbn?re.removeFile($.join(e,"build")).fin(function(r){ce.ensureDirSync($.join(e,"build")),n.resolve(u)}):n.resolve(u)},function(e){e&&ue.error(e),n.resolve(u)})},function(e){e&&ue.error(e),n.reject()}),n.promise}function C(e,r){var n=se.defer();return T().then(function(t){1==t.length?E(e,t[0].comName,r).then(function(e){n.resolve(e)},function(e){n.reject(e)},function(e){n.notify(e)}):n.reject({status:"SELECT_PORT",ports:t})},function(e){n.reject({status:"NOT_FOUND_PORT"})}),n.promise}function E(e,r,n){var t=se.defer();return k(e,r,n).then(function(n){ue.debug("upload: "+e+", "+r+", command path: "+n);var o=J("call");re.spawnCommand('"'+o+'"',['"'+n+'"'],{shell:!0}).then(function(e){t.resolve()},function(e){e&&ue.error(e),t.reject(e)},function(e){t.notify(e)})},function(e){e&&ue.error(e),t.reject(e)}),t.promise}function k(e,r,n){var t=se.defer();ue.debug("pre upload"),n=Object.assign({},he.default.upload,n);var o=$.join(e,"build",$.basename(e)+".ino."+n.target_type),i=M("upload"),a=re.handleQuotes(n.command);return a=a.replace(/ARDUINO_PATH/g,H()).replace("ARDUINO_MCU",n.mcu).replace("ARDUINO_BURNRATE",n.baudrate).replace("ARDUINO_PROGRAMMER",n.programer).replace("ARDUINO_COMPORT",r).replace("TARGET_PATH",o),re.writeFile(i,a).then(function(e){te.resetSerialPort(r).then(function(e){t.resolve(i)},function(e){e&&ue.error(e),t.reject(e)})},function(e){e&&ue.error(e),t.reject(e)}),t.promise}function q(e){var r=se.defer();if(G.boardNames&&!e)return ue.debug("skip loadBoards"),setTimeout(function(e){r.resolve(G.boardNames)},10),r.promise;ue.debug("loadBoards");var n={},t=/\n(([^\.\n]+)\.pid(\.\d)?)=([^\r\n]+)/g,o=/\n(([^\.\n]+)\.vid(\.\d)?)=([^\r\n]+)/g,i=/\n([^\.\n]+)\.name=([^\r\n]+)/g,a="arduino-"+re.getPlatform();return re.searchFiles(a+"/**/boards.txt").then(function(e){se.all(e.map(function(e){var r=se.defer();return re.readFile(e).then(function(e){var r=e.match(t),a=e.match(o),u=[];e.match(i).forEach(function(e){var r=e.substring(0,e.indexOf(".name")).trim(),n=e.substring(e.indexOf("=")+1).trim();u[r]=n});var s=r.map(function(e){return e.substring(0,e.indexOf(".pid")).trim()});r=r.map(function(e){return e.substring(e.indexOf("=")+3)}),a=a.map(function(e){return e.substring(e.indexOf("=")+3)});for(var c=0;c<r.length;c++)n[r[c]+"_"+a[c]]={pid:r[c],vid:a[c],type:s[c],name:u[s[c]]}}).fin(function(e){r.resolve()}),r.promise})).then(function(e){G.boardNames=n,h().then(function(e){r.resolve(G.boardNames)},function(e){e&&ue.error(e),r.reject(e)})})},function(e){e&&ue.error(e),r.reject(e)}),r.promise}function B(e){var r=se.defer();return ue.debug("matchBoardNames"),q().then(function(n){e.forEach(function(e){if(e.productId&&e.vendorId){var r=G.boardNames[e.productId+"_"+e.vendorId];r&&(e.boardName=r.name)}}),r.resolve(e)},function(e){e&&ue.error(e),r.reject(e)}),r.promise}function J(e){var r=ie.windows()?"bat":"sh";return $.join(re.getResourcePath(),"scripts",e+"."+r)}function M(e){return $.join(re.getAppDataPath(),"temp",e+".txt")}function H(){return $.join(re.getResourcePath(),"arduino-"+re.getPlatform())}function z(){return $.join(W.getPath("documents"),W.getName(),"packages")}function L(e){return $.join(re.getResourcePath(),"plugins",e,re.getPlatform())}var G,K,Q=e("electron"),W=Q.app,X=Q.BrowserWindow,V=Q.ipcMain,Y=Q.shell,Z=Q.clipboard,$=(Q.webContents,e("path")),ee=(e("os"),e("querystring")),re=(e("crypto"),e("./util")),ne=e("./token"),te=e("./serialPort"),oe=e("./sync"),ie=e("electron-is"),ae=e("electron-debug"),ue=e("electron-log"),se=e("q"),ce=e("fs-extra"),fe=e("minimist"),le=e("hasha"),de=e("express"),pe=8778,ve="http://localhost:"+pe,me=fe(process.argv.slice(1)),he={default:{build:{fqbn:"arduino:avr:uno:cpu=atmega328p",prefs:{"runtime.tools.avr-gcc.path":'"ARDUINO_PATH/hardware/tools/avr"',"runtime.tools.avrdude.path":'"ARDUINO_PATH/hardware/tools/avr"'},command:'"ARDUINO_PATH/arduino-builder" -compile -logger=machine -hardware="ARDUINO_PATH/hardware" -hardware="ARDUINO_PATH/packages" -tools="ARDUINO_PATH/tools-builder" -tools="ARDUINO_PATH/hardware/tools/avr" -tools="ARDUINO_PATH/packages" -built-in-libraries="ARDUINO_PATH/libraries" -ide-version=10612 -warnings=none -prefs=build.warn_data_percentage=75 BUILD_SPECS -build-path="PROJECT_BUILD_PATH" "PROJECT_ARDUINO_FILE"'},upload:{target_type:"hex",mcu:"atmega328p",baudrate:"115200",programer:"arduino",command:'"ARDUINO_PATH/hardware/tools/avr/bin/avrdude" -C "ARDUINO_PATH/hardware/tools/avr/etc/avrdude.conf" -v -p ARDUINO_MCU -c ARDUINO_PROGRAMMER -b ARDUINO_BURNRATE -P ARDUINO_COMPORT -D -U "flash:w:TARGET_PATH:i"'}},librariesPath:[]};!function(){process.on("uncaughtException",function(e){var r=e.stack||e.name+": "+e.message;ue.error(r)}),t(),o(),i(),W.makeSingleInstance(function(e,r){K&&(K.isMinimized()&&K.restore(),K.focus())})&&W.quit(),u(),s(),ue.debug("app start, version "+re.getVersion()),d()}()},{"./serialPort":2,"./sync":3,"./token":4,"./util":5,crypto:void 0,electron:void 0,"electron-debug":void 0,"electron-is":void 0,"electron-log":void 0,express:void 0,"fs-extra":void 0,hasha:void 0,minimist:void 0,os:void 0,path:void 0,q:void 0,querystring:void 0}],2:[function(e,r,n){function t(){var e=d.defer();return l.debug("listSerialPort"),p.list(function(r,n){if(r)return l.error(r),void e.reject(r);0!=n.length?e.resolve(n):e.reject()}),e.promise}function o(e,r,n){var t=d.defer();if(l.debug("openSerialPort: "+e+", options: "+JSON.stringify(r)),r.autoOpen=!1,"raw"==r.parser)r.parser=p.parsers.raw;else{var o=r.parser.replace("NL","\n").replace("CR","\r");r.parser=p.parsers.readline(o)}var i=new p(e,r);return i.open(function(e){if(e)return l.error(e),void t.reject(e);var r=++v.autoPortId;v.ports[r]=i,i.on("error",function(e){n&&n.onError&&n.onError(r,e)}).on("close",function(e){delete v.ports[r],n&&n.onClose&&n.onClose(r)}).on("data",function(e){n&&n.onData&&n.onData(r,e)}),i.flush(function(e){t.resolve(r)})}),t.promise}function i(e,r){var n=d.defer();l.debug("writeSerialPort: "+e+", "+r);var t=v.ports[e];return t?(t.write(r,function(e){if(e)return l.error(e),void n.reject(e);t.drain(function(e){n.resolve()})}),n.promise):(setTimeout(function(e){n.reject()},10),n.promise)}function a(e){var r=d.defer();l.debug("closeSerialPort, portId: "+e);var n=v.ports[e];return n?(n.close(function(e){r.resolve()}),r.promise):(setTimeout(function(e){r.reject()},10),r.promise)}function u(){l.debug("closeAllSerialPort");for(var e in v.ports)v.ports[e].close();v.ports={}}function s(e,r){var n=d.defer();l.debug("updateSerialPort, portId: "+e);var t=v.ports[e];return t?(t.update(r,function(e){n.resolve()}),n.promise):(setTimeout(function(e){n.reject()},10),n.promise)}function c(e,r){var n=d.defer();l.debug("flushSerialPort, portId: "+e);var t=v.ports[e];return t?(t.flush(function(e){n.resolve()}),n.promise):(setTimeout(function(e){n.reject()},10),n.promise)}function f(e){var r=d.defer(),n=new p(e,{baudRate:1200});return n.on("open",function(e){n.set({rts:!0,dtr:!1}),setTimeout(function(e){n.close(function(e){r.resolve()})},650)}).on("error",function(e){l.error(e),n.close(function(n){r.reject(e)})}),r.promise}e("path");var l=e("electron-log"),d=e("q"),p=e("serialport"),v={autoPortId:0,ports:{}};r.exports.listSerialPort=t,r.exports.openSerialPort=o,r.exports.writeSerialPort=i,r.exports.closeSerialPort=a,r.exports.closeAllSerialPort=u,r.exports.updateSerialPort=s,r.exports.flushSerialPort=c,r.exports.resetSerialPort=f},{"electron-log":void 0,path:void 0,q:void 0,serialport:void 0}],3:[function(e,r,n){function t(e){h.debug("sync setBaseUrl: "+e),l=e}function o(){var e=v.defer();h.debug("sync list");var r=j.get();if(!r||!l)return b.rejectPromise(null,e);var n=r.user_id,t=parseInt((new Date).getTime()/1e3),o=b.rsa_encrypt("Kenrobot-"+n+"-"+t),i=l+"/list";return b.request(i,{method:"post",data:{id:n,stamp:t,sign:o}}).then(function(r){e.resolve(r)},function(r){r&&h.error(r),e.reject(r)}),e.promise}function i(e,r){var n=v.defer();h.debug("sync upload: "+e+" "+r);var t=j.get();if(!t||!l)return b.rejectPromise(null,n);var o=t.user_id,i=parseInt((new Date).getTime()/1e3),a=b.rsa_encrypt("Kenrobot-"+o+"-"+i);return s(f(o),e,r).then(function(t){var u=l+"/upload";b.request(u,{method:"post",headers:{id:o,stamp:i,sign:a,name:e,type:r},body:p.createReadStream(t)}).then(function(e){n.resolve(e)},function(e){e&&h.error(e),n.reject(e)})},function(e){e&&h.error(e),n.reject(e)}),n.promise}function a(e,r){var n=v.defer();h.debug("sync remove: "+e+" "+r);var t=j.get();if(!t||!l)return b.rejectPromise(null,n);var o=t.user_id,i=parseInt((new Date).getTime()/1e3),a=b.rsa_encrypt("Kenrobot-"+o+"-"+i),u=l+"/delete";return b.request(u,{method:"post",data:{id:o,stamp:i,sign:a,name:e,type:r}}).then(function(e){n.resolve(e)},function(e){e&&h.error(e),n.reject(e)}),n.promise}function u(e,r){var n=v.defer();h.debug("sync download: "+e+" "+r);var t=j.get();if(!t||!l)return b.rejectPromise(null,n);var o=t.user_id,i=parseInt((new Date).getTime()/1e3),a=b.rsa_encrypt("Kenrobot-"+o+"-"+i),u={id:o,stamp:i,sign:a,name:e,type:r},s=l+"/download";return b.request(s,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)},!1).then(function(t){var i=d.join(b.getAppDataPath(),"temp",b.uuid(6)+".zip");p.ensureDirSync(d.dirname(i));var a=p.createWriteStream(i);t.body.pipe(a),t.body.on("end",function(t){c(i,f(o),e,r).then(function(e){n.resolve()},function(e){e&&h.error(e),n.reject(e)})}).on("error",function(e){e&&h.error(e),n.reject(e)})},function(e){e&&h.error(e),n.reject(e)}),n.promise}function s(e,r,n){var t=v.defer(),o=new g;switch(n){case"edu":case"ide":o.file(r+"/"+r+".ino",b.readFile(d.join(e,r+"/"+r+".ino"),{encoding:null},!0)),o.file(r+"/project.json",b.readFile(d.join(e,r+"/project.json"),{encoding:null},!0));break;case"scratch2":o.file(r+".sb2",b.readFile(d.join(e,r+".sb2"),{encoding:null},!0));break;case"scratch3":o.file(r+".json",b.readFile(d.join(e,r+".json"),{encoding:null},!0))}var i=d.join(b.getAppDataPath(),"temp",b.uuid(6)+".zip");return p.ensureDirSync(d.dirname(i)),o.generateNodeStream({streamFiles:!0}).pipe(p.createWriteStream(i)).on("finish",function(e){t.resolve(i)}).on("error",function(e){e&&h.error(e),t.reject(e)}),t.promise}function c(e,r,n,t){var o=v.defer();return b.readFile(e,{encoding:null}).then(function(e){var n=new g;n.loadAsync(e).then(function(e){var t=0;n.forEach(function(e,n){n.dir||(t++,n.async("string").then(function(n){b.writeFile(d.join(r,e),n,!0),0==--t&&o.resolve()},function(e){e&&h.error(e),o.reject(e)}))})},function(e){e&&h.error(e),o.reject(e)})},function(e){e&&h.error(e),o.reject(e)}),o.promise}function f(e){return d.join(b.getDocumentPath(),"projects",m(""+e,{algorithm:"md5"}))}var l,d=e("path"),p=e("fs-extra"),v=e("q"),m=e("hasha"),h=e("electron-log"),g=e("jszip"),b=e("./util"),j=e("./token");r.exports.setBaseUrl=t,r.exports.list=o,r.exports.upload=i,r.exports.remove=a,r.exports.download=u},{"./token":4,"./util":5,"electron-log":void 0,"fs-extra":void 0,hasha:void 0,jszip:void 0,path:void 0,q:void 0}],4:[function(e,r,n){function t(){return c}function o(e){c=e}function i(){c=null,v.removeFile(s(),!0)}function a(e){var r=d.defer(),n=l.randomBytes(128);return v.writeFile(s(),v.encrypt(JSON.stringify(e),n)).then(function(e){r.resolve(n.toString("hex"))},function(e){e&&m.error(e),r.reject(e)}),r.promise}function u(e){var r=d.defer(),n=s();return p.existsSync(n)?(v.readFile(n).then(function(n){var t=v.decrypt(n,Buffer.from(e,"hex"));try{r.resolve(JSON.parse(t))}catch(e){r.reject()}},function(e){e&&m.error(e),r.reject(e)}),r.promise):(setTimeout(function(e){r.reject()},10),r.promise)}function s(){return f.join(v.getAppDataPath(),"token")}var c,f=e("path"),l=e("crypto"),d=e("q"),p=e("fs-extra"),v=e("./util"),m=e("electron-log");r.exports.get=t,r.exports.set=o,r.exports.remove=i,r.exports.save=a,r.exports.load=u},{"./util":5,crypto:void 0,"electron-log":void 0,"fs-extra":void 0,path:void 0,q:void 0}],5:[function(e,r,n){function t(){return"x64"===process.arch||process.env.hasOwnProperty("PROCESSOR_ARCHITEW6432")}function o(){return K.windows()?"win":K.macOS()?"mac":k.arch().indexOf("arm")>=0?"arm":"linux"}function i(){return K.dev()?ee.version:H.getVersion()}function a(){var e={bit:t()?64:32,arch:process.arch,platform:o(),version:i(),name:H.getName()};return K.dev()?(e.ext=B.extname(H.getPath("exe")).replace(".",""),e.branch="beta",e.feature=""):(e.ext=ee.buildInfo.ext,e.branch=ee.buildInfo.branch,e.feature=ee.buildInfo.feature),e}function u(){return B.join(H.getPath("appData"),H.getName())}function s(){return K.windows()||K.dev()?B.resolve("."):B.resolve(H.getAppPath(),"..","..")}function c(){return B.join(H.getPath("documents"),H.getName())}function f(e,r){for(var n=/(\d+)\.(\d+)\.(\d+)/,t=n.exec(e),o=n.exec(r),i=[parseInt(t[1]),parseInt(t[2]),parseInt(t[3])],a=[parseInt(o[1]),parseInt(o[2]),parseInt(o[3])],u=0;u<=2;u++)if(i[u]!=a[u])return i[u]>a[u]?1:-1;return 0}function l(e){for(var r=arguments.length,n=Array(r>1?r-1:0),t=1;t<r;t++)n[t-1]=arguments[t];G.debug("postMessage: "+e+", "+n.join(", "));var o=L.getAllWindows();o&&o.length&&o[0].webContents.send(e,n)}function d(){var e=Q.defer(),r=te++;return ne[r]=e,{deferId:r,promise:e.promise}}function p(e,r){var n=ne[e];if(n){var t;"notify"==r?t=n.notify:(delete ne[e],t=r?n.resolve:n.reject);for(var o=arguments.length,i=Array(o>2?o-2:0),a=2;a<o;a++)i[a-2]=arguments[a];t.apply(this,i)}}function v(e){return K.windows()?e:e.replace(/"/g,"")}function m(e,r){var n,t="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),o=[];if(r=r||t.length,e)for(n=0;n<e;n++)o[n]=t[0|Math.random()*r];else{var i;for(o[8]=o[13]=o[18]=o[23]="-",o[14]="4",n=0;n<36;n++)o[n]||(i=0|16*Math.random(),o[n]=t[19==n?3&i|8:i])}return o.join("")}function h(e,r,n){n=n||"aes-128-cbc";var t=J.createCipher(n,r),o=t.update(e,"utf8","binary");return o+=t.final("binary"),o=new Buffer(o,"binary").toString("base64")}function g(e,r,n){n=n||"aes-128-cbc",e=new Buffer(e,"base64").toString("binary");var t=J.createDecipher(n,r),o=t.update(e,"binary","utf8");return o+=t.final("utf8")}function b(e,r){r=r||re;var n=new Buffer(e);return J.publicEncrypt({key:r,padding:J.constants.RSA_PKCS1_PADDING},n).toString("base64")}function j(e,r){var n=new Buffer(e,"base64");return J.privateDecrypt({key:r,padding:J.constants.RSA_PKCS1_PADDING},n).toString("utf8")}function w(e,r){return r=r||Q.defer(),setTimeout(function(n){r.resolve(e)},10),r.promise}function P(e,r){return r=r||Q.defer(),setTimeout(function(n){r.reject(e)},10),r.promise}function x(e){var r=Q.defer();G.debug("execFile: "+e);var n;return n=K.windows()?"start /WAIT "+e:""+e,y(n,null,!0).fin(function(e){r.resolve()}),r.promise}function y(e,r,n){var t=Q.defer();return r=r||{},n=n||!1,G.debug("execCommand:"+e+", options: "+JSON.stringify(r)+", useSudo: "+n),n?V.exec(e,{name:"kenrobot"},function(e,r,n){if(r=K.windows()?Y.decode(r||"","gbk"):r,n=K.windows()?Y.decode(n||"","gbk"):n,e)return G.error(e),r&&G.error(r),n&&G.error(n),void t.reject(n||r||e);K.dev()&&G.debug(r),t.resolve(r)}):q.exec(e,r,function(e,r,n){if(r=K.windows()?Y.decode(r||"","gbk"):r,n=K.windows()?Y.decode(n||"","gbk"):n,e)return G.error(e),r&&G.error(r),n&&G.error(n),void t.reject(n||r||e);K.dev()&&G.debug(r),t.resolve(r)}),t.promise}function S(e,r,n){var t=Q.defer(),o=q.spawn(e,r,n);return o.stdout.on("data",function(e){var r=K.windows()?Y.decode(e,"gbk"):e.toString();K.dev()&&G.debug(r),t.notify({type:"stdout",data:r})}),o.stderr.on("data",function(e){var r=K.windows()?Y.decode(e,"gbk"):e.toString();K.dev()&&G.debug(r),t.notify({type:"stderr",data:r})}),o.on("close",function(e){0==e?t.resolve():t.reject()}),t.promise}function A(e,r,n){if(n=!0===r||!1!==r&&n)return W.readFileSync(e,r);var t=Q.defer();return r=r||"utf8",G.debug("readFile:"+e+", options: "+JSON.stringify(r)),W.readFile(e,r,function(e,r){if(e)return G.error(e),void t.reject(e);t.resolve(r)}),t.promise}function D(e,r,n){if(!n){var t=Q.defer();return G.debug("writeFile:"+e),W.outputFile(e,r,function(e){if(e)return G.error(e),void t.reject(e);t.resolve()}),t.promise}W.outputFileSync(e,r)}function I(e,r,n){var t=Q.defer();return n=n||{overwrite:!0},G.debug("moveFile:"+e+" -> "+r),W.move(e,r,n,function(e){if(e)return G.error(e),void t.reject(e);t.resolve()}),t.promise}function O(e,r){if(!r){var n=Q.defer();return G.debug("removeFile:"+e),W.remove(e,function(e){if(e)return G.error(e),void n.reject(e);n.resolve()}),n.promise}G.debug("removeFile:"+e),W.removeSync(e)}function T(e,r){var n=Q.defer();return r=r||{},G.debug("readJson:"+e+", options: "+JSON.stringify(r)),W.readJson(e,r,function(e,r){if(e)return G.error(e),void n.reject(e);n.resolve(r)}),n.promise}function F(e,r,n,t){if(!(t=!0===n||!1!==n&&t)){var o=Q.defer();return n=n||{},G.debug("writeJson:"+e+", options: "+JSON.stringify(n)),W.outputJson(e,r,n,function(e){if(e)return G.error(e),void o.reject(e);o.resolve()}),o.promise}W.outputJsonSync(e,r,n)}function _(e){var r=Q.defer();return G.debug("searchFiles: "+e),X(e,{},function(e,n){return e?(G.error(e),void r.reject(e)):r.resolve(n)}),r.promise}function N(e,r,n){var t=Q.defer(),o=/([\d]+)% \d+ - .*\r?/g;return G.debug("unzip: "+e+" => "+r),n?S('"'+Z+'"',["x",'"'+e+'"',"-bsp1","-y",'-o"'+r+'"'],{shell:!0}).then(function(e){t.resolve(e)},function(e){e&&G.error(e),t.reject(e)},function(e){if(o.lastIndex=0,o.test(e.data)){var r,n=o.exec(e.data);do{r=n,n=o.exec(e.data)}while(n);t.notify(parseInt(r[1]))}}):y('"'+Z+'" x "'+e+'" -y -o"'+r+'"').then(function(e){t.resolve()},function(e){e&&G.error(e),t.reject(e)}),t.promise}function R(e,r,n,t){var o=Q.defer();return r=r instanceof Array?r:[r],t=t||"7z",y('cd "'+e+'" && "'+Z+'" a -t'+t+" -r "+n+" "+r.join(" ")).then(function(e){o.resolve()},function(e){e&&G.error(e),o.reject(e)}),o.promise}function U(e,r){var n=Q.defer();return r=r||{},r.title="打开",r.defaultPath=H.getPath("documents"),r.buttonLabel="打开",G.debug("showOpenDialog: options: "+JSON.stringify(r)),z.showOpenDialog(e,r,function(e){e?n.resolve(e[0]):n.reject()}),n.promise}function C(e,r){var n=Q.defer();return r=r||{},r.title="保存",r.defaultPath=H.getPath("documents"),r.buttonLabel="保存",G.debug("showSaveDialog: options: "+JSON.stringify(r)),z.showSaveDialog(e,r,function(e){e?n.resolve(e):n.reject()}),n.promise}function E(e,r,n){var t=Q.defer();if(r=r||{},n=!1!==n,r.method=r.method||"GET",n&&r.data){r.body=JSON.stringify(r.data);var o=r.headers||(r.headers={});o["Content-Type"]="application/json",o.Accept="application/json",delete r.data}return $(e,r).then(function(e){if(e.ok)return n?e.json():e;var r=new Error(e.statusText);throw r.status=e.status,r}).then(function(e){t.resolve(e)}).catch(function(e){e&&G.error(e),t.reject(e)}),t.promise}var k=e("os"),q=e("child_process"),B=e("path"),J=e("crypto"),M=e("electron"),H=M.app,z=M.dialog,L=M.BrowserWindow,G=e("electron-log"),K=e("electron-is"),Q=e("q"),W=e("fs-extra"),X=e("glob"),V=e("sudo-prompt"),Y=e("iconv-lite"),Z=e("7zip-bin").path7za.replace("app.asar","app.asar.unpacked"),$=e("node-fetch"),ee=e("../package"),re="-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7Jat1/19NDxOObrFpW8USTia6\nuHt34Sac1Arm6F2QUzsdUEUmvGyLIOIGcdb+F6pTdx4ftY+wZi7Aomp4k3vNqXmX\nT0mE0vpQlCmsPUcMHXuUi93XTGPxLXIv9NXxCJZXSYI0JeyuhT9/ithrYlbMlyNc\nwKB/BwSpp+Py2MTT2wIDAQAB\n-----END PUBLIC KEY-----\n";K.dev()&&H.setName(ee.name);var ne={},te=0;r.exports.isX64=t,r.exports.getPlatform=o,r.exports.getVersion=i,r.exports.getAppInfo=a,r.exports.getAppDataPath=u,r.exports.getResourcePath=s,r.exports.getDocumentPath=c,r.exports.versionCompare=f,r.exports.postMessage=l,r.exports.getDefer=d,r.exports.callDefer=p,r.exports.handleQuotes=v,r.exports.uuid=m,r.exports.encrypt=h,r.exports.decrypt=g,r.exports.rsa_encrypt=b,r.exports.rsa_decrypt=j,r.exports.resolvePromise=w,r.exports.rejectPromise=P,r.exports.execFile=x,r.exports.execCommand=y,r.exports.spawnCommand=S,r.exports.readFile=A,r.exports.writeFile=D,r.exports.moveFile=I,r.exports.removeFile=O,r.exports.readJson=T,r.exports.writeJson=F,r.exports.searchFiles=_,r.exports.unzip=N,r.exports.zip=R,r.exports.showOpenDialog=U,r.exports.showSaveDialog=C,r.exports.request=E},{"../package":void 0,"7zip-bin":void 0,child_process:void 0,crypto:void 0,electron:void 0,"electron-is":void 0,"electron-log":void 0,"fs-extra":void 0,glob:void 0,"iconv-lite":void 0,"node-fetch":void 0,os:void 0,path:void 0,q:void 0,"sudo-prompt":void 0}]},{},[1]);