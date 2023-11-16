const { User } = require('../../models')
const { signToken } = require('../../helpers/jwt')
const { comparePassword } = require('../../helpers/bcryptjs')

class UserController {
    static async handleLogin(req, res, next) {
        try {
            const { email, password } = req.body
            console.log(email,password,req.body, "ini handle login");
            if (!email) {
                throw { status: 400, message: "empty_email" }
            }
            if (!password) {
                throw { status: 400, message: "empty_password" }
            }

            const user = await User.findOne({
                where: {
                    email
                }
            })

            if (!user) {
                throw { status: 401, message: "invalid email/password" }
            }

            const isValidPassword = comparePassword(password, user.password)
            if (!isValidPassword) {
                throw { status: 401, message: "invalid email/password" }
            }

            const access_token = signToken({ id: user.id })
            res.json({ access_token, username: user.username, id: user.id })
        } catch (err) {
            next(err)
        }
    }

    static async handleRegister(req, res, next) {
        try {
            const { username, email, password } = req.body
            console.log(username, email, password, "ini register");
            if (!username) {
                throw { status: 400, message: "no_username" }
            }
            if (!email) {
                throw { status: 400, message: "no_email" }
            }
            if (!password) {
                throw { status: 400, message: "no_password" }
            }

            await User.create({ username, email, password })
            res.status(201).json({ message: 'Register Success' })
        } catch (err) {
            next(err)
        }
    }

}

module.exports = UserController

