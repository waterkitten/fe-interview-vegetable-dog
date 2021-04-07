// 防抖
function denounce (fn) {
  let timer = null
  return function () {
      if (timer) {
          clearTimeout(timer)
      }
      timer = setTimeout(() => {
          fn.apply(this, arguments)
      }, 500)
  }
}
// 节流
function throttle (fn) {
  let canRun = true
  return function () {
      if (!canRun) {
          return
      }
      canRun = false
      setTimeout(() => {
          fn.apply(this, arguments)
          canRun = true
      }, 500)
  }
}
// call bind apply手写
Function.prototype.mycall = function (context) {
  if (typeof this !== 'function') {
      throw new TypeError('error')
  }
  context = context || window
  context.fn = this //绑定this到context的fn
  const args = [...arguments].slice(1) //把this删除，取参数
  const result = context.fn(...args) //执行函数
  delete context.fn //删除fn
  return result
}
fn.call(this, 1, 2, 3)
// apply
Function.prototype.myApply = function (context) {
  if (typeof this !== 'function') {
      throw new TypeError('error')
  }
  context = context || window
  context.fn = this //绑定this到context的fn
  let result
  // 有数组
  if (arguments[1]) {
      result = context.fn(...arguments[1])
  } else {
      result = context.fn()
  }
  delete context.fn
  return result
}
// bind
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
      throw new TypeError('error')
  }
  const _this = this
  const args = [...arguments].slice(1)
  return function F() {
      if (this instanceof F) {
          return new _this(...args, ...arguments)
      }
      return _this.apply(context, args.concat(...arguments))
  }
}
// 深拷贝
function deepClone (obj) {
  if (typeof obj != 'object' || obj == null) {
      return obj
  }
  let result
  if (obj instanceof Array) {
      result = []
  } else {
      result = {}
  }
  for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
          result[key] = deepClone(obj[key])
      }
  }
  return result
}
// 数组去重
function unique (arr) {
  return Array.from(new Set(arr))  // 缺点：无法去除{}
}
function unique (arr) {
  return [...new Set(arr)]  // 缺点：无法去除{}
}
function unique (arr) {
  for (let i = 0;i < arr.length; i++) {
      for (let j = i + 1; j<arr.length; j++) {
          if (arr[i] == arr[j]) {
              arr.splice(j, 1)  //删除第二个
              j--
          }
      }
  }
  return arr
}
function unique (arr) {
  if (!Array.isArray(arr)) {
      return
  }
  let array = []
  for (let i = 0;i < arr.length; i++) {
      if (!arr.includes(arr[i])) {
          array.push(arr[i])
      }
  }
  return array
}
function unique (arr) {
  if (!Array.isArray(arr)) {
      return
  }
  let array = []
  for (let i = 0;i < arr.length; i++) {
      if (!arr.indexOf(arr[i]) === -1) {
          array.push(arr[i])
      }
  }
  return array
}

// reduce
Array.prototype.myReduce = function (fn, initvalue) {
if (Object.prototype.toString.call(fn) !== '[object Function]') {
  throw new Error("error")
}
let arr = this  // this就是arr
let initIndex = initvalue !== 'undefined' ? 1 : 0
let acc = initvalue !== 'undefined' ? initvalue : arr[0] // 当前的值
for (let i = initIndex;i < arr.length; i++) {
  acc = fn(acc, arr[i], i, arr)
}
return acc
}
console.log([1,2,3,4,5].myReduce((a, b) => a + b, 10))

//map:把执行结果在一个数组内，并返回
Array.prototype._map = function (fn,context) {
//因为返回一个新数组 所以要定义一个新的
var arr = []
if(typeof fn!=='function'){
    //如果第一个参数不是函数则报错
    console.error('参数错误')
}else{
    var k = 0;
    var len = this.length //注意这里的this指向数组
    for(;k < len; k++){
        arr.push(fn.call(context, this[k], k, this))
        // 每一项，索引值，这个数组
    }
}
return arr;
}
var newArr = [1,2,3,4]._map(function (item) {
return item + 1;
})

// new的职责
function A() {
  this.a = 1;
}
A.prototype.b = 1;
var a = new A(); // {a: 1}
a.b; // 1
// 模拟new
function A(){ this.name = "test" } 
var a = _new(A)  // a.proto = A.prototype
a.name //test
function _new (F, ...args) {
  var obj = Object.create(F.prototype); // 相当于 ({}).__proto__ = F.prototype
  var result = F.call(obj, ...args)  //obj绑定到_new函数上
  return typeof result === "object" ? result : obj
}
function myNew (obj, ...args) {
  let newObj = {}
  newObj.__proto__ = obj.prototype //空对象的原型指向了构造函数的prototype
  // 上面的两步可以合为一步
  let newObj = Object.create(obj.prototype)
  let result = obj.apply(newObj, args)  // 将obj的this改为新创建对象
  // 判断类里面有返回值吗？返回值是对象吗?如果是的那就返回类中的返回值，如果不是的话那就返回新创建的对象
  return typeof result === 'object' ? result : newObj 
}
function mockNew() {
  // 创建一个空对象
  let resultObj = new Object();
  // 取传入的第一个参数，即构造函数，并删除第一个参数。
  let constructor =  Array.prototype.shift.call(arguments);
  // 类型判断，错误处理
  if (typeof constructor !== "function") {
      throw("构造函数第一个参数应为函数");
  }
  // 绑定 constructor 属性
  resultObj.constructor = constructor;
  // 关联 __proto__ 到 constructor.prototype
  resultObj.__proto__ = constructor.prototype;
  // 将构造函数的 this 指向返回的对象
  constructor.apply(resultObj, arguments);
  // 返回对象
  return resultObj;
}
function Person(name) {
  this.name = name;
}
var person = mockNew(Person, "jayChou");
console.log(person);
// constructor: ƒ Person(name)
// name: "jayChou"
// __proto__: Object

// 手写promise
let a = new Promise((resolve, reject) => {
  resolve()
  reject()
})
a.then((res) => console.log(res))
// fn就是(resolve, reject) => {}的函数部分
function Promise (fn) {
  // 定义值/错误/状态
  this.value = undefined
  this.err = undefined
  this.status = 'pending'
  let t = this
  function resolve (val) {
      if (t.status == 'pending') {
          t.value = val
          t.status = 'success'
      }
  }
  function reject (err) {
      if (t.status == 'pending') {
          t.err = err
          t.status = 'fail'
      }
  }
  fn(resolve, reject)
}
// 方法要用prototype
Promise.prototype.then = function(isSuccess, isFail) {
  // var t = this
  return new Promise((resolve,reject) => {
      // 用setTimeout模拟实现then方法的异步操作
      setTimeout(() => {
          if (this.status == 'success') {
              resolve(isSuccess(this.value))
          }
          if (this.status == 'fail') {
              reject(isFail(this.err))
          }
      })
  })
}
var p = new promise(function(resolve, reject) {
  if (1) {
      resolve("test resolve success")
  } else {
      reject("test rejecr fail")
  }
})
p.then(function(val) {
  console.log(val)
  return val + "链式调用return"
}).then(function(val) {
  console.log(val)
})

