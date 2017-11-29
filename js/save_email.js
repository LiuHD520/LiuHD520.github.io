(function () {
    if($.global_iscookie()){
    // 邮箱格式验证
    var regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    var cookieValue = $.fn.cookie('baai_user_token');
    // 获取url并进行截取userId
    var url=(window.location.href).split('?');
    var userSelf=parseInt(url[1]);
    /*** 120秒倒计时 ***/
    var time_s, time_t;
    $.timedCount = function () {
        var get_verified = $('.get_verified');
        if (time_s < 0) {
            get_verified.text('获取验证码');
            get_verified.removeAttr('disabled');
            clearTimeout(time_t);
        } else {
            get_verified.text(time_s + 's');
            time_s--;
            time_t = setTimeout('$.timedCount()', 1000);
        }
    };
    /*** 点击完成是验证邮箱 ***/
    $('.get_verified').on('click', function () {
        //获取输入的新邮箱
        var email = $('.email').val();
        if (email == '') {
            $.toast('邮箱不能为空');
        } else if (!regEmail.test(email)) {
            $.toast('邮箱格式错误');
        }else{
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/sendEmailCode',
                data: { 'email':email },
                success: function(res){
                    // console.log(res);
                    if(res){
                        $.toast('验证码已发送至手机');
                        time_s = 120;
                        //禁止二次点击，多次请求，提高性能
                        $('.get_verified').attr('disabled', "true");
                        //倒计时函数调用
                        $.timedCount();
                        $('.pull-right').click(function(){
                            var code=$('.code-m').val();
                            var validCode = $.trim(code);   // 过滤空格
                            var validCodeStr = validCode.toString();    // 转成字符串
                            if(res==validCodeStr){
                                $.ajax({
                                    'type': 'get',
                                    url: $.global_AjaxUrl + '/bindEmaiInUser',
                                    data: {
                                        'userId': userSelf,
                                        'email':email
                                    },
                                    success:function (res) {
                                        //获取上传是否成功结果
                                        console.log(res);
                                        window.location.href="information.html";

                                    }
                                });
                            }else {
                                $.toast('验证码输入错误，请重试');
                            }
                        });
                    }else {
                        $.toast('验证码发送失败，请重试');
                    }


                },
                error: function(){
                    console.log('Ajax error!');
                }
            });
        }
    })
    }else {
        $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
    }
})();