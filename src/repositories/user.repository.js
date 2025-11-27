import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 이메일로 사용자 조회
export const getUserByEmail = async (email) => {
  const user = await prisma.user.findFirst({ where: { email } });
  return user;
};

// 닉네임으로 사용자 조회
export const getUserByNickname = async (nickname) => {
  const user = await prisma.user.findFirst({ where: { nickname } });
  return user;
};

// 사용자 추가
export const addUser = async (data) => {
  // 이메일 중복 확인
  const existingEmail = await getUserByEmail(data.email);
  if (existingEmail) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  // 닉네임 중복 확인
  const existingNickname = await getUserByNickname(data.nickname);
  if (existingNickname) {
    throw new Error("이미 존재하는 닉네임입니다.");
  }

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      nickname: data.nickname,
      gender: data.gender,
      birthDate: data.birth_date ? new Date(data.birth_date) : null,
      addressMain: data.address_main,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return Number(user.id);
};

// 사용자 정보 수정 (미션 2번)
export const updateUser = async (userId, updateData) => {
  // 닉네임 변경 시 중복 확인
  if (updateData.nickname) {
    const existingNickname = await prisma.user.findFirst({
      where: {
        nickname: updateData.nickname,
        NOT: { id: BigInt(userId) },
      },
    });
    if (existingNickname) {
      throw new Error("이미 존재하는 닉네임입니다.");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: BigInt(userId) },
    data: {
      ...updateData,
      updatedAt: new Date(),
    },
  });

  return updatedUser;
};

// 사용자 조회
export const getUser = async (userId) => {
  const user = await prisma.user.findFirst({ where: { id: BigInt(userId) } });
  return user;
};

// 사용자 선호 음식 조회
export const getUserPreferences = async (userId) => {
  const preferences = await prisma.user_food_preferences.findMany({
    where: { user_id: BigInt(userId) },
    include: { food_categories: true },
  });
  return preferences;
};

// 사용자 선호 음식 추가
export const setPreference = async (userId, categoryId) => {
  await prisma.user_food_preferences.create({
    data: {
      user_id: BigInt(userId),
      food_category_id: BigInt(categoryId),
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
};