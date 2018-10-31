/**
 * Created by jessicababy on 2017/4/12.
 */
$(".titleExtra").tooltip();
//删除对话框
var click = null;

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

$("#delDialog").dialog({
    autoOpen: false,
    width: 400,
    modal:true,
    closeOnEscape: false,
    dialogClass: "no-close",
    buttons: [
        {
            text: "确定-Ok",
            click: function() {
                $.ajax({
                    type: "POST",
                    url: "/Manage/deleteUser",
                    dataType: "json",
                    data: {"username": click.parent().find("td").eq(0).html()},
                    success: function (res) {
                        if (res.backInfo == "delete success") {
//                        click.parent().remove();
                            location.href = location.href;
                        }
                    },
                    error: function (e) {
                        $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                        $("#tipDiv").dialog("open");
                    }
                });
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
//重置对话框
var reset=null;
$("#resDialog").dialog({
    autoOpen: false,
    width: 400,
    modal:true,
    closeOnEscape: false,
    dialogClass: "no-close",
    buttons: [
        {
            text: "确定-Ok",
            click: function() {
                $.ajax({
                    type: "POST",
                    url: "/Manage/updatePassword",
                    dataType: "json",
                    data: {"username": reset.parent().find("td").eq(0).html()},
                    success: function (res) {
                        if (res.backInfo = "update success") {
                            $("#tipDiv").find("p").html("重置成功success!<br>Restore success！");
                            $("#tipDiv").dialog("open");
                        }
                    },
                    error: function (e) {
                        $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                        $("#tipDiv").dialog("open");
                    }

                });
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
//权限对话框
var per=null;
$("#perDialog").dialog({
    autoOpen: false,
    width: 400,
    modal:true,
    closeOnEscape: false,
    dialogClass: "no-close",
    buttons: [
        {
            text: "确定-Ok",
            click: function() {
                $.ajax({
                    type: "POST",
                    url: "/Manage/updateExtras",
                    dataType: "json",
                    data:{"username":per.parent().parent().find("td").eq(0).html()
                    },
                    success: function (res) {
                        if(res.backInfo="update success"){
                            $("#tipDiv").find("p").html("操作成功！<br>Operation success！");
                            $("#tipDiv").dialog("open");
                        }else{
                            location.href = location.href;
                        }
                    },
                    error: function (e) {
                        location.href = location.href;
                    }

                });
                $(this).dialog( "close" );
            }
        },
        {
            text: "取消-Cancel",
            click: function() {
            	location.href = location.href;
                $(this).dialog( "close" );
            }
        }
    ]
});
//打开页面展示信息
$.ajax({
    type: "POST",
    url: "/Manage/backWareMan",
    dataType: "json",
    data: {
    },
    success: function (res) {
        for(var i = 0;i < res.allUser.length;i++){

            $("#tab").append("<tr class='t2'>" +
                "<td>"+res.allUser[i][0]+"</td>" +
                "<td>"+res.allUser[i][1]+"</td>" +
                "<td>"+res.allUser[i][2]+"</td>" +
                "<td>"+res.allUser[i][3]+"</td>" +
                "<td><input  class='titleExtra' title='查询出库货物 Querying history wares' type='checkbox'></td>"+
                "<td class='resBtn' type='button'><img class='reset' src='./img/reset.png' alt='重置-Reset'></td>"+
            "<td class='delBtn' type='button'><img class='delete' src='./img/delete.png' alt='删除-Delete'></td>" +"</tr>");
         if(res.allUser[i][4]=="1"){
        	
        	  $(".t2").eq(i).find("td").eq(4).find("input").prop("checked", true);
        }
        }
        $(".delBtn").on("click", function () {
            click = $(this);
            $("#delDialog").dialog( "open" );
            });
        $(".resBtn").click(function () {
               reset = $(this);
            $("#resDialog").dialog( "open" );
            });
        $(".titleExtra").change(function() {
            	per = $(this);
            $("#perDialog").dialog( "open" );
            });
        console.log(res);
            },
    error: function(e) {
        $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
        $("#tipDiv").dialog("open");
    }
});
//添加功能
$("#btn1").click(function() {
    var n;
    if ($("#Empno").val() == "") {
        $("#tipDiv").find("p").html("请输入工号！<br>Please enter Empno！");
        $("#tipDiv").dialog("open");
    }
    else if ($("#Passwd").val() == "") {
        $("#tipDiv").find("p").html("请输入初始密码！<br>Please enter Initial Password！");
        $("#tipDiv").dialog("open");
    }
    else if ($("#Name").val() == "") {
        $("#tipDiv").find("p").html("请输入姓名！<br>Please enter Name！");
        $("#tipDiv").dialog("open");
    }
    else if ($("#Phone").val() == "") {
        $("#tipDiv").find("p").html("请输入电话！<br>Please enter Phone！");
        $("#tipDiv").dialog("open");
    }
    else {
        //测试
        //
        //$("#tab").append("<tr class='t2'>" +
        //    "<td>" + $("#Empno").val() + "</td>" +
        //    "<td>" + $("#Passwd").val() + "</td>" +
        //    "<td>" + $("#Name").val() + "</td>" +
        //    "<td>" + $("#Phone").val() + "</td>" +
        //    "<td><input  class='titleExtra' title='查询出库货物 Querying history wares' type='checkbox'></td>" +
        //    "<td class='resBtn' type='button'><img class='reset' src='./img/reset.png' alt='重置-Reset'></td>" +
        //    "<td class='delBtn' type='button'><img class='delete' src='./img/delete.png' alt='删除-Delete'></td>" + "</tr>");
        //$(".delBtn").on("click", function () {
        //    $(this).parent().remove();
        //});
        $.ajax({
            type: "POST",
            url: "/Manage/addUSer",
            dataType: "json",
            data: {
                "workNumber": $("#Empno").val(),
                "initPassWord": $("#Passwd").val(),
                "name": $("#Name").val(),
                "extras":"0",
                "phone": $("#Phone").val(),
                "userType":"1"
            },
            success: function (res) {
                /*$("#tab").append("<tr class='t2'>" +
                    "<td>" + $("#Empno").val() + "</td>" +
                    "<td>" + $("#Passwd").val() + "</td>" +
                    "<td>" + $("#Name").val() + "</td>" +
                    "<td>" + $("#Phone").val() + "</td>" +
                    "<td><input  class='titleExtra' title='查询出库货物 Querying history wares' type='checkbox'></td>" +
                    "<td class='resBtn' type='button'><img class='reset' src='./img/reset.png' alt='重置-Reset'></td>" +
                    "<td class='delBtn' type='button'><img class='delete' src='./img/delete.png' alt='删除-Delete'></td>" + "</tr>");*/
            	if(res.backInfo == "Exist"){
                    $("#exDialog").dialog( "open" );
            	}else{
            		location.href=location.href;
            	}
             },
             error: function (e) {
                 $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                 $("#tipDiv").dialog("open");
             }
    });

        }
    });
//$(".delBtn").on("click", function () {
//    $(this).parent().remove();});
//重置接口的交互
$("#Phone").keydown(function(event) {
    if (event.keyCode == "13") {//keyCode=13是回车键
        $('#btn1').click();
    }
});

$("#exDialog").dialog({
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