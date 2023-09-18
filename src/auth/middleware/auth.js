const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  // Verificar si el token es válido
  // Esto se hace a traves de la funcion "verify" de JWT
  // esta recibe el token, la llave y un callback con el error en caso de haber uno
  // y el token con su información decodificada

  //         token       llave          callback  
  jwt.verify(token, process.env.KEY, (err, decoded) => {
    if (err) {
      return res.status(400).json("Token no válido");
    }

    // Si el usuario es un administrador, permitir el acceso a todas las rutas
    if (decoded.role === "admin") {
      return next();
    }

    // Si el usuario no es un administrador y está intentando acceder a /admin, denegar el acceso
    if (req.url === "/admin") {
      return res.status(403).json("No tienes acceso a esta ruta");
    }

    // Si el usuario no es un administrador y no está intentando acceder a /admin, permitir el acceso
    next();
  });
};

module.exports = auth;
