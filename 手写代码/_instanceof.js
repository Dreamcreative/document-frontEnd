function _intanceof(left,right){
  let rightPro = right.prototype;
  let leftPro = left.__proto__;
  while(true){
    if(leftPro==null){
      return false;
    }
    if(leftPro===rightPro){
      return true;
    }
    leftPro = leftPro.__proto__;
  }
}
