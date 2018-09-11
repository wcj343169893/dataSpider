var base="https://market.mofing.com";
function showLog(str) {
	//$("#video_result").prepend($("<div>").html(escapeHTML(str)));
}
function categoryPage(){
	var ids=[];
	//商家分类页面，页面有滚动加载
	$(".offer-list-row li").each(function() {
		//var prop = JSON.parse($(this).attr("data-prop"));
		//var id=prop["offer_id"];
		var id=$(this).data("offerid");
		var title=$(this).find(".image a").attr("title");
		ids.push(id);
		$(this).find(".image").append("<input id='bck_"+id+"' type='checkbox' class='item_check' value='"+id+"' title='"+title+"'/>")
		var img_src= "https:"+$(this).find(".image img").attr("src");
		//加个比较按钮
		$(this).find(".image").append($("<span class='liebiao_bijia' href=\"javascript:void(0)\">比价</span>").click(function(){
			if(document.createEvent) {
				$("#mofing_img_info").remove();
				var e = document.createEvent("CustomEvent");
				e.initCustomEvent("mofing_extension", !0, !0, {type:"getTaobaoImgInfo",src:img_src}), document.dispatchEvent(e)
			}
		}))
	});
	checkIsAdd(ids);
}
function searchPage(){
	var ids=[];
	//搜索页面
	$(".sm-offer-list li:not(.loaded),.sm-offer li:not(.loaded)").each(function() {
		var id=$(this).attr("t-offer-id");
		var title=$(this).find(".sm-offer-photo a").attr("title");
		ids.push(id);
		$(this).find(".sm-offer-photo").append("<input id='bck_"+id+"' type='checkbox' class='item_check' value='"+id+"' title='"+title+"'/>")
		$(this).addClass("loaded");
		var img_src= $(this).find("a.sm-offer-photoLink img").attr("src");
		//加个比较按钮
		$(this).find(".sm-offer-photo").append($("<span class='liebiao_bijia' href=\"javascript:void(0)\">比价</span>").click(function(){
			if(document.createEvent) {
				$("#mofing_img_info").remove();
				var e = document.createEvent("CustomEvent");
				e.initCustomEvent("mofing_extension", !0, !0, {type:"getTaobaoImgInfo",src:img_src}), document.dispatchEvent(e)
			}
		}))
	});
	checkIsAdd(ids);
	setTimeout(function(){
		searchPage();
	},1000);
}
function detailPage(){
	var url=window.location.href;
	var id=url.substring(url.indexOf("offer")+6,url.indexOf("html")-1);
	var title=$("h1.d-title").html();
	$("#mod-detail-bd").append('<input id="bck_'+id
	+'" type="checkbox" checked class="item_check" value="'+id+'" title="'+title+'"/>');
	checkIsAdd(id);
	/*var src= $("#mod-detail-bd .widget-custom-container .box-img img").attr("src");
	console.log(src);
	downloadImg(src);*/
	if(document.createEvent) {
	var e = document.createEvent("CustomEvent");
	e.initCustomEvent("mofing_extension", !0, !0, {type:"getTaobaoImgInfo"}), document.dispatchEvent(e)
	}
	//mofing_img_info
}
var onlyData=false;
function checkFinish(){
	var l1 = $("#data_content li").length;
	var l2 = $("#data_content li.finish").length;
	if(l1>27){
		if(l1 > l2){
			setTimeout(function(){
				checkFinish();
			},2700);
		}else{
			window.location.reload();
		}
	}
}
//判断页面
function checkPage(){
	var url=window.location.href;
	if(url.indexOf("ditu.html")>0){
		//特定界面，用于处理老数据
		$("#content").empty();
		$("#alibar").remove();
		$("#func_panel").hide();
		$.get(base+"/mallapi/wdIndex/collectiongoodsbypage.json",{p:1,size:28},function(data){
			//console.log(data)
			var html="<ul id='data_content'>";
			$.each(data, function(ind,ele) {
				html+="<li id='bckp_"+ele.s_id +"'>";
				html+='<input checked="checked" id="bck_'+ele.s_id +'" type="checkbox" class="item_check" value="'+ele.s_id +'" title="'+ele.s_title +'"><div><a href="//detail.1688.com/offer/'+ele.s_id +'.html" target="_blank">'+ele.s_id +"</a></div><div>"+ele.s_title+"</div>";
				html+="</li>";
			});
			html+="</ul><div class='clear'></div>";
			$("#content").append(html);
			onlyData=true;
			//开启自动检测，如果全部执行完成，则刷新页面
			setTimeout(function(){
				$("#btn_get_source").click();
				checkFinish();
			},1000);
		})
		//
	}else if(url.indexOf("offerlist.htm")>0){
		//分类列表
		categoryPage()
	}else if(url.indexOf("offerlist_")>0){
		//某个小分类
		categoryPage()
	}else if(url.indexOf("offer_search.htm")>0){
		//搜索页面
		searchPage();
	}else if(url.indexOf("selloffer")>0){
		//搜索页面
		searchPage();
	}else if(url.indexOf("detail.1688.com")>0){
		//详细页
		detailPage();
	}
	
	
}
function initCategory(pid,level){
	if(level==0){
		$("#category_panel").empty().html("分类：");	
	}else{
		$("#category_panel .cp_levl_"+level).remove();	
	}
	$.get(base+"/mallapi/wdIndex/categorys.json",{type:0,pid:pid},function(data){
		//console.log(data)
		if(data.status==200){
			var first_id=0;
			var html="<span class='cplevel cp_levl_"+level+"'><select data-level='"+(level+1)+"'>";
			$.each(data.data, function(ind,ele) {
				if(first_id<1){
					first_id=ele.id;
				}
				html+="<option value='"+ele.id+"'>"+ele.cat_name+"</option>";
			});
			html+="</select></span>";
			if(level==0){
				$("#category_panel").append(html);
			}else{
				$("#category_panel .cp_levl_"+(level-1)).append(html);
			}
			cat_id=first_id;
			//自动加载下一级
			initCategory(first_id,level+1);
		}
	});
}
//检查是否已经加入了朋友圈
function checkIsAdd(ids){
	if(ids.length>0){
		$.post(base+"/mallapi/wdIndex/checkgoods.json",{ids:ids,topcid:497},function(data){
			if(data.status==200){
				$.each(data.ids, function(ind,ele) {
					$("#bck_"+ele).attr("disabled","disabled");
				});
			}
		});
	}
}
var url=base+"/image/qrcode?data=";
var code="coid";
function genQr(){
	//生成随机数
	$.get(base+"/users/getptqrlogin.json",function(data){
		if(data.status==200){
			code=data.code;
			$("#qr_img").attr("src",url+data.url);
			checkLogin();
		}
	})
	$("#mofing_login").show();
}
function checkLogin(){
	$.get(base+"/users/ptqrlogin/"+code+".json",function(data){
		if(data.status==2){
			$("#result").html("<span class='guoqi'>已过期，请重新获取</span>");
		}else if(data.status==3){
			$("#result").html("<div class='confim'>已扫描，请确认登录</div>");
			setTimeout(function(){checkLogin();},1300);
		}else if(data.status==4){
			if(data.uid > 0){
				muserinfo={uid:data.uid,token:data.token};
				//storage.set("mofing_user",muserinfo);
				$.cookie('mofing_user',JSON.stringify(muserinfo),{path: "/",domain:".1688.com",expires:365});
				$("#result").html("<div class='confim'>登录成功</div>");
				window.location.reload();
			}else{
				//取消
				$("#result").html("<span class='guoqi'>已取消</span>");
			}
		}else if(data.status==5){
			setTimeout(function(){checkLogin();},1300);
		}
	})
}

