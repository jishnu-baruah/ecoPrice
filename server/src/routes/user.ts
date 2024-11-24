import { Router } from 'express';
import { 
  registerUser, 
  loginUser, 
  updateProfile, 
  getSavedProducts, 
  saveProduct 
} from '../controllers/user';
import { authenticateToken } from '../middleware/auth';
import { validateRegistration, validateLogin, validateProfileUpdate } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register',  validateRegistration, registerUser);
router.post('/login',validateLogin, loginUser);

// Protected routes
router.use(authenticateToken);
router.patch('/profile', validateProfileUpdate, updateProfile);
router.get('/saved-products', getSavedProducts);
router.post('/saved-products', saveProduct);

export default router;