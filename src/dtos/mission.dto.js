/* src/dtos/mission.dto.js */

// 1-3. 미션 추가 Request DTO
export const bodyToMission = (body) => ({
  title: body.title,
  description: body.description,
  reward_points: body.reward_points,
});

// 1-3. 미션 추가 Response DTO
export const responseFromMission = (missionId, data) => ({
  missionId: missionId,
  ...data,
});

// 1-4. 미션 도전 Response DTO
export const responseFromChallenge = (userMissionId, missionId, status) => ({
  userMissionId,
  missionId,
  status,
});