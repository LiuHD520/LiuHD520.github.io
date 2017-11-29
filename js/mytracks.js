(function () {
    if($.global_iscookie()){
        var cookieValue = $.fn.cookie('baai_user_token');
        $.ajax({
            url: $.global_AjaxUrl+'/mytrace/list',
            type: 'GET',
            data:{
                "baai_user_token":cookieValue
            },
            success: function(res){
                console.log(res);
                if (res.status == 200) {
                    var str01 = '<div class="tracks">';
                    var str02 = '';
                    var str03 = '';
                    var str04 = '';
                    var productId='';
                    res.data.forEach(function (obj) {
                        str04='<li><a href="#D'+obj.date+'">'+obj.date+'</a></li>';
                        str02 = '<h1 id="D'+obj.date+'">' + obj.date + '</h1>';
                        obj.list.forEach(function(list){
                            console.log(list);
                            if ( list.status == 0 ) {
                                console.log('已下架商品');
                            } else {
                                str03 = str03 + '<dl data-productId="'+ list.productId +'">' +
                                    '<dt><i class="iconfont icon-dibiao"></i></dt>' +
                                    '<dd>' +
                                    '<p>' +
                                    '<span>' + list.productName + '</span>' +
                                    '<span class="pic">￥' + list.price + '</span>' +
                                    '</p>' +
                                    '<p><img src="' + list.thumb + '" /></p>' +
                                    '</dd>' +
                                    '</dl>';
                            }
                        });
                        $('.mytracks').append(
                            '<div class="tracks">' + str02 + str03 + '</div>'
                        );
                        $('.date_detail').append(str04);
                        str03 = '';
                        $('.date_title p').on('click', function () {
                            $('.position_fixed .reconfirm').css('display', '');
                            $('.date_title ul').css('display', '');
                        });
                        $('.date_title li').on('click', function () {
                            $('.date_title p').html($(this).text() + '<i class="iconfont icon-rili"></i>');
                            $('.position_fixed .reconfirm').css('display', 'none');
                            $('.date_title ul').css('display', 'none');
                        });
                        $('.position_fixed .reconfirm').on('click', function () {
                            $(this).css('display', 'none');
                            $('.date_title ul').css('display', 'none');
                        });
                        // 清空
                        $('.pull-right').on('click', function () {
                            $('.rf_clear').css('display', '');
                        });
                        $('.rf_clear .cancel').on('click', function () {
                            $('.rf_clear').css('display', 'none');
                        });
                        $('.rf_clear .sure').on('click', function () {
                            $('.rf_clear').css('display', 'none');
                            $.ajax({
                                type: 'GET',
                                url: $.global_AjaxUrl + '/mytrace/cancelAll',
                                data: { 'baai_user_token': cookieValue },
                                dataType: 'json',
                                timeout: 300,
                                success: function(res){
                                    console.log(res);
                                    // location.reload();
                                    $.toast('已清空');
                                },
                                error: function(){
                                    console.log('Ajax error!');
                                }
                            });
                        });
                        // 链条
                        $('.tracks dl').on('click', function () {
                            var id=$(this).attr('data-productId');
                            window.location.href="product_detail.html?"+id + '?';
                        });
                    });
                }
                if (res.status == 400) {
                    $.global_nothing('icon-none', '「暂无足迹」');
                }
            },
            error: function(xhr, type){
                console.log('Ajax error!')
            }
        });
    } else {
        $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
    }
})();