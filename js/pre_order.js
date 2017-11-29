(function () {
    // 选择寄件地址
    // $(document).on('click', '#mailing', function () {
    //     sessionStorage.setItem('mailing', '1');
    //     window.location.href="mailing_add.html";
    // });
    // 返回
    $(document).on('click', '.pull-left', function () {
        // sessionStorage.clear(); // 清空
        window.location.href="shopping_cart.html";
    });
    //加减数量
    $(document).on('click', '.global-number a', function () {
        var input_number = $(this).siblings('input');
        var number_int = parseInt(input_number.val());
        if ($(this).text() == '-') {
            if (number_int > 1) {
                -- number_int;
                input_number.val(number_int);
            }
        } else {
            number_int ++;
            input_number.val(number_int);
        }
    });
    // 计算总价
    $.total = function () {
        var total = 0;
        $('.plpic').each(function () {
            var pice = $(this).find('strong').text();
            var num = $(this).find('input').val();
            total = total + pice * num;
        });
        $('#total').text(total.toFixed(2));
    };
    // 修改数量时
    $(document).on('click', '.global-number a', function () {
        $.total();
    });
    $(document).on('blur', '.global-number input', function () {
        $.total();
    });
})();
/*** AJAX ***/
(function () {
    var baai_user_token = $.fn.cookie('baai_user_token');   // cookie
    var dataId = window.location.href.split('?')[1];   // 获取url购物项
    dataId = decodeURI(dataId);   // 解码
    // 选择收件地址
    $(document).on('click', '#delivery', function () {
        window.location.href="delivery_add.html?" + dataId;
    });
    // 加载收件地址
    $(document).ready(function() {
        var addId = window.location.href.split('?')[2];   // 获取url地址ID
        if (addId == undefined) {
            // 默认地址
            if ($.global_iscookie()) {
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/addresslist/1',
                    data: {'baai_user_token': baai_user_token},
                    dataType: 'json',
                    timeout: 300,
                    success: function (res) {
                        console.log(res);
                        if (res.data.length == 0) {
                            $('#delivery').find('span').text('添加地址');
                        } else {
                            res.data.forEach(function (data) {
                                if (data.isDefault == 1) {
                                    $('#delivery').attr('data-id', data.id).find('span').text(data.name);
                                }
                            })
                        }
                    },
                    error: function () {
                        console.log('Ajax error!');
                    }
                });
            } else {
                $.global_nothing('icon-people_fill', '您尚未登录，请先<a href="login.html">登录</a>');
            }
        } else {
            // 切换地址
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/address/' + addId,
                data: {'baai_user_token': baai_user_token},
                dataType: 'json',
                timeout: 300,
                success: function (res) {
                    console.log(res);
                    $('#delivery').attr('data-id',addId).find('span').text(res.data.consignee);
                },
                error: function () {
                    console.log('Ajax error!');
                }
            });
        }
    });
    // 加载寄件地址
    // $(document).ready(function() {
    //     var mailing = sessionStorage.getItem('mailing');
    //     if (mailing == 0) {
    //         // 切换地址
    //         var dataId = sessionStorage.getItem('mailing_id');
    //         var nametxt = sessionStorage.getItem('mailing_name');
    //         $('#mailing').attr('data-id',dataId).find('span').text(nametxt);
    //     } else {
    //         // 默认地址
    //         if ($.global_iscookie()) {
    //             $.ajax({
    //                 type: 'GET',
    //                 url: $.global_AjaxUrl + '/addresslist/2',
    //                 data: {'baai_user_token': baai_user_token},
    //                 dataType: 'json',
    //                 timeout: 300,
    //                 success: function (res) {
    //                     if (res.data.length == 0) {
    //                         $('#mailing').find('span').text('添加地址');
    //                     } else {
    //                         res.data.forEach(function (data) {
    //                             if (data.isDefault == 1) {
    //                                 $('#mailing').attr('data-id', data.id).find('span').text(data.name);
    //                             }
    //                         })
    //                     }
    //                 },
    //                 error: function () {
    //                     console.log('Ajax error!');
    //                 }
    //             });
    //         } else {
    //             $.global_nothing('icon-people_fill', '您尚未登录，请先<a href="login.html">登录</a>');
    //         }
    //     }
    // });
    // 加载商品项
    $(document).ready(function() {
        if($.global_iscookie()){
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/order/cartItem',
                data: {
                    'baai_user_token': baai_user_token,
                    'cartItemIds': dataId
                },
                dataType: 'json',
                timeout: 300,
                success: function(res){
                    console.log(res);
                    res.data.forEach(function (data) {
                        $('.consignment').append(
                            '<dl data-id="' + data.id + '">' +
                            '<dt><img src="' + data.thumb + '" /></dt>' +
                            '<dd>' +
                            '<p class="plname">' + data.productName + '</p>' +
                            '<p class="plsepc">' + data.commoStandardValue + '</p>' +
                            '<p class="plpic">' +
                            '<span>￥<strong>' + data.price.toFixed(2) + '</strong></span>' +
                            '<span class="slenum global-number">' +
                            '<a href="javascript:;">-</a>' +
                            '<input type="text" value="' + data.num + '" />' +
                            '<a href="javascript:;">+</a>' +
                            '</span>' +
                            '</p>' +
                            '</dd>' +
                            '</dl>'
                        );
                    });
                    $.total();
                },
                error: function(){
                    console.log('Ajax error!');
                }
            });
        } else {
            $.global_nothing('icon-people_fill', '您尚未登录，请先<a href="login.html">登录</a>');
        }
    });
    // 提交订单
    $(document).on('click', '#place_order', function () {
        var cartId_num = new Array();   // 购物项
        $('.consignment dl').each(function (index) {
            cartId_num[index] = $(this).attr('data-id') + '-' + $(this).find('input').val();
        });
        var addressId = $('#delivery').attr('data-id'); // 收件地址
        var sendAddressId = $('#mailing').attr('data-id');  // 寄件地址
        var couponId = '';  // 优惠券
        var message = $('textarea').val();
        console.log(message);
        if (addressId == '') {
            $.toast('请选择地址');
        } else {
            if($.global_iscookie()){
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/order/order',
                    data: {
                        'baai_user_token': baai_user_token,
                        'cartId_num': cartId_num.join(','),
                        'addressId': addressId,
                        'sendAddressId': sendAddressId,
                        'couponId': couponId,
                        'message': message
                    },
                    dataType: 'json',
                    success: function(res){
                        console.log(res);
                        // sessionStorage.clear(); // 清空
                        window.location.href="payment.html?" + res.data;
                    },
                    error: function(){
                        console.log('Ajax error!');
                    }
                });
            } else {
                $.global_nothing('icon-people_fill', '您尚未登录，请先<a href="login.html">登录</a>');
            }
        }
    });
})();