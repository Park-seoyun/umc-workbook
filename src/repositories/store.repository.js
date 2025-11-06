
import { pool } from "../db.config.js";

// 지역 존재 확인 (검증용)
export const isRegionExist = async (regionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT 1 FROM regions WHERE id = ?",
      regionId
    );
    return rows.length > 0;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};

//  가게 존재 확인 (검증용) - 추가 필요!
export const isStoreExist = async (storeId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT 1 FROM stores WHERE id = ?",
      storeId
    );
    return rows.length > 0;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};

// 가게 저장
export const saveStore = async (regionId, data) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO stores (name, address, region_id, created_at, updated_at) 
       VALUES (?, ?, ?, NOW(6), NOW(6));`,
      [data.name, data.address, regionId]
    );
    return result.insertId;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};