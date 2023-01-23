const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const User = require("../models/usreSchema");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//register user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avtar: {
      public_id: "this is a sample id",
      url: "propfileUrl",
    },
  });

  sendToken(user, 201, res);
  // const token = user.getJWTToken();
  // res.status(201).json({
  //   success: true,
  //   token,
  // });
});

//login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  //checking if user has given email or password
  if (!email || !password) {
    return next(new ErrorHandler("please enter email and password", 401));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

//Logout
exports.logOut = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

//Forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //get resetPassword token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `password resetToken is :-\n\n ${resetPasswordUrl} \n\n if you have not requested 
  this email,please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce password recory`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("password does not matched", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

//User Details
exports.getUserDetails=catchAsyncError(async(req,res,next)=>{
  const user =await User.findById(req.user.id);

  res.status(200).json({
    success:true,
    user
  })
})

//Update password
exports.updatePassword=catchAsyncError(async(req,res,next)=>{
  const user= await User.findById(req.user.id).select('+password')
  
  const isPasswordMatched= await user.comparePassword(req.body.oldPassword);
  if(!isPasswordMatched){
    return next (new ErrorHandler('Old password is incorrect',400))
  }
  if(req.body.newPassword!==req.body.confirmPassword){
    return next(new ErrorHandler(`password does not match`));
  }
  user.password=req.body.newPassword;
  await user.save()
  sendToken(user,200,res)
})
//update profile --Admin
exports.updateProfile=catchAsyncError(async(req,res,next)=>{
  const newUserData={
    name:req.body.name,
    email:req.body.email,
   
  };
  const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false
  });
  res.status(200).json({
    success:true,
  })
});
//get all Users(admin)
exports.getAllUsers=catchAsyncError(async(req,res,next)=>{
  const  users=await User.find()
  res.status(200).json({
    success:true,
    users
  })
})
//get  single user (admin)
exports.getSingleUser=catchAsyncError(async(req,res,next)=>{
  const  user=await User.findById(req.params.id)
  if(!user){
    return next(new ErrorHandler(`User does not exist with id:${req.params.id}`))
  }
  res.status(200).json({
    success:true,
    user
  })
})
//Update role --Admin
exports.updateUserRole=catchAsyncError(async(req,res,next)=>{
  const newUserData={
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  };
  const user= await User.findByIdAndUpdate(req.params.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false
  });
  res.status(200).json({
    success:true,
  })
});
//Delete User
exports.deleteUser=catchAsyncError(async(req,res,next)=>{
  
  const user= await User.findById(req.params.id)
  if(!user){
    return next(new ErrorHandler(`User does not exist with Id:${req.params.id}`))
  }
  await user.remove();
  res.status(200).json({
    success:true,
    message:"User deleted successfully"
  })
});