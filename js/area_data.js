// 省、市、区
$('#AreaData').on('click', function () {
    $('.area_data').css('display', '');
    $('.area_data dl dt').text('选择省份');
    $('.area_data dl dd').empty();
    $.getJSON('json/AreaData.json', function (AreaData) {
        // 初始化
        $.each(AreaData.data, function (a, obj_a) {
            $('.area_data dl dd').append('<p>' + obj_a.name + '</p>');
        });
        // 选择省市区
        var province = '';  // 省
        var city = '';  // 市
        var county = '';    // 区
        $(document).on('click', '.area_data dl dd p', function () {
            console.log('省：' + province + '市：' + city + '区' + county);
            if ($('.area_data dl dt').text() == '选择县区') { county = $(this).text(); };
            if ($('.area_data dl dt').text() == '选择城市') { city = $(this).text(); };
            if ($('.area_data dl dt').text() == '选择省份') { province = $(this).text(); };
//                $.getJSON('json/AreaData.json', function (AreaData) {
            if ($('.area_data dl dt').text() == '选择城市') {
                $.each(AreaData.data, function (a, obj_a) {
                    $.each(obj_a.child, function (b, obj_b) {
                        if (obj_b.name == city) {
                            if (obj_b.child != undefined) {
                                $('.area_data dl dt').text('选择县区');
                                $('.area_data dl dd').empty();
                                $.each(obj_b.child, function (c, obj_c) {
                                    $('.area_data dl dd').append('<p>' + obj_c.name + '</p>');
                                })
                            }
                        }
                    })
                })
            }
            if ($('.area_data dl dt').text() == '选择省份') {
                $.each(AreaData.data, function (a, obj_a) {
                    if (obj_a.name == province) {
                        $('.area_data dl dt').text('选择城市');
                        $('.area_data dl dd').empty();
                        $.each(obj_a.child, function (b, obj_b) {
                            $('.area_data dl dd').append('<p>' + obj_b.name + '</p>');
                        })
                    }
                })
            }
//                });
            console.log('省：' + province + ' 市：' + city + ' 区：' + county);
        });
    });
});