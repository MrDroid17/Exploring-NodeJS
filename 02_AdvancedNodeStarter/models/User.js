const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,    // google or github id
  displayName: String
});

mongoose.model('User', userSchema);
