import {
  saveMission,
  isMissionAlreadyChallenged,
  isMissionExist,
  startMission,
} from "../repositories/mission.repository.js";
import { isStoreExist } from "../repositories/store.repository.js";
import { StoreNotFoundError, MissionNotFoundError, MissionAlreadyChallengingError } from "../errors.js";

// 1-3. 가게에 미션 추가하기
export const addMission = async (storeId, missionData) => {
  // 검증: 가게가 존재하는지 확인
  const storeExists = await isStoreExist(storeId);
  
  if (!storeExists) {
    throw new StoreNotFoundError("해당 가게를 찾을 수 없습니다.", { storeId });
  }

  const newMissionId = await saveMission(storeId, missionData);
  return newMissionId;
};

// 1-4. 미션 도전하기
export const challengeMission = async (userId, missionId) => {
  // 검증 1: 미션 자체가 존재하는지 확인
  const missionExists = await isMissionExist(missionId);
  
  if (!missionExists) {
    throw new MissionNotFoundError("존재하지 않는 미션입니다.", { missionId });
  }

  // 검증 2: 이미 도전 중인 미션인지 확인
  const isChallenged = await isMissionAlreadyChallenged(userId, missionId);
  
  if (isChallenged) {
    throw new MissionAlreadyChallengingError("이미 도전 중인 미션입니다.", { userId, missionId });
  }

  const newUserMissionId = await startMission(userId, missionId);
  return newUserMissionId;
};