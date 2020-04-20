$(function(){
  //获取本地存储缓存的城市历史记录
  var cities=localStorage.getItem("cities");
  cities=cities?JSON.parse(cities):[];
  // console.log(cities)
  // console.log({}.toString.call(cities)==="[object Array]")
  //是否已经获取空气质量与生活指数数据
  var isGet=true
  //配置空气质量数据与生活指数数据
  var airLifeData={
    airNowCity:[
      {title:"空气质量指数",key:"aqi"},
      {title:"主要污染物",key:"main"},
      {title:"空气质量",key:"qlty"},
      {title:"可吸入颗粒物pm10",key:"pm10"},
      {title:"可吸入颗粒物pm25",key:"pm25"},
      {title:"二氧化氮",key:"no2"},
      {title:"二氧化硫",key:"so2"},
      {title:"一氧化碳",key:"co"},
      {title:"臭氧",key:"o3"},
    ],
    //生活指数数据
    lifestyle:[
      {title:"舒适度指数",key:"comf"},
      {title:"洗车指数",key:"cw"},
      {title:"穿衣指数",key:"drsg"},
      {title:"感冒指数",key:"flu"},
      {title:"运动指数",key:"sport"},
      {title:"旅游指数",key:"trav"},
      {title:"紫外线指数",key:"uv"},
      {title:"空气污染扩散条件指数",key:"air"},
      {title:"空调开启指数",key:"ac"},
      {title:"过敏指数",key:"ag"},
      {title:"太阳镜指数",key:"gl"},
      {title:"化妆指数",key:"mu"},
      {title:"晾晒指数",key:"airc"},
      {title:"交通指数",key:"ptfc"},
      {title:"钓鱼指数",key:"fsh"},
      {title:"防嗮指数",key:"spi"},
    ]
  }
  // 周几？
  var dayArray=["日","一","二","三","四","五","六"]
  // 配置天气图标
  var iconConfig={
    "100":{
      title:"晴",
      icon:"../images/100.png"
    },
    "101":{
      title:"多云",
      icon:"../images/101.png"
    },
    '104':{
      title:"阴天",
      icon:"../images/104.png"
    },
    "300":{
      title:"阵雨",
      icon:"../images/300.png"
    },
    "302":{
      title:"雷阵雨",
      icon:"../images/302.png"
    },
    // "305":{
    //   title:"小雨",
    //   icon:"../images/305.png"
    // },
    "399":{
      title:"小雨",
      icon:"../images/305copy.png"
    },
    "306":{
      title:"中雨",
      icon:"../images/306.png"
    },
    "307":{
      title:"大雨",
      icon:"../images/307.png"
    },
    "509":{
      title:"浓雾",
      icon:"../images/509.png"
    },
    "999":{
      title:"未知",
      icon:"../images/999.png",
    }
  }
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
      // $("#tip").hide();
      var city=data.result.ad_info.city.replace(/市$/,"");
      $("#localtionCity").text(city);
      getCurrentWeather(city)
      // getHoursWeather(city)
      // getFutureWeather(city)
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
        // console.log("adf",result)
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
        // 配置图标
        $("#boxIcon").css({
          // "background-image":`url("${iconConfig[result.HeWeather6[0].now.cond_code].icon}")`,
          "background-image":`url("../images/${result.HeWeather6[0].now.cond_code}.png")`,
        })

        getHoursWeather(city)
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
        // console.log(result)
        //获取24小时天气
        var hourlyDate=result.HeWeather6[0].hourly;
        // console.log(hourlyDate);
        for(var i=0;i<hourlyDate.length;i++){
          // console.log(hourlyDate[i].cond_code)
          var time=hourlyDate[i].time.substr(11,5)
          //创建一个ii
          var $li=$(
            `<li>
            <div>${time}</div>
            <div id="hoursIcon" class="hoursIcon" style="background-image:url('../images/${hourlyDate[i].cond_code}.png')"></div>
            <div>${hourlyDate[i].tmp}℃</div>
            <div>${hourlyDate[i].wind_dir}</div>
            </li>`
          );
          // $("#hours").html($li)
            //内外引号问题******************
          // <div class="hoursIcon" style="background-image:url('${iconConfig[hourlyDate[i].cond_code].icon}');"></div>
          $("#hours").append($li)
          // $("#hoursIcon").css({
          //   "background-image":`url("../images/${hourlyDate[i].cond_code}.png")`
          // })
        }
        getFutureWeather(city)
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
        // console.log(futureWeather)
        for (var i=0;i<futureWeather.length;i++){
          var date=futureWeather[i].date.substr(5,5).split("-").join(" / ")
          // console.log(date)
          var $div=$(
            `
            <div class="futureItem">
              <span>${date}</span>
              <span>
                <i class="fIcon" style="background-image:url('../images/${futureWeather[i].cond_code_d}.png')"></i>
              </span>
              <span>${futureWeather[i].tmp_min}℃~${futureWeather[i].tmp_max}℃</span>
              <span>${futureWeather[i].wind_dir}</span>
            </div>
            `
          )
          $("#futureWeatherBox").append($div)
        }
        
        $("#tip").hide();
      })
    })
  }

  // 查看实况天气的空气质量与生活指数
  $("#weatherStatus").on("click",function(){
    if(isGet){
      isGet=false;
    // 获取当前的城市
    var city=$("#localtionCity").text()
    // 获取空气质量数据
    $.ajax({
      type:"GET",
      url:"https://api.heweather.net/s6/air/now",
      data:{
        location:city,
        key:"4fc4722adb9b43d6862970677c9cb4d8"
      },
      success:function(data){
        // console.log(data)
        //合并空气质量数据
        for (var i=0;i<airLifeData.airNowCity.length;i++){
          var current=airLifeData.airNowCity[i]
          current.value=data.HeWeather6[0].air_now_city[current.key];
          var $li=$(`
          <li>
          <span>${current.title}</span>
          <span>${current.value}</span>
          </li>
          `);
          $("#airList").append($li)
        }
        // console.log(airLifeData.airNowCity)
      }
    })
    // 获取生活指数数据
    $.ajax({
      type:"GET",
      url:"https://api.heweather.net/s6/weather/lifestyle",
      data:{
        location:city,
        key:"4fc4722adb9b43d6862970677c9cb4d8",
      },
      success:(data)=>{
        // console.log(data)
        for(var i=0;i<airLifeData.lifestyle.length;i++){
          var current=airLifeData.lifestyle[i];
          for(var j=0;j<data.HeWeather6[0].lifestyle.length;j++){
            var currentData=data.HeWeather6[0].lifestyle[j];
            if(current.key==currentData.type){
              current.value=currentData.brf;
              break;
            }
          }
          //创建li
          var $li=$(`
          <li>
          <span>${current.title}</span>
          <span>${current.value}</span>
          </li>
          `)
          $("#airList").append($li)
        }
        // console.log(airLifeData.lifestyle)
      }
    })
    }
    $("#airLifeBox").show().animate({
      top:0
    },300)
  })

  //点击airLifeBox元素关闭空气质量与生活指数页面
  $("#airLifeBox").on("click",function(e){
    if(e.target==this){
      $(this).animate({
        top:"100%"
      },300,function(){
        $(this).hide()
      })
    }
  })

  //切换城市天气数据
  $("#searchIcon").on("click",function(){
    var city=$("#searchInput").val();
    //搜索城市与当前城市相同，不发请求
    var currentCity=$("#localtionCity").text();
    if(city.trim()==="")return;
    if(city.replace(/市$/,"")==currentCity.replace(/市$/,"")){
      console.log("1")
      $("#searchInput").val("");
      $("#list").hide()
      return;
    }
    isGet=true;
    //清空空气质量与生活指数内容
    $("#airList").html("")
    //显示加载提示
    $("#tip").show()
      //设置城市
      $("#localtionCity").text(city.replace(/市$/,""));
      //清空文本内容
      $("#searchInput").val("");
      //清空24小时天气数据内容
      $("#hours").html("")
      //清空未来九天天气数据
      $("#futureWeatherBox").html("")

      var c=city.replace(/市$/,"").trim();
      //如果没有缓存过的城市
      if(cities.indexOf(c)===-1){
        console.log(cities)
      //缓存城市历史记录
      cities.unshift(c);
      console.log(cities)
      //将cities写入本地存储
      var citiesString=JSON.stringify(cities);
      // var citiesString=cities.toString();
      localStorage.setItem("cities",citiesString);
      isYes=false
    }
      $("#list").hide()
      //获取当前切换城市的天气数据
      getCurrentWeather(city)
      // getHoursWeather(city)
      // getFutureWeather(city)
  })

  //标记是否有删除城市或者新增城市
  //var isYes=false;待研究
  
  //绑定搜索框的获取焦点事件
  $("#searchInput").on("focus",function(){
    //待研究***********************
    // if(isYes){
    //   $("#list").show();
    //   return;
    // }
    // console.log("dylan")
    // isYes=true;
    //***********上************
    //绑定缓存城市数据
    var citiesData=localStorage.getItem("cities");
    // console.log(citiesData)
    citiesData=citiesData?JSON.parse(citiesData):[]
    // console.log(citiesData)

    //如果没有缓存城市数据，不显示下拉菜单
    if(citiesData.length===0){
      return;
    }
    
    //先清空列表 再生成标签
    $("#listTag").html("")
    //生成下拉菜单标签
    for (var i=0;i<citiesData.length;i++){
      var $span=$(`
      <span>${citiesData[i]}<i class="closeIcon"></i></span>
      `);
      $("#listTag").append($span)
    }
    $("#list").show()
  })
  //关闭下拉菜单
  $("#close").on("click",function(){
    $("#list").hide()
  })
  
  //为未来生成下拉菜单标签绑定点击事件
  $("#listTag").on("click","span",function(){
    //获取标签的内容
    var text=$(this).text();
    console.log(text)
    //获取当前城市
    var currentCity=$("#localtionCity").text();
    if(text==currentCity){
      console.log("already",text)
      $("#list").hide()
      return;
    }

    //显示加载提示
    $("#tip").show();
    $("#localtionCity").text(text);
    $("#searchInput").val("");
    //清空24小时天气数据内容
    $("#hours").html("")
    //清空未来九天天气数据
    $("#futureWeatherBox").html("")
    //获取天气数据
    getCurrentWeather(text)
    //空气质量列表清空
    $("#airList").html("")
    isGet=true;
    $("#list").hide()

  })

  //单个删除缓存城市历史记录
  $("#listTag").on("click",".closeIcon",function(e){
    
    //阻止事件冒泡
    e.stopPropagation();
    console.log("a");
    console.log(cities);
    //获取删除的城市
    var city=$(this).parent().text();
    console.log("city==>",city);


    //获取cities数组中的数据
    console.log("chengmiing==>",cities)
    var Cindex=cities.indexOf(city);
    console.log("Cindex",Cindex)
    //删除cities数组中的数据
    cities.splice(Cindex,1)

    
    //获取本地存储数据
    var citiesData=JSON.parse(localStorage.getItem("cities"));
    //查找数组元素
    var index=citiesData.indexOf(city);
    console.log("index==>",index)
    //删除数组元素
    citiesData.splice(index,1);
    console.log("citiesData==>",citiesData)
    //将删除之后的citiesData数据写入本地存储
    localStorage.setItem("cities",JSON.stringify(citiesData));
    //移除页面的下拉菜单标签
    $(this).parent().remove();
    //如果当前数据全部被删除，则需要关闭下拉菜单
    if(citiesData.length==0){
      $("#list").hide()
    }
  })

  //全部删除
  $("#allDelete").on("click",function(){
    localStorage.setItem("cities",JSON.stringify([]));
    $("#listTag").html("");
    $("#list").hide();
    cities.length=0;
    // isYes=false;待研究
  })

})