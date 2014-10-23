/**
 * User: yongwang
 * Date: 12-01-17
 * Time: 上午9:54
 */
var CountDown = {

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
	
	goodsDetailUrl:"sj_detail01.html", //商品详情地址
	
	goodsBuyingUrl:"sj_detail01.html",  //商品抢购地址
	
	dataOptions:[{
		endTimeStemp:30000,//降价时间点
		endTimeStempId:"",//降价时间点显示框ID
		cutPrice:22,//降价幅度
		endTimeStempId:"",//降价幅度显示框ID
		endPrice:6500,//降价之后的价格
		endPriceId:"" //降价总价显示框ID
	}],

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
		this.countDownBeginStemp=(this.sellBeginTimeStemp.getTime() - this.currStemp.getTime());
		this.countDownEndStemp=(this.sellEndTimeStemp.getTime() - this.currStemp.getTime());
		this.type=o.type||0;
		this.projectImageUrl=o.projectImageUrl||"images/";
		this.goodsDetailUrl=o.goodsDetailUrl||"javascript:void(0)";
		this.goodsBuyingUrl=o.goodsBuyingUrl||"javascript:void(0)";
		this.dataOptions=o.dataOptions||null;
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
		console.log(this.countDownBeginStemp);
        if(this.countDownBeginStemp<= 0){
            this.isSellBeginEnd = true;
        }
		if(this.countDownEndStemp<= 0){
            this.isSellEndEnd = true;
        }		
        //如果结束则调用结束回调
        if(this.isSellBeginEnd === true){
            console.log('销售开始时间已经到了');
			if(this.isSellEndEnd===true){
				console.log('销售结束时间已经到了');
				this._renderFullEnd.apply(this);
			}else{
				switch(this.type){
					case 1:
						this._renderSellEnd(this.countDownEndStemp);
						break;
					default:
						this.endcallback.apply(this,[this.endurl]);
						break;
				}
			}
        }else{
			switch(this.type){
				case 1:
					this._renderSellerGoods(this.countDownBeginStemp);
					break;
				default:
					this._render(this.countDownBeginStemp);
					break;
			}
                     
        }
		var that = this;  
		requestAnimation(function(){
            that._CountDownLoop();
        });
    },

    /**
     * 使用倒计时时间渲染倒计时元素
     * @private
     */
    _render : function(countDownStemp){		
        var t = countDownStemp-1000;
        // 总秒数  
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
		if (remain_day < 10){
			remain_day = "0" + remain_day; 
		}      
    },
	
	 /**
     * 使用倒计时时间渲染倒计时元素
     * @private
     */
    _renderSellerGoods : function(){
		this.countDownBeginStemp=this.countDownBeginStemp-1000;
		
        var t =this.countDownBeginStemp;
        // 总秒数  
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
		if (remain_day < 10){
			remain_day = "0" + remain_day; 
		}
       //console.log(remain_day);
		var _countDownBack=document.getElementById("countDownBack"+this.countId);
		var _countDownText=document.getElementById("countDownText"+this.countId);
		var _imgShow=document.getElementById("imgShow"+this.countId);
		var _buttonDetail=document.getElementById("buttonDetail"+this.countId);
		       // console.log(_showObj.innerHTML);

        //_showObj.innerHTML=remain_day+","+remain_hour+","+remain_minute+","+remain_sec;
		_countDownBack.className="tit2 mar_b15";
        _countDownText.innerHTML="即将开始&nbsp;"+remain_hour+"小时"+remain_minute+"分"+remain_sec+"秒";
		_imgShow.src=this.projectImageUrl+"ssj07.jpg";
		_buttonDetail.innerHTML="<a class=\"bnt02\" href=\""+this.goodsDetailUrl+"\">查看详情</a>";		
    },
	
	//商品销售结束调用方法
	_renderSellEnd:function(){
		this.countDownEndStemp=this.countDownEndStemp-1000;
		var t = this.countDownEndStemp;
		
		setTimeout(this._renderDutchAuctionTime,1000);
        // 总秒数  
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
		if (remain_day < 10){
			remain_day = "0" + remain_day; 
		}
       //console.log(remain_day);
		var _countDownBack=document.getElementById("countDownBack"+this.countId);
		var _countDownText=document.getElementById("countDownText"+this.countId);
		var _imgShow=document.getElementById("imgShow"+this.countId);
		var _buttonDetail=document.getElementById("buttonDetail"+this.countId);
		       // console.log(_showObj.innerHTML);

        //_showObj.innerHTML=remain_day+","+remain_hour+","+remain_minute+","+remain_sec;
		_countDownBack.className="tit mar_b15";
        _countDownText.innerHTML="距离结束&nbsp;"+remain_hour+"小时"+remain_minute+"分"+remain_sec+"秒";
		_imgShow.src=this.projectImageUrl+"ssj08.jpg";
		_buttonDetail.innerHTML="<a class=\"bnt01\" href=\""+this.goodsDetailUrl+"\">立即抢购</a>";
		//setTimeout(function(){},1000);
       // $('#hour').html(remain_hour);
       // $('#min').html(remain_minute);
       // $('#sec').html(remain_sec);
	
	},
	
	_renderDutchAuctionTime:function(){
		//alert("时时降时间开始了");
	
	},
	
	_renderFullEnd:function(){
		var _countDownBack=document.getElementById("countDownBack"+this.countId);
		var _countDownText=document.getElementById("countDownText"+this.countId);
		var _imgShow=document.getElementById("imgShow"+this.countId);
		var _buttonDetail=document.getElementById("buttonDetail"+this.countId);
		       // console.log(_showObj.innerHTML);

        //_showObj.innerHTML=remain_day+","+remain_hour+","+remain_minute+","+remain_sec;
		_countDownBack.className="tit3 mar_b15";
        _countDownText.innerHTML="已结束";
		_buttonDetail.innerHTML="<a class=\"bnt03\" href=\"javascript:void(0)\">已结束</a>";
		_imgShow.src=this.projectImageUrl+"ssj06.jpg";
		
	}
	


},requestAnimation = (function(callback){
    return function(callback) {
            window.setTimeout(callback, 1000);
        };
})();