/* @Date: Mon Jun 19 2017 17:12:46 GMT+0800 (中国标准时间)

 */
function loadScript(e) {
	var t, o = this;
	t = new XMLHttpRequest, t.open("GET", chrome.extension.getURL(e), !0), t.onreadystatechange = function(e) {
		4 === t.readyState && 200 === t.status && eval.call(o, t.responseText)
	}, t.send(null)
}

function sendMsg(e, t) {
	chrome.runtime.sendMessage(e, function(e) {
		t(e)
	})
}

function insertDom(e, t) {
	var o = document.createElement("a");
	o.id = "gwd_myDiv", t && (o.id = t), o.style.display = "none", o.innerText = e, head = document.getElementsByTagName("body")[0], head.appendChild(o)
}

function zrequest(e) {
	var t = document.location.host,
		o = document.location.href,
		n = o.match(/(?:dp|product)\/([0-9a-zA-Z]+)/),
		a = getSrc(),
		i = "4ada9238-f88b-4b3c-87b4-a66ec58586ef";
	("www.amazon.co.jp" == location.host || "www.amazon.de" == location.host) && (i = "24aaee4d-6c09-45a9-ac30-f985dc7f376c");
	var r = "http://js.client.walatao.com/v9/svr/report_price_goods.php?pid=" + i + "&vi=2.2.0.33&bw=guge&tpbg_uid=0&fh=" + t.replace(".", "_"),
		s = {
			stock: "",
			info: {
				price: 0,
				url: o,
				uniq: {
					id: n && n[1],
					name: encodeURIComponent(e.name || ""),
					param: "[]"
				},
				prodpics: [a],
				weight: "",
				symbol: "$",
				nowprice: e.price || 0
			},
			ac_price: e.price || 0
		},
		c = {
			"amazon.com": "$",
			"amazon.de": "EUR",
			"amazon.co.jp": "￥",
			"6pm": "$"
		};
	if(t.indexOf("amazon") > -1)
		for(var m in c) t.indexOf(m) > -1 && (s.symbol = c[m]);
	var d = {
		type: "amazonTrend",
		info: s,
		url: r
	};
	sendMsg(d, insertDom)
}

function downloadImg(e) {
	var t = {
		src: e,
		type: "taobaoImg"
	};
	sendMsg(t, function(e) {
		if(!e || "" != e) {
			insertDom(e, "mofing_img_info");
			var t = document.createEvent("CustomEvent");
			t.initCustomEvent("mofing_content", !0, !0, {
				type: "getTaobaoImgInfo",
				value: "1"
			}), document.dispatchEvent(t)
		}
	})
}

function getSrc() {
	var e = {
		1688: "#mod-detail-bd .content .box-img img",
		vip: "#J-mer-ImgReview .zoomPad>img",
		mogujie: "#J_BigImg",
		meilishuo: "#picture .item-pic-origin>img",
		amazon: "#imgTagWrapperId img",
		jd: "#spec-n1 img",
		jumei: "#etalage li>img",
		"6pm": "#detailImage img",
		taobao: "#J_ImgBooth",
		tmall: "#J_ImgBooth",
		banggo: ".mainPicContent",
		vancl: "#midimg",
		vjia: "#FreshDiv_MainPhoto .sp-bigImg img",
		yougou: "#pD-bimg",
		yintai: "#J_Magnifier img",
		okbuy: "#zoom1 img",
		lovo: "#jqzoom .zoomPad img",
		handu: "#masterImage",
		moonbasa: "#largeimg",
		tonlion: ".good_left .jqzoom",
		xiu: "#imgPic",
		lamiu: "#op_product_zoom img",
		masamaso: ".goods_tp_box .zoomPad img",
		".s.cn": ".goods-detail-pic a img",
		paixie: "#zoom1 img",
		mbaobao: "#goods-zoom img",
		m18: "#GoodsImage",
		gap: "#wrap.all-images-box a img",
		esprit: "#mainImages .m-pic img"
	};
	for(var t in e)
		if(location.host.indexOf(t) > -1) {
			var o = document.querySelectorAll(e[t])[0] && document.querySelectorAll(e[t])[0].getAttribute("src");
			return o && -1 == o.indexOf("base64") ? o : null
		}
}

