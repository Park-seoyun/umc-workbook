import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// 리뷰 저장
export const saveReview = async (userId, storeId, data) => {
  try {
    const review = await prisma.review.create({
      data: {
        userId: BigInt(userId),
        storeId: BigInt(storeId),
        rating: parseInt(data.rating),
        content: data.content,
      },
    });

    return Number(review.id); // BigInt를 Number로 변환
  } catch (err) {
    throw err;
  }
};