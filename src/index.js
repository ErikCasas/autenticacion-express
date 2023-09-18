require("dotenv").config();//acceder a la variables de entorno ".env"
const express = require("express");
const auth = require("./auth/middleware/auth");
const loginRoute = require("./auth/routes/login");
const adminRoute = require("./routes/adminRoutes");
const userRoute = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.use(auth);

//ruta donde realizamos la autenticación
app.use("/login", loginRoute);

//ruta solo para usuarios admin
app.use("/admin", adminRoute);

//ruta de acceso a todo publico
app.use("/user", userRoute);

          //variables de entorno
app.listen(process.env.PORT, () =>
  console.log(`server on port ${process.env.PORT}`)
);
