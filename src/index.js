/* index.js */

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import { StatusCodes } from "http-status-codes";

// --- 컨트롤러 임포트 ---
import { handleUserSignUp } from "./controllers/user.controller.js"; 
import { handleAddStore } from "./controllers/store.controller.js";
import { handleAddReview } from "./controllers/review.controller.js";
import {
  handleAddMission,
  handleChallengeMission,
} from "./controllers/mission.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// --- 미들웨어 설정 ---
app.use(morgan('dev'));           // HTTP 요청 로깅
app.use(cookieParser());          // 쿠키 파싱
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"], // 프론트엔드 주소
  credentials: true,  // 쿠키 허용
}));
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json());          // JSON 파싱
app.use(express.urlencoded({ extended: false })); // URL-encoded 파싱

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ 
      resultType: "SUCCESS", 
      error: null, 
      success 
    });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

// --- Swagger UI 설정 ---
app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null";
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 7주차 워크북 API",
      description: "UMC 7주차 워크북 API 명세서",
    },
    host: "localhost:3000",
    components: {
      schemas: {
        // 성공 응답 스키마
        SuccessResponse: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: { type: "object" }
          }
        },
        // 에러 응답 스키마
        ErrorResponse: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string" },
                reason: { type: "string" },
                data: { type: "object", nullable: true }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

// --- 라우터 설정 ---
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 회원가입
app.post("/api/v1/users/signup", handleUserSignUp);

// 1-1. 특정 지역에 가게 추가하기
app.post("/api/v1/regions/:regionId/stores", handleAddStore);

// 1-2. 가게에 리뷰 추가하기
app.post("/api/v1/stores/:storeId/reviews", handleAddReview);

// 1-3. 가게에 미션 추가하기
app.post("/api/v1/stores/:storeId/missions", handleAddMission);

// 1-4. 미션 도전하기
app.post("/api/v1/missions/:missionId/challenge", handleChallengeMission);

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
  // 이미 응답이 전송된 경우
  if (res.headersSent) {
    return next(err);
  }

  console.error("Global Error Handler:", err);
  
  res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || "서버 내부 오류가 발생했습니다.",
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});