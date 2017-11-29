(function () {
    var baai_user_token = $.fn.cookie('baai_user_token');   // 用户cookie
    var isMobile = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var dataCode = window.location.href.split('?')[1];   // 获取url
    dataCode = decodeURI(dataCode);   // 解码
    var dataID = '';
    $.global_area();    // 载入城市联动
    // 修改地址
    $(document).on('click', '.modify_add', function () {
        console.log(1);
        $.popup('.popup-about');
        $('.popup-overlay').addClass('close-popup');
        var name = $('#address .name').text();   // 姓名
        var phone = $('#address .phone').text();   // 电话
        $('.add_name').val(name);   // 姓名
        $('.add_tel').val(phone);   // 电话
    });
    // 新增收件人
    $(document).on('click', '.add_ok', function () {
        var consignee = $('.add_name').val();   // 收件人
        var mobile = $('.add_tel').val();   // 移动电话
        var province = $('.global-area .province').val();    // 省份
        var city = $('.global-area .city').val();    // 城市
        var district = $('.global-area .county').val();    // 区县
        var addr = $('.add_add').val();  // 详细地址
        var card = $('.add_card').val();    // 身份证号
        if (consignee == '') {
            $.toast('姓名不能为空');
        } else if (mobile == '') {
            $.toast('手机号码不能为空');
        } else if (!isMobile.test(mobile)) {
            $.toast('手机号码格式错误');
        } else if (province == '') {
            $.toast('请选择省份');
        } else if (city == '') {
            $.toast('请选择城市');
        } else if ($('.global-area .county').is('.global-none') == false && district == '') {
            $.toast('请选择区/县');
        } else if (addr == '') {
            $.toast('请填写详细地址');
        } else {
            if($.global_iscookie()){
                console.log('成功');
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/orderList/orderDetail/changAddr/' + dataID,
                    data: {
                        'consignee': consignee,
                        'mobile': mobile,
                        'province': province,
                        'city': city,
                        'district': district,
                        'addr': addr,
                        'card': card
                    },
                    dataType: 'json',
                    success: function(res){
                        console.log(res);
                        location.reload();  // 页面刷新
                    },
                    error: function(){
                        console.log('Ajax error!');
                    }
                });
            } else {
                $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
            }
        }
    });
    // 取消订单
    $(document).on('click', '.cancel_order', function () {
        $.ajax({
            type: 'POST',
            url: $.global_AjaxUrl + '/orderList/editOrders',
            dataType: 'json',
            data: {
                'baai_user_token': baai_user_token,
                'orderCodes': new Array(dataCode),
                'rawState': 0,
                'status': 4
            },
            success: function (res) {
                console.log(res);
                $.toast('成功取消订单');
                window.location.href = 'order_customer.html#1';
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    });
    // 删除订单
    $(document).on('click', '.delete_order', function () {
        $.ajax({
            type: 'POST',
            url: $.global_AjaxUrl + '/orderList/deleteOrderInfo/' + dataCode,
            dataType: 'json',
            data: {
                'baai_user_token': baai_user_token
            },
            success: function (res) {
                console.log(res);
                $.toast('删除成功');
                window.location.href = 'order_customer.html#0';
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    });
    // 确认收货
    $(document).on('click', '.confirm_order', function () {
        $.ajax({
            type: 'POST',
            url: $.global_AjaxUrl + '/orderList/editOrders',
            dataType: 'json',
            data: {
                'baai_user_token': baai_user_token,
                'orderCodes': new Array(dataCode),
                'rawState': 2,
                'status': 3
            },
            success: function (res) {
                console.log(res);
                $.toast('已确认收货');
                location.reload();
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    });
    // 立即评价
    $(document).on('click', '.evaluate_order', function () {
        window.location.href = 'reviews.html?' + dataCode;
    });
    // 立即支付
    $(document).on('click', '.payment_order', function () {
        window.location.href = 'payment.html?' + dataCode;
    });
    // 订单操作状态
    $.orderState = function () {
        var orderState = $('.order_state').text();
        if (orderState == '已完成') {
            $('.order_detail_operation').html('<p class="g_button_line delete_order">删除订单</p>');
        }
        if (orderState == '待支付') {
            $('.order_detail_operation').html('<p class="g_button_line cancel_order">取消订单</p><p class="g_button_line modify_add">修改地址</p><p class="g_button_bgclor payment_order">立即支付</p>');
        }
        if (orderState == '待发货') {
            $('.order_detail_operation').html('<p class="g_button_bgclor" onclick=$.toast("已提醒卖家发货")>提醒发货</p>');
        }
        if (orderState == '待收货') {
            $('.order_detail_operation').html('<p class="g_button_bgclor confirm_order">确认收货</p>');
        }
        if (orderState == '已收货') {
            $('.order_detail_operation').html('<p class="g_button_bgclor evaluate_order">立即评价</p>');
        }
    };
    // 加载订单
    $(document).ready(function() {
        $('#showCode').text(dataCode); // 订单号
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/orderList/orderDetail/' + dataCode,
            data: { 'baai_user_token': baai_user_token },
            dataType: 'json',
            // timeout: 300,
            success: function (res) {
                console.log(res);
                res.data.order.detailList.forEach(function (data) {
                    $('.order_prods').append(
                        '<dl data-productId="' + data.productId + '">' +
                            '<dt><img src="' + data.productThumb + '" /></dt>' +
                            '<dd>' +
                                '<p>' +
                                    '<span class="plname">' + data.productName + '</span>' +
                                    '<span class="plsepc">' + data.showCommoStandard + '</span>' +
                                '</p>' +
                                '<p class="plpic">' +
                                    '<span>￥' + data.showPrice.toFixed(2) + '</span>' +
                                    '<span>x' + data.num + '</span>' +
                                '</p>' +
                            '</dd>' +
                        '</dl>'
                    );
                });
                dataID = res.data.order.id; //订单ID
                $('#address .name').text(res.data.order.consignee);   // 姓名
                $('#address .phone').text(res.data.order.mobile);   // 电话
                $('#address .addr').text(res.data.order.address);   // 详细地址
                $('#showPrice').text('￥' + res.data.order.showPayPrice.toFixed(2)); // 货款
                $('#postPrice').text('￥' + res.data.order.showPostPrice.toFixed(2)); // 运费
                $('#payPrice').text('￥' + res.data.order.showTotalPrice.toFixed(2));  // 实付
                $('.order_state').text(res.data.order.showStatus);   // 订单状态
                $('#createTime').text(res.data.order.createTimeStr);    // 下单时间
                // 备注
                if (res.data.order.message == null || res.data.order.message == '') {
                    $('#remarks').parents('dl').css('display', 'none');
                } else {
                    $('#remarks').text(res.data.order.message).parents('dl').css('display', '');
                };
                $.orderState(); //  操作状态
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    });
})();