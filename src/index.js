/* index.js */

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import { StatusCodes } from "http-status-codes";

// --- 인증 설정 임포트 ---
import { googleStrategy, jwtStrategy } from "./auth.config.js";

// --- 컨트롤러 임포트 ---
import { handleUserSignUp, handleUpdateProfile } from "./controllers/user.controller.js"; 
import { handleAddStore } from "./controllers/store.controller.js";
import { handleAddReview } from "./controllers/review.controller.js";
import {
  handleAddMission,
  handleChallengeMission,
} from "./controllers/mission.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// --- Passport 전략 등록 ---
passport.use(googleStrategy);
passport.use(jwtStrategy);

// --- 미들웨어 설정 ---
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
  credentials: true,
}));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

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

// ========== 인증 미들웨어 ==========
// JWT 토큰 검증 미들웨어 (로그인 필요한 API에 적용)
const isLogin = passport.authenticate('jwt', { session: false });

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
      title: "UMC 9주차 워크북 API",
      description: "UMC 9주차 워크북 API - JWT 인증 적용",
    },
    host: `localhost:${port}`,
    securityDefinitions: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

// --- 라우터 설정 ---
app.get("/", (req, res) => {
  // #swagger.ignore = true
  res.send("Hello World!");
});

// ========== OAuth2 Google 로그인 ==========
app.get("/oauth2/login/google", 
  passport.authenticate("google", { session: false })
);

app.get("/oauth2/callback/google",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    /*
      #swagger.summary = 'Google OAuth 콜백';
      #swagger.tags = ['Auth']
      #swagger.responses[200] = {
        description: "Google 로그인 성공",
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
                    message: { type: "string", example: "Google 로그인 성공!" },
                    tokens: {
                      type: "object",
                      properties: {
                        accessToken: { type: "string" },
                        refreshToken: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };
    */
    const tokens = req.user;

    res.status(StatusCodes.OK).success({
      message: "Google 로그인 성공!",
      tokens: tokens,
    });
  }
);

app.get("/login-failed", (req, res) => {
  // #swagger.ignore = true
  res.status(StatusCodes.UNAUTHORIZED).error({
    errorCode: "AUTH001",
    reason: "Google 로그인에 실패했습니다.",
    data: null,
  });
});

// ========== 공개 API (로그인 불필요) ==========

// 회원가입 (공개)
app.post("/api/v1/users/signup", handleUserSignUp);

// ========== 보호된 API (로그인 필요) ==========

// 내 정보 조회 (로그인 필요)
app.get("/api/v1/users/me", isLogin, (req, res) => {
  /*
    #swagger.summary = '내 정보 조회 API';
    #swagger.tags = ['User']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: "내 정보 조회 성공",
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
                  id: { type: "number" },
                  email: { type: "string" },
                  nickname: { type: "string" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[401] = {
      description: "인증 실패 (토큰 없음/만료)",
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
  res.status(StatusCodes.OK).success({
    id: Number(req.user.id),
    email: req.user.email,
    nickname: req.user.nickname,
  });
});

// 내 정보 수정 (로그인 필요) - 미션 2번
app.patch("/api/v1/users/me", isLogin, handleUpdateProfile);

// 1-1. 특정 지역에 가게 추가하기 (로그인 필요)
app.post("/api/v1/regions/:regionId/stores", isLogin, handleAddStore);

// 1-2. 가게에 리뷰 추가하기 (로그인 필요)
app.post("/api/v1/stores/:storeId/reviews", isLogin, handleAddReview);

// 1-3. 가게에 미션 추가하기 (로그인 필요)
app.post("/api/v1/stores/:storeId/missions", isLogin, handleAddMission);

// 1-4. 미션 도전하기 (로그인 필요)
app.post("/api/v1/missions/:missionId/challenge", isLogin, handleChallengeMission);

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
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