/**
 * Created by jessicababy on 2017/4/6.
 */

function isJson(obj){
    try {
        JSON.parse(obj);
    } catch (e) {
        return obj;
    }
    return JSON.parse(obj);
}
$(function () {
    $( "#menu" ).menu();

    $( "#logoutDiv" ).dialog({
        autoOpen: false,
        width: 400,
        modal:true,
        buttons: [
            {
                text: "确定-Ok",
                click: function() {
                    /*$.ajax({
                        type: "POST",
                        url: "/logout",
                        data: {
                        },
                        success: function (res) {
                        	
                        },
                        error: function (e) {
                        }
                    });*/
                	location.href = "/logout";
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

    $(".li").eq(0).click(function(){
        location.href="./home.html";
    });

    $(".li").eq(2).click(function(){
        location.href="./inbound.html";
    });

    $(".li").eq(5).parent().find("li").eq(7).click(function(){
        location.href="./shelfCapacity.html";
    });

    $(".li").eq(1).parent().find("li").eq(0).click(function(){
        location.href="./query.html";
    });
	
	  $(".li").eq(1).parent().find("li").eq(1).click(function(){
        location.href="./in&OutboundQuery.html";
    });
	
    $(".li").eq(3).click(function(){
        location.href="./outbound.html";
    });
    $(".li").eq(4).parent().find("li").eq(0).click(function(){
        location.href="./checkShelf.html";
    });

    $(".li").eq(4).parent().find("li").eq(1).click(function(){
        location.href="./checkSpace.html";
    });

    $(".li").eq(5).parent().find("li").eq(1).click(function(){
        location.href="./suplManage.html";
    });

    $(".li").eq(5).parent().find("li").eq(2).click(function(){
        location.href="./styleManage.html";
    });

    $(".li").eq(5).parent().find("li").eq(3).click(function(){
        location.href="./colorManage.html";
    });

    $(".li").eq(5).parent().find("li").eq(4).click(function(){
        location.href="./sizeManage.html";
    });

    $(".li").eq(5).parent().find("li").eq(6).click(function(){
        location.href="./shelfManage.html";
    });

    $(".li").eq(5).parent().find("li").eq(9).click(function(){
        location.href="./keeper.html";
    });

    $(".li").eq(5).parent().find("li").eq(10).click(function(){
        location.href="./normal.html";
    });
    
    /*$("#tab tr:odd").css("background-color", "white");
    $("#tab tr:even").css("background-color", "#f3f3f3");
    $("#t1").css("background-color","#ecf6fd");
    $("#tab2 tr:odd").css("background-color", "white");
    $("#tab2 tr:even").css("background-color", "#f3f3f3");
    $("#t2").css("background-color","#ecf6fd");*/

    $.ajax({
        type: "POST",
        url: "/getUserInfomation",
        dataType: "json",
        data: {
        },
        success: function (res) {
        	console.log(res);
            $("#user").after($("<span style='color:white;position: relative;top: 0.5rem;'>您好，"+res.UserInfomation.name+" - Hello "+res.UserInfomation.name+"</span>").append($('#user').clone()));
            $("#titleDiv").find("img").eq(0).remove();
            $("#user").after("<img id='logout' src='./img/logout.png'/>");
            if(res.UserInfomation.role == "0"){
                $(".li").eq(4).parent().remove();
                $(".li").eq(3).parent().remove();
                $(".li").eq(2).parent().remove();
            }else if(res.UserInfomation.role == "1"){
                $(".li").eq(5).parent().remove();
            }else{
                $(".li").eq(5).parent().remove();
                $(".li").eq(4).parent().remove();
                $(".li").eq(3).parent().remove();
                $(".li").eq(2).parent().remove();
                $(".li").eq(1).parent().find("li").eq(1).remove();
            }

            if(res.UserInfomation.extras == 0){
                $(".extraAuthority").remove();
            }

            if(res.UserInfomation.role == 0) {
                $("#user").click(function () {
                    location.href = "./personalInfo.html";
                })
            }else{
                $("#user").click(function () {
                    location.href = "./userInfo.html";
                })
            }

            $("#logout").click(function () {
                    $( "#logoutDiv" ).dialog("open");
            });
            
            var localHref = location.href;
            var pathName = location.pathname;
            var pos = localHref.indexOf(pathName);
            var path = localHref.substring(0,pos);
            if(res.UserInfomation.role == 0 && res.UserInfomation.ifUpdateEm == true && location.href != path+"/personalInfo.html?"){
            	location.href = "./personalInfo.html?"
            }
            if(res.UserInfomation.ifUpdatePw == true && res.UserInfomation.role == 0 && location.href != path+"/personalInfo.html?"){
            	location.href = "./personalInfo.html?"
            }
            if(res.UserInfomation.role != 0 && res.UserInfomation.ifUpdatePw == true && location.href != path+"/userInfo.html?"){
            	location.href = "./userInfo.html?"
            }

            $(".extraAuthority").css("display","inline");
            $("html").css("display","block");
            $("#menu").css("display","block");

        },
        error: function (e) {
            $(".extraAuthority").css("display","inline");
            $("html").css("display","block");
            $("#menu").css("display","block");
        }
    });

});


