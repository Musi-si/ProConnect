import { Request, Response } from 'express';
import { Review } from '../models/review';

export class ReviewsController {
  // Get reviews for a specific user (reviewee)
  async getUserReviews(req: Request, res: Response) {
    try {
      const reviews = await Review.findAll({ where: { revieweeId: req.params.userId } });
      res.json(reviews);
    } catch (error) {
      console.error('Get user reviews error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Create a review
  async createReview(req: Request, res: Response) {
    try {
      const review = await Review.create(req.body);
      res.status(201).json(review);
    } catch (error) {
      console.error('Create review error:', error);
      res.status(400).json({ message: 'Error creating review', error });
    }
  }

  // Update a review (optional)
  async updateReview(req: Request, res: Response) {
    try {
      const review = await Review.findByPk(req.params.id);
      if (!review) return res.status(404).json({ message: 'Review not found' });

      await review.update(req.body);
      res.json(review);
    } catch (error) {
      console.error('Update review error:', error);
      res.status(400).json({ message: 'Error updating review', error });
    }
  }

  // Delete a review (optional)
  async deleteReview(req: Request, res: Response) {
    try {
      const review = await Review.findByPk(req.params.id);
      if (!review) return res.status(404).json({ message: 'Review not found' });

      await review.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({ message: 'Error deleting review', error });
    }
  }
}
