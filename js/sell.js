(function () {
    if ($.global_iscookie()) {
        //请求销售问答的数据接口
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/queryListBySaleAnswer',
            data: {},
            dataType: 'json',
            // timeout: 300,
            success: function (res) {
                console.log(res);
                res.data.forEach(function (obj) {
                    $('.sell').append('<li class="titleList" data-titleId="'+obj.id+'" data-title="'+obj.titles+'"><a><b>'+obj.titles+'</b><i class="iconfont icon-gengduo"></i></a></li>');
                });
                // 跳转销售问答各个标题详情页
                $(document).on('click', '.titleList', function () {
                    //携带详情id
                    var titleid = $(this).attr('data-titleId');
                    var title= $(this).attr('data-title');
                    window.location.href = 'titleDetail.html?' + titleid + '&' + title;
                });
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    }else {
        $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
    }
})();