import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

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
            required: ["email", "password", "nickname", "gender", "birth_date", "address_main"],
            properties: {
              email: { type: "string", format: "email", example: "user@example.com" },
              password: { type: "string", format: "password", example: "password123" },
              nickname: { type: "string", example: "테스트유저" },
              gender: { type: "string", enum: ["MALE", "FEMALE"], example: "MALE" },
              birth_date: { type: "string", format: "date", example: "1995-05-15" },
              address_main: { type: "string", example: "서울시 강남구" },
              preferences: { 
                type: "array", 
                items: { type: "number" },
                example: [1, 2, 3],
                description: "선호 음식 카테고리 ID 배열"
              }
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
                  data: { 
                    type: "object",
                    properties: {
                      email: { type: "string", example: "user@example.com" }
                    }
                  }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    #swagger.responses[500] = {
      description: "서버 내부 오류",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ErrorResponse"
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