
import { saveReview } from "../repositories/review.repository.js";
import { isStoreExist } from "../repositories/store.repository.js"; // store 레포지토리 재사용
import { StatusCodes } from "http-status-codes";

export const addReview = async (userId, storeId, reviewData) => {
  // 검증: 가게가 존재하는지 확인 (미션 요구사항)
  const storeExists = await isStoreExist(storeId); // (store.repository.js 재사용)
  if (!storeExists) {
    const error = new Error("해당 가게를 찾을 수 없습니다.");
    error.status = StatusCodes.NOT_FOUND;
    throw error;
  }

  const newReviewId = await saveReview(userId, storeId, reviewData);
  return newReviewId;
};