import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const reviewController = new ReviewController();

router.get('/user/:userId', reviewController.getReviewsByUser);
router.post('/', authMiddleware, reviewController.createReview);

export default router;