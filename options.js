function tickString(hour) {
  var d = new Date(hour*3600*1000);
  var hr = d.getHours();
  var hs = "AM";
  if (hr >= 12) {
    hr -= 12;
    hs = "PM";
  }
  if (hr == 0) hr = 12;
  return (d.getMonth()+1) + "/" +
    d.getDate() + "/" +
    d.getFullYear() + "<br/>" +
    hr + ":00 " + hs;
}

function refreshView() {
  ClickDB.loadTotal(function(totalCount){
    $("#count").text(totalCount + " Clicks");
    $("#calories").text((totalCount*1.42/1000).toFixed(3) + " Calories burned.");
  });
  ClickDB.loadRange(1,28*12,function(results){
    data = [];
    for (var hour in results) {
      data.push([parseInt(hour),results[hour]]);
    }
    data.sort(function(x,y){return x[0]-y[0]});
    var ticks = [];
    data.forEach(function(hour){
      var d = new Date(hour[0]*3600*1000);
      if (hour[0]%1==0) {
        ticks.push([
          hour[0],
          tickString(hour[0])
        ])
      }
    });
    $.plot($("#graph"),[data],{xaxis:{/*ticks:ticks*/},bars:{show:true,barWidth:1,align:"center"}});
  });
}

$(document).ready(function(){
  refreshView();
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if ("db" in request){
      refreshView();
    }
  });
});