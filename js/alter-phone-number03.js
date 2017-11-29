(function () {
    /*** 公用变量 ***/
    var url=(window.location.href).split('?');
    var userID=parseInt(url[1]);
    var cookieValue = $.fn.cookie('baai_user_token');
    if($.global_iscookie()){
    var isUsername = false; // 手机号校验
    var isValid = false;    // 验证码校验
    var isMobile = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
    /*** 消息提示 ***/
    var msg1 = '手机号不能为空';
    var msg2 = '手机号格式错误';
    var msg3='该手机号码已被注册';
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
        var mobileM = $('.mobile-m').val();
        if (mobileM == '') {
            $.toast(msg1);
        } else if (!isMobile.test(mobileM)) {
            $.toast(msg2);
        }  else {
            // 发送验证码
            $.ajax({
              type: 'GET',
                url: $.global_AjaxUrl + '/sendPhoneMessage',
              data: {
                  // 'userId':userID,
                  'phone':mobileM
               },
              success: function(res){
                 console.log(res);
                 if(res.iphoneTest){
                     if (res.success) {
                         $.toast('验证码已发送至手机');
                         time_s = 60;
                         $('.get_verified').attr('disabled', "true");
                         $.timedCount();
                     } else {
                         $.toast('验证码发送失败，请重试');
                     }
                 }else {
                     $.toast('该手机号码已被注册');
                 }
              },
              error: function(){
                  console.log('Ajax error!');
              }
        });
      }
    });
    /*** 验证码是否正确 ***/
    $('.phone').click(function () {
        var username = $('.mobile-m').val();
        var codem = $('.code-m').val();
        var validCode = $.trim(codem);   // 过滤空格
        var validCodeStr = validCode.toString();    // 转成字符串
        var usernameCode = $.trim(username);   // 过滤空格
        var usernameCodeStr = usernameCode.toString();    // 转成字符串
        if (codem == '') {
            $.toast(msg4);
        } else if (validCodeStr.length < 4) {
            $.toast(msg5);
        } else {
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/validateCodeByH5',
                data: {
                    'phone':username,
                    'code':validCodeStr
                },
                success: function(res){
                    console.log(res);
                    if(res){
                        $.ajax({
                            type: 'GET',
                            url: $.global_AjaxUrl + '/bindPhoneInUser',
                            data: {
                                'baai_user_token':cookieValue,
                                // 'userId':userID,
                                'phone':usernameCode
                            },
                            success: function(res){
                                console.log(res);
                                if(res.status==200){
                                    window.location.href="information.html";
                                }else{
                                    $.toast('修改失败，请重试！');
                                }

                            },
                            error: function(){
                                console.log('Ajax error!');
                            }
                        });

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
  }else {
        $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
    }
})();
