const express = require('express');
const router = express.Router();
const {PaymentMethod} = require('../models'); // Adjust the path as needed

// Route to get all payment_methods with category names
router.get('/list', async (req, res) => {
  const user_id = req.user.userId; // Access user ID
  console.log('User ID:', user_id);
  try {
    const payment_methods = await PaymentMethod.findAll({
      where: { user_id },
      });
    res.json(payment_methods);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to add or edit an payment_method
router.post('/save', async (req, res) => {
    const user_id = req.user.userId; // Access user ID
    const { payment_method_id, payment_method_name } = req.body;
    console.log("PaymentMethod Data:", payment_method_id, payment_method_name)
    try {
      if (payment_method_id) {
        // Edit PaymentMethod
        const payment_method = await PaymentMethod.findByPk(payment_method_id);
        if (payment_method) {
          payment_method.payment_method_name = payment_method_name; // Update payment_method_name
          await payment_method.save();
          res.redirect('/');
        } else {
          res.status(404).json({ error: 'PaymentMethod not found' });
        }
      } else {
        // Add new PaymentMethod
        await PaymentMethod.create({ user_id, payment_method_name });
        res.redirect('/');
      }
    } catch (error) {
      res.status(400).json({ error: 'Bad request' });
    }
  });
  
// Route to delete an payment_method
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Then delete the PaymentMethod
    const result = await PaymentMethod.destroy({ where: { payment_method_id: id } });
    
    if (result) {
      res.json({ message: 'PaymentMethod deleted successfully' });
    } else {
      res.status(404).json({ error: 'PaymentMethod not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
