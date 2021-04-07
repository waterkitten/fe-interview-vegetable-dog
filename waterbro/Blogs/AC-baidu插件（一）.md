# 如何提高网页版百度搜索的速度



### 1.脚本作用

搜索引擎为了不让爬虫偷取数据，会让原来的网页显示为自己的链接，如何重定向到本来的网页

![image-20210306150433303](https://mmbiz.qlogo.cn/mmbiz_png/c9ofze3Lrich6s1BA5lyumQ0XmxgRtxibjC50D3FaI2iaSLpK7u3YwED5tacMDScSQfPapjWGOOXaDm4AqnP9XP4Q/0?wx_fmt=png)

> 原本的链接是  blog.szuea.com
>
> 但百度显示为下面这个链接
>
> 当我们点击搜索时候 第一层是
>
> baidu.com/***\******
>
> 然后再跳转到blog.szuea.com

这样会让网页加载变得缓慢，本来是直接解析网址加入，想着又多了一层中转，要先解析百度网址再重定向到原本网址

### 2.开发中遇到的问题

##### 一.监听DOM的变化的问题

###### 初始方案—MutationObserver

DOM 规范中的 `MutationObserver()` 构造函数——是 [`MutationObserver`](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver) 接口内容的一部分——创建并返回一个新的观察器，它会在触发指定 DOM 事件时，调用指定的回调函数。MutationObserver 对 DOM 的观察不会立即启动；而必须先调用 [`observe()`](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/observe) 方法来确定，要监听哪一部分的 DOM 以及要响应哪些更改。

```
var observer = new MutationObserver(callback);
```

​	**参数callback**

​	一个回调函数，每当被指定的节点或子树以及配置项有Dom变动时会被调用。回调函数拥有两个参数：

1. 一个是描述所有被触发改动的 [`MutationRecord`](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationRecord) 对象数组
2. 一个是调用该函数的`MutationObserver` 对象

**范例**

- 定义回调函数

  ```
  function callback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    switch(mutation.type) {
      case 'childList':
        /* 从树上添加或移除一个或更多的子节点；参见 mutation.addedNodes 与
            mutation.removedNodes */
        break;
      case 'attributes':
        /* mutation.target 中某节点的一个属性值被更改；该属性名称在 mutation.attributeName 中，
            该属性之前的值为 mutation.oldValue */
        break;
    }
  });
  }
  ```

- 创建并使用observer,设置一个观察进程

  ```
  var targetNode = document.querySelector("#someElement");
  var observerOptions = {
  childList: true, // 观察目标子节点的变化，是否有添加或者删除
  attributes: true, // 观察属性变动
  subtree: true     // 观察后代节点，默认为 false
  }
  
  var observer = new MutationObserver(callback);
  observer.observe(targetNode, observerOptions);
  ```

**初始方案代码**

```
var targets;
var list;
if(location.href.indexOf('www.baidu') > -1){
  targets = document.querySelector("#content_left"); // 选中了当前页的所有搜索内容所在模块
}
function callback(allmutations){
list =document.querySelector('.t a')
    // 注意querySelectorAll得到的对象是静态的，所以每次重复调用的时候需要更新
resetURL()
}
var observer = new MutationObserver(callback);

observer.observe(targets, {'childList': true, 'subtree': true});
//
function resetURL(){
  for(var i = 0; i < list.length; i++){
      // 此方法是异步，故在结束的时候使用i会出问题-严重!
      // 采用调用前通过context过去，调用结束后通过response.context获得
      GM_xmlhttpRequest({
              url: list[i].href,
              headers: {
                  "Accept": "text/xml"
              },
              context: i+1, //直接传递i,在i=0的时候反馈回来时null-猜想被会被转换掉，所以+1
              method: "GET",
              onload: function(response) {
                  var index = response.context-1;
                  document.querySelectorAll(".t a")[index].href=response.finalUrl;
              }
      });
  }
}
```

但是.....................

**出现的问题**

我在百度网站new这个muationObserver时候

![image-20210306232921432](https://mmbiz.qlogo.cn/mmbiz_png/c9ofze3Lrich6s1BA5lyumQ0XmxgRtxibjXYQiab5bq2icG1kbly6PD9YCcdTnksufUKfb6RoNEpsk29JbKIPjn61w/0?wx_fmt=png)



但正常情况下

![image-20210306232949063](https://mmbiz.qlogo.cn/mmbiz_png/c9ofze3Lrich6s1BA5lyumQ0XmxgRtxibjRsIYcnicT7wsK4elqQsia1g0mTfC9npKZfm3PfMNQnhoZzUNgbicnDt5Q/0?wx_fmt=png)



什么意思呢，他的原型指向了null的话 那就new不出东西了  也就用不了了 ，这可能是百度官网为了防止各路开发者搞骚操作整的活儿，

###### 代替方案—DOMNodeInserted

为什么说是替代方案呢

![image-20210306233049765](https://mmbiz.qlogo.cn/mmbiz_png/c9ofze3Lrich6s1BA5lyumQ0XmxgRtxibjs1L0nicBJyPiajzWbQickcu8ADd4hZibzeytBxC5Oq2zJc73kcKrsv7hAg/0?wx_fmt=png)

而且采用MutationObserver监视会大大实际代码的调用次数-比DOMNodeInserted更好的调用方式。但人家百度不让你用你有什么办法

那怎么办呢，那我们就使用旧的API DOMNodeInserted去监听DOM变化，或者你们比较强的人可以去看看怎么自己实现一个MutationObserver

**方案二代码**

```
var targets;
var list;
var time;
var Stype;
if (location.href.indexOf("baidu.com") > -1)
Stype = "h3.t>a";
else if (location.href.indexOf("sogou.com") > -1)
Stype = "h3.pt>a, h3.vrTitle>a";
document.body.addEventListener("DOMNodeInserted", function (event) {
var element = event.target;
console.log(element);
list = document.querySelectorAll(Stype);
resetURL();
});

