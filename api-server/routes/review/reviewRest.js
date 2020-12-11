const express = require("express");

const router = express.Router();

const Review = require("../../models/review").Review;

// GET /review
router.get("/", async (req, res, next) => {
  console.log("GET /review");
  try {
    const docs = await Review.find()
      .sort({createdAt: -1});
  
    res.send(docs); 
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// POST /review
router.post("/", async (req, res, next) => {
  console.log("POST /review");

  try {
    const content = req.body.content;
    const author = req.body.author
    const newReview = new Review({
      author, 
      content
    });
    const doc = await newReview.save();
    res.send({
      result: true
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// POST /review/delete
router.post("/delete", async (req, res, next) => {
  console.log("POST /review/delete");

  try {
    const doc = await Review.findByIdAndDelete(req.body.reviewId);
    res.send(doc);
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
})

module.exports = router;

