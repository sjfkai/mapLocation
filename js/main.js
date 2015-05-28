(function(){

	var api =  

	$(document).ready(function(){
		//点击转换
		$("#start-button").click(function(){
			var location = $("#location-text").val();
			location = $.trim(location);
			if(!location){
				alert('地址不能为空');
				return;
			}
			var locationArr = location.split('\n');
			convertAndShow(locationArr);
			// alert(locationArr);

		});
	});

	/**
	 * 转换地址为左边并显示在页面上
	 * @param  {[type]} locationArr 地址数组
	 */
	var convertAndShow = function (locationArr){
		var result = {}

		async.eachSeries(locationArr , function(location , cb){
			location = $.trim(location);
			if(!location) return cb();
			var url = getUrl(location);
			// $.get(url,function(data , status){
			// 	 alert("Data: " + data + "\nStatus: " + status);
			// });
			$.getJSON(url, function(data){
                //alert(data.status);
                if(data.status === 0 && data.result){
                	//显示
                	showResult(location,data.result);
                }else{
                	showError(location ,data.status , data.msg)
                }
                cb();
    		});
		});

	}

	var showError = function(location , status , msg){
		var append = "<tr>"+
			        "<td>"+location+"</td>"+
			        "<td> </td>"+
			        "<td> </td>"+
			        "<td> </td>"+
			        "<td> </td>"+
			        "<td> </td>"+
			        "<td>"+status + " : "+ msg+"</td>"+
      				"</tr>";
		$("#result-table").append(append);
	}

	/**
	 * 将结果显示到页面上
	 * @param  {[type]} location 地址
	 * @param  {[type]} result   结果
	 * "result":{
	 * 		"location":{"lng":116.37663671722,"lat":39.988498267125},
	 * 	 	"precise":1,
	 * 	  	"confidence":80,
	 * 	   	"level":"商务大厦"
	 * 	}
	 */
	var showResult = function (location , result){
		var append = "<tr>"+
			        "<td>"+location+"</td>"+
			        "<td>"+result.location.lng+"</td>"+
			        "<td>"+result.location.lat+"</td>"+
			        "<td>"+(result.precise==1? "是":"否") +"</td>"+
			        "<td>"+result.confidence+"</td>"+
			        "<td>"+result.level+"</td>"+
			        "<td></td>"+
      				"</tr>";
      	$("#result-table").append(append);

	}



	/**
	 * 地址生成Get请求的url
	 * @param  {[type]} location 地址
	 */
	var getUrl = function(location){
		return 'http://api.map.baidu.com/geocoder/v2/?address='+location+'&output=json&ak=gQsCAgCrWsuN99ggSIjGn5nO&callback=?'
	}

})()

