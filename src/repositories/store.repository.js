import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// 지역 존재 확인 (검증용)
export const isRegionExist = async (regionId) => {
  try {
    const region = await prisma.region.findUnique({
      where: { id: BigInt(regionId) },
    });
    return region !== null;
  } catch (err) {
    throw err;
  }
};

// 가게 존재 확인 (검증용)
export const isStoreExist = async (storeId) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: BigInt(storeId) },
    });
    return store !== null;
  } catch (err) {
    throw err;
  }
};

// 가게 저장
export const saveStore = async (regionId, data) => {
  try {
    const store = await prisma.store.create({
      data: {
        name: data.name,
        address: data.address,
        regionId: BigInt(regionId),
      },
    });

    return Number(store.id); // BigInt를 Number로 변환
  } catch (err) {
    throw err;
  }
};