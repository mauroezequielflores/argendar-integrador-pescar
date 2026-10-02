import * as clientReviewService from '../services/clientReviewService.js';

export const createReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reviewData = req.body;
    
    const newReview = await clientReviewService.createReview(userId, reviewData);
    
    res.status(201).json({
      message: "Calificación enviada con éxito.",
      data: {
        id: newReview.id,
        appointmentId: newReview.appointment_id,
        rating: newReview.rating,
        tags: newReview.tags,
        comment: newReview.comment,
        createdAt: newReview.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};
