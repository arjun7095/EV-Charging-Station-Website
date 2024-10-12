const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For hashing passwords

const retailerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    match: /.+\@.+\..+/ // Simple email validation
  },
  password: {
    type: String,
    required: true,
  },
  address:{
    type:String,
    required:true
  },
  mobile: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // Simple validation for 10-digit mobile number
  },
  
}, { timestamps: true });

// Hash the password before saving
retailerSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
retailerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Retailer = mongoose.model('Retailer', retailerSchema);

module.exports = Retailer;
