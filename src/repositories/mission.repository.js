import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// 미션 저장
export const saveMission = async (storeId, data) => {
  try {
    const mission = await prisma.mission.create({
      data: {
        storeId: BigInt(storeId),
        title: data.title,
        description: data.description,
        rewardPoints: parseInt(data.reward_points),
      },
    });

    return Number(mission.id); // BigInt를 Number로 변환
  } catch (err) {
    throw err;
  }
};

// 미션 존재 확인 (검증용)
export const isMissionExist = async (missionId) => {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: BigInt(missionId) },
    });
    return mission !== null;
  } catch (err) {
    throw err;
  }
};

// 이미 도전 중인지 확인 (검증용)
export const isMissionAlreadyChallenged = async (userId, missionId) => {
  try {
    const userMission = await prisma.userMission.findFirst({
      where: {
        userId: BigInt(userId),
        missionId: BigInt(missionId),
      },
    });
    return userMission !== null;
  } catch (err) {
    throw err;
  }
};

// 미션 시작 (user_missions에 추가)
export const startMission = async (userId, missionId) => {
  try {
    const userMission = await prisma.userMission.create({
      data: {
        userId: BigInt(userId),
        missionId: BigInt(missionId),
        status: "IN_PROGRESS",
      },
    });

    return Number(userMission.id); // BigInt를 Number로 변환
  } catch (err) {
    throw err;
  }
};