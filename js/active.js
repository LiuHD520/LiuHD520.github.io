(function () {
    $(document).on('click', '.product_list dl', function () {
        window.location.href = $(this).attr('data-url');
    });
})();
/*** AJAX ***/
(function () {
    $(document).ready(function() {
        var activeId = window.location.href.split('?')[1];   // 获取url
        activeId = decodeURI(activeId);   // 解码
        $.ajax({
            type: 'post',
            url: $.global_AjaxUrl + '/h5OfActivity/' + activeId,
            timeout:500,
            data: {},
            success: function (res) {
                console.log(res);
                // 活动名称
                $('.title').text(res.data.activtiyTitle);
                $('title').text(res.data.activtiyTitle);
                // banner
                res.data.activtiyPic.forEach(function (data) {
                    $('#mySwipe .swipe-wrap').append('<a href="' + data.url + '"><img src="' + data.pic + '" /></a>');
                });
                $.global_banner();
                // 商品列表
                res.data.activityList.forEach(function (data) {
                    $('.active').append('<h1><span>' + data.title + '</span></h1>');
                    var htmlTxt = '';
                    data.products.forEach(function (list) {
                        htmlTxt = htmlTxt +
                                '<dl data-url="' + list.url + '">' +
                                    '<dt><img src="' + list.thumb + '" /></dt>' +
                                    '<dd>' +
                                        '<p class="plname">' + list.name + '</p>' +
                                        '<p class="plprice">' +
                                            '<strong>￥' + list.price + '</strong>' +
                                            '<span><a href="#">立即抢购</a></span>' +
                                        '</p>' +
                                    '</dd>' +
                                '</dl>'
                    });
                    $('.active').append('<div class="product_list beancurd_cube">' + htmlTxt +'</div>');
                });
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    });
})();