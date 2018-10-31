/**
 * Created by jessicababy on 2017/4/13.
 */
//测试
//var res = [
//    [1,2],
//    [11,12]
//];
//for(var i = 0;i < res.length;i++){
//    var n = i+1;
//    $("#tab").append("<tr class='t2'>" +
//        "<td>"+n+"</td>" +
//        "<td>"+res[i][0]+"</td>" +
//        "<td>"+res[i][1]+"</td>"+
//        "<td class='detailBtn' type='button'><a href='./shelfDetails.html'><img class='img' src='./img/detail.png' alt='详情-Detail'></td>"+
//        "<td class='deleteBtn' type='button'><img class='img' src='./img/print.png' alt='打印-Print'></td>"  +"</tr>");
//}
//打开页面获得数据
$.ajax({
    type: "POST",
    url: "/backShelfUsed",
    dataType: "json",
    data: {
    },
    success: function (res) {
        for(var i = 0;i < res.listUsed.length;i++){
            var n = i+1;
            $("#tab").append("<tr class='t2'>" +
                "<td>"+n+"</td>" +
                "<td>"+res.listUsed[i][0]+"</td>" +
                "<td>"+res.listUsed[i][1]+"/"+res.listUsed[i][2]+"</td>"+
                "<td class='detailBtn' type='button'><img class='img' src='./img/detail.png' alt='详情-Detail'></td>"+
                "<td class='deleteBtn' type='button'><img class='img' src='./img/print.png' alt='打印-Print'></td>"  +"</tr>");
        }
        $(".detailBtn").click(function(){
            var n=$(this).parent().find("td").eq(1).text();
            location.href="./shelfDetails.html?position="+n;
        });
        $(".deleteBtn").click(function(){
            var n=$(this).parent().find("td").eq(1).text();
            window.open("./allPrint.html?shelfNum="+n);
        });

        $("#tab tr:odd").css("background-color", "white");
        $("#tab tr:even").css("background-color", "#f3f3f3");
        $("#t1").css("background-color","#ecf6fd");
        console.log(res);
    },
    error: function(e) {
        $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
        $("#tipDiv").dialog("open");
    }
});
//详情跳转
