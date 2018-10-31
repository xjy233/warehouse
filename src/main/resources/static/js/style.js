/**
 * Created by jessicababy on 2017/4/13.
 */
//打开页面展示信息
var click=null;
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
                $.ajax({type:"POST",
                    url: "/Manage/deleteStyle",
                    dataType: "json",
                    data:{ "provider":click.parent().find("td").eq(1).html(), "style":click.parent().find("td").eq(2).html()},
                    success:function(res){
                        if(res.backInfo=="delete success"){
//                         $(this).parent().remove();
                            location.href=location.href;
                        }
                    },
                    error: function(e) {
                        console.log("styleError:"+e);
                    }
                }) ;
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

$.ajax({
    type: "POST",
    url: "/Manage/backAllProviders",
    dataType: "json",
    data: {
    },
    success: function (res) {
        for(var i = 0;i < res.listProviders.length;i++){
            var n = i+1;
            $("#tab").append("<tr class='t2'>" +
                "<td>"+n+"</td>" +
                "<td>"+res.listProviders[i][0]+"</td>" +
                "<td>"+res.listProviders[i][1]+"</td>"+
                "<td class='delBtn' type='button'><img class='delete' src='./img/delete.png' alt='删除-Delete'></td>" +"</tr>")
        }
        $(".delBtn").on("click",function(){
        	click = $(this);
            $("#delDialog").dialog( "open" );
            });
        $("#tab tr:odd").css("background-color", "white");
        $("#tab tr:even").css("background-color", "#f3f3f3");
        $("#t1").css("background-color","#ecf6fd");
        console.log(res);
    },
    error: function(e) {
        console.log("supplierError:"+e);
    }
});
//打开页面获取select里的供货商
$.ajax({
    type: "POST",
    url: "/backProviderInfo",
    dataType: "json",
    data: {
    },
    success: function (res) {
//			selectList = JSON.parse(res);
        for(var i = 0;i < res.provider.length;i++) {
            $(".supplierSelect").append("<option>"+res.provider[i]+"</option>")
        }
        console.log(res);
    },
    error: function(e) {
        console.log("supplierError:"+e);
    }
});

$(".supplierSelect").change(function () {
    if($(this).val()=="null"){
        location.href=location.href;
    }else{
    $.ajax({
        type:"POST",
        url:"/Manage/backProviders",
        dataType:"json",
        data:{
          "provider":$(".supplierSelect").val()
        },
        success:function(res){
            $(".t2").remove();
            for(var i = 0;i < res.listProviders.length;i++){
                var n = i+1;
                $("#tab").append("<tr class='t2'>" +
                    "<td>"+n+"</td>" +
                    "<td>"+res.listProviders[i][0]+"</td>" +
                    "<td>"+res.listProviders[i][1]+"</td>"+
                    "<td class='delBtn' type='button'><img class='delete' src='./img/delete.png' alt='删除-Delete'></td>" +"</tr>")
            }
            $(".delBtn").on("click",function(){
                click = $(this);
                $("#delDialog").dialog( "open" );
            });
            $("#tab tr:odd").css("background-color", "white");
            $("#tab tr:even").css("background-color", "#f3f3f3");
            $("#t1").css("background-color","#ecf6fd");
            console.log(res);
        },
        error: function(e) {
            console.log("styleError:"+e);
        }
    })}
});
////控制显示
//var supSelect = false;
//$(".supplierSelect").change(function(){
//    if($(this).val() != ""){
//        supSelect = true;
//        $("#supplierCh").attr("disabled",true);
//        $("#supplier").attr("disabled",true);
//    }else{
//        supSelect = false;
//        $("#supplierCh").attr("disabled",false);
//        $("#supplier").attr("disabled",false);
//    }
//});

//添加
$("#btn1").click(function(){
    var str=$("#styleCh").val();
    var result=str.replace(/(^\s+)|(\s+$)/g,"");//去掉前后空格
    result=result.replace(/(^\s{2,})|(\s{2,}$)|(\s{2,})/g," ");
    var str2=$("#style").val();
    var result2=str2.replace(/(^\s+)|(\s+$)/g,"");//去掉前后空格
    result2=result2.replace(/(^\s{2,})|(\s{2,}$)|(\s{2,})/g," ");
    result2=result2.toUpperCase();
    //alert(result2);
    if($(".supplierSelect").val()=="null"){
        $("#empDialog").dialog( "open" );
    }else if(result==""){
        $("#empDialog").dialog( "open" );
    }else if(result2==""){
        $("#empDialog").dialog( "open" );
    }
    else {
        var n = 1;
        $.ajax({
            type: "POST",
            url: "/Manage/addStyle",
            dataType: "json",
            data: {
                "provider": $(".supplierSelect").val(),
                "style":result+"/"+result2
            },
            success: function (res) {
                if (res.backInfo == "add success") {
                    location.href = location.href;
                }
                else if (res.backInfo == "Exist") {
                    $("#exDialog").dialog( "open" );
                }
            },
            error: function (e) {
                console.log("styleError:" + e);
            }
        })
    }
});
$("#style").keydown(function(event) {
    if (event.keyCode == "13") {//keyCode=13是回车键
        $('#btn1').click();
    }
});
$("#empDialog").dialog({
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
