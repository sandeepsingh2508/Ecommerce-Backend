const Product=require('../models/productSchema')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError=require('../middleware/catchAsyncError')
const ApiFeatures = require('../utils/apiFeatures')


//particular product detail
exports.getDetail=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.params.id)

     if(!product){
        return next(new ErrorHandler('product  not found',404))
    //     return res.status(500).json({
    //         success:false,
    //         massage:'product not found'
    //     })
     } 
    res.status(200).json({
        success:true,
        product
    })
})

//Delete product
exports.deleteProduct=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler(`product not found`,404))
    }
    await product.remove()
    res.status(200).json({
        success:true,
        massage:'Product deletion success'
    })
})

//update product
exports.updateProduct =catchAsyncError( async(req,res,next)=>{
    let product= await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler(`product not found`,404))
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndMidify:false
    })
    res.status(200).json({
        success:true,
        product
    })
})

//create product
exports.createProduct= catchAsyncError(async(req,res)=>{
    const product=await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })

})
//get all product


exports.getAllProduct=catchAsyncError(async(req,res)=>{
    const resultPerPage=5;
    const countProducts= await Product.countDocuments();
    const apiFeature= new ApiFeatures(Product.find(),req.query)
    .search()
    .filter().pagination(resultPerPage);
    const product= await apiFeature.query;
    res.status(200).json({
        success:true,
        product,
        countProducts
    });
})
