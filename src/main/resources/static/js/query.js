/**
 * Created by jessicababy on 2017/4/6.
 */

function isOverTime() {
    if(loading){
        loading = false;
        $("#loadingDialog").dialog("close");
        $("#tipDiv").find("p").html("请求超时！可尝试刷新页面。<br>Overtime！Please refresh and reload");
        $("#tipDiv").dialog("open");
    }
}
$(function(){
    var conditions = [];
    var station = false;
    var idInput = false;
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

    $("#tipDiv").dialog({
        autoOpen: false,
        width: 400,
        modal:true,
        buttons: [
            {
                text: "确定-Ok",
                click: function() {
                    $(this).dialog( "close" );
                }
            }
        ]
    });

    $( "#loadingDialog" ).dialog({
        autoOpen: false,
        width: 400,
        modal:true,
        closeOnEscape: false,
        dialogClass: "no-close"
    });

    $("#packetIdInput").on('input propertychange', function(){
        if($(this).val() != ""){
            idInput = true;
            $("select").each(function() {
                $(this).attr("disabled",true);
            });
        }else{
            idInput = false;
            $("select").each(function() {
                $(this).attr("disabled",false);
            });
        }
    });

    $.ajax({
        type: "POST",
        url: "/backModuleNum",
        dataType: "json",
        data: {
        },
        success: function (res) {
            $(".modelNoSelect").each(function(){
                $(this).html("<option selected value='null'>模版-Model No.</option>");
            });
            for(var i = 0;i < res.moduleNum.length;i++) {
                $(".modelNoSelect").each(function(){
                    $(this).append("<option>"+res.moduleNum[i]+"</option>");
                })
            }
            console.log(res);
        },
        error: function(e) {
        }
    });

    $.ajax({
        type: "POST",
        url: "/backDepartmentInfo",
        dataType: "json",
        data: {
        },
        success: function (res) {
            $(".departmentSelect").each(function(){
                $(this).html("<option selected value='null'>系列-Department</option>");
            });
            for(var i = 0;i < res.department.length;i++) {
                $(".departmentSelect").each(function(){
                    $(this).append("<option>"+res.department[i]+"</option>");
                })
            }
            console.log(res);
        },
        error: function(e) {
        }
    });

    $.ajax({
        type: "POST",
        url: "/backBrandInfo",
        dataType: "json",
        data: {
        },
        success: function (res) {
            $(".brandSelect").each(function(){
                $(this).html("<option selected value='null'>品牌-Brand</option>");
            });
            for(var i = 0;i < res.brand.length;i++) {
                $(".brandSelect").each(function(){
                    $(this).append("<option>"+res.brand[i]+"</option>");
                })
            }
            console.log(res);
        },
        error: function(e) {
            console.log("supplierError:"+e);
        }
    });

    $.ajax({
        type: "POST",
        url: "/backFittingInfo",
        dataType: "json",
        data: {
        },
        success: function (res) {
            $(".fittingSelect").each(function(){
                $(this).html("<option selected value='null'>型号-Fitting</option>");
            });
            for(var i = 0;i < res.fitting.length;i++) {
                $(".fittingSelect").each(function(){
                    $(this).append("<option>"+res.fitting[i]+"</option>");
                })
            }
            console.log(res);
        },
        error: function(e) {
        }
    });

    $.ajax({
        type: "POST",
        url: "/backProviderInfo",
        dataType: "json",
        data: {
        },
        success: function (res) {
		        $(".supplierSelect").each(function(){
			        $(this).html("<option selected value='null'>供应商-Supplier</option>");
		        });
            for(var i = 0;i < res.provider.length;i++) {
                $(".supplierSelect").each(function(){
                    $(this).append("<option>"+res.provider[i]+"</option>");
                })
            }
            console.log(res);
        },
        error: function(e) {
            console.log("supplierError:"+e);
        }
    });

    $.ajax({
        type: "POST",
        url: "/backSizeInfo",
        dataType: "json",
        data: {
        },
        success: function (res) {
//			selectList = JSON.parse(res);
		        $(".sizeSelect").each(function(){
			        $(this).html("<option selected value='null'>尺码-Size</option>");
		        });
            for(var i = 0;i < res.size.length;i++) {
                $(".sizeSelect").each(function(){
                    $(this).append("<option>"+res.size[i]+"</option>");
                })
            }
            console.log(res);
        },
        error: function(e) {
            console.log("sizeError:"+e);
        }
    });

    $.ajax({
        type: "POST",
        url: "/backColourInfo",
        dataType: "json",
        data: {
        },
        success: function (res) {
//			selectList = JSON.parse(res);
		        $(".colorSelect").each(function(){
			        $(this).html("<option selected value='null'>颜色-Color</option>");
		        });
            for(var i = 0;i < res.colour.length;i++) {
                $(".colorSelect").each(function(){
                    $(this).append("<option>"+res.colour[i]+"</option>");
                })
            }
            console.log(res);
        },
        error: function(e) {
            console.log("colorError:"+e);
        }
    });

    $(".add").click(function (){
        if(!idInput) {
            $("#condition").find("div").last().after($(".queryDiv").last().clone(true));
            $(".queryDiv").last().find("select").each(function(){
                $(this).val("null");
            });
        }
    });


    $(".modelNoSelect").change(function(){
        var modelNo = $(this).val();
        //var myThis = $(this);
        var index = $(this).parent().index();
        if(modelNo == "null"){
            $(".departmentSelect").eq(index).val("null");
            $(".brandSelect").eq(index).val("null");
            $(".fittingSelect").eq(index).val("null");
            $(".supplierSelect").eq(index).val("null");
            $(".colorSelect").eq(index).val("null");
            $(".sizeSelect").eq(index).val("null");
        }else {
            $.ajax({
                type: "POST",
                url: "/backModuleInfo",
                dataType: "json",
                data: {
                    "moduleNum": modelNo
                },
                success: function (res) {
                    console.log(res);
                    $(".departmentSelect").eq(index).val(res.moduleInfo[1]);
                    $(".brandSelect").eq(index).val(res.moduleInfo[2]);
                    $(".fittingSelect").eq(index).val(res.moduleInfo[3]);
                    $(".supplierSelect").eq(index).val(res.moduleInfo[4]);
                    $(".colorSelect").eq(index).val(res.moduleInfo[5]);
                    $(".sizeSelect").eq(index).val(res.moduleInfo[6]);
                },
                error: function (e) {
                }
            });
        }
    });

    $("#outboundCheckbox").click(function(){
        if($(this).is(":checked")){
            station = true;
            $("#wareQuery").click(function(){
                $("#timeTd").text("出库时间-OutboundTime");
            });
        }else{
            station = false;
            $("#wareQuery").click(function(){
                $("#timeTd").text("入库时间-InboundTime");
            });
        }
    });


    $("#wareQuery").click(function(){
        var isAtLeastOne = false;
        conditions = [];
        var packetId = removeSpaces($("#packetIdInput").val(),2);
        if((packetId != "" && packetId.length != 8) || isNaN(packetId)){
            $("#tipDiv").find("p").html("包裹ID输入必须为8位且为数字！<br> The length of PackID should be 8, and the PackID should be a number!");
            $("#tipDiv").dialog("open");
        }else{
            var conditionsLength = $(".modelNoSelect").length;
            function isNull(data){
                if(data == "null"){
                    return null;
                }else{
                    return data;
              }
            }
            for(var i = 0;i < conditionsLength;i++){
                var moduleNum = isNull($(".modelNoSelect").eq(i).val());
                var department = isNull($(".departmentSelect").eq(i).val());
                var brand = isNull($(".brandSelect").eq(i).val());
                var fitting = isNull($(".fittingSelect").eq(i).val());
                var supplier = isNull($(".supplierSelect").eq(i).val());
                var color = isNull($(".colorSelect").eq(i).val());
                var size = isNull($(".sizeSelect").eq(i).val());
                conditions.push({"provider": supplier, "colour": color, "size": size,"fitting": fitting, "department": department, "brand": brand,"moduleNum": moduleNum});
                if(isNull($(".modelNoSelect").eq(i).val()) != null || isNull($(".departmentSelect").eq(i).val()) != null || isNull($(".brandSelect").eq(i).val()) != null || isNull($(".fittingSelect").eq(i).val()) != null || isNull($(".supplierSelect").eq(i).val()) != null || isNull($(".colorSelect").eq(i).val()) != null || isNull($(".sizeSelect").eq(i).val()) != null){
                    isAtLeastOne = true;
                }
            }
            console.log(conditions);
            if(packetId != ""){
                isAtLeastOne = true;
            }
            if(!isAtLeastOne){
                $("#tipDiv").find("p").html("至少需要一个查询条件！<br>It needs at least one query condition!");
                $("#tipDiv").dialog("open");
            }else {
                if (station == true) {
                    $("#loadingDialog").find("span").html("查询中，请稍等-Querying，please wait ......");
                    $("#loadingDialog").dialog("open");
                    $('#shclDefault').shCircleLoader();
                    loading = true;
                    window.setInterval(isOverTime, 600000);
                    $.ajax({
                        type: "POST",
                        url: "/query/OutQueryInfo",
                        dataType: "json",
                        contentType: "application/json; charset=UTF-8",
                        data: JSON.stringify({
                            "conditions": conditions,
                            "station": station,
                            "packageId": packetId
                        }),
                        success: function (res) {
                            loading = false;
                            console.log(res);
                            $("#loadingDialog").dialog("close");
                            $(".t2").remove();
                            if (res.wares.length == 0) {
                                $("#tipDiv").find("p").html("没有找到符合条件的结果！<br>No proper result!");
                                $("#tipDiv").dialog("open");
                            } else {
                                for (var i = 0; i < res.wares.length; i++) {
                                    var n = i + 1;
                                    var packetId = res.wares[i].packageID;
                                    var modelNo = res.wares[i].moduleNum;
                                    var department = res.wares[i].department;
                                    var brand = res.wares[i].brand;
                                    var fitting = res.wares[i].fitting;
                                    var provider = res.wares[i].provider;
                                    var size = res.wares[i].size;
                                    var color = res.wares[i].colour;
                                    var position = res.wares[i].positionInfo.substring(0,2)+"-"+res.wares[i].positionInfo.substring(2,5);
                                    var number = res.wares[i].outNum;
                                    var operationTime = null;
        //                        if(!station){
                                    operationTime = res.wares[i].out_time;
        //                        }else{
        //                            operationTime = res.wares[i].out_time;
        //                        }
                                    $("#tab").append("<tr class='t2'>" +
                                        "<td>" + n + "</td>" +
                                        "<td>" + packetId + "</td>" +
                                        "<td>" + modelNo + "</td>" +
                                        "<td>" + department + "</td>" +
                                        "<td>" + brand + "</td>" +
                                        "<td>" + fitting + "</td>" +
                                        "<td>" + provider + "</td>" +
                                        "<td>" + size + "</td>" +
                                        "<td>" + color + "</td>" +
                                        "<td>" + position + "</td>" +
                                        "<td>" + operationTime + "</td>" +
                                        "<td>" + number + "</td></tr>");
                                }

                                $("#tab tr:odd").css("background-color", "white");
                                $("#tab tr:even").css("background-color", "#f3f3f3");
                                $("#t1").css("background-color", "#ecf6fd");
                            }
                        },
                        error: function (e) {
                            loading = false;
                            $("#loadingDialog").dialog("close");
                            $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                            $("#tipDiv").dialog("open");
                        }
                    });
                }else {
                    $("#loadingDialog").find("span").html("查询中，请稍等-Querying，please wait ......");
                    $("#loadingDialog").dialog("open");
                    $('#shclDefault').shCircleLoader();
                    $.ajax({
                        type: "POST",
                        url: "/query/IntQueryInfo",
                        dataType: "json",
                        contentType: "application/json; charset=UTF-8",
                        data: JSON.stringify({
                            "conditions": conditions,
                            "station": station,
                            "packageId": packetId
                        }),
                        success: function (res) {
                            loading = false;
                            console.log(res);
                            $("#loadingDialog").dialog("close");
                            $(".t2").remove();
                            if (res.wares.length == 0) {
                                $("#tipDiv").find("p").html("没有找到符合条件的结果！<br>No proper result!");
                                $("#tipDiv").dialog("open");
                            } else {
                                for (var i = 0; i < res.wares.length; i++) {
                                    var n = i + 1;
                                    var packetId = res.wares[i].packageID;
                                    var modelNo = res.wares[i].moduleNum;
                                    var department = res.wares[i].department;
                                    var brand = res.wares[i].brand;
                                    var fitting = res.wares[i].fitting;
                                    var provider = res.wares[i].provider;
                                    var size = res.wares[i].size;
                                    var color = res.wares[i].colour;
                                    var position = res.wares[i].positionInfo.substring(0,2)+"-"+res.wares[i].positionInfo.substring(2,5);
                                    var number = res.wares[i].nowNum;
                                    var operationTime = null;
        //                        if(!station){
                                    operationTime = res.wares[i].int_time;
        //                        }else{
        //                            operationTime = res.wares[i].out_time;
        //                        }
                                    $("#tab").append("<tr class='t2'>" +
                                        "<td>" + n + "</td>" +
                                        "<td>" + packetId + "</td>" +
                                        "<td>" + modelNo + "</td>" +
                                        "<td>" + department + "</td>" +
                                        "<td>" + brand + "</td>" +
                                        "<td>" + fitting + "</td>" +
                                        "<td>" + provider + "</td>" +
                                        "<td>" + size + "</td>" +
                                        "<td>" + color + "</td>" +
                                        "<td>" + position + "</td>" +
                                        "<td>" + operationTime + "</td>" +
                                        "<td>" + number + "</td></tr>");
                                }
                                $("#tab tr:odd").css("background-color", "white");
                                $("#tab tr:even").css("background-color", "#f3f3f3");
                                $("#t1").css("background-color", "#ecf6fd");
                            }
                        },
                        error: function (e) {
                            loading = false;
                            $("#loadingDialog").dialog("close");
                            $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                            $("#tipDiv").dialog("open");
                        }
                    });
                }
            }
        }
    });
    $("#packetIdInput").keydown(function(event) {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $('#wareQuery').click();
        }
    });
});