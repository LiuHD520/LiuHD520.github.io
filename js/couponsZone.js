(function () {
    $(document).on('click', '.coupons-zone-nav ul li', function () {
        $(this).addClass('coupons-zone-nav-active').siblings('li').removeClass('coupons-zone-nav-active');
    });
})();