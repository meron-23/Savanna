// models/salesModel.js
import db from '../config/db.js';

// Get all sales
export const getAllSales = async () => {
  const [rows] = await db.query('SELECT * FROM sales ORDER BY created_at DESC');
  return rows;
};

// Get sale by ID
export const getSaleById = async (id) => {
  const [rows] = await db.query('SELECT * FROM sales WHERE id = ?', [id]);
  return rows[0];
};

// Create a new sale
export const createSale = async (saleData) => {
  const {
    property_cost,
    house_number,
    agreement_number,
    date_of_sale,
    property_type,
    area_sqm,
    location,
    site_id,
    remark,
    client_phone_number,
    prospect_id
  } = saleData;

  const [result] = await db.query(
    `INSERT INTO sales (
      property_cost, house_number, agreement_number, date_of_sale,
      property_type, area_sqm, location, site_id, remark,
      client_phone_number, prospect_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      property_cost, house_number, agreement_number, date_of_sale,
      property_type, area_sqm, location, site_id, remark,
      client_phone_number, prospect_id
    ]
  );

  return { id: result.insertId, ...saleData };
};

// Update sale by ID
export const updateSale = async (id, saleData) => {
  const [result] = await db.query('UPDATE sales SET ? WHERE id = ?', [saleData, id]);
  return result.affectedRows > 0;
};

// Delete sale by ID
export const deleteSale = async (id) => {
  const [result] = await db.query('DELETE FROM sales WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
