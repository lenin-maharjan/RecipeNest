const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true }, // cloudinary public id
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    usedIn: { type: String, default: 'recipe' }, // what it was used for
  },
  { timestamps: true } // createdAt = exact upload time
);

module.exports = mongoose.model('Upload', uploadSchema);