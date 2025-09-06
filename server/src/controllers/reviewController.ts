import { Request, Response } from 'express';
import Review from '../models/reviewModel';

export class ReviewController {
  async getReviewsByUser(req: Request, res: Response) {
    try {
      const reviews = await Review.find({ revieweeId: req.params.userId });
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async createReview(req: Request, res: Response) {
    try {
      const review = new Review(req.body);
      await review.save();
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: 'Error creating review', error });
    }
  }
}