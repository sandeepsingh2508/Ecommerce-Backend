const Product = require("../models/productSchema");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

//particular product detail
exports.getProductDetail = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product  not found", 404));
    //     return res.status(500).json({
    //         success:false,
    //         massage:'product not found'
    //     })
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//Delete product
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler(`product not found`, 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    massage: "Product deletion success",
  });
});

//update product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler(`product not found`, 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndMidify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//create product
exports.createProduct = catchAsyncError(async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});
//get all product
exports.getAllProduct = catchAsyncError(async (req, res) => {
  const resultPerPage = 5;
  const countProducts = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const product = await apiFeature.query;
  res.status(200).json({
    success: true,
    product,
    countProducts,
  });
});
//Create Product Review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

//get all reviews
exports.getAllReviews=catchAsyncError(async(req,res,next)=>{
    const product= await Product.findById(req.query.id)
    if(!product){
        return next(new ErrorHandler('product not found',404))
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    });
});

//Delete Reviews
exports.deleteReviews=catchAsyncError(async(req,res,next)=>{
    const product= await Product.findById(req.query.productId)
    if(!product){
        return next(new ErrorHandler('product not found',404))
    }
    const reviews=product.reviews.filter(
        (rev) => rev._id.toString()!==req.query.id.toString()
    )
    
    let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg /reviews.length;
  const numOfReviews=reviews.length

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
        reviews,
        ratings,
        numOfReviews
    },
    {
        new:true,
        runValidators:true,
        useFindAndMidify:false
    }
  );

    res.status(200).json({
        success:true,
       
    });
});

