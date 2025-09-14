const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('shippingAddress.firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('shippingAddress.lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('shippingAddress.street').optional().trim(),
  body('shippingAddress.city').optional().trim(),
  body('shippingAddress.phone').optional().trim(),
  body('paymentMethod').isIn(['card', 'paypal', 'bank_transfer', 'cod', 'mpesa']).withMessage('Valid payment method is required')
], async (req, res) => {
  try {
    console.log('Order creation request body:', JSON.stringify(req.body, null, 2));
    console.log('User from token:', req.user);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { items, shippingAddress, billingAddress, paymentMethod, paymentId } = req.body;

    // Additional validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Order must contain at least one item' 
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({ 
        success: false,
        message: 'Shipping address is required' 
      });
    }

    if (!shippingAddress.firstName || shippingAddress.firstName.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'First name is required in shipping address' 
      });
    }

    if (!shippingAddress.lastName || shippingAddress.lastName.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Last name is required in shipping address' 
      });
    }

    // Validate and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      console.log(`Processing item:`, JSON.stringify(item, null, 2));
      console.log(`item.product type:`, typeof item.product);
      console.log(`item.product value:`, item.product);
      console.log(`item.product._id:`, item.product?._id);
      
      // Handle both item.product and item.product._id cases
      const productId = item.product?._id || item.product;
      console.log(`Extracted productId:`, productId);
      
      if (!productId) {
        console.log(`Failed to extract product ID from item:`, item);
        return res.status(400).json({ 
          success: false,
          message: 'Product ID is required for each item' 
        });
      }

      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({ 
          success: false,
          message: 'Valid quantity is required for each item' 
        });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({ 
          success: false,
          message: `Product ${productId} not found` 
        });
      }

      if (!product.isActive) {
        return res.status(400).json({ 
          success: false,
          message: `Product ${product.name} is no longer available` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: productId,
        variant: item.variant,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    const tax = subtotal * 0.16; // 16% VAT for Kenya
    const shipping = 0; // No shipping cost for university delivery
    const total = subtotal + tax;

    // Generate order number manually
    const orderCount = await Order.countDocuments();
    const orderNumber = `AF${String(orderCount + 1).padStart(6, '0')}`;

    const order = new Order({
      orderNumber,
      user: req.user.userId,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      subtotal,
      tax,
      shipping: { cost: 0, method: 'university_delivery' },
      total,
      paymentMethod,
      paymentId,
      paymentStatus: paymentId ? 'paid' : 'pending'
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => ({ msg: e.message, path: e.path }))
      });
    }
    res.status(500).json({ message: 'Server error during order creation' });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments({ user: req.user.userId });

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images price brand')
      .populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', adminAuth, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, note, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Add to status history
    order.statusHistory.push({
      status,
      note,
      timestamp: new Date()
    });

    order.status = status;

    if (trackingNumber) {
      order.shipping.trackingNumber = trackingNumber;
    }

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      startDate,
      endDate,
      search
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Can only cancel pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      note: 'Cancelled by customer',
      timestamp: new Date()
    });

    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
