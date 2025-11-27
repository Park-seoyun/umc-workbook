import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

dotenv.config();

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

// ========== JWT 토큰 생성 함수 ==========

// Access Token 생성 (짧은 수명: 1시간)
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: Number(user.id), email: user.email },
    secret,
    { expiresIn: "1h" }
  );
};

// Refresh Token 생성 (긴 수명: 14일)
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: Number(user.id) },
    secret,
    { expiresIn: "14d" }
  );
};

// ========== Google 로그인 전략 ==========

// Google 프로필에서 사용자 확인/생성
const googleVerify = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new Error(`profile.email was not found: ${JSON.stringify(profile)}`);
  }

  // 기존 사용자 확인
  const user = await prisma.user.findFirst({ where: { email } });
  if (user !== null) {
    return { id: user.id, email: user.email, nickname: user.nickname };
  }

  // 신규 사용자 생성 (기본값으로)
  const created = await prisma.user.create({
    data: {
      email,
      password: "GOOGLE_OAUTH", // 소셜 로그인이므로 비밀번호 없음
      nickname: profile.displayName || email.split("@")[0],
      gender: "UNKNOWN",
      birthDate: new Date(1970, 0, 1),
      addressMain: "추후 수정",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return { id: created.id, email: created.email, nickname: created.nickname };
};

// Google Strategy 설정
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "/oauth2/callback/google",
    scope: ["email", "profile"],
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const user = await googleVerify(profile);

      // JWT 토큰 생성
      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);

      return cb(null, {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });
    } catch (err) {
      return cb(err);
    }
  }
);

// ========== JWT 검증 전략 ==========

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: payload.id } });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
});