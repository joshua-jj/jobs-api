import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: [50, 'Company name too long'],
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: [100, 'Position name too long'],
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user']
    }
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
