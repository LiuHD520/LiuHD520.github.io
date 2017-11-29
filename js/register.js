(function () {
    var msg1 = '手机号不能为空';
    var msg2 = '手机号有错误';
    var msg3 = '手机号已被注册';
    var msg4 = '验证码不能为空';
    var msg5 = '请输入4位验证码';
    var msg6 = '验证码有误';
    var msg7 = '密码不能为空';
    var msg8 = '密码不小于6位';
    var isMobile = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var isUsername = false;
    // 验证码倒计时
    var second = 0;
    $.timedCount = function () {
        if (second-- < 2) {
            clearTimeout('$.timedCount()', 1000);
            $('.username').removeAttr('readonly');
            $('#getvalidcode').removeClass('getvalidcode_disabled').removeAttr('disabled').text('获取验证码');
        } else {
            setTimeout('$.timedCount()', 1000);
            $('.username').attr('readonly', true);
            $('#getvalidcode').text(second + 's');
        }
    };
    // 验证手机号是否注册
    // $(document).on('input', '.username', function () {
    //     var username = $('.username').val();
    //     isUsername = false;
    //     $('#getvalidcode').addClass('getvalidcode_disabled').attr('disabled', true);
    //     if (username.length == 11 && !isMobile.test(username)) {
    //         $.toast(msg2);
    //     }
    //     if (username.length == 11 && isMobile.test(username)) {
    //         $.ajax({
    //             type: 'GET',
    //             url: $.global_AjaxUrl + '/user/checkPhone',
    //             data: {'phone': username},
    //             dataType: 'json',
    //             timeout: 300,
    //             success: function (res) {
    //                 // console.log(res);
    //                 if (res) {
    //                     $.toast(msg3);
    //                 } else {
    //                     isUsername = true;
    //                     $('#getvalidcode').removeClass('getvalidcode_disabled').removeAttr('disabled');
    //                 }
    //             },
    //             error: function () {
    //                 console.log('Ajax error!');
    //             }
    //         })
    //     }
    // });
    // 获取验证码
    $(document).on('click', '#getvalidcode', function () {
        var username = $('.username').val();
         isUsername = false;
        if ( !username ) {
            $.toast(msg1);
        }else if ( !isMobile.test(username) ) {
            $.toast(msg2);
        } else if ( username.length == 11 && isMobile.test(username) ) {
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/user/checkPhone',
                data: {'phone': username},
                dataType: 'json',
                timeout: 300,
                success: function (res) {
                    // console.log(res);
                    if (res) {
                        $.toast(msg3);
                    } else {
                        isUsername = true;
                        // $('#getvalidcode').removeClass('getvalidcode_disabled').removeAttr('disabled');
                        $('#getvalidcode').addClass('getvalidcode_disabled').attr('disabled', true);
                        second = 60;
                        $.timedCount(); // 倒计时
                        var username = $('.username').val();
                        $.ajax({
                            type: 'GET',
                            url: $.global_AjaxUrl + '/user/sendMessage',
                            data: { 'phone': username },
                            dataType: 'json',
                            timeout: 300,
                            success: function (res) {
                                console.log(res);
                            },
                            error: function () {
                                console.log('Ajax error!');
                            }
                        })
                    }
                },
                error: function () {
                    console.log('Ajax error!');
                }
            })
        }
    });
    // 注册
    $(document).on('click', '#submit', function () {
        var username = $('.username').val();
        var passwd = $.trim($('.passwd').val());
        var validcode = $.trim($('.validcode').val());
        if (isUsername == false) {
            $.toast(msg2);
        } else if (passwd == '') {
            $.toast(msg7);
        } else if (passwd.length < 6) {
            $.toast(msg8);
        } else if (validcode == '') {
            $.toast(msg4);
        } else if (validcode.length < 4) {
            $.toast(msg5);
        } else {
            // 验证码是否正确
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/user/validateCode',
                data: {
                    'phone': username,
                    'code': validcode
                },
                dataType: 'json',
                timeout: 300,
                success: function (res) {
                    console.log(res);
                    if (res) {
                        // 提交注册
                        $.ajax({
                            type: 'GET',
                            url: $.global_AjaxUrl + '/user/doRegister',
                            data: {
                                'phone': username,
                                'password': passwd
                            },
                            dataType: 'json',
                            timeout: 300,
                            success: function (res) {
                                console.log(res);
                                if (res) {
                                    // 注册成功=>登陆
                                    $.ajax({
                                        type: 'GET',
                                        url: $.global_AjaxUrl + '/user/doLogin',
                                        data: {
                                            'userName': username,
                                            'passWord': passwd
                                        },
                                        dataType: 'json',
                                        timeout: 300,
                                        success: function (obj) {
                                            console.log(obj);
                                            if (obj.res) {
                                                $.fn.cookie('baai_user_token', obj.baai_user_token, { expires: 180 });
                                                window.location.href = "myself.html";
                                            } else {
                                                window.location.href = "login.html";
                                            }
                                        },
                                        error: function () {
                                            console.log('Ajax error!');
                                        }
                                    })
                                } else {
                                    $.toast('注册失败，请重试');
                                }
                            },
                            error: function () {
                                console.log('Ajax error!');
                            }
                        });
                    } else {
                        $.toast(msg6);
                    }
                },
                error: function () {
                    console.log('Ajax error!');
                }
            })
        }
    });
})();