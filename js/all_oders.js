(function () {
    $(document).on("click", ".order_state p", function () {
        var dataUrl = $(this).attr('data-url');
        window.location.href = dataUrl;
        $.tabChange();
    });
    // tab切换
    $.tabChange = function () {
        var wait = window.location.href.split('#')[1];   // 获取url
        wait = '#' + decodeURI(wait);   // 解码,转码
        var waitText = '';
        var startLenght = 0;
        $('.order_state p').each(function () {
            if ($(this).attr('data-url') == wait) {
                $(this).addClass('called').siblings().removeClass();
                waitText = $(this).text();
            }
        });
        if (waitText == '全部') {
            $('.oders_list ul').css('display', '');
            console.log($('.oders_list ul').length);
            $('.global-nothing').css('display', 'none');
            // if ($('.oders_list ul').length == 0) {
            //     $('.global-nothing').css('display', 'none');
            // } else {
            //     $('.global-nothing').css('display', '');
            // }
        } else {
            $('.oders_list .wait').each(function () {
                if ($(this).text() == waitText) {
                    $(this).parents('ul').css('display', '');
                    startLenght ++;
                } else {
                    $(this).parents('ul').css('display', 'none');
                }
            });
            if (startLenght < 1) {
                $('.global-nothing').css('display', '');
            } else {
                $('.global-nothing').css('display', 'none');
            }
        }
        // console.log(startLenght);
    };
    // 跳转订单详情
    $(document).on('click', '.order_details', function () {
        var dataCode = $(this).parents('ul').attr('data-code');
        window.location.href = 'order_detail.html?' + dataCode;
        console.log(dataCode);
    });
})();
/*** AJAX ***/
(function () {
    var cookieValue = $.fn.cookie('baai_user_token');   // 用户cookie
    //全部订单
    $.wait = function () {
        $.showIndicator();
        $.ajax({
            url: $.global_AjaxUrl + '/orderList/orders/1',
            type: 'GET',
            data: {
                "baai_user_token": cookieValue
            },
            success: function (res) {
                console.log(res);
                //    待支付
                var unpaid = '';
                var unpaid02 = '';
                var unpaidList = '';
                res.data.orderList.forEach(function (obj) {
                    if (obj.showStatus == "待支付") {
                        unpaid = '<ul data-code="' + obj.code + '" data-state="' + obj.status + '"><li class="ref"> <p>订单号 ' + obj.code + '</p><p class="wait">' + obj.showStatus + '</p></li>' +
                            '<li class="pickup"> <p><i class="iconfont icon-shoujianren"></i>' + obj.consignee + ' ' + obj.mobile + '</p>' +
                            '<p>' + obj.address + '</p></li>';
                        //订单商品数据渲染
                        obj.detailList.forEach(function (list) {
                            unpaidList += '<li class="lst unpaid" data-unpaidId="' + list.productId + '">' +
                                '<dl><dt><img src="' + list.productThumb + '" /></dt><dd><p>' +
                                '<span><strong>' + list.productName + '</strong></span>' +
                                '<span><u>规格：' + list.showCommoStandard + '</u></span></p>' +
                                '<p><span>￥' + list.showPrice + '</span><span><s>￥' + list.showOriginal + '</s></span><span>X' + list.num + '</span></p>' +
                                '</dd>' +
                                '</dl>' +
                                '</li>';
                        });
                        unpaid02 = '<li class="pic">' +
                            '<p>运费：￥' + obj.postPrice + '</p>' +
                            '<p>共' + obj.detailSize + '件(含运费)：￥' + obj.showTotalPrice + '</p>' +
                            '</li>' +
                            '<li class="state">' +
                            '<p class="red payPage" data-payCode="' + obj.code + '">立即支付</p>' +
                            '<p class="order_details">订单详情</p>' +
                            '<p class="popup_alert">取消订单</p>' +
                            '</li>' +
                            '</ul>';
                        $('.oders_list').append(unpaid + unpaidList + unpaid02);
                        unpaidList = '';

                        $('.unpaid').click(function () {
                            var id = $(this).attr('data-unpaidId');
                            window.location.href = "product_detail.html?" + id + '?';
                        });
                        $('.payPage').click(function () {
                            var payCode = $(this).attr('data-payCode');
                            window.location.href = "payment.html?" + payCode;
                        });
                        $(document).on('click', '.popup_alert', function () {
                            //取消订单时，先获取订单号
                            var dataCode = Array($(this).parents('ul').attr('data-code'));
                            //获取当前订单的状态
                            var state = $(this).parents('ul').attr('data-state');
                            var stateRemove = $(this).parents('ul');
                            var text = $(this).text();
                            //移除当前页面订单
                            $('.reconfirm').children('dl').children('dt').text('是否' + text + '？');
                            $('.reconfirm').css('display', '');
                            $('.cancel').click(function () {
                                $('.reconfirm').css('display', 'none');
                            })
                            $(document).on('click', '.sure', function () {
                                $('.reconfirm').css('display', 'none');
                                stateRemove.remove();
                                $.ajax({
                                    type: 'POST',
                                    url: $.global_AjaxUrl + '/orderList/editOrders',
                                    dataType: 'json',
                                    data: {
                                        'baai_user_token': cookieValue,
                                        'orderCodes': dataCode,
                                        'rawState': state,
                                        'status': 4
                                    },
                                    success: function (res) {
                                        console.log(res);
                                        $.toast(text + '成功');
                                    },
                                    error: function () {
                                        console.log('Ajax error!');
                                    }
                                });
                            })
                        });
                    }

                    //  待发货
                    var cock = '';
                    var cock02 = '';
                    var cockList = '';
                    if (obj.showStatus == "待发货") {
                        cock = '<ul data-code="' + obj.code + '">' +
                            '<li class="ref">' +
                            '<p>订单号 ' + obj.code + '</p>' +
                            '<p class="wait">' + obj.showStatus + '</p>' +
                            '</li>' +
                            '<li class="pickup">' +
                            '<p><i class="iconfont icon-shoujianren"></i>' + obj.consignee + ' ' + obj.mobile + '</p>' +
                            '<p>' + obj.address + '</p>' +
                            '</li>';
                        //待发货商品数据渲染
                        obj.detailList.forEach(function (list) {
                            cockList += '<li class="lst sendhuo" data-sendhuoId="' + list.productId + '">' +
                                '<dl><dt><img src="' + list.productThumb + '" /></dt><dd><p>' +
                                '<span><strong>' + list.productName + '</strong></span>' +
                                '<span><u>规格：' + list.showCommoStandard + '</u></span></p>' +
                                '<p><span>￥' + list.showPrice + '</span><span><s>￥' + list.showOriginal + '</s></span><span>X' + list.num + '</span></p>' +
                                '</dd>' +
                                '</dl>' +
                                '</li>';
                        });
                        //功能数据渲染
                        cock02 = '<li class="pic">' +
                            '<p>运费：￥' + obj.postPrice + '</p>' +
                            '<p>共' + obj.detailSize + '件(含运费)：￥' + obj.showTotalPrice + '</p>' +
                            '</li>' +
                            '<li class="state">' +
                            '<p class="red" onclick=$.toast("已提醒卖家发货")>提醒发货</p>' +
                            '<p class="order_details">订单详情</p>' +
                            '</li>' +
                            '</ul>';

                        $('.oders_list').append(cock + cockList + cock02);
                        cockList = '';
                        $(document).on('click', '.sendhuo', function () {
                            var id = $(this).attr('data-sendhuoId');
                            window.location.href = "product_detail.html?" + id + '?';
                        });
                    }

                    // 待收货
                    var upreceiving = '';
                    var upreceiving02 = '';
                    var upreceivingList = '';
                    if (obj.showStatus == "待收货") {
                        //待收货订单渲染
                        upreceiving = '<ul data-code="' + obj.code + '">' +
                            '<li class="ref">' +
                            '<p>订单号 ' + obj.code + '</p>' +
                            '<p class="wait">' + obj.showStatus + '</p>' +
                            '</li>' +
                            '<li class="pickup">' +
                            '<p><i class="iconfont icon-shoujianren"></i>' + obj.consignee + ' ' + obj.mobile + '</p>' +
                            '<p>' + obj.address + '</p>' +
                            '</li>';
                        //待收货商品数据渲染
                        obj.detailList.forEach(function (list) {
                            upreceivingList += '<li class="lst receiving" data-receivingId="' + list.productId + '">' +
                                '<dl><dt><img src="' + list.productThumb + '" /></dt><dd><p>' +
                                '<span><strong>' + list.productName + '</strong></span>' +
                                '<span><u>规格：' + list.showCommoStandard + '</u></span></p>' +
                                '<p><span>￥' + list.showPrice + '</span><span><s>￥' + list.showOriginal + '</s></span><span>X' + list.num + '</span></p>' +
                                '</dd>' +
                                '</dl>' +
                                '</li>';
                        });
                        //功能数据渲染
                        upreceiving02 = '<li class="pic">' +
                            '<p>运费：￥' + obj.postPrice + '</p>' +
                            '<p>共' + obj.detailSize + '件(含运费)：￥' + obj.showTotalPrice + '</p>' +
                            '</li>' +
                            '<li class="state">' +
                            '<p class="red popup_alert queren">确认收货</p>' +
                            '<p class="order_details">订单详情</p>' +
                            '</li>' +
                            '</ul>';

                        $('.oders_list').append(
                            upreceiving + upreceivingList + upreceiving02
                        );
                        upreceivingList = '';

                        $('.receiving').click(function () {
                            var id = $(this).attr('data-receivingId');
                            window.location.href = "product_detail.html?" + id + '?';
                        });

                        // 确认收货功能数据开发
                        $(document).on('click', '.queren', function () {
                            //确认收货后，订单状态改变
                            var dCode = Array($(this).parents('ul').attr('data-code'));
                            var text = $(this).text();
                            var sureReceive = $(this).parents('ul');
                            $('.reconfirm').children('dl').children('dt').text('是否' + text + '？');
                            $('.reconfirm').css('display', '');
                            $('.cancel').click(function () {
                                $('.reconfirm').css('display', 'none');
                            })
                            $('.ren').click(function () {
                                $('.reconfirm').css('display', 'none');
                                sureReceive.remove();
                                $.ajax({
                                    type: 'POST',
                                    url: $.global_AjaxUrl + '/orderList/editOrders',
                                    dataType: 'json',
                                    data: {
                                        'baai_user_token': cookieValue,
                                        'rawState': 2,
                                        'status': 3,
                                        'orderCodes': dCode
                                    },
                                    success: function (res) {
                                        console.log(res);
                                        $.toast(text + '成功');
                                        location.reload();
                                    },
                                    error: function () {
                                        console.log('Ajax error!');
                                    }
                                });

                            })
                        });
                    }

                    //  待评价
                    var remain = '';
                    var remain02 = '';
                    var remainList = '';
                    if (obj.showStatus == "已收货") {
                        //待评价订单渲染
                        remain = '<ul data-code="' + obj.code + '" data-userId="' + obj.userId + '">' +
                            '<li class="ref">' +
                            '<p>订单号 ' + obj.code + '</p>' +
                            '<p class="wait">待评价</p>' +
                            '</li>' +
                            '<li class="pickup">' +
                            '<p><i class="iconfont icon-shoujianren"></i>' + obj.consignee + ' ' + obj.mobile + '</p>' +
                            '<p>' + obj.address + '</p>' +
                            '</li>';
                        //待评价商品数据渲染
                        obj.detailList.forEach(function (list) {
                            remainList += '<li class="lst evaluation" data-shppingId="' + list.productId + '">' +
                                '<dl><dt><img src="' + list.productThumb + '"/></dt><dd><p>' +
                                '<span><strong>' + list.productName + '</strong></span>' +
                                '<span><u>规格：' + list.showCommoStandard + '</u></span></p>' +
                                '<p><span>￥' + list.showPrice + '</span><span><s>￥' + list.showOriginal + '</s></span><span>X' + list.num + '</span></p>' +
                                '</dd>' +
                                '</dl>' +
                                '</li>';
                        });
                        //功能数据渲染
                        remain02 = '<li class="pic">' +
                            '<p>运费：￥' + obj.postPrice + '</p>' +
                            '<p>共' + obj.detailSize + '件(含运费)：￥' + obj.showTotalPrice + '</p>' +
                            '</li>' +
                            '<li class="state">' +
                            '<p class="red pingjia"><a>立即评价</a></p>' +
                            '<p class="order_details">订单详情</p>' +
                            '<p class="popup_alert quer">删除订单</p>' +
                            '</li>' +
                            '</ul>';

                        $('.oders_list').append(remain + remainList + remain02);
                        remainList = '';
                        $('.pingjia').click(function () {
                            var codeid = $(this).parents('ul').attr('data-code');
                            var userId = $(this).parents('ul').attr('data-userId');
                            console.log(codeid);
                            window.location.href = "reviews.html?" + codeid + '&' + userId;
                        });
                        $('.evaluation').click(function () {
                            var id = $(this).attr('data-shppingId');
                            window.location.href = "product_detail.html?" + id + '?';
                        });
                        // 删除订单
                        $(document).on('click', '.quer', function () {
                            // 删除订单，订单状态改变
                            var dataCode = $(this).parents('ul').attr('data-code');
                            var stateremove = $(this).parents('ul');
                            var text = $(this).text();
                            $('.reconfirm').children('dl').children('dt').text('是否' + text + '？');
                            $('.reconfirm').css('display', '');
                            $('.cancel').click(function () {
                                $('.reconfirm').css('display', 'none');
                            })
                            $('.sure').click(function () {
                                $('.reconfirm').css('display', 'none');
                                stateremove.remove();
                                $.ajax({
                                    type: 'POST',
                                    url: $.global_AjaxUrl + '/orderList/deleteOrderInfo/' + dataCode,
                                    dataType: 'json',
                                    data: {
                                        'baai_user_token': cookieValue
                                    },
                                    success: function (res) {
                                        console.log(res);

                                    },
                                    error: function () {
                                        console.log('Ajax error!');
                                    }
                                });
                            })
                        });
                    }
                    // 已经完成
                    var achieve = '';
                    var achieve02 = '';
                    var achieveList = '';
                    if (obj.showStatus == "已完成") {
                        //待评价订单渲染
                        achieve = '<ul data-code="' + obj.code + '" data-userId="' + obj.userId + '">' +
                            '<li class="ref">' +
                            '<p>订单号 ' + obj.code + '</p>' +
                            '<p class="wait">已完成</p>' +
                            '</li>' +
                            '<li class="pickup">' +
                            '<p><i class="iconfont icon-shoujianren"></i>' + obj.consignee + ' ' + obj.mobile + '</p>' +
                            '<p>' + obj.address + '</p>' +
                            '</li>';
                        //待评价商品数据渲染
                        obj.detailList.forEach(function (list) {
                            achieveList += '<li class="lst evaluation" data-shppingId="' + list.productId + '">' +
                                '<dl><dt><img src="' + list.productThumb + '"/></dt><dd><p>' +
                                '<span><strong>' + list.productName + '</strong></span>' +
                                '<span><u>规格：' + list.showCommoStandard + '</u></span></p>' +
                                '<p><span>￥' + list.showPrice + '</span><span><s>￥' + list.showOriginal + '</s></span><span>X' + list.num + '</span></p>' +
                                '</dd>' +
                                '</dl>' +
                                '</li>';
                        });
                        //功能数据渲染
                        achieve02 = '<li class="pic">' +
                            '<p>运费：￥' + obj.postPrice + '</p>' +
                            '<p>共' + obj.detailSize + '件(含运费)：￥' + obj.showTotalPrice + '</p>' +
                            '</li>' +
                            '<li class="state">' +
                            '<p class="order_details">订单详情</p>' +
                            '<p class="popup_alert quer">删除订单</p>' +
                            '</li>' +
                            '</ul>';
                        $('.oders_list').append(achieve + achieveList + achieve02);
                        achieveList = '';
                        // 删除订单
                        $(document).on('click', '.quer', function () {
                            // 删除订单，订单状态改变
                            var dataCode = $(this).parents('ul').attr('data-code');
                            var stateremove = $(this).parents('ul');
                            var text = $(this).text();
                            $('.reconfirm').children('dl').children('dt').text('是否' + text + '？');
                            $('.reconfirm').css('display', '');
                            $('.cancel').click(function () {
                                $('.reconfirm').css('display', 'none');
                            })
                            $('.sure').click(function () {
                                $('.reconfirm').css('display', 'none');
                                stateremove.remove();
                                $.ajax({
                                    type: 'POST',
                                    url: $.global_AjaxUrl + '/orderList/deleteOrderInfo/' + dataCode,
                                    dataType: 'json',
                                    data: {
                                        'baai_user_token': cookieValue
                                    },
                                    success: function (res) {
                                        console.log(res);

                                    },
                                    error: function () {
                                        console.log('Ajax error!');
                                    }
                                });
                            })
                        });
                    }
                });
                $.hideIndicator();
                $.tabChange();
            },
            error: function (xhr, type) {
                console.log('Ajax error!')
            }
        });
    };
    // 加载
    $(document).ready(function () {
        // 判断用户是否登录
        if ($.global_iscookie()) {
            $.wait();
        } else {
            $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
        }
    });
})();
