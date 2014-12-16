/********************************/
/********************************/
define(function(require, exports, module) {
var ajax=require("./seaAjax");
function loadData(){		
		var cityList=document.getElementById("city_list");
		cityList.innerHTML="loading...";
		/*handpay.ajax.get("city.json",{},function(msg,obj){
			
			console.log(msg+"--"+obj);
			cityList.innerHTML="loading success...";
		
		});
*/		
		ajax.request("city_jsonp.json",{success: function(msg,obj){
			
			console.log(msg+"--"+obj);
			cityList.innerHTML="loading success...";
		
		},
		dataType :"jsonp",
		charset:"GBK",
		jsonp: "jsonpCallback",
		jsonpCallback: "jsonpCallback"});
	
	}
	
	loadData();

});