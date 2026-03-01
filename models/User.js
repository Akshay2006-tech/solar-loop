const bcrypt = require('bcryptjs');
const { readDB, writeDB } = require('../db');

class User {
  static async create(data) {
    const db = readDB();
    const exists = db.users.find(u => u.username === data.username || u.email === data.email);
    if (exists) throw new Error('User already exists');
    
    if (!data.email.endsWith('@gmail.com')) throw new Error('Email must end with @gmail.com');
    if (data.password.length < 6 || data.password.length > 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
      throw new Error('Password must be 6-8 characters with at least one symbol');
    }
    
    const user = {
      id: Date.now().toString(),
      username: data.username,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      created_at: new Date()
    };
    db.users.push(user);
    writeDB(db);
    return user;
  }

  static findByUsername(username) {
    const db = readDB();
    return db.users.find(u => u.username === username);
  }

  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = User;
