const authorization = (userType) => {
    return (req, res , next) => {
        if(req.user.userType === userType){
            return next();
        }
        else{
            res.status(404).json({msg:'you dont have permission !'})
        }
    }
}

module.exports = authorization;