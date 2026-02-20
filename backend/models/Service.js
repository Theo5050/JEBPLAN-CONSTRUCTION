const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'fas fa-tools'
    },
    image: String,
    category: {
        type: String,
        enum: ['scaffold-wholesale', 'scaffold-rental', 'security-doors', 'door-accessories', 'bathroom-kitchen-product'],
        required: true
    },
    price: String,
    features: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Service', ServiceSchema);