(function () {
    // 是否微信内打开
    $.isWexin = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    };
    // 支付宝or微信
    $(document).on('click', '.paytype dl', function () {
        $(this).find('.check').addClass('selected');
        $(this).siblings('dl').find('.check').removeClass('selected');
    });
})();
/*** AJAX ***/
(function () {
    var baai_user_token = $.fn.cookie('baai_user_token');   // 用户cookie
    var url = (window.location.href).split('?');
    var order = url[1];
    var baai_money = 0;
    var errorAJAX = 0;  // 请求出错
    // ###############################
    // 微信支付
    $.showWeixin = function () {
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/showWechatPay',
            dataType: 'json',
            // timeout: 300,
            data: {},
            success: function (res) {
                // console.log(res);
                if (res.data.showWechatPay) { $('.weixinpay').attr('style', '').siblings().attr('style', ''); }
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    };
    // ###############################
    // ###############################

    // 旧接口
    $.baai_money = function() {
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/payWaitH5',
            timeout:300,
            data: {
                'baai_user_token': baai_user_token,
                'code': order
            },
            success: function (res) {
                // console.log(res);
                $('.baai_money strong').text(res.data.total_money);
            },
            error: function () {
                console.log('Ajax error!');
                if (errorAJAX < 3) {
                    $.baai_money(); // 重试
                    errorAJAX++;
                } else {
                    $.toast('网络出错');
                }
            }
        });
    };
    // ###############################
    // 渲染
    $(document).ready(function() {
        $.showWeixin(); // 加载微信支付
        $.baai_money(); // 加载八爱币
        $('#order').text(order);    // 订单号
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/orderList/orderDetail/' + order,
            dataType: 'json',
            // timeout: 300,
            data: { 'baai_user_token': baai_user_token },
            success: function (res) {
                console.log(res);
                $('#money').text(res.data.order.showTotalPrice+'.00');
                $('#address').text(res.data.order.consignee + ',' + res.data.order.mobile + ',' + res.data.order.address);
                res.data.order.detailList.forEach(function (data) {
                    $('.order_infor').append(
                        '<dl>' +
                            '<dt><img src="' + data.productThumb + '_w200.jpg" /></dt>' +
                            '<dd>' +
                                '<p>' +
                                    '<span class="plname">' + data.productName + '</span>' +
                                    '<span class="plsepc">' + data.showCommoStandard + '</span>' +
                                '</p>' +
                                '<p class="plpic">' +
                                    '<span>￥' + data.showPrice + '</span>' +
                                    '<span>x' + data.num + '</span>' +
                                '</p>' +
                            '</dd>' +
                        '</dl>'
                    )
                });
                // 使用八爱币
                $(document).on('click', '.baai_money', function () {
                    var span = $(this).children('span');
                    if (span.is('.checked')) {
                        span.removeClass('checked').html('<svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-weixuanze"></use></svg>');
                        baai_money = 0;
                        $('#money').text(res.data.order.showTotalPrice+'.00');
                    } else {
                        span.addClass('checked').html('<svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-yixuanze"></use></svg>');
                        if ($('#money').text()*100 <= $('.baai_money strong').text()) {
                            baai_money = parseInt($('#money').text()*100);
                            $('#money').text('0.00');
                        } else {
                            baai_money = parseInt($('.baai_money strong').text());
                            $('#money').text((parseInt($('#money').text()*100)-parseInt($('.baai_money strong').text()))/100);
                        }
                    }
                });
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    });
    // 去支付
    $('footer button').on('click', function () {
        var payTxt = $('footer .selected').parents('dl').find('.pay').text();
        if ($.global_iscookie()) {
            if (payTxt == '支付宝') {
                if (!$.isWexin()) {
                    $.showPreloader('正在提交订单...');
                    $.ajax({
                        type: 'post',
                        url: $.global_AjaxUrl + '/forword/alipay',
                        // timeout:300,
                        data: {
                            'orderCode': order,
                            'payBaai': baai_money
                        },
                        success: function (res) {
                            console.log(res);
                            $('#alipayFrom').html(res);
                        },
                        error: function () {
                            console.log('Ajax error!');
                            $.hidePreloader();
                            $.toast('订单提交失败，请重试');
                        }
                    });
                } else {
                    $.toast('请用外部浏览器打开');
                }
            }
            if (payTxt == '微信支付') {
                console.log(payTxt);
                $('#myform').attr('action',$.global_AjaxUrl+"/forword/wechatPay?"+"orderCode="+order+"&payBaai="+baai_money+"&baai_user_token="+baai_user_token);  //  注入微信请求
                $('#myform').submit();
            }
        } else {
            $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
        }
    });
})();