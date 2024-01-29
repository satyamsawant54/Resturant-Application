import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

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

const userSchema = mongoose.Schema(
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
		emergencyContact: {
			email: { type: String,  },
			fullName: { type: String,  },
			phone: { type: String,  },
			relationship: { type: String, },
		},
		location: {
			type: { type: String },
			coordinates: [Number],
		  },	
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
		wallet: { 
      		type: walletSchema 
    	}, 
	},
	{ timestamps: true }
);


userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
  };
  
  userSchema.methods.matchPincode = async function (enteredPincode) {
	return await bcrypt.compare(enteredPincode.toString(), this.pincode.toString());
  };
  
  userSchema.pre('save', async function (next) {
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
  
  userSchema.pre('save', async function (next) {
	if (this.isNew && !this.wallet) {
	  this.wallet = {
		phone: this.phone,
		balance: 0,
		transactions: [],
	  };
	}
	next();
  });
  
  const User = mongoose.model('User', userSchema);
  
  export default User;