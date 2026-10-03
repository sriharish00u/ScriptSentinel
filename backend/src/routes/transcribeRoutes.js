const express = require('express');
const router = express.Router();
const multer = require('multer');
const { transcribeVideoUrl, generateSimulatedTranscript } = require('../services/transcriptionService');
const { scanText } = require('../services/scannerService');

const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

/**
 * @route POST /api/v1/transcribe/url
 * @desc Transcribe YouTube / Video URL and run algorithmic scan
 */
router.post('/url', async (req, res) => {
  try {
    const { url, platform = 'youtube' } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'Video URL is required.' });
    }

    const transcriptData = await transcribeVideoUrl({ url });
    const scanResult = await scanText({ text: transcriptData.fullText, platform });

    return res.json({
      success: true,
      data: {
        transcript: transcriptData,
        scanResult,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/v1/transcribe/upload
 * @desc Upload local video/audio file, extract transcript and run algorithmic scan
 */
router.post('/upload', upload.single('mediaFile'), async (req, res) => {
  try {
    const platform = req.body.platform || 'all';
    const fileName = req.file ? req.file.originalname : 'uploaded_video.mp4';

    const transcriptData = generateSimulatedTranscript(fileName);
    const scanResult = await scanText({ text: transcriptData.fullText, platform });

    return res.json({
      success: true,
      data: {
        transcript: transcriptData,
        scanResult,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
