(function () {
        //获取本地cookie值，进行参数传递
        var cookieValue = $.fn.cookie('baai_user_token');
        var lei=document.getElementsByClassName("feedback-mold")[0];
        var posi=document.getElementsByClassName("posit")[0];
        var cente=document.getElementsByClassName("div-center")[0];
        var tet=document.getElementsByClassName("tet")[0];
        var msg2 = '手机号有错误';
        var isMobile = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        var typ=0;
        //电话号码渲染、反馈类型
        $.ajax({
            url: $.global_AjaxUrl + '/user/feedbackType',
            type: 'GET',
            data: {
                "baai_user_token": cookieValue
            },
            success: function (res) {
                    console.log(res);
                    $('.phone').val(res.data.mobile);
                res.data.typeList.forEach(function (obj) {
                    $('.sele').append('<option  value="'+obj.id+'">'+obj.name+'</option>');
                });
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
        //输入字数显示以及字数实时显示
        $('.area').on("keyup",function(){
            $('.words').text($('.area').val().length);//这句是在键盘按下时，实时的显示字数
            if($('.area').val().length > 300){
                $('.words').text(300);//长度大于300时0处显示的也只是100
                $('.area').val($('.area').val().substring(0,300));//长度大于300时截取钱300个字符
            }
        });
        //失去焦点判断手机号码格式
        $(".phone").blur(function(){
            var phone=$('.phone').val();
            if (!isMobile.test(phone)) {
                $.toast(msg2);
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
                if ($(this).find('li').length > 3) {
                    $(this).children('.upload').css('display', 'none');
                }else {
                    $(this).children('.upload').css('display', 'block');
                }
            })
        };
     //   提交
     $('.pull').click(function(){
         var area=$('.area').val();
         var tetVal=$('.sele').val();
         //获取图片
         var tempimg = new Array();
         $('.imgid').each(function () {
             tempimg.push($(this).attr('src'));
         });
         var imgs=tempimg.join(",");
         //获取电话号码
         var phone=$('.phone').val();
         console.log(tetVal,phone)
         if(tetVal!="反馈类型"){
             if(area) {
                 if(isMobile.test(phone)){
                     $.ajax({
                         url: $.global_AjaxUrl + '/user/feedback',
                         type: 'GET',
                         data: {
                             "baai_user_token": cookieValue,
                             'typeId': tetVal,
                             'content': area,
                             'img':imgs,
                             'mobile':phone
                         },
                         success: function (res) {
                             $.toast('提交成功');
                             function mysefl() {
                                 window.location.href = 'myself.html';
                             }
                             setTimeout(mysefl,2000);
                         },
                         error: function () {
                             console.log('Ajax error!');
                         }
                     });
                 }else {
                     $.toast(msg2);
                 }
             } else {
                 $.toast('请填写内容');
             }
         }else {
             $.toast('请填点击选择反馈类型');
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
})();