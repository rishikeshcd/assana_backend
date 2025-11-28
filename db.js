import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection string - database name should be before query params
// Format: mongodb+srv://user:pass@cluster.mongodb.net/database?options
// If MONGODB_URI is set in .env, it will be used, otherwise use the fallback

// Fix connection string if database name is in wrong place (common issue with MongoDB Atlas)
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rishikeshcd123_db_user:Pv3TkwpVX3xK0gpI@cluster0.mdpzkqc.mongodb.net/assana?retryWrites=true&w=majority';

// Fix common issue: database name after ?appName=Cluster0/database
// Convert: mongodb+srv://...@cluster.mongodb.net/?appName=Cluster0/database
// To: mongodb+srv://...@cluster.mongodb.net/database?appName=Cluster0
if (MONGODB_URI.includes('/?appName=') && MONGODB_URI.includes('/assana')) {
  const match = MONGODB_URI.match(/^(.+?)\/\?appName=([^\/]+)\/(.+)$/);
  if (match) {
    const [, base, appName, dbName] = match;
    MONGODB_URI = `${base}/${dbName}?appName=${appName}&retryWrites=true&w=majority`;
    console.log('🔧 Fixed connection string format');
  }
}

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    // Hide password in logs for security
    const safeUri = MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log('📍 Connection string:', safeUri);
    
    const conn = await mongoose.connect(MONGODB_URI);

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState} (1=connected)`);
    
    // Monitor connection events for debugging
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error('   Error:', error.message);
    if (error.message.includes('authentication failed')) {
      console.error('   💡 Check your username and password');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('   💡 Check your cluster URL and internet connection');
    } else if (error.message.includes('timeout')) {
      console.error('   💡 Connection timeout - check firewall/network settings');
    }
    console.error('   Full error:', error);
    process.exit(1);
  }
};

// Export connection status checker
export const checkConnection = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return {
    isConnected: state === 1,
    state: states[state] || 'unknown',
    readyState: state
  };
};

export default connectDB;
