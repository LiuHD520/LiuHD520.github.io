(function () {
    //获取本地cookie值，进行参数传递
    var cookieValue = $.fn.cookie('baai_user_token');
    // 删除照片
    $(document).on('click', '.delpic', function () {
        if ($(this).parents('.uploader').children('li').length < 5) {
            $(this).parents('.uploader').children('.upload').css('display', '');
        }
        $(this).remove();
    });
    // 宣染图片
    $.onloading = function (newImg) {
        $('.upload').before(
            '<li class="delpic"><span><i class="iconfont icon-androidcancel"></i></span><img class="imgid" src="' + newImg + '" /></li>'
        );
        // 限制图片张数
        $('.uploader').each(function () {
            // console.log($(this).find('li').length);
            if ($(this).find('li').length > 3) {
                $(this).children('.upload').css('display', 'none');
            }else {
                $(this).children('.upload').css('display', 'block');
            }
        })
    };
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
})();