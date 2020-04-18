$(function(){
  // 周几？
  var dayArray=["日","一","二","三","四","五","六"]
  $("#tip").show()
  // 用户位置
  $.ajax({
    type:"GET",
    url:"https://apis.map.qq.com/ws/location/v1/ip",
    dataType:"jsonp",
    data:{
      key:"UPCBZ-GGKWW-J3ARG-RG2AC-YHTTH-2BBKC",
      output:"jsonp"
    },
    success:function(data){
      $("#tip").hide();
      var city=data.result.ad_info.city;
      $("#localtionCity").text(city);
      getCurrentWeather(city)
      getHoursWeather(city)
      getFutureWeather(city)
    }
  })
  // 获取定位城市实况天气数据
  function getCurrentWeather(city){
    $.ajax({
      type:"GET",
      url:"https://api.heweather.net/s6/weather/now",
      data:{
        location:city,
        key:"4fc4722adb9b43d6862970677c9cb4d8"
      },
      success:function(result){
        console.log(result)
        // 日期
        var date=result.HeWeather6[0].update.loc;
        // var d=date.split(" ")[0]
        var d=date.substr(0,10);
        $("#date").text(d);
        // 周几？
        var day=new Date(date).getDay();
        $("#day").text("星期"+dayArray[day])
        // 温度
        var tmp=result.HeWeather6[0].now.tmp;
        $("#tmp").text(tmp+"℃")
        // 天气状况
        var cond_txt=result.HeWeather6[0].now.cond_txt;
        $("#boxText").text(cond_txt)
         // 风向
        var wind_dir=result.HeWeather6[0].now.wind_dir;
        $("#windDir").text(wind_dir)
         // 风速
        var wind_spd=result.HeWeather6[0].now.wind_spd;
        $("#windSpeed").text("风速："+ wind_spd+"km / h")
         // 风力
        var wind_sc=result.HeWeather6[0].now.wind_sc;
        $("#windLevel").text("风力："+wind_sc+"级")
      }
    })
  }

  // 获取24小时天气数据
  function getHoursWeather(city){
    $.ajax({
      type:"GET",
      url:"https://api.heweather.net/s6/weather/hourly",
      data:{
        location:city,
        key:"4fc4722adb9b43d6862970677c9cb4d8",
      },
      success:function(result){
        console.log(result)
        //获取24小时天气
        var hourlyDate=result.HeWeather6[0].hourly;
        console.log(hourlyDate);
        for(var i=0;i<hourlyDate.length;i++){
          var time=hourlyDate[i].time.substr(11,5)
          //创建一个ii
          var $li=$(
            `<li>
            <div>${time}</div>
            <div class="hoursIcon"></div>
            <div>${hourlyDate[i].tmp}℃</div>
            <div>${hourlyDate[i].wind_dir}</div>
            </li>`
          );
          // $("#hours").html($li)
          $("#hours").append($li)
        }
      }
    })
  }

  // 获取未来九天天气数据
  function getFutureWeather(city){
    $.ajax({
      type:'GET',
      url:"https://api.heweather.net/s6/weather/forecast",
      data:{
        location:city,
        key:"4fc4722adb9b43d6862970677c9cb4d8"
      },
      success:((result)=>{
        // console.log(result)
        var futureWeather=result.HeWeather6[0].daily_forecast.slice(1);
        console.log(futureWeather)
        for (var i=0;i<futureWeather.length;i++){
          var date=futureWeather[i].date.substr(5,5).split("-").join(" / ")
          console.log(date)
          var $div=$(
            `
            <div class="futureItem">
              <span>${date}</span>
              <span>
                <i class="fIcon"></i>
              </span>
              <span>${futureWeather[i].tmp_min}℃~${futureWeather[i].tmp_max}℃</span>
              <span>${futureWeather[i].wind_dir}</span>
            </div>
            `
          )
          $("#futureWeatherBox").append($div)
        }
      })
    })
  }

})