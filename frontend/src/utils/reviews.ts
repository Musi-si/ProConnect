// src/services/reviews.ts
import {api} from './api'
import { Review } from '../types'

// Fetch reviews for a user
export const getReviews = async (userId: string): Promise<Review[]> => {
  try {
    const res = await api.get(`/reviews/user/${userId}`)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews')
  }
}

// Add review
export const addReview = async (review: Partial<Review>): Promise<Review> => {
  try {
    const res = await api.post('/reviews/add', review)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add review')
  }
}
