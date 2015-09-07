/**
 * User: yongwang
 * Date: 12-01-17
 * Time: 上午9:54
 */
var CountDown=function(){
this.options = {

    //countdown元素id
    countId : '',

    //倒计时结束时请求的url
    endurl : '',

    //倒计时结束时的回调函数,用于处理页面倒计时元素的移除等操作
    endcallback : '',

    //销售开始倒计时是否结束
    isSellBeginEnd : false,
	//销售结束倒计时是否结束
    isSellEndEnd : false,
	
	//销售开始时间点
	sellBeginTimeStemp:null,
	
	//销售结束时间点
	sellEndTimeStemp:null,

    //结束时间点时间对象
    //endStemp : null,
	
	//开时时间对象
	//beginStemp:null,
	
	//输入的服务器当前时间对象
	currStemp:null,
	//销售开始倒计时时间结束点 以ms为单位
	countDownBeginStemp:0,//ms
	
	//销售结束倒计时时间结束点 以ms为单位
	countDownEndStemp:0,//ms
	
	type:0,//默认倒计时   1为商品销售倒计时  
	
	sellBeginTimerId:null,//销售开始时间定时器
	
	sellEndTimerId:null,//销售结束时间定时器
	
	goodsDetailUrl:"sj_detail01.html", //商品详情地址
	
	goodsBuyingUrl:"sj_detail01.html",  //商品抢购地址
	
	dataOptions:{lowestPrice:6330,//当前商品最低价
	dutchActions:[{		
		endTimeStemp:10000,//降价时间点
		cutPrice:22,//降价幅度
		prevPrice:6500,//上一次降价价格
		endPrice:6333//降价之后的价格
	},{
		endTimeStemp:5000,//降价时间点
		cutPrice:11,//降价幅度
		prevPrice:6333,//上一次降价价格
		endPrice:6322//降价之后的价格
	}]},
	
	index:0,//当前显示的数据索引号
	
	isRun:false,//是否第一次执行过降价显示
	
	dutchActionTimeStamp:null,//时时降开始计时时间  ms计算

	showTimeTimerId:null,
	
	isDutchEnd:false,//总倒计时已经结束
    /**
     * 初始化倒计时
     * @param currnt
     * @param end
     */
    init : function(o){
        this.countId = o.countId || 'CountDown';
        this.endurl = o.endurl || '';
        this.endcallback = o.endcallback || function(){return false;};
		// this.endStemp = o.endStemp?new Date(o.endStemp):null;
		//this.beginStemp=o.beginStemp?new Date(o.beginStemp):null;
		this.sellBeginTimeStemp=o.sellBeginTimeStemp?new Date(o.sellBeginTimeStemp):null;
		this.sellEndTimeStemp=o.sellEndTimeStemp?new Date(o.sellEndTimeStemp):null;
		this.currStemp=o.currStemp?new Date(o.currStemp):null;
		
		if(o.sellBeginTimeStemp){
			this.countDownBeginStemp=(this.sellBeginTimeStemp.getTime() - this.currStemp.getTime());
		}
		if(o.sellEndTimeStemp){
			this.countDownEndStemp=(this.sellEndTimeStemp.getTime() - this.currStemp.getTime());
		}
		this.type=o.type||0;
		this.projectImageUrl=o.projectImageUrl||"images/";
		this.goodsDetailUrl=o.goodsDetailUrl||"javascript:void(0)";
		this.goodsBuyingUrl=o.goodsBuyingUrl||"javascript:void(0)";
		this.dataOptions=o.dataOptions||this.dataOptions;
		var that=this;
		//that._renderDutchAuctionTime()
		this.showTimeTimerId=window.setInterval(function(){that._renderDutchAuctionTime();},1000);
        this._CountDownLoop();
		
    },

    /**
     * 倒计时循环
     * @private
     */
    _CountDownLoop : function(){		
       // var currStemp =new Date(this.currStemp.getTime()+this.countDownStemp);
        //console.log(currStemp);
        //如果结束时间戳减去当前时间时间戳小于等于0则设置倒计时结束标识为true
		//console.log(this.countDownBeginStemp);
        if(this.countDownBeginStemp<= 0){
            this.isSellBeginEnd = true;
			//window.clearTimeout(this.sellBeginTimerId);
        }
		if(this.countDownEndStemp<= 0){
            this.isSellEndEnd = true;
			//window.clearTimeout(this.sellBeginTimerId);
        }		
        //如果结束则调用结束回调
        if(this.isSellBeginEnd === true){
            //console.log('销售开始时间已经到了');
			if(this.isSellEndEnd===true){
				//console.log('销售结束时间已经到了');
				this._renderFullEnd.apply(this);
				return;
			}else{
				switch(this.type){
					case 1:
						this._renderSellEnd(this.countDownEndStemp);
						break;
					case 2:
						this._renderSellEnd(this.countDownEndStemp);
						break;
					case 3:
						this._renderSellEnd(this.countDownEndStemp);
						break;
					default:
						this._renderSellEnd(this.countDownEndStemp);
						break;
				}
			}
        }else{
			switch(this.type){
				case 1:
					this._renderSellerGoods(this.countDownBeginStemp);
					break;
				case 2:
					this._renderSellerGoods(this.countDownBeginStemp);
					break;
				case 3:
					this._renderSellerGoods(this.countDownBeginStemp);
					break;
				default:
					this._renderSellerGoods(this.countDownBeginStemp);
					break;
			}                     
        }
		//if(this.isSellEndEnd===true){
		if(this.isDutchEnd===true){//已经完全结束
			return;
		}
			var that=this;
			requestAnimation(function(){
				that._CountDownLoop();
			});
		//}
    },

    /**
     * 使用倒计时时间渲染倒计时元素
     * 
     */
    _render : function(countDownStemp){		
        var t = countDownStemp-1000;
        console.info(t/(1000*60*60)+"小时");
        // 总秒数  
    /*    var xt = parseInt(t/1000);
        // 秒数  
        var remain_sec = xt % 60;		 
		if (remain_sec < 10){
			remain_sec = "0" + remain_sec; 
		}
        xt = parseInt(xt/60);
        // 分数  
        var remain_minute = xt % 60;		
		if (remain_minute < 10){
			remain_minute = "0" + remain_minute;
		}		
        xt = parseInt(xt/60);
        // 小时数  
        var remain_hour = xt % 24;
		if (remain_hour < 10){
			remain_hour = "0" + remain_hour; 
		}		
        xt = parseInt(xt/24);
        // 天数  
        var remain_day = xt;
		if (remain_day < 10){
			remain_day = "0" + remain_day; 
		}   */
			var remain_hour=parseInt(t/(1000*60*60));
	var remain_minute=parseInt((t-(remain_hour*1000*60*60))/(1000*60));
	var remain_sec=parseInt((t-(remain_hour*1000*60*60)-(remain_minute*1000*60))/1000);   
    },
	
	 /**
     * 销售开始的倒计时
     * @private
     */
    _renderSellerGoods : function(){
		this.countDownBeginStemp=this.countDownBeginStemp-1000;		
        var t =this.countDownBeginStemp;
       //  console.info(t/(1000*60*60)+"小时");
      /*  // 总秒数  
        var xt = parseInt(t/1000);
        // 秒数  
        var remain_sec = xt % 60;		 
		if (remain_sec < 10){
			remain_sec = "0" + remain_sec; 
		}
        xt = parseInt(xt/60);
        // 分数  
        var remain_minute = xt % 60;		
		if (remain_minute < 10){
			remain_minute = "0" + remain_minute;
		}
		// console.info(remain_minute+"remain_minute分数 ");
		
        xt = parseInt(xt/60);
        // 小时数  
        var remain_hour = xt % 24;
        // console.info(xt+","+remain_hour+"remain_hour小时");
		if (remain_hour < 10){
			remain_hour = "0" + remain_hour; 
		}
		
        xt = parseInt(xt/24);
        // 天数  
        var remain_day = xt;
		if (remain_day < 10){
			remain_day = "0" + remain_day; 
		}
			
		remain_hour=remain_day*24+parseInt(remain_hour);*/
		var remain_hour=parseInt(t/(1000*60*60));
	var remain_minute=parseInt((t-(remain_hour*1000*60*60))/(1000*60));
	var remain_sec=parseInt((t-(remain_hour*1000*60*60)-(remain_minute*1000*60))/1000);
       //console.log(remain_day);
		var _countDownBack=document.getElementById("countDownBack"+this.countId);
		var _countDownText=document.getElementById("countDownText"+this.countId);
		var _imgShow=document.getElementById("imgShow"+this.countId);
		
		var _dutchAuctionTime=document.getElementById("dutchAuctionTime"+this.countId);
        _dutchAuctionTime.innerHTML="<font class=\"size18\">即将开始</font>";
		// console.log(_showObj.innerHTML);
		_countDownBack.className="tit2 mar_b15";
        _countDownText.innerHTML="即将开始&nbsp;"+remain_hour+"小时"+remain_minute+"分"+remain_sec+"秒";
		if(this.type==1){//type为2的时候是为还有机会的一种特殊情况
			var _buttonDetail=document.getElementById("buttonDetail"+this.countId);
			_buttonDetail.innerHTML="<a class=\"bnt02\" href=\""+this.goodsDetailUrl+"\">查看详情</a>";		
		}
		if(this.type==3){//type为3的时候是为即将开始
			var _buttonDetail=document.getElementById("buttonDetail"+this.countId);
			_buttonDetail.innerHTML="<a class=\"bnt05\" href=\""+this.goodsDetailUrl+"\">即将开始</a>";		
		}
		_imgShow.src=this.projectImageUrl+"ssj07.jpg";
		
    },
	
	//商品销售结束调用方法
	_renderSellEnd:function(){
		//alert(this);
		this.countDownEndStemp=this.countDownEndStemp-1000;
		var t = this.countDownEndStemp;		
    /*    // 总秒数  
        var xt = parseInt(t/1000);
        // 秒数  
        var remain_sec = xt % 60;		 
		if (remain_sec < 10){
			remain_sec = "0" + remain_sec; 
		}
        xt = parseInt(xt/60);
        // 分数  
        var remain_minute = xt % 60;		
		if (remain_minute < 10){
			remain_minute = "0" + remain_minute;
		}
		
        xt = parseInt(xt/60);
        // 小时数  
        var remain_hour = xt % 24;
		if (remain_hour < 10){
			remain_hour = "0" + remain_hour; 
		}
		
        xt = parseInt(xt/24);
        // 天数  
        var remain_day = xt;
        remain_hour=remain_day*24+parseInt(remain_hour);
		if (remain_day < 10){
			remain_day = "0" + remain_day; 
		}*/
			var remain_hour=parseInt(t/(1000*60*60));
	var remain_minute=parseInt((t-(remain_hour*1000*60*60))/(1000*60));
	var remain_sec=parseInt((t-(remain_hour*1000*60*60)-(remain_minute*1000*60))/1000);
       //console.log(remain_day);
		var _countDownBack=document.getElementById("countDownBack"+this.countId);
		var _countDownText=document.getElementById("countDownText"+this.countId);
		var _imgShow=document.getElementById("imgShow"+this.countId);
		if(this.type==1||this.type==3){////type为3的时候是为即将开始
			var _buttonDetail=document.getElementById("buttonDetail"+this.countId);
			_buttonDetail.innerHTML="<a class=\"bnt01\" href=\""+this.goodsBuyingUrl+"\">立即抢购</a>";
		}else if(this.type==4){//增加类型为4时 列表页变立即抢购为查看详情
			var _buttonDetail=document.getElementById("buttonDetail"+this.countId);
			_buttonDetail.innerHTML="<a class=\"bnt01\" href=\""+this.goodsBuyingUrl+"\">查看详情</a>";
		}
		
		_countDownBack.className="tit mar_b15";
        _countDownText.innerHTML="距离结束&nbsp;"+remain_hour+"小时"+remain_minute+"分"+remain_sec+"秒";
        //_dutchAuctionTime.innerHTML="<em class=\"fl\">即将开始 00小时46分46秒</em> <a class=\"shua fr\" href=\"#\"><img src=\""+this.projectImageUrl+"ssj07.jpg\" width=\"63\" height=\"33\"></a>";
		_imgShow.src=this.projectImageUrl+"ssj08.jpg";
		
		//是否执行过
		if(this.isRun===false){
			this.isRun=true;
			//this._renderDutchAuctionTime();			
		}
		
	},
	
	/**
	* 时时降多次降价显示方法
	**/
	_renderDutchAuctionTime:function(){		
		//endTimeStemp:30000,//降价时间点 		cutPrice:22,//降价幅度		endPrice:6500,//降价之后的价格
		var datas=this.dataOptions;
		if(this.isSellBeginEnd===true){
			//console.log("销售进行中》》》"+obj);
			window.clearInterval(this.showTimeTimerId);			
			var that=this;	
			var index=this.index;
			if(datas!=null){				
				//console.log("销售开始"+obj+"-----"+this.isSellEndEnd+"，长度为="+datas.length);
				//var dutchActionTimeStamp=0;		
				var obj=datas.dutchActions[index];				
				if(obj){
					//if(this.dutchActionTimeStamp){
						this.dutchActionTimeStamp=obj.endTimeStemp;
						//console.log("时时降时间计时开始！"+obj);					
							//window.setTimeout
						//this._renderDutchAuctionTimeShow(index)
						this._renderDutchAuctionTimeShow(obj);
						that.sellEndtimer=window.setInterval(function(){
							that._renderDutchAuctionTimeShow(obj);
						},1000);					
						//window.setTimeout(function(){that._renderDutchAuctionTimeShow(obj);},this.dutchActionTimeStamp);
					//}else{
					//	this.dutchActionTimeStamp=obj.endTimeStemp;
					//}				
				}else{
					window.clearInterval(that.sellEndtimer);
					if(this.isDutchEnd===false){	//未完全结束		
						if(datas==null||this.index>=this.dataOptions.dutchActions.length){
							var _dutchAuctionTime=document.getElementById("dutchAuctionTime"+this.countId);
							_dutchAuctionTime.innerHTML="<font class=\"size18 cor03\">最低价啦</font>";
						}
					}
				}
			}else{		
				window.clearInterval(that.sellEndtimer);
				if(this.isDutchEnd===false){//未完全结束
					if(datas==null||this.index>=this.dataOptions.dutchActions.length){
						var _dutchAuctionTime=document.getElementById("dutchAuctionTime"+this.countId);
						_dutchAuctionTime.innerHTML="<font class=\"size18 cor03\">最低价啦</font>";
					}		
				}				
			}
		}			
	},
	
	 /**
     * 时时降倒计时时间渲染倒计时元素
     * @private
     */
    _renderDutchAuctionTimeShow : function(obj){	
		//console.log("时时降时间计时开始111111111111！"+obj);
		
		var t =this.dutchActionTimeStamp;
        // 总秒数  
        var xt = parseInt(t/1000);	
		this.dutchActionTimeStamp=this.dutchActionTimeStamp-1000;				
		//if(this.isSellEndEnd===true){
		if(this.isDutchEnd===false){	//未完全结束	
			if(this.dataOptions.lowestPrice>obj.endPrice||this.index>=this.dataOptions.dutchActions.length){
				var _dutchAuctionTime=document.getElementById("dutchAuctionTime"+this.countId);
				_dutchAuctionTime.innerHTML="<font class=\"size18 cor03\">最低价啦</font>";
				var _nowTotalPrice=document.getElementById("nowTotalPrice"+this.countId);
				_nowTotalPrice.innerHTML="现价￥"+this.dataOptions.lowestPrice+"元";
				return;
			}else{
				if(xt>=0){
					var _dutchAuctionTime=document.getElementById("dutchAuctionTime"+this.countId);
					var _nowTotalPrice=document.getElementById("nowTotalPrice"+this.countId);
					// console.log(_showObj.innerHTML);		
					_dutchAuctionTime.innerHTML="<em><span></span>"+xt+"</em><font>秒后</font><i><img src=\""+this.projectImageUrl+"ssj05.jpg\" width=\"15\" height=\"16\"></i><em><span></span>"+obj.cutPrice+"</em><font>元</font>";
					/*if(this.index>0){						
						//console.log(this.index+",,,"+this.dataOptions.dutchActions.length+"现价￥"+_tempObj.endPrice+"元");
						if(this.index==this.dataOptions.dutchActions.length-1){
							if(xt==0){
								_nowTotalPrice.innerHTML="现价￥"+obj.endPrice+"元";
							}
						}else{
							var _tempObj=this.dataOptions.dutchActions[this.index-1];
							_nowTotalPrice.innerHTML="现价￥"+_tempObj.endPrice+"元";
							
						}						
					}else{
						_nowTotalPrice.innerHTML="现价￥"+obj.prevPrice+"元";
					}*/
					if(xt==0){
								_nowTotalPrice.innerHTML="现价￥"+obj.endPrice+"元";
							}else{
								_nowTotalPrice.innerHTML="现价￥"+obj.prevPrice+"元"; 
					}
				}
			}		
		}
		var that=this;		
		//console.log("定时器清理！"+xt);
		if(xt<=0){			
			this.index++;
			window.clearInterval(that.sellEndtimer);
			that._renderDutchAuctionTime();
			//that.sellEndtimer=window.setInterval(function(){
				//that._renderDutchAuctionTime();
			//},1000);
			//return;
		}
		
    },
	
	_renderFullEnd:function(){		
		this.isDutchEnd=true;//倒计时完全结束
		var _countDownBack=document.getElementById("countDownBack"+this.countId);
		var _countDownText=document.getElementById("countDownText"+this.countId);
		var _imgShow=document.getElementById("imgShow"+this.countId);		
		var _dutchAuctionTime=document.getElementById("dutchAuctionTime"+this.countId);
		       // console.log(_showObj.innerHTML);		
        _dutchAuctionTime.innerHTML="<font class=\"size18\">已经结束</font>";
		 // console.log(_showObj.innerHTML);
        //_showObj.innerHTML=remain_day+","+remain_hour+","+remain_minute+","+remain_sec;
		_countDownBack.className="tit3 mar_b15";
        _countDownText.innerHTML="已结束";
		if(this.type==1){//type为2的时候是为还有机会的一种特殊情况
			var _buttonDetail=document.getElementById("buttonDetail"+this.countId);
			_buttonDetail.innerHTML="<a class=\"bnt03\" href=\"javascript:void(0)\">已结束</a>";			
		}
		
		if(this.type==3){//type为2的时候是为还有机会的一种特殊情况
			var _buttonDetail=document.getElementById("buttonDetail"+this.countId);
			_buttonDetail.innerHTML="";			
		}
		
		
		
		_imgShow.src=this.projectImageUrl+"ssj06.jpg";
		//window.clearInterval(that.sellEndtimer);
	}
	


}
};

var requestAnimation = (function(callback,time){
    return function(callback,time) {
			if(time){
				window.setTimeout(callback, time);
			}else{
				window.setTimeout(callback, 1000);
		   }
        };
})();