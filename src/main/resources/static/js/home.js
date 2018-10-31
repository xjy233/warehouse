/**
 * Created by lixiwei on 2017/4/2.
 */


$(function () {
	var beginDate = null;
	var endDate = null;
	var overload = false;
	var xDate = [];
	var chartData1 =[{
		name: '出库-Outbound ',
		data: []
	}, {
		name: '入库-Inbound',
		data: []
	}];
	var chartData2 =[{
		name: '出库-Outbound',
		data: []
	}, {
		name: '入库-Inbound',
		data: [],
		color: "grey"
	}];
	var usedData = null;
	var restData = null;
	var year = null;

	$("#datePicker1").datepicker({ dateFormat: 'yy-mm-dd' });
	$("#datePicker2").datepicker({ dateFormat: 'yy-mm-dd' });

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

	$.ajax({
		type: "POST",
		url: "/home/backDefaultTimeSection",
		dataType: "json",
		data: {
		},
		success: function (res) {
			console.log("time:");
			console.log(res);
			var today = res.areaspline.XDate;
			var data = null;
			data = res.areaspline.OutDay;
			chartData1[0].data = data.reverse();
			data = res.areaspline.InDay;
			chartData1[1].data = data.reverse();

			if(res.myVolume == 0){
				usedData = 0;
			}else {
				usedData = res.myOccupation / res.myVolume * 100;
				usedData = parseFloat(usedData.toFixed(2));
			}

			data = res.bar.OutMonth;
			chartData2[0].data = data.reverse();
			data = res.bar.InMonth;
			chartData2[1].data = data.reverse();

			console.log(chartData2);

			if(res.bar.thisyear) {
				year = res.bar.thisyear;
			}else{
				year = new Date(today).getFullYear();
			}

			xDate = [];
			xDate.length = 12;
			xDate[11] = today;
			for(var i = 1;i < 12;i++){
				var myDate = new Date(today);
				myDate.setDate(myDate.getDate() - i);
				var str = "" + myDate.getFullYear() + "-";
				str += (myDate.getMonth()+1) + "-";
				str += myDate.getDate();
				xDate[11-i] = str;
			}
			$("#areaSplineDiv").empty();
			$("#pieChartDiv").empty();
			$("#pieOverloadDiv").empty();
			$("#barChartDiv").empty();
			if(1){
				$("#areaSplineDiv").highcharts({
					chart: {
						type: 'areaspline'
					},
					title: {
						text: '每天入库/出库货物数量-The Chart of Warehouse Inbound/outbound Wares Per Day'
					},
					legend: {
						layout: 'vertical',
						align: 'left',
						verticalAlign: 'top',
						x: 100,
						y: 30,
						floating: true,
						borderWidth: 1,
						backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
					},
					xAxis: {
						categories: xDate
					},
					yAxis: {
						title: {
							text: "货物件数-The Wares'Num"
						}
					},
					tooltip: {
						shared: true,
						valueSuffix: ' 件-Wares'
					},
					credits: {
						enabled: false
					},
					plotOptions: {
						areaspline: {
							fillOpacity: 0.5
						}
					},
					series: chartData1
				});

				if(usedData > 100){
					usedData = usedData - 100;
					restData = 100 - usedData;
					overload = true;
					var chart1 = null;
					$('#pieChartDiv').empty();
					$('#pieOverloadDiv').empty();
					$('#pieChartDiv').highcharts({
						chart: {
							plotBackgroundColor: null,
							plotBorderWidth: null,
							plotShadow: false,
							marginLeft: 260
						},
						title: {
							floating:true,
							text: (usedData+100)+"%",
							style: {"fontSize":"1.6rem"},
							x: 125,
							y: 230
						},
						subtitle: {
							text: '当前库存量（'+res.myVolume+'）使用情况-The Current Warehouse Usage('+res.myOccupation+'/'+res.myVolume+')',
							style: { "color": "black", "font-size": "1.1rem" }
						},
						tooltip: {
							pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
						},
                        exporting:{
                            enabled: false
						},
						credits: {
							enabled: false
						},
						plotOptions: {
							pie: {
								allowPointSelect: false,
								cursor: 'pointer',
								dataLabels: {
									enabled: false,
									distance: -15,
									format: '<b>{point.name}</b>: {point.percentage:.1f} %',
									style: {
										color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
									}
								},
								point: {
									events: {
										mouseOver: function(e) {  // 鼠标滑过时动态更新标题
											chart.setTitle({
												text: e.target.name+ '\t'+ e.target.y + ' %'
											});
										},
										mouseOut: function(e) {  // 鼠标滑过时动态更新标题
											chart.setTitle({
												text: (usedData+100)+"%"
											});
										}
									}
								}
							}
						},
						series: [{
							type: 'pie',
							innerSize: '80%',
							name: '标准占比',
							data: [
								{
									name: '已使用-Used',
									y: 100,
									sliced: true,
									selected: true,
									color: 'orange'
								},
								{
									name: '剩余-Rest',
									y: 0,
									color: 'green'
								}
							]
						}]
					}, function(c) {
						chart = c;
					});
					$('#pieOverloadDiv').highcharts({
						chart: {
							plotBackgroundColor: null,
							plotBorderWidth: null,
							plotShadow: false,
							marginRight: 150
						},
						title: {
							floating:true,
							text: usedData+"%",
							x: -65,
							y: 190,
							style: { "font-size": "1.6rem" }
						},
						tooltip: {
							pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
						},
						credits: {
							enabled: false
						},
						exporting: {
							enabled:false
						},
						plotOptions: {
							pie: {
								allowPointSelect: false,
								cursor: 'pointer',
								dataLabels: {
									enabled: false,
									distance: -15,
									format: '<b>{point.name}</b>: {point.percentage:.1f} %',
									style: {
										color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
									}
								},
								point: {
									events: {
										mouseOver: function(e) {  // 鼠标滑过时动态更新标题
											chart1.setTitle({
												text: e.target.name+ '\t'+ e.target.y + ' %'
											});
										},
										mouseOut: function(e) {  // 鼠标滑过时动态更新标题
											chart1.setTitle({
												text: usedData+"%",
											});
										}
									}
								}
							}
						},
						series: [{
							type: 'pie',
							innerSize: '80%',
							name: '标准占比',
							data: [
								{
									name: '过载-Overload',
									y: usedData,
									sliced: true,
									selected: true,
									color: 'red'
								},
								{
									name: '剩余-Rest',
									y: restData,
									color: 'Lavender'
								}
							]
						}]
					}, function(c) {
						chart1 = c;
					});
				}else{
					restData = 100 - usedData;
					var chart = null;
					$('#pieChartDiv').empty();
					$('#pieOverloadDiv').remove();
					$('#pieChartDiv').highcharts({
						chart: {
							plotBackgroundColor: null,
							plotBorderWidth: null,
							plotShadow: false
						},
						title: {
							floating:true,
							text: usedData+"%",
							style: { "font-size": "2rem" },
							y: 220
						},
						subtitle: {
							text: '当前库存量（'+res.myVolume+'）使用情况-The Current Warehouse Usage('+res.myOccupation+'/'+res.myVolume+')',
							style: { "color": "black", "font-size": "1.1rem" }
						},
						tooltip: {
							pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
						},
						credits: {
							enabled: false
						},
						plotOptions: {
							pie: {
								allowPointSelect: false,
								cursor: 'pointer',
								dataLabels: {
									enabled: false,
									distance: -15,
									format: '<b>{point.name}</b>: {point.percentage:.1f} %',
									style: {
										color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
									}
								},
								point: {
									events: {
										mouseOver: function(e) {  // 鼠标滑过时动态更新标题
											chart.setTitle({
												text: e.target.name+ '\t'+ e.target.y + ' %'
											});
										},
										mouseOut: function(e) {  // 鼠标滑过时动态更新标题
											chart.setTitle({
												text: usedData+"%"
											});
										}
									}
								}
							}
						},
						series: [{
							type: 'pie',
							innerSize: '80%',
							name: '标准占比',
							data: [
								{
									name: '已使用-Used',
									y: usedData,
									sliced: true,
									selected: true,
									color: 'orange'
								},
								{
									name: '剩余-Rest',
									y: restData,
									color: 'green'
								}
							]
						}]
					}, function(c) {
						chart = c;
					});
				}

				$("#barChartDiv").highcharts({
					chart: {
						type: 'bar'
					},
					title: {
						text: year + "年每月仓储出入库统计-The Chart of Inbound and Outbound Wares'Num. Per Month In " + year
					},
					xAxis: {
						categories: ['十二月-Dec.', '十一月-Nov.', '十月-Oct.', '九月-Sept.', '八月-Aug.', '七月-July', '六月-June', '五月-May', '四月-Apr.', '三月-Mar', '二月-Feb.', '一月-Jan.'],
						title: {
							text: null
						}
					},
					yAxis: {
						min: 0,
						title: {
							text: "货物件数-The Wares'Num",
							align: 'high'
						},
						labels: {
							overflow: 'justify'
						}
					},
					tooltip: {
						valueSuffix: ' 件(Wares)'
					},
					plotOptions: {
						bar: {
							dataLabels: {
								enabled: true
							}
						}
					},
					legend: {
						layout: 'vertical',
						align: 'right',
						verticalAlign: 'top',
						x: -5,
						y: 30,
						floating: true,
						borderWidth: 1,
						backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
						shadow: true
					},
					credits: {
						enabled: false
					},
					series: chartData2
				});

				var lineXDate = [];
                var weights = [];
                var average = 0;
                for (var i = 1; i < 101; i++) {
                    lineXDate.push(i);
                }

                $('#lineChartDiv').highcharts({
                    chart: {
                        type: 'line'
                    },
                    title: {
                        text: "Model No.的历史重量-Model No.' Weight History"
                    },
                    subtitle: {
                        text: '最近100包（100件/包）: latest 100 packages(100 pieces of wares per package)'
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: lineXDate
					},
                    yAxis: {
                        title: {
                            text: '重量-Weight'
                        }
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true // 开启数据标签
                            },
                            enableMouseTracking: false // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                        }
                    },
                    series: [{
                        name: '平均重量-Average Weight: ' + average + 'kg',
                        data: weights
                    }]
                });
			}
		},
		error: function(e){
			console.log("timeError:"+e);
			if(1){
				var xDate = [
				 "2017-3-1",
				 "2017-3-2",
				 "2017-3-3",
				 "2017-3-4",
				 "2017-3-5",
				 "2017-3-6",
				 "2017-3-7",
				 "2017-3-8",
				 "2017-3-9",
				 "2017-3-10",
				 "2017-3-11",
				 "2017-3-12"
				 ];
				var chartData1 =[{
					name: '出库-Outbound ',
					data: [30, 40, 30, 50, 40, 100, 120, 50, 60, 80, 90, 200]
				}, {
					name: '入库-Inbound',
					data: [10, 30, 40, 30, 30, 50, 40, 60, 100, 120, 50, 10]
				}];
				var chartData2 =[{
					name: '出库-Outbound',
					data: [1230, 4321, 2512, 6670, 1320, 4322, 2513, 1324, 4325, 2516, 6671, 1322],
				}, {
					name: '入库-Inbound',
					data: [1333, 1562, 6471, 4082, 1063, 1336, 1568, 6476, 4080, 1062, 1335, 1568],
					color: "grey",
				}];
				var res = {"myVolume":"1000","myOccupation":"233"};
				var usedData = 123.3333333;
				var restData = null;
				var year = 2016;
                usedData = parseFloat(usedData.toFixed(2));
                if(1){
                    $("#areaSplineDiv").highcharts({
                        chart: {
                            type: 'areaspline'
                        },
                        title: {
                            text: '每天入库/出库货物数量-The Chart of Warehouse Inbound/outbound Wares Per Day'
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'left',
                            verticalAlign: 'top',
                            x: 100,
                            y: 30,
                            floating: true,
                            borderWidth: 1,
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },
                        xAxis: {
                            categories: xDate
                        },
                        yAxis: {
                            title: {
                                text: "货物件数-The Wares'Num"
                            }
                        },
                        tooltip: {
                            shared: true,
                            valueSuffix: ' 件-Wares'
                        },
                        credits: {
                            enabled: false
                        },
                        plotOptions: {
                            areaspline: {
                                fillOpacity: 0.5
                            }
                        },
                        series: chartData1
                    });

                    if(usedData > 100){
                        usedData = usedData - 100;
                        restData = 100 - usedData;
                        overload = true;
                        var chart1 = null;
                        $('#pieChartDiv').empty();
                        $('#pieOverloadDiv').empty();
                        $('#pieChartDiv').highcharts({
                            chart: {
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false,
                                marginLeft: 260
                            },
                            title: {
                                floating:true,
                                text: (usedData+100)+"%",
                                style: {"fontSize":"1.6rem"},
                                x: 125,
                                y: 230
                            },
                            subtitle: {
                                text: '当前库存量（'+res.myVolume+'）使用情况-The Current Warehouse Usage('+res.myOccupation+'/'+res.myVolume+')',
                                style: { "color": "black", "font-size": "1.1rem" }
                            },
                            tooltip: {
                                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                            },
                            exporting:{
                                enabled: false
                            },
                            credits: {
                                enabled: false
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: false,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: false,
                                        distance: -15,
                                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                        style: {
                                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                        }
                                    },
                                    point: {
                                        events: {
                                            mouseOver: function(e) {  // 鼠标滑过时动态更新标题
                                                chart.setTitle({
                                                    text: e.target.name+ '\t'+ e.target.y + ' %'
                                                });
                                            },
                                            mouseOut: function(e) {  // 鼠标滑过时动态更新标题
                                                chart.setTitle({
                                                    text: (usedData+100)+"%"
                                                });
                                            }
                                        }
                                    }
                                }
                            },
                            series: [{
                                type: 'pie',
                                innerSize: '80%',
                                name: '标准占比',
                                data: [
                                    {
                                        name: '已使用-Used',
                                        y: 100,
                                        sliced: true,
                                        selected: true,
                                        color: 'orange'
                                    },
                                    {
                                        name: '剩余-Rest',
                                        y: 0,
                                        color: 'green'
                                    }
                                ]
                            }]
                        }, function(c) {
                            chart = c;
                        });
                        $('#pieOverloadDiv').highcharts({
                            chart: {
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false,
                                marginRight: 150
                            },
                            title: {
                                floating:true,
                                text: usedData+"%",
                                x: -65,
                                y: 190,
                                style: { "font-size": "1.6rem" }
                            },
                            tooltip: {
                                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                            },
                            credits: {
                                enabled: false
                            },
                            exporting: {
                                enabled:false
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: false,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: false,
                                        distance: -15,
                                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                        style: {
                                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                        }
                                    },
                                    point: {
                                        events: {
                                            mouseOver: function(e) {  // 鼠标滑过时动态更新标题
                                                chart1.setTitle({
                                                    text: e.target.name+ '\t'+ e.target.y + ' %'
                                                });
                                            },
                                            mouseOut: function(e) {  // 鼠标滑过时动态更新标题
                                                chart1.setTitle({
                                                    text: usedData+"%",
                                                });
                                            }
                                        }
                                    }
                                }
                            },
                            series: [{
                                type: 'pie',
                                innerSize: '80%',
                                name: '标准占比',
                                data: [
                                    {
                                        name: '过载-Overload',
                                        y: usedData,
                                        sliced: true,
                                        selected: true,
                                        color: 'red'
                                    },
                                    {
                                        name: '剩余-Rest',
                                        y: restData,
                                        color: 'Lavender'
                                    }
                                ]
                            }]
                        }, function(c) {
                            chart1 = c;
                        });
                    }else{
                        restData = 100 - usedData;
                        var chart = null;
                        $('#pieChartDiv').empty();
                        $('#pieOverloadDiv').remove();
                        $('#pieChartDiv').highcharts({
                            chart: {
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false
                            },
                            title: {
                                floating:true,
                                text: usedData+"%",
                                style: { "font-size": "2rem" },
                                y: 220
                            },
                            subtitle: {
                                text: '当前库存量（'+res.myVolume+'）使用情况-The Current Warehouse Usage('+res.myOccupation+'/'+res.myVolume+')',
                                style: { "color": "black", "font-size": "1.1rem" }
                            },
                            tooltip: {
                                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                            },
                            credits: {
                                enabled: false
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: false,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: false,
                                        distance: -15,
                                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                        style: {
                                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                        }
                                    },
                                    point: {
                                        events: {
                                            mouseOver: function(e) {  // 鼠标滑过时动态更新标题
                                                chart.setTitle({
                                                    text: e.target.name+ '\t'+ e.target.y + ' %'
                                                });
                                            },
                                            mouseOut: function(e) {  // 鼠标滑过时动态更新标题
                                                chart.setTitle({
                                                    text: usedData+"%"
                                                });
                                            }
                                        }
                                    }
                                }
                            },
                            series: [{
                                type: 'pie',
                                innerSize: '80%',
                                name: '标准占比',
                                data: [
                                    {
                                        name: '已使用-Used',
                                        y: usedData,
                                        sliced: true,
                                        selected: true,
                                        color: 'orange'
                                    },
                                    {
                                        name: '剩余-Rest',
                                        y: restData,
                                        color: 'green'
                                    }
                                ]
                            }]
                        }, function(c) {
                            chart = c;
                        });
                    }

                    $("#barChartDiv").highcharts({
                        chart: {
                            type: 'bar'
                        },
                        title: {
                            text: year + "年每月仓储出入库统计-The Chart of Inbound and Outbound Wares'Num. Per Month In " + year
                        },
                        xAxis: {
                            categories: ['十二月-Dec.', '十一月-Nov.', '十月-Oct.', '九月-Sept.', '八月-Aug.', '七月-July', '六月-June', '五月-May', '四月-Apr.', '三月-Mar', '二月-Feb.', '一月-Jan.'],
                            title: {
                                text: null
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: "货物件数-The Wares'Num",
                                align: 'high'
                            },
                            labels: {
                                overflow: 'justify'
                            }
                        },
                        tooltip: {
                            valueSuffix: ' 件(Wares)'
                        },
                        plotOptions: {
                            bar: {
                                dataLabels: {
                                    enabled: true
                                }
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'top',
                            x: -5,
                            y: 30,
                            floating: true,
                            borderWidth: 1,
                            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                            shadow: true
                        },
                        credits: {
                            enabled: false
                        },
                        series: chartData2
                    });

                    var lineXDate = [];
                    var weights = [];
                    var average = 0;
                    for (var i = 1; i < 101; i++) {
                        lineXDate.push(i);
                    }

                    $('#lineChartDiv').highcharts({
                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: "Model No.的历史重量-Model No.' Weight History"
                        },
                        subtitle: {
                            text: '最近100包（100件/包）: latest 100 packages(100 pieces of wares per package)'
                        },
                        credits: {
                            enabled: false
                        },
                        xAxis: {
                            categories: lineXDate
                        },
                        yAxis: {
                            title: {
                                text: '重量-Weight'
                            }
                        },
                        plotOptions: {
                            line: {
                                dataLabels: {
                                    enabled: true // 开启数据标签
                                },
                                enableMouseTracking: false // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                            }
                        },
                        series: [{
                            name: '平均重量-Average Weight: ' + average + 'kg',
                            data: weights
                        }]
                    });
                }
			}
		}
	});

    $.ajax({
        type: "POST",
        url: "/backModuleNum",
        dataType: "json",
        data: {
        },
        success: function (res) {
            console.log(res);
            for(var i = 0;i < res.moduleNum.length;i++) {
                $("#modelNoSelect").append("<option>"+res.moduleNum[i]+"</option>")
            }
        },
        error: function(e) {
        }
    });

	$(".button").click(function(){
		if($("#datePicker1").val() == "" || $("#datePicker2").val() == ""){
            $("#tipDiv").find("p").html("请选择查询时间起止！<br>Please select the beginning and end of query time!");
            $("#tipDiv").dialog("open");
		}else {
            if ($("#datePicker1").val() < $("#datePicker2").val()) {
                beginDate = $("#datePicker1").val();
                endDate = $("#datePicker2").val();
            } else {
                beginDate = $("#datePicker2").val();
                endDate = $("#datePicker1").val();
            }
            var range = (new Date(endDate) - new Date(beginDate)) / (1000 * 3600 * 24 * 365);
            console.log(range);
            if (range > 3) {
                $("#tipDiv").find("p").html("查询时间限制范围为三年（365*3）！<br>Query time is limited to three year（365*3）!");
                $("#tipDiv").dialog("open");
            } else {
                $("#loadingDialog").find("span").html("统计绘图中，请稍等-Chart is creating，please wait ......<br>注意：规模较大的图表可能需要较长时间，请耐心等候！<br>Warn: the chart may too large to create in short time, please wait patiently!");
                $("#loadingDialog").dialog("open");
                $('#shclDefault').shCircleLoader();
                $.ajax({
                    type: "POST",
                    url: "/home/backSelectTimeSection",
                    dataType: "json",
                    data: {
                        "beginDate": beginDate,
                        "endDate": endDate
                    },
                    success: function (res) {
                        $("#loadingDialog").dialog("close");
                        console.log("timeChange:");
                        console.log(res);
                        var data = null;
                        data = res.areaspline.OutDay;
                        chartData1[0].data = data.reverse();
                        data = res.areaspline.InDay;
                        chartData1[1].data = data.reverse();

                        if (res.myVolume == 0) {
                            usedData = 0;
                        } else {
                            usedData = res.myOccupation / res.myVolume * 100;
                            usedData = parseFloat(usedData.toFixed(2));
                        }

                        data = res.bar.OutMonth;
                        chartData2[0].data = data.reverse();
                        data = res.bar.InMonth;
                        chartData2[1].data = data.reverse();

                        if (res.bar.thisyear) {
                            year = res.bar.thisyear;
                        } else {
                            year = new Date(beginDate).getFullYear();
                        }
                        xDate = [];
                        xDate.length = (new Date(endDate) - new Date(beginDate)) / (1000 * 3600 * 24) + 1;
                        xDate[0] = beginDate;
                        for (var i = 1; i < (new Date(endDate) - new Date(beginDate)) / (1000 * 3600 * 24) + 1; i++) {
                            var myDate = new Date(beginDate);
                            myDate.setDate(myDate.getDate() + i);
                            var str = "" + myDate.getFullYear() + "-";
                            str += (myDate.getMonth() + 1) + "-";
                            str += myDate.getDate();
                            xDate[i] = str;
                        }

                        if (usedData > 100) {
                            overload = true;
                        } else {
                            overload = false;
                        }
                        $("#areaSplineDiv").empty();
                        $("#pieChartDiv").empty();
                        $("#pieOverloadDiv").empty();
                        $("#barChartDiv").empty();

                        if(1){
                            $("#areaSplineDiv").highcharts({
                                chart: {
                                    type: 'areaspline'
                                },
                                title: {
                                    text: '每天入库/出库货物数量-The Chart of Warehouse Inbound/outbound Wares Per Day'
                                },
                                legend: {
                                    layout: 'vertical',
                                    align: 'left',
                                    verticalAlign: 'top',
                                    x: 100,
                                    y: 30,
                                    floating: true,
                                    borderWidth: 1,
                                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                                },
                                xAxis: {
                                    categories: xDate
                                },
                                yAxis: {
                                    title: {
                                        text: "货物件数-The Wares'Num"
                                    }
                                },
                                tooltip: {
                                    shared: true,
                                    valueSuffix: ' 件-Wares'
                                },
                                credits: {
                                    enabled: false
                                },
                                plotOptions: {
                                    areaspline: {
                                        fillOpacity: 0.5
                                    }
                                },
                                series: chartData1
                            });

                            if(usedData > 100){
                                usedData = usedData - 100;
                                restData = 100 - usedData;
                                overload = true;
                                var chart1 = null;
                                $('#pieChartDiv').empty();
                                $('#pieOverloadDiv').empty();
                                $('#pieChartDiv').highcharts({
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        marginLeft: 260
                                    },
                                    title: {
                                        floating:true,
                                        text: (usedData+100)+"%",
                                        style: {"fontSize":"1.6rem"},
                                        x: 125,
                                        y: 230
                                    },
                                    subtitle: {
                                        text: '当前库存量（'+res.myVolume+'）使用情况-The Current Warehouse Usage('+res.myOccupation+'/'+res.myVolume+')',
                                        style: { "color": "black", "font-size": "1.1rem" }
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    exporting:{
                                        enabled: false
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: false,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: false,
                                                distance: -15,
                                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                                style: {
                                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                                }
                                            },
                                            point: {
                                                events: {
                                                    mouseOver: function(e) {  // 鼠标滑过时动态更新标题
                                                        chart.setTitle({
                                                            text: e.target.name+ '\t'+ e.target.y + ' %'
                                                        });
                                                    },
                                                    mouseOut: function(e) {  // 鼠标滑过时动态更新标题
                                                        chart.setTitle({
                                                            text: (usedData+100)+"%"
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    series: [{
                                        type: 'pie',
                                        innerSize: '80%',
                                        name: '标准占比',
                                        data: [
                                            {
                                                name: '已使用-Used',
                                                y: 100,
                                                sliced: true,
                                                selected: true,
                                                color: 'orange'
                                            },
                                            {
                                                name: '剩余-Rest',
                                                y: 0,
                                                color: 'green'
                                            }
                                        ]
                                    }]
                                }, function(c) {
                                    chart = c;
                                });
                                $('#pieOverloadDiv').highcharts({
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        marginRight: 150
                                    },
                                    title: {
                                        floating:true,
                                        text: usedData+"%",
                                        x: -65,
                                        y: 190,
                                        style: { "font-size": "1.6rem" }
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    exporting: {
                                        enabled:false
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: false,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: false,
                                                distance: -15,
                                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                                style: {
                                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                                }
                                            },
                                            point: {
                                                events: {
                                                    mouseOver: function(e) {  // 鼠标滑过时动态更新标题
                                                        chart1.setTitle({
                                                            text: e.target.name+ '\t'+ e.target.y + ' %'
                                                        });
                                                    },
                                                    mouseOut: function(e) {  // 鼠标滑过时动态更新标题
                                                        chart1.setTitle({
                                                            text: usedData+"%",
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    series: [{
                                        type: 'pie',
                                        innerSize: '80%',
                                        name: '标准占比',
                                        data: [
                                            {
                                                name: '过载-Overload',
                                                y: usedData,
                                                sliced: true,
                                                selected: true,
                                                color: 'red'
                                            },
                                            {
                                                name: '剩余-Rest',
                                                y: restData,
                                                color: 'Lavender'
                                            }
                                        ]
                                    }]
                                }, function(c) {
                                    chart1 = c;
                                });
                            }else{
                                restData = 100 - usedData;
                                var chart = null;
                                $('#pieChartDiv').empty();
                                $('#pieOverloadDiv').remove();
                                $('#pieChartDiv').highcharts({
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false
                                    },
                                    title: {
                                        floating:true,
                                        text: usedData+"%",
                                        style: { "font-size": "2rem" },
                                        y: 220
                                    },
                                    subtitle: {
                                        text: '当前库存量（'+res.myVolume+'）使用情况-The Current Warehouse Usage('+res.myOccupation+'/'+res.myVolume+')',
                                        style: { "color": "black", "font-size": "1.1rem" }
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: false,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: false,
                                                distance: -15,
                                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                                style: {
                                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                                }
                                            },
                                            point: {
                                                events: {
                                                    mouseOver: function(e) {  // 鼠标滑过时动态更新标题
                                                        chart.setTitle({
                                                            text: e.target.name+ '\t'+ e.target.y + ' %'
                                                        });
                                                    },
                                                    mouseOut: function(e) {  // 鼠标滑过时动态更新标题
                                                        chart.setTitle({
                                                            text: usedData+"%"
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    series: [{
                                        type: 'pie',
                                        innerSize: '80%',
                                        name: '标准占比',
                                        data: [
                                            {
                                                name: '已使用-Used',
                                                y: usedData,
                                                sliced: true,
                                                selected: true,
                                                color: 'orange'
                                            },
                                            {
                                                name: '剩余-Rest',
                                                y: restData,
                                                color: 'green'
                                            }
                                        ]
                                    }]
                                }, function(c) {
                                    chart = c;
                                });
                            }

                            $("#barChartDiv").highcharts({
                                chart: {
                                    type: 'bar'
                                },
                                title: {
                                    text: year + "年每月仓储出入库统计-The Chart of Inbound and Outbound Wares'Num. Per Month In " + year
                                },
                                xAxis: {
                                    categories: ['十二月-Dec.', '十一月-Nov.', '十月-Oct.', '九月-Sept.', '八月-Aug.', '七月-July', '六月-June', '五月-May', '四月-Apr.', '三月-Mar', '二月-Feb.', '一月-Jan.'],
                                    title: {
                                        text: null
                                    }
                                },
                                yAxis: {
                                    min: 0,
                                    title: {
                                        text: "货物件数-The Wares'Num",
                                        align: 'high'
                                    },
                                    labels: {
                                        overflow: 'justify'
                                    }
                                },
                                tooltip: {
                                    valueSuffix: ' 件(Wares)'
                                },
                                plotOptions: {
                                    bar: {
                                        dataLabels: {
                                            enabled: true
                                        }
                                    }
                                },
                                legend: {
                                    layout: 'vertical',
                                    align: 'right',
                                    verticalAlign: 'top',
                                    x: -5,
                                    y: 30,
                                    floating: true,
                                    borderWidth: 1,
                                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                                    shadow: true
                                },
                                credits: {
                                    enabled: false
                                },
                                series: chartData2
                            });
                        }
                    },
                    error: function (e) {
                        $("#loadingDialog").dialog("close");
                        $("#tipDiv").find("p").html("连接失败，请重试！<br>Connect failed! Please retry!");
                        $("#tipDiv").dialog("open");
                        console.log("timeChangeError:" + e);
                    }
                });
            }
        }
	});

	$("#modelNoSelect").change(function () {
		var thisDom = $(this);
        $.ajax({
            type: "POST",
            url: "/home/backMoudelNumWeight",
            dataType: "json",
            data: {
            	"MoudelNum": thisDom.val()
            },
            success: function (res) {
                var lineXDate = [];
                var weights = res.weight;
                var average = res.weightAverage;
                console.log(res);
                $("#lineChartDiv").empty();
                for (var i = 1; i < 101; i++) {
                    lineXDate.push(i);
                }
                $('#lineChartDiv').highcharts({
                    chart: {
                        type: 'line'
                    },
                    title: {
                        text: "Model No.的历史重量-Model No.' Weight History"
                    },
                    subtitle: {
                        text: '最近100包（100件/包）: latest 100 packages(100 pieces of wares per package)'
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: lineXDate
                    },
                    yAxis: {
                        title: {
                            text: '重量-Weight'
                        }
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true // 开启数据标签
                            },
                            enableMouseTracking: false // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                        }
                    },
                    series: [{
                        name: '平均重量-Average Weight: ' + average + 'kg',
                        data: weights
                    }]
                });
            },
            error: function(e) {
            }
        });
    });
});