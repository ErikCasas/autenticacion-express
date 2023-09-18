const users = require("../../data/data");
const { Router } = require("express");
const jwt = require("jsonwebtoken");

const router = Router();

router.post("/", (req, res) => {
  //extraemos la información del body
  const { user, password } = req.body;

  //hacemos una busqueda y validación con la información local (data.js)
  const userInDb = users.find(
    (e) => e.user === user && e.password === password
  );

  //si el usuario y contraseña son correctos, comenzamos el proceso para crear el token
  if (userInDb) {
    //se utiliza el metodo sign de jsonwebtoken para crear el token
    //este metodo recibe dos cosas: ┐
    //                              |
    //                       info   ┴ palabra secreta
    const token = jwt.sign(userInDb, process.env.KEY);

    //respondemos con el token con el fin de que lo utilice en cada solicitud
    res.status(200).json({ token });
  } else {
    //llegado el caso damos un mensaje indicando que los datos están mal
    res.status(200).json("usuario o contraseña incorrecta");
  }
});

module.exports = router;
