/**
 * Created by lixiwei on 2017/4/5.
 */
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
	$("#backButton").click(function(){
		location.href = "./checkShelf.html";
	});

    $( "#loadingDialog" ).dialog({
        autoOpen: false,
        width: 400,
        modal:true,
        closeOnEscape: false,
        dialogClass: "no-close"
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

	var trLength = 0;
	var tdLength = 0;
	var thisURL = document.URL;
	var param =thisURL.split("?")[1];
	var shelfNum= param.split("=")[1];
    var loading = false;

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
			"shelfNum": shelfNum
		},
		success: function (res) {
            loading = false;
            $( "#loadingDialog" ).dialog("close");
			console.log(res.listPos);
			trLength = res.listPos[0];
			tdLength = res.listPos[1];
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
						"position": shelfNum + thisTd.find(".usedSpan").text()
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
                                        if (num == res.listAllPac.length) {
                                            break
                                        }
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
