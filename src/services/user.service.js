
import { addUser, getUser, getUserPreferences } from "../repositories/user.repository.js"; // (getUser 등은 예시)
import { setPreference } from "../repositories/user.repository.js"; // (선호 카테고리 매핑용)
import bcrypt from "bcrypt";

export const userSignUp = async (data) => {
  //  비밀번호 해싱
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  //  해싱된 비밀번호로 addUser 호출
  const joinUserId = await addUser({
    email: data.email,
    password: hashedPassword,
    nickname: data.nickname,
    gender: data.gender,
    birth_date: data.birth_date,
    address_main: data.address_main,
  });

  //  N:M 매핑 (선호 카테고리 처리)
  // (data.preferences 배열을 순회하며 user_food_preferences 테이블에 INSERT)
  if (data.preferences && data.preferences.length > 0) {
    for (const categoryId of data.preferences) {
      // (setPreference 함수는 user.repository.js에 별도 구현 필요)
      // await setPreference(joinUserId, categoryId); 
    }
  }

  //  가입된 유저 정보 반환 (컨트롤러에서 응답할 수 있도록)
  // (getUser, getUserPreferences 등은 repository에 구현 필요)
  // const user = await getUser(joinUserId); 
  // const preferences = await getUserPreferences(joinUserId);
  
  // return responseFromUser(user, preferences);

  return { newUserId: joinUserId }; // 우선 ID만 반환
};