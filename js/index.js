$("#dp3").datepicker({ minDate: 0});
$("#dp3").val(getToday());
$("#submit").click(function(){
  //$("#room-list").html('<a href="#" class="list-group-item active">Available Rooms</a>');
  var filterVars = getFilterVals();
  var rooms = runQueries(filterVars);

});

function createRoomRow(room) {
  var rBuilding = room.get('room_location');
  var rSize = room.get('size');
  var rName = room.get('room_name'); 

  var list = $('#room-list');

  var rowHtml = "<div class=\"list-group-item room-row\"><span class=\"col-xs-2 room-row-labels\">Name: <span class=\"room-row-content\">" + rName + "</span> </span><span class=\"col-xs-2 room-row-labels\">Size: <span class=\"room-row-content\">" + rSize + "</span> </span><span class=\"col-xs-2 room-row-labels\">Building: <span class=\"room-row-content\">" + rBuilding + "</span> </span><button class=\"btn btn-default pull-right\" data-target=\"#myModal\" data-toggle=\"modal\">Reserve</button></div>";

  list.append(rowHtml);
  
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
  // return size;
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
  var results = timeQuery(filterVars.date,filterVars.startTime,filterVars.endTime);
  var convertedSize = convertSize(filterVars.room_size);
  return querySize(convertedSize,results);
}

function buildRoomRow(room) {
  var name = room.name,
  size = room.room_size,
  maxCapacity = room.capacity,
  spaceID = room.space_id,
  location = room.location;
  $("#room-list").append('<div class="list-group-item room-row">' +
    '<span class="col-sm-2 room-row-labels">Name: <span class="room-row-content">' + name + '</span> </span>' + 
    '<span class="col-sm-2 room-row-labels">Size: <span class="room-row-content">' + maxCapacity + '</span> </span>' + 
    '<span class="col-sm-2 room-row-labels">Building: <span class="room-row-content">' + location + '</span> </span>' +
    '<button class="btn btn-default pull-right" data-target="#myModal" data-toggle="modal">Reserve</button>' +
    '</div>');
}


























