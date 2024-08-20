const express = require('express');
const router = express.Router();
const { Expense, Category, Budget } = require('../models'); // Adjust the path as needed

// Route to get all expenses with category names
router.get('/list', async (req, res) => {
  const user_id = req.user.userId; // Access user ID
  console.log('User ID:', user_id);
  try {
    const expenses = await Expense.findAll({
      where: { user_id },
      include: [{ model: Category, attributes: ['category_name'] }] // Include category name
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get all categories for dropdown
router.get('/categories', async (req, res) => {
    const user_id = req.user.userId; // Access user ID
  try {
    const exCategories = await Category.findAll({ where: { user_id } });
    res.json(exCategories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to add or edit an expense
router.post('/save', async (req, res) => {
    const user_id = req.user.userId; // Access user ID
    const { expense_id, Ex_category_id, Ex_amount, Ex_date, Ex_description } = req.body;
    const category_id = Ex_category_id;
    const amount = Ex_amount;
    const date = Ex_date;
    const description = Ex_description;
    console.log("Expense Data:", expense_id, category_id, amount, date, description )
    try {
      if (expense_id) {
        // Edit Expense
        const expense = await Expense.findByPk(expense_id);
        if (expense) {
          expense.category_id = category_id; // Update category
          expense.amount = amount; // Update amount
          expense.date = date; // Update date
          expense.description = description; // Update description
          await expense.save();
          res.redirect('/');
        } else {
          res.status(404).json({ error: 'Expense not found' });
        }
      } else {
        // Add new Expense
        await Expense.create({ user_id, category_id, amount, date, description });
        res.redirect('/');
      }
    } catch (error) {
      res.status(400).json({ error: 'Bad request' });
    }
  });
  
// Route to delete an expense
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Then delete the Expense
    const result = await Expense.destroy({ where: { expense_id: id } });
    
    if (result) {
      res.json({ message: 'Expense deleted successfully' });
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
