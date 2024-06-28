const jwt = require('jsonwebtoken');

module.exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    console.log('Authorization Header:', authHeader); // Log the Authorization header

    if (!authHeader) {
        return res.status(403).send('Access denied. No token provided.');
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token); // Log the token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // Log the decoded token
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

module.exports.authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied. Admins only.');
    }
    next();
};
