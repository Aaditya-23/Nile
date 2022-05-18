import mongoose from "mongoose";
import multer from "multer";
import path from "path";
const __dirname = path.resolve();
const imageURL = path.join("/uploads/user-images");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
    },
    lastName: {
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
    address: {
      type: String,
      default: null,
    },
    wishlist: [
      {
        type: String,
        default: null,
      },
    ],
    cart: [
      {
        _id: {
          type: String,
          default: null,
        },
        quantity: {
          type: Number,
          default: null,
          max: 5,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, imageURL));
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    const suffix = `-${Date.now()}.${extension}`;
    cb(null, file.fieldname + suffix);
  },
});

const fileFilter = (req, file, cb) => {
  const type = file.mimetype;

  switch (type) {
    case "image/jpeg":
      cb(null, true);
      break;
    case "image/png":
      cb(null, true);
      break;
    case "image/jpg":
      cb(null, true);
      break;
    default:
      cb(null, false);
  }
};

const uploadImage = multer({ storage: storage, fileFilter: fileFilter }).single(
  "userImage"
);

const User = mongoose.model("User", UserSchema);
export { uploadImage, imageURL };
export default User;
