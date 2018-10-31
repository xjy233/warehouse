/**
 * Created by jessicababy on 2017/4/9.
 */
//菜单
var idInput = false;
var username = null;//用户
var loading = false;

$( "#tabs" ).tabs();

function isOverTime() {
    if(loading){
        loading = false;
        $("#loadingDialog").dialog("close");
        $("#tipDiv").find("p").html("请求超时！可尝试刷新页面。<br>Overtime！Please refresh and reload");
        $("#tipDiv").dialog("open");
    }
}
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

function colorChange() {
    $("#tab tr:odd").css("background-color", "white");
    $("#tab tr:even").css("background-color", "#f3f3f3");
    $("#t1").css("background-color","#ecf6fd");
    $("#tab2 tr:odd").css("background-color", "white");
    $("#tab2 tr:even").css("background-color", "#f3f3f3");
    $("#t2").css("background-color","#ecf6fd");
    $("#tabAutomatic tr:odd").css("background-color", "white");
    $("#tabAutomatic tr:even").css("background-color", "#f3f3f3");
    $("#t1Automatic").css("background-color","#ecf6fd");
    $("#tab2Automatic tr:odd").css("background-color", "white");
    $("#tab2Automatic tr:even").css("background-color", "#f3f3f3");
    $("#t2Automatic").css("background-color","#ecf6fd");
}

