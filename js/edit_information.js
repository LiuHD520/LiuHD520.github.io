(function () {
    //获取本地cookie值，进行参数传递
    var cookieValue = $.fn.cookie('baai_user_token');
    // 日期选择器
    $("#my-input").calendar({
        value: [new Date()],
        dateFormat: "yyyy-mm-dd"
    });
    // 性别选择器
    $('.sex strong').on('click', function () {
        $(this).addClass('yanse').siblings('strong').removeClass('yanse');
        var sex=$(this).text();
    });
    // 获取url并进行截取userId
    var url=(window.location.href).split('?');
    //将userId转为数字类型
    var userID=parseInt(url[1]);
     if($.global_iscookie()){
      //   页面数据回选
         $.ajax({
             url: $.global_AjaxUrl + '/returnUserInfo',
             type: 'GET',
             data: {
                 "baai_user_token": cookieValue
             },
             success: function (res) {
                // 昵称回选
                $('.nicheng').val(res.data.name);
                //性别回选判断
                if(res.data.sex){
                    $('.man').addClass('yanse');
                }else {
                    $('.nv').addClass('yanse');
                }
                //生日回选
                $('.birthday').val(res.data.birthdayStr);
             },
             error: function () {
                 console.log('Ajax error!');
             }
         });
      // 点击提交编辑个人资料数据
       $('.pull-right').click(function(){
        // 获取昵称
       	var nicheng=$('.nicheng').val();
       	var sex=$('.yanse').text();
       	var sexType=1;
        // 判断性别
       	if(sex=='男♂'){
             sexType=1;
        }else{
             sexType=0;
        }
        var birthday=$('.birthday').val();
         // 判断昵称是否填写
        if(!nicheng){
            $.toast("您的昵称还未填写哦！");
        }
        // 判断生日是否选择
        if(!birthday){
             $.toast("您还未选择生日哦！");
        }
        // 如昵称货生日没有填则提交不成功
        if(nicheng&&birthday){
        	console.log(sexType,nicheng,birthday);
           $.ajax({
			        type: 'POST',
			        url: $.global_AjaxUrl + '/editUserInfoSave',
			        data: { 
			            'userId':userID,
			            'sex':sexType,
			            'name':nicheng,
			            'birthday':birthday
			         },
			        dataType: 'json',
			        success: function(res){
			           console.log(res);
			           window.location.href = 'information.html';
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