function resetURL() {
for (var i = 0; i < list.length; i++) {
  // 此方法是异步，故在结束的时候使用i会出问题-严重!
  // 采用调用前通过context过去，调用结束后通过response.context获得
  var curhref = list[i].href;
  if (list[i].getAttribute("loaded_Status") == null) {
    list[i].setAttribute("loaded_Status", "0");
    if (curhref.indexOf("baidu.com") > -1 || curhref.indexOf("sogou.com") > -1) {
      GM_xmlhttpRequest({
        url: curhref,
        headers: {
          "Accept": "text/html"
        },
        context: curhref, //直接传递i,在i=0的时候反馈回来时null-猜想被会被转换掉，所以+1
        method: "GET",
        onload: function (response) {},
        onreadystatechange: function (response) {
          if (response.status == 200) {
            //alert(response.responseText);
            //alert(response.readyState);
            //if(response.readyState==4||response.status==0){
            DealResult(response);
          }
          //console.log(response);
        }
      });
    } else {
      console.log("绕过百度重定向直接访问网页：第" + i + "个已经处理了");
    }
  }
}
}

function DealResult(response) {
var resultURL = response.finalUrl;
if (Stype.length > 10) {
  //如果是搜狗的结果
  var resultResponseUrl = Reg_Get(response.responseText, "URL='([^']+)'");
  if (resultResponseUrl !== null){
    resultURL = resultResponseUrl;
  }
}
var indexhref = response.context;
var ccnode = document.querySelectorAll("h3>[href='" + indexhref + "']")[0];
//console.log(ccnode.href);
if (ccnode !== null) {
  ccnode.href = resultURL;
} else {
  console.log("该链接已经被其他脚本干掉了哦" + response.finalUrl);
}
}

function Reg_Get(HTML, reg) {
var RegE = new RegExp(reg);
return RegE.exec(HTML)[1];
}
```

##### 二.for循环里面异步操作问题

###### 介绍

首先来看一个比较简单的问题，我们想实现的就是每隔1s输出0-4的值，就是这么简单，看下错误写法：

```
function test() {
  for (var i = 0; i < 5; ++i) {
      setTimeout(function() {
          console.log("index is :", i);
      }, 1000);
  }
}
test();
index is : 5
index is : 5
index is : 5
index is : 5
index is : 5
```

**而且该操作几乎是在同一时间完成，setTimeout定时根本就没有起作用，这是因为：单线程的js在操作时，对于这种异步操作，会先进行一次“保存”，等到整个for循环执行结束后，此时i的值已经变成5，因为setTimeout是写在for循环中的，相当于存在5次定时调用，这5次调用均是在for循环结束后进行的，所以自然而然输出都是5，**

正确的实现有几种，一般情况下，我们使用递归实现，如下：

```
box6();
function box7(param) {
  if (param < 5) {
      console.log("index is :", param);
      setTimeout(function() {
          box7(param + 1);
      }, 1000)
  }
}
box7(0);
```

递归调用很好解决了setTimeout同时执行的情况，如果是使用async，await实现可以以下写法：

```
var asyncFunc = function(arr, i) {
  return new Promise(function(resolve, reject) {
      setTimeout(function() {
          arr.push(i);
          console.log("index is : ", i);
          resolve();
      }, 1000);
  });
}

var box5 = async function() {
  var arr = [];
  for (var i = 0; i < 5; i++) {
      await asyncFunc(arr, i);
  }
  console.log(arr);
}

box5();
```

###### 代码优化

**要改善的代码**

```
var targets
var list
var time
var Stype
if (location.href.indexOf('baidu.com') > -1) {
Stype = 'h3.t>a'
}
document.body.addEventListener('DOMNodeInserted', function (event) {
let element = event.target
console.log('element', event.target);
list = document.querySelectorAll(Stype)
resetURL()
  .then(res => console.log(res))
  .catch(err => console.log('err'))
})

var resetURL = function () {
for (let i = 0; i < list.length; i++) {
  var curhref = list[i].href
  if (curhref.indexOf('baidu.com') > -1) {
    GM_xmlhttpRequest({
      url: curhref,
      header: {
        "Accept": "text/html"
      },
      context: curhref,
      method: 'GET',
      onreadystatechange:async function (response) {
        if (response.status == 200) {
          await DealResult(response).then(res => {
            console.log(res)
          })
        } else {
          console.log('震惊，log不了')
        }
      }
    })
  } else {
    console.log("绕过百度重定向直接访问网页：第" + i + "个已经处理了");
  }

}
}

const DealResult = async (response) => {
return new Promise(resolve => {
  console.log(response)
  var resultURL = response.finalUrl;
  var indexhref = response.context
  var ccnode = document.querySelectorAll("h3>[href='" + indexhref + "']")[0];
  //console.log(ccnode.href);
  if (ccnode !== null) {
    ccnode.href = resultURL;
  }
  resolve(response)
})
}

```