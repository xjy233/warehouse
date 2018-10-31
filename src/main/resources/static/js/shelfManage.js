/**
 * Created by jessicababy on 2017/4/16.
 */
var shelfNum = 0;
var delDom = null;
var loading = false;

function isOverTime() {
    if(loading){
        loading = false;
        $("#loadingDialog").dialog("close");
        $("#tipDiv").find("p").html("请求超时！可尝试刷新页面。<br>Overtime！Please refresh and reload");
        $("#tipDiv").dialog("open");
    }
}

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

$( ".dialog" ).dialog({
    autoOpen: false,
    width: 400,
    modal:true,
    dialogClass: "no-close",
    buttons: [
        {
            text: "确定-Ok",
            click: function() {
                location.href=("./autoDistribution.html?shelfNum="+shelfNum);
                $( this ).dialog( "close" );
            }
        },
        {
            text: "取消-Cancel",
            click: function() {
                $( this ).dialog( "close" );
            }
        }
    ]
});

$( "#delDialog" ).dialog({
    autoOpen: false,
    width: 400,
    modal:true,
    closeOnEscape: false,
    dialogClass: "no-close",
    buttons: [
        {
            text: "确定-Ok",
            click: function() {
                $( "#loadingDialog" ).find("span").html("货架删除中，请稍等-Shelf is deleting，please wait ......<br>注意：规模较大的货架可能需要较长时间，请耐心等候！<br>Warn: the shelf may too large to delete in short time, please wait patiently!");
                $( "#loadingDialog" ).dialog("open");
                $('#shclDefault').shCircleLoader();
                loading = true;
                window.setInterval(isOverTime,600000);
                $.ajax({
                    type: "POST",
                    url: "/Manage/deleteShelf",
                    dataType: "json",
                    data: {
                        "shelfNum":delDom.parent().find("td").eq(1).text()},
                    success:function(res){
                        loading = false;
                        $( "#loadingDialog" ).dialog("close");
                        $( "#delDialog" ).dialog("close");
                        if(res.backInfo=="delete success") {
                            location.href = location.href;
                            //$(this).parent().remove();
                            //alert("操作成功success!");
                        }
                    },
                    error: function(e) {
                        loading = false;
                        $( "#loadingDialog" ).dialog("close");
                        $( "#delDialog" ).dialog("close");
                        $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                        $("#tipDiv").dialog("open");
                    }
                })
            }
        },
        {
            text: "取消-Cancel",
            click: function() {
                $( this ).dialog( "close" );
            }
        }
    ]
});

