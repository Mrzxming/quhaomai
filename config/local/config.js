let websiteUrl = "https://www.ok9288.com"

// #ifdef H5
// 获取域名
// var k_host = window.location.host;
// 根据需要切换 H5 域名
// websiteUrl = "https://" + k_host
// websiteUrl = "https://test.ok9288.com"
// websiteUrl = "https://open.ok9288.com"
// websiteUrl = "https://jiu.ok9288.com"
// #endif

// #ifndef H5
// 根据需要切换非 H5 域名
// websiteUrl = "https://open.ok9288.com"
// websiteUrl = "https://test.ok9288.com"
// #endif

//小程序直播插件appid 一般不需要修改
const liveAppid = "wx2b03c6e691cd7370"

// app版本号appid后台设置（根据平台动态选择）
const updateAppidAndroid = "f2f09e1e4902535b"; // for Android
const updateAppidIOS = "cae16c4a4960c113"; // for iOS
let updateAppid = updateAppidAndroid;
try {
	// APP 端根据平台动态切换，H5/小程序保持默认
	const sys = uni.getSystemInfoSync && uni.getSystemInfoSync();
	const platform = (sys.platform || sys.osName || '').toLowerCase();
	if (platform === 'ios' || platform === 'mac') {
		updateAppid = updateAppidIOS;
	} else if (platform === 'android') {
		updateAppid = updateAppidAndroid;
	}
} catch (e) {
	// 兜底：获取失败时使用 Android 配置
	updateAppid = updateAppidAndroid;
}

export {
	websiteUrl,
	liveAppid,
	updateAppid
}