(function () {
     if($.global_iscookie()){
           // 1:未使用 2:已使用 3:已过期
                  // 建立数组随机优惠券颜色产生
                 function getArrayItems(arr, num) {
                    //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
                    var temp_array = new Array();
                    for (var index in arr) {
                    temp_array.push(arr[index]);
                    }
                    //取出的数值项,保存在此数组
                    var return_array = new Array();
                    for (var i = 0; i<num; i++) {
                    //判断如果数组还有可以取出的元素,以防下标越界
                    if (temp_array.length>0) {
                    //在数组中产生一个随机索引
                    var arrIndex = Math.floor(Math.random()*temp_array.length);
                    //将此随机索引的对应的数组元素值复制出来
                    return_array[i] = temp_array[arrIndex];
                    //然后删掉此索引的数组元素,这时候temp_array变为新的数组
                    temp_array.splice(arrIndex, 1);
                    } else {
                    //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
                    break;
                    }
                    }
                    return return_array;
                }
            var color=new Array('#FF8E32','#9C33FF','#EC5648');
            var baai_user_token = $.fn.cookie('baai_user_token');
            // 未使用优惠券页面数据
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/myCoupon/' + 1,
                    data: { 'baai_user_token': baai_user_token },
                    dataType: 'json',
                    success: function (res) {
                        var str='';
                        res.data.forEach(function (data) {
                            str+='<dl>'+
                                    '<dt style="background:'+getArrayItems(color,1)+'">'+
                                    '<p>购物满'+data.overPrice+'元立减</p>'+
                                    '<span>￥'+data.reduce+'</span>'+
                                    '</dt>'+
                                    '<dd>'+
                                        '<p>有效期</p>'+
                                        '<span>'+data.useStartTimeStr+'~'+data.useEndTimeStr+'</span>'+
                                    '</dd>'+
                                '</dl>'
                        });

                    $('#tab1').append(str);
                    },
                    error: function () {
                        console.log('Ajax error!');
                    }
                });
             // 已使用优惠券页面数据
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/myCoupon/' + 2,
                    data: { 'baai_user_token': baai_user_token },
                    dataType: 'json',
                    success: function (res) {
                        var str='';
                        res.data.forEach(function (data) {
                            str+='<dl>'+
                                    '<dt>'+
                                    '<p>购物满'+data.overPrice+'元立减</p>'+
                                    '<span>￥'+data.reduce+'</span>'+
                                    '</dt>'+
                                    '<dd>'+
                                        '<p>有效期</p>'+
                                        '<span>'+data.useStartTimeStr+'~'+data.useEndTimeStr+'</span>'+
                                    '</dd>'+
                                '</dl>'
                        });
                    $('#tab2').append(str);
                    },
                    error: function () {
                        console.log('Ajax error!');
                    }
                });
             //已过期优惠券页面数据
                 $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/myCoupon/' + 3,
                    data: { 'baai_user_token': baai_user_token },
                    dataType: 'json',
                    success: function (res) {
                        var str='';
                        res.data.forEach(function (data) {
                            str+='<dl>'+
                                    '<dt>'+
                                    '<p>购物满'+data.overPrice+'元立减</p>'+
                                    '<span>￥'+data.reduce+'</span>'+
                                    '</dt>'+
                                    '<dd>'+
                                        '<p>有效期</p>'+
                                        '<span>'+data.useStartTimeStr+'~'+data.useEndTimeStr+'</span>'+
                                    '</dd>'+
                                '</dl>'
                        });
                    $('#tab3').append(str);
                    },
                    error: function () {
                        console.log('Ajax error!');
                    }
                });
     }else {
        $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
    }
})();