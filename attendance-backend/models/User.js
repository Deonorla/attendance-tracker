const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);

const LocationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: { type: String, required: true },
  signupLocation: LocationSchema, // Store signup location
  lastLoginLocation: LocationSchema, // Track last login location
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
