const uuid = require('uuid');
const crypto = require('crypto');
const q = require('q')

function hash(str) {
    const hmac = crypto.createHmac('sha256', process.env.HASH_SECRET || 'IFNEIU@893rsfiu*UEI');
    hmac.update(str);
    return hmac.digest('hex');
}

function createToken() {
    return 'token.' + uuid.v4().split('-').join('');
}

class UserService {
    constructor(db) {
        this.db = db;
        this.getUserProfileByToken = this.getUserProfileByToken.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    /**
     * Registers a user and returns it's token
     * @param {String} name
     * @param {String} email
     * @param {String} password
     * @return {Promise} resolves to user's token or rejects with Error that has statusCodes
     */
    registerUser(name, email, password) {
        console.log('resinted ')
        let deferred = q.defer()
        // setTimeout(deferred.error("YET TO CODE API"), 100)

        this.db.collection('users').insertOne({ _id: createToken(), name, email, password:hash(password) }, (err, result) => {
            if (err) {
              if(err.errmsg.includes('duplicate key error')){

                deferred.reject('This email is already registered.');
              }
            } else {
                // console.log('results ', result);
                deferred.resolve(result);
            }

        })

        return deferred.promise
    }

    /**
     * Gets a user profile by token
     * @param {String} token
     * @return {Promise} that resolves to object with email and name of user or rejects with error
     */
    getUserProfileByToken(token) {
        let deferred = q.defer()
        // setTimeout(deferred.error("YET TO CODE API"), 100)
        this.db.collection("users").find({ _id: token }).toArray((err, items) => {
            if (err) {
                deferred.reject(err);
            } else {

                deferred.resolve(items);

            }
        })
        return deferred.promise
    }

    /**
     * Log in a user to get his token
     * @param {String} email
     * @param {String} password
     * @return {Promise} resolves to token or rejects to error
     */
    logIn(email, password) {
       let deferred = q.defer()
         this.db.collection("users").find({ email: email,password:hash(password) }).toArray((err, items) => {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(items);
            }
        })
        return deferred.promise
    }

    logOut(token) {
        let deferred = q.defer()
        deferred.resolve('ok');
        return deferred.promise
    }
}

module.exports.UserService = UserService;