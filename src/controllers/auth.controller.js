const User = require("../models/auth.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (email == undefined || password == undefined) {
			res.status(400).json({
				estado: 0,
				mensaje: "Rellene todos los campos",
			});
		} else {
			const usuario = await User.findOne({ email: email });
			if (!usuario) {
				res.status(404).json({
					estado: 0,
					mensaje: "Usuario no encontrado",
				});
			} else {
				usuario.password = password;
				const salt = await bcryptjs.genSalt(8);
				passwordHash = await bcryptjs.hash(password, salt);
				bcryptjs
					.compare(usuario.password, passwordHash)
					.then(function (resultadoComparacion) {
						if (resultadoComparacion) {
							const maxAge = 3 * 60 * 60;
							const token = jwt.sign(
								{ id: usuario._id, email },
								process.env.TOKEN_ACCESS,
								{
									expiresIn: maxAge, // 3hrs in sec
								}
							);
							res.cookie("jwt", token, {
								httpOnly: true,
								maxAge: maxAge * 1000, // 3hrs in ms
							});
							res.status(201).json({
								estado: 1,
								mensaje: "Inicion Sesiada",
								Token: token,
							});
						} else {
							res.status(401).json({
								estado: 0,
								mensaje: "Contraseña incorrecta",
							});
						}
					});
			}
		}
	} catch (error) {
		res.status(500).json({
			estado: 0,
			mensaje: "Ocurrio un error desconocido",
		});
	}
};