function isNull(data){
    if(data == "null"){
        return null;
    }else{
        return data;
    }
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

$(".add").click(function (){
    if(!idInput) {
        $("#condition").find("div").last().after($(".queryDiv").last().clone(true));
        $(".queryDiv").last().find("select").each(function(){
            $(this).val("null");
        });
    }
});

$("#addAutomatic").click(function (){
    $("#conditionAutomatic").find("div").last().after($("#conditionAutomatic").find(".queryDiv").last().clone(true));
    $("#conditionAutomatic").find(".queryDiv").last().find("select").each(function(){
        $(this).val("null");
    });
    $("#conditionAutomatic").find(".queryDiv").last().find("input").each(function(){
        $(this).val("");
    });
});

//全选
$("#checkAll").on("click", function () {
    if($("#checkAll").is(":checked")) {
        $("[name = chkItem]:checkbox").prop("checked", true);
        $("[name = chkItem]:checkbox").parent().parent().css("color","red");
    }
    else{
        $("[name = chkItem]:checkbox").prop("checked", false);
        $("[name = chkItem]:checkbox").parent().parent().css("color","black");
    }

    var isChecked = false;
    $("[name = chkItem]:checkbox").each(function () {
        if($(this).is(":checked")){
            isChecked = true;
        }
    });
    if(!isChecked){
        $("#addBtn").attr('disabled',true);
        $("#addBtn").css("background-color","grey");
    }else{
        $("#addBtn").attr('disabled',false);
        $("#addBtn").css("background-color"," #49a9ee ");
    }
});

$("#checkAll2").on("click", function () {
    if($("#checkAll2").is(":checked")) {
        $("[name = chkItem2]:checkbox").prop("checked", true);
        $("[name = chkItem2]:checkbox").parent().parent().css("color","red");
    }
    else{
        $("[name = chkItem2]:checkbox").prop("checked", false);
        $("[name = chkItem2]:checkbox").parent().parent().css("color","black");
    }

    var isChecked = false;
    $("[name = chkItem2]:checkbox").each(function () {
        if($(this).is(":checked")){
            isChecked = true;
        }
    });
    if(!isChecked){
        $("#empty").attr('disabled',true);
        $("#empty").css("background-color"," grey ");
        $("#out").attr('disabled',true);
        $("#out").css("background-color"," grey ");
    }else{
        $("#empty").attr('disabled',false);
        $("#empty").css("background-color"," #49a9ee ");
        $("#out").attr('disabled',false);
        $("#out").css("background-color"," #49a9ee ");
    }
});

var supplier;

$.ajax({
    type: "POST",
    url: "/backModuleNum",
    dataType: "json",
    data: {
    },
    success: function (res) {
        console.log(res);
        $(".modelNoSelect").each(function(){
            $(this).html("<option selected value='null'>模版-Model No.</option>");
        });
        for(var i = 0;i < res.moduleNum.length;i++) {
            $(".modelNoSelect").each(function(){
                $(this).append("<option>"+res.moduleNum[i]+"</option>");
            })
        }
        $(".autoModelNoSelect").each(function(){
            $(this).html("<option selected value='null'>模版-Model No.</option>");
        });
        for(var i = 0;i < res.moduleNum.length;i++) {
            $(".autoModelNoSelect").each(function(){
                $(this).append("<option>"+res.moduleNum[i]+"</option>");
            })
        }
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

$("#autoButton").click(function () {
    var quantity = [];
    var moduleNum = [];
    for (var i = 0; i < $(".autoModelNoSelect").length; i++) {
        var modelNo = $(".autoModelNoSelect").eq(i).val();
        var num = removeSpaces($(".autoInput").eq(i).val(),2);
        if(modelNo == "null"){
            $("#tipDiv").find("p").html("模版是必选的！ <br/>The model No. must be selected!");
            $("#tipDiv").dialog("open");
            return;
        }
        if(num <= 0 || isNaN(num)){
            $("#tipDiv").find("p").html("数量必须大于0且输入必须为数字！ <br/>The number of wares should be greater than 0 and the input should be a number!");
            $("#tipDiv").dialog("open");
            return;
        }
        moduleNum.push(modelNo);
        num = parseInt(num);
        quantity.push(num);
    }
    console.log(quantity);
    console.log(moduleNum);
    $("#loadingDialog").find("span").html("推荐中，请稍等-Recommending，please wait ......");
    $("#loadingDialog").dialog("open");
    $('#shclDefault').shCircleLoader();
    loading = true;
    window.setInterval(isOverTime, 600000);
    $.ajax({
        type: "POST",
        url: "/OutHouse/SmartOut",
        dataType: "json",
        data: JSON.stringify({
            "quantity": quantity,
            "moduleNum": moduleNum
        }),
        success: function (res) {
            console.log(res);
            loading = false;
            $("#loadingDialog").dialog("close");
            if (res.wares.length == 0) {
                $("#tabAutomatic").find(".t1").remove();
                $("#resDialog").dialog("open");
            } else {
                $("#addBtnAutomatic").attr('disabled',false);
                $("#addBtnAutomatic").css("background-color"," #49a9ee ");
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
                    var position = res.wares[i].positionInfo.substring(0, 2) + "-" + res.wares[i].positionInfo.substring(2, 5);
                    var number = res.wares[i].OutNum;
                    var jeansID = res.wares[i].jeansID;
                    $("#tabAutomatic").append("<tr class='t1Automatic'>" +
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
                        "<td>" + number + "</td>" +
                        "<td style='display: none'>" + jeansID + "</td></tr>")
                }
                colorChange();
            }
        },
        error: function(e) {
            loading = false;
            $("#loadingDialog").dialog("close");
            $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
            $("#tipDiv").dialog("open");
        }
    });
});

//查询显示在表格内
$("#queryBtn").click(function(){
    var isAtLeastOne = false;
    var nameList = [];
    var nameListLength = $(".supplierSelect").length;
    var packetId = removeSpaces($("#packetIdInput").val(),2);
    if((packetId != "" && packetId.length != 8) || isNaN(packetId)){
        $("#longDialog").dialog( "open" );
    }else{
        for(var i = 0;i < nameListLength;i++){
            var moduleNum = isNull($(".modelNoSelect").eq(i).val());
            var department = isNull($(".departmentSelect").eq(i).val());
            var brand = isNull($(".brandSelect").eq(i).val());
            var fitting = isNull($(".fittingSelect").eq(i).val());
            var supplier = isNull($(".supplierSelect").eq(i).val());
            var color = isNull($(".colorSelect").eq(i).val());
            var size = isNull($(".sizeSelect").eq(i).val());
            nameList.push({"provider": supplier, "colour": color, "size": size,"fitting": fitting, "department": department, "brand": brand,"moduleNum": moduleNum});
            if(isNull($(".modelNoSelect").eq(i).val()) != null || isNull($(".departmentSelect").eq(i).val()) != null || isNull($(".brandSelect").eq(i).val()) != null || isNull($(".fittingSelect").eq(i).val()) != null || isNull($(".supplierSelect").eq(i).val()) != null || isNull($(".colorSelect").eq(i).val()) != null || isNull($(".sizeSelect").eq(i).val()) != null){
                isAtLeastOne = true;
            }
        }
        console.log(nameList);
        if(packetId != ""){
            isAtLeastOne = true;
        }
        if(!isAtLeastOne){
            $("#tipDiv").find("p").html("至少需要一个查询条件！<br>It needs at least one query condition!");
            $("#tipDiv").dialog("open");
        }else {
            $("#loadingDialog").find("span").html("查询中，请稍等-Querying，please wait ......");
            $("#loadingDialog").dialog("open");
            $('#shclDefault').shCircleLoader();
            loading = true;
            window.setInterval(isOverTime, 600000);
            $.ajax({
                type: "POST",
                url: "/query/IntQueryInfo",
                dataType: "json",
                contentType: "application/json; charset=UTF-8",
                data: JSON.stringify({
                    "conditions": nameList,
                    "station": false,
                    "packageId": packetId
                }),
                success: function (res) {
                    loading = false;
                    $("#loadingDialog").dialog("close");
                    console.log(res);
                    $("#tab").find(".t1").remove();
                    if (res.wares.length == 0) {
                        $("#tab").find(".t1").remove();
                        $("#resDialog").dialog("open");
                    } else {
                        $("#checkAll").prop("checked", false);
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
                            // var jeansID = res.wares[i].jeansID;
                            $("#tab").append("<tr class='t1'>" +
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
                                "<td>" + number + "</td>" +
                                // "<td style='display: none'>" + jeansID + "</td>"+
                                "<td ><input name='chkItem' type='checkbox'></td></tr>")
                        }
                        //有了查询结果后 便可以加入购物车 按钮可用状态
                        // $("#addBtn").attr('disabled',false);
                        // $("#addBtn").css("background-color"," #49a9ee ");
                        $("[name = chkItem]:checkbox").on("click", function () {
                            var isChecked = false;
                            $("[name = chkItem]:checkbox").each(function () {
                                if ($(this).is(":checked")) {
                                    isChecked = true;
                                }
                            });
                            if (!isChecked) {
                                $("#addBtn").attr('disabled', true);
                                $("#addBtn").css("background-color", "grey");
                            } else {
                                $("#addBtn").attr('disabled', false);
                                $("#addBtn").css("background-color", " #49a9ee ");
                            }

                            var allCheck = true;
                            $("[name = chkItem]:checkbox").each(function () {
                                if(!$(this).is(":checked")) {
                                    allCheck = false;
                                }
                            });
                            if(allCheck){
                                $("#checkAll").prop("checked", true);
                            }else{
                                $("#checkAll").prop("checked", false);
                            }

                            if ($(this).is(":checked")) {
                                $(this).parent().parent().css("color","red");
                            }else{
                                $(this).parent().parent().css("color","black");
                            }
                        });
                        colorChange();
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
    });

$("#packetIdInput").keydown(function(event) {
    if (event.keyCode == "13") {//keyCode=13是回车键
        $('#queryBtn').click();
    }
});

//向后台传值 并加入列表
$("#addBtnAutomatic").click(function(){
    var lock = [];
    $(".t1Automatic").each(function() {
        lock.push($(this).find("td").eq(11).html());
    });
    console.log(lock);
    $.ajax({
        type: "POST",
        url: "/OutHouse/backLockInfo",
        dataType: "json",
        data: {
            "jeansId":JSON.stringify(lock)
        },
        success: function (res) {
            if(!res){
                $("#refDialog").dialog( "open" );
            }else{
                var length = 0;
                var n=$(".t2").length+1;
                $(".t1Automatic").each(
                    function() {
                        for (var i = 0; i < res.listJeaLock.length; i++){
                            if($(this).find("td").eq(1).html()==res.listJeaLock[i][0]&&res.listJeaLock[i][1]=="0"){
                                $("#tipDiv").find("p").html("ID为"+$(this).parent().parent().find("td").eq(1).html()+"的包裹已经被锁定！<br>This packages is locked.");
                                $("#tipDiv").dialog("open");
                                return;
                            }
                        }
                        $("#tab2Automatic").append("<tr class='t2Automatic'>" +
                                "<td>" + n + "</td>" +
                                "<td>"  +$(this).find("td").eq(1).html() + "</td>" +
                                "<td>" + $(this).find("td").eq(2).html()+ "</td>" +
                                "<td>" + $(this).find("td").eq(3).html() + "</td>" +
                                "<td>" + $(this).find("td").eq(4).html() + "</td>" +
                                "<td>" + $(this).find("td").eq(5).html() + "</td>" +
                                "<td>" + $(this).find("td").eq(6).html()+ "</td>" +
                                "<td>" + $(this).find("td").eq(7).html()+ "</td>" +
                                "<td>" + $(this).find("td").eq(8).html()+ "</td>" +
                                "<td>" + $(this).find("td").eq(9).html()+ "</td>" +
                                "<td>" + $(this).find("td").eq(10).html()+ "</td>" +
                                "<td style='display: none'>" + $(this).find("td").eq(11).html() + "</td></tr>");
                        n++;
                        $(this).remove();
                        });
                var tdNum = 1;
                $("#tabAutomatic").find(".t1Automatic").each(function(){
                    if(tdNum <= $("#tab").find("tr").length){
                        $(this).find("td").first().html(tdNum);
                        tdNum++;
                    }
                });

                colorChange();

                $("#addBtnAutomatic").attr('disabled',true);
                $("#addBtnAutomatic").css("background-color"," grey ");

                $("#emptyAutomatic").attr('disabled',false);
                $("#emptyAutomatic").css("background-color"," #49a9ee ");
                $("#outAutomatic").attr('disabled',false);
                $("#outAutomatic").css("background-color"," #49a9ee ");
                //如果没有剩余的选项 就将出库按钮设置为disable
                /*if(cancheck==0){
                 $("#addBtn").attr('disabled',true);
                 $("#addBtn").css("background-color","grey");
                 }*/
            }
        },
        error: function(e) {
            $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
            $("#tipDiv").dialog("open");
        }
    })
});
$("#addBtn").click(function(){
        var lock = [];
        $("input[name='chkItem']:checkbox").each(function() {
            if($(this).is(":checked")){
                lock.push($(this).parent().parent().find("td").eq(11).html());
            }
        });
        console.log(lock);
        $.ajax({
            type: "POST",
            url: "/OutHouse/backLockInfo",
            dataType: "json",
            data: {
                "jeansId":JSON.stringify(lock)
            },
            success: function (res) {
                if(!res){
                    $("#refDialog").dialog( "open" );
                }else{
                    var n=$(".t2").length+1;
                    $("input[name='chkItem']:checkbox").each(
                        function() {
                            for (var i = 0; i < res.listJeaLock.length; i++){
                            if($(this).parent().parent().find("td").eq(1).html()==res.listJeaLock[i][0]&&res.listJeaLock[i][1]=="0"){
                                $("#tipDiv").find("p").html("ID为"+$(this).parent().parent().find("td").eq(1).html()+"的包裹已经被锁定！<br>This packages is locked.");
                                $("#tipDiv").dialog("open");
                            }
                        }
                            if($(this).is(":checked")){
                                $("#tab2").append("<tr class='t2'>" +
                                    "<td>" + n + "</td>" +
                                    "<td>"  +$(this).parent().parent().find("td").eq(1).html() + "</td>" +
                                    "<td>" + $(this).parent().parent().find("td").eq(2).html()+ "</td>" +
                                    "<td>" + $(this).parent().parent().find("td").eq(3).html() + "</td>" +
                                    "<td>" + $(this).parent().parent().find("td").eq(4).html() + "</td>" +
                                    "<td>" + $(this).parent().parent().find("td").eq(5).html() + "</td>" +
                                    "<td>" + $(this).parent().parent().find("td").eq(6).html()+ "</td>" +
                                    "<td>" + $(this).parent().parent().find("td").eq(7).html()+ "</td>" +
                                    "<td>" + $(this).parent().parent().find("td").eq(8).html()+ "</td>" +
                                    "<td>" + $(this).parent().parent().find("td").eq(9).html()+ "</td>" +
                                    "<td>" + $(this).parent().parent().find("td").eq(10).html()+ "</td>" +
                                    "<td style='display:none;'>" + $(this).parent().parent().find("td").eq(11).html()+ "</td>" +
                                    "<td ><input name='chkItem2' type='checkbox'></td></tr>");
                                n++;
                                $(this).parent().parent().remove();
                                //当加入出库列表后 出库与清空按钮可用
                            }}   );
                    var tdNum = 1;
                    $("#tab").find(".t1").each(function(){
                        if(tdNum <= $("#tab").find("tr").length){
                            $(this).find("td").first().html(tdNum);
                            tdNum++;
                        }
                    });

                    $("#checkAll").prop("checked", false);
                    $("#checkAll2").prop("checked", false);

                    colorChange();

                    $("[name = chkItem2]:checkbox").on("click", function () {
                        var isChecked = false;
                        $("[name = chkItem2]:checkbox").each(function () {
                            if($(this).is(":checked")){
                                isChecked = true;
                            }
                        });
                        if(!isChecked){
                            $("#empty").attr('disabled',true);
                            $("#empty").css("background-color"," grey ");
                            $("#out").attr('disabled',true);
                            $("#out").css("background-color"," grey ");
                        }else{
                            $("#empty").attr('disabled',false);
                            $("#empty").css("background-color"," #49a9ee ");
                            $("#out").attr('disabled',false);
                            $("#out").css("background-color"," #49a9ee ");
                        }

                        var allCheck = true;
                        $("[name = chkItem2]:checkbox").each(function () {
                            if(!$(this).is(":checked")) {
                                allCheck = false;
                            }
                        });
                        if(allCheck){
                            $("#checkAll2").prop("checked", true);
                        }else{
                            $("#checkAll2").prop("checked", false);
                        }

                        if ($(this).is(":checked")) {
                            $(this).parent().parent().css("color","red");
                        }else{
                            $(this).parent().parent().css("color","black");
                        }
                    });

                    $("#addBtn").attr('disabled',true);
                    $("#addBtn").css("background-color"," grey ");
                    //如果没有剩余的选项 就将出库按钮设置为disable
                    /*if(cancheck==0){
                        $("#addBtn").attr('disabled',true);
                        $("#addBtn").css("background-color","grey");
                    }*/
                     }
            },
            error: function(e) {
                $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                $("#tipDiv").dialog("open");
            }
        })
});

//出库
$("#outDialog").dialog({
    autoOpen: false,
    width: 400,
    modal: true,
    buttons: [
        {
            text: "出库-Outbound",
            click: function() {
                var out = [];
                if($("#tabs-2").css("display") == "none"){
                    $(".t2Automatic").each(function () {
                        out.push($(this).find("td").eq(11).text());
                        out.push($(this).find("td").eq(10).text());
                    });
                }else {
                    $("input[name='chkItem2']:checkbox").each(function () {
                        if ($(this).is(":checked")) {
                            out.push($(this).parent().parent().find("td").eq(11).text());
                            out.push($(this).parent().parent().find("td").eq(10).text());
                        }
                    });
                }
                $("#loadingDialog").find("span").html("出库中，请稍等-Outbound，please wait ......");
                $("#loadingDialog").dialog("open");
                $('#shclDefault').shCircleLoader();
                loading = true;
                window.setInterval(isOverTime, 600000);
                $.ajax({
                        type: "POST",
                        url: "/OutHouse/deletePackage",
                        dataType: "json",
                        data: {
                            "username": username,
                            "jeansId": JSON.stringify(out),
                        },
                        success:function(res){
                            loading = false;
                            $( "#loadingDialog" ).dialog("close");
                            var str= null;
                            var myDate = new Date();
                            function p(s) {
                                return s < 10 ? '0' + s: s;
                            }
                            str = "" + myDate.getFullYear() + "-";
                            str += (myDate.getMonth()+1) + "-";
                            str += myDate.getDate() + " ";
                            str += (p(myDate.getHours())+ ":");
                            str += p(myDate.getMinutes());
                            localStorage.setItem("outboundRes", JSON.stringify(res));
                            localStorage.setItem("outboundTime", str);
                            $( "#outDialog" ).dialog("close");
                            $( "#dialog" ).dialog("open");
                            //若没有可供操作的选项，出库与清空按钮设置为disable
                            if($("#tabs-2").css("display") == "none"){
                                $("#emptyAutomatic").attr('disabled', true);
                                $("#emptyAutomatic").css("background-color", "grey");
                                $("#outAutomatic").attr('disabled', true);
                                $("#outAutomatic").css("background-color", "grey");
                            }else {
                                $("#empty").attr('disabled', true);
                                $("#empty").css("background-color", "grey");
                                $("#out").attr('disabled', true);
                                $("#out").css("background-color", "grey");
                            }

                        },
                        error:function(e){
                            loading = false;
                            $( "#loadingDialog" ).dialog("close");
                            $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                            $("#tipDiv").dialog("open");
                        }

                    }
                )
            }
        },
        {
            text: "关闭-close",
            click: function() {
                $( this ).dialog( "close" );
            }
        }
    ]
});
$("#out").click(function () {
  $("#outDialog").dialog("open")
});
$("#outAutomatic").click(function () {
    $("#outDialog").dialog("open")
});

//清空
$("#empty").click(function(){
    var unlock = [];
    if($("#tabs-2").css("display") == "none"){
        $(".t2Automatic").each(function () {
            unlock.push($(this).find("td").eq(11).text());
        });
    }else {
        $("input[name='chkItem2']:checkbox").each(function () {
            if ($(this).is(":checked")) {
                unlock.push($(this).parent().parent().find("td").eq(11).html());
            }
        });
    }
    console.log(unlock);
    $.ajax({
        type: "POST",
        url: "/OutHouse/unLockPac",
        dataType: "json",
        data: {
            "jeaId":JSON.stringify(unlock)
        },
        success: function (res) {
            if(!res){
                $("#tipDiv").find("p").html("操作失败，请刷新重试！<br> Operation failed！Please refresh and retry!");
                $("#tipDiv").dialog("open");
            }else if(res.backInfo=="unlock success") {
                if ($("#tabs-2").css("display") == "none") {
                    $(".t2Automatic").each(function () {
                        $("#tabAutomatic").append("<tr class='t1Automatic'>" +
                            "<td>" + (Number($("#tabAutomatic").find(".t1Automatic").length) + 1) + "</td>" +
                            "<td>" + $(this).parent().parent().find("td").eq(1).html() + "</td>" +
                            "<td>" + $(this).parent().parent().find("td").eq(2).html() + "</td>" +
                            "<td>" + $(this).parent().parent().find("td").eq(3).html() + "</td>" +
                            "<td>" + $(this).parent().parent().find("td").eq(4).html() + "</td>" +
                            "<td>" + $(this).parent().parent().find("td").eq(5).html() + "</td>" +
                            "<td>" + $(this).parent().parent().find("td").eq(6).html() + "</td>" +
                            "<td>" + $(this).parent().parent().find("td").eq(7).html() + "</td>" +
                            "<td>" + $(this).parent().parent().find("td").eq(8).html() + "</td>" +
                            "<td>" + $(this).parent().parent().find("td").eq(9).html() + "</td>" +
                            "<td>" + $(this).parent().parent().find("td").eq(10).html() + "</td></tr>");
                        $(this).remove();
                    });

                    $("#addBtnAutomatic").attr('disabled',false);
                    $("#addBtnAutomatic").css("background-color"," #49a9ee ");
                    $("#emptyAutomatic").attr('disabled', true);
                    $("#emptyAutomatic").css("background-color", "grey");
                    $("#outAutomatic").attr('disabled', true);
                    $("#outAutomatic").css("background-color", "grey");
                }else {
                    $("#checkAll").prop("checked", false);
                    $("#checkAll2").prop("checked", false);
                    $("input[name='chkItem2']:checkbox").each(function () {
                        if ($(this).is(":checked")) {
                            $("#tab").append("<tr class='t1'>" +
                                "<td>" + (Number($("#tab").find(".t1").length) + 1) + "</td>" +
                                "<td>" + $(this).parent().parent().find("td").eq(1).html() + "</td>" +
                                "<td>" + $(this).parent().parent().find("td").eq(2).html() + "</td>" +
                                "<td>" + $(this).parent().parent().find("td").eq(3).html() + "</td>" +
                                "<td>" + $(this).parent().parent().find("td").eq(4).html() + "</td>" +
                                "<td>" + $(this).parent().parent().find("td").eq(5).html() + "</td>" +
                                "<td>" + $(this).parent().parent().find("td").eq(6).html() + "</td>" +
                                "<td>" + $(this).parent().parent().find("td").eq(7).html() + "</td>" +
                                "<td>" + $(this).parent().parent().find("td").eq(8).html() + "</td>" +
                                "<td>" + $(this).parent().parent().find("td").eq(9).html() + "</td>" +
                                "<td>" + $(this).parent().parent().find("td").eq(10).html() + "</td>" +
                                "<td ><input name='chkItem' type='checkbox'></td></tr>");
                            $(this).parent().parent().remove();
                            length++;
                        }
                    });

                    $("[name = chkItem]:checkbox").on("click", function () {
                        var isChecked = false;
                        $("[name = chkItem]:checkbox").each(function () {
                            if ($(this).is(":checked")) {
                                isChecked = true;
                            }
                        });
                        if (!isChecked) {
                            $("#addBtn").attr('disabled', true);
                            $("#addBtn").css("background-color", "grey");
                        } else {
                            $("#addBtn").attr('disabled', false);
                            $("#addBtn").css("background-color", " #49a9ee ");
                        }

                        var allCheck = true;
                        $("[name = chkItem]:checkbox").each(function () {
                            if (!$(this).is(":checked")) {
                                allCheck = false;
                            }
                        });
                        if (allCheck) {
                            $("#checkAll").prop("checked", true);
                        } else {
                            $("#checkAll").prop("checked", false);
                        }

                        if ($(this).is(":checked")) {
                            $(this).parent().parent().css("color", "red");
                        } else {
                            $(this).parent().parent().css("color", "black");
                        }
                    });

                    colorChange();

                    //若没有可供操作的选项，出库与清空按钮设置为disable
                    $("#empty").attr('disabled', true);
                    $("#empty").css("background-color", "grey");
                    $("#out").attr('disabled', true);
                    $("#out").css("background-color", "grey");
                }
            }
        },
        error: function(e) {
            $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
            $("#tipDiv").dialog("open");
        }
    })
});

//对话框
$( "#dialog" ).dialog({
    autoOpen: false,
	closeOnEscape: false,
	dialogClass: "no-close",
    width: 400,
    modal: true,
    buttons: [
        {
            text: "打印-Print",
            click: function() {
            	/*var table = $("#tab2").clone();
                $("input[name='chkItem2']:checkbox").each(function () {
                    if ($(this).is(":checked")) {
                    	table.append($(this).parent().parent());
                        localStorage.setItem("packetID", $(this).parent().parent().find("td").eq(1).text());
                        localStorage.setItem("packetTable", $(this).parent().parent().find("td").eq().text());
                        localStorage.setItem("position",  $(this).parent().parent().find("td").eq().text());
                    }});
                localStorage.setItem("shelf", $(this).parent().parent().find("td").eq().text() );*/
                $(this).dialog("close");
                $("#printDialog").dialog("open");
                window.open("./outboundPrint.html");
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
                window.location.reload();
            }
        },
        {
            text: "失败！重新打印-Failure！Query and reprint",
            click: function() {
                //跳转查询
                function p(s) {
                    return s < 10 ? '0' + s: s;
                }
                var myDate = new Date();
                var str = "" + myDate.getFullYear() + "-";
                str += p(myDate.getMonth()+1) + "-";
                str += p(myDate.getDate());
                location.href="./in&OutboundQuery.html?outbound="+str;
            }
        }
    ]
});
$("#resDialog").dialog({
    autoOpen: false,
    width: 400,
    modal: true,
    buttons: [
        {
            text: "确定-Ok",
            click: function () {
                $(this).dialog( "close" );
            }
        }
    ]
});
$("#longDialog").dialog({
    autoOpen: false,
    width: 400,
    modal: true,
    buttons: [
        {
            text: "确定-Ok",
            click: function () {
                $(this).dialog( "close" );
            }
        }
    ]
});
$("#refDialog").dialog({
    autoOpen: false,
    width: 400,
    modal: true,
    buttons: [
        {
            text: "确定-Ok",
            click: function () {
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

$( "#loadingDialog" ).dialog({
    autoOpen: false,
    width: 400,
    modal:true,
    closeOnEscape: false,
    dialogClass: "no-close"
});