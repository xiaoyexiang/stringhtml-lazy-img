(function() {
    'use strict';
    var yojiangAppCurY = 0;
    window.android.consoleLog('yojiangAppCurY: ' + yojiangAppCurY);

    // 对象合并
    function extend(o, n, override) {
        for (var key in n) {
            if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
                o[key] = n[key];
            }
        }
        return o;
    }

    function hasClass(el, className) {
        return el.classList.contains(className);
    }

    function addClass(el, className) {
        el.classList.add(className);
    }

    function getData(el, name, val) {
        const prefix = 'data-';
        if (val) {
            return el.setAttribute(prefix + name, val);
        }
        return el.getAttribute(prefix + name);
    }

    function isIos() {
        const clientTexts = ['iPhone', 'iPad'];
        for (let i = 0; i < clientTexts.length; i++) {
            if (navigator.userAgent.indexOf(clientTexts[i]) > -1) {
                return true;
            }
        }
        return false;
    }

    function isAndroid() {
        return navigator.userAgent.indexOf('Android') > -1;
    }

    function strHtmlLazyload(element, strHtml, options) {
        this.init(element, strHtml, options);
    }

    strHtmlLazyload.prototype = {
        getHttp: getHttp,
        stripProtocol: stripProtocol,

        init: function(element, strHtml, options) {

            var defOpts = {
                ableLazyLoad: true, // 开启懒加载，替换图片
                defaultLazyPic: 'https://img.yojiang.cn/classroom/default.jpg',
                urlResizeType: 'none',
                articleWidth: window.innerWidth - 24 * 2,
                WINDOW_HEIGHT: window.innerHeight,
                isYojiangApp: false,
                imgBigCheck: true,
                aliossUrlPrefix: '',
                qiniuUrlPrefix: '',
                tencentUrlPrefix: '',
            };
            this.defOpts = extend(defOpts, options, true);
            this.element = element;
            this.finished = true;
            this.imageSizes = [];
            this.imageId = 0;
            this.placeHolders = false;
            this.imagesUrlList = [];
            this.imagesIndex = 0;

            // window.android.consoleLog('oldstrHtml: ' + strHtml);
            strHtml = this._processHtml(strHtml);
            window.android.consoleLog('newstrHtml: ' + strHtml);

            var _this = this;
            this.show(element, strHtml, function() {
                if (_this.placeHolders) {
                    _this.setupPlaceHolders();
                }
                _this.updateImages();
                _this.bindEvent();
                if (_this.defOpts.imgBigCheck) {
                    _this.imgBindBigCheckEvent();
                }
            });
        },
        _processHtml: function(html) { // 处理原来富文本 替换html的图片
            html = html.replace(/<img [^>]*style=['"]([^'"]+)[^>]*\/>/gi, (match, capture) => {
                // capture,返回每个匹配的字符串  match,返回img标签
                match = match.replace(`style="${capture}"`, '');
                return match;
            });

            html = html.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
                // capture,返回每个匹配的字符串  match,返回img标签
                const widthPattern = new RegExp('\\swidth=[\'"](.*?)[\'"]');
                const heightPattern = new RegExp('\\sheight=[\'"](.*?)[\'"]');
                const matchWidth = match.match(widthPattern);
                const matchHeight = match.match(heightPattern);
                // 图片链接list
                this.imagesUrlList.push(capture);

                if (!this.defOpts.ableLazyLoad) { // 不需要懒加载，不用替换默认图片
                    return match;
                }

                if (location.protocol == 'https:') {
                    match = match.replace('http://', 'https://');
                }

                if (matchWidth && matchHeight) {
                    const realWidth = matchWidth[1];
                    const realHeight = matchHeight[1];

                    const aWidth = Math.min(realWidth, this.defOpts.articleWidth);
                    const aHeight = Math.floor(realHeight * aWidth / realWidth);

                    match = match.replace(/\sheight=/, ` style="width: ${aWidth}px; height: ${aHeight}px; object-fit: cover;" height=`);
                    match = match.replace(/\ssrc=/, ` src="${this.defOpts.defaultLazyPic}" data-index="${this.imagesIndex}" lazy-src=`);
                    this.imagesIndex++;
                    return match;
                }

                return match;
            });

            this.finished = false;
            return html;
        },
        show: function(element, strHtml, callback) {
            element.innerHTML = strHtml;
            console.log('show: start');
            window.android.consoleLog('show: start');

            callback && callback();
        },
        updateImages: function() {

            // window.android.consoleLog('updateImages: ' + this.finished);
            if (this.finished) {
                return;
            }

            const lazySrcImgs = this.element.querySelectorAll('img[lazy-src]');
            const images = Array.from(lazySrcImgs);

            images && images.map((elem) => {
                const rect = elem.getBoundingClientRect();

                // window.android.consoleLog('updateImages: rect ' + elem.getAttribute('lazy-src') + ' ' + rect.top + ' - '+ this.defOpts.WINDOW_HEIGHT + yojiangAppCurY);
                if (rect.top <= this.defOpts.WINDOW_HEIGHT + yojiangAppCurY) {
                    if (getData(elem, 'loading')) {
                        return;
                    }

                    let lazySrc = elem.getAttribute('lazy-src');
                    getData(elem, 'loading', 1);

                    // 压缩图片的操作
                    const resizeWidth = elem.clientWidth || this.defOpts.articleWidth;
                    lazySrc = this.resizeUrl(lazySrc, resizeWidth);
                    console.log('updateImages: ', lazySrc);

                    elem.setAttribute('src', lazySrc);
                    elem.onload = function(){
                        elem.removeAttribute('lazy-src');
                        elem.removeAttribute('data-loading');
                        elem.removeAttribute('class');
                    };
                }
            });

            if (images.length === 0) {
                this.finished = true;
                var _this = this;
                if (!this.defOpts.isYojiangApp) {
                    window.removeEventListener('DOMContentLoaded', function() {
                        _this.updateImages();
                    });
                    window.removeEventListener('load', function() {
                        _this.updateImages();
                    });
                    window.removeEventListener('resize', function() {
                        _this.updateImages();
                    });
                    window.removeEventListener('scroll', function() {
                        _this.updateImages();
                    });
                }
            }
        },
        bindEvent: function() {
            //滑动加载图片
            var _this = this;
            if (this.defOpts.isYojiangApp && this.defOpts.ableLazyLoad) {
                window.lazyImageShowAt = (posY, winHight) => {
                    if (winHight) {
                        _this.defOpts.WINDOW_HEIGHT = parseInt(winHight);
                    }
                    posY = parseInt(posY);
                    // window.android.consoleLog('lazyImageShowAt: ' + posY + ' - '+ winHight +' - ' + yojiangAppCurY);
                    if (posY >= yojiangAppCurY) {
                        yojiangAppCurY = posY;
                        // window.android.consoleLog('yojiangAppCurY: ' + yojiangAppCurY);
                        _this.updateImages();
                    }
                }
            } else if (this.defOpts.ableLazyLoad) {
                window.addEventListener('DOMContentLoaded', function() {
                    _this.updateImages();
                });
                window.addEventListener('load', function() {
                    _this.updateImages();
                });
                window.addEventListener('resize', function() {
                    _this.updateImages();
                });
                window.addEventListener('scroll', function() {
                    _this.updateImages();
                });
            }
        },
        imgBindBigCheckEvent: function() {
            const imgElementList = this.element.querySelectorAll('img');
            const imgElements = Array.from(imgElementList);
            const _this = this;

            imgElements && imgElements.map((elem, index) => {
                elem.addEventListener('click', function(e) {
                    var postMsgData = {
                        list: _this.imagesUrlList,
                        index: index,
                        curUrl: _this.imagesUrlList[index],
                    }
                    console.log(postMsgData);
                    if (_this.defOpts.isYojiangApp && isIos()) {
                        window.webkit.messageHandlers.checkBigPicture.postMessage(JSON.stringify(postMsgData));
                    } else if (_this.defOpts.isYojiangApp && isAndroid()) {
                        window.android.checkBigPicture(JSON.stringify(postMsgData));
                    }
                });
            });
        },
        resizeUrl: function(url, resizeWidth) {
            if (this.defOpts.urlResizeType === 'oss' ||
                (this.defOpts.aliossUrlPrefix && this.defOpts.urlResizeType === 'auto' && url.indexOf(this.defOpts.aliossUrlPrefix) > -1)) {
                return url + '?x-oss-process=image/resize,w_' + resizeWidth;
            } else if (this.defOpts.urlResizeType === 'qiniu' ||
                (this.defOpts.qiniuUrlPrefix && this.defOpts.urlResizeType === 'auto' && url.indexOf(this.defOpts.qiniuUrlPrefix) > -1)) {
                return url + '?imageView2/2/w/' + resizeWidth;
            } else if (this.defOpts.urlResizeType === 'tencent' ||
                (this.defOpts.tencentUrlPrefix && this.defOpts.urlResizeType === 'auto' && url.indexOf(this.defOpts.tencentUrlPrefix) > -1)) {
                return url + '?imageView2/2/w/' + resizeWidth;
            } else {
                return url
            }
        },
    };

    // 最后将插件对象暴露给全局对象
    window.strHtmlLazyload = strHtmlLazyload;
})()







