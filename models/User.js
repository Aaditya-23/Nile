import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    lowercase: true,
    default: null,
  },
  avatarUrl: {
    type: String,
    default: null,
  },
  contactNum: {
    type: Number,
    min: 10,
    max: 10,
    default: null,
    },
  
});

const User = mongoose.model("User", UserSchema);
export default User;
