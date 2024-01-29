import mongoose from 'mongoose';

const menuSchema = mongoose.Schema(
	{
		restaurant: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Restaurant',
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		images: [
			{
				type: String,
				required: true,
			},
		],
		quantityInStock: {
			type: Number,
			default: 0,
		},
		popularity: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;
