/*
 *
 * Copyright 2005-2015 All Rights Reserved 上海瀚银信息技术有限公司.
 *
 * path: seaAjax.js
 * author: eric_wang
 * date: 2014/10/22
 */

/*define(function(require,exports,module){*/

    var handpay=handpay||{"version":"v.1.0.0"};

    /**
     * @namespace handpay.ajax 对XMLHttpRequest请求的封装
     * @property success 请求失败的全局事件，function(String responseText,XMLHttpRequest xhr)
     * @property error 请求失败的全局事件，function(XMLHttpRequest xhr)
     * @property before 请求发送前触发的全局事件，function(XMLHttpRequest xhr)
     */
    handpay.ajax = handpay.ajax || {};

    /**
     * 发送一个ajax请求
     * @name handpay.ajax.request
     * @function
     * @grammar handpay.ajax.request(url[, options])
     * @param {string}  url 发送请求的url
     * @param {Object}  [options] 发送请求的选项参数
     * @config {String}     [method]            请求发送的类型。默认为GET
     * @config {String}     [dataType]            请求发送的类型。默认为GET
     * @config {Boolean} [async]            是否异步请求。默认为true（异步）
     * @config {Boolean} [cacheable]            是否缓存请求。默认为true（缓存）
     * @config {String}     [data]              需要发送的数据。
     * @config {Object}  [headers]           要设置的http request header
     * @config {String}     [username]          用户
     * @config {String}     [password]          密码
     * @config {Function} [success]       请求成功时触发，function(string responseText，XMLHttpRequest xhr)
     * @config {Function} [error]        请求失败时触发，function(XMLHttpRequest xhr)
     * @config {Function} [before]   发送请求之前触发，function(XMLHttpRequest xhr)
     * @config {Boolean} [noCache]          是否需要缓存，默认为true（缓存）
     * @meta standard
     * @see handpay.ajax.get,handpay.ajax.post,handpay.ajax.form
     *
     * @returns {XMLHttpRequest} 发送请求的XMLHttpRequest对象
     */
    handpay.ajax.request=function(url,options){
        options = options || {};
        var data = options.data || "";
        var async = !(options.async === false);// 是否异步请求。默认为true（异步）
        var cacheable = !(options.cacheable === false);
        var username = options.username || "";
        var password = options.password || "";
        var method = (options.type || "GET").toUpperCase();
        var dataType = (options.dataType || "HTML").toUpperCase();
        var headers = options.headers || {};
        var success = options.success || "";
        var error = options.error || "";
        var before = options.before || "";
        var jsonp=options.jsonp || "jsonpcallback";  //jsonp的函数名称
        var jsonpCallback=options.jsonp||"";
        var charset=options.charset||"UTF-8";
        var timeout=options.timeout||40000;//默认超时40秒
        var xhr;

        /**HTML转义
         * @param {string} [str]  需要转义的字符串
         */
        function escape(str){
            return str
                .replace(/&/g,'&amp;')
                .replace(/</g,'&lt;')
                .replace(/>/g,'&gt;')
                .replace(/"/g,'&quot;')
                .replace(/'/g,'&#39;');
        }

        function firedEvent(callback){
            switch(dataType){
                case "TEXT":
                    if(callback){
                        callback(escape(xhr.responseText),xhr);
                    }
                    break;
                case "JSON":
                    if(callback){
                        callback(parseJson(xhr.responseText),xhr);
                    }
                    break;
                case "HTML":
                default:
                    if(callback){
                        callback(xhr.responseText,xhr);
                    }
            }
        }

        function parseJson(str){
            if(typeof(str)==="object"){
                return str;
            }
            if(JSON){
                try{
                    return JSON.parse(str);
                }catch(e){
                    return (new Function("return "+str))();
                }
            }else{
                return (new Function("return "+str))();
            }
        }

        //状态报告
        function reportStatus(){
            if (xhr.readyState == 4) {
                var stat = xhr.status;
                if (stat == 200) {
                    firedEvent(success);
                } else {
                    // http://www.never-online.net/blog/article.asp?id=261
                    // case 12002: // Server timeout
                    // case 12029: // dropped connections
                    // case 12030: // dropped connections
                    // case 12031: // dropped connections
                    // case 12152: // closed by server
                    // case 13030: // status and statusText are unavailable

                    // IE error sometimes returns 1223 when it
                    // should be 204, so treat it as success
                    if ((stat >= 200 && stat < 300)
                        || stat == 304
                        || stat == 1223) {
                        firedEvent(success);
                    } else {
                        if(error){
                            error(xhr.responseText,xhr);
                        }
                    }

                    /*
                     * NOTE: Testing discovered that for some bizarre reason, on Mozilla, the
                     * JavaScript <code>XmlHttpRequest.onreadystatechange</code> handler
                     * function maybe still be called after it is deleted. The theory is that the
                     * callback is cached somewhere. Setting it to null or an empty function does
                     * seem to work properly, though.
                     *
                     * On IE, there are two problems: Setting onreadystatechange to null (as
                     * opposed to an empty function) sometimes throws an exception. With
                     * particular (rare) versions of jscript.dll, setting onreadystatechange from
                     * within onreadystatechange causes a crash. Setting it from within a timeout
                     * fixes this bug (see issue 1610).
                     *
                     * End result: *always* set onreadystatechange to an empty function (never to
                     * null). Never set onreadystatechange from within onreadystatechange (always
                     * in a setTimeout()).
                     */
                    window.setTimeout(
                        function() {
                            // 避免内存泄露
                            xhr.onreadystatechange = new Function();
                            if (async) {
                                xhr = null;
                            }
                        }, 0);
                }
            }
        }

        /**
         * 获取XMLHttpRequest对象
         *
         * @ignore
         * @return {XMLHttpRequest} XMLHttpRequest对象
         */
        function getXHR() {
            if (window.ActiveXObject) {
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    try {
                        return new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (e) {}
                }
            }
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }
        }

        //execute ajax request
        function executeXhr(callback) {
            xhr=getXHR();            
            //
            var urlWithParam = url.split("?");//split the url in two parts
            var urlPrefix = urlWithParam[0];//the url
            var arg = urlWithParam[1];//the arguments

            if(method == "POST") {//若为post请求提交则修改url值
                url=urlPrefix;
            }

            if (username) {
                xhr.open(method, url, async, username, password);
            } else {
                xhr.open(method, url, async);
            }

            if (async) {
            	if(timeout){
                	xhr.timeout=timeout;
                }
                xhr.onreadystatechange = callback;
            }
            xhr.ontimeout=function(){
            	if(error){
                    error("网络连接超时！",xhr);
                }
            };
            if(cacheable){
                try{
                    xhr.setRequestHeader("Cache-Control","max-age=7200");
                    //xhr.setRequestHeader("Connection","close");
                } catch(e){}
            }else{
                try{
                    xhr.setRequestHeader("Cache-Control","no-store, no-cache, must-revalidate");
                    //xhr.setRequestHeader("Connection","close");
                } catch(e){}
            }
            xhr.setRequestHeader("Access-Control-Allow-Headers","X-Requested-With");
            xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    xhr.setRequestHeader(key, headers[key]);
                }
            }

            if(before){
                before.call(this,xhr);
            }

            if(method == "POST") {
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                xhr.send(arg);
            } else {
                xhr.send();
            }

            if (!async) {
                if(callback){
                    callback.call(this);
                }
            }
        }

        function loadScript(callback){
            var head = document.head ||document.getElementsByTagName("head")[0]|| document.documentElement;
            var script = document.createElement("script");
            script.async = true;
            //if ( s.scriptCharset ) {
            script.charset = charset;
            //}

            script.src =url;


            // Attach handlers for all browsers
            script.onload = script.onreadystatechange = function( _, isAbort) {

                if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;

                    // Remove the script
                    if ( script.parentNode ) {
                        script.parentNode.removeChild( script );
                    }

                    // Dereference the script
                    script = null;

                    // Callback if not abort
                    if ( !isAbort ) {

                    }else{
                        if(error){
                            error();
                        }
                    }
                }
            };

            if(before){
                jsonpFired(before);
            }

            if(success){
                jsonpFired(success);
            }
            // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
            // Use native DOM manipulation to avoid our domManip AJAX trickery
            head.insertBefore( script, head.firstChild );
            //}
        }

        //jsonp 数据获取
        function jsonpFired(callback){
            //console.log(" window."+jsonpCallback+"=function(data){data=(new Function('return data'))();callback(data)}");
            var fired=new Function("callbackfunction","parseJsonFun"," window."+jsonpCallback+"=function(data){data=parseJsonFun(data);callbackfunction(data);}");
            fired(callback,parseJson);
        }


        (function(){
            var callback = reportStatus;//default alert
            if(data||dataType==="JSONP"){
                if(url.indexOf("?")==-1){
                    url=url+"?";
                }else{
                    url+="&";
                }
                if(dataType==="JSONP"){
                    if(!jsonpCallback){// jsonpCallback 参数为空或者没传的时候 重新生成函数名称
                        jsonpCallback="handpayAjax"+(new Date().getTime());
                    }
                    url+=jsonp+"="+jsonpCallback+"&";
                }
                if(data){
                    try{
                        if(typeof(data)==="object"){ //如果data参数是json对象 就转为参数的链式结构
                            for(var i in data){
                                if(data.hasOwnProperty(i)){
                                    url+=i+"="+data[i]+"&";
                                }
                            }
                            if(!cacheable){
                                url+="t"+(new Date().getTime())+"=v1&";
                            }
                            url=url.substring(0,url.length-1);
                        }

                    }catch(e){
                        return null;
                    }
                }
            }
            /*encode URL with Chinese*/
            url = encodeURI(url);
            //alert(url);
            //execute the remote method
            if(dataType==="JSONP"){
                loadScript(callback);
            }else{
                executeXhr(callback);
            }
        })();
    };


    /**
     * 发送一个post请求
     * @name handpay.ajax.post
     * @function
     * @grammar handpay.ajax.post(url, data[, onsuccess])
     * @param {string}  url         发送请求的url地址
     * @param {string}  data        发送的数据
     * @param {Function} [onsuccess] 请求成功之后的回调函数，function(XMLHttpRequest xhr, string responseText)
     * @meta standard
     * @see handpay.ajax.get,handpay.ajax.request
     *
     * @returns {XMLHttpRequest}    发送请求的XMLHttpRequest对象
     */
    handpay.ajax.post = function (url, data, success) {
        var options={};
        options.method="POST";
        options.data=data;
        options.success=success;
        return handpay.ajax.request(
            url, options
        );
    };




    /**
     * 发送一个get请求
     * @name handpay.ajax.get
     * @function
     * @grammar handpay.ajax.get(url[, onsuccess])
     * @param {string}  url         发送请求的url地址
     * @param {Function} [success] 请求成功之后的回调函数，function(string responseText,XMLHttpRequest xhr)
     * @meta standard
     * @see handpay.ajax.post,handpay.ajax.request
     *
     * @returns {XMLHttpRequest}    发送请求的XMLHttpRequest对象
     */
    handpay.ajax.get = function (url,data,success) {
        var options={};
        options.method="GET";
        options.data=data;
        options.success=success;
        return handpay.ajax.request(url,options);
    };

    /**
     * 将一个表单用ajax方式提交
     * @name handpay.ajax.form
     * @function
     * @grammar handpay.ajax.form(form[, options])
     * @param {HTMLFormElement} form             需要提交的表单元素
     * @param {Object}  [options]                   发送请求的选项参数
     * @config {Boolean} [async]            是否异步请求。默认为true（异步）
     * @config {String}     [username]          用户
     * @config {String}     [password]          密码
     * @config {Object}     [headers]           要设置的http request header
     * @config {Function} [replacer]            对参数值特殊处理的函数,replacer(string value, string key)
     * @config {Function} [before]     发送请求之前触发，function(XMLHttpRequest xhr)
     * @config {Function} [success]        请求成功时触发，function(string responseText，XMLHttpRequest xhr)
     * @config {Function} [error]        请求失败时触发，function(XMLHttpRequest xhr)

     * @see handpay.ajax.request
     *
     * @returns {XMLHttpRequest} 发送请求的XMLHttpRequest对象
     */
    handpay.ajax.form = function (form, options) {
        options = options || {};
        var elements    = form.elements,
            len         = elements.length,
            method      = form.getAttribute('method'),
            url         = form.getAttribute('action'),
            replacer    = options.replacer || function (value, name) {
                    return value;
                },
            sendOptions = {},
            data = [],
            i, item, itemType, itemName, itemValue,
            opts, oi, oLen, oItem;

        /**
         * 向缓冲区添加参数数据
         * @private
         */
        function addData(name, value) {
            data.push(name + '=' + value);
        }

        // 复制发送参数选项对象
        for (i in options) {
            if (options.hasOwnProperty(i)) {
                sendOptions[i] = options[i];
            }
        }

        for (i = 0; i < len; i++) {
            item = elements[i];
            itemName = item.name;

            // 处理：可用并包含表单name的表单项
            if (!item.disabled && itemName) {
                itemType = item.type;
                itemValue = item.value;

                switch (itemType) {
                    // radio和checkbox被选中时，拼装queryString数据
                    case 'radio':
                    case 'checkbox':
                        if (!item.checked) {
                            break;
                        }

                    // 默认类型，拼装queryString数据
                    case 'textarea':
                    case 'text':
                    case 'password':
                    case 'hidden':
                    case 'select-one':
                        addData(itemName, replacer(itemValue, itemName));
                        break;

                    // 多行选中select，拼装所有选中的数
                    case 'select-multiple':
                        opts = item.options;
                        oLen = opts.length;
                        for (oi = 0; oi < oLen; oi++) {
                            oItem = opts[oi];
                            if (oItem.selected) {
                                addData(itemName, replacer(oItem.value, itemName));
                            }
                        }
                        break;
                }
            }
        }

        // 完善发送请求的参数选项
        sendOptions.data = data.join('&');
        sendOptions.method = form.getAttribute('method') || 'POST';

        // 发送请
        return handpay.ajax.request(url, sendOptions);
    };
    /*module.exports=handpay.ajax;
});*/