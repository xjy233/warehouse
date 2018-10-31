
 // Created by jessicababy on 2017/4/16.
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
                     url: "/Manage/deleteColour",
                     dataType: "json",
                     data:{ "colour":click.parent().find("td").eq(1).html()},
                     success:function(res){
                         if(res.backInfo=="delete success")
//                    $(this).parent().remove();
                             location.href=location.href;
                     },
                     error: function(e) {
                         console.log("styleError:"+e);
                     }
                 })
                 ;
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
//打开页面展示信息
$.ajax({
    type: "POST",
    url: "/backColourInfo",
    dataType: "json",
    data: {
    },
    success: function (res) {
        for(var i = 0;i < res.colour.length;i++){
            var n = i+1;
            $("#tab").append("<tr class='t2'>" +
                "<td>"+n+"</td>" +
                "<td>"+res.colour[i]+"</td>" +
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
//添加功能
 $("#addBtn").click(function(){
    var n;
    var str=$("#colorCh").val();
    var result=str.replace(/(^\s+)|(\s+$)/g,"");//去掉前后空格
    result=result.replace(/(^\s{2,})|(\s{2,}$)|(\s{2,})/g," ");
    var str2=$("#color").val();
    var result2=str2.replace(/(^\s+)|(\s+$)/g,"");//去掉前后空格
    result2=result2.replace(/(^\s{2,})|(\s{2,}$)|(\s{2,})/g," ");
    result2=result2.toUpperCase();
    if(result=="")
    { $("#chDialog").dialog( "open" );}
    else if(result2=="")
    { $("#enDialog").dialog( "open" );}
    else {
        //测试
        //n=$(".t2").length+1;
        //$("#tab").append("<tr class='t2'>" +
        //    "<td>" + n  + "</td>" +
        //    "<td>" + $("#colorCh").val() + $("#color").val() + "</td>" +
        //    "<td class='delBtn' type='button'><img class='delete' src='./img/delete.png' alt='删除-Delete'></td>" +"</tr>");
        //$(".delBtn").on("click",function(){
        //    $(this).parent().remove();
        //});
        $.ajax({
            type: "POST",
            url: "/Manage/addColour",
            dataType: "json",
            data: {
                "colour":result+"/"+result2
            },
            success:function (res){
                if(res.backInfo=="add success"){
                	location.href=location.href;
                    /*n=$(".t2").length+1;
                    $("#tab").append("<tr class='t2'>" +
                        "<td>"+ n+"</td>" +
                        "<td>"+$("#supplierCh").val()+$("#supplier").val()+"</td>" +
                        "<td class='delBtn' type='button'><img class='delete' src='./img/delete.png' alt='删除-Delete'></td>" +"</tr>");*/}
                else if(res.backInfo=="Exist"){
                    $("#exDialog").dialog( "open" );
                }
                
            },
            error: function(e) {
                console.log("styleError:"+e);
            }
        })
    }});
 $("#color").keydown(function(event) {
     if (event.keyCode == "13") {//keyCode=13是回车键
         $('#addBtn').click();
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
 $("#enDialog").dialog({
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
 $("#chDialog").dialog({
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
//$(".delBtn").on("click", function () {
//    $(this).parent().remove();});
//$(".delBtn").on("click",function(){
//    if(confirm("确认操作？")){
//        $(this).parent().remove();}
//});