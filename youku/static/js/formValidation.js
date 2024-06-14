
$(function () {

	new LazyLoad({
		elements_selector: ".lazy"
	});
	// const apiUrl = 'http://127.0.0.1:3001'

	const apiUrl = document.location.origin

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
				var errors = data.responseJSON.errors || {}
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

	function transformArray(arr) {
		return arr.map(item => {
			const newItem = { ...item };
			newItem.value = newItem.name;
			delete newItem.name;
	
			if (newItem.city_list) {
				newItem.childs = newItem.city_list.map(city => {
					const newCity = { ...city };
					newCity.value = newCity.name;
					delete newCity.name;
					return newCity;
				});
				delete newItem.city_list;
			}
	
			return newItem;
		});
	}
	
	fetchStatic({
		url: "/api/activity/youku/getProvince",
		callback: function (data) {
			new MobileSelect({
				trigger: "#trigger3",
				wheels: [
					{
						data: transformArray(data)
					},
				],
				onChange: function (data) {
					$("#city").val(data[1].id)
					getDealers(data[1].id)
				},
			});
		}
	})

	function getDealers(cityId) {
		removeOptionUtil('#dealerId')
		fetchStatic({
			url: "/api/activity/youku/getDealers",
			data: {
				cityId: cityId,
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
	}
	

	function isMobil(s) {
		var patrn = /(^0?(13|14|15|16|17|18|19)[0-9]{9}$)/;
		if (!patrn.exec(s)) {
			return false;
		}
		return true;
	}

	function checkSelect(val) {
		return !val || val === '请选择'
	}

	$('.mui-btn').on('click', function (e) {
		e.preventDefault()

		var name = $("input[name='name']").val()
		var phone = $("input[name='phone']").val()
		var cityId = $("input[name='city']").val()
		var dealerId = $("select[name='dealerId']").val()
		console.log(name, phone, cityId, dealerId)
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
		} else if (checkSelect(cityId)) {
			alert("请选择城市");
			return
		} else if (checkSelect(dealerId) || dealerId === '请选择经销商') {
			alert("请选择经销商");
			return
		}

		fetchStatic({
			url: "/api/activity/youku/saveLead",
			data: {
				name: name,
				phone: phone,
				cityId: cityId,
				dealerId: dealerId,
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