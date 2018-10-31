/**
 * Created by lixiwei on 2017/4/2.
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
	var shelf = [];
	var shelfNum = null;
    var loading = false;
    var shelfCol = null;


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
				click: function() {
					var exTdLength = $("#cloInput").val();
					//var exSpaceCapacity = $("#spaceInput").val();
					if(exTdLength != 0 && !isNaN(exTdLength)){
						if((Number(exTdLength) + Number(shelfCol)) > 99 ){
                            if($(this).find("p").length > 0 ){
                                $(this).find("p").html("货架最大列数为99！-The max col. of shelf is 99!")
                            }else{
                                $(this).append("<p class='inputSpan' style='color: red'>货架最大列数为99！-The max col. of shelf is 99!</p>")
                            }
						}else {
                            $(this).find("p").remove();
                            $("#loadingDialog").find("span").html("货架扩容中，请稍等-Shelf is expanding，please wait ......<br>注意：规模较大的货架可能需要较长时间，请耐心等候！<br>Warn: the shelf may too large to expand in short time, please wait patiently!");
                            $("#loadingDialog").dialog("open");
                            $('#shclDefault').shCircleLoader();
                            loading = true;
                            window.setInterval(isOverTime, 600000);
                            $.ajax({
                                type: "POST",
                                url: "/Manage/addShelfCol",
                                dataType: "json",
                                data: {
                                    "shelfNum": $("#shelfSelect").val(),
                                    "shelfCol": exTdLength
                                },
                                success: function (res) {
                                    loading = false;
                                    $("#loadingDialog").dialog("close");
                                    console.log(res);
                                    if (res.backInfo == "add success") {
                                        $("#tipDiv").find("p").html("扩容成功！<br> Expanision success!");
                                        $("#tipDiv").dialog("open");
                                        $("#shelfSelect").change();
                                        $("#dialogDiv").find("input").val("");
                                        $("#dialogDiv").dialog("close");
                                    }
                                },
                                error: function (e) {
                                    loading = false;
                                    $("#loadingDialog").dialog("close");
                                    $("#tipDiv").find("p").html("连接失败，请重试！<br>Connecting failed. Please retry！");
                                    $("#tipDiv").dialog("open");
                                    console.log("backShelfError:" + e);
                                }
                            });
                        }
					}else if(isNaN(exTdLength)){
						if($(this).find("p").length > 0 ){
							$(this).find("p").html("请输入数字！-Please input number!")
						}else{
							$(this).append("<p class='inputSpan' style='color: red'>请输入数字！-Please input number!</p>")
						}
					}else{
						if($(this).find("p").length > 0 ){
							$(this).find("p").html("输入不能为空！-Input cannot be null!")
						}else{
							$(this).append("<p class='inputSpan' style='color: red'>输入不能为空！-Input cannot be null!</p>")
						}
					}
				}
			},
			{
				text: "取消-Cancel",
				click: function() {
					$(this).find("input").val("");
					$(this).find("p").remove();
					$(this).dialog( "close" );
				}
			}
		]
	});

	$("#packetDiv").dialog({
		autoOpen: false,
		width: 400,
		buttons: [
			{
				text: "关闭-Close",
				click: function() {
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

	$("#ex-shelfButton").click(function () {
		$("#dialogDiv").dialog("open");
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
			console.log("backShelfError:"+e);
		}
	});

	$("#shelfSelect").change(function(){
			//	选择货架后，向后端提交货架号，获取货架详细信息。
		var trLength = 0;
		var tdLength = 0;

        $( "#loadingDialog" ).find("span").html("货架获取中，请稍等-Shelf is loading，please wait ......<br>注意：规模较大的货架可能需要较长时间，请耐心等候！<br>Warn: the shelf may too large to show in short time, please wait patiently!");
        $( "#loadingDialog" ).dialog("open");
        $('#shclDefault').shCircleLoader();
        loading = true;
        window.setInterval(isOverTime,600000);

		$.ajax({
			type: "POST",
			url: "/backPositionUsed",
			dataType: "json",
			data: {
				"shelfNum": $("#shelfSelect").val()
			},
			success: function (res) {
				loading = false;
                $( "#loadingDialog" ).dialog("close");
				console.log(res.listPos);
				trLength = res.listPos[0];
				tdLength = res.listPos[1];
				shelfCol = res.listPos[1];
				//exSpaceCapacity = res.listPos[2][2];
				console.log("trLength:"+trLength+";tdLength:"+tdLength);
				$(".shelfTable").empty();
				for(var i = 0;i < trLength;i++) {
					$(".shelfTable").prepend($("<tr></tr>").html(function () {
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
					$(".shelfTable").find("td").each(function(){
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

				$(".shelfTable").find("td").on("click",function () {
					var thisTd = $(this);
					$.ajax({
						type: "POST",
						url: "/backPac",
						dataType: "json",
						data: {
							"position": $("#shelfSelect").val() + thisTd.find(".usedSpan").text()
						},
						success: function (res) {
							var tdLength = 5;
							var trLength = parseInt(res.listAllPac.length / tdLength) + 1;

							$(".packetTable").empty();

							var num = 0;
							for(var i = 0;i < trLength;i++){
								$(".packetTable").append($("<tr></tr>").html(function(){
									for(var n = 0;n < tdLength;n++){
										if(res.listAllPac[num] && num <= res.listAllPac.length) {
											$(this).append("<td>包裹ID<br/><span style='color: blue'>" + res.listAllPac[num] + "</span></td>");
											num++;
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
							console.log("customError:"+e);
						}
					});
				});
			},
			error: function(e) {
                loading = false;
                $( "#loadingDialog" ).dialog("close");
				console.log("customError:"+e);
			}
		});
	});

});
