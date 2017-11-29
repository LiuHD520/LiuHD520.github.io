(function () {
    // 取消收藏功能
    $('#tab2 .cancel').click(function () {
        $(this).parents('ul').remove();
        location.reload();
    });
    if($.global_iscookie()){
        //获取本地cookie值，进行参数传递
        var cookieValue = $.fn.cookie('baai_user_token');
        $.ajax({
            //个人商品收藏数据请求接口
            url: $.global_AjaxUrl+'/productSave/list',
            type: 'GET',
            data:{
                //获取数据的传参值
                "baai_user_token":cookieValue
            },
            success: function(res){
                console.log(res);
                //获取数据内容
                var collectionData=res.data;
                var str='';
                collectionData.forEach(function(list){
                    if(list.status == 0) {
                        // str += <dl>
                        //    <dt><img src="http://n.baai.com/baai/uploadfile/2017/04/10/201704101434597511.jpg" /></dt>
                        //    <dd>
                        //    <p class="plname">韩国JAYJUN水光针樱花面膜三部曲10片美白补水保湿抗皱紧致面膜贴</p>
                        //    <p class="fromsale">已下架</p>
                        //    <p class="plprice"><span>￥<strong>88.00</strong></span><span class="cancel">取消收藏</span></p>
                        //    </dd>
                        //    <dd class="off">已下架</dd>
                        //    </dl>
                    } else {
                        //对整个数据样式进行显示渲染
                        str +='<dl data-productId="'+ list.productId +'">'+
                            // 商品图片
                            '<dt><img src="'+list.thumb+'" /></dt>'+
                            '<dd>'+
                            // 商品名称
                            '<p class="plname">'+list.productName+'</p>'+
                            // 商品价格
                            '<p class="plprice"><span>￥<strong>'+list.price+'</strong></span><span class="cancel">取消收藏</span></p>'+
                            '</dd>'+
                            '</dl>';
                    }
                });
                //将数据渲染效果显示到网页上
                $('.product_list').append(str);
                $('#tab1 .cancel').click(function () {
                    //取消收藏时，会商品进行页面商品移除效果展示
                    $(this).parents('dl').remove();
                    var dataId =0;
                    //获取当前商品移除的id
                    dataId = $(this).parents('dl').attr('data-productId');
                    console.log(dataId)
                    $.ajax({
                        type: 'GET',
                        //后台数据删除请求
                        url: $.global_AjaxUrl + '/productSave/cancel/' + dataId,
                        data: { 'baai_user_token': cookieValue },
                        dataType: 'json',
                        timeout: 300,
                        success: function(res){
                            console.log(res);
                            //删除成功刷新页面
                            // location.reload();
                        },
                        error: function(){
                            console.log('Ajax error!');
                        }
                    });
                });
                // 请求商品详情
                $(document).on('click', '.product_list dl', function () {
                    var id=$(this).attr('data-productId');
                    window.location.href="product_detail.html?"+id + '?';
                });
                if (res.data.length < 1) {
                    $('.product_list').append(
                        '<div class="global-nothing">' +
                        '<p><svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-none"></use></svg></p>' +
                        '<p>「没有收藏的商品」</p>' +
                        '</div>'
                    );
                }
            },
            error: function(xhr, type){
                //数据请求出错
                console.log('Ajax error!');
            }
        });

        //品牌数据请求
        //获取本地cookie值，进行参数传递
        var cookieValue = $.fn.cookie('baai_user_token');
        $.ajax({
            //个人品牌收藏数据请求接口
            url: $.global_AjaxUrl+'/brand/list',
            type: 'GET',
            data:{
                //获取数据的传参值
                "baai_user_token":cookieValue
            },
            success: function(res){
                //获取数据内容
                console.log(res);
                var collectionData=res.data;
                var str='';
                collectionData.forEach(function(list){
                    if(list.status == 0) {
                        // str+='<ul>'+
                        //     '<li>'+
                        //     '<p class="pic"><span><img src="/img/countrie_pavilion/brand05.jpg" /></span></p>'+
                        //     '<p>呼吸37°</p>'+
                        //     '</li>'+
                        //     '<li>'+
                        //     '<p><span>已下架</span></p>'+
                        //     '<p class="cancel">取消收藏</p>'+
                        //     '</li>'+
                        //     '<li class="off">已下架</li>'+
                        //     '</ul>'
                    } else {
                        //对整个数据样式进行显示渲染
                        str +='<ul>'+
                            '<li class="brand-ch" data-brandId = "' + list.brandId + '">'+
                            '<p class="pic" data-brandName="' + list.brandName + '" data-brandId="'+ list.id +'"><a><span><img src="'+list.brandPic+'" /></span></a></p>'+
                            '<p><a>'+list.brandName+'</a></p>'+
                            '</li>'+
                            '<li>'+
                            '<p class="cancel">取消收藏</p>'+
                            '</li>'+
                            '</ul>'
                    }
                });
                // 将数据渲染效果显示到网页上
                $('.brand').append(str);
                // 请求品牌详情
                $(document).on('click', '.brand-ch', function () {
                    var dataBrandId=$(this).attr('data-brandId');
                    console.log(dataBrandId);
                    window.location.href="brand_products.html?"+dataBrandId + '?';
                });
                $('#tab2 .cancel').click(function () {
                    //取消收藏时，会商品进行页面商品移除效果展示
                    $(this).parents('ul').remove();
                    var brandId =0;
                    //获取当前商品移除的id
                    brandId = $(this).parents('ul').find('.pic').attr('data-brandId');
                    console.log(brandId);
                    $.ajax({
                        type: 'GET',
                        //后台数据删除请求
                        url: $.global_AjaxUrl + '/brand/cancel/' + brandId,
                        data: { 'baai_user_token': cookieValue },
                        dataType: 'json',
                        timeout: 300,
                        success: function(res){
                            console.log(res);
                        },
                        error: function(){
                            console.log('Ajax error!');
                        }
                    });
                });
                if (res.data.length < 1) {
                    $('.brand').append(
                        '<div class="global-nothing">' +
                        '<p><svg class="svgIcon" aria-hidden="true"><use xlink:href="#icon-none"></use></svg></p>' +
                        '<p>「没有收藏的品牌」</p>' +
                        '</div>'
                    );
                }
            },
            error: function(xhr, type){
                console.log('Ajax error!');
            }
        });
    } else {
        $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
    }
})();