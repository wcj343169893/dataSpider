/* @Date: Mon Jun 19 2017 17:12:39 GMT+0800 (中国标准时间)

 */
function getImg(e, t) {
	var r = new XMLHttpRequest;
	r.responseType = "blob", r.addEventListener("load", function() {
		r.response && postMsg(r.response, t)
	}), r.open("GET", e, !0), r.send()
}
function getDetail(e, muserinfo,t) {
	var id=e;
	var url="https://detail.1688.com/offer/"+id+".html";
	request(url,function(data){
		//提取有用的部分
		var index1=data.indexOf('iDetailConfig');
		var index2=data.indexOf('价格说明</div>');
		if(data.indexOf("商品已下架")>0){
			data="商品已下架";
		}else{
			if(index1 > 0 && index2> 0){
				data=data.substring(index1,index2);
			}
		}
		var r = "";
		var n = muserinfo["base"]+"/mallapi/wdIndex/reportgoodscontent.json?uid="+muserinfo["uid"]+"&token="+muserinfo["token"]+"&id="+id,
			o = new XMLHttpRequest;
		o.addEventListener("load", function() {
			t(o.responseText)
		}), o.open("POST", n, !0), o.send(data)
		});
}


function buildUrl(e, t) {
	if(e && "" != e) {
		var r = (new Date).getFullYear(),
			n = (new Date).getMonth() + 1,
			o = (new Date).getDate();
		n = 10 > n ? "0" + n.toString() : n.toString(), o = 10 > o ? "0" + o.toString() : o.toString();
		var s = "staobaoz_" + r.toString() + n + o,
			a = "https://s.taobao.com/search?q=&imgfile=&js=1&stats_click=search_radio_all%253A1&initiative_id=" + s + "&ie=utf8&tfsid=" + e + "&app=imgsearch";
		request(a, function(e) {
			var r = e.match(/\<script\>\s+g_page_config\s=\s(.*)/);
			r && (r = r[1].match(/(\{.*\});/)), r && (r = r[1]), t(r)
		})
	}
}

function postMsg(e, t) {
	for(var r = "0123456789abcdefgABCDEFG", n = "", o = 0; 17 > o; o++) n += r.charAt(Math.round(23 * Math.random()));
	var s = new FormData;
	s.append("imgfile", e, n + ".jpg");
	var a = new XMLHttpRequest;
	a.addEventListener("load", function() {
		try {
			var e = JSON.parse(a.response).name
		} catch(r) {
			var e = ""
		}
		buildUrl(e, t)
	}), a.open("POST", "https://s.taobao.com/image", !0), a.send(s)
}

function requestPost(e, t) {
	var r = "";
	e.info && (r = e.info, r = JSON.stringify(r), r = encodeURIComponent(r));
	var n = e.url,
		o = new XMLHttpRequest;
	o.addEventListener("load", function() {
		t(o.responseText)
	}), o.open("POST", n, !0), o.send(r)
}

function request(e, t) {
	var r = new XMLHttpRequest;
	r.addEventListener("load", function() {
		t(r.responseText)
	}), r.open("GET", e, !0), r.send()
}
try {
	var utype = navigator.userAgent.toLowerCase(),
		url = "http://www.gwdang.com/app/extension/?browser=chrome",
		uninstallUrl = "http://www.gwdang.com/brwext/uninstall?browser=chrome";
	utype.indexOf("qqbrowser") > -1 && 
	(url = "http://www.gwdang.com/app/extension/?browser=qq", uninstallUrl = "http://www.gwdang.com/brwext/uninstall?browser=qq"),
	localStorage.ran_before || (localStorage.ran_before = "1")
} catch(e) {}
chrome.runtime.onMessage.addListener(function(e, t, r) {
		return "amazonTrend" === e.type || "aliexpress" === e.type ? requestPost(e, function(e) {
			r(e)
		}) : "taobaoImg" === e.type ? getImg(e.src, function(e) {
			r(e)
		}) : "taobaoDetail" === e.type ? getDetail(e.src,e.uinfo, function(e) {
			r(e)
		}) : "getTaobaoTrend" === e.type ? request(e.info, function(e) {
			r(e)
		}) : request(e.url, function(e) {
			r(e)
		}), !0
	}),
	function() {
		var e;
		request("http://browser.gwdang.com/js/block.js", function(t) {
			try {
				e = JSON.parse(t), e && e.urls && e.urls.length && chrome.webRequest.onBeforeRequest.addListener(function(t) {
					for(var r = 0; r < e.urls.length; r++) {
						var n = e.urls[r];
						if(new RegExp(n).test(t.url)) return {
							cancel: !0
						}
					}
				}, {
					urls: ["<all_urls>"]
				}, ["blocking"]), e["csp-headers"] && chrome.webRequest.onHeadersReceived.addListener(function(t) {
					for(var r = 0; r < e["csp-headers"].length; r++) {
						var n = e["csp-headers"][r];
						if(new RegExp(n).test(t.url)) {
							for(var r = 0; r < t.responseHeaders.length; r++) t.responseHeaders[r].name.match(/(?:Content-Security-Policy|X-Content-Security-Policy|X-WebKit-CSP)/) && t.responseHeaders.splice(r, 1);
							return {
								responseHeaders: t.responseHeaders
							}
						}
					}
				}, {
					urls: ["<all_urls>"]
				}, ["blocking", "responseHeaders"])
			} catch(r) {}
		})
	}(),
	function() {
		var e = "http://www.gwdang.com/window/tip?time=";
		chrome.storage.local.get("info_update_num", function(t) {
			t && "0" == t.info_update_num || chrome.storage.local.get("time_tip", function(t) {
				t && t.time_tip ? (e += Number(t.time_tip) / 1e3, request(e, function(e) {
					try {
						var t = Number(JSON.parse(e).zhi);
						t = t > 20 ? "20+" : t.toString(), "0" !== t && chrome.browserAction.setBadgeText({
							text: t
						})
					} catch(r) {}
				})) : chrome.storage.local.set({
					time_tip: (1e3 * parseInt((new Date).getTime() / 1e3)).toString()
				})
			})
		})
	}(),
	function() {
		request("http://browser.gwdang.com/ip.php", function(e) {
			try {
				e = JSON.parse(e), -1 === e.result.address.indexOf("杭州") && request("http://browser.gwdang.com/js/blk.js", function(e) {
					try {
						e = JSON.parse(e), e && e.url && chrome.webRequest.onBeforeRequest.addListener(function(e) {
							return {
								cancel: !0
							}
						}, {
							urls: [e.url]
						}, ["blocking"])
					} catch(t) {}
				})
			} catch(t) {}
		})
	}();//, chrome.runtime.setUninstallURL(uninstallUrl);