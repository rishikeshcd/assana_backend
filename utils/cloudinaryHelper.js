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
    
    let publicId = extractPublicIdFromUrl(urlOrPublicId);
    
    // If extraction failed and it's not a URL, treat it as a public_id directly
    if (!publicId) {
      if (urlOrPublicId.includes('cloudinary.com')) {
        console.warn(`⚠️  Could not extract public_id from Cloudinary URL: ${urlOrPublicId.substring(0, 80)}...`);
        return null;
      }
      // If it's not a URL, assume it's already a public_id
      publicId = urlOrPublicId;
    }
    
    // Normalize public_id - remove any duplicate folder prefixes
    // Handle cases like "assana-uploads/assana-uploads/image-123" → "assana-uploads/image-123"
    const folderPattern = /^(assana-uploads|temp-uploads)\/\1\//;
    if (folderPattern.test(publicId)) {
      publicId = publicId.replace(folderPattern, '$1/');
      console.log(`🔧 Fixed duplicate folder in public_id: ${publicId}`);
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
 * Move image from temp folder to permanent folder (OPTIMIZED)
 * Uses Cloudinary's rename API which is much faster than re-uploading
 * @param {string} tempUrl - Temporary Cloudinary URL
 * @param {string} permanentFolder - Permanent folder name (default: 'assana-uploads')
 * @returns {Promise<string>} - New permanent URL
 */
export const moveImageToPermanent = async (tempUrl, permanentFolder = 'assana-uploads') => {
  if (!tempUrl) return tempUrl;
  
  // Check if URL is in temp folder (handle different URL formats with versions/transformations)
  const isTempUrl = tempUrl.includes('/temp-uploads/') || 
                    tempUrl.includes('temp-uploads/') ||
                    (tempUrl.includes('cloudinary.com') && tempUrl.match(/temp-uploads/));
  
  // If URL is not in temp folder, return as is
  if (!isTempUrl) {
    console.log(`ℹ️  URL is not in temp folder, skipping move: ${tempUrl.substring(0, 100)}...`);
    return tempUrl;
  }
  
  try {
    const tempPublicId = extractPublicIdFromUrl(tempUrl);
    if (!tempPublicId) {
      console.warn(`⚠️  Could not extract public_id from temp URL: ${tempUrl}`);
      return tempUrl;
    }
    
    // Remove 'temp-uploads/' prefix to get just the filename
    // Make sure we don't have duplicate folders
    let filename = tempPublicId.replace(/^temp-uploads\//, '');
    // Remove any existing folder prefix to avoid duplicates
    filename = filename.replace(/^(assana-uploads|temp-uploads)\//, '');
    
    // IMPORTANT: Cloudinary's rename API doesn't actually move files between folders
    // It only changes the public_id metadata, but the file stays in the original folder
    // So we MUST use upload method to actually move the file
    
    console.log(`📤 Moving image from temp to permanent folder`);
    console.log(`   From: ${tempPublicId}`);
    console.log(`   To folder: ${permanentFolder}`);
    console.log(`   Filename: ${filename}`);
    console.log(`   Temp URL: ${tempUrl}`);
    
    // Upload from temp URL to permanent location (this actually moves the file)
    // IMPORTANT: Specify both folder and public_id (without folder in public_id)
    const uploadResult = await cloudinary.uploader.upload(tempUrl, {
      folder: permanentFolder, // Specify folder explicitly
      public_id: filename, // Just the filename, folder is specified separately
      overwrite: false,
      resource_type: 'image',
      invalidate: true,
    });
    
    // Verify the upload was successful and in the correct folder
    if (!uploadResult.secure_url) {
      console.error(`❌ Upload failed - no secure_url returned`);
      return tempUrl; // Return original if something went wrong
    }
    
    // Check if the URL contains the permanent folder
    if (!uploadResult.secure_url.includes(`/${permanentFolder}/`)) {
      console.error(`❌ Upload result doesn't have correct permanent folder URL`);
      console.error(`   Expected folder: ${permanentFolder}`);
      console.error(`   Got URL: ${uploadResult.secure_url}`);
      console.error(`   Upload result:`, JSON.stringify(uploadResult, null, 2));
      return tempUrl; // Return original if something went wrong
    }
    
    console.log(`✅ Successfully moved to permanent location: ${uploadResult.secure_url}`);
    console.log(`   Public ID: ${uploadResult.public_id}`);
    
    // Delete the temp file (non-blocking - don't wait for it)
    cloudinary.uploader.destroy(tempPublicId)
      .then((deleteResult) => {
        if (deleteResult.result === 'ok') {
          console.log(`🗑️  Deleted temp file: ${tempPublicId}`);
        } else {
          console.warn(`⚠️  Failed to delete temp file: ${deleteResult.result}`);
        }
      })
      .catch((deleteError) => {
        console.warn(`⚠️  Error deleting temp file (non-critical): ${deleteError.message}`);
      });
    
    return uploadResult.secure_url;
  } catch (error) {
    console.error(`❌ Error moving image to permanent folder:`, error);
    // If move fails, return original temp URL
    return tempUrl;
  }
};

/**
 * Process image URL: move from temp if needed, delete old image (OPTIMIZED - non-blocking deletion)
 * @param {string} newImageUrl - New image URL (may be in temp folder)
 * @param {string} oldImageUrl - Old image URL to delete
 * @param {string} permanentFolder - Permanent folder name
 * @returns {Promise<string>} - Final permanent URL
 */
export const processImageUpdate = async (newImageUrl, oldImageUrl, permanentFolder = 'assana-uploads') => {
  if (!newImageUrl) return newImageUrl;
  
  let finalUrl = newImageUrl;
  
  // Move new image from temp to permanent if needed
  // Check for temp-uploads in URL (handle different URL formats)
  const isTempUrl = newImageUrl.includes('/temp-uploads/') || 
                    newImageUrl.includes('temp-uploads/') ||
                    (newImageUrl.includes('cloudinary.com') && newImageUrl.match(/temp-uploads/));
  
  if (isTempUrl) {
    console.log(`🔄 Processing temp image: ${newImageUrl.substring(0, 100)}...`);
    finalUrl = await moveImageToPermanent(newImageUrl, permanentFolder);
    console.log(`✅ Processed image result: ${finalUrl.substring(0, 100)}...`);
  } else {
    console.log(`ℹ️  Image is not in temp folder, skipping move: ${newImageUrl.substring(0, 100)}...`);
  }
  
  // Delete old image in background (non-blocking - don't wait for it)
  if (oldImageUrl && oldImageUrl !== finalUrl && !oldImageUrl.includes('/temp-uploads/')) {
    deleteImageFromCloudinary(oldImageUrl).catch(error => {
      // Don't fail the update if deletion fails
      console.error('Failed to delete old image (non-critical):', error.message);
    });
  }
  
  return finalUrl;
};

/**
 * Process sections array with images: move temp images and track old images for deletion (OPTIMIZED - parallel processing)
 * @param {Array} newSections - New sections array
 * @param {Array} oldSections - Old sections array
 * @param {string} permanentFolder - Permanent folder name
 * @returns {Promise<Array>} - Processed sections array
 */
export const processSectionsWithImages = async (newSections, oldSections = [], permanentFolder = 'assana-uploads') => {
  if (!Array.isArray(newSections)) return newSections;
  
  const oldImageUrls = new Set();
  
  // Collect all old image URLs
  oldSections.forEach(section => {
    if (section.image && !section.image.includes('/temp-uploads/')) {
      oldImageUrls.add(section.image);
    }
  });
  
  // Process all images in parallel (much faster!)
  const imageProcessingPromises = newSections.map(async (section) => {
    const processedSection = { ...section };
    
    if (section.image) {
      const oldImage = oldSections.find(s => s.title === section.title)?.image;
      processedSection.image = await processImageUpdate(section.image, oldImage, permanentFolder);
      
      // Remove from oldImageUrls if it's being reused
      if (oldImageUrls.has(processedSection.image)) {
        oldImageUrls.delete(processedSection.image);
      }
    }
    
    return processedSection;
  });
  
  // Wait for all images to be processed in parallel
  const processedSections = await Promise.all(imageProcessingPromises);
  
  // Delete old images in parallel (non-blocking - don't wait for completion)
  const deletePromises = Array.from(oldImageUrls).map(oldUrl => 
    deleteImageFromCloudinary(oldUrl).catch(error => {
      console.error('Failed to delete old section image:', error);
    })
  );
  
  // Don't wait for deletions to complete - they can happen in background
  Promise.all(deletePromises).catch(() => {
    // Silently handle any deletion errors
  });
  
  return processedSections;
};

