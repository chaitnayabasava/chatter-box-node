const mongoose = require('mongoose');

const { Schema } = mongoose;
const recentSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
  },
  connected: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

recentSchema.methods.newConnection = function (id) {
  // eslint-disable-next-line eqeqeq
  const idx = this.connected.findIndex((conId) => conId == id);
  if (idx === -1) this.connected.push(id);
  return this.save();
};

module.exports = mongoose.model('Recent-Chats', recentSchema);
