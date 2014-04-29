$("#dp3").datepicker({
  minDate: 0
});
$("#dp3").val(getToday());
$("#banner").hide();
// var time = getCurrentTime();
// var endtime = getEndTime(time);

// $("#start-hour").val(timeToString(time.hour));
// $("#start-minute").val(time.minute);
// $("#start-ampm").val(time.ampm);
// $("#end-hour").val(timeToString(endtime.hour));
// $("#end-minute").val(time.minute);
// $("#end-ampm").val(endtime.ampm);


var endInput = $("#end-time-picker").pickatime({
  min: [8, 30],
  max: [22, 30],
  clear: ''
});

var endPicker = endInput.pickatime('picker');

var startInput = $("#start-time-picker").pickatime({
  min: [8, 30],
  max: [22, 30],
  clear: '',
  onSet: function() {
    var start = startInput.pickatime('picker').get('select');
    var endPicker = endInput.pickatime('picker');
    endPicker.set('select', [start.hour + 1, start.mins]);
  }
});

var startPicker = startInput.pickatime('picker');
var now = startPicker.get('now');
startPicker.set('select', [now.hour, now.mins]);

$(".timepicker").change(function() {
  var startHour = $("#start-hour").val();
  var startMinute = $("#start-minute").val();
  var startAmpm = $("#start-ampm").val();
  var time = {
    hour: startHour,
    ampm: startAmpm
  };

  var endTime = getEndTime(time);

  $("#end-hour").val(timeToString(endTime.hour));
  $("#end-ampm").val(endTime.ampm);
  $("#end-minute").val(startMinute);

});

$("#submit").click(function() {
  $("#room-list").html('<a href="#" class="list-group-item active">Available Rooms</a><div id="banner" class="list-group-item list-group-item-warning"></div>');
  $("#banner").hide();
  var filterVars = getFilterVals();
  runQueries(filterVars);
});

function getCurrentTime() {
  var time = new Date();
  var hour = time.getHours();
  var minute = time.getMinutes();
  var ampm;
  if (minute <= 30) {
    minute = "30";
  } else if (minute > 30) {
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
    hour: hour,
    minute: minute,
    ampm: ampm
  };
}

function convert24To12(hour) {
  var ampm = "AM";
  if (hour >= 12) {
    hour = hour - 12;
    ampm = "PM";
  }
  if (hour == 0) {
    hour = 12;
  }
  return {
    hour: hour,
    ampm: ampm
  };
}

function timeToString(hour) {
  hour = hour.toString();
  if (hour.length == 1) {
    hour = "0" + hour;
  }
  return hour;
}

function getEndTime(time) {
  var hour = time.hour;
  var ampm = time.ampm;
  if (hour == 12) {
    if (ampm == "AM") {
      ampm = "PM";
    } else {
      ampm = "AM";
    }
    hour = 1;
  } else {
    hour++;
  }
  return {
    hour: hour,
    ampm: ampm
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
  var size = $("#size").val(),
  date = $("#dp3").datepicker('getDate'),
  //startTime = convertTime($("#start-hour").val(), $("#start-minute").val(), $("#start-ampm").val()),
  //endTime = convertTime($("#end-hour").val(), $("#end-minute").val(), $("#end-ampm").val());
  startTime = convert12To24(startPicker.get('value')),
  endTime = convert12To24(endPicker.get('value')),
  campus_location = $("#campus_location").val(),
  equipment = [];

  $("input[type=checkbox]").each(function(){
    if($(this).prop('checked')){
      equipment.push($(this).val());
    }
  });

  return {
    room_size: size,
    date: date,
    startTime: startTime,
    endTime: endTime,
    campus_location:campus_location,
    equipment: equipment
  };
}

function convert12To24(time) {
  //var time = hour + ":" + minute + " " + ampm;
  var hours = Number(time.match(/^(\d+)/)[1]);
  var minutes = Number(time.match(/:(\d+)/)[1]);
  var AMPM = time.match(/\s(.*)$/)[1];
  if (AMPM == "PM" && hours < 12) hours = hours + 12;
  if (AMPM == "AM" && hours == 12) hours = hours - 12;
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  if (hours < 10) sHours = "0" + sHours;
  if (minutes < 10) sMinutes = "0" + sMinutes;
  return {
    hour: sHours,
    minute: sMinutes
  };
}

function runQueries(filterVars) {
  var times = formatTime(filterVars.startTime, filterVars.endTime),
    roomSize = formatSize(filterVars.room_size),
    equipment = formatEquipment(filterVars.equipment),
    campus_location= formatCampusLocation(filterVars.campus_location);
  if (times.errorValue) {
    alert(times.errorValue)
  } else {
    queryDB(filterVars.date,times.query_time,roomSize,equipment,campus_location);
  }
}