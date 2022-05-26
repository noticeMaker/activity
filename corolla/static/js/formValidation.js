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

	// const apiUrl = 'http://127.0.0.1:3000'

	const apiUrl = document.location.origin

	const tokenName = 'corolla'
	function fetchStatic(payload) {
		$.ajax({
			type: "post",
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			url: apiUrl + payload.url,
			data: JSON.stringify(payload.data),
			success: function (data, _i, xhr) {
				if (xhr.status == 200 && data.response) {
					payload.callback && payload.callback(data.response.data, null)
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
		url: "/api/activity/rongfang/getProvince",
		data: {
			tokenName: tokenName
		},
		callback: function (data) {

			$.each(data, function (key, value) {

				$('#province').append($('<option>',
					{
						value: value.id,
						text: value.name
					}));
			})
		}
	})

	$('#province').on('change', function (val) {

		removeOptionUtil('#city')
		removeOptionUtil('#dealer')
		fetchStatic({
			url: "/api/activity/rongfang/getCity",
			data: {
				tokenName: tokenName,
				provinceId: this.value
			},
			callback: function (data) {
				$.each(data, function (key, value) {
					$('#city').append($('<option>',
						{
							value: value.id,
							text: value.name
						}));
				})
			}
		})
	});

	$('#city').on('change', function (val) {
		removeOptionUtil('#dealer')
		fetchStatic({
			url: "/api/activity/rongfang/getDealer",
			data: {
				tokenName: tokenName,
				cityId: this.value
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
			url: "/api/activity/toyota",
			data: {
				'mediaLeadType': '预约试驾',
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
				// 活动标示 测试
				// 'activity': 606,
				// xianshang
				'activity': 1898,
				// 项目名次
				'projectName': 'corolla',
				// 购车时间
				orderTime: getDate(),
				// tokenname
				tokenName: tokenName
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