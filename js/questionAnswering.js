(function () {
    $(document).on('click', '.useful', function () {
        $('.youyong').addClass('usefuluselessActive');
        $('.meiyong').removeClass('usefuluselessActive');
    });
    $(document).on('click', '.useless', function () {
        $('.meiyong').addClass('usefuluselessActive');
        $('.youyong').removeClass('usefuluselessActive');
    });
})();