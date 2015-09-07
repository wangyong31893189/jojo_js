//define(function(require, exports, module) {
	var HP={
		getDomain:function(protocol){
			if(!protocol){
				protocol=window.location.protocol;
			}
			var host=window.location.host;
			if(!host){
				host=document.domain;
			}
			if(protocol.indexOf("file:")!=-1||/^\d+\.\d+\.\d+\.\d+(:?\d*?)$/.test(host)){
				return "http://10.48.194.131:8888";
			}else if(protocol=="true"){
				return host;
			}else{
				return protocol+"//"+host;
			}
		},
		//模仿active
		onActive: function(tag){
			if(!tag) tag = "button,li";
				var tag_obj = tag.split(","),tag_len = tag_obj.length ;
			for(var m=0;m<tag_len;m++){
			  	var target_obj = HPcommon.prototype.$("<"+tag_obj[m]+">") ,
			    target_len = target_obj.length ;
			  	for(var n=0;n<target_len;n++){ all_active(target_obj[n]) };	  
			};			  
			function all_active(obj){
			  	var change_target = "mousedown".split(" || ") ;
				for(var i=0;i<change_target.length;i++){
				  	obj.addEventListener(change_target[i], function () {  
					  	var class_obj = this.className=="active"?"":this.className.replace(" active","");
					  	this.className =  class_obj ? class_obj + " active":"active";
				  	}, false);
			  	};
			  
			  	var leave_target = "mousemove || mouseup".split(" || ") ;
			  	for(var j=0;j<leave_target.length;j++){
				  	obj.addEventListener(leave_target[j], function () {  
						setTimeout(function(){
							var class_obj = obj.className=="active"?"":obj.className.replace(" active","");
							obj.className =  class_obj ? class_obj:"";
						},200);
					}, false);
				}
			}
		},
		getChannelStyleNew:function(url,params,callback,title){
			var that=this;
			var channelCode=params.channelCode;
			// var appCode=params.appCode; //应用名称			
			var pageCode=params.pageCode;//不同页面头部代码
			var isHeaderReplace=params.isHeaderReplace;//头部是否有文件结构替换  true使用  false不使用
			var isAppStyle=params.isAppStyle;//是否需要应用样式 true使用  false不使用
			
			var isloadNavigate = params.isloadNavigate;
			if(!pageCode){
				pageCode="";
			}			
			if(!isAppStyle&&isAppStyle!=false){
				isAppStyle=true;
			}
			if(!isHeaderReplace&&isHeaderReplace!=false){
				isHeaderReplace=true;
			}
			if(!channelCode){
				console.error("请传入对应的渠道代码！");
				return;
			}
			if(!isloadNavigate&&isloadNavigate!=false){
				isloadNavigate=true;
			}
			/*if(isAppStyle){
				if(URL.defaultStyle){
					HP.loadRes(URL.defaultStyle,function(){
						HP.loadRes(url,function(){
							document.body.style.visibility="visible";					
						});					
					});
				}				
			}else{
				HP.loadRes(URL.defaultStyle,function(){
					document.body.style.visibility="visible";					
				});
			}*/
			var data={"title":title};
			var head=HP.$('head');
			if(isHeaderReplace){//头部文件是否需要替换
				//require.async("../fxtpl/fxtpl.plus",function(){
					if(pageCode){
						channelCode=channelCode+"_"+pageCode;
					}
					//渲染外部文件
					var html = Fxtpl.compile(HP.ajaxLoadSynData("navigate/"+channelCode+".html"),data);
					if(!html){
						html = Fxtpl.compile(HP.ajaxLoadSynData("navigate/default.html"),data);
					}
					//渲染后的html插入当前页面
					if(head){
						head.className="com-head";
						head.innerHTML=html;
						head.style.display="block";
						head.style.visibility="visible";
					}
					//执行js
					if(html){
						that.runScript(html);
					}
				//});
			}else{
				if(head){
					head.className="com-head";
					head.style.display="block";
					head.style.visibility="visible";
				}
			}
			//执行回调函数
			if(callback){
				callback();
			}
		},
		runScript: function(msg) {
            if (msg) {
                var start = msg.indexOf("<script>");
                if (start != -1) {
                    var end = msg.indexOf("<\/script>");
                    var scr = msg.substring(start + 8, end);
                    eval(scr);
                }
            }
		},
		getParams:function(key,url){//获取链接 ？号问后面的参数   获取页面传入参数集合
			var paramsStr=window.location.search;
			if(url){
				if(url.indexOf("?")!=-1){
					paramStr=url.substring(url.indexOf("?")+1,url.length);
				}else{
					paramStr="";
				}				
			}
			var paramsJsonStr="{";
			if(paramsStr){
				paramsStr=paramsStr.substring(1,paramsStr.length);
				var paramsStrs=paramsStr.split("&");
				for(var i=0,len=paramsStrs.length;i<len;i++){
					var paramValues=paramsStrs[i].split("=");
					var paramValueLength=paramValues.length;
					var secondParam=[];
					if(paramValueLength<2){
						continue;
					}else{
						var value=paramValues[1];
						if(paramValueLength>2){
							for (var j = 1; j < paramValueLength; j++) {
								if(j==paramValueLength-1){
									secondParam.push(paramValues[j]);
								}else{
									secondParam.push(paramValues[j]+"=");
								}
							}
							value=secondParam.join("");
						}
						if(i==len-1){
							str="\""+paramValues[0]+"\":\""+value+"\"";
						}else{
							str="\""+paramValues[0]+"\":\""+value+"\",";
						}
						paramsJsonStr+=str;
					}
				}
			}
			paramsJsonStr+="}";
			var paramsJson=(new Function("return "+paramsJsonStr+""))();
			if(key){
				return paramsJson[key];
			}
			return paramsJson;
		},
		loadDymaticMsg:function(id,url,params){//url="http://dsafsdafs"  params={"a":xxx,"b":""};	
			var domain = HP.getDomain();
			var options={"url":domain+"/drift/gcms/"+domain.substr(7,domain.length)+url};		
			options.params=params;
			function loopLoadJs(objs,index,jsReg){
				var len=objs.length;
				if(index<len){
					var jsStr=objs[index].replace(jsReg,"$2");
					index++;
					HP.loadRes(jsStr,function(){
						loopLoadJs(objs,index,jsReg);
					});
				}
			}
			options.success=function(html){//回调执行      <script>   </script>
				if(html){
					HP.$(id).innerHTML=html;
					var jsReg=/<script(.*?)src=\"([^\"]*?)\">/gi;
					var cssReg=/<link(.*?)href=\"([^\"]*?)\"\/?>/gi;
					var cssArr=html.match(cssReg);
					//console.log(cssArr);
					if(cssArr){
						var len=cssArr.length;
						for(var i=0;i<len;i++){
							var cssStr=cssArr[i].replace(cssReg,"$2");
							//console.log(cssStr);
							HP.loadRes(cssStr);
						}
					}
					var jsArr=html.match(jsReg);
					//console.log(jsArr);
					if(jsArr){
						/*var len=jsArr.length;
						for(var i=0;i<len;i++){
							var jsStr=jsArr[i].replace(jsReg,"$2");
							//console.log(jsStr);
							seajs.use(jsStr,function(){
								
							});
						}*/
						loopLoadJs(jsArr,0,jsReg);
					}
					var templates=document.querySelectorAll(".cms_template");
					if(templates){
						for(var i=0,len=templates.length;i<len;i++){
							templates[i].style.visibility="visible";
						}
					}					
				}		
				
				/*if(callfunc){
					callfunc();
				}	*/				
			};
			/*
			options.error=function(){
				var callfunc = params.callfunc;
				if(callfunc){
					callfunc();
				}
			};*/
			
			HP.ajaxLoadData(options);
		},
		showMsg:function(type,msg,modeType,timestamp){
			//require.async("./Message",function(Message){
				Message.show(type,msg,modeType,timestamp);
			//});
		},
		clear:function(){
			//require.async("./Message",function(Message){
				if(Message)
				   Message.clear();
			//});
		
		},
		winSize: function(nums) {
			if (!nums) {
				nums = 0
			}
			if (window.innerWidth) {
				winWidth = window.innerWidth
			} else {
				if ((document.body) && (document.body.clientWidth)) {
					winWidth = document.body.clientWidth
				}
			}
			if (window.innerHeight) {
				winHeight = window.innerHeight
			} else {
				if ((document.body) && (document.body.clientHeight)) {
					winHeight = document.body.clientHeight
				}
			}
			if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
				winHeight = document.documentElement.clientHeight;
				winWidth = document.documentElement.clientWidth
			}
			if (nums == 1) {
				return winWidth
			} else {
				if (nums == 0) {
					return winHeight
				} else {
					alert("参数只能是1或者0,(1是高度/0是宽度)")
				}
			}
		},
		getBase64Encode:function(){
			//var Base64Encode=require("./Base64Encode");
			return Base64Encode;
		},
		getStorage:function(){
			//var StorageManager=require("./localStorageManager");
			return StorageManager;
		},
		getSlider:function(){
			//return require("./slider");
			return Slider;
		},
		ajaxLoadData:function(options){
			if(!options.data){
				options.data=options.params;
			}
			var storage=this.getStorage();
			var storage=storage.getStorage("LOCAL");
			var dataType=options.dataType;
			if(storage.getItem("single_app")=="true"){
				//url=HP.getDomain()+"/basic/mobile/js/source/iphone/mobileOrder.json";
				options.dataType="jsonp";
			}
			//require.async("./seaAjax",function($){
				handpay.ajax.request(options.url,options);
			//});
		},
		ajaxLoadSynData:function(url){//同步请求数据
			var options={};
			options.async=false;
			var html="";
			//var $=require("./seaAjax");
			var $=handpay.ajax;
			options.success=function(data){
				//alert(data);
				html=data;
			};
			$.request(url,options);
			return html;
		},
		$:function(id){
			return document.getElementById(id);
		},
		$query:function(selector){
			return document.querySelector(selector);
		},
		$queryAll:function(selector){
			return document.querySelectorAll(selector);
		},
		loadRes:function(url,callback){
			var href=url;
			if(url.indexOf("http://")==-1){			
				var protocol =HP.getDomain();
				var obj="";
				href=protocol+url;			
			}
			if(url.indexOf(".css")!=-1){
				var obj = document.createElement("link");
				obj.rel="stylesheet"; 
				obj.type="text/css"; 
				obj.href=href;			
			}else{
				var obj = document.createElement("script");
				obj.src = href;
				obj.defer=true;
			}
			obj.onerror=obj.onabort=function(){
				document.body.style.visibility="visible";
				if(callback){
					callback();
				}
				var app_content=HP.$("app_content");
				if(app_content){
					app_content.style.visibility="visible";
				}
			};
			obj.onload = obj.onreadystatechange = function( _, isAbort) {
                //if ( isAbort || !obj.readyState || /loaded|complete/.test( obj.readyState ) ) {
                    document.body.style.visibility="visible";
					if(callback){
						callback();
					}
					var app_content=HP.$("app_content");
					if(app_content){
						app_content.style.visibility="visible";
					}
                //}
            };
			document.getElementsByTagName("head")[0].appendChild(obj);		
		},
		loadBaiduScript:function(){//加载百度信息
			//<script src="http://kxlogo.knet.cn/seallogo.dll?sn=e14112431010156367dcox000000&size=0"></script>
			var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
			var scriptObj = document.createElement("script");
			scriptObj.src = _bdhmProtocol+"hm.baidu.com/h.js?6a51eab8cbeead7b9b9e3be74778cb80";
			//scriptObj.type = "text/javascript";
			//scriptObj.async="async";
			scriptObj.defer=true;
			//scriptObj.id   = id;
			document.getElementsByTagName("head")[0].appendChild(scriptObj);
		},
		validate:function(value,type){
			var options={
							"require" : /.+/,//是否为空
						    "email" : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,//电子邮件
						    "phone" : /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/,//电话号码
						//Mobile : /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/,
						//Mobile : /^((\(\d{3}\))|(\d{3}\-))?13|((\(\d{3}\))|(\d{3}\-))?15\d{9}$/,
						    "mobile" : /^1\d{10}$/,//手机号码
							"mobile3": /^1\d{6,10}$/,//手机号码
						    "mobile2" : /^(13\d{9})|(14\d{9})|(15\d{9})|(18\d{9})$/,//手机号码
							"mobile4":/^(0|1)/,//匹配0或者1开头 手机和固话开头
							"mobile5":/^[1][0-9]{0,10}$/,//手机号码文本框“输入时” 验证  或可以在输入时键盘抬起时验证的事件， 开头只能为1，第2位到第11位是数字可以填写也可不填写
							"fixQuhao":/^0\d{2,3}$/,//匹配固话区号
							"fixHaoma":/^\d{7,8}$/,//匹配固话号码
							"quhao_reg_3":/^0((10)|(2[0-9]))$/,//3位区号验证
							"quhao_reg_4":/^0[^012][0-9]{2}$/,//4位区号验证
						    "letternumber" : /^[A-Za-z0-9]+$/,//字母与数字组合
						    "warAccount" : /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,//字母与数字组合
						    "url" : /^https?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,//网址
						    "idcard" : /^\d{15}(\d{2}[A-Za-z0-9])?$/,//身份证号码
						    "currency" : /^\d+(\.\d+)?$/,//货币金额
						    "number": /^[1-9]\d*$/,//数字
						    "password_99":/^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z0-9]{6,15}$/,//99无限用户密码格式  请设置6-15位字母和数字组合，字母区分大小写
						    "userName_99":/^[0-9a-zA-Z]{6,20}$/,//99无限用户名格式  请输入4-20位数字或字母组成的用户名
						    "zip" : /^[1-9]\d{5}$/,//邮政编码（国内）
						    "qq" : /^[1-9]\d{4,14}$/,//QQ
						    "integer" : /^[-\+]?\d+$/,//整数
						    "double": /^[-\+]?\d+(\.\d+)?$/,//小数
						    "english" : /^[A-Za-z]+$/,//英文字符
						    "chinese" : /^[\u0391-\uFFE5]+$/,//中文字符
						    "unsafe" : /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,//不符合安全规则的密码		}
				}
			return options[type].test(value);
	}
	};
//	module.exports = HP;
//});

