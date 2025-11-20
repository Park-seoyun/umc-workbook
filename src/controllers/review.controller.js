import { StatusCodes } from "http-status-codes";
import { bodyToReview, responseFromReview } from "../dtos/review.dto.js";
import { addReview } from "../services/review.service.js";

export const handleAddReview = async (req, res, next) => {
  /*
    #swagger.summary = '가게 리뷰 추가 API';
    #swagger.tags = ['Review']
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
              rating: { 
                type: "integer", 
                minimum: 1, 
                maximum: 5, 
                example: 5,
                description: "1-5 사이의 평점"
              },
              content: { 
                type: "string", 
                example: "정말 맛있었어요! 강추합니다.",
                description: "리뷰 내용"
              }
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
                  content: { type: "string", example: "정말 맛있었어요! 강추합니다." }
                }
              }
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
                  reason: { type: "string", example: "해당 가게를 찾을 수 없습니다." },
                  data: { 
                    type: "object",
                    properties: {
                      storeId: { type: "string", example: "999" }
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
  */
  try {
    const { storeId } = req.params;
    const reviewData = bodyToReview(req.body);
    const userId = 1; // 미션 요구사항: "특정 사용자 (ex. 1번)"로 가정

    const result = await addReview(userId, storeId, reviewData);
    res.status(StatusCodes.CREATED).success(responseFromReview(result, reviewData));
  } catch (error) {
    next(error);
  }
};