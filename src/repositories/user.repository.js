import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 사용자 추가 (회원가입)
export const addUser = async (data) => {
  try {
    // email 중복 검사
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new Error("이미 존재하는 이메일입니다.");
    }

    // nickname 중복 검사
    const existingNickname = await prisma.user.findUnique({
      where: { nickname: data.nickname },
    });

    if (existingNickname) {
      throw new Error("이미 존재하는 닉네임입니다.");
    }

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
        gender: data.gender,
        birthDate: new Date(data.birth_date),
        addressMain: data.address_main,
        createdAt: new Date(), 
        updatedAt: new Date(), 
      },
    });

    return Number(user.id); // BigInt를 Number로 변환
  } catch (err) {
    throw err;
  }
};

// 사용자 선호 카테고리 설정
export const setPreference = async (userId, categoryId) => {
  try {
    const preference = await prisma.user_food_preferences.create({
      data: {
        user_id: BigInt(userId),
        food_category_id: BigInt(categoryId),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return Number(preference.id);
  } catch (err) {
    throw err;
  }
};

// 사용자 정보 조회
export const getUser = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: {
        id: true,
        email: true,
        nickname: true,
        gender: true,
        birthDate: true,
        addressMain: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    // BigInt를 Number로 변환
    return {
      ...user,
      id: Number(user.id),
    };
  } catch (err) {
    throw err;
  }
};

// 사용자 선호 카테고리 조회
export const getUserPreferences = async (userId) => {
  try {
    const preferences = await prisma.user_food_preferences.findMany({
      where: { user_id: BigInt(userId) },
      include: {
        food_categories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // 응답 형식 변환
    return preferences.map((pref) => ({
      id: Number(pref.id),
      user_id: Number(pref.user_id),
      category_id: Number(pref.food_category_id),
      category_name: pref.food_categories.name,
    }));
  } catch (err) {
    throw err;
  }
};