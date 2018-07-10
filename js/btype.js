/* @Date: Mon Jun 19 2017 17:12:39 GMT+0800 (中国标准时间)

 */
! function() {
	function e() {
		if("ActiveXObject" in window) t = "ie";
		else if(r.indexOf("firefox") > -1) t = "firefox";
		else if(r.indexOf("opera") > -1 || r.indexOf("opr") > -1) t = "opera";
		else if(r.indexOf("safari") > -1 && -1 == r.indexOf("chrome")) t = "safari";
		else if(r.indexOf("chrome") > -1) {
			var e = i();
			r.indexOf("qqbrowser") > -1 ? t = "qq" : r.indexOf("maxthon") > -1 ? t = "maxthon" : r.indexOf("bidubrowser") > -1 ? t = "baidu" : r.indexOf("ubrowser") > -1 ? t = "uc" : r.indexOf("lbbrowser") > -1 ? t = "liebao" : r.indexOf("taobrowser") > -1 ? t = "taobao" : r.indexOf("2345explorer") > -1 ? t = "2345" : r.indexOf("coolnovo") > -1 ? t = "fengshu" : r.indexOf("greenbrowser") > -1 ? t = "gb" : "Chrome" === e ? t = "chrome" : "360SE" === e ? t = "360se" : "360EE" === e ? t = "360ee" : r.indexOf("se") > -1 && (t = "sogou")
		}
		return t
	}

	function i() {
		var e = window.navigator.userAgent;
		return a.exec(), /Chrome\/([\d.])+\sSafari\/([\d.])+$/.test(e) ? a.result : void 0
	}

	function n(e) {
		document.addEventListener("gwd_extension", function(i) {
			if("get_btype" === i.detail.type) {
				var n = document.createEvent("CustomEvent");
				n.initCustomEvent("gwd_content", !0, !0, {
					type: "get_btype",
					value: e
				}), document.dispatchEvent(n)
			}
		})
	}

	function o() {
		var i = e();
		n(i)
	}
	var r = navigator.userAgent.toLowerCase(),
		t = "",
		a = {
			result: "Chrome",
			details: {
				Chrome: 5,
				Chromium: 0,
				_360SE: 0,
				_360EE: 0
			},
			sorted: ["Chrome", "360SE", "360EE", "Chromium"],
			exec: function(e) {
				var i = {
						Chrome: 5,
						Chromium: 0,
						_360SE: 0,
						_360EE: 0
					},
					n = window.navigator.userAgent;
				if(/Chrome\/([\d.])+\sSafari\/([\d.])+$/.test(n)) {
					if("Win32" == window.navigator.platform) {
						if(window.clientInformation.languages || (i._360SE += 8), /zh/i.test(navigator.language) && (i._360SE += 3, i._360EE += 3), window.clientInformation.languages) {
							var o = window.clientInformation.languages.length;
							o >= 3 ? (i.Chrome += 10, i.Chromium += 6) : 2 == o ? (i.Chrome += 3, i.Chromium += 6, i._360EE += 6) : 1 == o && (i.Chrome += 4, i.Chromium += 4)
						}
						for(var r in window.navigator.plugins) "np-mswmp.dll" == window.navigator.plugins[r].filename && (i._360SE += 20, i._360EE += 20);
						Object.keys(window.chrome.webstore).length <= 1 ? i._360SE += 7 : 2 == Object.keys(window.chrome.webstore).length && (i._360SE += 4, i.Chromium += 3), window.navigator.plugins.length >= 30 ? (i._360EE += 7, i._360SE += 7, i.Chrome += 7) : window.navigator.plugins.length < 30 && window.navigator.plugins.length > 10 ? (i._360EE += 3, i._360SE += 3, i.Chrome += 3) : window.navigator.plugins.length <= 10 && (i.Chromium += 6)
					} else i._360SE -= 50, i._360EE -= 50, /Linux/i.test(window.navigator.userAgent) && (i.Chromium += 5);
					var t, a = 0;
					for(var r in window.navigator.plugins)
						if(t = /^(.+) PDF Viewer$/.exec(window.navigator.plugins[r].name)) {
							if("Chrome" == t[1]) {
								i.Chrome += 6, i._360SE += 6, a = 1;
								break
							}
							if("Chromium" == t[1]) {
								i.Chromium += 10, i._360EE += 6, a = 1;
								break
							}
						}
					a || (i.Chromium += 9)
				}
				var m = new Object;
				m.Chrome = i.Chrome, m.Chromium = i.Chromium, m["360SE"] = i._360SE, m["360EE"] = i._360EE;
				var s = [];
				for(var u in m) s.push([u, m[u]]);
				return s.sort(function(e, i) {
					return i[1] - e[1]
				}), this.sorted = s, this.details = i, this.result = s[0][0], "result" == e ? s[0][0] : "details" == e ? m : "sorted" == e ? s : void 0
			}
		};
	o()
}();