const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');

    // Check if Authorization header exists
    if (!authHeader) {
        return res.status(401).json({ msg: 'No authorization header, access denied' });
    }

    // The header is typically "Bearer <token>". We need to split it.
    const tokenParts = authHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ msg: 'Token format is invalid, must be "Bearer <token>"' });
    }

    const token = tokenParts[1];
    
    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token found, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user from payload to the request object
        req.user = decoded.user;
        
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};