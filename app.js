const express=require('express')
const app=express();
const product=require('./routes/productRoute')
app.use(express.json());

const errorMiddleware=require('./middleware/error')

app.use('/api/v1',product);
app.use(errorMiddleware);

module.exports=app;