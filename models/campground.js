var mongoose = require("mongoose");

//Schema setup
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   location: String,
   lat: Number,
   lng: Number,
   createdAt: {type: Date, default: Date.now},
   price: String,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
});

var Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;