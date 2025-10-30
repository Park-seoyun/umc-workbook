export const bodyToReview = (body) => ({
  rating: body.rating,
  content: body.content,
});

export const responseFromReview = (reviewId, data) => ({
  reviewId: reviewId,
  ...data,
});