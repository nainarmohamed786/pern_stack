import express from 'express';
import {getProducts,createProduct, updateProduct, getProduct, deleteProduct} from '../controller/product.js';
const router = express.Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id',updateProduct);
router.get('/:id', getProduct);
router.delete("/:id",deleteProduct);


export default router;
