const mongoose = require("mongoose");

const Bags = mongoose.model("Bag", {
	id : {type : String},
	value : {type : Array},
	maxValue : {type : Number}
})

module.exports = Bags;