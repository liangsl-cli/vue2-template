const ErrorTypeEnum = {
  VUE: 'vue',
  SCRIPT: 'script',
  PROMISE: 'promise',
  RESOURCE: 'resource'
}

// 处理错误堆栈信息
function processStackMsg(error) {
  if (!error.stack) {
    return '';
  }
  let stack = error.stack
    .replace(/\n/gi, '') // Remove line breaks to save the size of the transmitted content
    .replace(/\bat\b/gi, '@') // At in chrome, @ in ff
    .split('@') // Split information with @
    .slice(0, 9) // The maximum stack length (Error.stackTraceLimit = 10), so only take the first 10
    .map((v) => v.replace(/^\s*|\s*$/g, '')) // Remove extra spaces
    .join('~') // Manually add separators for later display
    .replace(/\?[^:]+/gi, ''); // Remove redundant parameters of js file links (?x=1 and the like)
  const msg = error.toString();
  if (stack.indexOf(msg) < 0) {
    stack = msg + '@' + stack;
  }
  return stack;
}

// 获取组件名称
function formatComponentName(vm) {
  if (vm.$root === vm) {
    return {
      name: 'root',
      path: 'root',
    }
  }
  const options = vm.$options;
  if (!options) {
    return {
      name: 'anonymous',
      path: 'anonymous',
    }
  }
  const name = options.name || options._componentTag
  return {
    name: name,
    path: options.__file,
  }
}

// vue框架异常处理
function vueErrorHandler(err, vm, info) {  
  const { name, path } = formatComponentName(vm)
  const errorInfo = {
    type: ErrorTypeEnum.VUE,
    name,
    file: path,
    message: err.message,
    stack: processStackMsg(err),
    detail: info,
    url: window.location.href,
  }
  console.log('vue框架错误', errorInfo)
}

// 脚本错误处理
function scriptErrorHandler(
  event,
  source,
  lineno,
  colno,
  error
) {
  if (event === 'Script error.' && !source) {
    return false;
  }

  const name = source ? source.substr(source.lastIndexOf('/') + 1) : 'script'

  colno = colno || (window.event && window.event.errorCharacter) || 0;

  const errorInfo = {
    type: ErrorTypeEnum.SCRIPT,
    name: name,
    file: source,
    detail: `lineno:${lineno}, colno:${colno}`,
    url: window.location.href,
    message: event,
    stack: error?.stack ?? ''
  }
  console.log('脚本错误', errorInfo);
  return true;
}

// promise错误处理
function registerPromiseErrorHandler() {
  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const errorInfo = {
        type: ErrorTypeEnum.PROMISE,
        name: 'Promise Error!',
        file: 'none',
        detail: 'promise error!',
        url: window.location.href,
        stack: 'promise error!',
        message: event.reason,
      }
      console.log('promise错误', errorInfo)
      
    },
    true
  );
}

// 资源加载错误处理（img,script,css）
function registerResourceErrorHandler() {
  window.addEventListener(
    'error',
    (e) => {
      const target = e.target ? e.target : e.srcElement;

      const errorInfo = {
        type: ErrorTypeEnum.RESOURCE,
        name: 'Resouce Error!',
        file: (e.target || {}).currentSrc,
        detail: JSON.stringify({
          tagName: target.localName,
          html: target.outerHTML,
          type: e.type,
        }),
        url: window.location.href,
        stack: 'resouce is not found',
        message: (e.target || {}).localName + ' is load error',
      }

      console.log('资源加载错误处理', errorInfo)
    },
    true
  );
}

const setupErrorHandle = function (Vue) {
  Vue.config.errorHandler = vueErrorHandler
  window.onerror = scriptErrorHandler
  registerPromiseErrorHandler()
  registerResourceErrorHandler()
}

export default {
  install: setupErrorHandle
}