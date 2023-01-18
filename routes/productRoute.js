const express=require('express')
const router=express.Router();
const {getAllProduct,createProduct,updateProduct, deleteProduct, getDetail}=require('../controllers/productC')


// router.get('/products',getAllProduct
// );
//get
router.route('/products').get(getAllProduct)
//post
router.route('/product/new').post(createProduct)
//put
router.route('/product/:id').put(updateProduct).delete(deleteProduct).get(getDetail)

module.exports=router;



