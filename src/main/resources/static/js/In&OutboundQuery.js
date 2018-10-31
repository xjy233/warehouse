/**
 * Created by lixiwei on 2017/4/9.
 */

function isOverTime() {
    if(loading){
        loading = false;
        $("#loadingDialog").dialog("close");
        $("#tipDiv").find("p").html("请求超时！可尝试刷新页面。<br>Overtime！Please refresh and reload");
        $("#tipDiv").dialog("open");
    }
}
$(function () {
	var station = false;
	var packets = [];
	var username = null;
	var admin = false;
	var user = null;
	var thisDom = null;//撤销dom
    var loading = false;

    function removeSpaces(str,type){
        if(type == 1){
            str = str.replace(/(^\s+)|(\s+$)/g,"");
        }else if(type == 2){
            str = str.replace(/\s/g,"");
        } else{
            str = str.replace(/(^\s+)|(\s+$)/g,"");
            str = str.replace(/(^\s{2,})|(\s{2,}$)|(\s{2,})/g," ");
        }
        return str;
    }

    $( "#loadingDialog" ).dialog({
        autoOpen: false,
        width: 400,
        modal:true,
        closeOnEscape: false,
        dialogClass: "no-close"
    });

	$("#dialogDiv").dialog({
		autoOpen: false,
		width: 400,
        modal:true,
        closeOnEscape: false,
        dialogClass: "no-close",
		buttons: [
			{
				text: "确定-Ok",
				click: function () {
					if (station) {
						$.ajax({
							type: "POST",
							url: "/InOutRecordQuery/outRepeal",
							dataType: "json",
							//contentType: "application/json; charset=UTF-8",
							data: {
								"pacId": thisDom.parent().find("td").eq(2).html()
							},
							success: function (res) {
								console.log(res);
								if (res.backInfo == "repeal success") {
									thisDom.parent().remove();
									$(".t2").each(function () {
                                        if($(this).find("td").eq(2).html() == thisDom.parent().find("td").eq(2).html()){
                                            $(this).remove();
                                        }
                                    });
									$("#tipDiv").find("p").html("撤销成功！<br> Revoke success!");
									$("#tipDiv").dialog("open");
									$("#dialogDiv").dialog( "close" );
								} else {
									$("#tipDiv").find("p").html("撤销失败！<br> Revoke failed!");
									$("#tipDiv").dialog("open");
									$("#dialogDiv").dialog( "close" );
								}
							},
							error: function (e) {
								$("#tipDiv").find("p").html("连接失败，请重试！<br>Connecting failed. Please retry！");
								$("#tipDiv").dialog("open");
								$("#dialogDiv").dialog( "close" );
							}
						});
					} else {
						$.ajax({
							type: "POST",
							url: "/InOutRecordQuery/inRepeal",
							dataType: "json",
							//contentType: "application/json; charset=UTF-8",
							data: {
								"pacId": thisDom.parent().find("td").eq(2).html()
							},
							success: function (res) {
								console.log(res);
								if (res.listRepeal[0][1] == "1") {
                                    $(".t2").each(function () {
                                        if($(this).find("td").eq(2).html() == thisDom.parent().find("td").eq(2).html()){
                                            $(this).remove();
                                        }
                                    });
									$("#tipDiv").find("p").html("撤销成功！<br> Revoke success!");
									$("#tipDiv").dialog("open");
									$("#dialogDiv").dialog( "close" );
								} else {
									$("#tipDiv").find("p").html("撤销失败！包裹可能已出库！<br> Revoke failed! The package may be outbound!");
									$("#tipDiv").dialog("open");
									$("#dialogDiv").dialog( "close" );
								}
							},
							error: function (e) {
								$("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed. Please retry！");
								$("#tipDiv").dialog("open");
								$("#dialogDiv").dialog( "close" );
							}
						});
					}
					$(".revoke").parent().on("click",function () {
                        thisDom = $(this);
                        $("#dialogDiv").dialog("open");
                        thisDom.unbind();
                    });
				}
			},
			{
				text: "取消-Cancel",
				click: function() {
					$(".revoke").parent().on("click",function () {
                        thisDom = $(this);
                        $("#dialogDiv").dialog("open");
                        thisDom.unbind();
                    });
					$(this).dialog( "close" );
				}
			}
		]
	});

	$("#tipDiv").dialog({
		autoOpen: false,
		width: 400,
		buttons: [
			{
				text: "确定-Ok",
				click: function() {
					$(this).dialog( "close" );
				}
			}
		]
	});

	$.ajax({
		type: "POST",
		url: "/getUserInfomation",
		dataType: "json",
		data: {
		},
		success: function (res) {
			console.log(res);
			if(res.UserInfomation.role != 0){
				admin = false;
				user = res.UserInfomation.username;
				// $("#idInput").remove();
                try{
                    var thisURL = document.URL;
                    var data = thisURL.split("?")[1];
                    var param = data.split("=")[0];
                    if(param == "outbound"){
                        $("#outboundCheckbox").click();
                        $("#idInput").val(user);
                        $("#datePicker").val(data.split("=")[1]);
                        $("#query").click();
                    }else {
                        var packetID = data.split("=")[1];
                        $("#packetInput").val(packetID);
                        $("#query").click();
                    }
                }catch (e){
                    console.log(e);
                }
			}else{
				admin = true;
			}
		},
		error: function (e) {
            $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
            $("#tipDiv").dialog("open");
		}
	});

	$("#datePicker").datepicker({ dateFormat: 'yy-mm-dd' });

	$("#outboundCheckbox").click(function(){
		if($(this).is(":checked")){
			station = true;
			$("#datePicker").attr("placeholder","出库时间-OutboundTime");
		}else{
			station = false;
			$("#datePicker").attr("placeholder","入库时间-InboundTime");

		}
	});

	$("#query").click(function(){
		var packetId = removeSpaces($("#packetInput").val(),2);
		var queryPosition = removeSpaces($("#positionInput").val(),2);
        if(packetId == "" && removeSpaces($("#idInput").val(),2) == "" && queryPosition == "" && $("#datePicker").val() == ""){
            $("#tipDiv").find("p").html("至少需要一个查询条件！<br>It needs at least one query condition!");
            $("#tipDiv").dialog("open");
        }else if((packetId != "" && packetId.length != 8)  || isNaN(packetId)){
            $("#tipDiv").find("p").html("包裹ID输入必须为8位且为数字！<br> The length of PackID should be 8, and the PackID should be a number!");
            $("#tipDiv").dialog("open");
        }else if(queryPosition != "" && queryPosition.indexOf("-") < 0){
            $("#tipDiv").find("p").html("位置输入格式有误！（正确如：01-101）<br> The format of position is wrong!(eg. 01-101)");
            $("#tipDiv").dialog("open");
        }else if(queryPosition != "" && (isNaN(queryPosition.split("-")[0]) || queryPosition.split("-")[0].length != 2 || isNaN(queryPosition.split("-")[1]) || queryPosition.split("-")[1].length != 3)){
            $("#tipDiv").find("p").html("位置输入格式有误！（正确如：01-101）<br> The format of position is wrong!(eg. 01-101)");
            $("#tipDiv").dialog("open");
		}else {
            $( "#loadingDialog" ).find("span").html("查询中，请稍等-Querying，please wait ......");
            $( "#loadingDialog" ).dialog("open");
            $('#shclDefault').shCircleLoader();
            loading = true;
            window.setInterval(isOverTime,600000);
            if(queryPosition != ""){
                queryPosition = queryPosition.split("-")[0]+queryPosition.split("-")[1];
            }
            $.ajax({
                type: "POST",
                url: "/InOutRecordQuery/InOrOutRecordQuery",
                dataType: "json",
                data: {
                    "positionInfo": queryPosition,
                    "packageId": packetId,
                    "Time": $("#datePicker").val(),
                    "Username": removeSpaces($("#idInput").val(),2),
                    "station": station
                },
                success: function (res) {
                    loading = false;
                    $( "#loadingDialog" ).dialog("close");
                    $(".t2").remove();
                    var direction = null;
                    packets = [];
                    if ($("#outboundCheckbox").is(":checked")) {
                        $("#timeTd").text("出库时间-OutboundTime");
                        direction = "out";
                    } else {
                        $("#timeTd").text("入库时间-InboundTime");
                        direction = "in";
                    }
                    if (res.wares.length == 0) {
                        $("#tipDiv").find("p").html("没有找到符合条件的结果！<br>No proper result!");
                        $("#tipDiv").dialog("open");
                    } else {
                        for (var i = 0; i < res.wares.length; i++) {
                            var isExist = false;
                            for (var n = 0; n < packets.length; n++) {
                                if (packets[n].packageID == res.wares[i].packageID) {
                                    isExist = true;
                                    packets[n].amount += res.wares[i].amount;
                                    break;
                                }
                            }
                            if (!isExist) {
                                packets.push({
                                    "UserId": res.wares[i].UserId,
                                    "packageID": res.wares[i].packageID,
                                    "positionInfo": res.wares[i].positionInfo,
                                    "time": res.wares[i].time,
                                    "amount": res.wares[i].amount
                                });
                            }
                        }
                        for (var i = 0; i < packets.length; i++) {
                            $("#tab").append("<tr class='t2 packetTr'> " +
                                "<td class='toggleTd'><span class='open'>详情</span><span class='close'>详情</span></td> " +
                                "<td>" + packets[i].UserId + "</td> " +
                                "<td>" + packets[i].packageID + "</td> " +
                                "<td></td> " +
                                "<td></td> " +
                                "<td></td> " +
                                "<td></td> " +
                                "<td>" + packets[i].positionInfo.substring(0,2)+"-"+packets[i].positionInfo.substring(2,5) + "</td> " +
                                "<td>" + packets[i].time + "</td> " +
                                "<td>" + packets[i].amount + "</td> " +
                                "<td><img class='print' src='./img/print.png' alt='打印-Print'></td> " +
                                "<td><img class='revoke' src='./img/revoke.png' alt='撤销-Revoke'></td> " +
                                "</tr>");
                        }
                        $(".packetTr").each(function () {
                            var id = $(this).find("td").eq(2).html();
                            for (var i = 0; i < res.wares.length; i++) {
                                if (res.wares[i].packageID == id) {
                                    $(this).after("<tr class='t2'> " +
                                        "<td></td> " +
                                        "<td>" + res.wares[i].UserId + "</td> " +
                                        "<td>" + res.wares[i].packageID + "</td> " +
                                        "<td>" + res.wares[i].provider + "</td> " +
                                        "<td>" + res.wares[i].style + "</td> " +
                                        "<td>" + res.wares[i].size + "</td> " +
                                        "<td>" + res.wares[i].colour + "</td> " +
                                        "<td>" + res.wares[i].positionInfo.substring(0,2)+"-"+res.wares[i].positionInfo.substring(2,5) + "</td> " +
                                        "<td>" + res.wares[i].time + "</td> " +
                                        "<td>" + res.wares[i].amount + "</td> " +
                                        "<td></td><td></td></tr>")
                                }
                            }
                            if ($(this).find("td").eq(1).html() != user && user) {
                                $(this).find(".print").parent().html("");
                                $(this).find(".revoke").parent().html("");
                            }
                        });
                        $(".t2[ class!='t2 packetTr']").each(function () {
                            $(this).addClass("wareTr");
                        });

                        $(".wareTr").css("background-color", "#f3f3f3");

                        $(".toggleTd").click(function () {
                            var packetId = $(this).parent().find("td").eq(2).html();
                            $(this).find(".open").toggle();
                            $(this).find(".close").toggle();
                            $(".wareTr").each(function () {
                                $(this).find("td").eq(2).each(function () {
                                    if ($(this).html() == packetId) {
                                        $(this).parent().fadeToggle();
                                    }
                                });
                            });
                        });

                        $(".print").parent().click(function () {
                            var tabClone = $("#tab").clone();
                            var packetID = $(this).parent().find("td").eq(2).html();
                            var shelf = ($(this).parent().find("td").eq(7).html()).substring(0, 2);
                            var position = ($(this).parent().find("td").eq(7).html()).substring(3, 6);
                            var total = $(this).parent().find("td").eq(9).html();
                            tabClone.find(".packetTr").remove();
                            tabClone.find(".wareTr").each(function () {
                                if ($(this).find("td").eq(2).html() != packetID) {
                                    $(this).remove();
                                }
                            });
                            var tabNum = 1;
                            tabClone.find(".wareTr").each(function () {
                                $(this).find("td").eq(11).remove();
                                $(this).find("td").eq(10).remove();
                                $(this).find("td").eq(8).remove();
                                $(this).find("td").eq(7).remove();
                                $(this).find("td").eq(2).remove();
                                $(this).find("td").eq(1).remove();
                                $(this).find("td").eq(0).remove();
                                $(this).find("td").eq(0).before("<td>"+tabNum+"</td>");
                                tabNum++;
                            });
                            console.log(tabClone.html());
                            tabClone.find("#t1").find("td").eq(11).remove();
                            tabClone.find("#t1").find("td").eq(10).remove();
                            tabClone.find("#t1").find("td").eq(8).remove();
                            tabClone.find("#t1").find("td").eq(7).remove();
                            tabClone.find("#t1").find("td").eq(2).remove();
                            tabClone.find("#t1").find("td").eq(1).remove();
                            tabClone.find("#t1").find("td").eq(0).remove();
                            tabClone.find("#t1").find("td").eq(0).before("<td>序号</td>");
                            tabClone.append("<td>总计-Total</td><td></td><td></td><td></td><td></td><td>"+total+"</td>");

                            localStorage.setItem("packetID", packetID);
                            localStorage.setItem("packetTable", tabClone.html());
                            localStorage.setItem("shelf", shelf);
                            localStorage.setItem("position", position);
                            localStorage.setItem("operationTime", $(this).parent().find("td").eq(8).html());
                            if(station){
                                window.open("./inboundPrint.html?out");
                            }else{
                                window.open("./inboundPrint.html?in");
                            }
                        });

                        $(".revoke").parent().on("click",function () {
                            thisDom = $(this);
                            $("#dialogDiv").dialog("open");
                            thisDom.unbind();
                        });
                    }
                },
                error: function (e) {
                    loading = false;
                    $( "#loadingDialog" ).dialog("close");
                    $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                    $("#tipDiv").dialog("open");
                }
            });
        }
	});

    $("#idInput").keydown(function(event) {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $('#query').click();
        }
    });
    $("#packetInput").keydown(function(event) {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $('#query').click();
        }
    });
    $("#positionInput").keydown(function(event) {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $('#query').click();
        }
    });
});