$.ajax({
    type: "POST",
    url: "/backShelfUsed",
    dataType: "json",
    data: {
    },
    success: function (res) {
        var delShelfNum = null;
        try{
            var thisURL = document.URL;
            delShelfNum =thisURL.split("?")[1];
        }catch (e){
            console.log(e);
        }
        for(var i = 0;i < res.listUsed.length;i++){
            var n = i+1;
            /*if(delShelfNum == res.listUsed[i][0]){
                location.reload(true);
            }*/
            $("#tab").append("<tr class='t2'>" +
                "<td>"+n+"</td>" +
                "<td>"+res.listUsed[i][0]+"</td>" +
                "<td>"+res.listUsed[i][1]+"/"+res.listUsed[i][2]+"</td>"+
                "<td class='delBtn' type='button'><img class='delete' src='./img/delete.png' alt='删除-Delete'></td>" +"</tr>")
            $(".delBtn").on("click", function () {
                if( $(this).parent().find("td").eq(2).text().split("/")[0] == "0")
                    {
                        delDom = $(this);
                        $("#delDialog").dialog("open");
                    }
                    else{
                        shelfNum = $(this).parent().find("td").eq(1).text();
                        $( ".dialog" ).dialog("open");
                    }

            });
            $("#tab tr:odd").css("background-color", "white");
            $("#tab tr:even").css("background-color", "#f3f3f3");
            $("#t1").css("background-color","#ecf6fd");
        }
        console.log(res);
    },
    error: function(e) {
        console.log("supplierError:"+e);
    }
});
//添加功能
$("#btn1").click(function(){
    var n=1;
    if($("#Row").val()<1||$("#Row").val()>9)
    {$("#9Dialog").dialog( "open" );}
    else if($("#Col").val()<1||$("#Col").val()>99)
    {$("#99Dialog").dialog( "open" );}
    else if($("#Pack").val()<1||$("#Pack").val()>1000)
    {$("#1000Dialog").dialog( "open" );}
    else if($("#ID").val()<1||$("#ID").val()>99)
    {$("#IDDialog").dialog( "open" );}
    else {
        ////测试
        //n=$(".t2").length+1;
        //$("#tab").append("<tr class='t2'>" +
        //    "<td>"+ n +"</td>" +
        //    "<td>"+$("#Row").val()+"</td>" +
        //    "<td>"+$("#Col").val()+"</td>"+
        //    "<td class='delBtn' type='button'><img class='delete' src='./img/delete.png' alt='删除-Delete'></td>" +"</tr>")
        //$(".delBtn").on("click",function(){
        //    if( $(this).parent().find("td").eq(2).text().split("/")[0] == "0")
        //        $(this).parent().remove();
        //    else{
        //        shelfNum = $(this).parent().find("td").eq(1).text();
        //        $( ".dialog" ).dialog("open");
        //    }
        //});
        $( "#loadingDialog" ).find("span").html("货架生成中，请稍等-Shelf is creating，please wait ......<br>注意：规模较大的货架可能需要较长时间，请耐心等候！<br>Warn: the shelf may too large to create in short time, please wait patiently!");
        $( "#loadingDialog" ).dialog("open");
        $('#shclDefault').shCircleLoader();
        loading = true;
        window.setInterval(isOverTime,600000);
        $.ajax({
            type: "POST",
            url: "/Manage/addShelf",
            dataType: "json",
            data: {
                "shelfRow":$("#Row").val(),
                "shelfCol": $("#Col").val(),
                "pacAmount":$("#Pack").val(),
                "shelfNum":$("#ID").val()
            },
            success:function (res){
                loading = false;
                $( "#loadingDialog" ).dialog("close");
                if(res.backInfo == "add success")
					window.location.reload(true);
                else if(res.backInfo == "Exist"){
                    $("#tipDiv").find("p").html("货架号已存在，请重试！<br>ShelfID is exist, please retry!");
                    $("#tipDiv").dialog("open");
                }
            },
            error: function(e) {
                loading = false;
                $( "#loadingDialog" ).dialog("close");
                console.log("styleError:"+e);
            }
        })
    }
});
$("#ID").keydown(function(event) {
    if (event.keyCode == "13") {//keyCode=13是回车键
        $('#btn1').click();
    }
});
$("#9Dialog").dialog({
    autoOpen: false,
    width: 400,
    modal: true,
    dialogClass: "no-close",
    buttons: [
        {
            text: "确定-Ok",
            click: function () {
                $(this).dialog( "close" );
            }
        }
    ]
});
$("#99Dialog").dialog({
    autoOpen: false,
    width: 400,
    modal: true,
    dialogClass: "no-close",
    buttons: [
        {
            text: "确定-Ok",
            click: function () {
                $(this).dialog( "close" );
            }
        }
    ]
});
$("#1000Dialog").dialog({
    autoOpen: false,
    width: 400,
    modal: true,
    dialogClass: "no-close",
    buttons: [
        {
            text: "确定-Ok",
            click: function () {
                $(this).dialog( "close" );
            }
        }
    ]
});
$("#IDDialog").dialog({
    autoOpen: false,
    width: 400,
    modal: true,
    dialogClass: "no-close",
    buttons: [
        {
            text: "确定-Ok",
            click: function () {
                $(this).dialog( "close" );
            }
        }
    ]
});

