var interpolationRegex = /\{\{(\$?[^\}]+)\}\}/g,
  watchRegex = /^\$?\w+(\.?\w+)*$/,
  eventDirectiveRegex = /^x-on-(\w+)$/, // x-on- with native dom event name to bind event handler 
  directives = ['x-bind', 'x-model', 'x-repeat', 'x-show', 'x-hide', 'x-class', 'x-disabled'];

var REPEATER = 'x-repeat';
function isObject(obj) {
  return !!obj && typeof obj === 'object'
}

function isFunction(func) {
  return (typeof func === 'function');
}

function isArray(obj) {
  return !!obj && typeof obj === 'object' && typeof obj.length === 'number';
}

function isPrimitive(o) {
  return ['string', 'number', 'boolean'].indexOf(typeof o) > -1;
}

function isString(str) {
  return typeof str === 'string';
}

function isLikeJson(str) {
  return isString(str) && str[0] === '{' && str.slice(-1) === '}';
}

function addClass(el, className) {
  if (el.className.indexOf(className) === -1) {
    el.className = trim(el.className) + ' ' + className;
  }
}

function removeClass(el, className) {
  if (el.className.indexOf(className) > -1) {
    el.className = el.className.replace(new RegExp(className, 'g'), '');
  }
}

function arrayRemove(arr, value) {
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    if (arr[i] === value) {
      arr.splice(i, 1);
      len--;
    }
  }
}

function formatString() {
  if (arguments.length < 2) return arguments[0];
  var str = arguments[0],
    args = Array.prototype.slice.call(arguments, 1);

  return str.replace(/\{(\d+)\}/g, function (match, n) {
    return args[n];
  });
}

function trim(str) {
  if (typeof str === 'string') {
    if (str.trim) {
      return str.trim();
    }
    return str.replace(/^\s+|\s+$/g, '');
  }

  return str;
}

function each(arr, fn, skipArr) {
  var len = arr.length, i = -1, item;
  while (++i < len) {
    item = arr[i];
    if (isArray(skipArr)) {
      if (skipArr.indexOf(item) !== -1) continue;
    }

    fn.call(arr, item, i, arr);
  }
}

function isWatch(attr) {
  return watchRegex.test(attr);
}

function isJsonAlike(str) {
  if (isString(str)) {
    return str.charAt(0) === '{' && str.slice(-1) === '}';
  }

  return false;
}

function _def_const_prop_(obj, property, value) {
  Object.defineProperty(obj, property,
    {
      value: value,
      enumerable: false,
      configurable: false,
      writable: false
    });
}

// poly fill 
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

function notify(watchMap, watch, arrayChangeInfo) {
  var renders = watchMap[watch],
    len;
  if (renders) {
    each(renders, function (render) {
      render.call(null, arrayChangeInfo);
    });
  }
}

function addEventListenerHanlder(el, event, func, store) {
  if (el.addEventListener && isFunction(func)) {
    el.addEventListener(event, func, false);
    store.push({
      el: el,
      event: event,
      handler: func
    });
  }
}

function removeEventListenerHanlder(el, event, func) {
  if (el.removeEventListener && isFunction(func)) {
    el.removeEventListener(event, func, false);
  }
}


