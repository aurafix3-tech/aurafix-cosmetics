const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PageBackground = require('../models/PageBackground');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for background uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/uploads/backgrounds');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${req.body.pageName || 'background'}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
  fileFilter: (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png|webp|gif/;
    const videoTypes = /mp4|webm|ogg|mov/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;
    
    const isImage = imageTypes.test(extname) && mimetype.startsWith('image/');
    const isVideo = videoTypes.test(extname) && mimetype.startsWith('video/');
    
    if (isImage || isVideo) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed (JPEG, JPG, PNG, WebP, GIF, MP4, WebM, OGG, MOV)'));
    }
  },
});

// Get all page backgrounds
router.get('/', async (req, res) => {
  try {
    const backgrounds = await PageBackground.find().sort({ pageName: 1 });
    res.json({
      success: true,
      data: backgrounds
    });
  } catch (error) {
    console.error('Error fetching page backgrounds:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get background for specific page
router.get('/:pageName', async (req, res) => {
  try {
    const { pageName } = req.params;
    const background = await PageBackground.findOne({ pageName, isActive: true });
    
    if (!background) {
      return res.json({
        success: true,
        data: null,
        message: 'No background found for this page'
      });
    }

    res.json({
      success: true,
      data: background
    });
  } catch (error) {
    console.error('Error fetching page background:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create or update page background
router.post('/', adminAuth, upload.single('media'), async (req, res) => {
  try {
    const {
      pageName,
      mediaType = 'image',
      alt = '',
      overlayOpacity = 0.3,
      overlayColor = '#000000',
      position = 'cover',
      duration = 2000,
      isActive = true
    } = req.body;

    if (!pageName) {
      return res.status(400).json({
        success: false,
        message: 'Page name is required'
      });
    }

    let mediaUrl = '';
    let thumbnailUrl = '';

    if (req.file) {
      mediaUrl = `/uploads/backgrounds/${req.file.filename}`;
      
      // For videos, we might want to generate a thumbnail (simplified approach)
      if (mediaType === 'video') {
        thumbnailUrl = mediaUrl; // In a real app, you'd generate a thumbnail
      }
    }

    // Check if background already exists for this page
    let background = await PageBackground.findOne({ pageName });

    if (background) {
      // Delete old media file if uploading new one
      if (req.file && background.mediaUrl) {
        const oldFilePath = path.join(__dirname, '../public', background.mediaUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Update existing background
      background.mediaType = mediaType;
      background.alt = alt;
      background.overlayOpacity = parseFloat(overlayOpacity);
      background.overlayColor = overlayColor;
      background.position = position;
      background.duration = parseInt(duration);
      background.isActive = isActive === 'true' || isActive === true;
      
      if (req.file) {
        background.mediaUrl = mediaUrl;
        background.thumbnailUrl = thumbnailUrl;
      }
    } else {
      // Create new background
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Media file is required for new background'
        });
      }

      background = new PageBackground({
        pageName,
        mediaType,
        mediaUrl,
        thumbnailUrl,
        alt,
        overlayOpacity: parseFloat(overlayOpacity),
        overlayColor,
        position,
        duration: parseInt(duration),
        isActive: isActive === 'true' || isActive === true
      });
    }

    await background.save();

    res.json({
      success: true,
      data: background,
      message: background.isNew ? 'Background created successfully' : 'Background updated successfully'
    });
  } catch (error) {
    console.error('Error saving page background:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(__dirname, '../public/uploads/backgrounds', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error saving background'
    });
  }
});

// Delete page background
router.delete('/:pageName', adminAuth, async (req, res) => {
  try {
    const { pageName } = req.params;
    const background = await PageBackground.findOne({ pageName });

    if (!background) {
      return res.status(404).json({
        success: false,
        message: 'Background not found'
      });
    }

    // Delete media file
    if (background.mediaUrl) {
      const filePath = path.join(__dirname, '../public', background.mediaUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await background.deleteOne();

    res.json({
      success: true,
      message: 'Background deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting page background:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting background'
    });
  }
});

// Toggle background active status
router.patch('/:pageName/toggle', adminAuth, async (req, res) => {
  try {
    const { pageName } = req.params;
    const background = await PageBackground.findOne({ pageName });

    if (!background) {
      return res.status(404).json({
        success: false,
        message: 'Background not found'
      });
    }

    background.isActive = !background.isActive;
    await background.save();

    res.json({
      success: true,
      data: background,
      message: `Background ${background.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling background status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling background status'
    });
  }
});

module.exports = router;
