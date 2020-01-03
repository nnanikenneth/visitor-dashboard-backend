const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        let token = req.headers['user-key'].split(" ")[1];
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.customerData = decoded;
        next();
    }catch(err){
        res.status(401).json({
            message : 'Unauthorized'
        });
    }
}