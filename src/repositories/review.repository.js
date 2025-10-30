
import { pool } from "../db.config.js";

export const saveReview = async (userId, storeId, data) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO reviews (user_id, store_id, rating, content, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(6), NOW(6));`,
      [userId, storeId, data.rating, data.content]
    );
    return result.insertId;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};