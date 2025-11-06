import { StatusCodes } from "http-status-codes";
import {
  bodyToMission,
  responseFromMission,
  responseFromChallenge,
} from "../dtos/mission.dto.js";
import { addMission, challengeMission } from "../services/mission.service.js";

// 1-3. 가게에 미션 추가하기
export const handleAddMission = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const missionData = bodyToMission(req.body);
    const result = await addMission(storeId, missionData);
    res
      .status(StatusCodes.CREATED)
      .json(responseFromMission(result, missionData));
  } catch (error) {
    next(error);
  }
};

// 1-4. 미션 도전하기
export const handleChallengeMission = async (req, res, next) => {
  try {
    const { missionId } = req.params;
    const userId = 1; // 미션 요구사항: "특정 사용자 (ex. 1번)"로 가정

    const result = await challengeMission(userId, missionId);
    res
      .status(StatusCodes.CREATED)
      .json(responseFromChallenge(result, missionId, "IN_PROGRESS"));
  } catch (error) {
    next(error);
  }
};