'use strict'

const crypto = require("crypto")
const moment = require("moment");

const Mail = use('Mail')
const User = use('App/Models/User')

class ForgotPasswordController {
    async store ({ request, response }) {
     try {
        const email = request.input('email')
        const user = await User.findByOrFail('email', email)

        user.token = crypto.randomBytes(10).toString('hex')
        user.token_created_at = new Date()
        
        await user.save()

        await Mail.send(
           ['emails.forgot_password'],
           { email, token: user.token, link: `${request.input("redirect_url")}?token=${user.token}` },
           message => {
              message
               .to(user.email)
               .from("joaovictorandrade32@hotmail.com", "Victor | MJC_COMPANY")
           }

        )
     } catch(err) {
        return response.status(err.status).send({ error: { message: "Algo não deu certo, esse email existe?" } })
     }
    }

    async update ({ request, response }) {
       try {
         const { token, password } = request.all()

         const user = await User.findByOrFail('token', token)

         const tokenExpired = moment().subtract('2', 'days').isAfter(user.token_created_at);

         if(tokenExpired) {
            return response.status(err.status).send({ error: { message: "O token está expirado!" } })
         }

         user.token = null
         user.token_created_at = null
         user.password = password

         await user.save();
       } catch(err) {
         return response.status(err.status).send({ error: { message: "Algo deu errado ao resetar sua senha" } })
       }
    }
}

module.exports = ForgotPasswordController
