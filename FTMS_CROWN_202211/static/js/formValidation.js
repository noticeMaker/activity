
$(function () {

	new LazyLoad({
		elements_selector: ".lazy"
	});

	new Swiper('.swiper-container', {
		// 如果需要分页器
		pagination: {
			el: '.swiper-pagination',
		},
	})

	$('#config').change(function () {
		$('.configTable').hide();
		$('.configTable' + $(this).val()).show();
		$('.configMsgSmBox').scrollTop(0);
	});

	// const apiUrl = 'http://127.0.0.1:3000'

	const apiUrl = document.location.origin

	const tokenName = 'crown_1130'
	function fetchStatic(payload) {
		$.ajax({
			type: "post",
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			url: apiUrl + payload.url,
			data: JSON.stringify(payload.data),
			success: function (data, _i, xhr) {
				console.log(data, xhr)
				if (xhr.status == 200 && data.response) {
					payload.callback && payload.callback(data.response, null)
				}
			},
			error: function (data) {
				var errors = data.responseJSON.errors
				alert({}, errors.message)
			}
		})
	}

	function removeOptionUtil(id) {
		$(id).empty();
		$(id).append($('<option>', {
			value: undefined,
			text: '请选择'
		}));
	}

	fetchStatic({
		url: "/api/clue/getProvince",
		data: {
			configKey: tokenName
		},
		callback: function (data) {
			console.log(data)
			$.each(data, function (key, value) {

				$('#province').append($('<option>',
					{
						value: value.code,
						text: value.name
					}));
			})
		}
	})

	$('#province').on('change', function (val) {

		removeOptionUtil('#city')
		removeOptionUtil('#dealer')
		fetchStatic({
			url: "/api/clue/getCityByPid",
			data: {
				configKey: tokenName,
				provinceCode: this.value
			},
			callback: function (data) {
				$.each(data, function (key, value) {
					$('#city').append($('<option>',
						{
							value: value.code,
							text: value.name
						}));
				})
			}
		})
	});

	$('#city').on('change', function (val) {
		removeOptionUtil('#dealer')
		fetchStatic({
			url: "/api/clue/getDealerByCid",
			data: {
				configKey: tokenName,
				cityCode: this.value
			},
			callback: function (data) {
				$.each(data, function (key, value) {
					$('#dealer').append($('<option>',
						{
							value: value.code,
							text: value.name
						}));
				})
			}
		})
	});

	$('#info').on('click', function () {
		$('.ui.modal').modal('show');
	})

	function isMobil(s) {
		var patrn = /(^0?(13|14|15|16|17|18|19)[0-9]{9}$)/;
		if (!patrn.exec(s)) {
			return false;
		}
		return true;
	}

	function getDate() {
		var today = new Date();
		var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		return date + ' ' + time;
	}
	function checkSelect(val) {
		return !val || val === '请选择'
	}

	$('.mui-btn').on('click', function (e) {
		e.preventDefault()

		var name = $("input[name='name']").val()
		var phone = $("input[name='phone']").val()
		var seriesId = $("select[name='seriesId']").val()
		var provinceId = $("select[name='provinceId']").val()
		var cityId = $("select[name='cityId']").val()
		var dealerId = $("select[name='dealerId']").val()
		var sel = $("input[name='sel'").is(':checked')

		if (name == "") {
			alert("请输入姓名!");
			$("#name").focus();
			return
		} else if (phone == "") {
			alert("请输入联系电话!");
			return
		} else if (!isMobil(phone)) {
			alert("联系电话格式不正确！");
			return
		} else if (checkSelect(seriesId)) {
			alert("请选择试驾车型");
			return
		} else if (checkSelect(provinceId)) {
			alert("省没有选择");
			return
		} else if (checkSelect(cityId)) {
			alert("城市没有选择");
			return
		} else if (checkSelect(dealerId)) {
			alert("经销商没有选择");
			return
		} else if (!sel) {
			alert("请阅读并同意《隐私政策》");
			return
		}

		fetchStatic({
			url: "/api/clue/save",
			data: {
				'name': name,
				'phone': phone,
				// 省份
				'provinceId': provinceId,
				// 城市
				'cityId': cityId,
				// 经销商
				'dealerId': dealerId,
				// 试驾车型
				'seriesId': seriesId,
				mediaLeadType: '预约试驾',
				// 购车时间
				orderTime: getDate(),
				// tokenname
				configKey: tokenName
			},
			callback: function (data, error) {
				if (error) {
					alert(message)
					return
				}

				alert('提交成功！')
			}
		})
	})
})