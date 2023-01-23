const express = require("express");
const router = express.Router();
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  createProductReview,
  getAllReviews,
  deleteReviews,
} = require("../controllers/productC");
const { isAuthenticationUser,authorizeRoles } = require("../middleware/auth");

// router.get('/products',getAllProduct
// );
//get
router.route("/products").get( getAllProduct);
//post
router.route("/admin/product/new").post(isAuthenticationUser,authorizeRoles('admin'),createProduct); 
//put
router
  .route("/admin/product/:id")
  .put(isAuthenticationUser,authorizeRoles('admin'),updateProduct)
  .delete(isAuthenticationUser,authorizeRoles('admin'),deleteProduct)
 
  router.route('product/:id').get(getProductDetail)
  router.route('/review').post(isAuthenticationUser,createProductReview)
  router.route('/review').get(getAllReviews).delete(isAuthenticationUser,deleteReviews)

module.exports = router;
