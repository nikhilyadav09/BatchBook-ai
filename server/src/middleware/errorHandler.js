// server/src/middleware/errorHandler.js
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
  
    // Prisma errors
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'A record with this information already exists'
      });
    }
  
    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
  
    // Default error
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  };
  
  module.exports = errorHandler;