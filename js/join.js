(function () {
    //获取本地cookie值，进行参数传递
    var cookieValue = $.fn.cookie('baai_user_token');
    //join_type类型选择
    var joinType = '';
    //用户提示
    var msg1 = '请选择合作类型';
    var msg2 = '手机号有错误';
    //手机格式验证
    var isMobile = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    $(document).on("click", ".molds", function () {
        $('.select-molds').css('display','block');
    });
    $(document).on("click", ".join-login", function () {
        if (!$.global_iscookie()) {
            $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
        }
    });
    $(document).on("click", ".select-molds li", function () {
        $(this).parent('.select-molds').css('display','none');
        var content = $(this).text();
        console.log(content);
        $('.select-molds-content').text(content);
    });
    $(document).on("click", ".select-molds p", function () {
        $(this).parent('.select-molds').css('display','none');
    });
    //微商清除当前输入内容
    $(".form-content-weishang p input").focus(function(){
        $(this).siblings('span').css('display','block');
    });
    $(".form-content-weishang p input").blur(function(){
        $(this).siblings('span').css('display','none');
    });
    $(document).on("click", ".form-content-weishang p span", function () {
        $(this).siblings('input').val('');
    });
    //k货源合作、区域代理、政府合作、加盟商清除当前输入内容
    $(".form-content-common p input").focus(function(){
        $(this).siblings('span').css('display','block');
    });
    $(".form-content-common p input").blur(function(){
        $(this).siblings('span').css('display','none');
    });
    $(document).on("click", ".form-content-common p span", function () {
        $(this).siblings('input').val('');
    });
    //微商
    $(document).on('click', '.select-molds .weishang-show', function () {
        $('.form-content-weishang').css('display','block');
        $('.form-content-common').css('display','none');
        joinType = 1;
    });
    //货源合作
    $(document).on('click', '.select-molds .source-goods', function () {
        $('.form-content-weishang').css('display','none');
        $('.form-content-common').css('display','block');
        joinType = 5;
    });
    //加盟商
    $(document).on('click', '.select-molds .franchisee', function () {
        $('.form-content-weishang').css('display','none');
        $('.form-content-common').css('display','block');
        joinType = 2;
    });
    //区域带你
    $(document).on('click', '.select-molds .agencies', function () {
        $('.form-content-weishang').css('display','none');
        $('.form-content-common').css('display','block');
        joinType = 3;
    });
    //政府合作
    $(document).on('click', '.select-molds .government', function () {
        $('.form-content-weishang').css('display','none');
        $('.form-content-common').css('display','block');
        joinType = 4;
    });
    //输入字数显示以及字数实时显示
    $('.area').on("keyup",function(){
        $('.words').text($('.area').val().length);//这句是在键盘按下时，实时的显示字数
        if($('.area').val().length > 500){
            $('.words').text(500);//长度大于300时0处显示的也只是100
            $('.area').val($('.area').val().substring(0,500));//长度大于300时截取钱300个字符
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
    //微商提交数据
    $(document).on('click', '.weishang-submit', function () {
        var weishangName=$('.form-content-weishang-name').val();
        var weishangPhone=$.trim($('.form-content-weishang-phone').val());
        var weishangWeixin=$('.form-content-weishang-weixin').val();
        var weishangEmail=$.trim($('.form-content-weishang-email').val());
        var weishangCareer=$('.form-content-weishang-career').val();
        console.log(joinType);
        if (!joinType) {
            $.toast(msg1);
        } else if (!weishangName) {
            $.toast('请输入姓名');
        } else if (!weishangPhone) {
            $.toast('请输入手机号码');
        } else if (!weishangWeixin) {
            $.toast('请输入微信');
        } else if (!weishangEmail) {
            $.toast('请输入邮箱');
        } else if (!weishangCareer) {
            $.toast('请输入职业');
        } else if (!isMobile.test(weishangPhone)) {
            $.toast(msg2);
        } else {
            $.ajax({
                url: $.global_AjaxUrl + '/baaiJoin/saveBaaiJoin',
                type: 'GET',
                data: {
                    "baai_user_token": cookieValue,
                    'userName': weishangName,
                    'mobile': weishangPhone,
                    'email': weishangEmail,
                    'weixin': weishangWeixin,
                    'work': weishangCareer,
                    'joinType': joinType
                },
                success: function (res) {
                    $.toast('提交成功');
                    console.log(res);
                },
                error: function () {
                    console.log('Ajax error!');
                }
            });
        }
    });

    //货源合作、加盟店、区域代理、政府合作提交数据
    $(document).on('click', '.common-submit', function () {
        var commoncompany=$('.form-content-common-company').val();
        var commonprincipal=$('.form-content-common-principal').val();
        var commonphone=$.trim($('.form-content-common-phone').val());
        var introduce=$('.area').val();
        var commonlocation=$('.form-content-common-location').val();
        var commonweb=$('.form-content-common-web').val();
        //获取图片
        var tempimg = new Array();
        $('.imgid').each(function () {
            tempimg.push($(this).attr('src'));
        });
        console.log(joinType,tempimg.length);
        //区域代理可不填企业信息
        if (joinType == 3) {
            if (!joinType) {
                $.toast(msg1);
            } else if (!commonprincipal) {
                $.toast('请输入负责人');
            } else if (!commonphone) {
                $.toast('请输入手机号码');
            } else if (!isMobile.test(commonphone)) {
                $.toast(msg2);
            } else {
                console.log('chenggggg');
                $.ajax({
                    url: $.global_AjaxUrl + '/baaiJoin/saveBaaiJoin',
                    type: 'GET',
                    data: {
                        "baai_user_token": cookieValue,
                        'userName': commonprincipal,
                        'mobile': commonphone,
                        'joinType': joinType,
                        'companyName': commoncompany,
                        'companyDesc': introduce,
                        'companyLicense': tempimg,
                        'companyAddress': commonlocation,
                        'companyNet': commonweb
                    },
                    success: function (res) {
                        $.toast('提交成功');
                        console.log(res);
                    },
                    error: function () {
                        console.log('Ajax error!');
                    }
                });
            }
        } else {
            if (!joinType) {
                $.toast(msg1);
            } else if (!commoncompany) {
                $.toast('请输入企业名称');
            } else if (!commonprincipal) {
                $.toast('请输入负责人');
            } else if (!commonphone) {
                $.toast('请输入手机号码');
            } else if (!introduce) {
                $.toast('请输入企业介绍');
            }  else if (!isMobile.test(commonphone)) {
                $.toast('手机号码格式错误');
            } else {
                console.log('chenggggg');
                $.ajax({
                    url: $.global_AjaxUrl + '/baaiJoin/saveBaaiJoin',
                    type: 'GET',
                    data: {
                        "baai_user_token": cookieValue,
                        'userName': commonprincipal,
                        'mobile': commonphone,
                        'joinType': joinType,
                        'companyName': commoncompany,
                        'companyDesc': introduce,
                        'companyLicense': tempimg,
                        'companyAddress': commonlocation,
                        'companyNet': commonweb
                    },
                    success: function (res) {
                        $.toast('提交成功');
                        console.log(res);
                    },
                    error: function () {
                        console.log('Ajax error!');
                    }
                });
            }
        }
    });

})();