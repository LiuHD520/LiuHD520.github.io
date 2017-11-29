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

               // 广告图数据链条
               var indexAds='';
               res.data.indexAds.forEach(function(ads){
                   indexAds+='<a href="'+ads.url+'"><img src="'+ads.thumb+'" /></a>';
               });

                $('.minbanner').append(indexAds);


                // 年度好货
               var yearGoods='';
               res.data.yearGoods.forEach(function(obj){
                 yearGoods+='<li>'+
			                    '<a href="'+obj.url+'">'+
			                        '<span>'+obj.name+'</span>'+
			                        '<p><img src="'+obj.thumb+'" /></p>'+
			                    '</a>'+
			                '</li>';
               });

                $('.yearGoods').append(yearGoods);
                // 热门品牌
               var hotBrands01='';
               var hotBrands02='';
               for(var i=0; i <=1 ; i++){
                   hotBrands01+='<dl>'+
				                    '<a href="'+res.data.hotBrands[i].url+'">'+
				                    '<dt>'+res.data.hotBrands[i].brand+'</dt>'+
				                    '<dt>'+res.data.hotBrands[i].name+'</dt>'+
				                    '<dd><img src="'+res.data.hotBrands[i].thumb+'" /></dd>'+
				                    '</a>'+
				                '</dl>';

               }

               for(var j = 2 ; j < res.data.hotBrands.length ; j++){
                   hotBrands02+='<dl>'+
				                    '<a href="'+res.data.hotBrands[j].url+'">'+
				                        '<dt>'+res.data.hotBrands[j].name+'</dt>'+
				                        '<dd><img src="'+res.data.hotBrands[j].thumb+'" /></dd>'+
				                    '</a>'+
				                '</dl>'
               }

                $('.index01').append(hotBrands01);
                $('.index02').append(hotBrands02);


               // 知名美妆
               var knowMakeups='';
               res.data.knowMakeups.forEach(function(obj){
                knowMakeups+='<dl>'+
	                        '<a href="'+obj.url+'">'+
	                        '<dt>'+obj.brand+'</dt>'+
	                        '<dt>'+obj.name+'</dt>'+
	                        '<dd><img src="'+obj.thumb+'" />'+
	                        '</dl>';
               });

                $('.knowMakeups').append(knowMakeups);
                // 美白护肤
               var whiteSkins='';
               res.data.whiteSkins.forEach(function(obj){
                whiteSkins+='<dl>'+
	                        '<a href="'+obj.url+'">'+
	                        '<dt>'+obj.brand+'</dt>'+
	                        '<dt>'+obj.name+'</dt>'+
	                        '<dd><img src="'+obj.thumb+'" />'+
	                        '</dl>';
               });

                $('.index04').append(whiteSkins);


                // 生活护理
               var lifeNursings='';
               res.data.lifeNursings.forEach(function(obj){
                 lifeNursings+='<dl>'+
			                    '<a href="'+obj.url+'">'+
			                        '<dt>'+obj.brand+'</dt>'+
			                        '<dt>'+obj.name+'</dt>'+
			                        '<dd><img src="'+obj.thumb+'" /></dd>'+
			                    '</a>'+
			                '</dl>';
               });

                $('.index05').append(lifeNursings);



                // 韩国面膜
               var koreanMashs='';
               res.data.koreanMashs.forEach(function(obj){
                 koreanMashs+='<dl>'+
			                    '<a href="'+obj.url+'">'+
			                        '<dt>'+obj.brand+'</dt>'+
			                        '<dt>'+obj.name+'</dt>'+
			                        '<dd><img src="'+obj.thumb+'" /></dd>'+
			                    '</a>'+
			                '</dl>';
               });

                $('.index06').append(koreanMashs);



                // 母婴系列
               var motherProducts='';
               res.data.motherProducts.forEach(function(obj){
                 motherProducts+='<dl>'+
			                    '<a href="'+obj.url+'">'+
			                        '<dt>'+obj.brand+'</dt>'+
			                        '<dt>'+obj.name+'</dt>'+
			                        '<dd><img src="'+obj.thumb+'" /></dd>'+
			                    '</a>'+
			                '</dl>';
               });

                $('.index07').append(motherProducts);


                // 食品系列
               var foodProducts01='';
               var foodProducts02='';
               for(var i=0; i <=1 ; i++){
                   foodProducts01+='<dl>'+
				                    '<a href="'+res.data.foodProducts[i].url+'">'+
				                    '<dt>'+res.data.foodProducts[i].brand+'</dt>'+
				                    '<dt>'+res.data.foodProducts[i].name+'</dt>'+
				                    '<dd><img src="'+res.data.foodProducts[i].thumb+'" /></dd>'+
				                    '</a>'+
				                '</dl>';
               }


               for(var j = 2 ; j < res.data.foodProducts.length ; j++){
                  foodProducts02+='<dl>'+
				                    '<a href="'+res.data.foodProducts[j].url+'">'+
				                        '<dt>'+res.data.foodProducts[j].name+'</dt>'+
				                        '<dd><img src="'+res.data.foodProducts[j].thumb+'" /></dd>'+
				                    '</a>'+
				                '</dl>'
               }

                $('.index08').append(foodProducts01);
                $('.index09').append(foodProducts02);


                // 猜你喜欢
               var guessYouLike='';
               res.data.guessYouLike.forEach(function(obj){
                 guessYouLike+='<dl>'+
                 					'<a href="'+obj.url+'">'+
				                    '<dt><img src="'+obj.thumb+'" /></dt>'+
				                    '<dd>'+
				                        '<p class="plname">'+obj.name+'</p>'+
				                        '<p class="plprice"><span>￥<strong>'+obj.price+'</strong></span></p>'+
				                    '</dd>'+
				                    '</a>'+
				                '</dl>';
               });

                $('.index10').append(guessYouLike);




              $.global_banner();
   
            },
            error: function(xhr, type){
                //数据请求出错
                console.log('Ajax error!')
            }
        }); 

})();