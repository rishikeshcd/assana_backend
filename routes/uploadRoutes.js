import express from 'express';
import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Validate Cloudinary configuration
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Cloudinary configuration missing!');
  console.error('   Required environment variables:');
  console.error('   - CLOUDINARY_CLOUD_NAME');
  console.error('   - CLOUDINARY_API_KEY');
  console.error('   - CLOUDINARY_API_SECRET');
  console.error('   Please check your .env file or environment variables.');
  throw new Error('Cloudinary configuration is required. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

console.log(`✅ Cloudinary configured: ${cloudName}`);

// Configure Cloudinary storage for multer
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    
    // Check if this is a temporary upload (from query param - more reliable with multipart/form-data)
    const isTemp = req.query.temp === 'true';
    const folder = isTemp 
      ? 'temp-uploads' 
      : (process.env.CLOUDINARY_FOLDER || 'assana-uploads');
    
    return {
      folder: folder,
      public_id: `${name}-${uniqueSuffix}`,
      format: ext.slice(1) || 'jpg', // Remove the dot from extension
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    };
  },
});

// Configure multer with Cloudinary storage
const upload = multer({
  storage: cloudinaryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files (JPEG, PNG, GIF, WEBP) are allowed.'), false);
    }
  },
});

// GET /api/uploads/config - Get Cloudinary config for direct client uploads
router.get('/config', (req, res) => {
  try {
    const isTemp = req.query.temp !== 'true'; // Default to false, but we always use temp for direct uploads
    const folder = 'temp-uploads'; // Always use temp folder for direct uploads
    
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    
    // If upload preset is configured, use unsigned uploads (simpler)
    if (uploadPreset) {
      return res.json({
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        folder: folder,
      });
    }
    
    // Otherwise, generate signature for signed upload
    const timestamp = Math.round(new Date().getTime() / 1000);
    const params = {
      timestamp: timestamp,
      folder: folder,
    };
    
    const signature = cloudinary.utils.api_sign_request(params, apiSecret);
    
    res.json({
      cloudName: cloudName,
      apiKey: apiKey,
      timestamp: timestamp,
      signature: signature,
      folder: folder,
    });
  } catch (error) {
    console.error('Error generating upload config:', error);
    res.status(500).json({ error: 'Failed to generate upload config', message: error.message });
  }
});

// POST /api/uploads/finalize - Move image from temp to permanent folder
router.post('/finalize', async (req, res) => {
  try {
    const { tempUrl, oldUrl, permanentFolder } = req.body;
    
    if (!tempUrl) {
      return res.status(400).json({ error: 'tempUrl is required' });
    }
    
    // Import the helper function
    const { moveImageToPermanent, deleteImageFromCloudinary } = await import('../utils/cloudinaryHelper.js');
    
    // Move image from temp to permanent folder
    const finalUrl = await moveImageToPermanent(tempUrl, permanentFolder || 'assana-uploads');
    
    // Delete old image if provided and different from new one
    if (oldUrl && oldUrl !== finalUrl && !oldUrl.includes('/temp-uploads/')) {
      try {
        await deleteImageFromCloudinary(oldUrl);
      } catch (deleteError) {
        console.warn('Failed to delete old image (non-critical):', deleteError.message);
      }
    }
    
    res.json({
      url: finalUrl,
      success: true,
    });
  } catch (error) {
    console.error('Error finalizing image:', error);
    res.status(500).json({ error: 'Failed to finalize image', message: error.message });
  }
});

// Handle OPTIONS preflight requests for CORS
router.options('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
});

router.options('/config', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
});

router.options('/finalize', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
});

// POST /api/uploads - Upload a single image file
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check if this is a temporary upload (from query param - more reliable with multipart/form-data)
    const isTemp = req.query.temp === 'true';
    const folder = isTemp ? 'temp-uploads' : (process.env.CLOUDINARY_FOLDER || 'assana-uploads');

    // multer-storage-cloudinary stores the URL in req.file.path
    // It can also be in secure_url, url, or we can construct it from public_id
    let fileUrl = req.file.path || req.file.secure_url || req.file.url;
    
    // If still no URL, construct it from public_id
    if (!fileUrl && req.file.public_id) {
      fileUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${folder}/${req.file.public_id}.${req.file.format || 'jpg'}`;
    }

    if (!fileUrl) {
      console.error('❌ Cloudinary upload response:', JSON.stringify(req.file, null, 2));
      return res.status(500).json({ error: 'Failed to get file URL from Cloudinary' });
    }

    const responseData = {
      url: fileUrl,
      filename: req.file.public_id || req.file.filename,
      originalName: req.file.originalname,
      size: req.file.bytes || req.file.size,
      storage: 'cloudinary',
      publicId: req.file.public_id,
      isTemp: isTemp,
    };

    console.log(`✅ File uploaded successfully to Cloudinary${isTemp ? ' (temp)' : ''}: ${fileUrl}`);
    res.json(responseData);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file', message: error.message });
  }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: error.message });
  }
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
});

export default router;

