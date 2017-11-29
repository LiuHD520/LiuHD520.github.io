(function () {
    // 说明
    $(document).on('click', '.open-about-illustra', function () {
        $.popup('.popup-about-illustra');
        $('.popup-overlay').addClass('close-popup');
    });
    // 提示弹框：会员说明
    $(document).on('click', '.open_member_explain', function () {
        var explain_src = $(this).children('img').attr('src');
        var explain_tit = $(this).children('strong').text();
        var explain_txt = $(this).children('span').text();
        $('.member_explain img').attr('src', explain_src);
        $('.member_explain span').text(explain_tit);
        $('.member_explain .explain').text(explain_txt);
        $('.member_explain').css('display', '');
    });
    $('.member_explain .close').on('click', function () {
        $('.member_explain').css('display', 'none');
    });
    // 后退
    $(document).on('click', '.pull-left', function () {
        sessionStorage.clear(); // 清空
    });
    // 品牌列表页
    $(document).on('click', '#brandName', function () {
        var brandId = $(this).attr('data-brandid');
        window.location.href = 'brand_products.html?' + brandId + '?';
    });
    // 八爱长图
    $(document).on('click', '.get_longimg', function () {
        $.popup('.popup_get_longimg');
        var svgCode = $('#global-qrcode img').attr('src');
        var svgTitle = $('#productName').text();    // 商品标题
        var svgSwipe = $('#mySwipe img')[0].src;    // 商品图
        // var svgSwipe = 'https://img.alicdn.com/bao/uploaded/i4/1652528654/TB1CZCka.gQMeJjy0FfXXbddXXa_!!0-item_pic.jpg';    // 商品图
        $.global_draw(svgCode, svgTitle, svgSwipe);
    });
})();
/*** 复制 ***/
(function () {
    $.illustra = function () {
        var clipboard = new Clipboard(".copy_ner");
        clipboard.on('success', function(e) {
            $.toast('已复制');
        });
        clipboard.on('error', function(e) {
            $.toast('复制失败');
        });
    };
    $(document).on('click', '.copy_ner', function () {
        $.illustra();
    });
})();
/*** AJAX ***/
(function () {
    var baai_user_token = $.fn.cookie('baai_user_token');   // 用户cookie
    var productId = window.location.href.split('?')[1];   // 获取url
    productId = decodeURI(productId);   // 解码
    // 初始化
    var errorAJAX = 0;  // 请求出错
    var errorAJAX02 =0;
    var timeoutAJAX = 300;  // 请求时间
    var timeoutAJAX02 = 300;
    $.fn.product_detail = function () {
            $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/' + productId,
            data: { 'baai_user_token': baai_user_token },
            dataType: 'json',
            timeout: timeoutAJAX,
            success: function (res) {
                console.log(res);
                if (res.status == 400) {
                    console.log(res.msg);
                    if (errorAJAX < 4) {
                        timeoutAJAX += 300;
                        errorAJAX++;
                        $.fn.product_detail(); // 重试
                    } else {
                        $.global_nothing('icon-empty', res.msg);
                        $('footer').css('display', 'none');
                    }
                } else {
                    // 商品主图
                    res.data.imgs.forEach(function (imgs) {
                        $('.swipe-wrap').append('<a href="javascript:;"><img src="' + imgs + '" /></a>');
                    });
                    $.global_banner();  // 主图轮播
                    // 商品ID
                    $('body').attr('data-productId', res.data.id);
                    // 是否收藏
                    if (res.data.isSaved == 0) {
                        $('.icon-caininxihuan-shoucang').removeClass('yi_shoucang');
                    } else {
                        $('.icon-caininxihuan-shoucang').addClass('yi_shoucang');
                    }
                    // 商品名称
                    $('#productName').text(res.data.productName);
                    // title名称
                    $('.title01').text(res.data.productName + '－八爱网');
                    //meta
                    $("head").append('<meta http-equiv="content-type" name="description"  content="text/html;charset=utf-8" />');
                    $("meta[http-equiv='content-type']").attr('content', "八爱网帮您全球美妆搜索到{商品名称}进行美妆海淘，每个用户对" + res.data.productName + "的评论，每家商家对" + res.data.productName + "的报价、优惠券、返利，无一遗漏，尽在八爱网。");
                    // 品牌名称
                    if (res.data.brandName == null) {
                        $('#brandName').parents('.brand_name').css('display', 'none');
                    } else {
                        $('#brandName').text(res.data.brandName).attr('data-brandId', res.data.brandId);
                    }
                    // 商品原价
                    $('#origPrice').text(parseInt(res.data.origPrice).toFixed(2));
                    // 商品积分
                    $('#productScore').text(res.data.score);
                    // 商品现价
                    $('#showPrice').text(parseInt(res.data.showPrice).toFixed(2));
                    // 商品库存
                    $('#express_stock').text(res.data.stock);
                    // 商品已售
                    $('#express_num').text(res.data.num);
                    // 商品详情
                    $('#product_detail').html(res.data.description);
                    // 复制文案
                    $('.cdity_copy p').text(res.data.productName);
                    $('.cdity_copy .copy_ner').attr('data-clipboard-text', res.data.productName + ' ' + window.location.href);
                }
            },
            error: function () {
                console.log('Ajax error!');
                if (errorAJAX < 3) {
                    timeoutAJAX += 300;
                    errorAJAX++;
                    $.fn.product_detail(); // 重试
                } else {
                    $.toast('网络出错');
                }
            }
        });
    }
        // 商品评价
    $.fn.product_comment = function () {
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/product/comment/' + productId,
            data: { },
            dataType: 'json',
            // timeout: 300,
            success: function (res) {
                console.log(res);
                if(res.status == 400){
                    if (errorAJAX02 < 4) {
                        timeoutAJAX02 += 300;
                        errorAJAX02++;
                        $.fn.product_comment(); // 重试
                    } else {
                        $.toast(res.msg + '请重新刷新');
                    }
                }else{
                    if (res.data.proReviews.length > 0) {
                        res.data.proReviews.forEach(function (data) {
                            $('.comments').append(
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
                    } else {
                        $('.comments').append('<div class="global-nothing"><svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-none"></use></svg>「暂无评价」</div>')
                    }
                }
            },
            error: function () {
                console.log('Ajax error!');
                if (errorAJAX02 < 3) {
                    timeoutAJAX02 += 300;
                    errorAJAX02++;
                    $.fn.product_comment(); // 重试
                } else {
                    $.toast('网络出错');
                }
            }
        });
    }

$(document).ready(function() {
    $.fn.product_detail();
    $.fn.product_comment();
});
    // 取消&收藏
    $(document).on('click', '.icon-caininxihuan-shoucang', function () {
        var dataProductId = $('body').attr('data-productId');
        if($.global_iscookie()){
            if ($(this).is('.yi_shoucang') == true) {
                $(this).removeClass('yi_shoucang');
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/productSave/cancel/' + dataProductId,
                    data: { 'baai_user_token': baai_user_token },
                    dataType: 'json',
                    timeout: 300,
                    success: function (res) {
                        console.log(res);
                    },
                    error: function () {
                        console.log('Ajax error!');
                    }
                });
            } else {
                $(this).addClass('yi_shoucang');
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/productSave/save/' + dataProductId,
                    data: { 'baai_user_token': baai_user_token },
                    dataType: 'json',
                    timeout: 300,
                    success: function (res) {
                        console.log(res);
                    },
                    error: function () {
                        console.log('Ajax error!');
                    }
                });
            }
        } else {
            $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
        }
    });
    /*** 立即下单&&加入购物车 ***/
    // 商品规格
    var buynow = false; // 立即下单 || 加入购物车
    $(document).on('click','.open-about', function () {
        $.popup('.popup-about');
        $('.popup-overlay').addClass('close-popup');
        // 立即下单 || 加入购物车
        if ($(this).text() == '立即下单') { buynow = true; } else { buynow = false; }
        var productId = $('body').attr('data-productId');
        var productImg = $('.swipe-wrap img')[0].src;
        var productName = $('#productName').text();
        var productPrice = $('#showPrice').text();
        $.global_editSpecifications(productId, productImg, productName, productPrice);
    });
    // 确认下单
    $(document).on('click', '#confirm', function () {
        var productId = $(this).parents('.editSpecifications').find('ul').attr('data-productid');
        var num = $(this).parents('.editSpecifications').find('input').val();
        var commoId = $(this).parents('.editSpecifications').find('.choice').attr('data-id');
        // if($.global_iscookie()){
            $.global_editSpecifications_confirm(false, productId, num, commoId, buynow);
        // } else {
        //     $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
        // }
    });
    // 商品参数
    $(document).on('click','.open-about-par', function () {
        $.popup('.popup-about-par');
        $('.popup-overlay').addClass('close-popup');
        var productId = $('body').attr('data-productId');
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/product/param/' + productId,
            data: { },
            dataType: 'json',
            timeout: 300,
            success: function (res) {
                // console.log(res);
                $('.product_parameter .content').empty().append('<p><span>商品名称</span>' + $('#productName').text() + '</p>').append('<p><span>品牌</span>' + $('#brandName').text() + '</p>');
                res.data.paramList.forEach(function (data) {
                    if (data.value != '' && data.value != undefined) {
                        $('.product_parameter .content').append('<p><span>' + data.name + '</span>' + data.value + '</p>');
                    }
                })
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    });
    // 商品评价
    $(document).on('click', '#evaluation', function () {
        window.location.href = "product_comments.html?" + productId;
    });
    // 转发售卖
    $(document).on('click', '#forward_sale', function () {
        // $.illustra();
        window.location.href = "material_library.html?" + productId;
    });
    // 生成二维码
    $.global_QRcode('https://m.baai.com/product_detail.html?' + productId + '?');
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
})();