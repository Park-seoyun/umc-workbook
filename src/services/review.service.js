import { saveReview } from "../repositories/review.repository.js";
import { isStoreExist } from "../repositories/store.repository.js";
import { StoreNotFoundError } from "../errors.js";

export const addReview = async (userId, storeId, reviewData) => {
  // 검증: 가게가 존재하는지 확인
  const storeExists = await isStoreExist(storeId);
  
  if (!storeExists) {
    throw new StoreNotFoundError("해당 가게를 찾을 수 없습니다.", { storeId });
  }

  const newReviewId = await saveReview(userId, storeId, reviewData);
  return newReviewId;
};