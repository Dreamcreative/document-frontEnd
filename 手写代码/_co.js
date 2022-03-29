// Generator 迭代器 自执行函数

const slice = Array.prototype.slice;
function _co(gen) {
  const ctx = this;
  let args = slice.call(arguments, 1);
  return new Promise((resolve, reject) => {
    if (typeof gen === 'function') {
      gen = gen.apply(ctx, args)
    }
    if (!gen || typeof gen.next !== "function") {
      return resolve(gen);
    }
    onFulfilled();
    function onFulfilled(res) {
      let ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e)
      }
      next(ret);
      return null;
    }

    function onRejected(err) {
      let ret;
      try {
        ret = gen.throw(err)
      } catch (e) {
        return reject(e)
      }
      return ret;
    }

    function next(val) {
      if (val.done) return resolve(val.value);
      let value = toPromise.call(ctx, val.value);
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(val.value) + '"'));
    }
  })

  function toPromise(obj) {
    if (!obj) return obj;
    if (isPromise(obj)) return obj;
    if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
    if ("function" === typeof obj) return thunkToPromise.call(this, obj);
    if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
    if (isObject(obj)) return objectToPromise.call(this, obj);
    return obj;
  }

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

  function arrayToPromise(obj) {
    return Promise.all(obj.map(toPromise, this))
  }

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

  function isPromise(obj) {
    return "function" === typeof obj.then;
  }

  function isGenerator(obj) {
    return "function" === typeof obj.next || "function" === typeof obj.throw;
  }

  function isGeneratorFunction(obj) {
    let constructor = obj.constructor;
    if (!constructor) return false;
    if ("GeneratorFunction" === constructor.name || "GeneratorFunction" === constructor.displayName) return true;
    return isGenerator(constructor.prototype);
  }

  function isObject(obj) {
    return Object === obj.constructor;
  }
}
