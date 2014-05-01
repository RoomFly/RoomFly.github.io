Parse.initialize("VjKRngtz1yFy9XrA2YCjmnTr1Jn7XDHFBfT14zsF", "D0sZJ3i9C5NeXOIErxBzZq9qIx65FrTNgZLBZlvk");
//$json = str_replace('\u0000', "", json_encode( $response ));
//format size for db query

function formatCampusLocation(campus) {
  if (campus == "No Preference") {
    return null;
  } else
    return campus;
}

function formatEquipment(equipment) {
  if (!equipment.length) {
    return null;
  } else
    return equipment;
}

function formatSize(size) {
  var num;
  if (size == "No Preference") {
    num = null;
  } else {
    word = size.slice(0, 1);
    var num;
    if (word == "S") {
      num = 1;
    } else if (word == "M") {
      num = 2;
    } else if (word == "L") {
      num = 3;
    }
  }
  //word = word.toUpperCase();
  return num;
}
//get the time and format for db query
function formatTime(start_time, end_time) {
  var startH = Number(start_time.hour);
  var startM = Number(start_time.minute);
  var endH = Number(end_time.hour);
  var endM = Number(end_time.minute);
  var index = (endH * 60 + endM - startH * 60 - startM) / 30;
  //invalid input
  if (index <= 0) {
    //alert("Invalid time interval");
    return {
      query_time: [],
      errorValue: "Invalid time interval"
    };
  }

  var query_time = [];
  //get the query time from the time interval
  for (var i = 0; i <= index; i++) {
    var newH = startH + parseInt((startM + i * 30) / 60);
    var newM = (startM + i * 30) % 60;
    var sM = "";
    if (newM == 0) {
      sM = "00";
    } else {
      sM = newM.toString();
    }
    query_time[i] = "T" + newH + "_" + sM;
  }
  return {
    query_time: query_time
  };
}

//query for time and date then query for room_size
function queryDB(date, times, size, equipment, campus_loc) {
  var Time_Table = Parse.Object.extend("Time_Table"),
    size2,
    Rooms = Parse.Object.extend("Rooms"),
    roomQuery = new Parse.Query(Rooms),
    sizeQuery = new Parse.Query(Rooms),
    locQuery = new Parse.Query(Rooms),
    equipQuery = new Parse.Query(Rooms),
    timeQuery = new Parse.Query(Time_Table),
    availableRooms = [],
    roomIds = [],
    errorValue=null,
    bannerValue=null;

  //Time and date query
  timeQuery.equalTo("year", date.getFullYear());
  timeQuery.equalTo("month", date.getMonth());
  timeQuery.equalTo("day", date.getDate());

  for (var i = 0; i < times.length; i++) {
    timeQuery.equalTo(times[i], true);
  }
  timeQuery.find().then(function(timeSlots) { //get the room information from timeslots
    if (timeSlots.length) {
      for (var t = 0; t < timeSlots.length; t++)
        roomIds.push(timeSlots[t].get("room_id").id);
    }
  }).then(function() { //size,location, equipment
    roomQuery.containedIn("objectId", roomIds);
    if (size) {
      roomQuery.equalTo("room_size", size);
    }
    if (campus_loc) {
      roomQuery.equalTo("campus_location", campus_loc);
    }
    if (equipment) {
      for (var e = 0; e < equipment.length; e++) {
        roomQuery.equalTo(equipment[e], true);
      }
    }
    return roomQuery.find();
  }).then(function(rooms) {
    if (!rooms.length) {
      var newQuery= new Parse.Query(Rooms);
      newQuery.containedIn("objectId",roomIds);
      if (equipment){
        bannerValue= "We didn't find any rooms with your specific equipment requirements but these rooms are similar.";
        if(size)
          newQuery.equalTo("room_size",size);
        if(campus_loc)
          newQuery.equalTo("campus_location",campus_loc);
      }
      if(size && !equipment){//permutations where room_size was selected but not equipment and possibly campus location
        if(size==3){
          if(campus_loc){
            cl2 = campus_loc =="North"?"South":"North";
            newQuery.equalTo("room_size",size);
            newQuery.equalTo("campus_location",cl2);
            bannerValue ="We didn't find rooms with the size you chose on "+campus_loc+" campus so we searched on "+ cl2+" campus";
          }
          else
            errorValue="Sorry there are no rooms of this size available at the time selected";
        }
        else{
          if(size==1){
            size2=2;
          }
          else if(size==2){
            size2=3;
          }
          newQuery.greaterThanOrEqualTo("room_size", size2);
          newQuery.ascending('capacity');
          if(campus_loc){
            newQuery.equalTo("campus_location",campus_loc);
          }
          bannerValue = "We didn't find rooms with the size you chose so we looked for larger rooms";
        }
      }
      if(campus_loc && !size && !equipment){//permuations where campus_loc was selected but not room_size and not equipment
        var cl2="North";
        if(campus_loc=="North"){
          cl2="South"
        }
        newQuery.equalTo("campus_location",cl2);
        bannerValue="We didn't find any rooms on "+campus_loc+" campus so we searched for rooms on "+ cl2+ "campus";
      }
      return newQuery.find();
    }
    return rooms;
  }).then(function(val) { //Display the information for the user
    if (errorValue) {
      alert(errorValue);
    } 
    else {
      if(bannerValue){
        $("#banner").show();
        $("#banner").text(bannerValue);
      }
      if(val.length){
        $('#filter-collapse').collapse('hide');
        for(var r=0;r<val.length;r++){
          buildRoomRow(val[r]);
        }
      }
    }
  });
}

