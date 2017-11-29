(function () {
     //修改手机绑定01，判断密码，进行下一步
     if($.global_iscookie()){
          // 获取url并进行截取
        var url=(window.location.href).split('?');
        var user=url[1].split('&');
        $('.next').click(function(){
           var valu=$('.passwords').val();
           //判断输入密码是否存在
           if(valu){
            $.ajax({
              type: 'GET',
              url: $.global_AjaxUrl + '/bindUserInfoPhone',
              data: { 
                  'userId':user[0],
                  'password':valu
               },
              dataType: 'json',
              success: function(res){
                 // 判断密码是否正确
                 if(res.status==200){
                     window.location.href="oldPhone.html?"+user[0]+'&'+user[1];
                 }else{
                  $.toast("密码错误");
                 }
             },
              error: function(){
                  console.log('Ajax error!');
              }
             });
           }else{
              $.toast("您还未输入密码！");
           }
        });
    } else {
        $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
    }
})();