function runTaobaoImg(e) {
	var t;
	t = e ? e : getSrc(), t && downloadImg(t)
}
function runTaobaoDetail(e,uinfo) {
	var t = {
		src: e,uinfo:uinfo,
		type: "taobaoDetail"
	};
	sendMsg(t, function(e) {
		if(!e || "" != e) {
			console.log(e);
			e = JSON.parse(e);
			document.getElementById("bckp_"+e.id).className='finish';
			//insertDom(e, "mofing_img_info");
		}
	})
}


function runTaobaoUniq(e, t) {
	var o = "https://s.taobao.com/search?type=samestyle&app=i2i&rec_type=1&uniqpid=" + t + "&nid=" + e,
		n = {
			type: "taobaoUniq",
			url: o
		};
	sendMsg(n, function(e) {
		if(!e || "" != e) {
			var t = e.match(/\<script\>\s+g_page_config\s=\s(.*)/);
			t && (t = t[1].match(/(\{.*\});/)), t && (t = t[1]), insertDom(t, "gwd_uniq_info");
			var o = document.createEvent("CustomEvent");
			o.initCustomEvent("mofing_content", !0, !0, {
				type: "getTaobaouniq",
				value: "1"
			}), document.dispatchEvent(o)
		}
	})
}

function dispatch(e, t) {
	var o = document.createEvent("CustomEvent");
	o.initCustomEvent("mofing_content", !0, !0, {
		type: e,
		value: t
	}), document.dispatchEvent(o)
}

function setStoreRate(e) {
	chrome.storage.local.set({
		currency: e
	})
}

function getStoreRate() {
	chrome.storage.local.get("currency", function(e) {
		e && dispatch("getStoreRate", e)
	})
}

function getCookie() {
	for(var e = {}, t = document.cookie.split(";"), o = 0; o < t.length; o++) t[o].indexOf("plt_user_email") > -1 && (e.email = decodeURIComponent(t[o].split("=")[1])), t[o].indexOf("plt_user_nickname") > -1 && (e.name = document.querySelector("#login_status span a.orange") && document.querySelector("#login_status span a.orange").innerText), t[o].indexOf("plt_user_id") > -1 && (e.id = decodeURIComponent(t[o].split("=")[1]));
	e.email && e.name && chrome.storage.local.set({
		user_info: JSON.stringify(e)
	})
}

function getInfoNum() {
	var e = {};
	chrome.storage.local.get("browser_setinfo", function(t) {
		if(t && t.browser_setinfo)
			for(var o in t.browser_setinfo) e[o] = t.browser_setinfo[o], Array.prototype.filter.call(document.getElementsByName(o), function(e) {
				return e.value === t.browser_setinfo[o]
			})[0].checked = !0;
		else e = {
			setStyle: "top",
			setTip: "1",
			setWishlist: "1",
			setShowPromo: "1",
			setInfoNum: "1",
			sethaitao: "1"
		}
	}), "browser.gwdang.com" == location.host && location.href.indexOf("browser.gwdang.com/brwext/setting") > -1 && document.addEventListener("click", function(t) {
		t && t.target.name && (e[t.target.name] = t.target.value), chrome.storage.local.set({
			browser_setinfo: e
		})
	})
}

function renderDom() {
	if(!location.href.match(/\.pdf/)) {
		var e = document.createElement("script");
		e.charset = "utf-8", e.src = chrome.extension.getURL("js/btype.js"), document.head && document.head.appendChild(e)
	}
}

function runTbtm(e) {
	e && chrome.storage.local.set({
		pageInfo: e
	})
}

