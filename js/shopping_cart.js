(function () {
    /*** 全局调用function ***/
    var g_set_cho = $('.settlement .iconfont');   // 结算全选功能
    var g_del_cho = $('.del_select .iconfont');   // 已转发全选功能
    // 单选功能
    var g_choice = function (obj) {
        if (obj.is('.icon-yixuanze')) {
            obj.removeClass('icon-yixuanze').addClass('icon-weixuanze');
        } else {
            obj.removeClass('icon-weixuanze').addClass('icon-yixuanze');
        }
    };
    /****** 领券 ********/
    $(document).on('click','.voucher', function () {
        $.popup('.popup-about');
        $('.popup-overlay').addClass('close-popup');
        $('.editSpecifications').css('display','none');
        $('.popup-about').css('height','24rem');
        $('.getAcoupon').css('display','block');
        // $.ajax({
        //     type: 'GET',
        //     url: $.global_AjaxUrl + '/product/param/' + productId,
        //     data: { },
        //     dataType: 'json',
        //     timeout: 300,
        //     success: function (res) {
        //         // console.log(res);
        //     },
        //     error: function () {
        //         console.log('Ajax error!');
        //     }
        // });
    });
    /*** own ***/
    // 点击编辑的删除功能
    $.editanddelete = function () {
        // if ($.global_iscookie()) {
        if ( ($('.pull-right').text() == '编辑') ) {
            $('.pull-right').text('完成');
            $('.settlement ul').css('display', 'none');
            $('.settlement ol').css('display', '');
            $('.mask_layer').css('display', 'block');
        } else {
            $('.pull-right').text('编辑');
            $('.settlement ul').css('display', '');
            $('.settlement ol').css('display', 'none');
            $('.mask_layer').css('display', 'none');
        }
        // } else {
        //     $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
        // }
    };
    $(document).on('click', '.pull-right', function () {
        $.editanddelete();
    });
    // 计算总价
    $.total_price = function () {
        var checkiconfont = $('.consignment .choice .icon-yixuanze');
        var total = 0;
        checkiconfont.each(function () {
            var unitprice = $(this).parents('dl').find('.unitprice').text();
            var unitnum = $(this).parents('dl').find('.plnum input').val();
            var unit = unitprice * unitnum;
            total = total + unit;
        });
        $('#totalpice').text(total.toFixed(2));
        $('#tlementnum').text('结算(' + checkiconfont.length + ')');
    };
    // 购物车_点击勾选
    $(document).on('click', '.consignment .choice .iconfont', function () {
        g_choice($(this));
        var m_wx = $('.consignment .choice .icon-yixuanze').length;
        var m_if = $('.consignment .choice .iconfont').length;
        if (m_wx < m_if) {
            g_set_cho.removeClass('icon-yixuanze').addClass('icon-weixuanze');
        } else {
            g_set_cho.removeClass('icon-weixuanze').addClass('icon-yixuanze');
        }
        // 结算总价
        $.total_price();
    });
    // 结算全选
    g_set_cho.on('click', function () {
        g_choice($(this));
        var m_cls = $(this).attr('class');
        $('.consignment .choice .iconfont').each(function () {
            $(this).removeClass().addClass(m_cls);
        });
        // 结算总价
        $.total_price();
    });
    // 已转发_点击勾选
    $(document).on('click', '.prt .iconfont', function () {
        g_choice($(this));
        var m_wx = $('.prt .icon-yixuanze').length;
        var m_if = $('.prt .iconfont').length;
        if (m_wx < m_if) {
            g_del_cho.removeClass('icon-yixuanze').addClass('icon-weixuanze');
        } else {
            g_del_cho.removeClass('icon-weixuanze').addClass('icon-yixuanze');
        }
    });
    // 已转发全选
    $(document).on('click', '.del_select .iconfont', function () {
        g_choice($(this));
        var m_cls = $(this).attr('class');
        $('.prt .iconfont').each(function () {
            $(this).removeClass().addClass(m_cls);
        });
    });
})();
/*** 购物车 ***/
(function () {
    var baai_user_token = $.fn.cookie('baai_user_token');   // 用户cookie
    var buynow = false; // 立即下单||加入购物车
    // 保存数量
    $.addsubtractnum = function (cartItemId, num) {
        if($.global_iscookie()){
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/cart/numChange/' + cartItemId + '/' + num,
                data: { 'baai_user_token': baai_user_token },
                dataType: 'json',
                timeout: 300,
                success: function(res){
                    // console.log(res);
                },
                error: function(){
                    // console.log('Ajax error!');
                }
            })
        } else {
            $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
        }
    };
    //未登录购物车数量加减函数
    $.logoutaddsubtractnum = function (productId, num, cartkeylogout) {
        if(!$.global_iscookie()){
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/cart/numChangeN/' + num,
                data: {
                    'cartKey': cartkeylogout,
                    'productId': productId
                },
                dataType: 'json',
                timeout: 300,
                success: function(res){
                    console.log(res);
                },
                error: function(){
                    // console.log('Ajax error!');
                }
            })
        }
    };
    // 封装获取数据
    $.RefreshCart = function () {
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/cart/list',
            data: {
                'baai_user_token': baai_user_token,
                'cartKey' :  $.fn.cookie('cartKey')
            },
            dataType: 'json',
            timeout: 300,
            success: function(res){
                console.log(res);
                res.data.forEach(function (data) {
                    $('.consignment').append(
                        '<dl data-id="' + data.id + '">' +
                        '<dt class="choice"><i class="iconfont icon-weixuanze"></i></dt>' +
                        '<dt class="pic"><img src="' + data.thumb + '" /></dt>' +
                        '<dd data-productId="' + data.productId + '">' +
                        '<p class="plname">' + data.productName + '</p>' +
                        '<p class="plsepc open-about">' + data.commoStandardValue + '<i class="iconfont icon-xiala"></i></p>' +
                        '<p class="plprice">' +
                        '<span>￥<strong class="unitprice">' + data.price.toFixed(2) + '</strong></span>' +
                        '<span class="plnum global-number">' +
                        '<a href="javascript:;" class="subtraction">-</a>' +
                        '<input type="text" value="' + data.num + '" />' +
                        '<a href="javascript:;" class="addition">+</a>' +
                        '</span>' +
                        '</p>' +
                        '</dd>' +
                        '<dd class="mask_layer">遮罩层</dd>' +
                        '</dl>'
                    );
                });
                if (res.data.length < 1) {
                    $('.consignment').append(
                        '<div class="global-nothing">' +
                        '<p><svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-none"></use></svg></p>' +
                        '<p>「空空如也」</p>' +
                        '</div>'
                    );
                }
            },
            error: function(){
                console.log('Ajax error!');
            }
        });
    };
    // 购物车列表
    $(document).ready(function() {
        $.RefreshCart();
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
    // 加减数量
    $(document).on('click', '.consignment .global-number', function () {
       if ($.global_iscookie()) {
            var cartItemId =  $(this).parents('dl').attr('data-id');
            var num = $(this).children('input').val();
            $.addsubtractnum(cartItemId, num);
            $.total_price();
         } else {
            var productID = $(this).parents('dl').children('dd').attr('data-productId');
            var cartkay =  $.fn.cookie('cartKey')
            var num = $(this).children('input').val();
            $.logoutaddsubtractnum(productID, num, cartkay);
            $.total_price();
       }
    });
    // 输入数量
    $(document).on('blur', '.consignment .global-number input', function () {
        if ($.global_iscookie()) {
        var cartItemId =  $(this).parents('dl').attr('data-id');
        var num = $(this).val();
        $.addsubtractnum(cartItemId, num);
        $.total_price();
        } else {
            var productID = $(this).parents('dl').children('dd').attr('data-productId');
            var cartkay =  $.fn.cookie('cartKey')
            var num = $(this).val();
            $.logoutaddsubtractnum(productID, num, cartkay);
            $.total_price();
        }
    });
    // 删除
    $(document).on('click', '.setDel', function () {
        var dataId = new Array();
        var productId = new Array();
        $('.consignment .choice .icon-yixuanze').each(function (index) {
            dataId[index] = $(this).parents('dl').attr('data-id');
        });
        $('.consignment .choice .icon-yixuanze').each(function (index) {
            productId[index] = $(this).parents('dl').children('dd').attr('data-productId');
        });
        if ($('.consignment .choice .icon-yixuanze').length > 0) {
            // if ($.global_iscookie()) {
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/cart/delete/' + dataId,
                data: {'baai_user_token': baai_user_token , 'cartKey': $.fn.cookie('cartKey') , 'productIds' : productId},
                dataType: 'json',
                timeout: 300,
                success: function (res) {
                    // console.log(res);
                    $('.consignment .choice .icon-yixuanze').each(function (index) {
                        $(this).parents('dl').remove();
                    });
                    $.editanddelete();   // 编辑删除功能
                    if ($('.consignment dl').length == 0) {
                        location.reload();
                    };
                },
                error: function () {
                    console.log('Ajax error!');
                }
            });
            // } else {
            //     $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
            // }
        } else {
            $.toast('请勾选商品');
        }
        // 结算总价重置
        $('#totalpice').text((0).toFixed(2));
        $('#tlementnum').text('结算(0)');
    });
    // 规格&参数
    $(document).on('click','.consignment .open-about', function () {
        $.popup('.popup-about');
        $('.popup-about').css('height','');
        $('.popup-overlay').addClass('close-popup');
        $('.getAcoupon').css('display','none');
        $('.editSpecifications').css('display','block');
        var productId = $(this).parents('dd').attr('data-productId');   // 商品ID
        var productImg = $(this).parents('dl').children('.pic').children('img').attr('src');    // 商品图片
        var productName = $(this).parents('dl').find('.plname').text();  // 商品名称
        var productPrice = $(this).parents('dl').find('.unitprice').text();  // 商品价格
        $.global_editSpecifications(productId, productImg, productName, productPrice);
    });
    /*** 加入购物车&&立即下单 ***/
    // 选择规格
    $(document).on('click', '.consignment .plsepc', function () {
        buynow = false;
    });
    // 加入购物车
    $(document).on('click', '.forwardCart', function () {
        buynow = false;
    });
    /// 立即下单
    $(document).on('click', '.forwardBuynow', function () {
        buynow = true;
    });
    // 规格&&参数=>确定
    $(document).on('click', '.editSpecifications .confirm', function () {
        var productId = $('.editSpecifications ul').attr('data-productid');
        var num = $('.editSpecifications input').val();
        var commoId = $('.editSpecifications .choice').attr('data-id');
        $.global_editSpecifications_confirm(true, productId, num, commoId, buynow);
    });
    // 结算
    $(document).on('click', '#tlementnum', function () {
        if ($.global_iscookie()) {
        var checkiconfont = $('.consignment .icon-yixuanze');
        var dataId = new Array();
        checkiconfont.each(function (index) {
            dataId[index] = $(this).parents('dl').attr('data-id');
        });
        if (dataId.length > 0) {
            window.location.href = "pre_order.html?" + dataId;
        } else {
            $.toast('请选择商品');
        }
        } else {
            $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
        }
    });
    // 移至收藏夹
    $(document).on('click', '.setCollection', function () {
        var productIds = new Array();
        $('.consignment .choice .icon-yixuanze').each(function (index) {
            productIds[index] = $(this).parents('dl').find('dd').attr('data-productid');
        });
        if ($('.consignment .choice .icon-yixuanze').length > 0) {
            if ($.global_iscookie()) {
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/productSave/save',
                    data: {
                        'baai_user_token': baai_user_token,
                        'productIds' : productIds.join(',')
                    },
                    dataType: 'json',
                    timeout: 300,
                    success: function (res) {
                        console.log(res);
                        $.toast('已成功移入收藏夹');
                        $.editanddelete();   // 编辑删除功能
                    },
                    error: function () {
                        console.log('Ajax error!');
                    }
                });
            } else {
                $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
            }
        } else {
            $.toast('请选择商品');
        }
    });
})();
/*** 已转发 ***/
(function () {
    var baai_user_token = $.fn.cookie('baai_user_token');   // 用户cookie
    // 初始化加载
    $(document).ready(function() {
        if($.global_iscookie()){
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/cart/retransmit/list',
                data: { 'baai_user_token': baai_user_token },
                dataType: 'json',
                timeout: 300,
                success: function(res){
                    console.log(res);
                    res.data.forEach(function (obj) {
                        $('.forward_list').append(
                            '<div class="prt" data-id="' + obj.id + '">' +
                            '<dl data-productId="' + obj.productId + '">' +
                            '<dt class="choice"><i class="iconfont icon-weixuanze"></i></dt>' +
                            '<dt class="pic"><img src="' + obj.thumb + '" /></dt>' +
                            '<dd>' +
                            '<p class="plname">' + obj.productName + '</p>' +
                            '<p class="plsepc">￥<span>' + obj.price.toFixed(2) + '</span></p>' +
                            '</dd>' +
                            '</dl>' +
                            '<ul>' +
                            '<li class="open-about forwardCart">加入购物车</li>' +
                            '<li class="open-about forwardBuynow">立即下单</li>' +
                            '</ul>' +
                            '</div>'
                        );
                    });
                    if (res.data.length < 1) {
                        $('.forward_list').append(
                            '<div class="global-nothing" style="padding-top: 51.6%;">' +
                            '<p><svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-none"></use></svg></p>' +
                            '<p>「空空如也」</p>' +
                            '</div>'
                        );
                    }
                },
                error: function(){
                    console.log('Ajax error!');
                }
            });
        } else {
            $('.global-nothing').css('display', '');
        }
    });
    // 加入购物车
    $(document).on('click','.forward_list .open-about', function () {
        $.popup('.popup-about');
        $('.popup-overlay').addClass('close-popup');
        $('.popup-about').css('height','');
        $('.getAcoupon').css('display','none');
        $('.editSpecifications').css('display','block');
        var productId = $(this).parents('.prt').children('dl').attr('data-productId');
        var productImg = $(this).parents('.prt').find('img').attr('src');
        var productName = $(this).parents('.prt').find('.plname').text();
        var productPrice = $(this).parents('.prt').find('.plsepc').children('span').text();
        $.global_editSpecifications(productId, productImg, productName, productPrice);
    });
    // 删除
    $(document).on('click', '.forward_list .del_select ul', function () {
        var dataId = new Array();
        $('.forward_list .prt .icon-yixuanze').each(function (index) {
            dataId[index] = $(this).parents('.prt').attr('data-id');
        });
        if ($('.forward_list .prt .icon-yixuanze').length > 0) {
            if ($.global_iscookie()) {
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/cart/retransmit/delete/' + dataId,
                    data: {'baai_user_token': baai_user_token},
                    dataType: 'json',
                    timeout: 300,
                    success: function (res) {
                        // console.log(res);
                        $('.forward_list .prt .icon-yixuanze').each(function (index) {
                            $(this).parents('.prt').remove();
                        });
                        if ($('.forward_list .prt').length == 0) {
                            location.reload();
                        };
                    },
                    error: function () {
                        console.log('Ajax error!');
                    }
                });
            } else {
                $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
            }
        } else {
            $.toast('请选择商品');
        }
    });
})();