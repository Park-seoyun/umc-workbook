import { StatusCodes } from "http-status-codes";
import { bodyToReview, responseFromReview } from "../dtos/review.dto.js";
import { addReview } from "../services/review.service.js";

export const handleAddReview = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const reviewData = bodyToReview(req.body);
    const userId = 1; // 미션 요구사항: "특정 사용자 (ex. 1번)"로 가정

    const result = await addReview(userId, storeId, reviewData);
    res
      .status(StatusCodes.CREATED)
      .json(responseFromReview(result, reviewData));
  } catch (error) {
    next(error);
  }
};