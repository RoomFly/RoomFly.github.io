$("#dp3").datepicker({ minDate: 0});
$("#dp3").val(getToday());

var time = getCurrentTime();
var endtime = getEndTime(time);

$("#start-hour").val(timeToString(time.hour));
$("#start-minute").val(time.minute);
$("#start-ampm").val(time.ampm);
$("#end-hour").val(timeToString(endtime.hour));
$("#end-minute").val(time.minute);
$("#end-ampm").val(endtime.ampm);
$("#submit").click(function(){
  $("#room-list").html('<a href="#" class="list-group-item active">Available Rooms</a>');
  var filterVars = getFilterVals();
  runQueries(filterVars);
});

function getCurrentTime(){
  var time = new Date();
  var hour = time.getHours();
  var minute = time.getMinutes();
  var ampm;
  if(minute <= 30){
    minute = "30";
  }
  else if(minute > 30){
    minute = "00";
    hour = hour + 1;
  }
  var convertedTime = convert24To12(hour);
  hour = convertedTime.hour;
  ampm = convertedTime.ampm;

  // hour = hour.toString();
  // if(hour.length == 1){
  //   hour = "0" + hour;
  // }

  return {
    hour:hour,
    minute:minute,
    ampm:ampm
  };
}

function convert24To12(hour){
  var ampm = "AM";
  if(hour >= 12){
    hour = hour - 12;
    ampm = "PM";
  }
  if(hour == 0){
    hour = 12;
  }
  return {
    hour:hour,
    ampm:ampm
  };
}

function timeToString(hour){
  hour = hour.toString();
  if(hour.length == 1){
    hour = "0" + hour;
  }
  return hour;
}

function getEndTime(time){
  var hour = time.hour;
  var ampm = time.ampm;
  if(hour == 12){
    if(ampm == "AM"){
      ampm = "PM";
    }
    else{
      ampm = "AM";
    }
    hour = 1;
  }
  else{
    hour++;
  }
  return{
    hour:hour,
    ampm:ampm
  };
}

function getToday() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}

function getFilterVals() {
  var size = $("#size").val();
  date = $("#dp3").datepicker('getDate'),
  startTime = convertTime($("#start-hour").val(), $("#start-minute").val(), $("#start-ampm").val()),
  endTime = convertTime($("#end-hour").val(), $("#end-minute").val(), $("#end-ampm").val());
  return {
    room_size: size,
    date: date,
    startTime: startTime,
    endTime: endTime
  };
}

function convertTime(hour, minute, ampm) {
  var time = hour + ":" + minute + " " + ampm;
  var hours = Number(time.match(/^(\d+)/)[1]);
  var minutes = Number(time.match(/:(\d+)/)[1]);
  var AMPM = time.match(/\s(.*)$/)[1];
  if(AMPM == "PM" && hours<12) hours = hours+12;
  if(AMPM == "AM" && hours==12) hours = hours-12;
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  if(hours<10) sHours = "0" + sHours;
  if(minutes<10) sMinutes = "0" + sMinutes; 
  return {
    hour: sHours,
    minute: sMinutes
  };
}

function runQueries(filterVars){
  var times = formatTime(filterVars.startTime,filterVars.endTime),
  roomSize = formatSize(filterVars.room_size);
  if(times.errorValue){
    alert(times.errorValue)
  }
  else{
    queryDB(filterVars.date,times.query_time,roomSize);
  }
}



























