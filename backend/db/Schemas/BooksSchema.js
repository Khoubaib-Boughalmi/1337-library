const mongoose = require('mongoose');

const BooksSchema = new mongoose.Schema(
    {
        bookISBN: { type: String, required: true },
        bookName: { type: String, required: true },
        category: {
            type: [String],
            enum: [
                'Data science',
                'Web dev',
                'Mobile dev',
                'AI / Machine Learning',
                'Computer science',
                'Computer graphics',
                'Algorithms',
                'Networking',
                'Operating systems',
                'Cyber Security',
                'AR / VR',
                'Game dev',
                'Programming languages',
                'Design patterns',
                'Code quality',
                'Linux / Unix',
                'Robotics / Hardware',
                'software engineering',
                'other',
                'DevOps'
            ],
            required: true
        },
        bookCampus: {
            type: Number,
            required: true
        },
        quantity: { type: Number, required: true },
        summary: { type: String, required: true },
        bookCover: { type: String, required: true },
        author: { type: String, required: true },
        owner: { type: String, required: true },
        language: { type: String },
        pages: { type: Number }
    },
    {
        timestamps: true
    }
);

const BookSchema = mongoose.model('Book', BooksSchema);

module.exports = BookSchema;
