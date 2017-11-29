(function () {
    // 打分
    $(document).on('click', '.rated ol li', function () {
        var tempIndex = $(this).index();
        if ($(this).is('.chosen')) {
            $(this).removeClass('chosen');
        } else {
            $(this).addClass('chosen');
        }
        $(this).parent('ol').children('li').each(function (index) {
            if (index <= tempIndex) {
                $(this).addClass('chosen');
                $(this).children('i').removeClass('icon-collection').addClass('icon-collection_fill');
            } else {
                $(this).removeClass('chosen');
                $(this).children('i').removeClass('collection_fill').addClass('icon-collection');
            }
        });
    });
    // 返回退出
    $('.pull-left').on('click',function () {
        $('.reconfirm').css('display', '').children('dl').children('dt').text('评价还未完成，确定要离开吗？');
        $('.cancel').click(function () {
            $('.reconfirm').css('display', 'none');
        });
        $('.sure').click(function () {
            $('.reconfirm').css('display', 'none');
            history.back(-1);
        })
    });
    // 删除照片
    $(document).on('click', '.delpic', function () {
        if ($(this).parents('ul').children('li').length < 5) {
            $(this).parents('ul').children('.upload').css('display', '');
        }
        $(this).parent('li').remove();
    });
})();
/*** AJAX ***/
(function () {
    var url = window.location.href.split('?');
    var arr = url[1].split('&');
    var objImg = '';
    // 宣染图片
    $.onloading = function (newImg) {
        objImg.before(
            '<li><span class="delpic"><i class="iconfont icon-androidcancel"></i></span><img class="imgid" src="' + newImg + '" /></li>'
        );
        // 限制图片张数
        $('ul').each(function () {
            // console.log($(this).find('li').length);
            if ($(this).find('li').length > 3) {
                $(this).children('.upload').css('display', 'none');
            }
        })
    };
    // 立即评价
    $(document).on('click', '.bar-tab', function () {
        var obj = new Array();
        $('.rated').each(function (index) {
            obj[index] = new Object();
            obj[index].productId = parseInt($(this).attr('data-productid'));  // ID
            obj[index].content = $(this).find('textarea').val(); // 内容
            obj[index].score = $(this).find('.chosen').length; // 分数
            obj[index].userId = parseInt(arr[1]);
            obj[index].code = arr[0];
            // 图片
            var tempimg = new Array();
            $(this).find('.imgid').each(function () {
                tempimg.push({'img':$(this).attr('src')});
            });
            obj[index].productImg = tempimg;
        });
        console.log(obj);
        if($.global_iscookie()) {
            $.ajax({
                type: 'POST',
                url: $.global_AjaxUrl + '/saveProductReview',
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json',
                data: JSON.stringify(obj),
                success: function (res) {
                    console.log(res);
                    if (res.status == '200') {
                        window.location.href = "order_customer.html#0";
                    } else {
                        $.toast('评价失败');
                    }
                },
                error: function () {
                    console.log('Ajax error!');
                }
            })
        } else {
            $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
        }
    });
    // 载入
    $(document).ready(function() {
        if($.global_iscookie()) {
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/queryListByCode',
                data: {
                    'code': arr[0]
                },
                dataType: 'json',
                success: function (res) {
                    console.log(res);
                    res.data.forEach(function (data) {
                        $('.reviews').append(
                            '<div class="rated" data-userId="' + arr[1] + '" data-productId="' + data.productId + '">' +
                            '<dl>' +
                            '<dt><img src="' + data.productThumb + '" /></dt>' +
                            '<dd><textarea placeholder="亲，谢谢您的评价，您的评价是对我们最大的支持"></textarea></dd>' +
                            '</dl>' +
                            '<ul>' +
                            '<li class="upload"><strong><svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-xiangji"></use></svg></strong></li>' +
                            '</ul>' +
                            '<ol class="fenshu">' +
                            '<li class="chosen"><i class="iconfont icon-collection_fill"></i></li>' +
                            '<li class="chosen"><i class="iconfont icon-collection_fill"></i></li>' +
                            '<li class="chosen"><i class="iconfont icon-collection_fill"></i></li>' +
                            '<li class="chosen"><i class="iconfont icon-collection_fill"></i></li>' +
                            '<li class="chosen"><i class="iconfont icon-collection_fill"></i></li>' +
                            '</ol>' +
                            '</div>'
                        );
                    });
                    // $.onloading();  // 宣染内容
                },
                error: function () {
                    console.log('Ajax error!');
                }
            });
        }  else {
            $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
        }
    });
    // 上传
    $(document).on('change', '#fileup', function () {
        var formData = new FormData($( "#form_pic_file")[0]);
        console.log(formData);
        $.ajax({
            url: $.global_AjaxUrl +  '/forword/uploadImg ' ,  // 处理form表单内所有内容
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (reg) {
                console.log(reg);
                var img=reg.data;
                var jsonReg = img.replace(/'/g,'"');
                var newImg = $.parseJSON(jsonReg).url;
                $('#fileup').val('');
                $.onloading(newImg);
            },
            error: function (reg) {
                console.log(reg);
            }
        });
    });
    // 点击相机上传
    $(document).on('click', '.upload', function () {
        objImg = $(this);
        $('#fileup').click();
    });
})();