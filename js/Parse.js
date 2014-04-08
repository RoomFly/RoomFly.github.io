Parse.initialize("VjKRngtz1yFy9XrA2YCjmnTr1Jn7XDHFBfT14zsF", "D0sZJ3i9C5NeXOIErxBzZq9qIx65FrTNgZLBZlvk");


function convertSize(size){
  word = size.slice(0,1);
  word = word.toUpperCase();
  return word;
}


function querySize(size,queryResult){
  console.log(queryResult);
  var Rooms = Parse.Object.extend("Rooms");
  var query = new Parse.Query(Rooms);
  query.equalTo("size", size);
  //query.containedIn("objectId",queryResult);
  var availableRooms = [];
  query.find({
    success:function(results){
      //console.log("SOMETHING WAS RETURNED");
      //$("#room-list").html('<a href="#" class="list-group-item active">Available Rooms</a>');
      for(var i = 0; i<results.length;i++){

        var x = queryResult.indexOf(results[i].id);
        if(x>=0){
          var roomObj = {
            room_size :results[i].get("size"),
            capacity: results[i].get("capacity"),
            name:results[i].get("room_name"),
            location :results[i].get("room_location"),
            space_id: results[i].get("space_id")
          };
          availableRooms.push(roomObj);
        }
      }
      if (availableRooms.length){
        for(var i = 0; i < availableRooms.length; i++) {
          buildRoomRow(availableRooms[i]);
        }
      }
      else{
        alert('Sorry! No Rooms available');
      }
    },
    error:function(error){
      alert("Error"+ error.message);
    }

  });
  return availableRooms;
}





/*function test(){
  
  var Rooms = Parse.Object.extend("Time_Table");
  var query = new Parse.Query(Rooms);
  query.equalTo("T9_30",true);
  query.find({
    success:function(results){
    alert(results.length);
    },
    error:function(error){
    alert("Error"+ error.message);
    }

  });
  
  var start_time = new timeStru("09","30");
  var end_time = new timeStru("10","30");
  var date;
  timeQuery (date,start_time,end_time);

}*/

function timeQuery (date,start_time,end_time){
  var startH = Number(start_time.hour);
  var startM = Number(start_time.minute);
  var endH = Number(end_time.hour);
  var endM = Number(end_time.minute);
  var index = (endH * 60 + endM - startH * 60 -startM) / 30;
  //invalid input
  if (index <0){
    alert("Invalid time interval");
    return;
  }
  
  var query_time = [];
  //get the query time from the time interval
  for (var i=0;i<=index;i++){
    var newH = startH+parseInt((startM+i*30)/60);
    var newM = (startM+i*30)%60;
    var sM="";
    if (newM ==0){
      sM = "00";
    }
    else{
      sM = newM.toString();
    }
    query_time[i] = "T" + newH + "_" + sM;
  }  

  //check for the times
  var Time_Table = Parse.Object.extend("Time_Table");
  var timeQ = new Parse.Query(Time_Table);
  var queryResult = [];//query result is room pointer
  for (var i=0;i<=index;i++){
    timeQ.equalTo(query_time[i],true);
  }
  //check for the date
  timeQ.equalTo("year",date.getFullYear());
  timeQ.equalTo("month",date.getMonth());
  timeQ.equalTo("day",date.getDate());
  timeQ.find({
    success:function(results){
      //alert(results.length);
      if (results.length == 0){
        alert("No room available during this time!");
        return;//the return value can be determined later
      }
      
      for(var i=0;i<results.length;i++){
        var object = results[i];
        queryResult[i] = object.get('room_id').id;
      }
    },
    error:function(error){
      alert("Error"+ error.message);
    }

  });
  return queryResult;
}
function timeStru(hour,minute){
  //field is string
  this.hour = hour;
  this.minute = minute;
}