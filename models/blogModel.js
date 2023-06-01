const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim:true
    },
    body: {
      type: String,
      required: true,
      trim:true
    },
    authorId: {
      type: ObjectId,
      ref: 'author',
     required: true,
    },
    category: {
      type: String,
      required: true, 
      trim:true
    }, 
    deletedAt: { type: Date },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestand: true }
);
module.exports = mongoose.model("blog", blogSchema);
 