const express = require('express');
const router = express.Router();
const { Category, Expense, Budget } = require('../models'); // Adjust the path as needed

// Route to get all categories
router.get('/list', async (req, res) => {
  const user_id = req.user.userId; // Access user ID
  console.log('User ID:', user_id);
  try {
    const categories = await Category.findAll({ where: { user_id } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to add or edit a category
router.post('/save', async (req, res) => {
    const user_id = req.user.userId; // Access user ID
    const { category_name, category_id} = req.body;
    console.log("Request body:", req.body); // Log entire request body
    console.log("User id:", user_id);
    console.log("category id:", category_id);
    console.log("category name:", category_name);

  try {
    if (category_id) {
      // Edit category
      const category = await Category.findByPk(category_id);
      if (category) {
        category.category_name = category_name;
        await category.save();
        res.redirect('/');
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    } else {
      // Add new category
      await Category.create({ user_id, category_name });
      res.redirect('/');
    }
  } catch (error) {
      res.status(400).json({ error: 'Bad request' });
    }
  });
  
// // Route to add a new category
// router.post('/add', async (req, res) => {
//   const userId = req.user.userId; // Access user ID
//   console.log('User ID:', userId);
//   try {
//     const { category_name } = req.body;
//     const newCategory = await Category.create({ user_id: userId, category_name });
//     res.redirect('/');
//   } catch (error) {
//     res.status(400).json({ error: 'Bad request' });
//   }
// });

// // Route to edit a category
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { category_name } = req.body;
//     const category = await Category.findByPk(id);
    
//     if (category) {
//       category.category_name = category_name;
//       await category.save();
//       res.redirect('/');
//     } else {
//       res.status(404).json({ error: 'Category not found' });
//     }
//   } catch (error) {
//     res.status(400).json({ error: 'Bad request' });
//   }
// });

router.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the category
      const category = await Category.findByPk(id);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      // Delete related records
      try {
        if (Expense) await Expense.destroy({ where: { category_id: id } });
      } catch (error) {
        console.warn('Error deleting related Expenses:', error.message);
      }
  
      try {
        if (Budget) await Budget.destroy({ where: { category_id: id } });
      } catch (error) {
        console.warn('Error deleting related Budgets:', error.message);
      }
  
      // Delete the category
      await category.destroy();
  
      // Send a success response
      res.status(200).json({ message: 'Category deleted successfully' });
  
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports = router;
