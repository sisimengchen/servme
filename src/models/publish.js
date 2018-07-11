const mongoose = require('mongoose');

const PublishSchema = new mongoose.Schema({
  email: { type: String, required: true },
  path: { type: String, required: true },
  file: { type: String, required: true },
  password: { type: String },
  is_update: { type: Number, default: 0 },
  create_time: { type: Number, default: Date.now }
});

PublishSchema.index({ create_time: -1 });

PublishSchema.statics.getByEmail = async function(email) {
  const publish = await this.find({ email: email });
  return publish;
};

PublishSchema.statics.getTopByPath = async function(path) {
  const publish = await this.findOne({ path: path }).sort({
    create_time: -1
  });
  return publish;
};

PublishSchema.statics.getAllPublish = async function() {
  const publishs = await this.find({}, { password: 0 }).sort({
    create_time: -1
  });
  // .sort({ create_time: -1 })
  // .skip(0)
  // .limit(2);
  return publishs;
};

module.exports = PublishSchema;
