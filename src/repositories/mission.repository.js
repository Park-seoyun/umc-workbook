import { pool } from "../db.config.js";

// 1-3. 미션 저장
export const saveMission = async (storeId, data) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO missions (store_id, title, description, reward_points, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(6), NOW(6));`,
      [storeId, data.title, data.description, data.reward_points]
    );
    return result.insertId;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};

// 1-4. (검증용) 미션 존재 확인
export const isMissionExist = async (missionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT 1 FROM missions WHERE id = ?",
      missionId
    );
    return rows.length > 0;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};

// 1-4. (검증용) 이미 도전 중인지 확인
export const isMissionAlreadyChallenged = async (userId, missionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT 1 FROM user_missions WHERE user_id = ? AND mission_id = ?",
      [userId, missionId]
    );
    return rows.length > 0;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};

// 1-4. (실행용) 미션 시작 (user_missions에 추가)
export const startMission = async (userId, missionId) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO user_missions (user_id, mission_id, status, created_at, updated_at) 
       VALUES (?, ?, 'IN_PROGRESS', NOW(6), NOW(6));`,
      [userId, missionId]
    );
    return result.insertId;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};