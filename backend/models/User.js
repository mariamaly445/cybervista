// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    companyName: { 
      type: String, 
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Company name must be at least 2 characters'],
      maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: { 
      type: String, 
      enum: ['admin', 'company'], 
      default: 'company' 
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    // this auto-adds createdAt and updatedAt
    timestamps: true
  }
);

// 🔐 Hash password before saving
// NOTE: no `next` argument, no `next()` calls.
UserSchema.pre('save', function () {
  const user = this;

  // Only hash if password is new/changed
  if (!user.isModified('password')) return;

  return bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(user.password, salt))
    .then((hash) => {
      user.password = hash;
    });
});

// Compare plain password to hashed password
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
