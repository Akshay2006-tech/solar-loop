const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail } = require('../emailService');
const User = require('../models/UserMongo');
const SolarPanel = require('../models/SolarPanelMongo');

const isAuth = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) return next();
  res.redirect('/dashboard');
};

router.get('/', (req, res) => res.render('core/home'));
router.get('/about', (req, res) => res.render('core/about'));
router.get('/awareness', (req, res) => res.render('core/awareness'));
router.get('/how-it-works', (req, res) => res.render('core/how_it_works'));
router.get('/contact', (req, res) => res.render('core/contact'));
router.get('/recycling-guide', (req, res) => res.render('core/recycling_guide'));

router.get('/login', (req, res) => res.render('registration/login'));
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    
    if (!user || !(await user.comparePassword(req.body.password))) {
      req.session.messages = ['Invalid username or password'];
      return res.redirect('/login');
    }
    
    req.session.user = { 
      id: user._id.toString(), 
      username: user.username,
      isAdmin: user.isAdmin || false
    };
    
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        req.session.messages = ['Login error'];
        return res.redirect('/login');
      }
      
      // Redirect to admin dashboard if user is admin
      if (user.isAdmin) {
        return res.redirect('/admin/dashboard');
      }
      
      res.redirect('/dashboard');
    });
  } catch (err) {
    console.error('Login error:', err);
    req.session.messages = ['Login error'];
    res.redirect('/login');
  }
});

router.get('/register', (req, res) => res.render('registration/register'));
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      req.session.messages = ['All fields are required'];
      return res.redirect('/register');
    }
    
    if (username.length < 3) {
      req.session.messages = ['Username must be at least 3 characters long'];
      return res.redirect('/register');
    }
    
    if (password.length < 6) {
      req.session.messages = ['Password must be at least 6 characters long'];
      return res.redirect('/register');
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      req.session.messages = ['Please enter a valid email address'];
      return res.redirect('/register');
    }
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        req.session.messages = ['Username already exists. Please choose a different username.'];
      } else {
        req.session.messages = ['Email already registered. Please use a different email.'];
      }
      return res.redirect('/register');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: false
    });
    
    await user.save();
    
    // Send welcome email
    try {
      const emailResult = await sendWelcomeEmail(email, username);
      if (emailResult.success) {
        console.log(`Welcome email sent successfully to ${email}`);
      }
    } catch (emailError) {
      console.log(`Welcome email error for ${email}:`, emailError);
    }
    
    req.session.messages = ['Registration successful! Please login.'];
    res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    req.session.messages = ['Registration failed. Please try again.'];
    res.redirect('/register');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/registration-complete', (req, res) => res.render('registration/registration_complete'));

router.get('/dashboard', isAuth, async (req, res) => {
  try {
    const panels = await SolarPanel.find({ userId: req.session.user.id });
    const now = new Date();
    let safe = 0, near = 0, expired = 0, waste = 0;
    
    panels.forEach(p => {
      const years = (now - new Date(p.installation_date)) / (365.25 * 24 * 60 * 60 * 1000);
      const remaining = (p.warranty_years || 25) - years;
      
      if (remaining > 2) safe++;
      else if (remaining > 0) near++;
      else expired++;
      
      waste += (p.capacity_watts || 0) * 0.02;
    });
    
    res.render('core/dashboard', { 
      panels, 
      total_panels: panels.length, 
      safe_count: safe, 
      near_expiry_count: near, 
      expired_count: expired, 
      total_waste: waste 
    });
  } catch (err) {
    res.render('core/dashboard', { 
      panels: [], 
      total_panels: 0, 
      safe_count: 0, 
      near_expiry_count: 0, 
      expired_count: 0, 
      total_waste: 0 
    });
  }
});

router.get('/add-panel', isAuth, (req, res) => res.render('core/add_panel'));
router.post('/add-panel', isAuth, async (req, res) => {
  try {
    const capacity_kw = parseFloat(req.body.capacity_kw);
    const capacity_watts = capacity_kw * 1000;
    
    const panel = new SolarPanel({
      userId: req.session.user.id,
      brand: req.body.brand,
      model: req.body.model || '',
      capacity_watts: capacity_watts,
      warranty_years: parseInt(req.body.warranty_years) || 25,
      installation_date: new Date(req.body.installation_date),
      location: req.body.location,
      serial_number: req.body.serial_number || ''
    });
    
    await panel.save();
    req.session.messages = ['Solar panel registered successfully!'];
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Add panel error:', err);
    req.session.messages = ['Failed to add panel: ' + err.message];
    res.redirect('/add-panel');
  }
});

router.post('/delete-panel/:id', isAuth, async (req, res) => {
  try {
    await SolarPanel.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.session.user.id 
    });
    req.session.messages = ['Panel deleted successfully'];
  } catch (err) {
    req.session.messages = ['Failed to delete panel'];
  }
  res.redirect('/dashboard');
});

router.get('/recycler-directory', isAuth, (req, res) => {
  res.render('core/recycler_directory');
});

// Admin Dashboard
router.get('/admin/dashboard', isAuth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPanels = await SolarPanel.countDocuments();
    const users = await User.find().select('-password').sort({ created_at: -1 });
    
    res.render('core/admin_dashboard', {
      totalUsers,
      totalPanels,
      users
    });
  } catch (err) {
    req.session.messages = ['Error loading admin dashboard'];
    res.redirect('/dashboard');
  }
});

module.exports = router;
