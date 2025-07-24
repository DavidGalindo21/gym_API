
export const permitirRol = (...roles)=>{
    return (req, res, next) => {
        const user = req.user;

        if (!user || !user.roldm || !roles.includes(user.rol)) {
            return res.status(403).json({ message: 'Acceso denegado: Rol no autorizado' });
        }

        next();
    };
}