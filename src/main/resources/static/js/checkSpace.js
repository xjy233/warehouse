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
//        +"</tr>")
//}
//打开界面展示

$("#printAll").click(function(){
	window.open("./changePrint.html");
});

$.ajax({
    type: "POST",
    url: "/AllCheck/backChangePos",
    dataType: "json",
    data: {
    },
    success: function (res) {
        for(var i = 0;i < res.allPac.length;i++){
            var n = i+1;
            var str=res.allPac[i][0];
            var x=str.substring(0,2);
            var y=res.allPac[i][0].length;
            var z=str.substring(2,y);
            $("#tab").append("<tr class='t2'>" +
                "<td>"+n+"</td>" +
                "<td>"+x+"-"+z+"</td>" +
                "<td>"+res.allPac[i][1]+"</td>"+
                +"</tr>");

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