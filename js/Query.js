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
    errorValue;

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
    /*sizeQuery = roomQuery;
    sizeQuery.equalTo("room_size",size);
   //base set with roomIds with correct date and time
    
    locQuery = roomQuery;
    locQuery.containedIn("objectId", roomIds);
    
    if(equipment){
      
      for(var e = 0;e<equipment.length;e++){
        equipQuery.equalTo(equipment[e],true);
      } 
      
    }
    sizeQuery.find().then(function(sizes){

    });*/
  }).then(function(rooms) {
    if (!rooms.length) {
      /*   if (size == 3) {
        errorValue = "Sorry! No rooms are available at the specified time, date, and size you requested";
      } else {
        if (size == 1) {
          size2 = 2;
          alert("There is no rooms available at the specified size, but we will search other size of rooms to let you choose")
        } else if (size == 2) {
          size2 = 3;
          alert("There is no rooms available at the specified size, but we will search other size of rooms to let you choose")
        }
        var aroom = [];
        var newQuery = new Parse.Query(Rooms);
        newQuery.greaterThanOrEqualTo("room_size", size2);
        newQuery.containedIn("objectId", roomIds);
        newQuery.ascending('capacity');
        rooms = newQuery.find();
      }*/
      errorValue = 'Sorry there are no rooms with these specific spec';
    }
    return {
      error: errorValue,
      available: rooms
    };
  }).then(function(val) { //Display the information for the user
    if (val.error) {
      alert(val.error);
    } else {
      var ava = val.available;
      return ava;
    }
  }).then(function(roomava) {
    if (roomava.length > 0) {
      $('#filter-collapse').collapse('hide');
    }
    for (var r = 0; r < roomava.length; r++) {
      buildRoomRow(roomava[r]);
    }
  });
}

function buildRoomRow(room) {
  var name = room.get("room_name"),
    size = room.get("room_size"),
    maxCapacity = room.get("capacity"),
    spaceID = room.get("space_id"),
    location = room.get("room_location");
  $("#room-list").append('<div class="list-group-item room-row container-fluid">' +
    '<span class="col-sm-2 room-row-labels">Name: <span class="room-row-content">' + name + '</span> </span>' +
    '<span class="col-sm-2 room-row-labels">Size: <span class="room-row-content">' + maxCapacity + '</span> </span>' +
    '<span class="col-sm-2 room-row-labels">Building: <span class="room-row-content">' + location + '</span> </span>' +
    '<button class="btn btn-default pull-right reserve" data-target="#myModal" href="https://25live.collegenet.com/northwestern/#details&obj_type=space&obj_id=' + spaceID + '" data-toggle="modal">Reserve</button>' +
    '</div>');
  $(".reserve").click(function() {
    $("#live-link").attr("href", $(this).attr("href"));
  });
}