(function () {
    // 封装搜索
    $.search = function (val) {
        window.location.href = "search_result.html?" + val + '?';
    };
    // 搜索推荐
    $(document).on('click', '.search_recommend li', function () {
        var val = $(this).text();
        $.search(val);
    });
    // 搜索历史
    $(document).on('click', '.search_history li', function () {
        var val = $(this).text();
        $.search(val);
    });
})();
/*** AJAX ***/
(function () {
    var baai_user_token = $.fn.cookie('baai_user_token');   // 用户cookie
    // 获取搜索记录
    $(document).ready(function() {
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/query/searchHistory',
            data: { 'baai_user_token': baai_user_token },
            dataType: 'json',
            success: function (res) {
                // console.log(res);
                if (res.data != null) {
                    if (res.data.length < 1) {
                        $(".search_history").css("display", "none");
                    } else {
                        $(".search_history").css("display", "");
                    }
                    res.data.forEach(function (data) {
                        $('.search_history ul').append('<li>' + data.keyWords + '</li>');
                    })
                }
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    });
    // Input框搜索
    $(document).on('click' ,'.footerButton', function () {
        var keyWords = $('#search').val();
        if (keyWords.trim() != '') {
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/save/searchHistory',
                data: {
                    'baai_user_token': baai_user_token,
                    'keyWords': keyWords
                },
                dataType: 'json',
                success: function (res) {
                    console.log(res);
                },
                error: function () {
                    console.log('Ajax error!');
                }
            });
            $.search(keyWords.trim());
        } else {
            $.toast('请输入搜索内容');
        }
    });
    // 清空搜索历史
    $(document).on('click', '.search_history h2', function () {
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/clear/searchHistory',
            data: {
                'baai_user_token': baai_user_token
            },
            dataType: 'json',
            success: function (res) {
                console.log(res);
                $(".search_history").css("display", "none");
                $.toast('清空成功');
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    });
})();