;(function () {
    /***
     * 功能：生成二维码
     * 用法：global_QRcode(QRCodeUrl);
     *
     * id="global-qrcode" = '容器'
     * QRCodeUrl = '转换内容'
     *
     * ***/
    $.global_QRcode = function (QRCodeUrl) {
        new QRCode(document.getElementById('global-qrcode'), {
            width : 200,
            height : 200
        }).makeCode(QRCodeUrl);
    };
    /***
     * 功能：八爱长图
     * 用法：$.global_draw(svgCode, svgTitle, svgSwipe);
     *
     * id="global-sharing" = '容器'
     * svgCode = '二维码src';
     * svgLogo = '';
     * svgTitle = '商品title';
     * svgSwipe = '商品图片src';
     *
     * ***/
    $.global_draw = function (svgCode, svgTitle, svgSwipe) {
        var svgLogo = '/img/logo.png';  // 品牌logo
        var svgWidth = 640;   // 窗口宽
        /*** 画板 ***/
        var canvas = document.createElement('canvas');  // 创建一个画板
        var ctx = canvas.getContext('2d');  // 画板类型2D
        canvas.width = svgWidth;    // 画板宽
        canvas.height = svgWidth*2.1;    // 画板高
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, svgWidth, svgWidth*2.1);
        /*** 标题 ***/
        ctx.fillStyle = '#EE2266';  // 字体颜色
        ctx.font = '26px Arial';    // 宋体大小,默认宋体
        // 文字内容,文字定位
        var lastSubStr = 0;    // 截取字符串索引
        var newSvgTitle = '';
        var sublength = svgTitle.length < 25 ? svgTitle.length:25;  // 标题总长
        for (var i=0; i<sublength; i++) {
            newSvgTitle += svgTitle.substring(lastSubStr, i);
            lastSubStr = i;
        }
        ctx.fillText(newSvgTitle, 10, 210);  // 绘制截取部分
        /*** 提示 ***/
        ctx.fillStyle = '#333';  // 字体颜色
        ctx.textAlign = 'center';
        ctx.fillText('长按图片识别二维码', svgWidth/2, svgWidth+225);
        /*** 图片 ***/
        var createLogoImg = function () {
            var img = new Image();  // 新建图片
            img.crossOrigin = 'Anonymous';  // 图片跨域
            img.src = svgLogo;   // 图片路径
            img.onload = function () {  // 图片生成完成,执行函数
                ctx.drawImage(img, 20, 90, 179, 74);
                createSwipeImg();
            };
        };
        var createSwipeImg = function () {
            var img = new Image();  // 新建图片
            img.crossOrigin = 'Anonymous';  // 图片跨域
            img.src = svgSwipe;   // 图片路径
            img.onload = function () {  // 图片生成完成,执行函数
                ctx.drawImage(img, svgWidth*0.05, 230, svgWidth*0.9, svgWidth*0.9);
                createCodeImg();
            };
        };
        var createCodeImg = function () {
            var img = new Image();  // 新建图片
            img.crossOrigin = 'Anonymous';  // 图片跨域
            img.src = svgCode;   // 图片路径
            img.onload = function () {  // 图片生成完成,执行函数
                ctx.drawImage(img, svgWidth/4 , svgWidth+260 , svgWidth/2 , svgWidth/2 );
                document.getElementById('global-sharing').innerHTML = '<img style="height:auto;" src="' + canvas.toDataURL('image/jpg', 1) + '" />';
            };
        };
        createLogoImg ();
    };
    /***
     * 用法：banner-prodraw
     *
     * <div class="banner-prodraw">
         * <div id='mySwipe' class='swipe'>
             * <div class='swipe-wrap'>
                 * <a href="#"><img src="图片" /></a>
                 * <a href="#"><img src="图片" /></a>
             * </div>
         * </div>
         * <div class="swipe-wrap-count"></div> // 计算
         * <div class="swipe-wrap-list"></div>  // 圆点
     * </div>
     *
     * ***/
    $.global_banner = function () {
        // 加载计算
        $(document).ready(function () {
            // 计算
            $('.swipe-wrap-count').text('1/' + $('.swipe-wrap a').length);
            // 计点
            $('.swipe-wrap a').each(function (index) {
                if (index == 0) { $(".swipe-wrap-list").append('<p class="choice-list"></p>'); } else { $(".swipe-wrap-list").append('<p></p>'); }
            });
        });
        // 加载轮播
        var elem = document.getElementById('mySwipe');
        window.mySwipe = Swipe(elem, {
            auto: 5000,
            callback: function(index, element) {
                $('.swipe-wrap-count').text((index+1) + '/' + $('.swipe-wrap a').length);
                $(".swipe-wrap-list p").eq(index).addClass("choice-list").siblings().removeClass("choice-list");
            }
        });
        // 圆点切换
        $(document).on('click', '.swipe-wrap-list p', function () { mySwipe.slide($(this).index()); });
    };
    /***
     * 用法：global-number
     *
     * <div class="global-number">
         * <a href="javascript:;">-</a>
         * <input type="text" value="1" />
         * <a href="javascript:;">+</a>
     * </div>
     *
     * ***/
    // 过滤数量：正整数
    $(document).on('keyup', '.global-number input', function () {
        if ($(this).val().length == 1) {
            $(this).val($(this).val().replace(/[^1-9]/g,''));
        } else {
            $(this).val($(this).val().replace(/\D/g,''));
        }
    });
    // ''或0时值为1
    $(document).on('blur', '.global-number input', function () {
        if ($(this).val() == '') { $(this).val(1); }
    });
    // //加减数量
    // $(document).on('click', '.global-number a', function () {
    //     var input_number = $(this).siblings('input');
    //     var number_int = parseInt(input_number.val());
    //     if ($(this).text() == '-') {
    //         if (number_int > 1) {
    //             -- number_int;
    //             input_number.val(number_int);
    //         }
    //     } else {
    //         number_int ++;
    //         input_number.val(number_int);
    //     }
    // });
    /***
     * 用法：global-specification
     *
     * <div class="global-specification">
     *     <dl>
     *        <dt>规格</dt>
     *        <dd class="choice">LO50</dd>
     *        <dd>LO51</dd>
     *        <dd>LO52</dd>
     *        <dd>LO53</dd>
     *    </dl>
     * </div>
     *
     * ***/
    //  选择规格&参数
    $(document).on('click', '.global-specification p', function () {
        $(this).addClass('choice').siblings('p').removeClass();
    });
    /***
     * 用法：$.global_nothing(css, txt);
     *
     * icon = '提示小图标'
     * txt = '提示内容'
     *
     * ***/
    // 未登陆 && 无数据
    $.global_nothing = function (icon, txt) {
        $('.page-group').append(
            '<div class="content global-nothing">' +
                '<p><svg class="svgIcon" aria-hidden="true"><use xlink:href="#' + icon + '"></use></svg></p>' +
                '<p>' + txt + '</p>' +
            '</div>'
        );
    };
    /***
     * 用法：$.global_iscookie();
     *
     * 返回：true || false
     *
     * ***/
    // cookies
    $.global_iscookie = function () {
        if($.fn.cookie('baai_user_token') == null) {
            return false;
        } else {
            return true;
        }
    };
    /***
     * 用法：$.global_area();
     *
     * 类名：
     * <div class="global-area">
     *    <select class="province">
     *       <option value="">省</option>
     *    </select>
     *    <select class="city">
     *       <option value="">市</option>
     *    </select>
     *    <select class="county">
     *       <option value="">区</option>
     *    </select>
     * </div>
     *
     * 调用：
     * $(document).ready(function() {
     *     $.global_area();
     * });
     *
     * ***/
    // 加载城市联动
    $.global_area = function () {
        $('.global-area .province').empty().append('<option value="">省</option>');
        $('.global-area .city').empty().append('<option  value="">市</option>');
        $('.global-area .county').empty().append('<option value="">区</option>');
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/area/' + 0,
            dataType: 'json',
            timeout: 300,
            success: function (res) {
                res.data.forEach(function (data) {
                    $('.global-area .province').append('<option value="' + data.id + '">' + data.name + '</option>');
                });
            },
            error: function () {
                console.log('Ajax error!');
            }
        })
    };
    // 选择省份
    $(document).on('change', '.global-area .province', function () {
        $('.global-area .city').empty().append('<option  value="">市</option>');
        $('.global-area .county').empty().append('<option value="">区</option>');
        if ($(this).val() != '') {
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/area/' + $(this).val(),
                dataType: 'json',
                timeout: 300,
                success: function (res) {
                    res.data.forEach(function (data) {
                        $('.global-area .city').append('<option value="' + data.id + '">' + data.name + '</option>');
                    });
                },
                error: function () {
                    console.log('Ajax error!');
                }
            })
        }
    });
    // 选择城市
    $(document).on('change', '.global-area .city', function () {
        $('.global-area .county').empty().append('<option value="">区</option>');
        if ($(this).val() != '') {
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/area/' + $(this).val(),
                dataType: 'json',
                timeout: 300,
                success: function (res) {
                    if (res.data.length == 0) {
                        $('.global-area .county').addClass('global-none');
                    } else {
                        $('.global-area .county').removeClass('global-none');
                        res.data.forEach(function (data) {
                            $('.global-area .county').append('<option value="' + data.id + '">' + data.name + '</option>');
                        });
                    }
                },
                error: function () {
                    console.log('Ajax error!');
                }
            })
        }
    });
})();
/*** AJAX ***/
(function () {
    // $.global_AjaxUrl = 'http://192.168.0.118:8080'; // 测试用地址
    $.global_AjaxUrl = '//m.baai.com'; // 访问地址
    var baai_user_token = $.fn.cookie('baai_user_token');   // 用户cookie
    /***
     * 规格&&参数
     * 用法：$.global_editSpecifications();
     *
     * productId = 商品ID
     * productImg = 商品图片
     * productName = 商品名称
     * productPrice = 商品价格
     *
     * ***/
    $.global_editSpecifications = function (productId, productImg, productName, productPrice) {
        $('.editSpecifications ul').attr('data-productId', productId);  // 商品ID
        $('.editSpecifications img').attr('src', productImg);    // 商品图片
        $('.editSpecifications .slepname').text(productName);   // 商品名称
        $('.editSpecifications .slepic strong').text(productPrice);    // 商品价格
        // 规格参数
        $('.editSpecifications .content').empty();  // 清空
        // 载入
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/cart/standard/' + productId,
            data: {  },
            dataType: 'json',
            timeout: 300,
            success: function(res){
                console.log(res);
                res.data.forEach(function (data, index) {
                    /*** ----- ***/
                    $('.editSpecifications .global-number strong').text('库存：' + data.stock); // 库存
                    /*** ----- ***/
                    if (index == 0) {
                        $('.editSpecifications .content').append('<p class="choice" data-id="' + data.id + '" data-price="' + data.price + '" data-stock="' + data.stock + '">' + data.standard + '</p>');
                    } else {
                        $('.editSpecifications .content').append('<p data-id="' + data.id + '" data-price="' + data.price + '" data-stock="' + data.stock + '">' + data.standard + '</p>');
                    }
                })
            },
            error: function(){
                console.log('Ajax error!');
            }
        })
    };
    /***
     * 立即下单&&加入购物车
     * 用法 ：$.global_editSpecifications_confirm();
     *
     * refresh = false（不刷新）|| true（刷新）
     * productId = 商品ID
     * num = 商品数量
     * commoId = 规格ID
     * buynow => false（加入购物车）|| true（立即下单）
     *
     * ***/
    $.global_editSpecifications_confirm = function(refresh, productId, num, commoId, buynow){
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/cart/add/' + productId,
            data: {
                'baai_user_token': baai_user_token,
                'num': num,
                'commoId': commoId,
                'buynow': buynow,
                'cartKey': $.fn.cookie('cartKey')
            },
            dataType: 'json',
            // timeout: 300,
            success: function(res){
                console.log(res);
                $.fn.cookie('cartKey',res.data,{ expires : 180 });
                // 立即下单
                if (buynow == true) {
                    window.location.href = "pre_order.html?" + res.data;
                } else {
                    $.toast('成功加入购物车');
                    // 页面刷新
                    if (refresh == true) { location.reload(); }
                }
            },
            error: function(){
                console.log('Ajax error!');
            }
        })
    };

    //呼吸按钮
    /******
     * <li class="global_hidd">
     x
     </li>
     *
     * <span class="global_show">. . .</span>
     * *****/
    $(document).on('click', '.global_show', function () {
        $(this).css('display','none');
        $('.global_breathing').css('display','block');
    });
    $(document).on('click', '.global_hidd', function () {
        $('.global_show').css('display','block');
        $('.global_breathing').css('display','none');
    });
})();
