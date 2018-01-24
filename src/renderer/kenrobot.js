const path = require('path')
const {ipcRenderer, webFrame} = require('electron')
const Q = require('q')

const isDev = process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)
module.paths.push(isDev ? path.resolve('app', 'node_modules') : path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'))

let registeredEvents = []
let defers = {}
let deferAutoId = 0

webFrame.setZoomFactor(1)
webFrame.setVisualZoomLevelLimits(1, 1)
webFrame.setLayoutZoomLevelLimits(0, 0)

function onMessage(e, deferId, type, ...args) {
  let deferred = defers[deferId]
  if(!deferred) {
    return
  }

  let callback
  if(type === "notify") {
    callback = deferred.notify
  } else {
    delete defers[deferId]
    callback = type ? deferred.resolve : deferred.reject
  }
  callback.apply(this, args)
}

function postMessage(name, ...args) {
  if(registeredEvents.indexOf(name) < 0) {
    ipcRenderer.on(name, onMessage)
    registeredEvents.push(name)
  }

  let deferred = Q.defer()
  deferAutoId++
  defers[deferAutoId] = deferred

  ipcRenderer.send.apply(this, [name, deferAutoId].concat(args))

  return deferred.promise
}

function listenMessage(name, callback) {
  ipcRenderer.on(name, (e, args) => {
    callback.apply(this, args)
  })

  return this
}

let hanlderMap = {}
let delayTimers = {}

function getEventName(target, type) {
  return `${target}_${type}`
}

function on(target, type, callback, options) {
  options = options || {}
  options.priority = options.priority || 0
  options.canReset = options.canReset !== false

  let name = getEventName(target, type)
  let hanlders = hanlderMap[name]
  if(!hanlders) {
    hanlders = []
    hanlderMap[name] = hanlders
  }
  hanlders.push({
    callback,
    options,
  })

  return this
}

function off(target, type, callback) {
  let name = getEventName(target, type)
  let hanlders = hanlderMap[name]
  if(!hanlders) {
    return this
  }

  for(let i = 0; i < hanlders.length; i++) {
    let handler = hanlders[i]
    if(handler.callback === callback) {
      hanlders.splice(i, 1)
      break
    }
  }

  return this
}

function trigger(target, type, ...args) {
  let name = getEventName(target, type)
  let hanlders = hanlderMap[name]
  if(!hanlders) {
    return this
  }

  hanlders = hanlders.concat().sort((a, b) => b.options.priority - a.options.priority)

  for(let i = 0; i < hanlders.length; i++) {
    let handler = hanlders[i]
    handler.callback.apply(this, args)
  }

  return this
}

function delayTrigger(time, target, type, ...args) {
  let self = this
  let name = getEventName(target, type)
  let timerId = delayTimers[name]
  timerId && clearTimeout(timerId)
  timerId = setTimeout(() => {
    delete delayTimers[name]
    trigger.apply(self, [target, type].concat(args))
  }, time)
  delayTimers[name] = timerId

  return this
}

let view = {}

function reset() {
  Object.keys(hanlderMap).forEach(key => {
    let hanlders = hanlderMap[key]
    for(let i = hanlders.length - 1; i >= 0; i--) {
      let hanlder = hanlders[i]
      if(hanlder.options.canReset) {
        hanlders.splice(i, 1)
      }
    }
    if(hanlders.length === 0) {
      delete hanlderMap[key]
    }
  })

  Object.keys(delayTimers).forEach(key => {
    let timerId = delayTimers[key]
    timerId && clearTimeout(timerId)
    delete delayTimers[key]
  })
  delayTimers = {}

  Object.keys(view).forEach(key => {
    delete view[key]
  })

  return this
}

let kenrobot = window.kenrobot || (window.kenrobot = {})
kenrobot.postMessage = postMessage
kenrobot.listenMessage = listenMessage

kenrobot.on = on
kenrobot.off = off

kenrobot.trigger = trigger
kenrobot.delayTrigger = delayTrigger

kenrobot.reset = reset
kenrobot.view = view
kenrobot.isPC = true
