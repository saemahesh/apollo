const { UserService } = require('../services/user-service');
const { InputValidator } = require('../validators/input-validator');

class AuthenticationController {
    constructor(db) {
        this.userService = new UserService(db);
        this.registerUser = this.registerUser.bind(this);
        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    // Validate Email
    // Validate Password
    // Save User
    registerUser(req, res, next) {
        let data = req.body;
        if (!data.name || !data.email || !data.password) {

            res.status(400)
            res.send('Please fill all fields');
        } else {
            this.userService.registerUser(data.name, data.email, data.password).then(result => {
                console.log('result register >>>>', result.insertedId);
                res.status(201);
                res.send({ token: result.insertedId })
            }).catch(err => {
                res.status(400)
                res.send(err);
            })

        }


    }

    logIn(req, res, next) {

        let data = req.body;
        console.log('data ', data);
        this.userService.logIn(data.email, data.password).then(result => {
            console.log('login result >>>>', result);
            if (result.length) {
                res.send({ token: result[0]._id })
            } else {
                res.status(400)
                res.send('Wrong credentials');
            }
        }).catch(err => {
            res.status(400)
            res.send(err);
        })
    }

    logOut(req, res, next) {

        this.userService.logOut().then(result => {
            console.log('login result >>>>', result);

            res.send({result:'ok'})

        }).catch(err => {
            res.status(400)
            res.send(err);
        })
    }
}

module.exports.AuthenticationController = AuthenticationController;