// promise高级版A+规范
// 三种状态
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";
// promise 接收一个函数参数，该函数会立即执行
function MyPromise(fn) {
let _this = this;
_this.currentState = PENDING;
_this.value = undefined;
// 用于保存 then 中的回调，只有当 promise
// 状态为 pending 时才会缓存，并且每个实例至多缓存一个
_this.resolvedCallbacks = [];
_this.rejectedCallbacks = [];

_this.resolve = function (value) {
  if (value instanceof MyPromise) {
    // 如果 value 是个 Promise，递归执行
    return value.then(_this.resolve, _this.reject)
  }
  setTimeout(() => { // 异步执行，保证执行顺序
    if (_this.currentState === PENDING) {
      _this.currentState = RESOLVED;
      _this.value = value;
      _this.resolvedCallbacks.forEach(cb => cb());
    }
  })
};

_this.reject = function (reason) {
  setTimeout(() => { // 异步执行，保证执行顺序
    if (_this.currentState === PENDING) {
      _this.currentState = REJECTED;
      _this.value = reason;
      _this.rejectedCallbacks.forEach(cb => cb());
    }
  })
}
// 用于解决以下问题
// new Promise(() => throw Error('error))
try {
  fn(_this.resolve, _this.reject);
} catch (e) {
  _this.reject(e);
}
}

MyPromise.prototype.then = function (onResolved, onRejected) {
var self = this;
// 规范 2.2.7，then 必须返回一个新的 promise
var promise2;
// 规范 2.2.onResolved 和 onRejected 都为可选参数
// 如果类型不是函数需要忽略，同时也实现了透传
// Promise.resolve(4).then().then((value) => console.log(value))
onResolved = typeof onResolved === 'function' ? onResolved : v => v;
onRejected = typeof onRejected === 'function' ? onRejected : r => r;

if (self.currentState === RESOLVED) {
  return (promise2 = new MyPromise(function (resolve, reject) {
    // 规范 2.2.4，保证 onFulfilled，onRjected 异步执行
    // 所以用了 setTimeout 包裹下
    setTimeout(function () {
      try {
        var x = onResolved(self.value);
        resolutionProcedure(promise2, x, resolve, reject);
      } catch (reason) {
        reject(reason);
      }
    });
  }));
}

if (self.currentState === REJECTED) {
  return (promise2 = new MyPromise(function (resolve, reject) {
    setTimeout(function () {
      // 异步执行onRejected
      try {
        var x = onRejected(self.value);
        resolutionProcedure(promise2, x, resolve, reject);
      } catch (reason) {
        reject(reason);
      }
    });
  }));
}

if (self.currentState === PENDING) {
  return (promise2 = new MyPromise(function (resolve, reject) {
    self.resolvedCallbacks.push(function () {
      // 考虑到可能会有报错，所以使用 try/catch 包裹
      try {
        var x = onResolved(self.value);
        resolutionProcedure(promise2, x, resolve, reject);
      } catch (r) {
        reject(r);
      }
    });

    self.rejectedCallbacks.push(function () {
      try {
        var x = onRejected(self.value);
        resolutionProcedure(promise2, x, resolve, reject);
      } catch (r) {
        reject(r);
      }
    });
  }));
}
};
// 规范 2.3
function resolutionProcedure(promise2, x, resolve, reject) {
// 规范 2.3.1，x 不能和 promise2 相同，避免循环引用
if (promise2 === x) {
  return reject(new TypeError("Error"));
}
// 规范 2.3.2
// 如果 x 为 Promise，状态为 pending 需要继续等待否则执行
if (x instanceof MyPromise) {
  if (x.currentState === PENDING) {
    x.then(function (value) {
      // 再次调用该函数是为了确认 x resolve 的
      // 参数是什么类型，如果是基本类型就再次 resolve
      // 把值传给下个 then
      resolutionProcedure(promise2, value, resolve, reject);
    }, reject);
  } else {
    x.then(resolve, reject);
  }
  return;
}
// 规范 2.3.3.3.3
// reject 或者 resolve 其中一个执行过得话，忽略其他的
let called = false;
// 规范 2.3.3，判断 x 是否为对象或者函数
if (x !== null && (typeof x === "object" || typeof x === "function")) {
  // 规范 2.3.3.2，如果不能取出 then，就 reject
  try {
    // 规范 2.3.3.1
    let then = x.then;
    // 如果 then 是函数，调用 x.then
    if (typeof then === "function") {
      // 规范 2.3.3.3
      then.call(
        x,
        y => {
          if (called) return;
          called = true;
          // 规范 2.3.3.3.1
          resolutionProcedure(promise2, y, resolve, reject);
        },
        e => {
          if (called) return;
          called = true;
          reject(e);
        }
      );
    } else {
      // 规范 2.3.3.4
      resolve(x);
    }
  } catch (e) {
    if (called) return;
    called = true;
    reject(e);
  }
} else {
  // 规范 2.3.4，x 为基本类型
  resolve(x);
}
}


// test resolve success
// test resolve success链式调用return


//sleep函数
function sleep() {
return new Promise(resolve => {
  setTimeout(() => {
    console.log('finish')
    resolve("sleep");
  }, 2000);
});
}
async function test() {
let value = await sleep();
console.log("object");
}
test()


