(function () {
    // 综合排序
    $(document).on('click', '.compared_sort dt', function () {
        $('.compared_sort dd').css('display', 'none');
        $(this).next('dd').css('display', '');
    });
    // 搜索
    $(document).on('click', '.search-input', function() {
        window.location.href = 'search_page.html';
    });
    // 跳转详情
    $(document).on('click', '.product_list dl', function () {
        var dataId = $(this).attr('data-id');
        window.location.href = 'product_detail.html?' + dataId + '?';
    });
    // 跳转品牌页
    $(document).on('click', '.plbrand .plbrand-detail', function () {
        var brandId = $(this).parent().attr('data-brandid');
        window.location.href = 'brand_products.html?' + brandId + '?';
    });
    // 选择品牌
    $(document).on('click', '.brand_option .content p', function () {
        if ($(this).is('.selected')) {
            $(this).removeClass();
        } else {
            $(this).addClass('selected').siblings().removeClass();
        }
    })
})();
/*** AJAX ***/
(function () {
    var baai_user_token = $.fn.cookie('baai_user_token');   // 用户cookie
    var typeId = window.location.href.split('?')[1];   // 获取url
    typeId = decodeURI(typeId);   // 解码
    var isAJAX = false; // 请求
    var scrollPage = 1; // 页码
    // 封装搜索
    $.serchAJAX = function () {
        // $.showIndicator();
        var dataType = $('#all_filt').attr('data-type');
        var dataOrder = $('#all_filt').attr('data-order');
        var dataSorter = $('#all_filt').attr('data-sorter');
        var brandId = $('.brand_option .selected').attr('data-id');
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/type/' + typeId,
            data: {
                'page': scrollPage,
                'order': dataOrder,
                'sorter': dataSorter,
                'type': dataType,
                'brandId': brandId
            },
            dataType: 'json',
            success: function (res) {
                console.log(res);
                res.data.products.forEach(function (data) {
                    // 筛选null品牌
                    if (data.brandName == null) {
                        $('.product_list').append(
                            '<dl data-id="' + data.id + '">' +
                            '<dt><img src="' + data.thumb + '_w200.jpg" /></dt>' +
                            '<dd>' +
                            '<p class="plname">' + data.name + '</p>' +
                            '<p class="plprice"><span>￥<strong>' + data.price.toFixed(2) + '</strong></span><span class="stork">' + data.num + '人购买</span></p>' +
                            '</dd>' +
                            '</dl>'
                        );
                    } else {
                        $('.product_list').append(
                            '<dl data-id="' + data.id + '">' +
                            '<dt><img src="' + data.thumb + '_w200.jpg" /></dt>' +
                            '<dd>' +
                            '<p class="plname">' + data.name + '</p>' +
                            '<p class="plbrand" data-brandId="' + data.brandId + '"><span class="plbrand-detail">' + data.brandName + '</span></p>' +
                            '<p class="plprice"><span>￥<strong>' + data.price.toFixed(2) + '</strong></span><span class="stork">' + data.num + '人购买</span></p>' +
                            '</dd>' +
                            '</dl>'
                        );
                    }
                    // // title名称
                    // $('.titleHead').text(data.name+'_最低、最全、最好，尽在八爱网');
                    // //meta
                    // $("head").append('<meta http-equiv="content-type" name="description"  content="text/html;charset=utf-8" />');
                    // $("meta[http-equiv='content-type']").attr('content',"八爱网为你精心准备多款"+data.name+"产品,在八爱网海淘"+data.name+"各品牌的价格，看大家的"+data.name+"购买分享，帮您找到最喜欢的品牌，最适合自己的商品。");
                    //
                    // $("head").append('<meta http-equiv="content-type" name="Keywords"  content="text/html;charset=utf-8" />');
                    // $("meta[http-equiv='content-type']").attr('content',""+data.name+"报价,"+data.name+"购买，"+data.name+"分享，品牌导购，搜索排行榜，"+data.name+"返利, "+data.name+"折扣，八爱网,海淘特卖惠，购物返利");

                });
                if (res.data.productSize < 10) {
                    scrollPage = 0;
                } else {
                    scrollPage++;
                }
                isAJAX = true;
                // $.hideIndicator();
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    };
    // 请求
    $(document).ready(function() {
        // $('#search').val(typeId);
        $.serchAJAX();  // 搜索
        // 品牌筛选
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/type/' + typeId,
            data: {  },
            dataType: 'json',
            success: function (res) {
                // console.log(res);
                res.data.brands.forEach(function (data) {
                    $('.brand_option .content').append('<p data-id="' + data.id + '">' + data.name + '</p>');
                })
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    });
    // 无限滚动
    $('#scrollContent').scroll(function() {
        var div_height = document.getElementById('scrollContent').scrollHeight;
        var window_height = $(this).height();
        var scroll_top = $(this).scrollTop();
        var scrollBottom = div_height - window_height - scroll_top;
        if (scrollBottom <= 50 && scrollPage > 0 && isAJAX==true) {
            isAJAX = false;
            $.serchAJAX();  // 搜索
        }
    });
    // 排序筛选
    $(document).on('click', '.compared_sort p', function () {
        var dataType = $(this).attr('data-type');
        var dataOrder = $(this).attr('data-order');
        var dataSorter = $(this).attr('data-sorter');
        var dataText = $(this).text();
        var eleDt = $(this).parents('dl').children('dt');
        eleDt.attr('data-type', dataType);
        eleDt.attr('data-order', dataOrder);
        eleDt.attr('data-sorter', dataSorter);
        eleDt.html(dataText + '<i class="iconfont icon-xiala"></i>');
        $('.compared_sort dd').css('display', 'none');
        scrollPage = 1; // 页码
        isAJAX = false; // 请求
        $('.product_list').empty();  // 清空;
        $.serchAJAX();  // 搜索
    });
    // 打开品牌筛选
    var oldDataId = '';
    $(document).on("click", ".my-btn", function() {
        $.openPanel("#panel-js-demo");
        oldDataId = $('.brand_option .selected').attr('data-id');
    });
    // 品牌筛选
    $(document).on('click', '#brand_screen', function () {
        var newDataId = $('.brand_option .selected').attr('data-id');
        console.log(oldDataId, newDataId);
        if (oldDataId != newDataId) {
            $('.product_list').empty();  // 清空;
            scrollPage = 1; // 页码
            isAJAX = false; // 请求
            $.serchAJAX();  // 搜索
        }
    });
})();