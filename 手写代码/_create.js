/**
创建一个新对象，使用 obj,作为新对象的 __proto__
var newObj = Object.create(obj [,propertiesObject])
obj: 新创建对象的原型对象
propertiesObject: 一个对象，作为返回新对象的自身属性，而不是原型链上的属性
 */

function _create(proto, propertiesObject) {
  function F() {}
  F.prototype = proto;
  return new F();
}
