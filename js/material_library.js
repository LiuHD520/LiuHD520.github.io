(function () {
    var baai_user_token = $.fn.cookie('baai_user_token');   // 用户cookie
    var productId = window.location.href.split('?')[1];   // 获取url
    productId = decodeURI(productId);   // 解码
    // $.toast('推广文案已复制');
    $(document).ready(function() {
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/cart/retransmit/add/' + productId,
            data: { 'baai_user_token': baai_user_token },
            dataType: 'json',
            // timeout: 300,
            success: function (res) {
                console.log(res);
                res.data.forEach(function (val) {
                    $('.material_library').append('<p><img src="' + val + '" /></p>');
                });
                // 生成二维码
                $('.material_library').append('<p id="global-qrcode"></p>');
                var QRCodeUrl = 'https://m.baai.com/product_detail.html?' + productId + '?';
                $.global_QRcode(QRCodeUrl);
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    });
})();