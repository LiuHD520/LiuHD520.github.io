(function () {
    //获取本地cookie值，进行参数传递
    var cookieValue = $.fn.cookie('baai_user_token');

    $(document).on('click', '.personage', function () {
        var dt = $(this).children('dt');
        $('.unit dt').removeClass('checked').html('<svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-yixuanz"></use></svg>');
        dt.removeClass('checked').html('<svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-weixuanze"></use></svg>');
        dt.addClass('checked').html('<svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-yixuanze"></use></svg>');
        $('.unit dt').html('<svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-weixuanze"></use></svg>');
        $('.invoice-fill-content').css('display','none');
    });
    $(document).on('click', '.unit', function () {
        var dt = $(this).children('dt');
        $('.personage dt').removeClass('checked').html('<svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-yixuanz"></use></svg>');
        dt.removeClass('checked').html('<svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-weixuanze"></use></svg>');
        dt.addClass('checked').html('<svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-yixuanze"></use></svg>');
        $('.personage dt').html('<svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-weixuanze"></use></svg>');
        $('.invoice-fill-content').css('display','block');
    });
    //公司名称、纳税人识别号清除当前输入内容
    $(".invoice-fill-content ul li span input").focus(function(){
        $(this).siblings('strong').css('display','block');
    });
    $(".invoice-fill-content ul li span input").blur(function(){
        $(this).siblings('strong').css('display','none');
    });
    $(document).on("click", ".invoice-fill-content ul li span strong", function () {
        $(this).siblings('input').val('');
    });
    // if($.global_iscookie()){
    //
    // } else {
    //     $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
    // }
})();