// Generator 迭代器 自执行函数

/**
 * 使用 co 模块
 */

const co = require("co");
const fetch = require("node-fetch");
// 支持使用 Promise
co(function* () {
  const r1 = yield fetch('https://www.baidu.com');
  const r2 = yield fetch('https://www.baidu.com');
  const r3 = yield fetch('https://www.baidu.com');
  return {
    r1,
    r2,
    r3
  }
}).then((res) => {
  console.log(res) // {r1, r2, r3}
})

// co 模块 支持使用 Thunk 函数 ，但是可能会在后期版本取消对 Thunk 函数的支持，建议使用 Promise 形式

// Thunk 函数就是支持接收回调函数的函数形式
function Thunk(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback)
    }
  }
}
const request = require("request");
const requestThunk = Thunk(request);
const baiduRequest = requestThunk('https://www.baidu.com');
co(function* () {
  const r1 = yield baiduRequest;
  const r2 = yield baiduRequest;
  const r3 = yield baiduRequest;

  return {
    r1,
    r2,
    r3,
  }
}).then((res) => {
  // then里面就可以直接拿到前面返回的{r1, r2, r3}
  console.log(res);
});

/**
 * co 模块的实现
 */
const slice = Array.prototype.slice;
function _co(gen) {
  const ctx = this;
  let args = slice.call(arguments, 1);
  // co 模块返回一个 Promise
  return new Promise((resolve, reject) => {
    // 如果 传入一个函数 gen 绑定 上下文进行执行
    if (typeof gen === 'function') {
      gen = gen.apply(ctx, args)
    }
    // 传入的不是函数，或者 gen 不是 generator 对象，直接 resolve 返回
    if (!gen || typeof gen.next !== "function") {
      return resolve(gen);
    }
    onFulfilled();
    // 成功函数
    function onFulfilled(res) {
      let ret;
      try {
        // 调用 generator next 方法
        ret = gen.next(res);
      } catch (e) {
        return reject(e)
      }
      next(ret);
      return null;
    }
    // 失败函数
    function onRejected(err) {
      let ret;
      try {
        // 调用 generator 返回错误方法
        ret = gen.throw(err)
      } catch (e) {
        return reject(e)
      }
      return ret;
    }
    // 下一步方法
    function next(val) {
      // 如果 generator 的 done 为 true，表示 generator 执行完毕，resovle 返回结果
      if (val.done) return resolve(val.value);
      // 将 结果 转为 Promise
      let value = toPromise.call(ctx, val.value);
      // 如果 结果是 Promise 返回 then
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      // 不是 Promise 报错
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(val.value) + '"'));
    }
  })
  // 将值 转换为 Promise 可以将 generator、 thunk 函数、数组、对象等结构转换为 Promise
  function toPromise(obj) {
    if (!obj) return obj;
    if (isPromise(obj)) return obj;
    if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
    if ("function" === typeof obj) return thunkToPromise.call(this, obj);
    if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
    if (isObject(obj)) return objectToPromise.call(this, obj);
    return obj;
  }
  // 将 Thunk 函数转换为 Promise , Thunk 函数 就是只接收回调函数的函数
  function thunkToPromise(fn) {
    let ctx = this;
    return new Promise((resolve, reject) => {
      fn.call(ctx, function (err, res) {
        if (err) return reject(err);
        if (arguments.length > 2) { res = slice.call(arguments, 1) }
        resolve(res)
      })
    })
  }
  // 将数组 转换为 Promise
  function arrayToPromise(obj) {
    // 使用 Promise.all 方法，使用遍历 分别将数组中的每个值转换为 Promise
    return Promise.all(obj.map(toPromise, this))
  }
  // 将对象 转换为 Promise
  function objectToPromise(obj) {
    let result = new obj.constructor();
    let keys = Object.keys(obj);
    let promises = [];
    for (let i = 0; i < keys.length; i++) {
      var key = keys[i];
      let promise = toPromise.call(this, obj[key]);
      if (promise && isPromise(promise)) {
        defer(promise, key)
      } else {
        result[key] = obj[key]
      }
    }
    return Promise.all(promises).then(function () {
      return results;
    })
    function defer(promise, key) {
      result[key] = undefined;
      promises.push(promise.then(function (res) {
        result[key] = res;
      }))
    }
  }
  // 判断是否为 Promise ,只要对象具有 then 属性，并且 then 为 function 就认为是 Promise 对象
  function isPromise(obj) {
    return "function" === typeof obj.then;
  }
  // 判断是否为 generator 函数 ，generator 具有 next 方法、throw 方法
  function isGenerator(obj) {
    return "function" === typeof obj.next || "function" === typeof obj.throw;
  }
  // 判断是否为 generator 的构造函数 
  function isGeneratorFunction(obj) {
    let constructor = obj.constructor;
    if (!constructor) return false;
    if ("GeneratorFunction" === constructor.name || "GeneratorFunction" === constructor.displayName) return true;
    return isGenerator(constructor.prototype);
  }
  // 判断是否是对象
  function isObject(obj) {
    return Object === obj.constructor;
  }
}
