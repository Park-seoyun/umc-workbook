// Body → 회원가입 데이터
export const bodyToUser = (body) => {
  return {
    email: body.email,
    password: body.password,
    nickname: body.nickname,
    gender: body.gender,
    birth_date: body.birth_date,
    address_main: body.address_main,
    preferences: body.preferences || [],
  };
};

// Body → 프로필 수정 데이터 (미션 2번)
export const bodyToUpdateProfile = (body) => {
  const updateData = {};
  
  // 전달된 필드만 포함 (PATCH이므로 일부만 수정 가능)
  if (body.nickname !== undefined) updateData.nickname = body.nickname;
  if (body.gender !== undefined) updateData.gender = body.gender;
  if (body.birth_date !== undefined) updateData.birthDate = new Date(body.birth_date);
  if (body.address_main !== undefined) updateData.addressMain = body.address_main;
  
  return updateData;
};

// 응답 데이터 변환
export const responseFromUser = (user) => {
  return {
    id: Number(user.id),
    email: user.email,
    nickname: user.nickname,
    gender: user.gender,
    birth_date: user.birthDate,
    address_main: user.addressMain,
  };
};