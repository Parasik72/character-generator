const Roles = (roles) => {
    return (req, res, next) => {
        try {
            if(req.method === 'OPTIONS')
                return next();
            const user = req.user;
            if(!user)
                return res.status(401).json({message: 'No authorization'});
            for (const requiredRole of roles)
                if(requiredRole === user.role)
                    return next();
            return res.status(403).json({message: 'No access'});
        } catch (error) {
            return res.status(403).json({message: 'No access'});
        }
    }
}

module.exports = Roles;