function createUserId() {
	var e = (new Date).getTime(),
		t = "",
		o = "chrome",
		n = "abcdefghij";
	navigator.userAgent.toLowerCase().indexOf("qqbrowser") > -1 && (o = "qq");
	for(var a = 0; 3 > a; a++) t += n[parseInt(10 * Math.random())];
	var i = o + t + e;
	return chrome.storage.local.set({
		user_extension_id: i
	}), i
}
var dpIds = [];
var compare = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
            return 1;
        } else if (val1 > val2) {
            return -1;
        } else {
            return 0;
        }            
    } 
}
document.addEventListener("mofing_content", function(e) {
	if($("#mofing_tb_compare").length<1){
		$("#category_panel").after($("<div id='mofing_tb_compare'></div>"));
	}
	var moinfo= $("#mofing_img_info").html();
	if(moinfo!=""){
		moinfo=JSON.parse(moinfo);
		var min=0;
		var max=0;
		var auctions=moinfo.mods.itemlist.data.collections[0]["auctions"];
		for(var i=0;i<auctions.length;i++){
			 var price= parseInt(auctions[i]["view_price"]);
			 auctions[i]["view_count"]=parseInt(auctions[i]["view_sales"]);
			 if(min==0 || min >  price){
			 	min=price;
			 }
			 if(max <  price){
			 	max=price;
			 }
		}
		var auctions1=auctions.sort(compare("view_count"));
		//按销量排序  view_sales : "148人付款"
		var html="<div id='mofing_content'><div class='cpo_title'>淘宝比价&nbsp;售价：￥"+min+" ~ ￥"+max+"<a class='btn_close' href='javascript:void(0)'>关闭</a></div><div class='cpo_content'><ul class='mo_tb_collections' style='width:"+(auctions1.length*200)+"px'>"
		$.each(auctions1, function(ind,ele) {
			html+="<li><a href='"+ele.detail_url+"' target='_blank'><img src='"+ele.pic_url+"_220x220.jpg'/><div>价格：￥"+ele.view_price+"</div><div>销量："+ele.view_sales+"</div><div>"+ele.title+"</div></a></li>"
		});
		html+="</ul></div></div>";
		$("#mofing_tb_compare").html(html).show();
		$("#mofing_tb_compare .btn_close").click(function(){
			$("#mofing_tb_compare").hide();
		});
	}
});
document.addEventListener("mofing_extension", function(e) {
	switch(e.detail.type) {
		case "tbtmmark":
			runTbtm(e.detail.info);
			break;
		case "getTaobaoImgInfo":
			runTaobaoImg(e.detail.src);
			break;
		case "getTaobaoDetailInfo":
			runTaobaoDetail(e.detail.src,e.detail.uinfo);
			break;
		case "getAmazonPriceTrend":
			var t = e.detail.info;
			try {
				t = "" != t ? JSON.parse(t) : {}
			} catch(e) {
				t = {}
			}
			zrequest(t);
			break;
		case "getTaobaouniq":
			var t = e.detail.info;
			try {
				"" != t && (t = JSON.parse(t), runTaobaoUniq(t.nid, t.uniqid))
			} catch(e) {}
			break;
		case "setStoreRate":
			setStoreRate(e.detail.info);
			break;
		case "getStoreRate":
			getStoreRate();
			break;
		case "user_extension_id":
			chrome.storage.local.get("user_extension_id", function(e) {
				var t;
				t = e && e.user_extension_id && (e.user_extension_id.indexOf("chrome") > -1 || e.user_extension_id.indexOf("qq") > -1) ? e.user_extension_id : createUserId(), dispatch("user_extension_id", t)
			});
			break;
		case "browser_setinfo":
			chrome.storage.local.get("browser_setinfo", function(e) {
				e && e.browser_setinfo && dispatch("browser_setinfo", e.browser_setinfo)
			});
			break;
		case "aliexpress":
			sendMsg(e.detail, function(e) {
				dispatch("aliexpress", e)
			});
			break;
		case "getTaobaoTrend":
			sendMsg(e.detail, function(e) {
				chrome.storage.local.set({
					priceTrend: e
				}), dispatch("getTaobaoTrend", e)
			})
	}
}), setTimeout(function() {
	getCookie(), getInfoNum()
}, 100), renderDom(), loadScript("js/alibaba.js");