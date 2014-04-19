$(document).ready(function(){
	var date = new Date(),
	month = date.getMonth() + 1,
	day = date.getDate();

	var today = month + '/' + day;
	$("#day1").html(today);


	for (var i=2; i<8; i++)
	{
		var id = "#day" + i;
		if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
			if (day == 31) {
				if (month != 12) {
					month = month + 1;
				}
				else {
					month = 1;
				}
				day = 1;
			}
			else {
				day = day + 1;
			}
		}
		else if (month == 4 || month == 6 || month == 9 || month == 11) {
			if (day == 30) {
				if (month != 12) {
					month = month + 1;
				}
				else {
					month = 1;
				}
				day = 1;
			}
			else {
				day = day + 1;
			}
		}
		else if (month == 2) {
			if (day == 28) {
				month = month + 1;
				day = 1;
			}
			else {
				day = day + 1;
			}
		}
		var ndate = month + '/' + day;
		$(id).html(ndate);
	}

	newdate = new Date();
	// var hour = 8;
	// var dayclass = ".day-1";
	queryRoom("magymakaYK", newdate);
	// console.log(timeObject);
	// var timeArray = getTimeArray(timeObject);
	// console.log(timeArray);
	// for (var i=0; i<timeArray.length; i+2) {
	// 	var id = "#" + hour;
	// 	if (timeArray[i] == true) {
	// 		$(id + dayclass + ".time1").addClass("colored");
	// 	}
	// 	if (timeArray[i+1] == true) {
	// 		$(id + dayclass + ".time2").addClass("colored");
	// 	}
	// 	hour = hour + 1;
	// }	

})

function queryRoom(roomID, date) {
  var Time_Table = Parse.Object.extend("Time_Table"),
  timeQuery = new Parse.Query(Time_Table),
  Rooms = Parse.Object.extend("Rooms"),
  roomQuery = new Parse.Query(Rooms);

  roomQuery.equalTo("objectId", roomID);
  roomQuery.find().then(function(result){
    timeQuery.containedIn("room_id", result);
    timeQuery.equalTo("month",date.getMonth());
    timeQuery.equalTo("day",date.getDate());
    return timeQuery.find()
  }).then(function(result){
  	var timeArray = getTimeArray(result);
  	var hour = 8;
	var dayclass = ".day-1";
  	for (var i=0; i<timeArray.length; i+2) {
		var id = "#" + hour;
		if (timeArray[i] == true) {
			$(id + dayclass + ".time1").addClass("colored");
		}
		if (timeArray[i+1] == true) {
			$(id + dayclass + ".time2").addClass("colored");
		}
		hour = hour + 1;
	}
  });
}

function getTimeArray (resultObject) {
	var result = resultObject[0],
	timeArray = [];

	timeArray[0] = result.get("T8_30");
	timeArray[1] = result.get("T9_00");
	timeArray[2] = result.get("T9_30");
	timeArray[3] = result.get("T10_00");
	timeArray[4] = result.get("T10_30");
	timeArray[5] = result.get("T11_00");
	timeArray[6] = result.get("T11_30");
	timeArray[7] = result.get("T12_00");
	timeArray[8] = result.get("T12_30");
	timeArray[9] = result.get("T13_00");
	timeArray[10] = result.get("T13_30");
	timeArray[11] = result.get("T14_00");
	timeArray[12] = result.get("T14_30");
	timeArray[13] = result.get("T15_00");
	timeArray[14] = result.get("T15_30");
	timeArray[15] = result.get("T16_00");
	timeArray[16] = result.get("T16_30");
	timeArray[17] = result.get("T17_00");
	timeArray[18] = result.get("T17_30");
	timeArray[19] = result.get("T18_00");
	timeArray[20] = result.get("T18_30");
	timeArray[21] = result.get("T19_00");
	timeArray[22] = result.get("T19_30");
	timeArray[23] = result.get("T20_00");
	timeArray[24] = result.get("T20_30");
	timeArray[25] = result.get("T21_00");
	timeArray[26] = result.get("T21_30");
	timeArray[27] = result.get("T22_00");
	timeArray[28] = result.get("T22_30");

	return timeArray;
}



