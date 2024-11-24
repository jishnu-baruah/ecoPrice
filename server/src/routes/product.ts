import { Router } from 'express';
import { searchProducts, getProductDetails, getFeaturedProducts } from '../controllers/product';
import { validateSearchQuery, validateProductId } from '../middleware/validation';


const router = Router();


// Product routes
router.get('/search', validateSearchQuery, searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', validateProductId, getProductDetails);

export default router;