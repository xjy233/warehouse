/**
 * Created by lixiwei on 2017/4/4.
 */
function usageWarn(){
	$.ajax({
		type: "POST",
		//url: "./testPhp/inbound/readjson-warnLight.php",
		url: "/home/backDefaultTimeSection",
		cache: false,
		dataType: "json",
		data: {
		},
		success: function (res) {
			var usedData = null;
			if(res.myVolume == 0){
				usedData = 0;
			}else {
				usedData = res.myOccupation / res.myVolume * 100;
				usedData = parseFloat(usedData.toFixed(2));
			}
			if(usedData > 79){
				$("#usageWarnDiv").css("background-color","#f46e65")
			}else if(usedData > 30){
				$("#usageWarnDiv").css("background-color","#ffce3d")
			}else{
				$("#usageWarnDiv").css("background-color","#3dbd7d")
			}
			$("#usageSpan").text(usedData + "%");
			console.log("usage: "+usedData+" %");
		},
		error: function(e){
            $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
            $("#tipDiv").dialog("open");
		}
	})
}

$(function () {
	var shelf = [];
	var shelfNum = null;//存储货架数量
	var customShelf = "";//自定义入库信息
	var customPosition = "";
	var autoShelf = "";//智能推荐入库信息
	var autoPosition = "";
	var method = "";//入库方式
	var delIndex = "";//删除的包裹的index
	var totalBoolean = false;//包裹总数是否一致
	// var weightBoolean = false;//包裹重量是否正常
	var finalShelf = "";//最终入库信息
	var finalPosition = "";
	var finalPacketID = "6666";
	var total = 0;//用于计算包裹内货物数量
	var totalWeight = 0;//用于计算包裹内货物总重量
	var supplier = null;//存储当前供应商选择
	var str = null;//存储入库时间
	var pacList = [[0,1,2]];//用于存放包裹内货物信息
	var inboundState = false;//入库是否成功
	var username = null;//入库用户
    var loading = false;//超时判断
    var removeChecked = false;//是否需要重置入库方式选择

    function isOverTime() {
        if(loading){
            loading = false;
            $("#loadingDialog").dialog("close");
            $("#tipDiv").find("p").html("请求超时！可尝试刷新页面。<br>Overtime！Please refresh and reload");
            $("#tipDiv").dialog("open");
        }
    }

	$("#autoPlacedRadio").checkboxradio();
	$("#customPlacedRadio").checkboxradio();
	$("#totalTd").tooltip();
	$("#printQueryButton").click(function(){
		location.href="./in&OutboundQuery.html";
	});

	usageWarn();
	window.setInterval(usageWarn,6000000);

	/*for(var i = 0;i <shelfNum;i++){
		$("#shelfSelect").append($("<option value='"+"0"+i+"'>"+"0"+i+"</option>").text("货架"+"0"+i));
	}*/
	
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

	$.ajax({
		type: "POST",
		url: "/getUserInfomation",
		dataType: "json",
		data: {
		},
		success: function (res) {
			console.log(res);
			username = res.UserInfomation.username;
		},
		error: function (e) {
            $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
            $("#tipDiv").dialog("open");
		}
	});

    $( "#loadingDialog" ).dialog({
        autoOpen: false,
        width: 400,
        modal:true,
        closeOnEscape: false,
        dialogClass: "no-close"
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

	$("#packetDiv").dialog({
		autoOpen: false,
		width: 400,
		modal: true,
		buttons: [
			{
				text: "关闭-Close",
				click: function() {
					$(this).dialog( "close" );
				}
			}
		]
	});

	$("#dialogDiv").dialog({
		autoOpen: false,
		width: 400,
		modal: true,
		dialogClass: "no-close",
		closeOnEscape: false,
		buttons: [
			{
				text: "确定-Ok",
				click: function() {
					if(removeChecked){
						$("input[name='placedMethod']:radio").prop("checked",false);
						$("label").removeClass("ui-checkboxradio-checked");
						$("label").removeClass("ui-state-active");
						removeChecked = false;
					}
					if ($(this).find("#confirmP").css("display") == "block") {
						if(method == "智能推荐-Automatic Recommend"){
							finalShelf = autoShelf;
							finalPosition = autoPosition;
						}else if(method == "自定义存放-Custom Placed"){
							finalShelf = customShelf;
							finalPosition = customPosition;
						}
						pacList[0][0] = removeSpaces($("#totalInput").val(),2);
                        pacList[0][1] = removeSpaces($("#weightTdInput").val(),2);
						pacList[0][2] = finalShelf + finalPosition;
						pacList[0][3] = username;
						for(var i = 0;i < $(".goodsTr").length;i++){
							var a = [];
							a[0] = $(".goodsTr").eq(i).find("td").eq(1).text();
							a[1] = $(".goodsTr").eq(i).find("td").eq(2).text();
							a[2] = $(".goodsTr").eq(i).find("td").eq(3).text();
                            a[3] = $(".goodsTr").eq(i).find("td").eq(4).text();
							a[4] = $(".goodsTr").eq(i).find("td").eq(5).text();
                            a[5] = $(".goodsTr").eq(i).find("td").eq(6).text();
                            a[6] = $(".goodsTr").eq(i).find("td").eq(7).text();
                            a[7] = $(".goodsTr").eq(i).find("td").eq(8).find("input").val();
							a[8] = $(".goodsTr").eq(i).find("td").eq(9).find("input").val();
							pacList.push(a);
						}
						console.log(pacList);
						var JSONpacList = JSON.stringify(pacList);
						$.ajax({
							type: "POST",
							url: "/InHouse/savePackage",
							dataType: "json",
							data: {
								"pacList": JSONpacList
							},
							success: function (res) {
								finalPacketID = res.pacID;
								$("#resultDialog").find("span").html("success");
								$("#resultDialog").find("p").html("入库成功！该包裹ID为"+ finalPacketID + "，存放于货架" + finalShelf + " 的位置" + finalPosition + " !<br/>" +
										"Inbound Success! The packetID is "+ finalPacketID + ", and it's placed to shelf " + finalShelf + ",position " + finalPosition + " !");
								inboundState = true;
								function p(s) {
									return s < 10 ? '0' + s: s;
								}
								var myDate = new Date();
								str = "" + myDate.getFullYear() + "-";
								str += (myDate.getMonth()+1) + "-";
								str += myDate.getDate() + " ";
								str += (p(myDate.getHours())+ ":");
								str += p(myDate.getMinutes());
								$("#resultDialog").dialog( "open" );
								$("#dialogDiv").dialog("close");
							},
							error: function(e) {
								$("#dialogDiv").dialog("close");
								$("#resultDialog").find("span").html("error");
								$("#resultDialog").find("p").html("入库失败！error：" + e);
								$(":button:contains('打印-Print')").text("确定Ok");
								$('#resultDialog').dialog("open");
							}
						});
					}else{
						if(removeChecked){
							$("input[name='placedMethod']:radio").prop("checked",false);
							$("label").removeClass("ui-checkboxradio-checked");
							$("label").removeClass("ui-state-active");
							removeChecked = false;
						}
						$(this).dialog("close");
					}
				}
			},
			{
				text: "取消-Cancel",
				click: function() {
					if(removeChecked){
						$("input[name='placedMethod']:radio").prop("checked",false);
						$("label").removeClass("ui-checkboxradio-checked");
						$("label").removeClass("ui-state-active");
						removeChecked = false;
					}
					$(this).dialog( "close" );
				}
			}
		]
	});

	$("#delAllGoodsDiv").dialog({
		autoOpen: false,
		width: 400,
		modal: true,
		buttons: [
			{
				text: "确定-Ok",
				click: function() {
                    $("#totalTdInput").css("color","#f04134");
                    $("input[name='placedMethod']:radio").prop("checked",false);
                    $("label").removeClass("ui-checkboxradio-checked");
                    $("label").removeClass("ui-state-active");
					$(".goodsTr").remove();
					$("#totalTdInput").val(0);
                    $("#weightTdInput").val(0);
					totalBoolean = false;
					$(this).dialog( "close" );
				}
			},
			{
				text: "取消-Cancel",
				click: function() {
					$(this).dialog( "close" );
				}
			}
		]
	});

	$("#delGoodsDiv").dialog({
		autoOpen: false,
		width: 400,
		modal: true,
		buttons: [
			{
				text: "确定-Ok",
				click: function() {
					total = 0;
                    totalWeight = 0;
                    $("#totalTdInput").css("color","#f04134");
                    $("input[name='placedMethod']:radio").prop("checked",false);
                    $("label").removeClass("ui-checkboxradio-checked");
                    $("label").removeClass("ui-state-active");
					$("#detailsTable").find("tr").eq(delIndex).remove();
					$(".goodsTr").each(function(){
						total += parseInt($(this).find("input").eq(0).val());
                        totalWeight += parseFloat($(this).find("input").eq(1).val());
					});
					$("#totalTdInput").val(total);
                    $("#weightTdInput").val(totalWeight);
					if($("#totalInput").val() != $("#totalTdInput").val()){
						$("#totalTdInput").css("color","#f04134");
						totalBoolean = false;
					}else{
						$("#totalTdInput").css("color","black");
						totalBoolean = true;
					}
                    $("#detailsTable tr:odd").css("background-color", "white");
                    $("#detailsTable tr:even").css("background-color", "#f3f3f3");
                    $("#headTr").css("background-color","#ecf6fd");
                    $("#totalTr").css("background-color","white");

					$(this).dialog( "close" );
				}
			},
			{
				text: "取消-Cancel",
				click: function() {
					$(this).dialog( "close" );
				}
			}
		]
	});


	$("#totalInput").blur(function () {
		if($(this).val() == "" || $(this).val() <= 0 || isNaN($(this).val())){
			$(this).val(100);
		}
	});

    $("#numInput").blur(function () {
        if($(this).val() < 0 || isNaN($(this).val())){
            $(this).val(0);
        }
    });

    $("#weightInput").blur(function () {
        if($(this).val() < 0 || isNaN($(this).val())){
            $(this).val(0);
        }
    });

	$("#totalInput").on('input propertychange', function(){
		if($("#totalInput").val() != $("#totalTdInput").val()){
			$("#totalTdInput").css("color","#f04134");
			$("input[name='placedMethod']:radio").prop("checked",false);
			$("label").removeClass("ui-checkboxradio-checked");
			$("label").removeClass("ui-state-active");
			totalBoolean = false;
		}else{
			$("#totalTdInput").css("color","black");
			totalBoolean = true;
		}
	});
	
	$("#totalTdInput").on('input propertychange', function(){
		if($("#totalInput").val() != $("#totalTdInput").val()){
			$("#totalTdInput").css("color","#f04134");
			$("input[name='placedMethod']:radio").prop("checked",false);
			$("label").removeClass("ui-checkboxradio-checked");
			$("label").removeClass("ui-state-active");
			totalBoolean = false;
		}else{
			$("#totalTdInput").css("color","black");
			totalBoolean = true;
		}
	});

	$("#addButton").click(function(){
		var no = 1 + Number($(".goodsTr").last().find("td").eq(0).text());
		var modelNo = $("#modelNoSelect").val();
		var num = removeSpaces($("#numInput").val(),2);
        var weight = removeSpaces($("#weightInput").val(),2);
		total = 0;
		totalWeight = 0;
		$("input[name='placedMethod']:radio").prop("checked",false);
		$("label").removeClass("ui-checkboxradio-checked");
		$("label").removeClass("ui-state-active");
		if(modelNo == null){
			$(".dialogP").css("display","none");
			$("#selectP").css("display","block");
			$("#dialogDiv").dialog("open");
		}else if(num == 0 || isNaN(num) || weight == 0 || isNaN(weight)){
			$(".dialogP").css("display","none");
			$("#notNullP").css("display","block");
			$("#dialogDiv").dialog("open");
		}else {
            //预留功能，判断重量是否正常
            $.ajax({
                type: "POST",
                url: "/backModuleInfo",
                dataType: "json",
                data: {
                	"moduleNum": $("#modelNoSelect").val()
                },
                success: function (res) {
                	var moduleNum = res.moduleInfo[0];
                	var department = res.moduleInfo[1];
                    var brand = res.moduleInfo[2];
                    var fitting = res.moduleInfo[3];
                    var provider = res.moduleInfo[4];
                    var colour = res.moduleInfo[5];
                    var size = res.moduleInfo[6];
                    var isExist = false;
                    $(".goodsTr").each(function(){
                        if($(this).find("td").eq(1).html() == modelNo){
                            var addNum = Number(num) + Number($(this).find("input").eq(0).val());
                            var addWeight = Number(weight) + Number($(this).find("input").eq(1).val());
                            $(this).find("input").eq(0).val(addNum);
                            $(this).find("input").eq(1).val(addWeight);
                            isExist = true;
                        }
                    });
                    if(!isExist){
                        $("#totalTr").before("<tr class='goodsTr'><td>" + no + "</td><td>" + moduleNum + "</td><td>" + department + "</td><td>" + brand + "</td><td>" + fitting + "</td><td>" + provider + "</td><td>" + colour + "</td><td>" + size + "</td><td><input class='tdInput' type='text' value='" + num + "' readonly></td><td><input class='tdInput' type='text' value='" + weight + "' readonly></td><td><span class='delSpan'><img src='./img/delete.png'></span></td></tr>");
                    }
                    $(".goodsTr").each(function(){
                        total += parseInt($(this).find("input").eq(0).val());
                        totalWeight += parseFloat($(this).find("input").eq(1).val());
                    });
                    $("#totalTdInput").val(total);
                    $("#weightTdInput").val(totalWeight);
                    if($("#totalInput").val() != $("#totalTdInput").val()){
                        $("#totalTdInput").css("color","#f04134");
                        totalBoolean = false;
                    }else{
                        $("#totalTdInput").css("color","black");
                        totalBoolean = true;
                    }
                },
                error: function(e) {
                    $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                    $("#tipDiv").dialog("open");
                }
            });
		}

        $("#detailsTable tr:odd").css("background-color", "white");
        $("#detailsTable tr:even").css("background-color", "#f3f3f3");
        $("#headTr").css("background-color","#ecf6fd");
        $("#totalTr").css("background-color","white");
	});

    $("#numInput").keydown(function(event) {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $('#addButton').click();
        }
    });

	$("#delAllSpan").click(function() {
		$("#delAllGoodsDiv").dialog("open");
	});

	$("#detailsTable").on('click','.delSpan',function(){
		delIndex = $(this).parent().parent().index();
		$("#delGoodsDiv").dialog("open");
	});

	$("#saveButton").click(function () {
		if(totalBoolean == false || $("#totalInput").val() == 0) {
			$(".dialogP").css("display","none");
			$("#totalP").css("display","block");
			$("#dialogDiv").dialog("open");
		}else if($("input[name='placedMethod']:radio").is(":checked") == ""){
			$(".dialogP").css("display","none");
			$("#warnP").css("display","block");
			$("#dialogDiv").dialog("open");
		} else if($("#autoPlacedRadio").is(":checked")){
			if(autoShelf == "" || autoPosition == ""){
				$(".dialogP").css("display","none");
				$("#warnP").css("display","block");
				$("#dialogDiv").dialog("open");
			}else {
				$(".dialogP").css("display", "none");
				$("#confirmP").css("display", "block");
				$("#selectedShelfSpan").text(autoShelf);
				$("#positionSpan").text(autoPosition);
				$("#dialogDiv").dialog("open");
			}
		}else if($("#customPlacedRadio").is(":checked")){
			if(customShelf == "" || customPosition == ""){
				$(".dialogP").css("display","none");
				$("#warnP").css("display","block");
				$("#dialogDiv").dialog("open");
			}else {
				$(".dialogP").css("display", "none");
				$("#confirmP").css("display", "block");
				$("#selectedShelfSpan").text(customShelf);
				$("#positionSpan").text(customPosition);
				$("#dialogDiv").dialog("open");
			}
		}
	});

	$("#startAutoButton").click(function(){
		var trLength = 0;
		var tdLength = 0;
		// var spaces = null;
		// var result = null;
		var numberArray = [];
		var maxNum = null;
		var no = null;
		var state = false;
		var maxQuery = {};

		if(!($("input[name='placedMethod']:radio").eq(0).is(":checked"))){
			$(".dialogP").css("display","none");
			$("#radioP").css("display","block");
			$("#dialogDiv").dialog("open");
		}else {
			$(".tdInput[id != totalTdInput]").each(function () {
				numberArray.push($(this).val());
			});
			maxNum = Math.max.apply(null, numberArray);
			no = 0;
			$(".tdInput[id != totalTdInput]").each(function () {
				no++;
				if ($(this).val() == maxNum) {
					if (!state) {
						/*maxQuery = {
							"provider": $(".goodsTr").eq(no - 1).find("td").eq(1).text(),
							"style": $(".goodsTr").eq(no - 1).find("td").eq(2).text(),
							"colour": $(".goodsTr").eq(no - 1).find("td").eq(3).text(),
							"size": $(".goodsTr").eq(no - 1).find("td").eq(4).text()
						};*/
						maxQuery = $(".goodsTr").eq(no - 1).find("td").eq(1).text();
						state = true;
					}
				}
			});
			console.log(maxQuery);
			$.ajax({
				type: "POST",
				url: "/InHouse/smartStroe",
				dataType: "json",
				contentType: "application/json; charset=UTF-8",
				data: JSON.stringify({
					"moduleNum": maxQuery
				}),
				success: function (res) {
					var response = res;
					console.log("smart" + res);
					if(response.positionInfo == "null"){
						$(".dialogP").css("display","none");
						$("#smartP").css("display","block");
						$("#dialogDiv").dialog("open");
					}else{
						$("#autoResultSpan").html(response.positionInfo);
						var position = response.positionInfo;
						autoShelf = position.substring(0, 2);
						autoPosition = position.substring(2, 5);
						console.log("autoShelf" + autoShelf + ";autoPosition:" + autoPosition);
						$("#autoResultSpan").html(" " + autoShelf + "-" + autoPosition);
						$("#startAutoButton").text("重新推荐-Restart");

                        $( "#loadingDialog" ).find("span").html("货架生成中，请稍等-Shelf is creating，please wait ......<br>注意：规模较大的货架可能需要较长时间，请耐心等候！<br>Warn: the shelf may too large to create in short time, please wait patiently!");
                        $( "#loadingDialog" ).dialog("open");
                        $('#shclDefault').shCircleLoader();
                        loading = true;
                        window.setInterval(isOverTime,600000);
						$.ajax({
						type: "POST",
						url: "/backPositionUsed",
						dataType: "json",
						data: {
							"shelfNum": autoShelf
						},
						success: function (res) {
							var trLength = 0;
							var tdLength = 0;
							console.log(res);
							console.log("autoShelf:res.length" + res.listPos.length);
							trLength = res.listPos[0];
							tdLength = res.listPos[1];
							console.log("trLength:" + trLength + ";tdLength:" + tdLength);
							$("#autoShelfDiv").css("min-height", "20rem");
							$("#autoPlacedTable").empty();
							for (var i = 0; i < trLength; i++) {
								$("#autoPlacedTable").prepend($("<tr></tr>").html(function () {
									for (var n = 0; n < tdLength; n++) {
										$(this).append("<td> <div class='useDiv'><span class='fractionSpan'></span><span class='restSpan'style=''></span> <span class='usedSpan'style=''></span> </div> </td>");
										$(this).find("td").each(function () {
											var row = i + 1;
											var clo = $(this).index() + 1;
											var position = 0;
											if (clo < 10) {
												position = row + "0" + clo;
											} else {
												position = row + "" + clo;
											}
											$(this).find(".usedSpan").text(position);
											$(this).find(".usedSpan").css({"display": "flex", "align-items": "flex-end", "color": "blue"});
										});
									}
								}));
							}
							for (var i = 0; i < res.listPos.length; i++) {
								$("#autoPlacedTable").find("td").each(function () {
									if ($(this).find(".usedSpan").text() == res.listPos[i][0]) {
										var rest = res.listPos[i][2] - res.listPos[i][1];
										var rand = rest / res.listPos[i][2] * 100;
										if(rest < 0){
											rand = 0;
										}
										$(this).html("<div class='useDiv'><span class='fractionSpan'>" + rest + "<br/>|<br/>" + res.listPos[i][1] + "</span><span class='restSpan'style='height: " + rand + "%'></span> <span class='usedSpan'style='height: " + (100 - rand) + "%'>" + res.listPos[i][0] + "</span> </div> ")
										$(this).find(".usedSpan").css({"display": "flex", "align-items": "flex-end", "color": "blue"});
										if (rest > parseInt(res.listPos[i][2] * 0.8)) {
											$(this).find(".usedSpan").css("background-color", "#3dbd7d");
										} else if (rest > parseInt(res.listPos[i][2] * 0.25)) {
											$(this).find(".usedSpan").css("background-color", "#ffce3d");
										} else {
											$(this).find(".usedSpan").css("background-color", "#f46e65");
										}
									}
								});
							}
							$("#autoPlacedTable").find("td").each(function () {
								if ($(this).find(".usedSpan").text() == autoPosition) {
									$(this).css({"border": "solid red", "box-shadow": "0 0 0.5rem 0 red inset"});
								}
							});

                            loading = false;
                            $( "#loadingDialog" ).dialog("close");

							$("#autoPlacedTable").find("td").on("click", function () {
								var thisTd = $(this);
								$.ajax({
									type: "POST",
									url: "/backPac",
									dataType: "json",
									data: {
										"position": autoShelf + thisTd.find(".usedSpan").text()
									},
									success: function (res) {
										var tdLength = 5;
										var trLength = parseInt(res.listAllPac.length / tdLength) + 1;

										$(".packetTable").empty();

										var num = 0;
										for (var i = 0; i < trLength; i++) {
											$(".packetTable").append($("<tr></tr>").each(function () {
												for (var n = 0; n < tdLength; n++) {
                                                    if(res.listAllPac[num]) {
                                                        $(this).append("<td>包裹ID<br/><span style='color: blue'>" + res.listAllPac[num] + "</span></td>");
                                                        num++;
                                                    }
                                                    if (num == res.listAllPac.length) {
                                                        break;
                                                    }
												}
											}));
										}
										$(".packetTable").find("td").each(function () {
											if ($(this).html() == '包裹ID<br><span style="color: blue">undefined</span>') {
												$(this).remove();
											}
										});
										$("#packetDiv").dialog("open");
									},
									error: function (e) {
                                        $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                                        $("#tipDiv").dialog("open");
									}
								});
							});
						},
						error: function (e) {
                            $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                            $("#tipDiv").dialog("open");
						}
					});
					}
					console.log(response);
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

	$("#shelfSelect").change(function(){
		//	选择货架后，向后端提交货架号，获取货架详细信息。
		var trLength = 0;
		var tdLength = 0;
	  	var spaces = null;

		customShelf = $("#shelfSelect").val();

        $( "#loadingDialog" ).find("span").html("货架生成中，请稍等-Shelf is creating，please wait ......<br>注意：规模较大的货架可能需要较长时间，请耐心等候！<br>Warn: the shelf may too large to create in short time, please wait patiently!");
        $( "#loadingDialog" ).dialog("open");
        $('#shclDefault').shCircleLoader();
        loading = true;
        window.setInterval(isOverTime,600000);
		$.ajax({
			type: "POST",
			url: "/backPositionUsed",
			dataType: "json",
			data: {
				"shelfNum": customShelf
			},
			success: function (res) {
				var trLength = 0;
				var tdLength = 0;
				console.log(res.listPos);
				console.log("customShelf:res-"+res.listPos+";length-" + res.listPos.length);
				trLength = res.listPos[0];
				tdLength = res.listPos[1];
				console.log("trLength:"+trLength+";tdLength:"+tdLength);
				$("#customShelfDiv").css("min-height","20rem");
				$("#customPlacedTable").empty();
				for(var i = 0;i < trLength;i++) {
					$("#customPlacedTable").prepend($("<tr></tr>").html(function () {
						for (var n = 0; n < tdLength; n++) {
							$(this).append("<td> <div class='useDiv'><span class='fractionSpan'></span><span class='restSpan'style=''></span> <span class='usedSpan'style=''></span> </div> </td>");
							$(this).find("td").each(function () {
								var row = i+1;
								var clo = $(this).index() + 1;
								var position = 0;
								if (clo < 10) {
									position = row + "0" + clo;
								} else {
									position = row + "" + clo;
								}
								$(this).find(".usedSpan").text(position);
								$(this).find(".usedSpan").css({"display": "flex", "align-items": "flex-end", "color": "blue"});
							});
						}
					}));
				}
				for(var i = 0;i < res.listPos.length;i++){
					$("#customPlacedTable").find("td").each(function(){
						if($(this).find(".usedSpan").text() == res.listPos[i][0]){
							var rest = res.listPos[i][2]-res.listPos[i][1];
							var rand = rest/res.listPos[i][2] * 100;
                            if(rest < 0){
                                rand = 0;
                            }
							$(this).html("<div class='useDiv'><span class='fractionSpan'>"+rest+"<br/>|<br/>"+res.listPos[i][1]+"</span><span class='restSpan'style='height: "+rand+"%'></span> <span class='usedSpan'style='height: "+(100-rand)+"%'>"+res.listPos[i][0]+"</span> </div> ")
							$(this).find(".usedSpan").css({"display":"flex","align-items":"flex-end","color":"blue"});
							if(rest > parseInt(res.listPos[i][2] * 0.8)) {
								$(this).find(".usedSpan").css("background-color","#3dbd7d");
							}else if(rest > parseInt(res.listPos[i][2] * 0.25)){
								$(this).find(".usedSpan").css("background-color","#ffce3d");
							}else{
								$(this).find(".usedSpan").css("background-color","#f46e65");
							}
						}
					});
				}
				$("#customPlacedTable").find("td").click(function(){
					$("#customPlacedTable").find("td").css({"border":"thin solid #49a9ee","box-shadow": "0 0 0.2rem 0 #49a9ee inset"});
					$(this).css({"border":"solid red","box-shadow": "0 0 0.5rem 0 red inset"});
					/*var row = 0;
					var clo = $(this).index() + 1;
					if($(this).parent().index() == 0){
						row =  3;
					}
					if($(this).parent().index() == 1){
						row =  2;
					}
					if($(this).parent().index() == 2){
						row =  1;
					}
					$("#positionInput").val("");
					if(clo < 10) {
						$("#positionInput").val(row + "0" + clo);
						customPosition = $("#positionInput").val();
					}else{*/
						$("#positionInput").val($(this).find(".usedSpan").text());
						customPosition = $("#positionInput").val();
					//}
				});

                loading = false;
                $( "#loadingDialog" ).dialog("close");

				$("#customPlacedTable").find("td").on("click",function () {
					var thisTd = $(this);
					$.ajax({
						type: "POST",
						url: "/backPac",
						dataType: "json",
						data: {
							"position": customShelf + thisTd.find(".usedSpan").text()
						},
						success: function (res) {
							var tdLength = 5;
							var trLength = parseInt(res.listAllPac.length / tdLength) + 1;

							$(".packetTable").empty();

							var num = 0;
                            for (var i = 0; i < trLength; i++) {
                                $(".packetTable").append($("<tr></tr>").each(function () {
                                    for (var n = 0; n < tdLength; n++) {
                                        if(res.listAllPac[num]) {
                                            $(this).append("<td>包裹ID<br/><span style='color: blue'>" + res.listAllPac[num] + "</span></td>");
                                            num++;
                                        }
                                        if (num == res.listAllPac.length) {
                                            break;
                                        }
                                    }
                                }));
                            }
							$(".packetTable").find("td").each(function(){
								if($(this).html() == '包裹ID<br><span style="color: blue">undefined</span>'){
									$(this).remove();
								}
							});
							$("#packetDiv").dialog("open");
						},
						error: function(e) {
                            $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                            $("#tipDiv").dialog("open");
						}
					});
				});
			},
			error: function(e) {
                loading = false;
                $( "#loadingDialog" ).dialog("close");
                $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                $("#tipDiv").dialog("open");
			}
		});

	});

	$("#positionInput").on('input propertychange', function(){
		var value = $("#positionInput").val();
		if(!($("input[name='placedMethod']:radio").eq(1).is(":checked"))){
            $("#tipDiv").find("p").html('需先选定"自定义存放"入库方式！<br>Custom Placed should be chosen before input position!！');
            $("#tipDiv").dialog("open");
            $("#positionInput").val("");
		}else if($("#shelfSelect").val() != "" && value > 100){
            $("#customPlacedTable").find("td").each(function () {
                if($(this).find(".usedSpan").text() == value){
                    $(this).css({"border":"solid red","box-shadow": "0 0 0.5rem 0 red inset"});
                    // $(this).click();
                    customPosition = $("#positionInput").val();
				}else{
                    $(this).css({"border":"thin solid #49a9ee","box-shadow": "0 0 0.2rem 0 #49a9ee inset"});
				}
            });
		}else{
			customPosition = 0;
		}
		if(value <= 100){
			$("#positionInput").css("border","thin solid red");
			customPosition = 0;
		}else{
			$("#positionInput").css("border","thin solid grey");
		}
	});

	$("input[name='placedMethod']:radio").click(function(){
		if($(this).is(":checked")) {
			$("#methodSpan").text($(this).attr("value"));
			method = $(this).attr("value");
			if($("#totalInput").val() == 0){
				$(".dialogP").css("display","none");
				$("#notNullP").css("display","block");
				removeChecked = true;
				$("#dialogDiv").dialog("open");
			}else if(totalBoolean == false){
				$(".dialogP").css("display","none");
				$("#totalP").css("display","block");
				removeChecked = true;
				$("#dialogDiv").dialog("open");
			}else if(method == "智能推荐-Automatic Recommend"){
				$("#autoResultDiv").css("display","block");
                $("#customResultDiv").css("display","none");
            }else if(method == "自定义存放-Custom Placed"){
                $("#autoResultDiv").css("display","none");
                $("#customResultDiv").css("display","block");
            }
		}
	});

	$("#resultDialog").dialog({
		autoOpen: false,
		width: 400,
        modal:true,
        closeOnEscape: false,
        dialogClass: "no-close",
		buttons: [
			{
				text: "打印-Print",
				click: function() {
					if(inboundState) {
						$("#printDialog").find("p").html("该包裹ID为" + finalPacketID + "，存放于货架" + finalShelf + " 的位置" + finalPosition + " !<br/>" +
								"The packetID is " + finalPacketID + ", and it's placed to shelf " + finalShelf + ",position " + finalPosition + " !");
						//另开打印窗口
						localStorage.setItem("packetID", finalPacketID);
						localStorage.setItem("packetTable", $("#detailsTable").html());
						localStorage.setItem("shelf", finalShelf);
						localStorage.setItem("position", finalPosition);
						localStorage.setItem("operationTime", str);
						window.open("./inboundPrint.html");
						$("#printDialog").dialog("open");
						$(this).dialog("close");
					}else{
						$(this).dialog("close");
						$(":button:contains('确定Ok')").text("打印-Print");
					}
				}
			}
		]
	});

	$("#printDialog").dialog({
		autoOpen: false,
		width: 400,
		modal: true,
        closeOnEscape: false,
        dialogClass: "no-close",
		buttons: [
			{
				text: "成功-Success!",
				click: function() {
					window.location.reload(true);
				}
			},
			{
				text: "失败！重新打印-Failure！Query and reprint",
				click: function() {
					//跳转查询
					location.href="./in&OutboundQuery.html?packetID="+finalPacketID;
				}
			}
		]
	});

    $.ajax({
        type: "POST",
        url: "/backModuleNum",
        dataType: "json",
        data: {
        },
        success: function (res) {
            console.log(res);
            for(var i = 0;i < res.moduleNum.length;i++) {
                $("#modelNoSelect").append("<option>"+res.moduleNum[i]+"</option>")
            }
        },
        error: function(e) {
            $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
            $("#tipDiv").dialog("open");
        }
    });

	$.ajax({
		type: "POST",
		url: "/backShelf",
		dataType: "json",
		data: {
		},
		success: function (res) {
			shelfNum = res.allShelfNum.length;
			$("#shelfSelect").empty();
			$("#shelfSelect").append("<option selected disabled></option>");
			for(var i = 0;i < shelfNum;i++){
				$("#shelfSelect").append($("<option value='"+res.allShelfNum[i]+"'>"+res.allShelfNum[i]+"</option>").text(res.allShelfNum[i]));
			}
			console.log(res);
		},
		error: function(e) {
            $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
            $("#tipDiv").dialog("open");
		}
	});

});