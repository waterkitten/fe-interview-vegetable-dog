从代码角度初窥虚拟现实

> 水鸡我呢，最近选了一门虚拟现实课，然后需要写一篇相关公众号文章，大致是vr的概念之类的，但作为一个前端工程师，肯定是想整活的，那我们通过几段代码来简单看看效果（调接口那种 算法原理就算了哈哈哈哈），因为篇幅原因，本篇只讲three.js使用入门和   ~~网上复制来的教程~~     辛苦整理的教程
>
> 虚拟技术，其实就是用电脑模拟一个产生了3D空间的虚拟世界，打破观察者观察3D空间的限制

![img](https://gitee.com/szuwaterbrother/typora-pic-bed/raw/master/hmds.jpg)

## 简单的原理介绍

WebVR API是中央API，用于捕获与计算机相连的VR设备上的信息以及头戴式耳机的位置/方向/速度/加速度信息，并将其转换为可用于游戏和其他应用程序的有用数据。

WebVR API基于两个概念-将立体图像发送到耳机中的两个镜头并从传感器接收头部的位置数据，而这两个则由HMDVRDevice（头戴式显示器虚拟现实设备）和PositionSensorVRDevice处理。

**WebVR的体验方式可以分为VR模式和裸眼模式**

***1.Mobile VR***

如使用cardboard眼镜来体验手机浏览器的webVR网页，浏览器将根据水平陀螺仪的参数来获取用户的头部倾斜和转动的朝向，并告知页面需要渲染哪一个朝向的场景。

***2.PC VR***

通过佩戴Oculus Rift的分离式头显浏览连接在PC主机端的网页，现支持WebVR API的浏览器主要是火狐的 [Firefox Nightly](https://link.zhihu.com/?target=https%3A//nightly.mozilla.org/)和设置VR enabled的谷歌chrome beta。

除了VR模式下的体验方式，这里还考虑了裸眼下的体验浏览网页的方式，在PC端如果探测的用户选择进入VR模式，应让用户可以使用鼠标拖拽场景，而在智能手机上则应让用户可以使用touchmove或旋转倾斜手机的方式来改变场景视角

![img](https://gitee.com/szuwaterbrother/typora-pic-bed/raw/master/v2-31d4c0da70d0a657e44754155a6b1230_720w.jpg)

但是仅仅是看概念是很头晕且没意思的，后面来康康代码和效果

在本文章我们讲探讨WebVR API来增强Three.js构建的简单WebGL场景，我们先来学习下，如何用Three.js构建一个“将一个盒子放入一个立体空间“的场景

## 透过代码实现对比

### 简单的3D模型

在我们的3D世界中，我们将有以下一些内容：

1. 一个场景
2. 渲染器
3. 相机
4. 一两个物体（带材料）

**代码如下😀**

```
<html>
  <head>
    <meta charset="utf-8" />
    <title>My first three.js app</title>
    <style>
      body {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <script src="js/three.js"></script>
    <script>
      //场景和相机
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      //渲染
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.body.appendChild(renderer.domElement)
      //正方体
      const geometry = new THREE.BoxGeometry()
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)
      //相机位置
      camera.position.z = 5
      //设置动画
      const animate = function () {
        requestAnimationFrame(animate)
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        renderer.render(scene, camera)
      }

      animate()
    </script>
  </body>
</html>
```

效果如下（我们可以再绘制网格线给它，这里就不画了，篇幅问题，绿块后面是效果）

![image-20210320223505397](https://gitee.com/szuwaterbrother/typora-pic-bed/raw/master/image-20210320223505397.png)

![image-20210321022104037](https://gitee.com/szuwaterbrother/typora-pic-bed/raw/master/image-20210321022104037.png)

### VR增强后的模型

#### 操作

##### 找寻VR显示器

在有了一个 3D 场景后，为了使其通过 WebVR 运行我们需要做些什么？首先，我们需要查询浏览器以发现是否有任何可用的 VR 显示器，我们可以通过 navigator.getVRDisplays() 执行此操作。

```
navigator.getVRDisplays().then(displays => {
  // 过滤到显示可呈现设备
  displays = displays.filter(display => display.capabilities.canPresent);

  // 无设备则推出
  if (displays.length === 0) {
    console.warn('No devices available able to present.');
    return;
  }

  // 存储我们找到的第一个显示器. 
  // 后面的两个是为了后面方便用户自己做选择
  this._vr.display = displays[0];
  this._vr.display.depthNear = DemoVR.CAMERA_SETTINGS.near;
  this._vr.display.depthFar = DemoVR.CAMERA_SETTINGS.far;
});
```

##### 模拟VR设备

你可以用chrome DevTools拓展程序模拟一台设备（假如你是在开发阶段）名字叫做WebVR API Emulation

![image-20210321023837909](https://gitee.com/szuwaterbrother/typora-pic-bed/raw/master/image-20210321023837909.png)

##### 从设备请求显示

```
this._vr.display.requestPresent([{
  source: this._renderer.domElement
}]);
```

##### 绘制VR场景

这里的话，是要给用户显示一个VR场景

![image-20210321022637644](https://gitee.com/szuwaterbrother/typora-pic-bed/raw/master/image-20210321022637644.png)

我们这里要做的工作是

1. 确保使用设备的 `requestAnimationFrame` 回调。
2. 从 VR 设备请求当前的姿势、屏幕方向和眼睛信息。
3. 将 WebGL 上下文分成两半，每一半对应一只眼睛，并单独绘制。

```
_render () {
  this._vr.display.requestAnimationFrame(this._update);
  …
}
//.........................
// 从VR头盔获取所有最新数据，并将其转储到frameData。
this._vr.display.getFrameData(this._vr.frameData);
this._vr.frameData = new VRFrameData();
//getFrameData() 将选取一个对象，它将我们需要的信息放置在该对象上。这必须是一个 VRFrameData 对象，我们可以通过 new //VRFrameData() 创建它。
this._vr.frameData = new VRFrameData();
```

### 总结

~~其实本次文章还是为了应付老师~~（大家有兴趣可以去看Paul Lewis的GitHub源码，很多有意思的东西，后面VR那里有点不太理解，~~因为不会用VR~~，所以就略略带过.... 