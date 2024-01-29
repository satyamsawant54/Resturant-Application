import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
      amount: {
        type: Number,
      },
      type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'transfer'],
      },
      message: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        enum: ['credit', 'debit'],
      },
      category: {
        type: String,
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'declined'],
      },
      relatedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      relatedRestaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
      referenceNumber: {
        type: String,
      },
      attachments: [{
        type: String,
      }],
      currency: {
        type: String,
      },
      dateTime: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  );

  const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;