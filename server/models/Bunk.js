const mongoose = require('mongoose');

const bunkSchema = new mongoose.Schema({
  bunkName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    match: /.+\@.+\..+/ // Simple email validation
  },
  mobileNumber: {
    type: Number,
    required: true,
    match: /^[0-9]{10}$/,
  },
  address:{
    type:String,
    required:true
  },
  numberOfSlots: {
    type: Number,
    required: true,
  },
  availableSlots: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  
}, { timestamps: true });


const Bunk = mongoose.model('Bunk', bunkSchema);

module.exports = Bunk;