// 随机排序
// [1,2,3,4,5],从后往前,获取随机值当做下标,然后获取值,再跟第i个交换，第i个变为这个值
function shuffle (arr) {
  let res = [...arr]
  for (let i = arr.length - 1;i > 0; i--) {
      let randomIdx = Math.floor(Math.random() * (i + 1)) // 获取下标
      [res[randomIdx], res[i]] = [res[i], res[randomIdx]]
  }
  return res
}
// 继承
// 冒泡排序
function bubbleSort (arr) {
  let len = arr.length
  for (let i = 0;i < len; ++i) {  // 循环次数
      for (let j = 0; j < len - i; ++j) { // 相邻元素比较
          if (arr[j] > arr[j + 1]) {
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          }
      }
  }
  return arr
}
// 选择排序:选择最小的放前面
// 遍历每个数据，每次最小的就放到前面
// [6,5,2,4,10,12,11]  
// 第一次：找到最小的为2，放到最前。
// 第二次：遍历[2,5,6,4,10,12,11]，最小为4，放到最前并交换为[2,4,6,5,10,12,11]
function sort (arr) {
  let len = arr.length
  let min
  for (let i = 0;i < len; i++) {
      min = arr[i]
      for(let j = i + 1;j<len;j++) {
          if (arr[j] < min) {
              min = arr[j]
          }
      }
      [arr[i], min] = [min, arr[i]]
  }
  return arr
}
// 快速排序
function quickSort (arr) {
  let len = arr.length
  if (len < 2) {
      return arr
  }
  let center = arr[0]
  let left = []
  let right = []
  for (let i = 1;i < len;i++) {
      if (arr[i] >= center) {
          right.push(arr[i])
      }
      if (arr[i] < center) {
          left.push(arr[i])
      }
  }
  return [...quickSort(left), center, ...quickSort(right)]
}
// 深搜广搜
// 数组对象扁平化
function flatten(arr, result = []) {
  for (let item of arr) {
      if (Array.isArray(item)) {
          flatten(item, result)
      } else {
          result.push(item)
      }
  }
  return result
}
// 二分查找
// 非递归算法
function binary_search(arr, key) {
  var low = 0,
      high = arr.length - 1;
  while (low <= high){
      var mid = parseInt((high + low) / 2);
      if(key == arr[mid]){
          return  mid;
      }else if(key > arr[mid]){
          low = mid + 1;
      }else if(key < arr[mid]){
          high = mid -1;
      }else{
          return -1;
      }
  }
};
var arr = [1,2,3,4,5,6,7,8,9,10,11,23,44,86];
var result = binary_search(arr,10);
alert(result);       

// 递归算法
function binary_search(arr,low, high, key) {
  if (low > high){
      return -1;
  }
  var mid = parseInt((high + low) / 2);
  if (arr[mid] == key){
      return mid;
  }else if (arr[mid] > key){
      high = mid - 1;
      return binary_search(arr, low, high, key);
  }else if (arr[mid] < key){
      low = mid + 1;
      return binary_search(arr, low, high, key);
  }
};
var arr = [1,2,3,4,5,6,7,8,9,10,11,23,44,86];
var result = binary_search(arr, 0, 13, 10);

// 函数柯里化
function add() {
  // 第一次执行时，定义一个数组专门用来存储所有的参数
  var _args = [].slice.call(arguments);
  // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
  var adder = function () {
      var _adder = function() {
          // [].push.apply(_args, [].slice.call(arguments));
          _args.push(...arguments);
          return _adder;
      };
      // 利用隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
      _adder.toString = function () {
          return _args.reduce(function (a, b) {
              return a + b;
          });
      }
      return _adder;
  }
  // return adder.apply(null, _args);
  return adder(..._args);
}
// jsonp
// 创建script标签，然后添加属性
function ajax(url, callback){
  var jsonp=document.createElement('script');
  jsonp.type = 'text/javascript';
  jsonp.src=url+'?callback=jsonpcallback';
  jsonpcallback = function(response){
      callback(response);
  };
  document.getElementsByTagName('head')[0].appendChild(jsonp);
}
// reduce实现map
// reduce：pre，cur，index，array，init
// map：item，index，arr  return fn,返回执行函数后的结果
// 利用好初始值

Array.prototype.myMap = function(fn) {
return this.reduce((prev, curr, index, array) => {
  return prev.concat(fn.call(this, curr, index, array));  //this,传参：item,index,arr
}, [])
}
Array.prototype.myMap = function(fn) {
const result = [];
this.reduce((prev, curr, index, array) => {
  result[index] = fn.call(this, array[index], index, array);  //this,传参：item,index,arr
}, 0)
return result;
}
let arr = [1,2,4]
let test = arr.myMap(item => {
return item *= 2;
})
console.log(test);//[2, 4, 8]

//ajax
var Ajax = {
  get: function(url,callback){
      // XMLHttpRequest对象用于在后台与服务器交换数据
      var xhr=new XMLHttpRequest();
      xhr.open('GET',url,false); // false为同步执行，等到结果才进行下一步。true为异步执行
      xhr.onreadystatechange=function(){   //状态改变
          // readyState == 4说明请求已完成
          if(xhr.readyState==4){
              if(xhr.status==200 || xhr.status==304){  // 200或304
                  console.log(xhr.responseText);
                  callback(xhr.responseText);
              }
          }
      }
      xhr.send();
  },
  // data应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
  post: function(url,data,callback){
      var xhr=new XMLHttpRequest();
      xhr.open('POST',url,false);
      // 添加http头，发送信息至服务器时内容编码类型
      xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xhr.onreadystatechange=function(){
          if (xhr.readyState==4){
              if (xhr.status==200 || xhr.status==304){
                  // console.log(xhr.responseText);
                  callback(xhr.responseText);
              }
          }
      }
      xhr.send(data);
  }
}

//判断两个对象是否相等
function diff(obj1,obj2){
var o1 = obj1 instanceof Object;
var o2 = obj2 instanceof Object;
if(!o1 || !o2){/*  判断不是对象  */
    return obj1 === obj2;
}

if(Object.keys(obj1).length !== Object.keys(obj2).length){
    return false;
    //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
}

for(var attr in obj1){
    var t1 = obj1[attr] instanceof Object;
    var t2 = obj2[attr] instanceof Object;
    if(t1 && t2){
        return diff(obj1[attr],obj2[attr]);
    }else if(obj1[attr] !== obj2[attr]){
        return false;
    }
}
return true;
}


//Object.create原生实现
function _create(paramProto){
var isObject = (typeof paramProto === 'object') || (typeof paramProto === 'function');
var isUndefined = typeof paramProto === 'undefined';
if (isUndefined || !isObject){
    throw new TypeError('Object prototype may only be an Object or null: ' + paramProto)
}

function F() { }
F.prototype = paramProto;
return new F();
}

//封装柯里化
function curry(fn){
//获取参数个数
let len = fn.length
return function temp(){
    //收集本地传递参数
    let args = [...arguments]
    if(args.length >= len){
        return fn(...args)
    }else{
        return function(){
            temp(...args,...arguments)
        }
    }
}
}

//获取两个数之间的随机值
function getRandomNumberByRange(start, end) { 
return Math.floor(Math.random() * (end - start) + start)
s}

