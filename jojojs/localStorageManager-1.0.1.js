//define(function(require, exports, module) {
	var StorageManager={
		getStorage:function(type,flag){//flag为only的时候不进行cookie存取
			if(type=="LOCAL"){			
				var supported = this.localStorageSupported("LOCAL");
				this.storage = supported ? window.localStorage :window.sessionStorage;
				if(!supported){
					supported = this.localStorageSupported("SESSION");					
					this.storage = supported ? window.sessionStorage :new ShowCookie(flag);
				}
			}else if(type=="SESSION"){
				supported = this.localStorageSupported("SESSION");
	  			this.storage = supported? window.sessionStorage :new ShowCookie(flag);
			}else{
				this.storage=new ShowCookie();
			}
			if(!this.storage){
				this.storage=new ShowCookie();
			}
			return this.storage;
		},
		localStorageSupported:function (type) {
		    var testKey = "test";
		    var storage=null;
		    if(type=="LOCAL"){		
				storage = window.localStorage;
			}else{
	  			storage = window.sessionStorage;
			}
			if(!storage){
				return false;
			}
			try {
				storage.setItem(testKey, "1");
				storage.removeItem(testKey);
				return true;
			} catch (e) {
				return false;
			}
			
		},
		getItemForObject:function(key,type,storageType){//键值key  type数据类型   storageType存储范围
			var storage=null;
			try{
				storage=this.getStorage(storageType);
			}catch(e){
				return null;
			}
			var temp=storage.getItem(key);
			if(!temp){
				return null;
			}
			if(!type){
				type="string";
			}
			var timestamp=null;
			if(temp.indexOf('"timestamp":')!=-1){
				temp=(new Function("return "+temp))();
				timestamp=temp.timestamp;
				var currentTime=new Date().getTime();
				if(storageType=="LOCAL"){
					if(timestamp){
						//temp=(new Function("return "+temp))();
						if(!temp){
							temp={};
						}
						if(timestamp<=currentTime){
							this.getStorage(storageType).removeItem(key);
							temp=null;
						}else{
							temp=temp.jsonObj;
						}
					}
				}
			}
			switch(type){
				case "json":
					if(!timestamp){
						temp=(new Function("return "+temp))();
						if(!temp){
							temp={};
						}
					}
					break;
				case "array":
					if(!timestamp){
						if(temp){
							temp=temp.split(",");
						}
					}
				break;
				case "integer":
				case "double":
				case "float":
				case "string":
					break;
				default:
			}
			return temp;
		},
		setItemForObject:function(key,obj,type,storageType,time){//键值key  type数据类型   obj 保存的数据对象  storageType存储范围
			var storage=null;
			try{
				storage=this.getStorage(storageType);
			}catch(e){
				return null;
			}
			var temp="";
			if(!type){
				type="string";
			}
			var currentTime=new Date().getTime();
			var defaultTime=currentTime+24*60*60*1000;
			if(storageType=="LOCAL"){
				if(typeof(time)==="number"){
					time=currentTime+time;
				}else if(typeof(time)==="string"){//格式为2015-03-16 13:30:23
					var afterTime=new Date(time.replace("/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/","$1/$2/$3 $4:$5:6")).getTime();
					if(afterTime>currentTime){
						time=afterTime;
					}else{
						time=defaultTime;
					}
				}else{
					time=defaultTime;
				}
			}
			var tempObj={};
			switch(type){
				case "json":
					if(storageType=="LOCAL"){
						tempObj.timestamp=time;
						tempObj.jsonObj=obj;
						temp=JSON.stringify(tempObj);
					}else{
						temp=JSON.stringify(obj);
					}
					break;
				case "array"://暂只支持简单数组  如["1","2","3"]
					var str=obj.join(",");
					if(storageType=="LOCAL"){
						tempObj.timestamp=time;
						tempObj.jsonObj=str;
						temp=JSON.stringify(tempObj);
					}else{
						temp=str;
					}
					break;
				case "integer":
				case "double":
				case "float":
				case "string":
					if(storageType=="LOCAL"){
						tempObj.timestamp=time;
						tempObj.jsonObj=obj;
						temp=JSON.stringify(tempObj);
					}else{
						temp=obj;
					}
					break;
				default:
			}
			var hours="";
			if(time){
				hours=time/3600000;
			}
			this.getStorage(storageType).setItem(key,temp,hours);
		}
	};

	function ShowCookie(flag){//LOCAL,SESSION   //local是永久本地存储   session是会话级的本地存储
		this.getItem=function(key){
			if(flag=="only"){
				return "";
			}
			return this.getCookie(key);		
		};

		this.setItem=function(key,value,hour){
			if(flag!="only"){				
				this.addCookie(key,value,hour);
			}
		};

		this.removeItem=function(key){
			if(flag!="only"){	
				this.removeCookie(key);
			}
		};
	}
	
	ShowCookie.prototype.getCookie=function(objName){//获取指定名称的cookie的值
		var arrStr = document.cookie.split("; ");
		for(var i = 0;i < arrStr.length;i ++){
			var temp = arrStr[i].split("=");
			if(temp[0] == objName) return unescape(temp[1]);
	   }
	}

	ShowCookie.prototype.addCookie=function(objName,objValue,objHours){      //添加cookie
		var str = objName + "=" + escape(objValue);
		if(objHours&&objHours > 0){                               //为时不设定过期时间，浏览器关闭时cookie自动消失
			var date = new Date();
			var ms = objHours*3600*1000;
			date.setTime(date.getTime() + ms);
			str += "; expires=" + date.toGMTString();
	   }
	   document.cookie = str;
	}

	ShowCookie.prototype.removeCookie=function(name){//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
	   var date = new Date();
	   date.setTime(date.getTime() - 10000);
	   document.cookie = name + "=a; expires=" + date.toGMTString();
	}


//
//	module.exports  = StorageManager;
//});