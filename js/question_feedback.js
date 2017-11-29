(function (){
    $(document).on('click', '.mood dl', function () {
       $(this).addClass('mood-active').siblings('dl').removeClass('mood-active');
    });
    $(document).on('click', '.fast-select ul li', function () {
        if ($(this).hasClass('select-active')) {
            $(this).removeClass('select-active');
            $(this).find('span').css('display','none');
        } else {
            $(this).addClass('select-active');
            $(this).find('span').css('display','block');
        }
    });
    //输入字数显示以及字数实时显示
    $('.area').on("keyup",function(){
        $('.words').text($('.area').val().length);//这句是在键盘按下时，实时的显示字数
        if($('.area').val().length > 200){
            $('.words').text(200);//长度大于300时0处显示的也只是100
            $('.area').val($('.area').val().substring(0,200));//长度大于300时截取钱300个字符
        }
    });
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
            if ($(this).find('li').length > 0) {
                $(this).children('p').css('display', 'none');
            }else {
                $(this).children('p').css('display', 'block');
            }
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