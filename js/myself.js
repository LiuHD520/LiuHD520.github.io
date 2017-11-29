/*** AJAX ***/
(function () {
    $(document).ready(function() {
        var baai_user_token = $.fn.cookie('baai_user_token'); // 用户cookie
        //判断微信浏览器
        $.isWexin = function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        };
        //QQ登录判断
        if(!baai_user_token ){
            if(QC.Login.check()){//如果已登录
                var paras = {};
                var nickName='';
                var portrait='';
                var openID='';
                QC.api("get_user_info", paras).success(function(s){//成功回调
                        // console.log("获取用户信息成功！当前用户昵称为："+s.data.nickname);
                        console.log(s.data);
                        nickName=s.data.nickname;
                        portrait=s.data.figureurl_2;
                      QC.Login.getMe(function(openId, accessToken){
                        openID=openId;
                          console.log(openID,nickName,portrait);
                          $.ajax({
                              type: 'GET',
                              url: $.global_AjaxUrl + '/third/qq/login',
                              data: {
                                  'nickname': nickName,
                                  'openId': openID,
                                  'thumb': portrait
                              },
                              dataType: 'json',
                              success: function (obj) {
                                  console.log(obj);
                                  if(obj.status == 200){
                                      $.fn.cookie('baai_user_token', obj.data, { expires: 180 });
                                      location.reload();
                                  }
                              },
                              error: function () {
                                  console.log('Ajax error!');
                              }
                          })
                      });
                    })
                    .error(function(f){//失败回调
                        $.toast("获取用户信息失败！");
                    })
                    .complete(function(c){//完成请求回调
                        // console.log("获取用户信息完成！");
                    });

                console.log(openID,nickName,portrait);

            }
        }
        //点击微信登录操作
        console.log($.isWexin());
        if($.isWexin() ){
            if(!baai_user_token ) {
                var baaiusertoken = window.location.href.split('?')[1];
                var access_token=/.*(access_token)+.*/;
                if(!access_token.test(baaiusertoken)){
                    $.fn.cookie('baai_user_token', baaiusertoken, {expires: 360});
                    if(baaiusertoken){
                        location.reload();
                    }
                }
            }
        };
        if ($.global_iscookie()) {
            var baai_user_tokencookie = $.fn.cookie('baai_user_token'); // 用户cookie
            console.log(baai_user_tokencookie);
            $.ajax({
                // 数据请求地址
                url: $.global_AjaxUrl+'/userInfo',
                type: 'GET',
                // 传请求参数给后端
                data:{
                    "baai_user_token": baai_user_tokencookie
                },
                success: function(res){
                    console.log(res);
                    // 个人中心--头像数据渲染、记忆会员名称渲染
                    $('.myself-info').append('<p><a class="myself-head"><img src="' + res.data.thumb + '" /></a></p><span>' + res.data.name +' <img src="/img/myself/vip1.jpg" /></span>');
                    // 代付款数量显示渲染
                    $('.waitpay .hint').html(res.data.waitpay);
                    // 待发送商品数量渲染
                    $('.waitsend .hint').html(res.data.waitsend);
                    // 待收货商品数量显示页面渲染
                    $('.waitreceive .hint').html(res.data.waitreceive);
                    // 带评论商品数量页面数据渲染
                    $('.waitcomment .hint').html(res.data.waitcomment);
                    // 优惠券数量页面显示渲染
                    $('.couponNum').html(res.data.couponNum+'张');
                    // 个人资产--八爱币数量渲染
                    if(!res.data.money){
                        $('.money').html(0+'八爱币');
                    }else {
                        $('.money').html(res.data.money+'八爱币');
                    }

                    // 个人积分数据渲染
                    $('.integral').html(res.data.integral+'分');

                    $('.myself-head').click(function(){
                        window.location.href="information.html";
                    });
                },
                error: function(xhr, type){
                    console.log('Ajax error!')
                }
            });
        } else {
            $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
        }
    });
})();