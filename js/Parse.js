Parse.initialize("VjKRngtz1yFy9XrA2YCjmnTr1Jn7XDHFBfT14zsF", "D0sZJ3i9C5NeXOIErxBzZq9qIx65FrTNgZLBZlvk");
var string = $('#size').find(":selected").text();
word = string.slice(0,1);
size = word.toUpperCase();
console.log(size);


var Rooms = Parse.Object.extend("Rooms");
var query = new Parse.Query(Rooms);
query.equalTo("size", size);
query.find({
  success:function(results){
    for (var i = 0; i < results.length; i++){
    	var object = results[i];
    	alert(object.get('room_name'));
    }
    

  },
  error:function(error){
    alert("Error"+ error.message);
  }

});


   