var storage=$.localStorage;
var muserinfo ;
$(function() {
	//增加样式表
	//var style = "<style type=\"text/css\"></style>";
	//$("head").append(style);
	$("body").append("<div id='func_panel'><div id='userinfo_panel'></div><div id='button_panel'><input type='button' value='全部选择' id='btn_check_all'/><input type='button' value='加入选货篮' id='btn_get_all'/><input type='button' value='获取源码&加入选货篮' id='btn_get_source'/></div>"+
	"<div id='service_no_panel'></div><div id='category_panel'></div></div>");
	//判断是否登录
	var login_html='<div class="mofing_login" id="mofing_login"><table cellpadding="0" cellspacing="0"><caption>请扫码登录</caption><tr><td colspan="2" class="center"><img src="'+base+'/img/loading3.gif" id="qr_img" style="max-width: 100%;"/><div id="result"></div></td></tr></table></div>';
	$("body").append(login_html);
	//muserinfo = storage.get("mofing_user");
	//if(muserinfo==undefined || muserinfo["uid"]<1){
		var c_mofing = $.cookie('mofing_user');
		//console.log(c_mofing)
		if(c_mofing==undefined){
			muserinfo={uid:0,token:""};
			//storage.set("mofing_user",muserinfo);
		}else{
			muserinfo=JSON.parse(c_mofing);
			//storage.set("mofing_user",muserinfo);
		}
	//}
	//var login_url = chrome.extension.getURL("login.html");
	//console.log(login_url)
	if(muserinfo["uid"]<1){
		$("#userinfo_panel").html("<div class='avatar' style='line-height: 40px;'>请登录</div>")
	}else{
		$("#userinfo_panel").html("<div class='avatar'><img src='"+base+"/users/avatar/"+muserinfo["uid"]+"/small' /></div>");
		//获取子集的服务号列表 service_no_panel
		$.get(base+"/cloud/video/myvideos.json?uid="+muserinfo["uid"]+"&token="+muserinfo["token"],function(data){
			if(data.status==200){
				var opt="店铺：<select>";
				$.each(data.data, function(ind,ele) {
					opt+="<option value='"+ele.id+"'>"+ele.title+"</option>";
				});
				opt+="</select>";
				$("#service_no_panel").html(opt);
			}else if(data.status==-1){
				//登录过期
				muserinfo={uid:0,token:""};
				storage.set("mofing_user",muserinfo);
				$("#userinfo_panel").html("<div class='avatar' style='line-height: 40px;'>请登录</div>")
			}
		})
	}
	$("#userinfo_panel").click(function(){
		genQr();
	});
	//全选
	$("#btn_check_all").unbind("click").click(function() {
		if($(this).data("checkall") == "ok"){
			$(".item_check:not(:disabled)").prop("checked", false)
			$(this).data("checkall","")
			$(this).val("全部选择")
		}else{
			$(".item_check:not(:disabled)").prop("checked", true)
			$(this).data("checkall","ok")
			$(this).val("取消全选")
		}
	});
	//获取源码并提交
	$("#btn_get_source").unbind("click").click(function() {
		var ids=[],titles=[],srcs=[];
		$(".item_check:checked:not(:disabled)").each(function(){
			ids.push($(this).val());
			titles.push($(this).attr("title"));
			$(this).attr("disabled","disabled");
		});
		var store = $("#service_no_panel select").val();
		if(ids.length>0 && store>0){
			muserinfo["base"]=base;
			if(onlyData){
				//循环获取源码
				if(document.createEvent) {
					for(var i=0;i<ids.length;i++){
					var e = document.createEvent("CustomEvent");
					e.initCustomEvent("mofing_extension", !0, !0, {type:"getTaobaoDetailInfo",src:ids[i],uinfo:muserinfo}), document.dispatchEvent(e)
					}
				}
			}else{
				$.ajax({
					type: "post",
					url: base+"/mallapi/wdIndex/reportgoods.json?uid="+muserinfo["uid"]+"&token="+muserinfo["token"],
					data: {
						ids:ids,
						cid:cat_id,
						topcid:497,
						sfrom:1,
						store:store,
						titles:titles
					},
					dataType:"json",
					//xhrFields:{withCredentials:true},
					success: function(data) {
						//console.log(data)
						if(data.status==200){
							alert("加入成功");
							//循环获取源码
							if(document.createEvent) {
								for(var i=0;i<ids.length;i++){
								var e = document.createEvent("CustomEvent");
								e.initCustomEvent("mofing_extension", !0, !0, {type:"getTaobaoDetailInfo",src:ids[i],uinfo:muserinfo}), document.dispatchEvent(e)
								}
							}
						}else{
							alert("加入失败");
						}
					}
				});
			}
			
		}
	});
	//提交选择的商品
	$("#btn_get_all").unbind("click").click(function() {
		var ids=[],titles=[];
		$(".item_check:checked:not(:disabled)").each(function(){
			ids.push($(this).val());
			titles.push($(this).attr("title"));
			$(this).attr("disabled","disabled");
		});
		var store = $("#service_no_panel select").val();
		if(ids.length>0 && store>0){
			$.ajax({
				type: "post",
				url: base+"/mallapi/wdIndex/reportgoods.json?uid="+muserinfo["uid"]+"&token="+muserinfo["token"],
				data: {
					ids:ids,
					cid:cat_id,
					topcid:497,
					sfrom:1,
					store:store,
					titles:titles
				},
				dataType:"json",
				//xhrFields:{withCredentials:true},
				success: function(data) {
					//console.log(data)
					if(data.status==200){
						alert("加入成功");
					}else{
						alert("加入失败");
					}
				}
			});
		}else{
			//没选择
			alert("请选择商品")
		}
	});
	checkPage();
	initCategory(497,0);
	$("#category_panel").on("change","select",function(){
		var pid=$(this).val();
		var level=$(this).data("level");
		if(level==3){
			//没有下级了，直接最后选择数据
			cat_id=pid;
			//console.log(cat_id);
		}else{
			initCategory(pid,level);
		}
	})
})
var cat_id=0;

function escapeHTML(str) {
	return str.replace(/[&"'<>]/g, (m) => ({
		"&": "&amp;",
		'"': "&quot;",
		"'": "&#39;",
		"<": "&lt;",
		">": "&gt;"
	})[m]);
}