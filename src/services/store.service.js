
import { isRegionExist, saveStore } from "../repositories/store.repository.js";

export const addStore = async (regionId, storeData) => {
  // 검증: 지역이 실제로 존재하는지 확인
  const regionExists = await isRegionExist(regionId);
  if (!regionExists) {
    //구체적인 에러 객체 반환
    const error = new Error("해당 지역을 찾을 수 없습니다.");
    error.status = StatusCodes.NOT_FOUND; // (에러 핸들러에서 사용)
    throw error;
  }

  // DB에 저장 요청
  const newStoreId = await saveStore(regionId, storeData);
  return newStoreId;
};