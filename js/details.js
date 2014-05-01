$(document).ready(function(){
	var date = new Date(),
	month = date.getMonth() + 1,
	day = date.getDate();

	var today = month + '/' + day;
	$("#day1").html(today);
	newdate = new Date();

	roomID = getRoomID('roomid');
	console.log(roomID);

	queryRoom(roomID, newdate, 1);

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

		var dateObj = new Date();
		dateObj.setMonth(month-1);
		dateObj.setDate(day);
		// console.log(dateObj);
		// console.log(i);
		queryRoom(roomID, dateObj, i);
		
	}
})

function queryRoom(roomID, date, daynum) {
	// console.log(date.getMonth());
	// console.log(date.getDate());

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
  		// console.log(result);
	  	var timeArray = getTimeArray(result);
	  	// console.log(timeArray);
	  	var hour = 8;
		var dayclass = ".day-" + daynum;
		// console.log(timeArray)
	  	for (var i=0; i<timeArray.length; i=i+2) {
			var id = "#" + hour;
			if (timeArray[i] == false) {
				element = id + " " + dayclass + " " + ".time1";
				// console.log(element);
				$(element).addClass("colored");
			}
			if (timeArray[i+1] == false) {
				element = id + " " + dayclass + " " + ".time2";
				// console.log(element);
				$(element).addClass("colored");
			}
			hour = hour + 1;
		}
  	});
}

function getRoomID(searchID) {
	var searchString = window.location.search.substring(1);
	// console.log(searchString);
	var keyVal = searchString.split('=');
	// console.log(keyVal)
	if (keyVal[0] == searchID) {
		return keyVal[1];
	}
}

function getTimeArray(resultObject) {
	var result = resultObject[0];
	var timeArr = new Array();
	// console.log(result);
	// console.log(result.get("T8_30"));
	timeArr.push(true)
	timeArr.push(result.get("T8_30"));
	timeArr.push(result.get("T9_00"));
	timeArr.push(result.get("T9_30"));
	timeArr.push(result.get("T10_00"));
	timeArr.push(result.get("T10_30"));
	timeArr.push(result.get("T11_00"));
	timeArr.push(result.get("T11_30"));
	timeArr.push(result.get("T12_00"));
	timeArr.push(result.get("T12_30"));
	timeArr.push(result.get("T13_00"));
	timeArr.push(result.get("T13_30"));
	timeArr.push(result.get("T14_00"));
	timeArr.push(result.get("T14_30"));
	timeArr.push(result.get("T15_00"));
	timeArr.push(result.get("T15_30"));
	timeArr.push(result.get("T16_00"));
	timeArr.push(result.get("T16_30"));
	timeArr.push(result.get("T17_00"));
	timeArr.push(result.get("T17_30"));
	timeArr.push(result.get("T18_00"));
	timeArr.push(result.get("T18_30"));
	timeArr.push(result.get("T19_00"));
	timeArr.push(result.get("T19_30"));
	timeArr.push(result.get("T20_00"));
	timeArr.push(result.get("T20_30"));
	timeArr.push(result.get("T21_00"));
	timeArr.push(result.get("T21_30"));
	timeArr.push(result.get("T22_00"));
	timeArr.push(result.get("T22_30"));

	return timeArr;
}



