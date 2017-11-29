(function () {
    //获取本地cookie值，进行参数传递
    var cookieValue = $.fn.cookie('baai_user_token');
    // 日期选择器
    $("#my-input").calendar({
        value: [new Date()],
        dateFormat: "yyyy-mm-dd"
    });
    $(document).on("click", ".user-info-nickname p", function () {
        $('.user-info-nickname span input').val('');
    });
    // 性别选择器
    var sex = '男';
    var userId = null;
    $('.man').on('click', function () {
        $(this).addClass('mancolor').siblings('strong').removeClass('nvcolor');
         sex=$(this).text().substring(0,1);
    });
    $('.nv').on('click', function () {
        $(this).addClass('nvcolor').siblings('strong').removeClass('mancolor');
         sex=$(this).text().substring(0,1);
    });
    if($.global_iscookie()){
        // 头像绑定
        $('#fileup').on('change', function () {
            var formData = new FormData($( "#form_pic_file")[0]);
            $.ajax({
                url:$.global_AjaxUrl +  '/forword/uploadImg' ,  // 处理form表单内所有内容
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
                    $.ajax({
                        type: 'POST',
                        url: $.global_AjaxUrl + '/save/userPhoto',
                        data: {
                            'baai_user_token': cookieValue,
                            'thumb':newImg
                        },
                        success: function(res) {
                            console.log(res);
                            if(res.status==200){
                                window.location.href="personal_information.html";
                            }
                        },
                        error: function(){
                            console.log('Ajax error!');
                        }
                    });
                },
                error: function (reg) {
                    console.log(reg);
                }
            });
        });
        //   页面数据回选
        $.ajax({
            url: $.global_AjaxUrl + '/returnUserInfo',
            type: 'GET',
            data: {
                "baai_user_token": cookieValue
            },
            success: function (res) {
                console.log(res);
                //头像
                $('.avatar').attr('src', res.data.thumb);
                // 昵称回选
                $('.nickname').val(res.data.name);
                //性别回选判断
                if(res.data.sex){
                    $('.man').addClass('mancolor');
                }else {
                    $('.nv').addClass('nvcolor');
                }
                //生日回选
                $('.birth').val(res.data.birthdayStr);
                //userId
                userId = res.data.userId;
            },
            error: function () {
                console.log('Ajax error!');
            }
        });
        // 点击保存编辑个人资料数据
        $('.save-info').click(function(){
            // 获取昵称
            var nickname=$('.nickname').val();
            var sexType=1;
            // 判断性别
            if(sex=='男'){
                sexType=1;
            }else{
                sexType=0;
            }
            var birthday=$('.birth').val();
            // 判断昵称是否填写
            if(!nickname){
                $.toast("您的昵称还未填写哦！");
            }
            // 判断生日是否选择
            if(!birthday){
                $.toast("您还未选择生日哦！");
            }
            // 如昵称货生日没有填则提交不成功
            if(nickname&&birthday){
                console.log(sexType,nickname,birthday);
                $.ajax({
                    type: 'POST',
                    url: $.global_AjaxUrl + '/editUserInfoSave',
                    data: {
                        'userId':userId,
                        'sex':sexType,
                        'name': nickname,
                        'birthday':birthday
                    },
                    dataType: 'json',
                    success: function(res){
                        console.log(res);
                        // window.location.href = 'personal_information.html';
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
