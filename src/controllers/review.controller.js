import { StatusCodes } from "http-status-codes";
import { bodyToReview, responseFromReview } from "../dtos/review.dto.js";
import { addReview } from "../services/review.service.js";

export const handleAddReview = async (req, res, next) => {
  /*
    #swagger.summary = '가게 리뷰 추가 API';
    #swagger.tags = ['Review']
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
            required: ["rating", "content"],
            properties: {
              rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
              content: { type: "string", example: "정말 맛있었어요!" }
            }
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "리뷰 추가 성공",
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
                  reviewId: { type: "number", example: 1 },
                  rating: { type: "number", example: 5 },
                  content: { type: "string", example: "정말 맛있었어요!" }
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
    const reviewData = bodyToReview(req.body);
    
    // 미션 1번: 하드코딩 제거! JWT에서 userId 가져오기
    const userId = req.user.id; // 기존: const userId = 1;

    const result = await addReview(userId, storeId, reviewData);
    res.status(StatusCodes.CREATED).success(responseFromReview(result, reviewData));
  } catch (error) {
    next(error);
  }
};