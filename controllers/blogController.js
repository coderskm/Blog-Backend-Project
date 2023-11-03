const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const mongoose = require("mongoose");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidBody = function (body) {
  return Object.keys(body).length > 0;
};

const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};


const createBlog = async function (req, res) {
  try {
    const data = req.body;
    if (!isValidBody(data))
      return res
        .status(400)
        .send({ status: false, msg: "can not enter blog without data" });

    let { title, body, authorId, category, isPublished } =
      data;

    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "Title is required" });
    }
    if (!isValid(body)) {
      return res.status(400).send({ status: false, msg: "body is required" });
    }
    if (!isValidObjectId(authorId)) {
      return res
        .status(400)
        .send({ status: false, msg: "authorId is required" });
    }
    if (authorId != req.decodedToken.authorId) {
      return res.status(403).send({ status: false, msg: "not authorized. Login from your own account" });
    }
    if (!isValid(category)) {
      return res
        .status(400)
        .send({ status: false, msg: "category is required" });
    }

    if (isPublished===true) {
      data.publishedAt = new Date();
    }
    
    let authorData = await authorModel.findById(authorId);
    if (!authorData)
      return res.status(400).send({ status: false, msg: "authorId not found" });

    const createdBlog = await blogModel.create(data);
    res.status(201).send({ status: true, data: createdBlog });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const getBlogs = async function (req, res) {
  try {
    const blogs = await blogModel.find({});
    return res.status(200).send({ msg: "list of all blogs", data: blogs });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}

const updateBlog = async function (req, res) {
  try {
    let data = req.body;
    if (!isValidBody(data)) {
      return res.status(400).send({ status: false, msg: "enter valid data" });
    }
    const blogs = await blogModel.findOne({
      _id: req.params.blogId,
      isDeleted: false,
    });
    if (!blogs) {
      return res.status(404).send({ status: false, msg: "no blogs found" });
    }
    if (blogs.authorId != req.decodedToken.authorId) {
      return res.status(403).send({ status: false, msg: "not authorized" });
    }
    let updatedData = {  };
    if (data.title) {
      if (!isValid(data.title)) {
        return res.status(400).send({ status: false, msg: " title not valid" });
      } else {
        updatedData.title = data.title;
      }  
    }

    if (data.body) {
      if (!isValid(data.body)) {
        return res.status(400).send({ status: false, msg: " title not valid" });
      } else {
      updatedData.body = data.body;
      }
    }
    if (data.category) {
      if (!isValid(data.category)) {
        return res.status(400).send({ status: false, msg: " category not valid" });
      } else {
      updatedData.category = data.category;
      }
    }
    if (data.isPublished) {
      if (data.isPublished === true) {
        updatedData.publishedAt = new Date();
      }
      updatedData.isPublished = data.isPublished;
    } else {
        updatedData.publishedAt = null;
      updatedData.isPublished = data.isPublished;
      
    }

    let updatedBlog = await blogModel.findOneAndUpdate(
      { _id: req.params.blogId, isDeleted: false },
      updatedData,
      { new: true }
    );
    return res.status(200).send({ msg: " updated", data: updatedBlog });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    if (!isValidObjectId(blogId)) {
      return res
        .status(400)
        .send({ status: false, msg: "blog id not entered" });
    }

    let blog = await blogModel.findOne({
      $and: [{ _id: blogId }, { isDeleted: false }],
    });
    if (!blog) {
      return res
        .status(404)
        .send({ status: false, msg: "No such blog exists or blog is deleted" });
    }
    if (blog.authorId != req.decodedToken.authorId) {
      return res.status(403).send({ status: false, msg: "not authorized" });
    }

    let afterDelete = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true }, deletedAt: new Date() },
      { new: true }
    );
    return res.status(200).send({ status: true, msg: afterDelete });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};



module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.createBlog = createBlog;
module.exports.deleteBlog = deleteBlog;
