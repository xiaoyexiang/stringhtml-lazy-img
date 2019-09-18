# stringhtml-lazy-img

> 如果你的项目里面有富文本，并且还被要求显示的时候需要图片懒加载，那我觉得你可以看下我这个插件，或许能给你不少灵感。
> Tip: 估计你也不能直接使用我的插件，该插件是按照项目需求定制的。


## 使用方法

首先，引入js

```
<script type="text/javascript" src="/stringhtml-lazyload.js"></script>

```

接着，调用

```
// element：dom 对象
// text：富文本内容
// options：调用参数

new strHtmlLazyload(element, text, {
    ableLazyLoad: true, // 开启懒加载，替换图片
    urlResizeType: 'auto', // 图片路径压缩，oss：阿里，qiniu: 七牛， none: 不压缩，auto：根据配置链接自适应,必须填写ossUrlPrefix, qiniuUrlPrefix
    isYojiangApp: false, // 是否是在有讲APP
    imgBigCheck: true,  // 开启点击查看大图事件
    ossUrlPrefix: 'alcdn.yojiang.cn', // 阿里云 OSS 链接域名
    qiniuUrlPrefix: 'img.yojiang.cn', // 七牛链接域名
    defaultLazyPic: '', // 使用默认图片
    ableRatio: false, // 是否开启按屏幕像素比获取图片
});
```

## 更好体验，图片占位

首先，```img``` 标签里面限制，必须先有 ```width``` 、 ```height``` 属性

```
<img src="https://alcdn.yojiang.cn/upload/umeditor/image/20190522/15/c45e6ded3cfa5957" width="640" height="141"/>

```

我项目是使用 [UEditor](https://ueditor.baidu.com/website/) 上传富文本的，所以我改了他的源码，上传图片的时候加上  ```width``` 、 ```height``` 属性，实在嫌麻烦的话，每张图片使用一个固定的宽高限定，体验也会好很多。


## MIT License

Copyright (c) 2019 XiaoYexiang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
