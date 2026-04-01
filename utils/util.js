//公共js，主要做表单验证，以及基本方法封装

/*
graceUI rich-text 加强工具
*/

// 正则变量
var graceRichTextReg;

// 批量替换的样式 [ 根据项目需求自行设置 ]
var GRT = [
	// div 样式
	['div', "line-height:2em;"],
	// h1 样式
	['h1', "font-size:3em; line-height:1.5em;"],
	// h2 样式
	['h2', "font-size:2em; line-height:1.8em;"],
	// h3 样式
	['h3', "font-size:1.6em; line-height:2em;"],
	// h4 样式
	['h4', "font-size:1.2em; line-height:2em;"],
	// h5 样式
	['h5', "font-size:1em; line-height:2em;"],
	// h6 样式
	['h6', "font-size:0.9em; line-height:2em;"],
	// p 样式
	['p', "font-size:1em; line-height:2em;"],
	// b 样式
	['b', "font-size:1em; line-height:2em;"],
	// strong 样式
	['strong', "font-size:1em; line-height:2em;"],
	// code 样式
	['code', "font-size:1em; line-height:1.2em; background:#F6F7F8; padding:8px 2%; width:96%;"],
	// img 样式
	['img', "width:100%; margin: 48rpx 0;"],
	// blockquote
	['blockquote',
		"font-size:1em; border-left:3px solid #D1D1D1; line-height:2em; border-radius:5px; background:#F6F7F8; padding:8px 2%;"
	],
	// li 样式
	['ul', "padding:5px 0; list-style:none; padding:0; margin:0;"],
	['li', "line-height:1.5em; padding:5px 0; list-style:none; padding:0; margin:0; margin-top:10px;"],
	// table
	['table', "width:100%; border-left:1px solid #F2F3F4; border-top:1px solid #F2F3F4;"],
	['th', "border-right:1px solid #F2F3F4; border-bottom:1px solid #F2F3F4;"],
	['td', "border-right:1px solid #F2F3F4; border-bottom:1px solid #F2F3F4; padding-left:5px;"]
];
const utils = {
	isNullOrEmpty: function(value) {
		//是否为空
		return (value === null || value === '' || value === undefined) ? true : false;
	},
	trim: function(value) {
		//去空格
		return value.replace(/(^\s*)|(\s*$)/g, "");
	},
	isMobile: function(value) {
		//是否为手机号
		return /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(value);
	},
	isFloat: function(value) {
		//金额，只允许保留两位小数
		return /^([0-9]*[.]?[0-9])[0-9]{0,1}$/.test(value);
	},
	isNum: function(value) {
		//是否全为数字
		return /^[0-9]+$/.test(value);
	},
	checkPwd: function(value) {
		//密码为8~20位数字和字母组合
		return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(value);
	},
	formatNum: function(num) {
		//格式化手机号码
		if (utils.isMobile(num)) {
			num = num.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
		}
		return num;
	},
	rmoney: function(money) {
		//金额格式化
		return parseFloat(money).toFixed(2).toString().split('').reverse().join('').replace(/(\d{3})/g, '$1,')
			.replace(
				/\,$/, '').split('').reverse().join('');
	},
	formatDate: function(formatStr, fdate) {
		//日期格式化
		if (fdate) {
			if (~fdate.indexOf('.')) {
				fdate = fdate.substring(0, fdate.indexOf('.'));
			}
			fdate = fdate.toString().replace('T', ' ').replace(/\-/g, '/');
			var fTime, fStr = 'ymdhis';
			if (!formatStr)
				formatStr = "y-m-d h:i:s";
			if (fdate)
				fTime = new Date(fdate);
			else
				fTime = new Date();
			var month = fTime.getMonth() + 1;
			var day = fTime.getDate();
			var hours = fTime.getHours();
			var minu = fTime.getMinutes();
			var second = fTime.getSeconds();
			month = month < 10 ? '0' + month : month;
			day = day < 10 ? '0' + day : day;
			hours = hours < 10 ? ('0' + hours) : hours;
			minu = minu < 10 ? '0' + minu : minu;
			second = second < 10 ? '0' + second : second;
			var formatArr = [
				fTime.getFullYear().toString(),
				month.toString(),
				day.toString(),
				hours.toString(),
				minu.toString(),
				second.toString()
			]
			for (var i = 0; i < formatArr.length; i++) {
				formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
			}
			return formatStr;
		} else {
			return "";
		}
	},
	njsNotificationForAndroid: function(title,content,isOngoing) {
		if (uni.getSystemInfoSync().platform == "android") {
			console.log('准备调起常驻通知栏');
			const main = plus.android.runtimeMainActivity();
			const Context = plus.android.importClass('android.content.Context');
			const Notification = plus.android.importClass('android.app.Notification');
			const mNotification = new Notification.Builder(main);
			const Intent = plus.android.importClass('android.content.Intent');
			const PendingIntent = plus.android.importClass('android.app.PendingIntent');
			const android_R = plus.android.importClass(
			'com.qingquwm.waimaibiz.R'); // android.R：使用系统默认图标，可以把android改成实际项目的包名，则会使用项目的图标
			console.log(android_R);
			if (isOngoing) mNotification.setOngoing(true); // 这个如果被注释掉，则允许滑动删除
			mNotification.setContentTitle(title);
			mNotification.setContentText(content);
			mNotification.setSmallIcon(android_R.drawable
			.ic_notification_overlay); // 需要在原生项目的drawable目录下添加ic_notification_overlay.png
			mNotification.setTicker(content); // 无障碍
			mNotification.setContentIntent(PendingIntent.getActivity(main, 0, new Intent(main, main.getClass()),
				PendingIntent.FLAG_CANCEL_CURRENT));
			main.getSystemService(Context.NOTIFICATION_SERVICE).notify(1, mNotification.build());
		}
	},

	format: function(html) {
		html = html.replace(/<pre.*pre>?/gis, function(word) {
			word = word.replace(/[\n]/gi, '<br />');
			word = word.replace(/    /gi, '<span style="padding-left:2em;"></span>');
			return word.replace(/[\t]/gi, '<span style="padding-left:2em;"></span>');
		});
		html = html.replace(/<pre/gi,
			'<p style="font-size:1em; margin:12px 0; line-height:1.2em; background:#F6F7F8; border-radius:5px; padding:8px 4%; width:92%;"'
			);
		html = html.replace(/<\/pre/gi, "</p");
		for (let i = 0; i < GRT.length; i++) {
			graceRichTextReg = new RegExp('<' + GRT[i][0] + '>|<' + GRT[i][0] + ' (.*?)>', 'gi');
			html = html.replace(graceRichTextReg, function(word) {
				// 分析 dom 上是否带有 style=""
				if (word.indexOf('style=') != -1) {
					var regIn = new RegExp('<' + GRT[i][0] + '(.*?)style="(.*?)"(.*?)(/?)>', 'gi');
					return word.replace(regIn, '<' + GRT[i][0] + '$1style="$2 ' + GRT[i][1] + '"$3$4>');
				} else {
					var regIn = new RegExp('<' + GRT[i][0] + '(.*?)(/?)>', 'gi');
					return word.replace(regIn, '<' + GRT[i][0] + '$1 style="' + GRT[i][1] + '$2">');
				}
			});
		}
		return html;
	},
	get7Date: function() {
		var date1 = new Date();
		var date2 = new Date(date1)
		date2.setDate(date1.getDate() - 7)
		var seperator1 = "-";
		var year = date2.getFullYear();
		var month = date2.getMonth() + 1;
		var strDate = date2.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate2 = year + seperator1 + month + seperator1 + strDate;
		return currentdate2
	},
	formatDateTime: function(inputTime) { //时间戳 转 YY-mm-dd HH:ii:ss
		var inputTime = inputTime + 3600 * 8; //差8个小时
		var date = new Date(inputTime * 1000);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
	
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
	},
	
	/* 获取 */
	getCurDate: function(){
	    return Math.round((new Date()).getTime()/1000)
	}
}

module.exports = {
	isNullOrEmpty: utils.isNullOrEmpty,
	trim: utils.trim,
	isMobile: utils.isMobile,
	isFloat: utils.isFloat,
	isNum: utils.isNum,
	checkPwd: utils.checkPwd,
	formatNum: utils.formatNum,
	rmoney: utils.rmoney,
	formatDate: utils.formatDate,
	njsNotificationForAndroid: utils.njsNotificationForAndroid,
	format: utils.format,
	get7Date: utils.get7Date,
	getCurDate: utils.getCurDate,
	formatDateTime: utils.formatDateTime
}
