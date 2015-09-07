/********************************/
/**** update:2014-02-09 16:25  ****/   //如有改动请修改这里的信息
/**** by: eric_wang       
页面loading      ****/
/********************************/
// define(function(require, exports, module) {
	var game_loading={
		completeLoading:function (){
			if (document.readyState == "complete") {
				var load_div=document.getElementById("load_div");
				if(load_div){
					load_div.style.display="none";
				}
			}
		},
		init:function(){
			var that=this;
			that.initLoading();
			document.onreadystatechange =function(){
				that.completeLoading();
			}			
		},
		initLoading:function () {
			var div=document.createElement("div");
			div.setAttribute("id","load_div");
			div.setAttribute("class","loader");
			document.body.style.visibility="visible";
			document.body.appendChild(div);
			setTimeout(function(){				
				if(div){
					div.parentNode.removeChild(div);
				}
			},2000);
		},
		hide:function(){
			var obj=document.getElementById("load_div");
			if(obj){
				obj.style.display="none";
			}
		}
	}
	game_loading.init();
// 	module.exports  = game_loading;
// });