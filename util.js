/* util
 */

function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function extendLevel (obj, defaults = {}) {
  // copy default keys where undefined
  Object.keys(defaults).forEach(function (key) {
    if (typeof obj[key] === 'undefined') {
      // default
      obj[key] = clone(defaults[key])
    } else if (typeof obj[key] === 'object') {
      extendLevel(obj[key], defaults[key])
    }
  })

  return obj
}

// multi-level object merge
function extend (obj, defaults) {
  if (obj === null) {
    obj = {}
  }

  return extendLevel(clone(obj), defaults)
}

function debounce (func, wait, immediate) {
  var timeout
  return function () {
    var context = this
    var args = arguments
    var callNow = immediate && !timeout

    var later = function () {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) {
      func.apply(context, args)
    }
  }
}

function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
    return v.toString(16)
  })
}

module.exports = {
  clone: clone,
  extend: extend,
  guid: guid
}
