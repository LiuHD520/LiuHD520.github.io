(function () {
    $(document).on('click', '.claim', function () {
        $('.success-receive').css('display','block');
    });
    $(document).on('click', '.success-receive', function () {
        $(this).css('display','none');
         window.location.href="alreadyReceived.html";
    });
})();