(function () {
    // 新增地址
    $(document).on('click', '.open-about', function () {
        $.popup('.popup-about');
        $('.popup-overlay').addClass('close-popup');
        $('.add_name').val(''); // 收件人
        $('.add_tel').val('');  // 移动电话
        $.global_area();    // 载入城市联动
        $('.add_add').val('');  // 详细地址
        $('.add_card').val(''); // 身份证号
        $('.mailing_tit').attr('data-id', '').text('新增地址');
    });
    // 编辑地址
    $(document).on('click', '.edit-about', function () {
        $.popup('.popup-about');
        $('.popup-overlay').addClass('close-popup');
        var edit_address = $(this).parents('.addtxt');
        var dataId = edit_address.attr('data-id');  // 地址项ID
        var edit_name = edit_address.find('.nametxt').text();
        var edit_tel = edit_address.find('.teltxt').text();
        var edit_addr = edit_address.find('.addtxt').text();
        var edit_card = edit_address.find('.cardtxt').text();
        $('.add_name').val(edit_name); // 收件人
        $('.add_tel').val(edit_tel);  // 移动电话
        $.global_area();    // 载入城市联动
        $('.add_add').val(edit_addr);  // 详细地址
        $('.add_card').val(edit_card); // 身份证号
        $('.mailing_tit').attr('data-id', dataId).text('修改地址');
    });
})();
/*** AJAX ***/
(function () {
    var baai_user_token = $.fn.cookie('baai_user_token');   // 用户cookie
    var isMobile = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;

    // 选择地址
    $(document).on('click', '.addtxt .infor', function () {
        var dataId = window.location.href.split('?')[1];   // 获取url
        dataId = decodeURI(dataId);   // 解码
        if (dataId != 'undefined') {
            var addId = $(this).parents('.addtxt').attr('data-id');
            window.location.href = "pre_order.html?" + dataId + '?' + addId;
        }
    });
    // 获取地址列表
    $(document).ready(function() {
        if($.global_iscookie()){
            $.ajax({
                type: 'GET',
                url: $.global_AjaxUrl + '/addresslist/1',
                data: { 'baai_user_token': baai_user_token },
                dataType: 'json',
                timeout: 300,
                success: function(res){
                    console.log(res);
                    res.data.forEach(function (data) {
                        if (data.isDefault == 1) {
                            $('.delivery_add').append(
                                '<div class="addtxt" data-id="' + data.id + '">' +
                                '<div class="infor">' +
                                '<p><span class="nametxt">' + data.name + '</span><span class="teltxt">' + data.mobile + '</span></p>' +
                                '<p><span class="citytxt" data-provinceId="' + data.provinceId + '" data-cityId="' + data.cityId + '" data-countyId="' + data.countyId + '">' + data.provinceName + data.cityName + data.countyName + '</span><span class="addtxt">' + data.addr + '</span></p>' +
                                '<p style="display: none;" class="cardtxt">' + data.card + '</p>' +
                                '</div>' +
                                '<div class="handle">' +
                                '<p class="edit-default"><i class="iconfont icon-yixuanze"></i>默认地址</p>' +
                                '<p class="edit-about"><i class="iconfont icon-bianji"></i>编辑</p>' +
                                '<p class="edit-del"><i class="iconfont icon-shanchu"></i>删除</p>' +
                                '</div>' +
                                '</div>'
                            )
                        } else {
                            $('.delivery_add').append(
                                '<div class="addtxt" data-id="' + data.id + '">' +
                                '<div class="infor">' +
                                '<p><span class="nametxt">' + data.name + '</span><span class="teltxt">' + data.mobile + '</span></p>' +
                                '<p><span class="citytxt" data-provinceId="' + data.provinceId + '" data-cityId="' + data.cityId + '" data-countyId="' + data.countyId + '">' + data.provinceName + data.cityName + data.countyName + '</span><span class="addtxt">' + data.addr + '</span></p>' +
                                '<p style="display: none;" class="cardtxt">' + data.card + '</p>' +
                                '</div>' +
                                '<div class="handle">' +
                                '<p class="edit-default">默认地址</p>' +
                                '<p class="edit-about"><i class="iconfont icon-bianji"></i>编辑</p>' +
                                '<p class="edit-del"><i class="iconfont icon-shanchu"></i>删除</p>' +
                                '</div>' +
                                '</div>'
                            )
                        }
                    });
                    if (res.data.length < 1) {
                        $.global_nothing('icon-none', '「暂无地址」');
                    }
                },
                error: function(){
                    console.log('Ajax error!');
                }
            });
        } else {
            $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
        }
    });
    // 设置默认地址
    $(document).on('click', '.edit-default', function () {
        var dataId = $(this).parents('.addtxt').attr('data-id');
        var that = $(this);
        $.ajax({
            type: 'GET',
            url: $.global_AjaxUrl + '/setdefault',
            data: {
                'baai_user_token': baai_user_token,
                'addressId': dataId,
                'type': 1
            },
            dataType: 'json',
            timeout: 300,
            success: function (res) {
                console.log(res);
                $('.delivery_add .icon-yixuanze').remove();
                that.prepend('<i class="iconfont icon-yixuanze"></i>');
            },
            error: function () {
                console.log('Ajax error!');
            }
        })
    });
    // 删除地址
    $(document).on('click', '.edit-del', function () {
        var addtxt = $(this).parents('.addtxt');
        var addressId = addtxt.attr('data-id');
        $('.reconfirm dt').text('确认要删除该地址吗？');
        $('.reconfirm').css('display', '');
        $('.cancel').click(function () {
            $('.reconfirm').css('display', 'none');
        });
        $('.sure').click(function () {
            $('.reconfirm').css('display', 'none');
            $.toast('删除成功');
            addtxt.remove();
            if($.global_iscookie()){
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/deleteAddress/' + addressId,
                    data: { 'baai_user_token': baai_user_token },
                    dataType: 'json',
                    timeout: 300,
                    success: function(res){
                        console.log(res);
                        if ($('.delivery_add .addtxt').length == 0) {
                            location.reload();
                        };
                    },
                    error: function(){
                        console.log('Ajax error!');
                    }
                });
            } else {
                $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
            }
        })
    });
    // 新增收件人
    $(document).on('click', '.add_ok', function () {
        var dataId = $('.mailing_tit').attr('data-id'); // 地库项ID
        var consignee = $('.add_name').val();   // 收件人
        var mobile = $('.add_tel').val();   // 移动电话
        var province = $('.global-area .province').val();    // 省份
        var city = $('.global-area .city').val();    // 城市
        var district = $('.global-area .county').val();    // 区县
        var addr = $('.add_add').val();  // 详细地址
        var card = $('.add_card').val();    // 身份证号
        if (consignee == '') {
            $.toast('姓名不能为空');
        } else if (mobile == '') {
            $.toast('手机号码不能为空');
        } else if (!isMobile.test(mobile)) {
            $.toast('手机号码格式错误');
        } else if (province == '') {
            $.toast('请选择省份');
        } else if (city == '') {
            $.toast('请选择城市');
        } else if ($('.global-area .county').is('.global-none') == false && district == '') {
            $.toast('请选择区/县');
        } else if (addr == '') {
            $.toast('请填写详细地址');
        } else {
            if($.global_iscookie()){
                console.log('调用addAddress')
                console.log(dataId,consignee,mobile,province,city,district,addr,card)
                $.ajax({
                    type: 'GET',
                    url: $.global_AjaxUrl + '/addAddress',
                    data: {
                        'id': dataId,
                        'baai_user_token': baai_user_token,
                        'consignee': consignee,
                        'mobile': mobile,
                        'province': province,
                        'city': city,
                        'district': district,
                        'addr': addr,
                         'card': card,
                         'type': 1,
                         'status': 0
                    },
                    dataType: 'json',
                    success: function(res){
                        console.log(res);
                        location.reload();  // 页面刷新
                    },
                    error: function(){
                        console.log('Ajax error!');
                    }
                });
            } else {
                $.global_nothing('icon-wo-weitianse', '您尚未登录，请先<a href="login.html">登录</a>');
            }
        }
    });
})();