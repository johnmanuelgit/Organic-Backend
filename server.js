const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = express();
const session = require('express-session');

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000    
  }
}));
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const adminRoutes = require('./router/adminRoutes');

app.use('/uploads', express.static('uploads'));

app.use('/', require('./router/auth'));
app.use('/api/user', require('./router/auth'));
app.use('/api/cart', require('./router/cart'));
app.use('/payment', require('./router/payment'));
app.use('/api/products', require('./router/shop'));
app.use('/api/admin', adminRoutes);
app.use('/api/product-reviews', require('./router/reviewRoutes'));
app.use('/api/blogs',require('./router/blogRoutes'));


app.get('/', (req, res) => res.send("Server is working!"));
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