function buildRoomRow(room) {
  console.log(room.id)
  var name = room.get("room_name"),
    size = room.get("room_size"),
    maxCapacity = room.get("capacity"),
    roomID = room.id,
    location = room.get("room_location"),
  //equipment = ["equip_wifi", "equip_dvd", "equip_av", "equip_computer", "equip_dc", "equip_lc", "equip_microphone"],
  equipment = {"equip_wifi":"Wifi","equip_dvd":"DVD","equip_av":"Projector and Audio","equip_computer":"Computer Equipment","equip_dc":"Document Camera","equip_lc":"Laptop Connection","equip_microphone":"Microphone"}
  details = "";

  details += "<h4>" + name + "</h4>";
  details += "<div><label>Building:</label><span>" + location + "</span></div>";
  details += "<div><label>Size:</label><span>" + maxCapacity + "</span></div>";
  details += "<ul class='list-group'><a class='list-group-item active'>Equipment:</a>";
/*
  for (var i = 0; i < equipment.length; i++) {
    if (room.get(equipment[i])) {
      details += "<li class='list-group-item has-success'>" + equipment[i] + "</li>";
    }
  }*/
  for (var prop in equipment){
    if(room.get(prop)){
      details += "<li class='list-group-item has-success'>" + equipment[prop] + "</li>";
    }
  }
  details += "</ul>"
  $("#room-list").append('<div class="list-group-item room-row container-fluid">' +
    '<span class="col-xs-4 room-row-labels">Name: <span class="room-row-content">' + name + '</span> </span>' +
    '<span class="col-xs-4 room-row-labels">Size: <span class="room-row-content">' + maxCapacity + '</span> </span>' +
    '<span class="col-xs-4 room-row-labels">Building: <span class="room-row-content">' + location + '</span> </span>' +
    '<a class="details col-xs-4" href="' + details + '" data-target="#detailsModal" data-toggle="modal">Details</a>' +
    '<span class="col-xs-4"></span>' +
    '<button class="col-xs-4 btn btn-default pull-right" data-target="#myModal" data-toggle="modal">Reserve</button>' +
    '<a class="details col-xs-4" href="details.html?roomid=' + roomID + '">View Calendar</a>' +
    '<span class="col-xs-4"></span>' +
    '</div>');
  $(".details").click(function() {
    $("#equipment").html($(this).attr("href"));
  });
}
