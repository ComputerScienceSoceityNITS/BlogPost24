import { Schema, model, CallbackError } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: {
    type: "string",
    required: true,
  },
  email: { type: "string", required: true },
  password: { type: "string", required: true },
  dob: { type: Date},
});

userSchema.pre('save', async function (next) { 
if (!this.isModified("password")) return next();
try {
  const salt = await bcrypt.genSalt(<number|undefined>process.env.SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
} catch (err:CallbackError | any) {
  return next(err);
}
})


const UserSchema = model('user', userSchema);

export {UserSchema}