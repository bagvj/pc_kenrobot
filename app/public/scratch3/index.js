webpackJsonp([1],{269:function(e,t){!function(){function e(){window.kenrobot=window.kenrobot||top.kenrobot,kenrobot&&(kenrobot.viewType="scratch3",c(),kenrobot.on("app","command",t).on("project","open-by",o))}function t(e){switch(e){case"new-project":i={},kenrobot.view.newProject();break;case"open-project":n();break;case"save-project":r();break;case"save-as-project":r(!0)}}function o(e,t){"scratch3"==t&&n(e)}function n(e){kenrobot.postMessage("app:projectNewOpen","scratch3",e).then(function(e){i=e.extra,kenrobot.view.loadProject(e.data),kenrobot.trigger("util","message","打开成功")},function(e){kenrobot.trigger("util","message",{text:"打开失败",type:"error"})})}function r(e){var t=function(t){i.path?a(kenrobot.view.getProject(),e):e||!i.name?kenrobot.trigger("prompt","show",{title:"项目保存",placeholder:"项目名字",callback:function(t){if(!t)return void kenrobot.trigger("util","message",{text:"保存失败",type:"error"});i.name=t,a(kenrobot.view.getProject(),e)}}):a(kenrobot.view.getProject(),e)};kenrobot.getUserInfo()||e||i.hasShowSave?t():(i.hasShowSave=!0,kenrobot.trigger("save","show",t))}function a(e,t){var o;o=t?kenrobot.postMessage("app:projectNewSaveAs",i.name,"scratch3",e):kenrobot.postMessage("app:projectNewSave",i.name,"scratch3",e,i.path),o.then(function(e){i=Object.assign(i,e),kenrobot.trigger("util","message","保存成功")},function(e){kenrobot.trigger("util","message",{text:"保存失败",type:"error"})})}function c(){var e=[{key:["ctrl+n","command+n"],callback:function(e){return t("new-project")}},{key:["ctrl+o","command+o"],callback:function(e){return t("open-project")}},{key:["ctrl+s","command+s"],callback:function(e){return t("save-project")}},{key:["ctrl+shift+s","command+shift+s"],callback:function(e){return t("save-as-project")}}];kenrobot.trigger("shortcut","register",e)}var s=function(){function e(e){if(!o&&("onreadystatechange"!==e.type||"complete"===document.readyState)){for(var n=0;n<t.length;n++)t[n].call(document);o=!0,t=null}}var t=[],o=!1;return document.addEventListener?(document.addEventListener("DOMContentLoaded",e,!1),document.addEventListener("readystatechange",e,!1),window.addEventListener("load",e,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",e),window.attachEvent("onload",e)),function(e){o?e.call(document):t.push(e)}}(),i={};s(e)}()}},[269]);