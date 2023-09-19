# Autenticación con Express

---

## Autenticación

La autenticación es el proceso mediante el cual verificamos la identidad de un usuario, generalmente a través de un par de credenciales, como un nombre de usuario y una contraseña. En este contexto, utilizaremos JSON Web Tokens (JWT) como una forma efectiva de gestionar la autenticación, lo que permitirá a los usuarios acceder de manera segura a los recursos de nuestra aplicación.

## Autorización

En este contexto, la autorización se refiere a los permisos otorgados a diferentes tipos de clientes que realizan solicitudes a nuestro servidor web. Estos permisos se utilizan para limitar las acciones que cada tipo de cliente puede realizar, con el objetivo de proteger recursos web que contienen información sensible. Esto asegura que solo los usuarios autorizados puedan acceder y realizar operaciones en estos recursos.

## Proceso de autenticación

1. #### Envío de Credenciales y Generación de Token

   - El cliente envía sus credenciales al servidor para verificar su registro previo.
   - Si las credenciales son válidas, el servidor genera un token JWT y lo devuelve como respuesta.
   - El token debe contener información relevante, como el rol del usuario, su identificador, entre otros detalles.

2. #### Uso del Token para Solicitudes Posteriores

   - El cliente debe incluir el token JWT en cada solicitud subsiguiente al servidor, lo que elimina la necesidad de repetir el proceso de autenticación en cada solicitud.
   - El token se debe enviar a través de los encabezados de la solicitud.
   - Se debe utilizar el encabezado "Authorization" para enviar el token.

3. #### Validación del Token en el Servidor

   - En el servidor, se extrae el token de los encabezados de la solicitud entrante.
   - Se verifica la autenticidad y validez del token para garantizar su integridad.
   - Se valida que el cliente tenga los permisos adecuados para acceder a la ruta solicitada, lo que puede lograrse, por ejemplo, mediante la verificación del rol del usuario, que estará contenido en el token.

4. #### Respuesta a la Solicitud del Cliente

- El servidor responde a la solicitud del cliente, proporcionando el recurso solicitado o una respuesta de error en función de la validación realizada.

## Crear un token con JWT

[**J**son **W**eb **T**oken](https://jwt.io/) es la herramienta que utilizaremos para ese proceso de autenticación en nuestro servidor de express, así que comentamos en el punto anterior, el primer paso es recibir esas credenciales y en base a si son validas o no, retornar un token, el cual será utilizado en cada futura solicitud.

#### creación del token
[Ver el archivo con el código ](./src/auth/routes/login.js)

```javascript
const jwt = require("jsonwebtoken");

const KEY = "PALABRASECRETA";

app.post("/login", (req, res) => {
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
    //                       info   ┴ palabra secreta
    const token = jwt.sign(userInDb, KEY);

    //respondemos con el token con el fin de que lo utilice en cada solicitud
    res.status(200).json({ token });
  } else {
    //llegado el caso damos un mensaje indicando que los datos están mal
    res.status(200).json("usuario o contraseña incorrecta");
  }
});
```

#### validando el token

[Ver el archivo con el código ](./src/auth/middleware/auth.js)

```javascript
const jwt = require("jsonwebtoken");

const KEY = "PALABRASECRETA";

// Middleware de autenticación
const auth = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const token = req.headers.authorization;

  // Verificar si el token está presente y es válido
  if (!token) {
    return res.status(401).json("Token no proporcionado");
  }

  // Verificar si el token es válido
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json("Token no válido");
    }

    // El token es válido, y la información del usuario está en `decoded`
    const user = decoded;

    // Verificar si el usuario es un administrador
    if (user.role === "admin") {
      // El usuario es un administrador, permitir el acceso a todas las rutas
      next();
    } else {
      // El usuario no es un administrador, verificar si está intentando acceder a /admin
      if (req.url === "/admin") {
        return res.status(403).json("No tienes acceso a esta ruta");
      }

      // El usuario no está intentando acceder a /admin, permitir el acceso
      next();
    }
  });
};
```
