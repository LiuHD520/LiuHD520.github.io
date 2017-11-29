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
    $(document).on('click', '.plbrand', function () {
        var brandid = $(this).attr('data-brandid');
        window.location.href = 'brand_products.html?' + brandid + '?';
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
    var productName = window.location.href.split('?')[1];   // 获取url
    productName = decodeURI(productName);   // 解码
    var isAJAX = false; // 请求
    var scrollPage = 1; // 页码
    // 封闭搜索
    $('.titleHead').text(productName+'_最低、最全、最好');
    var errorAJAX = 0;  // 请求出错
    var timeoutAJAX = 300;  // 请求时间
    $.fn.searchResult = function () {
        console.log(timeoutAJAX);
        var dataorder = $('#all_filt').attr('data-order');
        var datasort = $('#all_filt').attr('data-sorter');
        var brandName = $('.brand_option .selected').text();
        var brandId = $('.brand_option .selected').attr('data-brandid');
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/forword/search',
            timeout:300,
            data: {
                'name': productName,
                'page': scrollPage,
                'sort': datasort,
                'order': dataorder,
                'brandName': brandName,
                'brandId': brandId
            },
            dataType: 'json',
            success: function (res) {
                console.log(res);
                res.res.products.forEach(function (data) {
                    var discussNumber = data.discussNumber == null ? 0:data.discussNumber;   // 筛选null评价
                    // 筛选null品牌
                    if (data.brandName == null) {
                        $('.product_list').append(
                            '<dl data-id="' + data.id + '">' +
                            '<dt><img src="' + data.thumb + '_w200.jpg" /></dt>' +
                            '<dd>' +
                            '<p class="plname">' + data.name + '</p>' +
                            '<p class="plprice"><span>￥<strong>' + data.price + '</strong></span><span class="stork">' + discussNumber + '人评价</span></p>' +
                            '</dd>' +
                            '</dl>'
                        );
                    } else {
                        $('.product_list').append(
                            '<dl data-id="' + data.id + '">' +
                            '<dt><img src="' + data.thumb + '_w200.jpg" /></dt>' +
                            '<dd>' +
                            '<p class="plname">' + data.name + '</p>' +
                            '<p class="plbrand" data-brandId="' + data.brandId + '"><span>' + data.brandName + '</span></p>' +
                            '<p class="plprice"><span>￥<strong>' + data.price + '</strong></span><span class="stork">' + discussNumber + '人评价</span></p>' +
                            '</dd>' +
                            '</dl>'
                        );
                    }
                    // meta
                    // $("head").append('<meta http-equiv="content-type" name="Keywords"  content="text/html;charset=utf-8" />');
                    // $("meta[http-equiv='content-type']").attr('content',"购买"+data.name+"，分享"+brandName+"，品牌导购，搜索排行榜，"+data.name+"返利，"+data.name+"折扣，八爱网,海淘特卖惠，购物返利");
                    // $("head").append('<meta http-equiv="content-type" name="description"  content="text/html;charset=utf-8" />');
                    // $("meta[http-equiv='content-type']").attr('content',"八爱网为您找到最多的"+data.name+"美妆海淘，最全的"+data.brandName+"品牌信息，最好的{搜索关键词}购买分享，一切尽在八爱网。");
                });
                // 品牌数据
                if ($.trim($('.brand_option .content').text()) == '') {
                    res.res.brandList.forEach(function (data) {
                        // console.log(text);
                        $('.brand_option .content').append('<p data-brandId="' + data.brandId + '">' + data.brandName + '</p>');
                    });
                }
                // 无限刷新
                if (res.res.products.length < 10) {
                    scrollPage = 0;
                } else {
                    scrollPage++;
                }
                isAJAX = true;
                if (res.res.products.length < 1 && scrollPage > 0) {
                    $.global_nothing('icon-none', '「暂无商品」');
                }
                timeoutAJAX = 300;
            },
            error: function () {
                console.log('Ajax error!');
                if (errorAJAX < 3) {
                    timeoutAJAX += 300;
                    errorAJAX++;
                    $.fn.searchResult(); // 重试
                } else {
                    $.toast('网络出错');
                }
            }
        });
    };
    // 请求
    $(document).ready(function() {
        $('#search').val(productName);
        $.fn.searchResult();
    });
    // 无限滚动
    $('#scrollContent').scroll(function() {
        var div_height = document.getElementById('scrollContent').scrollHeight;
        var window_height = $(this).height();
        var scroll_top = $(this).scrollTop();
        var scrollBottom = div_height - window_height - scroll_top;
        if (scrollBottom <= 50 && scrollPage > 0 && isAJAX==true) {
            isAJAX = false;
            $.fn.searchResult();  // 搜索
        }
    });
    // 排序筛选
    $(document).on('click', '.compared_sort p', function () {
        var dataOrder = $(this).attr('data-order');
        var dataSorter = $(this).attr('data-sorter');
        var dataText = $(this).text();
        var eleDt = $(this).parents('dl').children('dt');
        eleDt.attr('data-order', dataOrder);
        eleDt.attr('data-sorter', dataSorter);
        eleDt.html(dataText + '<i class="iconfont icon-xiala"></i>');
        $('.compared_sort dd').css('display', 'none');
        scrollPage = 1; // 页码
        isAJAX = false; // 请求
        $('.product_list').empty();  // 清空;
        $.fn.searchResult();
    });
    // 打开品牌筛选
    var oldDataId = '';
    $(document).on('click', '.my-btn', function() {
        $.openPanel('#panel-js-demo');
        oldDataId = $('.brand_option .selected').attr('data-brandid');
    });
    // 取消筛选
    $(document).on('click', '.brand_clear', function () {
        var newDataId = $('.brand_option .selected').attr('data-brandid');
        if (oldDataId != null && newDataId == null) {
            $('.brand_option p').each(function () {
                if ($(this).attr('data-brandid') == oldDataId) {
                    $(this).addClass('selected');
                }
            })
        }
        if (oldDataId == null && newDataId != null) {
            $('.brand_option p').removeClass('selected');
        }
    });
    // 品牌筛选
    $(document).on('click', '#brand_screen', function () {
        var newDataId = $('.brand_option .selected').attr('data-brandid');
        console.log(oldDataId, newDataId);
        if (oldDataId != newDataId) {
            $('.product_list').empty();  // 清空;
            scrollPage = 1; // 页码
            isAJAX = false; // 请求
            $.fn.searchResult();  // 搜索
        }
    });
})();