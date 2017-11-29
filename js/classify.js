(function () {
    $(document).on('click', '.classlist p', function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        $.classify();
    });
    // 分类
    $(document).on('click', '.productlist dl', function () {
        var val = $(this).attr('data-id');
        window.location.href="classify_product.html?" + val + '?';
    });
    // 搜索
    $(document).on('click', '.search-input', function() {
        window.location.href = 'search_page.html';
    });
})();
/*** AJAX ***/
(function () {
    // 三级分类
    $.classify = function () {
        var Id = $('.classlist .selected').attr('data-id');
        $('.productlist').empty();
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/classify/' + Id,
            data: {},
            dataType: 'json',
            // timeout: 300,
            success: function (res) {
                console.log(res);
                res.data.forEach(function (obj) {
                    $('.productlist').append('<dl data-id="' + obj.id + '">' + '<dt><img src="' + obj.pic_url + '" /></dt>' + '<dd>' + obj.name + '</dd>' + '</dl>');
                });
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    };
    $(document).ready(function() {
        // 二级分类
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/classify',
            data: {},
            dataType: 'json',
            // timeout: 300,
            success: function (res) {
                // console.log(res);
                res.data.forEach(function (data, index) {
                    if (index == 0) {
                        $('.classlist').append('<p data-id="' + data.id + '" class="selected">' + data.name + '</p>');
                    } else {
                        $('.classlist').append('<p data-id="' + data.id + '">' + data.name + '</p>');
                    }
                });
                $.classify();
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
    });
})();