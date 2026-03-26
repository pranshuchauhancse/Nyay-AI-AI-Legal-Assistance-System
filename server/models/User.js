const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['citizen', 'lawyer', 'judge', 'police', 'admin'],
      default: 'citizen',
    },
    profilePic: {
      type: String,
      default: null,
    },
    // Lawyer specific fields
    licenseNumber: {
      type: String,
      default: null,
    },
    specialization: {
      type: String,
      default: null,
    },
    officeAddress: {
      type: String,
      default: null,
    },
    // Judge specific fields
    courtName: {
      type: String,
      default: null,
    },
    // Police specific fields
    badgeNumber: {
      type: String,
      default: null,
    },
    division: {
      type: String,
      default: null,
    },
    rank: {
      type: String,
      default: null,
    },
    // Citizen specific fields
    phone: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    // Common fields for multiple roles
    experience: {
      type: Number,
      default: null,
    },
    yearsOfService: {
      type: Number,
      default: null,
    },
    department: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
