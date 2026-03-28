import Sos from '../models/Sos.js';
import { analyzeSosText } from '../services/aiTriage.js';
import { emitToDashboard } from '../services/socket.js';
import { sosReportSchema } from '../utils/validators.js';
import logger from '../config/logger.js';

export const reportSos = async (req, res) => {
  try {
    const parsedData = sosReportSchema.parse(req.body);
    const { chirpID, rawText, metadata, location } = parsedData;

    let existingSos = await Sos.findOne({ chirpID });

    if (existingSos) {
      // Deduplication: Update lastSeen & metadata
      existingSos.lastSeen = Date.now();
      if (metadata) {
        existingSos.metadata = { ...existingSos.metadata, ...metadata };
      }
      await existingSos.save();

      emitToDashboard('sos_updated', existingSos);
      return res.status(200).json({ message: 'Duplicate chirpID updated', data: existingSos });
    }

    // AI Triage
    const aiResult = await analyzeSosText(rawText);

    // Create New Record
    const newSosPayload = {
      chirpID,
      rawText,
      priority: aiResult.priority,
      category: aiResult.category,
      summary: aiResult.summary,
      locationCertainty: aiResult.locationCertainty,
      metadata: metadata || {},
    };

    if (location && location.coordinates) {
      newSosPayload.location = {
        type: 'Point',
        coordinates: location.coordinates,
      };
    } else {
      newSosPayload.location = {
        type: 'Point',
        coordinates: [0, 0] // Default if offline GPS unavailable
      };
    }

    const newSos = await Sos.create(newSosPayload);

    // Real-time Dashboard Update
    emitToDashboard('sos_new', newSos);

    res.status(201).json({ message: 'SOS processed successfully', data: newSos });
  } catch (error) {
    logger.error(`Error in reportSos: ${error.message}`);
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation Error', details: error.errors });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getNearbySOS = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query; // radius in meters

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Please provide lat and lng query parameters' });
    }

    const maxDistance = parseInt(radius, 10) || 5000; // default 5km

    const nearbyDocs = await Sos.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: maxDistance
        }
      }
    });

    res.status(200).json({ count: nearbyDocs.length, data: nearbyDocs });
  } catch (error) {
    logger.error(`Error in getNearbySOS: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
