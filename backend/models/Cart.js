const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0
  },
  itemCount: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

cartSchema.methods.calculateTotals = function() {
  this.total = this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.lastUpdated = new Date();
  return this;
};

cartSchema.methods.addItem = function(productId, quantity = 1, price) {
  const existingItem = this.items.find(item => item.product.toString() === productId.toString());
  
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.price = price;
  } else {
    this.items.push({
      product: productId,
      quantity,
      price
    });
  }
  
  return this.calculateTotals();
};

cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => item.product.toString() !== productId.toString());
  return this.calculateTotals();
};

cartSchema.methods.updateQuantity = function(productId, quantity) {
  const item = this.items.find(item => item.product.toString() === productId.toString());
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    item.quantity = quantity;
  }
  return this.calculateTotals();
};

cartSchema.methods.clearCart = function() {
  this.items = [];
  this.total = 0;
  this.itemCount = 0;
  this.lastUpdated = new Date();
  return this;
};

cartSchema.methods.isEmpty = function() {
  return this.items.length === 0;
};

cartSchema.pre('save', async function(next) {
  let total = 0;
  if (this.items.length > 0) {
    await this.populate('items.product');
    this.items.forEach(item => {
      if (item.product) {
        total += item.product.price * item.quantity;
      }
    });
  }
  this.total = total;
  this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Cart', cartSchema); 