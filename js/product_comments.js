(function () {
    var productId = window.location.href.split('?')[1];   // 获取url
    productId = decodeURI(productId);   // 解码
    var isAJAX = false; // 请求
    var scrollPage = 1; // 页码
    $.commentsAJAX = function () {
        $.showIndicator();
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/product/comment/more/' + productId,
            data: {
                'page': scrollPage
            },
            dataType: 'json',
            // timeout: 300,
            success: function (res) {
                console.log(res);
                res.data.proReviews.forEach(function (data) {
                    $('.product_comments').append(
                        '<dl>' +
                        '<dt>' +
                        '<img src="' + data.thumb + '" />' +
                        '<span>' + data.createName + '</span>' +
                        '</dt>' +
                        '<dd class="com_ner">' + data.content + '</dd>' +
                        '<dd class="com_par">' + data.createTime + ' / ' + data.sku + '</dd>' +
                        '</dl>'
                    )
                });
                if (res.data.proReviews.length < 10) {
                    scrollPage = 0;
                } else {
                    scrollPage++;
                }
                isAJAX = true;
                $.hideIndicator();
                if (res.data.proReviews < 1) {
                    $.global_nothing('icon-none', '「暂无评价」');
                }
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    };
    // 初始化
    $(document).ready(function() {
        $.commentsAJAX();
    });
    // 无限滚动
    $('#scrollContent').scroll(function() {
        var div_height = document.getElementById('scrollContent').scrollHeight;
        var window_height = $(this).height();
        var scroll_top = $(this).scrollTop();
        var scrollBottom = div_height - window_height - scroll_top;
        if (scrollBottom <= 50 && scrollPage > 0 && isAJAX==true) {
            isAJAX = false;
            $.commentsAJAX();  // 搜索
        }
    });
})();