//promise A+
/*
Promise：构造 Promise 函数对象
excutor: 执行构造器 （同步执行）
*/
function Promise(excutor) {
const _that = this
_that.status = 'pending' // 给 promise对象指定 status属性,初始值为 pending
_that.data = undefined   //给 promise 对象指定一个用于储存结果数据的属性
_that.callbacks = [] // 每个元素的结构：{ onFulfilled(){}, onRejected(){}}
function resolve(value) {
    // 如果当前状态不是 pending，直接结束
    if (_that.status !== 'pending') return
    // 将 状态改为 resolved
    _that.status = 'resolved'
    // 保存 value 数据
    _that.data = value
    // 如果有待执行callback 函数，立刻异步执行回调函数
    if (_that.callbacks.length > 0) {
        setTimeout(() => {
            _that.callbacks.forEach(callbacksObj => {
                callbacksObj.onFulfilled(value)
            })
        })
    }
}
function reject(reason) {
    // 如果当前状态不是 pending，直接结束
    if (_that.status !== 'pending') return
    // 将 状态改为 rejected
    _that.status = 'rejected'
    // 保存 value 数据
    _that.data = reason
    // 如果有待执行callback 函数，立刻异步执行回调函数
    if (_that.callbacks.length > 0) {
        setTimeout(() => {
            _that.callbacks.forEach(callbacksObj => {
                callbacksObj.onRejected(reason)
            })
        })
    }
}
//立刻同步执行 excutor
try {
    excutor(resolve, reject)
} catch (error) { //如果执行器抛出异常，promise对象变为 rejected 状态
    reject(error)
}
}
/*
Promise原型对象的 then() --- *思路*
  1、指定成功和失败的回调函数
  2、返回一个新的 promise 对象
  3、返回promise的结果由 onFulfilled/onRejected执行结果决定
  4、指定 onFulfilled/onRejected的默认值
*/
Promise.prototype.then = function (onFulfilled, onRejected) {
onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : reason => reason //向后传递成功的value
//指定默认的失败的回调（实现错误/异常穿透的关键点）
onRejected = typeof onRejected === 'function' ? onRejected : reason => { //向后传递失败的reason
    throw reason
}
const _that = this
//返回一个新的promise 对象
return new Promise((resolve, reject) => {
    /*
      调用指定的回调函数处理，根据执行结果，改变return的promise的状态
    */
    function handle(callback) {
        /*
          1. 如果抛出异常，return 的promise就会失败，reason 就是 error
          2. 如果回调函数返回的不是promise，return的promise就会成功，value就是返回的值
          3.如果回调函数返回的是promise，return的promise的结果就是这个promise的结果
        */
        try {
            const result = callback(_that.data)
            // 3.如果回调函数返回的是promise，return的promise的结果就是这个promise的结果
            if (result instanceof Promise) {
                // result.then(
                //     value => resolve(value), //当result成功时，让return的promise也成功
                //     reason => reject(reason)  //当result失败时，让return的promise也失败
                // )
                result.then(resolve, reject)
            } else {
                //  2. 如果回调函数返回的不是promise，return的promise就会成功，value就是返回的值
                resolve(result)
            }
        } catch (error) {
            //1. 如果抛出异常，return 的promise就会失败，reason 就是 error
            reject(error)
        }
    }
    if (_that.status === 'pending') {
        //假设当前状态还是 pending 状态，将回调函数 保存起来
        _that.callbacks.push({
            onFulfilled(value) {
                handle(onFulfilled) //改promise的状态为 onFulfilled状态
            },
            onRejected(reason) {
                handle(onRejected)  //改promise的状态为 onRejected状态
            }
        })
    } else if (_that.status === 'resolved') { //如果当前是resolved状态，异步执行onresolved并改变return的promise状态
        setTimeout(() => {
            handle(onFulfilled)
        })
    } else { //onRejected
        setTimeout(() => { //如果当前是rejected状态，异步执行onRejected并改变return的promise状态
            handle(onRejected)
        })
    }
})

}
/*
Promise原型对象的 catch()
指定失败的回调函数
返回一个新的 promise 对象
*/
Promise.prototype.catch = function (onRejected) {
return this.then(undefined, onRejected)
}
Promise.prototype.finally = function (callback) {
return this.then(value => {
    Promise.resolve(callback(value))
}, reason => {
    Promise.resolve(callback(reason))
})
}
/*
Promise函数对象的 resolve()
返回 指定结果的 "成功" 的 promise 对象
*/
Promise.resolve = function (value) {
//返回一个 成功/失败 的promise
return new Promise((resolve, reject) => {
    if (value instanceof Promise) { //使用value的结果作为 promise 的结果
        value.then(resolve, reject)
    } else { //value不是promise => promise变为成功，数据是 value
        resolve(value)
    }
})
}
/*
Promise函数对象的 reject()
返回 指定结果的 "失败" 的 promise 对象
*/
Promise.reject = function (reason) {
//返回 一个失败的 promise
return new Promise((resolve, reject) => {
    reject(reason)
})
}
/*
Promise函数对象的 all()
返回 一个promise，只有当所有promise都成功时才成功，否则只要有一个失败就 失败
*/
Promise.all = function (promises) {
const values = Array.apply(null, {length: promises.length})//用来保存所有成功 value的数组
let resolvedCount = 0
return new Promise((resolve, reject) => {
    //遍历获取每一个 promise的结果
    promises.forEach((p, index) => {
        Promise.resolve(p).then(
            //p成功，将成功的 value 保存 values
            // values.push(value)  => 不能这样
            value => {
                resolvedCount++ //成功的次数
                values[index] = value
                //如果全部成功了，将return的 promise 改为成功
                if (resolvedCount === promises.length) {
                    resolve(values)
                }
            },
            reason => { //只要一个失败了，return 的promise就失败
                reject(reason)
            }
        )
    })
})
}
/*
Promise函数对象的 race()
返回 一个promise，其结果由第一个完成的promise来决定
*/
Promise.race = function (promises) {
return new Promise((resolve, reject) => {
    //遍历获取每一个 promise的结果
    promises.forEach((p, index) => {
        Promise.resolve(p).then(
            value => { // 一旦由成功了，将return 变为失败
                resolve(value)
            },
            reason => { //只要一个失败了，return 的promise就失败
                reject(reason)
            }
        )
    })
})
}

//Promise 封装Ajax方法
//XMLHttpRequest->open->send->onreadystatechange
function ajax(url, methods,data) {
return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open(methods, url, true)
    xhr.send(data)
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            resolve(xhr.responseText)
        }else{
            reject(xhr.status)
        }
    }
})
}

//异步加载图片
function loadImageAsync(url) {
return new Promise(function(resolve, reject) {
  const image = new Image();
  image.onload = function() {
    resolve(image);
  };
  image.onerror = function() {
    reject(new Error('Could not load image at ' + url));
  };
  image.src = url;
});
}

