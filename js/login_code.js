(function () {
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
    $(document).on('keyup', '.username', function () {
        var username = $('.username').val();
        isUsername = false;
        $('#getvalidcode').addClass('getvalidcode_disabled').attr('disabled', true);
        if (username.length == 11 && !isMobile.test(username)) {
            $.toast('手机号格式错误');
        }
        if (username.length == 11 && isMobile.test(username)) {
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/user/checkPhone',
                data: {'phone': username},
                dataType: 'json',
                timeout: 300,
                success: function (res) {
                    console.log(res);
                    if (res) {
                        isUsername = true;
                        $('#getvalidcode').removeClass('getvalidcode_disabled').removeAttr('disabled');
                    } else {
                        $.toast('手机号未注册');
                    }
                },
                error: function () {
                    console.log('Ajax error!');
                }
            })
        }
    });
    // 获取验证码
    $(document).on('click', '#getvalidcode', function () {
        $(this).addClass('getvalidcode_disabled').attr('disabled', true);
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
    });
    // 登陆
    $(document).on('click', '#submit', function () {
        var username = $('.username').val();
        var validcode = $.trim($('.validcode').val());
        if (isUsername == false) {
            $.toast('手机号有错误');
        } else if (validcode == '') {
            $.toast('验证码不能为空');
        } else if (validcode.length < 4) {
            $.toast('请输入4位验证码');
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
                        // 登陆
                        $.ajax({
                            type: 'GET',
                            url: $.global_AjaxUrl + '/user/doLoginMobile',
                            data: {
                                'userName': username
                            },
                            dataType: 'json',
                            timeout: 300,
                            success: function (obj) {
                                console.log(obj.res);
                                if (obj.res) {
                                    $.fn.cookie('baai_user_token', obj.baai_user_token, {expires: 180});
                                    window.location.href = "myself.html";
                                }
                            },
                            error: function () {
                                console.log('Ajax error!');
                            }
                        });
                    } else {
                        $.toast('验证码有误');
                    }
                },
                error: function () {
                    console.log('Ajax error!');
                }
            })
        }

    });
})();