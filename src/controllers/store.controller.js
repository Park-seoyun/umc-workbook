import { StatusCodes } from "http-status-codes";
import { bodyToStore, responseFromStore } from "../dtos/store.dto.js";
import { addStore } from "../services/store.service.js";

export const handleAddStore = async (req, res, next) => {
  /*
    #swagger.summary = '가게 추가 API';
    #swagger.tags = ['Store']
    #swagger.parameters['regionId'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: '지역 ID',
      example: 1
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "address"],
            properties: {
              name: { type: "string", example: "맛있는 식당" },
              address: { type: "string", example: "서울시 강남구 테헤란로 123" }
            }
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "가게 추가 성공",
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
                  storeId: { type: "number", example: 1 },
                  name: { type: "string", example: "맛있는 식당" },
                  address: { type: "string", example: "서울시 강남구 테헤란로 123" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "지역을 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "R001" },
                  reason: { type: "string", example: "해당 지역을 찾을 수 없습니다." },
                  data: { 
                    type: "object",
                    properties: {
                      regionId: { type: "string", example: "999" }
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
    const { regionId } = req.params;
    const storeData = bodyToStore(req.body);
    const result = await addStore(regionId, storeData);
    
    res.status(StatusCodes.CREATED).success(responseFromStore(result, storeData));
  } catch (error) {
    next(error);
  }
};