//圣杯
{/* <style>
      *{
          padding: 0;
          margin: 0;
      }
      .container{
          overflow: hidden;
          padding: 0 100px 0 100px;
      }
      .middle,.left,.right{
          position: relative;
          float: left;
      }
      .left{
          width: 100px;
          height: 100px;
          background: red;
          margin-left: -100%;
          left: -100px;
      }
      .right{
          width: 100px;
          height: 100px;
          background: green;
          margin-left: -100px;
          right: -100px;
      }
      .middle{
          background: blue;
          width: 100%;
          height: 300px;
      }
  </style>
</head>
<body>
<div class="container">
  <div class="middle"></div>
  <div class="left"></div>
  <div class="right"></div>
</div> */}

//双飞翼
{/* <style>
      .container {
          overflow: hidden;
      }
      .middle, .left, .right {
          float: left;
          height: 100px;
      }
      .left {
          width: 100px;
          background: red;
          margin-left: -100%;
      }
      .right {
          width: 100px;
          background: blue;
          margin-left: -100px;
      }
      .middle {
          width: 100%;
          background: aqua;
      }
      .inner {
          margin: 0 100px;
      }
  </style>
</head>
<body>
<div class="container">
  <div class="middle">
      <div class="inner">middle</div>
  </div>
  <div class="left">left</div>
  <div class="right">right</div>
</div> */}

//ES6继承
class SuperType {
constructor(age) {
    this.age = age;
}
getAge() {
    console.log(this.age);
}
}
class SubType extends SuperType {
constructor(age, name) {
    super(age); // 调用父类的constructor(x, y)
    this.name = name;
}
getName() {
    console.log(this.name);
}
}
// 子类必须在 constructor 中调用 super 方法，否则新建实例时会报错。如果没有子类没有定义 constructor 方法，
// 那么这个方法会被默认添加。在子类的构造函数中，只有调用 super 之后，才能使用 this关键字，否则报错。这是因为子类实例的构建，
// 基于父类实例，只有super方法才能调用父类实例。
// ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。
// ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this

//new
function _new(fn,...arg) {
let obj = {}  //创建新{}
obj.__proto__= fn.prototype  //proto属性指向prototype
let ret= fn.apply(obj,arg)  //改变this，并执行函数fn
return  ret instanceof Object ? ret:obj
}
let a = new A()
//A() 在这个时候会执行函数

//科里化
//ES5写法
const currying = function (fn,...args) {
if(args.length < fn.length){
    return function () {
        return currying(fn, ...args, ...arguments)
    }
}else{
    return fn(...args)
}
}
//ES6写法
const currying =(fn,...args)=>
args.length < fn.length?(...argments)=> currying(fn,...args,...arguments):fn(...args)

//双向数据绑定
// Object.defineProperty 写法
let vm = {}
let obj = {
  name: 'zc',
  age: '123'
}
for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
      Object.defineProperty(vm, key, {
          get: function () {
              return obj[key]
          },
          set: function (newvalue) {
              obj[key] = newvalue
          }
      })
  }
}

obj.age ='111'
vm.age ='112221'
console.log(vm.age)
console.log(obj.age)
// Proxy 写法
let vm = new Proxy(obj,{
get: function (target, propKey, receiver) {
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
},
set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
}
})

// 发布订阅模式
let pubSub = {
list: {},
subscribe: function (key, fn) {  //订阅
    if (!this.list[key]) {
        this.list[key] = []
    }
    this.list[key].push(fn)
},
publish: function (key, ...args) {  //发布
    for (let fn of this.list[key]) {
        fn.apply(this, args)
    }
},
unSubscribe: function (key, fn) { //取消订阅
    let fnlist = this.list[key]
    if (!fnlist) return
    if (!fn) {
        fnlist.length = 0
    } else {
        fnlist.forEach((item, index) => {
            if (item === index) {
                fnlist.splice(index, 1)
            }
        })
    }
}

}
pubSub.subscribe('onwork', time => {
console.log(`上班了：${time}`);
})
pubSub.subscribe('offwork', time => {
console.log(`下班了：${time}`);
})
pubSub.subscribe('launch', time => {
console.log(`吃饭了：${time}`);
})
// // 发布
pubSub.publish('offwork', '18:00:00');
pubSub.publish('launch', '12:00:00');
pubSub.unSubscribe('onwork');
pubSub.publish('onwork', '1222:00:00');


//获取url参数
let test='?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=21331&rsv_pq=b8627e62001efbb9&rsv_t=eef5sqIQ98s66yOwueYH5BWlFUARj0PkHBdCA4ahbSVYQA5qO9MBoZPC0mU&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_sug3=5&rsv_sug1=1&rsv_sug7=100&rsv_sug2=0&inputT=509&rsv_sug4=509'
function f(str) {
  let str1 = str.slice(1)
  let arr=str1.split('&')
  console.log(arr)
  let map = new Map()
  arr.map(item=>{
    const [key,value] = item.split('=')
      map.set(key,decodeURIComponent(value))
  })
return map
}
for (let item of  f(test)) {
  console.log(item)
}

//二叉树
//1、求二叉树中的节点个数
function getNodenum(root) {
if (root == null) {
    return
}
return getNodenum(root.left) + getNodenum(root.right) + 1
}

//2、求二叉树的最大深度
function maxDepth(root) {
if (root == null) {
    return
}
return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1
}

//3.二叉树的最小深度
function minDepth(root) {
if (root == null) return
let left = minDepth(root.left)
let right = minDepth(root.right)
return (left == 0 || right == 0) ? left + right + 1 : Math.min(left, right) + 1
}

//4.先序遍历（递归）
function preroot(root, callback) {
if (root != null) {
    callback(root.key)
    preroot(root.left, callback)
    preroot(root.right, callback)
}

}

//先序遍历（非递归）
function preroot(root) {
let stack = [],
    result = []
if (root != null) {
    stack.push(root)
}
while (stack.length != 0) {
    let temp = stack.pop()
    result.push(temp.key)

    if (temp.left != null) {
        stack.push(temp.left)
    }
    if (temp.right != null) {
        stack.push(temp.right)
    }
}
return result
}

//5 中序遍历（递归）
function middleroot(root, callback) {
if (root != null) {
    preroot(root.left, callback)
    callback(root.key)
    preroot(root.right, callback)
}
}

//5.1 中序遍历（非递归）
function middleroot(root) {
let stack = [],
    result = []
while (true) {
    while (root != null) {
        stack.push(root)
        root = root.left
    }
    if (stack.length == 0) {
        break
    }
    let temp = stack.pop()
    result.push(temp.key)
    stack.push(temp.right)
}
return result
}


