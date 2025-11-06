
export const bodyToUser = (body) => {
  return {
    email: body.email,
    password: body.password, // password 추가
    nickname: body.nickname,
    gender: body.gender,
    birth_date: body.birth_date,
    address_main: body.address_main,
    preferences: body.preferences, // (N:M 관계는 별도 처리)
  };
};