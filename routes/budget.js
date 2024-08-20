const express = require('express');
const router = express.Router();
const {Category, Budget } = require('../models'); // Adjust the path as needed

// Route to get all budgets with category names
router.get('/list', async (req, res) => {
  const user_id = req.user.userId; // Access user ID
  console.log('User ID:', user_id);
  try {
    const budgets = await Budget.findAll({
      where: { user_id },
      include: [{ model: Category, attributes: ['category_name'] }] // Include category name
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get all categories for dropdown
router.get('/categories', async (req, res) => {
    const user_id = req.user.userId; // Access user ID
  try {
    const buCategories = await Category.findAll({ where: { user_id } });
    res.json(buCategories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to add or edit an budget
router.post('/save', async (req, res) => {
    const user_id = req.user.userId; // Access user ID
    const { budget_id,Bu_category_id, Bu_amount, St_date, End_date } = req.body;
    const category_id = Bu_category_id;
    const amount = Bu_amount;
    const start_date = St_date;
    const end_date = End_date;
    console.log("Budget Data:", budget_id, category_id, amount, start_date, end_date )
    try {
      if (budget_id) {
        // Edit Budget
        const budget = await Budget.findByPk(budget_id);
        if (budget) {
          budget.category_id = category_id; // Update category
          budget.amount = amount; // Update amount
          budget.start_date = start_date; // Update start_date
          budget.end_date = end_date; // Update end_date
          await budget.save();
          res.redirect('/');
        } else {
          res.status(404).json({ error: 'Budget not found' });
        }
      } else {
        // Add new Budget
        await Budget.create({ user_id, category_id, amount, start_date, end_date });
        res.redirect('/');
      }
    } catch (error) {
      res.status(400).json({ error: 'Bad request' });
    }
  });
  
// Route to delete an budget
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Then delete the Budget
    const result = await Budget.destroy({ where: { budget_id: id } });
    
    if (result) {
      res.json({ message: 'Budget deleted successfully' });
    } else {
      res.status(404).json({ error: 'Budget not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