//分层遍历（递归）
function bfs(root) {
let queue = [],
    result = []
let pointer = 0
if (root != null) {
    queue.push(root)
}
let bfsFun = function () {
    let temp = queue[pointer]
    if (temp) {
        result.push(temp.key)
        if (temp.left) {
            queue.push(temp.left)
        }
        if (temp.right) {
            queue.push(temp.right)
        }
        pointer++
        bfsFun()
    }

}
bfsFun()
return result
}

//分层遍历（非递归）
function bfs(root) {
let queue = [],
    result = []
if (root !== null) {
    queue.push(root)
}
let pointer = 0
while (pointer < queue.length) {
    let temp = queue[pointer++]
    result.push(temp.key)
    temp.left && queue.push(temp.left)
    temp.right && queue.push(temp.right)
}
return result
}

// 按之字形顺序打印二叉树
function zhiRoot(root) {
let stack1 = [],
    stack2 = [],
    result = []

if (root != null) {
    stack1.push(root)
}
let flag = 1
while (stack1.length != 0 || stack2.length != 0) {
    const list = []
    if (flag % 2) {
        while (stack1.length != 0) {
            let temp = stack2.pop()
            list.push(temp.key)
            temp.left && stack2.push(temp.left)
            temp.right && stack2.push(temp.right)
        }
    } else {
        while (stack2.length != 0) {
            let temp = stack1.pop()
            list.push(temp.key)
            temp.left && stack1.push(temp.left)
            temp.right && stack1.push(temp.right)
        }
    }
    i++
    result.push(list)
}
return result
}


function Print(root) {
const result = [];

if (root === null) {
    return result;
}

const stack1 = [];
const stack2 = [];

stack1.push(root);
let flag = 1;
while (stack1.length !== 0 || stack2.length !== 0) {
    const list = [];
    if (flag % 2) {
        while (stack1.length !== 0) {
            const temp = stack2.pop()
            list.push(temp.val);
            temp.left && stack2.push(temp.left)
            temp.right && stack2.push(temp.right)
        }
    } else {
        while (stack2.length !== 0) {
            const temp = stack1.pop()
            list.push(tmp.val);
            temp.left && stack1.push(temp.left)
            temp.right && stack1.push(temp.right)
        }
    }
    i++;
    result.push(list);
}
return result;
}


//7、求二叉树第K层的节点个数
function getknum(root, k) {
if (root == null || k < 0) {
    return
}
if (root !== null && k == 1) {
    return 1
}
return getknum(root.left, k - 1) + getknum(root.right, k - 1)
}

//8.求二叉树第K层的叶子节点个数
function getksonnum(root, k) {
if (root == null || k < 0) {
    return
}
if (root != null && k == 1) {
    if (root.left == null && root.right == null) {
        return 1
    } else {
        return 0
    }
}
return getksonnum(root, k - 1) + getksonnum(root, k - 1)
}


//反转二叉树
function reverseRoot(root) {
if (root == null) {
    return
}
let temp = root.left
root.left = reverseRoot(root.right)
root.right = reverseRoot(temp)
return root
}


// 求二叉树的直径
function longerlength(root) {
let path = 0
getlongerlength(root)
return path

function getlongerlength(root) {
    if (root == null) {
        return
    }
    let left = longerlength(root.left)
    let right = longerlength(root.right)
    path = Math.max(path, left + right)
    return Math.max(left, right) + 1
}

}

// 二叉树中和为某一值的路径
function getPath(root, target) {
let result = []
if (root) {
    findPath(root, target, [], 0, result)
}
return result

function findPath(root, target, stack, sum, result) {
    stack.push(root.key)
    sum += root.key
    if (!root.left && !root.right && sum === target) {
        result.push(stack.slice(0))
    }
    if (root.left) {
        findPath(root.left, target, stack, sum, result)
    }
    if (root.right) {
        findPath(root.right, target, stack, sum, result)
    }
    stack.pop()
}

}
//给定一棵二叉搜索树，请找出其中的第k小的结点。(中序遍历+ k小)


//链表
function linkedList() {
function node(data) {
    this.data = data
    this.next = null
}

this.head = null
this.length = 0


linkedList.prototype.append = function (data) {
    let newnode = new node(data)
    if (this.head == null) {
        this.head = newnode
    } else {
        let current = this.head
        while (current.next) {
            current = current.next
        }
        current.next = newnode
        this.length++
    }
}
linkedList.prototype.find =function(data){
    let current = this.head
    while(current.next){
        if(current.data ===data){
            break
        }
        current = current.next
    }
    return current
}

linkedList.prototype.fixed=function(data,newdata){
       let current= this.find(data)
       current.data= newdata
}

linkedList.prototype.prefind =function(data){
    let current = this.head
    while(current.next){
        if(current.next.data ===data){
            break
        }
        current = current.next
    }
    return current
}

linkedList.prototype.delete = function (data) {

        if(this.head.data === data){
            this.head = this.head.next
            return
        }
        let prenode=this.prefind(data)
        let current=this.find(data)
        prenode = current.next
}

linkedList.prototype.toString = function () {
    let result = ''
    let current = this.head
    while (current) {
        result += current.data + "->"
        current = current.next
    }
    return result
}

}
let a = new linkedList()
a.append('abc')
a.append('abcd')
a.append('abcde')
console.log(a.toString())

a.fixed('abc',11111)
console.log(a.toString())


