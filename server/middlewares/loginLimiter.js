const rateLimit = require('express-rate-limit');


const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 60 seconds
    max: 10, // Limit each IP to 5 login requirest per 'window'
    message: {
        message: "Too many login attempts from this IP, please try again in 60 seconds."
    },
    handler: (req, res, next, options) => {
       res.json(options.message); 
    },
    standardHeaders: true,
    legacyHeaders: false,
});


module.exports = loginLimiter;