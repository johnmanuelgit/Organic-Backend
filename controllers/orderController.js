const Order = require('../models/Order');

// Place COD order
exports.placeCodOrder = async (req, res) => {
  try {
    const { productId, name, phone, address, quantity, price } = req.body;

    const order = new Order({
      productId,
      name,
      phone,
      address,
      quantity,
      price,
      paymentMethod: 'cod',
      paymentStatus: 'pending'
    });

    await order.save();
    res.status(201).json({ message: 'COD order placed', order });
  } catch (err) {
    console.error('COD order failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Save Razorpay order after success
exports.confirmOnlinePayment = async (req, res) => {
  try {
    const { productId, name, phone, address, quantity, price, paymentId } = req.body;

    const order = new Order({
      productId,
      name,
      phone,
      address,
      quantity,
      price,
      paymentMethod: 'online',
      paymentStatus: 'paid',
      paymentId
    });

    await order.save();
    res.status(201).json({ message: 'Online payment order saved', order });
  } catch (err) {
    console.error('Online order save failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// UPDATE order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ message: 'Status updated', order: updatedOrder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};
