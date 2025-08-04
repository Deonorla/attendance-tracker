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

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true,
  },
  signIn: {
    time: Date,
    location: {
      latitude: Number,
      longitude: Number,
      accuracy: Number,
    },
  },
  signOut: {
    time: Date,
    location: {
      latitude: Number,
      longitude: Number,
      accuracy: Number,
    },
  },
  status: {
    type: String,
    enum: ["present", "partial", "absent"],
    default: "absent",
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
  attendance: [attendanceSchema],
  lastActive: Date,
});

attendanceSchema.pre("save", function (next) {
  // Only update status if this is a new record or signOut is being modified
  if (this.isModified("signIn") || this.isModified("signOut")) {
    if (this.signIn && this.signOut) {
      this.status = "present";
    } else if (this.signIn) {
      this.status = "partial";
    } else {
      this.status = "absent";
    }
  }
  next();
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
