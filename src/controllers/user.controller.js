import { StatusCodes } from "http-status-codes";
import { bodyToUser, bodyToUpdateProfile } from "../dtos/user.dto.js";
import { userSignUp, updateUserProfile } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '회원 가입 API';
    #swagger.tags = ['User']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password", "nickname"],
            properties: {
              email: { type: "string", format: "email", example: "user@example.com" },
              password: { type: "string", format: "password", example: "password123" },
              nickname: { type: "string", example: "테스트유저" },
              gender: { type: "string", enum: ["MALE", "FEMALE"], example: "MALE" },
              birth_date: { type: "string", format: "date", example: "1995-05-15" },
              address_main: { type: "string", example: "서울시 강남구" },
              preferences: { type: "array", items: { type: "number" }, example: [1, 2, 3] }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원 가입 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  newUserId: { type: "number", example: 1 }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[409] = {
      description: "이메일 또는 닉네임 중복",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U001" },
                  reason: { type: "string", example: "이미 존재하는 이메일입니다." },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body);

  try {
    const user = await userSignUp(bodyToUser(req.body));
    res.status(StatusCodes.OK).success(user);
  } catch (error) {
    next(error);
  }
};

// 미션 2번: 내 정보 수정 API
export const handleUpdateProfile = async (req, res, next) => {
  /*
    #swagger.summary = '내 정보 수정 API';
    #swagger.tags = ['User']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              nickname: { type: "string", example: "새닉네임" },
              gender: { type: "string", enum: ["MALE", "FEMALE", "UNKNOWN"], example: "MALE" },
              birth_date: { type: "string", format: "date", example: "1995-05-15" },
              address_main: { type: "string", example: "서울시 강남구" }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "정보 수정 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  id: { type: "number", example: 1 },
                  email: { type: "string", example: "user@example.com" },
                  nickname: { type: "string", example: "새닉네임" },
                  gender: { type: "string", example: "MALE" },
                  birth_date: { type: "string", example: "1995-05-15" },
                  address_main: { type: "string", example: "서울시 강남구" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[401] = {
      description: "인증 실패",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "AUTH002" },
                  reason: { type: "string", example: "인증이 필요합니다." }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  try {
    // req.user는 JWT 인증 미들웨어가 설정해줌 (하드코딩 제거!)
    const userId = req.user.id;
    const updateData = bodyToUpdateProfile(req.body);
    
    const updatedUser = await updateUserProfile(userId, updateData);
    res.status(StatusCodes.OK).success(updatedUser);
  } catch (error) {
    next(error);
  }
};