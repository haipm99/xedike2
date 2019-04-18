const authorizing = (userType) => {
    return (req, res) => {
        if(req.user.userType === userType){
            res.status(200).json({msg: 'success !'});
        }
        else{
            res.status(404).json({msg:'you dont permit to this page !'})
        }
    }
}

module.exports = {
    authorizing
}