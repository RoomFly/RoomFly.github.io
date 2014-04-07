Parse.initialize("VjKRngtz1yFy9XrA2YCjmnTr1Jn7XDHFBfT14zsF", "D0sZJ3i9C5NeXOIErxBzZq9qIx65FrTNgZLBZlvk");

var Rooms = Parse.Object.extend("Rooms");
var query = new Parse.Query(Rooms);
query.equalTo("room_name","TCHAUD");
query.find({
  success:function(results){
    alert(results.length);
  },
  error:function(error){
    alert("Error"+ error.message);
  }

});
   
