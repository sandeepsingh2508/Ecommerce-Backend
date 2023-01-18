const mongoose = require('mongoose')

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter product name'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'please enter product description']
    },
    price:{
        type:Number,
        required:[true,'please enter product price'],
        maxLength:[8,'price cannot exceed 8 charecters']
    },
    rating:{
        type:Number,
        default:0
    },
    image:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }  
    ],
    category:{
        type:String,
        required:[true,'please enter product category'],
    },
    stock:{
        type:Number,
        required:[true,'Please Enter product stock'],
        maxLength:[4,'stock cannot exceed 4 charecters'],
        default:1
    },
    numOfRviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('Product',productSchema);