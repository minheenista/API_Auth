const express = require("express");

const routesUser = require("./src/routes/auth.routes");

const app = express();
const puerto = process.env.PORT || 3000;

//server config
app.use(express.json());
app.use("/app", routesUser);

const server = app.listen(puerto, () =>
	console.log(`Servidor escuchando en el puerto: ${puerto}`)
);
