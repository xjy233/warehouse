/**
 * Created by jessicababy on 2017/4/16.
 */
var thisURL=document.URL;
var param=thisURL.split("?")[1];
var shelfNum=param.split("=")[1];
var loading = false;

function isOverTime() {
    if(loading){
        loading = false;
        $("#loadingDialog").dialog("close");
        $("#tipDiv").find("p").html("请求超时！可尝试刷新页面。<br>Overtime！Please refresh and reload");
        $("#tipDiv").dialog("open");
    }
}
//打开页面交互

$( "#loadingDialog" ).dialog({
    autoOpen: false,
    width: 400,
    modal:true,
    closeOnEscape: false,
    dialogClass: "no-close"
});

$.ajax({
    type: "POST",
    url: "/Manage/smartSend",
    dataType: "json",
    data: {
        "shelfNum":shelfNum
    },
    success: function (res) {
        var str= null;
        var myDate = new Date();
        function p(s) {
            return s < 10 ? '0' + s: s;
		    }
        str = "" + myDate.getFullYear() + "-";
        str += (myDate.getMonth()+1) + "-";
        str += myDate.getDate() + "- ";
        str += (p(myDate.getHours())+ ":");
        str += p(myDate.getMinutes());
        localStorage.setItem("smartSendRes", JSON.stringify(res));
        localStorage.setItem("smartSendTime", str);
        for(var i = 0;i < res.backInfo.length;i++){
            //var n = i+1;
            $("#tab").append("<tr class='t2'>" +
                "<td>"+res.backInfo[i][0]+"</td>" +
                "<td>"+res.backInfo[i][1]+"</td>" +
                "<td>"+res.backInfo[i][2]+"</td>"+"</tr>");
        }
        console.log(res);
    },
    error: function(e) {
        $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
        $("#tipDiv").dialog("open");
    }
});

$( "#dialog" ).dialog({
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
                        "shelfNum":shelfNum,

                    },
                    success:function(res){
                        console.log(res);
                        loading = false;
                        $( "#loadingDialog" ).dialog("close");
                        if(res.backInfo=="delete success"){
                            location.href="./shelfManage.html";
                        }else{
                            $( "#dialog" ).dialog( "close" );
                            $("#tipDiv").find("p").html("操作失败，请重试！<br>Operation failed! Please retry!");
                            $("#tipDiv").dialog("open");
                        }
                    },
                    error: function(e) {
                        loading = false;
                        $( "#loadingDialog" ).dialog("close");
                        $( "#dialog" ).dialog( "close" );
                        $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                        $("#tipDiv").dialog("open");
                    }
                });
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

$("#next").click(function () {
    $("#dialog").dialog("open");
});

$( "#dialog2" ).dialog({
    autoOpen: false,
    width: 400,
    modal:true,
    closeOnEscape: false,
    dialogClass: "no-close",
    buttons: [
        {
            text: "确定-Ok",
            click: function() {
                location.href=("./shelfManage.html");
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

$("#back").click(function () {
    $("#dialog2").dialog("open");
});

$("#print").click(function(){
	window.open("./autoDistributionPrint.html");
});
