const router=require("express").Router();

const productController=require("../controllers/productsController");

router.post('/',productController.createProduct)
router.get('/',productController.getAllProducts)
router.get('/:id',productController.getProduct)
router.delete('/:id',productController.deleteProduct)
router.put('/:id',productController.updateProduct)
router.get('/search/:key',productController.searchProduct)

module.exports=router


