const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true,
      unique: true,
      minLength: 10
  },
  password : {
      type: String,
      required: true
  },
  tasks : [{ type: mongoose.Schema.Types.ObjectId, ref: "Task", default: [] }]
});

module.exports = new mongoose.model("User", userSchema);
