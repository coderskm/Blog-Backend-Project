const express = require("express");

const router = express.Router();
const BlogController = require("../controllers/blogController");
const AuthorController = require("../controllers/authorController");
const MWController = require("../middlewares/middleware");

router.post("/author", AuthorController.createAuthor);
router.post("/login", AuthorController.login);

router.post("/blogs", MWController.authenticate, BlogController.createBlog);
router.get("/blogs", MWController.authenticate, BlogController.getBlogs);
router.put("/blogs/:blogId", MWController.authenticate, BlogController.updateBlog);
router.delete("/blogs/:blogId", MWController.authenticate, BlogController.deleteBlog);


module.exports = router;
