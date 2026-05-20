// Backend server with Express
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Database file path
const dbPath = path.join(__dirname, 'db.json');

// Read database
const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Write database
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// GET all expenses
app.get('/expenses', (req, res) => {
  const db = readDB();
  res.json(db.expenses);
});

// GET single expense
app.get('/expenses/:id', (req, res) => {
  const db = readDB();
  const expense = db.expenses.find(e => e.id === req.params.id);
  if (expense) {
    res.json(expense);
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

// POST create expense
app.post('/expenses', (req, res) => {
  const { title, amount, categoryId, date, description } = req.body;
  
  // Validation
  if (!title || title.length < 3) {
    return res.status(400).json({ error: 'Title must be at least 3 characters' });
  }
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than 0' });
  }
  
  if (amount > 100000) {
    return res.status(400).json({ error: 'Amount cannot exceed 100,000' });
  }
  
  const db = readDB();
  const newExpense = {
    id: Date.now().toString(),
    title: title.trim(),
    amount: parseFloat(amount),
    categoryId: categoryId || '1',
    date: date || new Date().toISOString().split('T')[0],
    description: description || ''
  };
  
  db.expenses.unshift(newExpense);
  writeDB(db);
  
  res.status(201).json(newExpense);
});

// PUT update expense
app.put('/expenses/:id', (req, res) => {
  const { title, amount, categoryId, date, description } = req.body;
  const db = readDB();
  const index = db.expenses.findIndex(e => e.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  
  // Validation for update
  if (title && title.length < 3) {
    return res.status(400).json({ error: 'Title must be at least 3 characters' });
  }
  
  if (amount && amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than 0' });
  }
  
  const updatedExpense = {
    ...db.expenses[index],
    title: title || db.expenses[index].title,
    amount: amount ? parseFloat(amount) : db.expenses[index].amount,
    categoryId: categoryId || db.expenses[index].categoryId,
    date: date || db.expenses[index].date,
    description: description !== undefined ? description : db.expenses[index].description
  };
  
  db.expenses[index] = updatedExpense;
  writeDB(db);
  
  res.json(updatedExpense);
});

// DELETE expense
app.delete('/expenses/:id', (req, res) => {
  const db = readDB();
  const filtered = db.expenses.filter(e => e.id !== req.params.id);
  
  if (filtered.length === db.expenses.length) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  
  db.expenses = filtered;
  writeDB(db);
  
  res.status(200).json({ message: 'Expense deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('Backend Server Running');
  console.log('='.repeat(50));
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Test: http://localhost:${PORT}/expenses`);
  console.log('='.repeat(50));
});