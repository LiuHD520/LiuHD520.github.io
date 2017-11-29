(function () {
    //用户提示信息
    var msg1 = '两次密码不一致';
    //传值cookie
    var baai_user_token = $.fn.cookie('baai_user_token');
    //点击完成提交并作出对应的判断
    $('.over').on('click', function(){
        //获取原密码
        var oldPass=$('.oldPassword').val();
        //过滤空格，以防止用户输入空格
        var oldPassword = $.trim(oldPass);
        //将原密码转换成字符串，进行传值
        var oldPasswordStr = oldPassword.toString();
        if(oldPass){
            //获取新密码
            var input01 = $('#new-password01').val();
            //获取确认密码
            var input02 = $('#new-password02').val();
            //将所需存储的密码过滤其空格
            var newPassword = $.trim(input02);
            //再将其转换成字符串存储
            var newPasswordStr = newPassword.toString();
            //判断新密码与确认密码是否一致
            if(input01 != input02){
                //提示信息
                $.toast(msg1);
            }else {
                console.log(1);
                $.ajax({
                    'type': 'post',
                    url: $.global_AjaxUrl+'/changePwd',
                    data: {
                        'baai_user_token':baai_user_token,
                        'oldPwd':oldPasswordStr,
                        'newPwd':newPasswordStr
                    },
                    success:function (res) {
                        //判断是否修改密码成功
                        if(res.status==200){
                            //成功则跳转至个人中心，进行重新登录
                            $.fn.cookie('baai_user_token',baai_user_token,{ expires : -1 });
                            window.location.href="myself.html";
                        }else {
                            $.toast('原始密码有误，请重新输入');
                        }
                    }
                });
            }
        }else {
            $.toast('请输入原始密码');
        }
    })
})();