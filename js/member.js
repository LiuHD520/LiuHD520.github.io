(function () {
    //获取本地cookie值，进行参数传递
    var cookieValue = $.fn.cookie('baai_user_token');
    //判断用户是否登录
    if($.global_iscookie()){
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl+'/recharge/toRecharge',
            data: { 'baai_user_token': cookieValue },
            dataType: 'json',
            success: function(res){
                console.log(res);
                var infoData=res.data;
                $('.img01').attr('src', infoData.thumb);
                $('.info-name').text(infoData.name);
                //充值信息动态渲染
                res.data.rechargeList.forEach(function (data) {
                    $('.vip-recharge').append('<li data-id="'+data.recId+'"><i>'+data.recName+'八爱币</i><botton class="recharge">充值</botton> </li>');
                });
                $(document).on('click', '.recharge', function () {
                     var recid=$(this).parents('li').attr('data-id');
                    console.log(recid);
                    //八爱币充值功能
                    $('#myform').attr('action',$.global_AjaxUrl+"/recharge/pay?"+"recId="+recid);
                    $('#myform').submit();
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
