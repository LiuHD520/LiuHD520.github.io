(function () {
    //获取本地cookie值，进行参数传递
    var cookieValue = $.fn.cookie('baai_user_token');
    //点击退出登录，清楚cookie
    $('.drop-out').click(function(){
            $.fn.cookie('baai_user_token', cookieValue,{ expires : -1 });
            QC.Login.signOut();
            window.location.href="login.html";
    });
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
                            window.location.href="information.html";
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
    //个人信息页面
    if($.global_iscookie()){
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl+'/returnUserInfo',
            data: { 'baai_user_token': cookieValue },
            dataType: 'json',
            success: function(res){
                console.log(res);
                var infoData=res.data;
                var sex = infoData.sex!=null ? ((infoData.sex==1)? '♂' : '♀') : ' ' ;
                if(!infoData.birthdayStr){
                      infoData.birthdayStr='暂未设置';
                }
                if(!infoData.mobile || infoData.mobile == 'null'){
                      infoData.mobile='暂未设置';

                    //点击跳转绑定手机
                    $(document).on('click', '.mobile-edit',function(){
                        window.location.href="bind_phone.html?"+infoData.userId;
                    });
                }
                if(!infoData.email){
                	   infoData.email='暂未设置';
                }
                var str='';
                var str02='';
                var str03='';
                var str04='';
                var tou='';
                $('#userPhone').attr('src', infoData.thumb);
                str+= '<dd class="edit-next" data-user="'+infoData.userId+'">'+
		                    '<a>'+
		                    '<p>'+infoData.name+'<span>'+sex+'</span></p>'+
		                    '<p>生日:<span>'+infoData.birthdayStr+'</span></p>'+
		                    '</a>'+
		                '</dd>';

                str04+= '<i class="iconfont icon-gengduo next-edit" data-userID="'+infoData.userId+'"></i>';
		        str02+='<dt>绑定手机</dt><dd class="mobile-edit" data-userM="'+infoData.userId+'" data-phone="'+infoData.mobile+'">'+infoData.mobile+'<i class="iconfont icon-gengduo"></i></dd>';
 				str03+='<dt>邮箱</dt><dd class="emailEdit" data-userI="'+infoData.userId+'">'+infoData.email+'<i class="iconfont icon-gengduo"></i></dd>';
               $('.head-touxaign').append(str);
		       $('.info-header').append(str04);
		       $('.mobile').append(str02);
		       $('.email').append(str03);
                //点击跳转修改个人信息
		        $('.edit-next').click(function(){
                    var id01=$(this).attr('data-user');
                    window.location.href="edit_information.html?"+id01;
                });
                //点击跳转修改个人信息
                $('.next-edit').click(function(){
                    var id02=$(this).attr('data-userID');
                    window.location.href="edit_information.html?"+id02;
                });
                //点击跳转修改绑定手机
                if(infoData.mobile){
                    $('.mobile-edit').click(function(){
                        var idm=$(this).attr('data-userM');
                        var phone=$(this).attr('data-phone');
                        window.location.href="alter_phone_number.html?"+idm+'&'+phone;
                    });
                }

                $('.email-next').click(function(){
                    var userId=$(this).attr('data-UserID');
                    window.location.href="save_email.html?"+userId;
                });
                $('.emailEdit').click(function(){
                    var userI=$(this).attr('data-userI');
                    window.location.href="save_email.html?"+userI;
                });
                },
            error: function(xhr, type){
                console.log('Ajax error!')
            }
        });
    } else {
        $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
    }
})();