(function () {
    //判断微信浏览器
    $.isWexin = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    };
    var baai_user_token = $.fn.cookie('baai_user_token'); // 用户cookie
    //QQ登录
    if(!baai_user_token){
        QC.Login({
            btnId:"qqLoginBtn"	//插入按钮的节点id
        });
        $('#qqLoginBtn').click();
    }

    $(document).on('click', '.icon-weixin', function(){
        if($.isWexin){
            var APPID="wx5ce8fb14e0114304";
            var REDIRECT_URI=encodeURIComponent("https://18315e65.ngrok.io/third/wechat/login");
            location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ APPID +'&redirect_uri='+ REDIRECT_URI + '&response_type=code&scope=snsapi_userinfo&state=login#wechat_redirect';
        }else {
            $.toast('请在微信打开！');
        }
     });
    $(document).on('click', '#submit', function () {
        var isMobile = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        var username = $('.username').val();
        var passwd = $('.passwd').val();
        var cartKey=$.fn.cookie('cartKey');
        if (username == '') {
            $.toast('手机号码不能为空');
        } else if (!isMobile.test(username)) {
            $.toast('手机号码格式错误');
        } else if (passwd == '') {
            $.toast('密码不能为空');
        } else if (passwd.length < 6) {
            $.toast('密码长度不小于6位');
        }  else {
            // 验证手机号是否注册
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/user/checkPhone',
                data: { 'phone': username },
                dataType: 'json',
                timeout: 300,
                success: function(res){
                    console.log(res);
                    if (res) {
                        // 验证用户名&&密码是否正确
                        $.ajax({
                            type: 'GET',
                            url: $.global_AjaxUrl + '/user/doLogin',
                            data: {
                                'userName': username,
                                'passWord': passwd,
                                'cartKey':cartKey
                            },
                            dataType: 'json',
                            timeout: 300,
                            success: function (obj) {
                                console.log(obj);
                                if (obj.res) {
                                    $.fn.cookie('baai_user_token', obj.baai_user_token, { expires: 180 });
                                    // window.history.go(-1);
                                    window.self.location = document.referrer;   // 返回上页并刷新
                                } else {
                                    $.toast('密码错误');
                                }
                            },
                            error: function () {
                                console.log('Ajax error!');
                            }
                        })
                    } else {
                        $.toast('手机号末注册');
                    }
                },
                error: function(){
                    console.log('Ajax error!');
                }
            })
        }
    })
})();