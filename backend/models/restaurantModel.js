import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

const walletSchema = new mongoose.Schema({
	phone: {
	  type: String,
	  required: true,
	},
	balance: {
	  type: Number,
	  required: true,
	  default: 0,
	},
	transactions: [{
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'Transaction',
	}],
	createdAt: {
	  type: Date,
	  default: Date.now,
	},
	updatedAt: {
	  type: Date,
	  default: Date.now,
	},
	currency: {
	  type: String,
	  default: 'KSH',
	},  
	status: {
	  type: String,
	  default: 'active',
	}, 
  });

const restaurantSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
            lowercase: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		pincode: {
			type: String,
		},		
		icon: {
			type: String, 
		},		
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},		
		location: {
			type: {
				type: String,
				enum: ['Point'],
			},
			coordinates: {
				type: [Number],
			},
		},
		time_open: {
			type: String,
		},
		time_close: {
			type: String,
		},			
		address: {
			type: String,
		},
		wallet: { 
			type: walletSchema 
	  	},	
		reviews: [reviewSchema],
		menus: [
			{
			  type: mongoose.Schema.Types.ObjectId,
			  ref: 'Menu',
			},
		  ],
		orders: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Order',
			},
		],		  
	},
	{ timestamps: true }
);

restaurantSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
  };
  
  restaurantSchema.methods.matchPincode = async function (enteredPincode) {
	return await bcrypt.compare(enteredPincode.toString(), this.pincode.toString());
  };
  
  restaurantSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
	  next();
	}
  
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
  
	if (this.pincode) {
	  this.pincode = await bcrypt.hash(this.pincode.toString(), salt);
	}
  
	next();
  });
  
  restaurantSchema.pre('save', async function (next) {
	if (this.isNew && !this.wallet) {
	  this.wallet = {
		phone: this.phone,
		balance: 0,
		transactions: [],
	  };
	}
	next();
  });
  
  restaurantSchema.methods.getOrders = async function () {
	await this.populate('orders').execPopulate();
	return this.orders;
  };
  
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  
  export default Restaurant;