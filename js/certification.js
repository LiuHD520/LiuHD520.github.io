(function () {
    //获取本地cookie值，进行参数传递
    var cookieValue = $.fn.cookie('baai_user_token');
    //点击退出登录，清楚cookie
    $(document).on("click", ".save", function () {

    });
    // 头像绑定
    //个人信息页面
    // if($.global_iscookie()){
    //
    // } else {
    //     $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
    // }
})();