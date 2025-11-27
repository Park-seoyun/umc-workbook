import { addUser, getUser, getUserPreferences, setPreference, updateUser } from "../repositories/user.repository.js";
import { DuplicateUserEmailError, DuplicateUserNicknameError } from "../errors.js";
import { responseFromUser } from "../dtos/user.dto.js";
import bcrypt from "bcrypt";

export const userSignUp = async (data) => {
  try {
    // 비밀번호 해싱
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // 사용자 추가
    const joinUserId = await addUser({
      email: data.email,
      password: hashedPassword,
      nickname: data.nickname,
      gender: data.gender,
      birth_date: data.birth_date,
      address_main: data.address_main,
    });

    // N:M 매핑 (선호 카테고리 처리)
    if (data.preferences && data.preferences.length > 0) {
      for (const categoryId of data.preferences) {
        await setPreference(joinUserId, categoryId);
      }
    }

    return { newUserId: joinUserId };
  } catch (error) {
    // 이메일 중복 에러
    if (error.message === "이미 존재하는 이메일입니다.") {
      throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", { email: data.email });
    }
    
    // 닉네임 중복 에러
    if (error.message === "이미 존재하는 닉네임입니다.") {
      throw new DuplicateUserNicknameError("이미 존재하는 닉네임입니다.", { nickname: data.nickname });
    }
    
    throw error;
  }
};

// 미션 2번: 사용자 프로필 수정
export const updateUserProfile = async (userId, updateData) => {
  try {
    const updatedUser = await updateUser(userId, updateData);
    return responseFromUser(updatedUser);
  } catch (error) {
    // 닉네임 중복 에러
    if (error.message === "이미 존재하는 닉네임입니다.") {
      throw new DuplicateUserNicknameError("이미 존재하는 닉네임입니다.", { nickname: updateData.nickname });
    }
    throw error;
  }
};