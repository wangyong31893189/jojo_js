//define(function(require, exports, module) {
    var Message={
    time_vanish:null,
    time_delete:null,
    clear:function(){
    	var self = Message;
    	if(self.va_p){
        	self.va_p.style.WebkitAnimation="fadeinout3 0.8s" ;
        	self.va_p.style.MozAnimation="fadeinout3 0.8s" ;
        	self.va_p.style.OAnimation="fadeinout3 0.8s" ;
        	if(self.va_p.parentNode){
            	self.va_p.parentNode.removeChild(self.va_p);
        	}
        	self.va_p = null;
        	clearTimeout(self.time_vanish);
        	clearTimeout(self.time_delete);
    	}
    },		
    show:function(type,msg,modeType,timestamp){//下拉框式的提示样式
    	var self = this;
    	self.clear();
        if(!timestamp){
            timestamp=5000;
        }
        if(type=="droplist"){//droplist
                var va_div=document.getElementById("outContainer");
                var va_timeoutId=0;
                if(va_div){
                    //alert(1+":"+va_timeoutId);
                    window.clearTimeout(va_timeoutId);
                    var va_msg=document.getElementById("outMessage");
                    va_div.className=outContainer.className.replace("com-none","");
                    va_div.style.display="";
                    va_msg.innerHTML =msg;
                }else{
                    //alert(1+":else:"+va_timeoutId);
                    var va_style=document.createElement("style");
                    var style_txt=" @-webkit-keyframes com-moveup {0% {top: 0; }   100% {                        top: -77px;                }        }        @-webkit-keyframes com-movedown {            0% {                top: -77px;        }        100% {            top: 0;    }}@-webkit-keyframes fadeInDown {    0% {        opacity: 0;    -webkit-transform: translateY(-10px);    -moz-transform: translateY(-10px);    -o-transform: translateY(-10px);    -ms-transform: translateY(-10px);}100% {    opacity: 1;-webkit-transform: translateY(0px);-moz-transform: translateY(0px);-o-transform: translateY(0px);-ms-transform: translateY(0px);}}@-webkit-keyframes fadeOutUp {    0% {        opacity: 1;    -webkit-transform: translateY(0px);    -moz-transform: translateY(0px);    -o-transform: translateY(0px);    -ms-transform: translateY(0px);}100% {    opacity: 0;-webkit-transform: translateY(-10px);-moz-transform: translateY(-10px);-o-transform: translateY(-10px);-ms-transform: translateY(-10px);}}@-webkit-keyframes cpebottomtop {    0% {        top: -100px;    opacity: 1;}100% {    top: 0;opacity: 1;}}@-webkit-keyframes headtabtoshow {    0% {        top: -250px;}100% {    top: 40px;}}@-webkit-keyframes headtabtohide {    0% {        top: 40px;}1000% {    top: -250px;}}";
                    va_style.innerHTML=va_style;
                    var va_head=document.getElementsByTagName("head")[0];
                    va_head.appendChild(va_style);
                    va_div=document.createElement("div");
                    va_div.setAttribute("id","outContainer");
                    va_div.setAttribute("style","display:block;position: fixed;top: 0px;left: 0;right: 0;padding-left: 10px;padding-right: 30px;padding-top:10px; padding-bottom: 10px;line-height: 1.4em;z-index: 99999;background: rgba(0,0,0,0.7);color: #FFF;-webkit-animation:cpebottomtop 1s;-webkit-animation-delay: 0s;-webkit-animation-iteration-count: 1;");
                    var va_span=document.createElement("span");
                    va_span.setAttribute("id","outMessage");
                    va_span.setAttribute("style","font-family: Arial,helvetica;font-size: 14px;");
                    va_span.innerHTML=msg;
                    va_div.appendChild(va_span);
                    var va_i=document.createElement("i");
                    va_i.setAttribute("style","display: inline-block;right: 5px;background: url( http://pic.99wuxian.com/basic/wap/img/iphone/common/ico_new.png);background-size: 250px 250px;position:absolute;top: 4px;background-position: -125px -23px;width: 28px;height: 28px;opacity: 0.55;");
                    va_div.appendChild(va_i);
                    va_i.onclick=function(){
                        this.parentNode.style.display="none";
                        window.clearTimeout(va_timeoutId);
                    };
                    var va_body=document.body;
                    va_body.appendChild(va_div);

                }
                if(modeType){
                    if(modeType==1){//为1的时候为自动消除
                        //定时消失
                        va_timeoutId=setTimeout(function(){va_div.style.display="none";window.clearTimeout(va_timeoutId)},timestamp);
                    }
                }
        }else{
            //alert(this.ErrorMessage.join("\n"));
            var va_style=document.createElement("style");
            var style_txt="-webkit-keyframes moveformbottom{                0%    {bottom:-200px;}        100%  {bottom:0px;}}@-moz-keyframes moveformbottom{    0%    {bottom:-200px;}100%  {bottom:0px;}}@-o-keyframes moveformbottom{    0%    {bottom:-200px;}100%  {bottom:0px;}}@-webkit-keyframes movetobottom{    0%    {bottom:0px;}100%  {bottom:-200px;}}@-moz-keyframes movetobottom{    0%    {bottom:0px;}100%  {bottom:-200px;}}@-o-keyframes movetobottom{    0%    {bottom:0px;}100%  {bottom:-200px;}}@-webkit-keyframes fadeoutin{    0%   {opacity:0;}100% {opacity:0.9;}}@-moz-keyframes fadeoutin{    0%   {opacity:0;}100% {opacity:0.9;}}@-o-keyframes fadeoutin{    0%   {opacity:0;}100% {opacity:0.9;}}@-webkit-keyframes fadeinout{    0%   {opacity:0.9;}100% {opacity:0;}}@-moz-keyframes fadeinout{    0%   {opacity:0.9;}100% {opacity:0;}}@-o-keyframes fadeinout{    0%   {opacity:0.9;}100% {opacity:0;}}@-webkit-keyframes fadeoutin3{    0%   {opacity:0;}100% {opacity:0.9;}}@-moz-keyframes fadeoutin3{    0%   {opacity:0;}100% {opacity:0.9;}}@-o-keyframes fadeoutin3{    0%   {opacity:0;}100% {opacity:0.9;}}@-webkit-keyframes fadeinout3{    0%   {opacity:0.9;}100% {opacity:0;}}@-moz-keyframes fadeinout3{    0%   {opacity:0.9;}100% {opacity:0;}}@-o-keyframes fadeinout3{    0%   {opacity:0.9;}100% {opacity:0;}}";
            var va_head=document.getElementsByTagName("head")[0];
            va_head.appendChild(va_style);
            //插入html
            this.va_p = document.createElement("p");
            this.va_p.setAttribute("style","position: fixed;top: 50%;left: 50%;margin: -22px -75px;z-index: 9999;border-radius: 4px;font-size: 12px;color: #fff;background: rgba(0,0,0,0.9);*background: #000;background: #000;filter: alpha(opacity=90);animation: fadeoutin3 .8s;-webkit-animation: fadeoutin3 .8s;-o-animation: fadeoutin3 .8s;-moz-animation: fadeoutin3 .8s;") ;
            var va_span=document.createElement("span");
            va_span.setAttribute("style","position: relative;display: block;margin-right: 0;height: 100%;padding: 16px;padding-right: 38px;");
            var va_i=document.createElement("i");
            va_i.setAttribute("style","background-image: url(http://pic.99wuxian.com/basic/wap/js/source/plugs/img/alert.png);background-size: 46px 31px;background-position: 2px 2px; width: 14px;height: 14px;position: absolute;right: 5px;top: 5px;opacity: .8;filter: alpha(opacity=80);");
            va_span.appendChild(va_i);
            var va_txt=document.createTextNode(msg);
           // alert(va_txt);
            va_span.appendChild(va_txt);
            self.va_p.appendChild(va_span);
            document.body.appendChild(this.va_p) ;

            //修正定位
            self.va_p.style.marginLeft = "-"+this.va_p.offsetWidth*0.5+"px";

            //点击关闭
            self.va_p.onclick = function(){
            	self.clear();
            };
            if(modeType&&self.va_p){
                if(modeType==1){//为1的时候为自动消除
                    //定时消失
                    self.time_vanish = setTimeout(function(){
                    	self.va_p.style.WebkitAnimation= "fadeinout 0.8s" ;
                    	self.va_p.style.MozAnimation= "fadeinout 0.8s" ;
                    	self.va_p.style.OAnimation= "fadeinout 0.8s" ;
                    },timestamp);

                    //定时删除
                    self.time_delete = setTimeout(function(){
                    	if(self.va_p&& self.va_p.parentNode){
                    		self.va_p.parentNode.removeChild(self.va_p);
                    	}
                    },timestamp);
                }
            }
        }

    }
};
//    module.exports  = Message;
//});