//hash表
//链地址法
//装载因子（0.25，0.75）
function HashTable() {
//属性
this.storage = []   //存储的位置
this.count = 0     // 数目
this.limit = 7    //最终限制数组的大小

//方法
// 哈希函数
HashTable.prototype.hashFunc = function (str, size) {
    //1、定义 hashCode变量
    let hashCode = 0
    for (let i = 0; i < str.length; i++) {
        //2、霍纳算法，来计算hashCode的值
        hashCode = 37 * hashCode + str.charCodeAt(i)
    }
    //3、取余操作
    let index = hashCode % size
    return index
}


//插入&修改操作
HashTable.prototype.put = function (key, value) {
    //1.根据key获取对应的 index
    let index = this.hashFunc(key, this.limit)
    // 2、根据 index 取出对应的 bucket
    let bucket = this.storage[index]

    //3、判断 bucket是否为空
    if (bucket == null) {
        bucket = []
        this.storage[index] = bucket
    }
    //4、判断是否是修改数据
    for (let i = 0; i < bucket.length; i++) {
        let tuple = bucket[i]
        if (tuple[0] == key) {
            tuple[1] = value
            return
        }
    }
    //5.添加操作
    bucket.push([key, value])
    this.count++

    //判断是否需要扩容
    if (this.count > this.limit * 0.75) {
        this.resize(this.limit * 2)
    } 

}

//获取操作
HashTable.prototype.get = function (key) {
    let index = this.hashFunc(key, this.limit)
    let bucket = this.storage[index]
    if (bucket == null) {
        return false
    }
    for (let i = 0; i < bucket.length; i++) {
        let tuple = bucket[i]
        if (tuple[0] === key) {
            return tuple[1]
        }
    }
}
HashTable.prototype.remove = function (key) {
    let index = this.hashFunc(key, this.limit)
    let bucket = this.storage[index]
    if (bucket == null) {
        return null
    }
    for (let i = 0; i < bucket.length; i++) {
        let tuple = bucket[i]
        if (tuple[0] == key) {
            bucket.splice(i, 1)
            this.count--

            //缩小容量
            if (this.limit > 7 && this.count < this.limit * 0.75) {
                this.resize(Math.floor(this.limit / 2))
            }

            return tuple[1]
        }
    }
    return null
}

//哈希表的扩容、
HashTable.prototype.resize = function (newLimit) {
    //1.保存旧的数据内容
    let oldStorage = this.storage
    //2. 重置所有的属性

    this.storage = []
    this.count = 0
    this.limit = newLimit


    //3.遍历 oldStorage 所有的 bucket
    for (let i = 0; i < oldStorage.length; i++) {
        let bucket = oldStorage[i]
        if (bucket == null) {
            continue
        }
        for (let j = 0; j < bucket.length; j++) {
            let tuple = bucket[i]
            this.put(tuple[0], tuple[1])

        }
    }

}

}
let a = new HashTable()
a.put('zc', '15')
a.put('zc1', '115')
a.put('z1', '115')
a.put('asd', '115')
a.put('wew', '115')
a.remove('wew')
console.log(a.get('wew'))

//排序算法
function ArrayList() {
this.array = []

ArrayList.prototype.insert = function (item) {
    this.array.push(item)
}

ArrayList.prototype.toString = function () {
    return this.array.join('-')
}

ArrayList.prototype.swap = function (m, n) {
    let temp = this.array[m]
    this.array[m] = this.array[n]
    this.array[n] = temp
}
//实现排序算法
//冒泡排序
ArrayList.prototype.bubbles = function () {
    if (this.array === null || this.array.length < 2) return this.array
    let length = this.array.length
    for (let i = length - 1; i >= 0; i--) {
        for (let j = 0; j < i; j++) {
            if (this.array[j] > this.array[j + 1]) {
                this.swap(j, j + 1)
            }
        }
    }
}

//选择排序
ArrayList.prototype.selectSort = function () {
    if (this.array === null || this.array.length < 2) return this.array
    let length = this.array.length
    for (let i = 0; i < length - 1; i++) {
        let min = i
        for (let j = i + 1; j < length; j++) {
            if (this.array[min] > this.array[j]) {
                min = j
            }
        }
        this.swap(min, i)
    }
}

//插入排序
ArrayList.prototype.insertSort = function () {
    if (this.array === null || this.array.length < 2) return this.array
    let length = this.array.length

    for (let i = 1; i < length; i++) {
        var temp = this.array[i]
        let j = i
        while (this.array[j - 1] > temp && j > 0) {
            this.array[j] = this.array[j - 1]
            j--
        }
        this.array[j] = temp
    }
}

//高级排序
//希尔排序 (对插入排序的升级)
ArrayList.prototype.shellSort = function () {
    if (this.array === null || this.array.length < 2) return this.array
    let length = this.array.length
    //初始化增量
    var gap = Math.floor(length / 2)
    // whlie循环
    while (gap > 1) {
        for (let i = gap; i < length; i++) {
            let temp = this.array[i]
            let j = i
            while (this.array[j - gap] > temp && j > gap - 1) {
                this.array[j] = this.array[j - gap]
                j -= gap
            }
            this.array[j] = temp
        }
        gap = Math.floor(gap / 2)
    }
}
}


//迭代器
var it = makeIterator(["a", "b"]);
console.log(it.next())
console.log(it.next())
console.log(it.next())

function makeIterator(array) {
  let nextindex=0
  return{
      next:function () {
          if(nextindex<array.length){
              return {value:array[nextindex++],done:false}
          }else{
              return {value: undefined,done: true}
          }
      }
  }
}

//最大子序列
let arr = [1, -5, 8, 3, -4, 15, -8]
// function getNum(arr) {
//     let length = arr.length
//     let maxmun=0
//     for (let i = 0; i <length ; i++) {
//         let sum=arr[i]
//         for (let j = i+1; j < length; j++) {
//             sum+=arr[j]
//             if(sum>maxmun){
//                 maxmun = sum
//             }
//
//         }
//     }
//     return maxmun
// }
function getNum(arr) {
  let max = 0
  let sum = 0
  for (let num of arr) {
      if (sum < 0) {
          sum = 0
      }
      sum += num
      max = Math.max(max, sum)
  }
  return max
}
console.log(getNum(arr))


//EventListener
//实现一个EventListener类，包含on，off，emit方法
class EventListener {
constructor() {
    this.list = {}
}
on(key, fn) {
    if (!this.list[key]) {
        this.list[key] = []
    }
    this.list[key].push(fn)

}
emit(key, ...args) {
    for (let fn of this.list[key]) {
        fn.apply(this, args)
    }
}
off(key, fn) {
    let fnlist = this.list[key]
    if (!fnlist) return
    if (!fn) {
        fnlist.length = 0
    } else {
        fnlist.forEach((item, index) => {
            if (item === fn) {
                fnlist.splice(index, 1)
            }
        })
    }
}
}

let obj1 = new EventListener()
obj1.on('work', value => {
console.log(`我是${value}啊`)
})
obj1.on('eat', value => {
console.log(`我在${value}啊`)
})
obj1.emit('work', 'zc')
obj1.off('eat')
obj1.emit('eat', '吃西瓜')

//sleep
function sleep(time) {
return new Promise((resolve,reject)=>{
    setTimeout(resolve,time)
})
}
sleep(1000).then(value=>{
console.log('11111')
})


//手写斐波那契
// 递归
function getnum(num) {
if(num <= 1) return 1
return getnum(num - 1) + getnum(num - 2)
}
console.log(getnum(2))
// ----------------------------------
//动态规划
function getnum(n) {
let temp=[]
  if(n==1||n==2){
      return 1
  }else{
      temp[1]=1
      temp[2]=2
      for (let i = 3; i <n ; i++) {
          temp[i] = temp[i-1] + temp[i-2]
      }
      return temp[i-1]
  }
}


