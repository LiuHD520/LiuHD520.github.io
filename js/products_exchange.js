(function () {

var duiHuan=document.getElementById("im-yue");
var pos=document.getElementsByClassName("posit")[0];
var center=document.getElementsByClassName("div-center")[0];
var cancel=document.getElementsByClassName("cancel")[0];
var affirm=document.getElementsByClassName("affirm")[0];
    duiHuan.onclick=function(){
        pos.style.display="block";
        center.style.display="block";
    }
    cancel.onclick=function(){
        pos.style.display="none";
        center.style.display="none";
    }
    affirm.onclick=function(){
        pos.style.display="none";
        center.style.display="none";
    }
    /*** Swipe轮播Banner：初次加载 ***/
    $(document).ready(function () {
        // 计算
        $('.swipe-wrap-count').text('1/' + $('.swipe-wrap a').length);

    });
    /*** Swipe轮播Banner ***/
    var elem = document.getElementById('mySwipe');
    window.mySwipe = Swipe(elem, {
        callback: function(index, element) {
            // 计算
            $('.swipe-wrap-count').text((index+1) + '/' + $('.swipe-wrap a').length);
            // 计点
            $(".swipe-wrap-list p").eq(index).addClass("choice-list").siblings().removeClass("choice-list");
        }
    });
})();