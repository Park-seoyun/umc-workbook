
import { pool } from "../db.config.js";

export const addUser = async (data) => {
  const conn = await pool.getConnection();
  try {
    // email 중복 검사
    const [confirmEmail] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM users WHERE email = ?) as isExistEmail;`,
      data.email
    );

    if (confirmEmail[0].isExistEmail) {
      throw new Error("이미 존재하는 이메일입니다.");
    }
    
    // nickname 중복 검사
    const [confirmNickname] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM users WHERE nickname = ?) as isExistNickname;`,
      data.nickname
    );

    if (confirmNickname[0].isExistNickname) {
      throw new Error("이미 존재하는 닉네임입니다.");
    }

    const [result] = await conn.query(
      `INSERT INTO users (email, password, nickname, gender, birth_date, address_main, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(6), NOW(6));`,
      [
        data.email,
        data.password, // 해싱된 비밀번호
        data.nickname,
        data.gender,
        data.birth_date,
        data.address_main,
      ]
    );
    return result.insertId;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};

// 사용자 선호 카테고리 설정
export const setPreference = async (userId, categoryId) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO user_preferences (user_id, category_id, created_at, updated_at) 
       VALUES (?, ?, NOW(6), NOW(6));`,
      [userId, categoryId]
    );
    return result.insertId;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};

// 사용자 정보 조회
export const getUser = async (userId) => {
  const conn = await pool.getConnection();
  try {
    const [users] = await conn.query(
      `SELECT id, email, nickname, gender, birth_date, address_main, created_at, updated_at 
       FROM users 
       WHERE id = ?;`,
      [userId]
    );
    
    if (users.length === 0) {
      return null;
    }
    
    return users[0];
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};

// 사용자 선호 카테고리 조회
export const getUserPreferences = async (userId) => {
  const conn = await pool.getConnection();
  try {
    const [preferences] = await conn.query(
      `SELECT up.id, up.user_id, up.category_id, c.name as category_name
       FROM user_preferences up
       INNER JOIN categories c ON up.category_id = c.id
       WHERE up.user_id = ?;`,
      [userId]
    );
    
    return preferences;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};