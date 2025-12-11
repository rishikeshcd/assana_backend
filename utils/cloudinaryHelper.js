import { v2 as cloudinary } from 'cloudinary';

// Get cloud name from environment or cloudinary config
export const getCloudName = () => {
  return process.env.CLOUDINARY_CLOUD_NAME || cloudinary.config().cloud_name;
};

// Get API key from environment or cloudinary config
export const getApiKey = () => {
  return process.env.CLOUDINARY_API_KEY || cloudinary.config().api_key;
};

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Public ID or null if invalid
 */
export const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{public_id}.{format}
  // or: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
  const cloudinaryPattern = /\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/;
  const match = url.match(cloudinaryPattern);
  
  if (match && match[1]) {
    return match[1];
  }
  
  // If URL is already a public_id (no http://), return as is
  if (!url.includes('http://') && !url.includes('https://')) {
    return url;
  }
  
  return null;
};

/**
 * Delete image from Cloudinary
 * @param {string} urlOrPublicId - Cloudinary URL or public_id
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
export const deleteImageFromCloudinary = async (urlOrPublicId) => {
  if (!urlOrPublicId) return null;
  
  try {
    // Skip deletion for non-Cloudinary URLs (e.g., localhost URLs from old implementation)
    if (urlOrPublicId.includes('localhost') || urlOrPublicId.includes('127.0.0.1')) {
      console.log(`ℹ️  Skipping deletion of non-Cloudinary URL: ${urlOrPublicId.substring(0, 50)}...`);
      return null;
    }
    
    const publicId = extractPublicIdFromUrl(urlOrPublicId);
    if (!publicId) {
      // Only warn if it's a Cloudinary-like URL that we couldn't parse
      if (urlOrPublicId.includes('cloudinary.com')) {
        console.warn(`⚠️  Could not extract public_id from Cloudinary URL: ${urlOrPublicId.substring(0, 80)}...`);
      }
      return null;
    }
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      console.log(`✅ Deleted image from Cloudinary: ${publicId}`);
      return result;
    } else if (result.result === 'not found') {
      console.warn(`⚠️  Image not found in Cloudinary: ${publicId}`);
      return result;
    } else {
      console.error(`❌ Failed to delete image: ${publicId}`, result);
      return result;
    }
  } catch (error) {
    console.error(`❌ Error deleting image from Cloudinary:`, error);
    throw error;
  }
};

/**
 * Move image from temp folder to permanent folder
 * Cloudinary's rename doesn't actually move files between folders,
 * so we upload from the temp URL to the permanent location, then delete temp
 * @param {string} tempUrl - Temporary Cloudinary URL
 * @param {string} permanentFolder - Permanent folder name (default: 'assana-uploads')
 * @returns {Promise<string>} - New permanent URL
 */
export const moveImageToPermanent = async (tempUrl, permanentFolder = 'assana-uploads') => {
  if (!tempUrl) return tempUrl;
  
  // If URL is not in temp folder, return as is
  if (!tempUrl.includes('/temp-uploads/')) {
    return tempUrl;
  }
  
  try {
    const tempPublicId = extractPublicIdFromUrl(tempUrl);
    if (!tempPublicId) {
      console.warn(`⚠️  Could not extract public_id from temp URL: ${tempUrl}`);
      return tempUrl;
    }
    
    console.log(`🔄 Attempting to move: ${tempPublicId}`);
    
    // Remove 'temp-uploads/' prefix and add permanent folder
    const permanentPublicId = tempPublicId.replace(/^temp-uploads\//, `${permanentFolder}/`);
    
    console.log(`📤 Uploading from temp URL to permanent location: ${permanentPublicId}`);
    
    // Upload from the temp URL to the permanent location
    // Cloudinary can upload from a remote URL (the temp Cloudinary URL)
    const uploadResult = await cloudinary.uploader.upload(tempUrl, {
      public_id: permanentPublicId,
      folder: permanentFolder,
      overwrite: false,
      resource_type: 'image',
      invalidate: true, // Invalidate CDN cache
    });
    
    console.log(`✅ Uploaded to permanent location: ${uploadResult.secure_url}`);
    
    // Delete the temp file
    try {
      const deleteResult = await cloudinary.uploader.destroy(tempPublicId);
      if (deleteResult.result === 'ok') {
        console.log(`🗑️  Deleted temp file: ${tempPublicId}`);
      } else {
        console.warn(`⚠️  Failed to delete temp file: ${deleteResult.result}`);
      }
    } catch (deleteError) {
      console.warn(`⚠️  Error deleting temp file (non-critical): ${deleteError.message}`);
    }
    
    return uploadResult.secure_url;
  } catch (error) {
    console.error(`❌ Error moving image to permanent folder:`, error);
    // If move fails, return original temp URL
    return tempUrl;
  }
};

/**
 * Process image URL: move from temp if needed, delete old image
 * @param {string} newImageUrl - New image URL (may be in temp folder)
 * @param {string} oldImageUrl - Old image URL to delete
 * @param {string} permanentFolder - Permanent folder name
 * @returns {Promise<string>} - Final permanent URL
 */
export const processImageUpdate = async (newImageUrl, oldImageUrl, permanentFolder = 'assana-uploads') => {
  if (!newImageUrl) return newImageUrl;
  
  let finalUrl = newImageUrl;
  
  // Move new image from temp to permanent if needed
  if (newImageUrl && newImageUrl.includes('/temp-uploads/')) {
    finalUrl = await moveImageToPermanent(newImageUrl, permanentFolder);
  }
  
  // Delete old image if it exists and is different from new one
  if (oldImageUrl && oldImageUrl !== finalUrl && !oldImageUrl.includes('/temp-uploads/')) {
    try {
      await deleteImageFromCloudinary(oldImageUrl);
    } catch (error) {
      // Don't fail the update if deletion fails
      console.error('Failed to delete old image, but continuing with update:', error);
    }
  }
  
  return finalUrl;
};

/**
 * Process sections array with images: move temp images and track old images for deletion
 * @param {Array} newSections - New sections array
 * @param {Array} oldSections - Old sections array
 * @param {string} permanentFolder - Permanent folder name
 * @returns {Promise<Array>} - Processed sections array
 */
export const processSectionsWithImages = async (newSections, oldSections = [], permanentFolder = 'assana-uploads') => {
  if (!Array.isArray(newSections)) return newSections;
  
  const processedSections = [];
  const oldImageUrls = new Set();
  
  // Collect all old image URLs
  oldSections.forEach(section => {
    if (section.image && !section.image.includes('/temp-uploads/')) {
      oldImageUrls.add(section.image);
    }
  });
  
  // Process new sections
  for (const section of newSections) {
    const processedSection = { ...section };
    
    // Process image field if it exists
    if (section.image) {
      const oldImage = oldSections.find(s => s.title === section.title)?.image;
      processedSection.image = await processImageUpdate(section.image, oldImage, permanentFolder);
      
      // Remove from oldImageUrls if it's being reused
      if (oldImageUrls.has(processedSection.image)) {
        oldImageUrls.delete(processedSection.image);
      }
    }
    
    processedSections.push(processedSection);
  }
  
  // Delete old images that are no longer used
  for (const oldUrl of oldImageUrls) {
    try {
      await deleteImageFromCloudinary(oldUrl);
    } catch (error) {
      console.error('Failed to delete old section image:', error);
    }
  }
  
  return processedSections;
};

