import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body);

  // 1. try 블록으로 감싸기
  try {
    const user = await userSignUp(bodyToUser(req.body));
    // 2. 성공 시 응답
    res.status(StatusCodes.OK).json({ result: user });

  // 3. catch 블록 추가
  } catch (error) {
    // 4. 터미널에 에러 로그 출력 (필수!)
    console.error("Signup Error:", error); 

    // 5. Postman(클라이언트)에 에러 응답 전송
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "서버 내부 오류가 발생했습니다.",
    });
  }
};