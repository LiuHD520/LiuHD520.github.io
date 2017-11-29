(function () {
    $('button').on('click', function () {
        $.toast('领取成功');
        $(this).parent('dd').prepend('<p>有效期</p>');
        $(this).remove();
    });
})();