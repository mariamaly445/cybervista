// middleware/authMiddleware.js - FOR MILESTONE 1 TESTING
const authMiddleware = (req, res, next) => {
    try {
        console.log('🔐 Auth middleware - Bypassing for Milestone 1');
        // Attach a mock user object for testing
        req.user = {
            id: 'mock-user-id-for-milestone-1', // Used by your controllers
            companyName: 'Test FinTech Inc'
        };
        next(); // Pass control to the next handler
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Authentication middleware error' 
        });
    }
};

module.exports = authMiddleware;