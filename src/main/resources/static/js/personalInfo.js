/**
 * Created by jessicababy on 2017/4/17.
 */
//打开页面展示信息
$(function () {
    $("#tipDiv").dialog({
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
    $.ajax({
        type: "POST",
        url: "/Manage/backSupreInfo",
        dataType: "json",
        data: {
        },
        success: function (res) {
            //$("#account").val(res.backInfo[0]);
            $("#email").val(res.backInfo[1]);
            console.log(res);
        },
        error: function(e) {
            $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
            $("#tipDiv").dialog("open");
        }
    });
    //点击保存
    $("#save").click(function(){
        if($("#NewP").val()==$("#NewPC").val()){
        if($("#NewP").val()==''){
            $.ajax({
                type: "POST",
                url: "/Manage/superChangePassword",
                dataType: "json",
                data: {
                    "email":$("#email").val(),
                    "oldPassword":$("#CurrentP").val(),
                    "newPassword":$("#CurrentP").val()
                },
                success: function (res) {
                    if(res.backInfo=="update success")
                    { $("#sucDialog").dialog( "open" );}
                    else if(res.backInfo=="password error"){$("#errDialog").dialog( "open" );}
                },
                error: function (e) {
                    $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                    $("#tipDiv").dialog("open");
                }
            })
        }else if($("#NewP").val()!=''){
            var v_pw=$("#NewP").val();
            if(v_pw.length < 8){
                $("#eightDialog").dialog( "open" );
                return false;
            }
            var patrn_shuzi=/^[0-9]$/;
            var patrn_zimu=/^[a-z]|[A-Z]$/;
            var patrn_teshu=/^[^A-Za-z0-9]$/;
            var flag=0;
            var s = v_pw.split('');
            for(var i=0;i<s.length;i++){
                if (patrn_shuzi.exec(s[i])) {
                    flag = flag+1;
                    break;
                }
            }
            for(var i=0;i<s.length;i++){
                if (patrn_zimu.exec(s[i])) {
                    flag = flag+1;
                    break;
                }
            }
            for(var i=0;i<s.length;i++){
                if (patrn_teshu.exec(s[i])) {
                    flag = flag+1;
                    break;
                }
            }
            if (flag != 3) {
                $("#containDialog").dialog( "open" );
                return false;
            }
        $.ajax({
            type: "POST",
            url: "/Manage/superChangePassword",
            dataType: "json",
            data: {
                "email":$("#email").val(),
                "oldPassword":$("#CurrentP").val(),
                "newPassword":$("#NewP").val()
            },
            success: function (res) {
              if(res.backInfo=="update success")
              {$("#sucDialog").dialog( "open" );}
              else if(res.backInfo=="password error"){$("#errDialog").dialog( "open" );}
            },
            error: function (e) {
                $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                $("#tipDiv").dialog("open");
            }
        })}}
        else{
            $("#matchDialog").dialog( "open" );
        }
    });
    $("#NewPC").keydown(function(event) {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $('#save').click();
        }
    });
    //点击取消
    $("#Cancle").click(function(){
        location.href = "./personalInfo.html";
    });
    $("#sucDialog").dialog({
        autoOpen: false,
        width: 400,
        modal: true,
        buttons: [
            {
                text: "确定-Ok",
                click: function () {
                    location.href = "./personalInfo.html";
                    $(this).dialog( "close" );
                }
            }
        ]
    });
    $("#errDialog").dialog({
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
    $("#eightDialog").dialog({
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
    $("#containDialog").dialog({
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
    $("#matchDialog").dialog({
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

    try{
        var thisURL = document.URL;
        var param = thisURL.split("?")[1];
        if(param == ""){
            $("#tipDiv").find("p").html("请及时修改初始密码并填写邮箱！<br>Please modify initial password and add email！");
            $("#tipDiv").dialog("open");
        }
    }catch (e){
        console.log(e);
    }
});