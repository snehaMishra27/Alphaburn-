// middleware/auth.js
//express calls it automatically whenever route contains isAuthengicated
module.exports = function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();  //if verified move ahead else stop here only
    } 
    return res.status(401).json({ error: "Unauthorized" });
    
};
