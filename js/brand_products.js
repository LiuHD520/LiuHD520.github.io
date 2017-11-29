(function () {
    // 综合排序
    $(document).on('click', '.compared_sort dt', function () {
        $('.compared_sort dd').css('display', 'none');
        $(this).next('dd').css('display', '');
    });
    // 跳转详情
    $(document).on('click', '.product_list dl', function () {
        var dataId = $(this).attr('data-id');
        window.location.href = 'product_detail.html?' + dataId + '?';
    });
    // 搜索
    $(document).on('click', '.search-input', function() {
        window.location.href = 'search_page.html';
    });
})();
/*** AJAX ***/
(function () {
    var baai_user_token = $.fn.cookie('baai_user_token');   // 用户cookie
    var brandId = window.location.href.split('?')[1];   // 获取url
    brandId = decodeURI(brandId);   // 解码 // 品牌ID
    var isAJAX = false; // 请求
    var scrollPage = 1; // 页码
    // var brandId = 0;    // 品牌ID
    // 是否收藏
    $.isCollec = function () {
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/query/' + brandId,
            timeout: 300,
            data: { 'baai_user_token': baai_user_token },
            dataType: 'json',
            success: function (res) {
                console.log(res);
                var isSave = res.data.isSave == 0 ? '收藏':'取消收藏';
                $('.collection button').text(isSave);
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    };
    // 封装搜索
    // $('.titleHedad').text(decodeURI(brandtxt)+'_最低、最全、最好');
    var errorAJAX = 0;  // 请求出错
    var timeoutAJAX = 300;  // 请求时间
    $.fn.searchResult = function () {
        console.log(timeoutAJAX);
        console.log(brandId);
        var dataorder = $('#all_filt').attr('data-order');
        var datasort = $('#all_filt').attr('data-sorter');
        // var brandName = $('.brand_option .selected').text();
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/forword/search',
            timeout: timeoutAJAX,
            data: {
                'name': '*',
                'page': scrollPage,
                'sort': datasort,
                'order': dataorder,
                // 'brandName': brandtxt,
                'brandId': brandId
            },
            dataType: 'json',
            success: function (res) {
                console.log(res);
                res.res.products.forEach(function (data) {
                    var discussNumber = data.discussNumber == null ? 0:data.discussNumber;   // 筛选null评价
                    $('.product_list').append(
                        '<dl data-id="' + data.id + '">' +
                        '<dt><img src="' + data.thumb + '_w200.jpg" /></dt>' +
                        '<dd>' +
                        '<p class="plname">' + data.name + '</p>' +
                        // '<p class="plbrand"><span>' + data.brandName + '</span></p>' +
                        '<p class="plprice"><span>￥<strong>' + data.price + '</strong></span><span class="stork">' + discussNumber + '人评价</span></p>' +
                        '</dd>' +
                        '</dl>'
                    );
                });
                // 加载品牌
                if ($('.brand .brandName').text() == '') {
                    // console.log('初次加载');
                    $('.brand img').attr('src', res.res.products[0].brandThumb);
                    // var tempBN = res.res.brandNames[0];
                    $('.brand .brandName').text(res.res.brandList[0].brandName);
                    $('.brand .sellProduct').html('在售商品：' + res.res.brandList[0].count);
                    // brandId = res.res.products[0].brandId;
                    $.isCollec();
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
    $(document).ready(function() {
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
        $.fn.searchResult();  // 搜索
    });
    // 收藏
    $(document).on('click', '.collection button', function () {
        if($.global_iscookie()){
            if ($(this).text() == '取消收藏') {
                $(this).text('收藏');
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/brand/delete/' + brandId,
                    data: { 'baai_user_token': baai_user_token },
                    dataType: 'json',
                    // timeout: 300,
                    success: function (res) {
                        console.log(res);
                    },
                    error: function () {
                        console.log('Ajax error!');
                    }
                });
            } else {
                $(this).text('取消收藏');
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/brand/save/' + brandId,
                    data: { 'baai_user_token': baai_user_token },
                    dataType: 'json',
                    // timeout: 300,
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
})();