// controllers/salesController.js
import * as SalesModel from '../Models/salesModel.js';

// GET all sales
export const getSales = async (req, res) => {
  try {
    const sales = await SalesModel.getAllSales();
    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET sale by ID
export const getSale = async (req, res) => {
  try {
    const sale = await SalesModel.getSaleById(req.params.id);
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    res.status(200).json({ success: true, data: sale });
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// CREATE a sale
export const createSale = async (req, res) => {
  try {
    const newSale = await SalesModel.createSale(req.body);
    res.status(201).json({ success: true, data: newSale });
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// UPDATE a sale
export const updateSale = async (req, res) => {
  try {
    const updated = await SalesModel.updateSale(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    res.status(200).json({ success: true, message: 'Sale updated successfully' });
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// DELETE a sale
export const deleteSale = async (req, res) => {
  try {
    const deleted = await SalesModel.deleteSale(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    res.status(200).json({ success: true, message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
