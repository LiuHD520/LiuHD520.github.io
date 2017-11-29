(function () {
    //获取本地cookie值，进行参数传递
    var cookieValue = $.fn.cookie('baai_user_token');
    $.ajax({
        url: $.global_AjaxUrl+'/index',
        type: 'GET',
        success: function(res) {
            console.log(res);
            // 轮播数据连接
            var slider='';
            res.data.indexBanners.forEach(function(list){
                slider+='<a href="'+list.url+'"><img src="'+list.thumb+'" /></a>';
            });
            $('.swipe-wrap').append(slider);
            $.global_banner();
        },
        error: function(xhr, type){
            //数据请求出错
            console.log('Ajax error!')
        }
    });

})();