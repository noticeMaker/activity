function isMobil(s) {
	var patrn = /(^0?(13|14|15|16|17|18|19)[0-9]{9}$)/;
	if (!patrn.exec(s)) {
		return false;
	}
	return true;
}

function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

window.alert = function(msg) {
	var div = document.createElement("div");
	div.innerHTML = "<style type=\"text/css\">"
			+ ".nbaMask { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); }                                                                                                                                                                       "
			+ ".nbaMaskTransparent { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; }                                                                                                                                                                                            "
			+ ".nbaDialog { position: fixed; z-index: 5000; width: 80%; max-width: 300px; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); background-color: #fff; text-align: center; border-radius: 8px; overflow: hidden; opacity: 1; color: white; }"
			+ ".nbaDialog .nbaDialogHd { padding: .2rem .27rem .08rem .27rem; }                                                                                                                                                                                                                         "
			+ ".nbaDialog .nbaDialogHd .nbaDialogTitle { font-size: 17px; font-weight: 400; }                                                                                                                                                                                                           "
			+ ".nbaDialog .nbaDialogBd { padding: 0 .27rem; font-size: 15px; line-height: 1.3; word-wrap: break-word; word-break: break-all; color: #000000; }                                                                                                                                          "
			+ ".nbaDialog .nbaDialogFt { position: relative; line-height: 48px; font-size: 17px; display: -webkit-box; display: -webkit-flex; display: flex; }                                                                                                                                          "
			+ ".nbaDialog .nbaDialogFt:after { content: \" \"; position: absolute; left: 0; top: 0; right: 0; height: 1px; border-top: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleY(0.5); transform: scaleY(0.5); }               "
			+ ".nbaDialog .nbaDialogBtn { display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1; color: #165484; text-decoration: none; -webkit-tap-highlight-color: transparent; position: relative; margin-bottom: 0; }                                                                       "
			+ ".nbaDialog .nbaDialogBtn:after { content: \" \"; position: absolute; left: 0; top: 0; width: 1px; bottom: 0; border-left: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleX(0.5); transform: scaleX(0.5); }             "
			+ ".nbaDialog a { text-decoration: none; -webkit-tap-highlight-color: transparent; }"
			+ "</style>"
			+ "<div id=\"dialogs2\" style=\"display: none\">"
			+ "<div class=\"nbaMask\"></div>"
			+ "<div class=\"nbaDialog\">"
			+ "	<div class=\"nbaDialogHd\">"
			+ "		<strong class=\"nbaDialogTitle\"></strong>"
			+ "	</div>"
			+ "	<div class=\"nbaDialogBd\" id=\"dialog_msg2\">弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div>"
			+ "	<div class=\"nbaDialogHd\">"
			+ "		<strong class=\"nbaDialogTitle\"></strong>"
			+ "	</div>"
			+ "	<div class=\"nbaDialogFt\">"
			+ "		<a href=\"javascript:;\" class=\"nbaDialogBtn nbaDialogBtnPrimary\" id=\"dialog_ok2\">确定</a>"
			+ "	</div></div></div>";
	document.body.appendChild(div);
 
	var dialogs2 = document.getElementById("dialogs2");
	dialogs2.style.display = 'block';
 
	var dialog_msg2 = document.getElementById("dialog_msg2");
	dialog_msg2.innerHTML = msg;

	var dialog_ok2 = document.getElementById("dialog_ok2");
	dialog_ok2.onclick = function() {
		dialogs2.style.display = 'none';
		if (msg == '提交成功！') {
		}
	};
};

$("#btnsave").click(function(e) {
	var e = e || window.event

	var name = $("#name").val()
	var mobile = $("#mobile").val()
	var cityId = $("#ftms_city").val()
	var cityName = $("#ftms_city").find("option:selected").text()
	var storesId = $("#ftms_dealer").val()
	var storesName = $("#ftms_dealer").find("option:selected").text()
	var provinceId = $("#ftms_province").val()
	var provinceName = $("#ftms_province").find("option:selected").text()
	var sex = $("#sex").val()
	var regi_date = $("#regi_date").val()
	var buyDate = $("#buy_date").val()
	var sel = $("#sel").is(':checked')

	if (name == "") {
		alert("请输入姓名!");
		$("#name").focus();
		return
	} else if (sex == 0) {
		alert("请选择称谓!");
		return
	} else if (mobile == "") {
		alert("请输入联系电话!");
		$("#mobile").focus();
		return
	} else if (!isMobil(mobile)) {
		alert("联系电话格式不正确！");
		$("#mobile").focus();
		return
	} else if (provinceId == 0 || provinceName == "请选择省份") {
		alert("省没有选择");
		return
	} else if (cityId == 0 || cityName == "请选择市/区") {
		alert("城市没有选择");
		return
	} else if (storesId == 0 || storesName == "请选择经销商") {
		alert("经销商没有选择");
		return
	} else if (buyDate == "") {
		alert("请选择您计划的购车时间");
		return
	} else if (regi_date == "") {
		alert("请选择预约时间");
		return
	} else if (!sel) {
		alert("请阅读并同意《隐私政策》");
		return
	}
	var utm_source = getUrlParameter('channel') || 'wangyiyun0102'

	// 默认1月2号的配置
	var activityInfo = {
		id: 782,
		seriesId: 36,
		tokenName: 'toyota20191125',
		utm_source: 'wangyiyun1216'
	}

	switch (utm_source) {
		case 'wangyiyun0102':
			activityInfo = {
				id: 793,
				seriesId: 36,
				tokenName: 'toyota20191125',
				utm_source: utm_source,
			}
			break;
		default:
			break;
	}

	var payload = {
		'mediaLeadType': '预约试驾',
		'name': name,
		'phone': mobile,
		'provinceId': provinceId,
		'cityId': cityId,
		'dealerId': storesId,
		'seriesId': activityInfo.seriesId,
		'activity': activityInfo.id,
		'projectName': 'laluola1126',
		driveTime: regi_date,
		orderTime: buyDate,
		sex: sex,
		tokenName: activityInfo.tokenName,
		utm_source: activityInfo.utm_source
	}
	
	$.ajax({
		type:"post",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		url: "http://ab.t5a.cn/api/activity/toyota",
		data: JSON.stringify(payload),
		success: function (data, textstatus, xhr) {
			if (xhr.status == 200) {
				alert('提交成功！')
			}
		},
		error: function (data) {
			var errors = data.responseJSON.errors
			alert(errors.message)
		}
	})
})