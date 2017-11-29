(function () {
    //获取id、标题
    var url=(window.location.href).split('?');
    var titleurl=url[1].split('&');
    var titleD= decodeURI(titleurl[1]);
    console.log(titleurl[0],titleD);
    //动态添加标题
    $('.titletop').text(titleD);
    $('.title').text(titleD);
    $('.titleMain').text(titleD);
    if ($.global_iscookie()) {
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/getContentByTypeId',
            data: {
                id:titleurl[0]
            },
            dataType: 'json',
            // timeout: 300,
            success: function (res) {
                console.log(res);
                //各个标题详情信息渲染
                $('.about-goods-detail').append(res.data);
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    }else {
        $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
    }
})();