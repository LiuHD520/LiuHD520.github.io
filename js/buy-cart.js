(function () {
  var AllB = $('.solo-select');
  var AllNums = AllB.length;
  var GoMony = $('#goMony');
  var subDingdan1 = $('#sub-dingdan1');
  var subDingdan2 = $('#sub-dingdan2');
  var willTotal = $('.willTotal');
  var address = $('.address');
  var addAddress = $('.add-address');
  var addressList = $('.address-list');
  var allTotalPrice = 0;
  var postPrice = 0;
  var willTotalPrice = 0;
  var objNow = {};
  // 金额过滤filter
  var filter_ProductTotalPrice = "";
  var filter_ptp = function (ptp) {
    var setcomma = String(parseInt(ptp)); // 过滤小数并转字符串
    var fractional_part = String(ptp).split(".");  // 取小数部分
    if(fractional_part[1] == undefined){
      fractional_part[1] = "0";
    }
    if(setcomma < 999){
      filter_ProductTotalPrice = setcomma + "." + fractional_part[1];
    }
    if(setcomma > 999 && setcomma < 999999){
      filter_ProductTotalPrice = (setcomma.substr(0,(setcomma.length - 3)) + "," + setcomma.slice(-3) + "." + fractional_part[1]);
    }
    if(setcomma > 999999 && setcomma < 999999999){
      filter_ProductTotalPrice = (setcomma.substr(0,(setcomma.length - 6)) + "," + setcomma.substr((setcomma.length - 6),3) + "," + setcomma.slice(-3) + "." + fractional_part[1]);
    }
  }
  var removeAddNow = function (ele) {  /* 按钮 增加 删除 class="now" */
    return objNow = {
      addNow: function () {
        ele.addClass('now').removeClass('default-color');
        ele.removeAttr('disabled');
      },
      removeNow: function () {
        ele.addClass('default-color').removeClass('now');
        ele.attr('disabled', 'disabled');
      }
    }
  }
  var sameShowHide = function ($x, $y) { /*点击 增加 删除hide 函数*/
    $x.addClass('hide');
    $y.removeClass('hide');
  }
  var removeAddClass = function (elem,clas) {  /*点击增加 删除class 函数*/
    if(elem.hasClass(clas)) {
      elem.removeClass(clas).addClass('icon-kongxinyuan');
    }else if(elem.hasClass('icon-kongxinyuan')) {
      elem.removeClass('icon-kongxinyuan').addClass(clas);
    }
  }
  var Dingdan = function (ele,elem) {  /*判断 提交订单按钮 能否 使用；*/
    if($(ele).hasClass('icon-duigou') && $('#click-add').hasClass('hide')) {
      removeAddNow(elem).addNow();
    }else {
      removeAddNow(elem).removeNow();
    }
  }
  /*得到总的价格 数量的函数；*/
  var getAllPrice = function () {
    var IconGou = $('.some-product').find('.icon-gou');
    var kongNums = $('.some-product').find('.icon-kongxinyuan').length;
    var ProductCount = 0;
    var ProductTotalPrice = 0;
    if(kongNums == AllNums) {
      $('#total-mony').html( 0.00);
      $('#total-count').html(0);
      return;
    }else {
      $.each(IconGou, function (index, val) {
        ProductCount += parseInt($(val).parent().siblings('.middle').find('input').val());
        ProductTotalPrice += parseFloat($(val).parent().siblings('.right').find('h2').children('span').text().replace(/,/g, ''));
      })
      filter_ptp(ProductTotalPrice); // 金额过滤filter
      $('#total-mony').html(filter_ProductTotalPrice);
      $('#total-count').html(ProductCount);
    }
  }
  
  //修改数量
  function change_num(cart_id,p){
  	$.ajax({
  		type:"get",
  		url:"/cartOrder/"+cart_id,
  		data:{
  			num:p,
  		},
  		success:function(){
  		}
  	});
  }
  /*点击 + —  时 数量 价钱发生改变*/
  $('.some-product-item .middle').on('click', 'a', function () {
    var Count = parseInt($(this).siblings('input').val());
    var RightH2 = $(this).parent().parent().siblings('.right').children('h2');
    var RightH3 = $(this).parent().parent().siblings('.right').children('h3');
    var Price = parseFloat($(RightH2).attr('data-price').replace(/,/g, ''));
    var PriceH3 = parseFloat($(RightH3).attr('data-price').replace(/,/g, ''));
    var totalPrice = 0;
    var Html = $(this).children('span');
    if(Html.hasClass('icon-jia1') || $(this).hasClass('icon-jia1')){
      Count++;
    }else if(Html.hasClass('icon-jian') || $(this).hasClass('icon-jian')){
      if(Count == 1) return;
      Count--;
    }
    totalPrice = (Count * Price).toFixed(2);
    totalPriceH3 = (Count * PriceH3).toFixed(2);
    filter_ptp(totalPriceH3); // 金额过滤filter
    $(RightH3).children('span').text(filter_ProductTotalPrice);
    
    $(this).siblings('input').val(Count);
    filter_ptp(totalPrice); // 金额过滤filter
    $(RightH2).children('span').text(filter_ProductTotalPrice);
    getAllPrice();
    
    var cart_id = $(this).attr("cart_id");
    change_num(cart_id, Count);
  })
  /*点击每个商品前的圆圈图标时*/
  $('.some-product').on('click', '.first', function () {
    var NowElem= $(this).find('.solo-select');
    removeAddClass(NowElem, 'icon-gou');
    var Nums = $('.some-product').find('.icon-gou').length;
    var kongNums = $('.some-product').find('.icon-kongxinyuan').length;
    var all_nums = $('.solo-select').length;
    if(Nums > 0 && Nums < all_nums) {
      $('#all-select').children('b').removeClass('icon-gou').addClass('icon-kongxinyuan');
      removeAddNow(GoMony).addNow();
      getAllPrice();
    }else if(Nums === all_nums) {
      $('#all-select').children('b').removeClass('icon-kongxinyuan').addClass('icon-gou');
      removeAddNow(GoMony).addNow();
      getAllPrice();
    }else if(kongNums === all_nums){
      $('#all-select').children('b').removeClass('icon-gou').addClass('icon-kongxinyuan');
      getAllPrice();
      removeAddNow(GoMony).removeNow();
    }
  })
  /*    点击全选 时 */
  $('#all-select').click(function () {
    var AllSelect = $(this).children('b');
    if(AllSelect.hasClass('icon-gou')) {
      AllSelect.removeClass('icon-gou').addClass('icon-kongxinyuan');
      $.each(AllB, function (index, val) {
        $(val).removeClass('icon-gou').addClass('icon-kongxinyuan');
      })
      //GoMony.removeClass('now').addClass('default-color');
      //GoMony.attr('disabled', 'disabled');
      removeAddNow(GoMony).removeNow();
      getAllPrice();
    }else if(AllSelect.hasClass('icon-kongxinyuan')) {
      AllSelect.removeClass('icon-kongxinyuan').addClass('icon-gou');
      $.each(AllB, function (index, val) {
        $(val).removeClass('icon-kongxinyuan').addClass('icon-gou');
      })
      // GoMony.addClass('now').removeClass('default-color');
      // GoMony.removeAttr('disabled');
      removeAddNow(GoMony).addNow();
      getAllPrice();
    }
  })
  /*点击垃圾桶图标时弹出 模态框；*/
  $('.some-product-item .right').on('click', 'a', function (e) {
    e.preventDefault();
    var Model = $('.modal');
    var someProductItem = $(this).parent().parent();
    Model.removeClass('hide');
    var cartId = $(this).attr('data')
    $('#cancel').click(function () {
      Model.addClass('hide');
    })
    $('#sure').click(function () {
      //someProductItem.remove();
      //Model.addClass('hide');
      //getAllPrice();
       location.href = '/cart/delete?cartIds='+cartId;
    })
  })

  /*点击modal-other 对应的框消失 */
  $('.wrap').on('click','.modal-other',function () {
    $(this).parent().addClass('hide');
  })
  /*点击结算按钮 弹出结算信息框*/
  GoMony.click(function () {
    allTotalPrice = $('#total-mony').html();
    postPrice = parseFloat($('.post-prices1').html());
    address.removeClass('hide');
    $('.total-prices').text('¥' + allTotalPrice);
    $('#back-money').click(function () {
      address.addClass('hide');
    })
    $('#agree-xieyi1').click(function () {
      var t = $(this);
      removeAddClass(t,'icon-duigou');
      Dingdan('#agree-xieyi1',subDingdan1);
    })
    Dingdan('#agree-xieyi1',subDingdan1);
  })
  /*点击 查看应付总额箭头 弹出 应付总额框;*/
  $('#willPay').click(function () {
    willTotalPrice = allTotalPrice - postPrice;
    address.addClass('hide');
    $('.willTotal').removeClass('hide');
    $('.post-prices2').text('¥' + postPrice);
    $('.will-prices').text('¥' + willTotalPrice);
    $('#agree-xieyi2').click(function () {
      var a = $(this);
      removeAddClass(a,'icon-duigou');
      Dingdan('#agree-xieyi2',subDingdan2);
    })
    $('#back-address').click(function () {
      sameShowHide(willTotal,address);
    })
    $('.willTotal').children(':not(.willTotal-dialog)').click(function () {
      sameShowHide(willTotal,address);
    })
  })
  /*点击添加收货地址  弹出新增收货地址框*/
  $('#click-add').click(function(e) {
    if(e){
      e.preventDefault();
    }
    //  清空地址库
    $('.input-list-t input').each(function () {
      $(this).val('');
    })
    $('#s_province').val('省');
    $('#s_city').val('市');
    $('#s_county').val('区');
    $('.h1-address').children('span').text('');
    //  清空地址库
    address.addClass('hide');
    addAddress.removeClass('hide');
    $('#setting-default-address').click(function() {
      var i = $(this).children('i');
      removeAddClass(i,'icon-gou');
    })
    $('#up-back').click(function () {
      sameShowHide(addAddress, address);
    })
    $('.add-address').children(':not(.add-address-dialog)').click(function () {
      sameShowHide(addAddress,address);
    })
  })
  $('.input-list').on('focus','input',function () {
    $('.bottom-fixed').hide();
    $('.input-list').css('maxHeight','160px');
  })
  $('.input-list').on('focusout','input',function () {
    $('.bottom-fixed').show();
    $('.input-list').css('maxHeight','200px');
  })
// 默认地址选择
  $(".select_address_nav li").click(function () {
    var i = '';
    $(".select_address_nav li").each(function () {
      $(this).removeClass("select_nav");
    })
    $(this).each(function () {
      i = $(this).index();
      $(this).addClass("select_nav");
    })
    $(".select_address").each(function () {
      var a = $(this).index() - 1;
      if (a == i) {
        $(this).css("display", "block");
      } else {
        $(this).css("display", "none");
      }
    })
  })
  // 城市联动选择器
  $('#s_county').on('change', function () {
    $('#show').val($('#s_province').val() + $('#s_city').val() + $('#s_county').val())
  })
  var select_address = [];
  /*输入完地址后 点击保存按钮 弹出地址列表框*/
  $('#save-address').click(function () {
    $('.input-list-t input').each(function (i) {
      select_address[i] = $(this).val();
    })
    var h1address = $('.h1-address').children('span');
    var isMobile = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (select_address[0] == '') {
      h1address.text('收货人不能为空');
    } else  if (select_address[1] == '') {
      h1address.text('手机号码未填写');
    } else if (select_address[1].length != 11) {
      h1address.text('请输入11位手机号码');
    } else if (!isMobile.test(select_address[1])) {
      h1address.text('请输入正确手机号码');
    } else if ($('#s_province').val() == '省') {
      h1address.text('请选择省份');
    } else if ($('#s_city').val() == '市') {
      h1address.text('请选择城市');
    } else if ($('#s_county').val() == '区') {
      h1address.text('请选择地区');
    } else if (select_address[2] == '') {
      h1address.text('街道地址不能为空');
    } else if (select_address[3] == '') {
      h1address.text('邮件地址不能为空');
    }else {
      //$('.select_address_name').text('姓名：' + select_address[0]);
      //$('.select_address_tel').text('手机：' + select_address[1]);
      //$('.select_address_add').text($('#s_province').val() + $('#s_city').val() + $('#s_county').val() + select_address[2]);

      //$('.address').removeClass('hide');
      
      var $s_province = $('#s_province').find('option').not(function(){ return !this.selected });
      var $s_city = $('#s_city').find('option').not(function(){ return !this.selected });
      var $s_county = $('#s_county').find('option').not(function(){ return !this.selected });
      
      var address = $s_province.text() + $s_city.text() + $s_county.text() + select_address[2];
      $("#address-hide").val(address);
      if($("#isDefault").hasClass("icon-gou"))
	  {
    	  $("#isDefaultStatus").val("1");
	  }else
	  {
		  $("#isDefaultStatus").val("0");
	  }
      $.ajax({
			type : "POST",
			url : "/address/save",
			data:$('#addressForm').serialize(),
			dataType:"json",
			success : function(data) {
				if(data.success)
				{
					h1address.text('保存成功！');
					setTimeout(function(){
						$('.add-address').addClass('hide');
					}, 2000);
				}
			}
		});
    }
    
    
  })
  
  // 批量删除按钮
  $("#batch_delete").click(function(){
  var cartIdArray = new Array();
  $(".some-product .icon-gou").each(function(i,item){
       var cartId = $(this).parent().parent().find('.right a[class="iconfont icon-delete"]').attr('data')
      cartIdArray.push(cartId)
    });
    location.href = '/cart/delete?cartIds=' + cartIdArray;
 });

  var HasSubmit = false;
// 提交订单，传输数据给后台
  $('#sub-dingdan').click(function () {
	  
	  var addressId=$('.select_address').find(".icon-gou").attr("addressId");
	  var cartIdArray = [];
	  var detailLists=$('.some-product-item').find(".icon-gou");
		$.each(detailLists,function(i){
			cartIdArray.push(detailLists.eq(i).attr('cart_id'));
		});
		/*赋值给表单变量*/
		$('#cartId').val(cartIdArray.join(","));
		if(addressId){
			$('#addressId').val(addressId);
		}else{
			alert("抱歉，您还没有选择收货地址!");
			return false;
		}
		$('#btn-confirms').trigger('click');
	  
	  /**
    var transmission_data = new Object();

    // 商品ID和数量！
    transmission_data.productInfo = new Array();
    $('.some-product-item .icon-gou').each(function (i) {
      var middle = $(this).parents('.some-product-item').children('.middle');
      transmission_data.productInfo[i] = new Object();
      transmission_data.productInfo[i].id = middle.children('h1').children('a').attr('href').slice(1); // 商品ID
      transmission_data.productInfo[i].count = middle.children('.count-box').children('input').val();  // 商品数量
    })

    // 地址库
    transmission_data.addressLib = new Object();
    transmission_data.addressLib.province = $('#s_province').val();  // 省
    transmission_data.addressLib.city = $('#s_city').val();  // 市
    transmission_data.addressLib.county = $('#s_county').val();  // 区
    transmission_data.addressLib.detail = select_address[2];

    // 用户信息
    transmission_data.userInfo = new Object();
    transmission_data.userInfo.name = select_address[0];
    transmission_data.userInfo.phone =select_address[1];

    if ($('#total-count') != 0 && $('.h1-address').children('span').text() == '完成') {
      console.log(transmission_data);
    }
    */
  });
  
  // 选择收货地址框事件
  $(".select_address").click(function(){
	  clearSelect();
	  $(this).css("border", "1px solid red");
	  $(this).find(".iconfont").first().removeClass("icon-kongxinyuan").addClass("icon-gou");
  });
  
  // 清除选项
  function clearSelect()
  {
	  $(".select_address").css("border", "none");
	  $(".select_address").find(".icon-gou").each(function(){
		  $(this).removeClass("icon-gou").addClass("icon-kongxinyuan");
	  });
  }
  // 选择默认
  if(addressListSize > 0)
  {
	  // 默认选择默认收货地址(默认第一个)
	  $(".select_address").first().click();
	  // 立即购买跳转过来
	  if(buynow && !!cartId && 0 != cartId)
	  {
		  var $selectCart = $(".some-product .first .iconfont[cart_id='"+cartId+"']");
		  if($selectCart.hasClass("icon-kongxinyuan"))
		  {
			  $selectCart.parent(".first").click();
			  GoMony.click();
		  }
	  }
  }
  
  var h1address = $('.h1-address').children('span');
  /**
   * 
   */
  $("#addressForm").on("submit", function(ev) {
	  var $s_province = $('#s_province').find('option').not(function(){ return !this.selected });
      var $s_city = $('#s_city').find('option').not(function(){ return !this.selected });
      var $s_county = $('#s_county').find('option').not(function(){ return !this.selected });
      
      var address = $s_province.text() + $s_city.text() + $s_county.text() + $("#addr-id").val();
      $("#address-hide").val(address);
      if($("#isDefault").hasClass("icon-gou"))
	  {
    	  $("#isDefaultStatus").val("1");
	  }else
	  {
		  $("#isDefaultStatus").val("0");
	  }
      
      
      $.ajax({
			type : "POST",
			url : "/address/save",
			data:$('#addressForm').serialize(),
			dataType:"json",
			success : function(data) {
				if(data.success)
				{
					h1address.text('保存成功！');
					setTimeout(function(){
						location.href = "/cart";
					}, 2000);
				}
			}
		}); 
      
      //阻止submit表单提交  
      ev.preventDefault();  
      //或者return false  
      return false;  
  });
  
  // 省份切换
  function changearea(){
		var pid=$(".receiving_address_provice option[selected='selected']").val();
		var cid=$(".receiving_address_city option[selected='selected']").val();
		var did=$(".receiving_address_county option[selected='selected']").val();
		if(pid==0){
			pid=-2;
			cid=-2;
			did=-2;
		}
		$.ajax({
			type:"get",
			url:"/address/getarea",
			data:{
				id:0,
			},
			success:function(data){
				$.each(data,function(n,m){
					if(m.id!=pid){
					$(".receiving_address_provice option[selected='selected']").after('<option value='+m.id+'>'+m.name+'</option>');
					}
				})
			}
		});
		$.ajax({
			type:"get",
			url:"/address/getarea",
			data:{
				id:pid,
			},
			success:function(data){
				$.each(data,function(n,m){
					if(m.id!=cid){
					  $(".receiving_address_city option[selected='selected']").after('<option value='+m.id+'>'+m.name+'</option>');
					}
				})
			}
		});
		$.ajax({
			type:"get",
			url:"/address/getarea",
			data:{
				id:cid,
			},
			success:function(data){
				$.each(data,function(n,m){
					if(m.id!=did){
					$(".receiving_address_county option[selected='selected']").after('<option value='+m.id+'>'+m.name+'</option>');
					}
				})
			}
		});
		$(".receiving_address_provice").on("change",function(){
			var pid=$(".receiving_address_provice").val();
			$(".receiving_address_city").html("");
			$(".receiving_address_city").append("<option selected='selected' value='-2'>市</option>");
			$(".receiving_address_county").html("");
			$(".receiving_address_county").append("<option selected='selected' value='-2'>区/县</option>");
			if(pid!=0){
			$.ajax({
				type:"get",
				url:"/address/getarea",
				data:{
					id:pid,
				},
				success:function(data){
					$.each(data,function(n,m){
						$(".receiving_address_city option[selected='selected']").after('<option value='+m.id+'>'+m.name+'</option>');
					})
				}
			});
		}
		});
		$(".receiving_address_city").on("change",function(){
				var cid=$(".receiving_address_city").val();
				$(".receiving_address_county").html("");
				$(".receiving_address_county").append("<option selected='selected' value='-2'>区/县</option>");
				if(cid!=-2){
				$.ajax({
					type:"get",
					url:"/address/getarea",
					data:{
						id:cid,
					},
					success:function(data){
						$.each(data,function(n,m){
							$(".receiving_address_county option[selected='selected']").after('<option value='+m.id+'>'+m.name+'</option>');
						})
					}
				});
				}
		});
	}
  
  	changearea();
})()

