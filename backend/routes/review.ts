import { Router } from 'express';
import { ReviewsController } from '../controllers/review';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const reviewsController = new ReviewsController();

// Get reviews for a user (reviewee)
router.get('/user/:userId', authMiddleware, reviewsController.getUserReviews.bind(reviewsController));

// Create a review
router.post('/', authMiddleware, reviewsController.createReview.bind(reviewsController));

// Optional: Update review
router.put('/:id', authMiddleware, reviewsController.updateReview.bind(reviewsController));

// Optional: Delete review
router.delete('/:id', authMiddleware, reviewsController.deleteReview.bind(reviewsController));

export default router;
