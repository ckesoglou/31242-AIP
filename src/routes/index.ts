import { Router } from 'express';
import UserRouter from './Users';
import SignUpRouter from './SignUp';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/signup', SignUpRouter);

// Export the base-router
export default router;
