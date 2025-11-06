/* index.js */

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { StatusCodes } from "http-status-codes";

// --- 컨트롤러 임포트 ---
// (기존 회원가입 컨트롤러)
import { handleUserSignUp } from "./controllers/user.controller.js"; 
// (1-1. 가게 추가)
import { handleAddStore } from "./controllers/store.controller.js";
// (1-2. 리뷰 추가)
import { handleAddReview } from "./controllers/review.controller.js";
// (1-3 & 1-4. 미션)
import {
  handleAddMission,
  handleChallengeMission,
} from "./controllers/mission.controller.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- 라우터 설정 ---
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 회원가입 (bcrypt 적용)
app.post("/api/v1/users/signup", handleUserSignUp);

// 1-1. 특정 지역에 가게 추가하기
app.post("/api/v1/regions/:regionId/stores", handleAddStore);
// 1-2. 가게에 리뷰 추가하기
app.post("/api/v1/stores/:storeId/reviews", handleAddReview);
// 1-3. 가게에 미션 추가하기
app.post("/api/v1/stores/:storeId/missions", handleAddMission);
// 1-4. 미션 도전하기
app.post("/api/v1/missions/:missionId/challenge", handleChallengeMission);


// --- 공통 에러 핸들러 미들웨어 ---
// (컨트롤러에서 next(error)로 전달된 에러를 처리)
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  
  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  
  res.status(statusCode).json({
    message: err.message || "서버 내부 오류가 발생했습니다.",
    // (개발 환경에서만 스택 트레이스를 보여줄 수 있습니다)
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});