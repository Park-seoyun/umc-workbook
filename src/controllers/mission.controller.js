import { StatusCodes } from "http-status-codes";
import {
  bodyToMission,
  responseFromMission,
  responseFromChallenge,
} from "../dtos/mission.dto.js";
import { addMission, challengeMission } from "../services/mission.service.js";

// 1-3. 가게에 미션 추가하기
export const handleAddMission = async (req, res, next) => {
  /*
    #swagger.summary = '가게에 미션 추가 API';
    #swagger.tags = ['Mission']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: '가게 ID',
      example: 1
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["title", "description", "reward_points"],
            properties: {
              title: { type: "string", example: "10번 방문하기" },
              description: { type: "string", example: "가게를 10번 방문하면 달성!" },
              reward_points: { type: "integer", example: 1000 }
            }
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "미션 추가 성공",
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
                  missionId: { type: "number", example: 1 },
                  title: { type: "string" },
                  description: { type: "string" },
                  reward_points: { type: "number" }
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
    #swagger.responses[404] = {
      description: "가게를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "S001" },
                  reason: { type: "string", example: "해당 가게를 찾을 수 없습니다." }
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
    const { storeId } = req.params;
    const missionData = bodyToMission(req.body);
    const result = await addMission(storeId, missionData);
    
    res.status(StatusCodes.CREATED).success(responseFromMission(result, missionData));
  } catch (error) {
    next(error);
  }
};

// 1-4. 미션 도전하기
export const handleChallengeMission = async (req, res, next) => {
  /*
    #swagger.summary = '미션 도전하기 API';
    #swagger.tags = ['Mission']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['missionId'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: '미션 ID',
      example: 1
    }
    #swagger.responses[201] = {
      description: "미션 도전 시작 성공",
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
                  userMissionId: { type: "number", example: 1 },
                  missionId: { type: "string" },
                  status: { type: "string", example: "IN_PROGRESS" }
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
    #swagger.responses[404] = {
      description: "미션을 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M001" },
                  reason: { type: "string", example: "존재하지 않는 미션입니다." }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    #swagger.responses[409] = {
      description: "이미 도전 중인 미션",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M002" },
                  reason: { type: "string", example: "이미 도전 중인 미션입니다." }
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
    const { missionId } = req.params;
    
    // 미션 1번: 하드코딩 제거! JWT에서 userId 가져오기
    const userId = req.user.id; // 기존: const userId = 1;

    const result = await challengeMission(userId, missionId);
    res.status(StatusCodes.CREATED).success(responseFromChallenge(result, missionId, "IN_PROGRESS"));
  } catch (error) {
    next(error);
  }
};