//只包含'(', ')', '[', ']', '{', '}' 的字符串，判断是否有效。
var isValid = function(s) {
var rightSymbols = [];
for (var i = 0; i < s.length; i++) {
    if(s[i] == "("){
        rightSymbols.push(")");
    }else if(s[i] == "{"){
        rightSymbols.push("}");
    }else if(s[i] == "["){
        rightSymbols.push("]");
    }else if(rightSymbols.pop() != s[i] ){
        return false;
    }
}
return !rightSymbols.length;
};

//数组中只出现一次的数字
let arr=[1,2,3,4,3,2,1]
const p=arr.reduce((a,b)=>{
  return a^b
})
console.log(p)

//数组最大深度
let arr = [1, [1, [3], 2], 2, [1], 3, 4]
let count = 0

function getDep(arr) {
  let p = false
  p = arr.some(item => {
      return item.length > 0
  })
  if (p) {
      count++
      getDep(arr.flat())
  } else {
      return count
  }
}
console.log(getDep(arr))


//递归数组扁平化
let arr= [1,2,3,2,[2,3],[2,[1],2]]
function wrap() {
  let ret=[]
  return function flatten(arr) {
      for(let item of arr){
          if(item.constructor === Array){
             ret.concat(flatten(item))
          }else{
              ret.push(item)
          }
      }
      return ret
  }
}
console.log(wrap()(arr))


//模拟js精度丢失问题
function add(num1, num2) {
const num1Digits = (num1.toString().split('.')[1] || '').length;
const num2Digits = (num2.toString().split('.')[1] || '').length;
const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
return (num1 * baseNum + num2 * baseNum) / baseNum;
}
console.log(add(0.1,0.2))

//单例模式
// 单例模式不透明
function singleTon(name) {
this.name = name
this.instance = null
}
singleTon.prototype.getName=function () {
console.log(this.name)
}
singleTon.getInstance = function (name) {
 if(!this.instance){
     this.instance = new singleTon(name)
 }
 return this.instance
}
var b = singleTon.getInstance('bbbbb')
var a = singleTon.getInstance('a')
console.log(a)
console.log(b)
// ----------------------------------
// 单例模式不透明（闭包）
function singleTon(name) {
this.name = name
}
singleTon.prototype.getName=function () {
console.log(this.name)
}
singleTon.getInstance = (function () {
let instance = null
return function (name) {
    return instance || (instance = new singleTon(name))
}
})()

var a = singleTon.getInstance('a')
var b = singleTon.getInstance('bbbbb')
var c = singleTon.getInstance('cccccc')
console.log(a)
console.log(b)
console.log(c)



//策略模式
// 策略类（开发人员）
var Strategies = {
"backend": function(task) {
    console.log('进行后端任务：', task);
},
"frontend": function(task) {
    console.log('进行前端任务：', task);
},
"testend": function(task) {
    console.log('进行测试任务：', task);
}
};
//  环境类（开发组长）
var Context = function(type, task) {
typeof Strategies[type] === 'function' && Strategies[type](task);
}


//代理模式
//【图片预加载 -- 代理模式】

//定义本体 
let myImg=(function () {
var img = new Image()
document.body.append(img)
return {
    setsrc(src){
        this.src=src
    }
}
})()

//代理函数
let Proxysetimg = (function () {
var img = new Image()
img.onload =function () {
    myImg.setsrc(this.src)
}
return{
    setsrc(src){
        myImg.setsrc('./loading.gif')
        img.src = src
    }
}
})()
Proxysetimg('./111.png')


//观察者模式
// 目标者类
class Subject {
constructor() {
    this.observers = [];  // 观察者列表
}
// 添加
add(observer) {
    this.observers.push(observer);
}

// 删除
remove(observer) {
    let idx = this.observers.findIndex(item => item === observer);
    idx > -1 && this.observers.splice(idx, 1);
}

// 通知
notify() {
    for (let observer of this.observers) {
        observer.update();
    }
}
}

// 观察者类
class Observer {
constructor(name) {
    this.name = name;
}

// 目标对象更新时触发的回调
update() {
    console.log(`目标者通知我更新了，我是：${this.name}`);
}
}

// 实例化目标者
let subject = new Subject();

// 实例化两个观察者
let obs1 = new Observer('前端开发者');
let obs2 = new Observer('后端开发者');

// 向目标者添加观察者
subject.add(obs1);
subject.add(obs2);

// 目标者通知更新
subject.notify();
// 输出：
// 目标者通知我更新了，我是前端开发者
// 目标者通知我更新了，我是后端开发者


//命令模式
class Receiver {  // 接收者类
execute() {
    console.log('接收者执行请求');
}
}

class Command {   // 命令对象类
constructor(receiver) {
    this.receiver = receiver;
}
execute () {    // 调用接收者对应接口执行
    console.log('命令对象->接收者->对应接口执行');
    this.receiver.execute();
}
}

class Invoker {   // 发布者类
constructor(command) {
    this.command = command;
}
invoke() {      // 发布请求，调用命令对象
    console.log('发布者发布请求');
    this.command.execute();
}
}

const warehouse = new Receiver();       // 仓库
const order = new Command(warehouse);   // 订单
const client = new Invoker(order);      // 客户
client.invoke();


//Promise 处理文件读取
const fs = require('fs')
const path = require('path');

const readfile = function (filename) {
  return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, filename), 'utf-8', function (error, data) {
          if (error) return reject(error)
          resolve(data)
      })
  })
}

readfile('./01.txt')
  .then(value => {
      console.log(value)
      return readfile('./02.txt')
  })
  .then(value => {
      console.log(value)
      return readfile('./03.txt')
  })
  .then(value => {
      console.log(value)
  }).catch(reason => {
  console.log(reason)
})


//Generator 函数文件读取
const fs = require('fs')
const path = require('path');

const readfile = function (filename) {
  return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, filename), 'utf8', function (error, data) {
          if (error) return reject(error)
          resolve(data)
      })
  })
}
function* gen() {
  yield readfile('./01.txt')
  yield readfile('./02.txt')
  yield readfile('./03.txt')
}
const result = gen()

result.next().value.then(value=>{
  console.log(value)
  return result.next().value
}).then(value => {
  console.log(value)
  return result.next().value
}).then(value => {
  console.log(value)
}).catch(reason => {
  console.log(reason)
})


//async 函数文件读取
const fs = require('fs')
const path = require('path');

const readfile = function (filename) {
  return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, filename), 'utf8', function (error, data) {
          if (error) return reject(error)
          resolve(data)
      })
  })
}
async function gen() {
  try{
      const f1=await readfile('./01.txt')
      const f2=await readfile('./02.txt')
      const f3 = await readfile('./03.txt')
      console.log(f1)
      console.log(f2)
      console.log(f3)
  }catch (e) {
      console.log(e)
  }
}
gen()
