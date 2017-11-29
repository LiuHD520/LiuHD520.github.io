(function () {
    if($.global_iscookie()){
        // 获取url并进行截取
        var url=(window.location.href).split('?');
        //用户相关信息
        var userID=url[1].split('&');
        //用户id
        var userid=userID[0];
        //当前用户登录账号
        var oldphone=userID[1];
        //用户手机号码页面展示
        $('.oldPhone').text(oldphone);
        /*** 消息提示 ***/
        var msg4 = '验证码不能为空';
        var msg5 = '请输入4位验证码';
        var msg6 = '验证码错误，请重新输入';
        /*** 60秒倒计时 ***/
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
        /*** 发送验证码至手机 ***/
        $('.get_verified').on('click', function () {
                // 发送验证码
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/user/sendMessage',
                    data: {
                        'phone':oldphone
                    },
                    success: function(data){
                        console.log(data);
                            if (data.success) {
                                $.toast('验证码已发送至手机');
                                time_s = 60;
                                $('.get_verified').attr('disabled', "true");
                                $.timedCount();
                            } else {
                                $.toast('验证码发送失败，请重试');
                            }
                    },
                    error: function(){
                        console.log('Ajax error!');
                    }
                });
        });
        /*** 验证码是否正确 ***/
        $('.next').click(function () {
            var codem = $('.code-m').val();
            var validCode = $.trim(codem);   // 过滤空格
            var validCodeStr = validCode.toString();    // 转成字符串
            if (codem == '') {
                $.toast(msg4);
            } else if (validCodeStr.length < 4) {
                $.toast(msg5);
            } else {
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/user/validateCode',
                    data: {
                        'phone': oldphone,
                        'code': validCodeStr
                    },
                    dataType: 'json',
                    timeout: 300,
                    success: function(res){
                        console.log(res);
                        if(res){
                            window.location.href="alter_phone_number03.html?"+userid;
                        }else{
                            $.toast('验证码输入错误，请重输');
                        }
                    },
                    error: function(){
                        console.log('Ajax error!');
                    }
                });
            }
        });
    } else {
        $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
    }
})();
