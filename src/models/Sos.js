import mongoose from 'mongoose';

const SosSchema = new mongoose.Schema(
  {
    chirpID: {
      type: String,
      required: true,
      unique: true,
    },
    priority: {
      type: String,
      enum: ['CRITICAL', 'STABLE', 'INFO', 'PENDING'],
      default: 'PENDING',
    },
    category: {
      type: String,
      enum: ['Medical', 'Fire', 'Trapped', 'Other', 'Pending'],
      default: 'Pending',
    },
    summary: {
      type: String,
      default: '',
    },
    locationCertainty: {
      type: Number,
      default: 0,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    rawText: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Enable geospatial queries
SosSchema.index({ location: '2dsphere' });
// Index on priority to quickly sort by urgency
SosSchema.index({ priority: 1 });
// Index on lastSeen for chronological sorting
SosSchema.index({ lastSeen: -1 });

const Sos = mongoose.model('Sos', SosSchema);

export default Sos;
