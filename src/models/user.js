const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true, unique: true },
  mob: { type: String, required: true },
  name: { type: String, required: true },
  permission: { type: Number, default: 2 },
  create_time: { type: Number, default: Date.now }
});

// UserSchema.set("toObject", { getters: true, virtuals: true });

// UserSchema.index({ email: 1 }, { unique: true });

/**
 * mob写入时加密
 */
// UserSchema.path("mob").set(function(v) {
//   return crypto
//     .createHash("md5")
//     .update(v)
//     .digest("base64");
// });

UserSchema.statics.getUser = async function(email) {
  const user = await this.findOne({ email: email });
  return user;
};

UserSchema.statics.setPermission = async function(email, permission) {
  const user = await this.findOneAndUpdate({ email: email }, { permission: permission }, { new: true });
  return user;
};

module.exports = UserSchema;
