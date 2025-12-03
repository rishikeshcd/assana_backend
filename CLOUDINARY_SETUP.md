# Cloudinary Setup Guide

This guide will help you set up Cloudinary for persistent file uploads in your backend.

## Why Cloudinary?

- **Persistent Storage**: Files are stored in the cloud and won't be lost on server restarts
- **CDN**: Fast image delivery worldwide
- **Image Optimization**: Automatic image optimization and transformations
- **Free Tier**: 25GB storage and 25GB bandwidth per month (free tier)

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account (or log in if you already have one)
3. Verify your email address

## Step 2: Get Your Cloudinary Credentials

1. After logging in, go to your [Dashboard](https://cloudinary.com/console)
2. You'll see your account details including:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## Step 3: Set Environment Variables

### For Local Development

Create a `.env` file in the `backend` folder (if it doesn't exist):

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/assana?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
CLOUDINARY_FOLDER=assaana-uploads
```

Replace the Cloudinary values with your actual credentials from Step 2.

### For Render Deployment

1. Go to your Render dashboard
2. Select your web service
3. Go to **Environment** tab
4. Add these environment variables:
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your API key
   - `CLOUDINARY_API_SECRET` = your API secret
   - `CLOUDINARY_FOLDER` = `assaana-uploads` (optional, defaults to this)

## Step 4: Test the Setup

1. Start your backend server:
   ```bash
   npm start
   ```

2. You should see in the console:
   ```
   ✅ Cloudinary storage configured
   ```

3. If Cloudinary is not configured, you'll see:
   ```
   ⚠️  Using local storage (Cloudinary not configured)
   ```

4. Test uploading an image through your CMS. The uploaded image URL should be a Cloudinary URL (e.g., `https://res.cloudinary.com/your-cloud-name/image/upload/...`)

## How It Works

- **With Cloudinary**: Files are uploaded directly to Cloudinary and you get a CDN URL back
- **Without Cloudinary**: Files are stored locally in the `uploads` folder (works for development, but files are lost on Render redeploys)

## Troubleshooting

### "Cloudinary storage configured" but uploads fail

- Check that all three environment variables are set correctly
- Verify your API credentials in the Cloudinary dashboard
- Check the server logs for specific error messages

### Images not displaying

- Cloudinary URLs should start with `https://res.cloudinary.com/`
- Make sure the URL is being saved correctly in your database
- Check browser console for CORS or network errors

### Still using local storage

- Make sure your `.env` file is in the `backend` folder
- Restart your server after adding environment variables
- Check that variable names match exactly (case-sensitive)

## Security Notes

- **Never commit your `.env` file** to Git
- Keep your `CLOUDINARY_API_SECRET` secure
- Consider using Cloudinary's upload presets for additional security
- Set up Cloudinary upload restrictions in your dashboard if needed

## Additional Cloudinary Features

You can enhance your setup with:

- **Image Transformations**: Resize, crop, optimize images on-the-fly
- **Upload Presets**: Pre-configure upload settings
- **Access Control**: Restrict who can upload/access images
- **Webhooks**: Get notified when uploads complete

For more information, visit: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)

