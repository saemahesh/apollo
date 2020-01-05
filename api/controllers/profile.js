const { UserService } = require('../services/user-service');

class ProfileController {

  constructor(db) {
    this.userService = new UserService(db);
    this.getUserProfile = this.getUserProfile.bind(this);
  }

  getUserProfile(req, res, next) {
  	let token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  	// console.log('tokennn  ', token)
  	if(token){
  		this.userService.getUserProfileByToken(token).then(result=>{
  		// console.log('token data ', result);
  		res.send(result[0])
  	}).catch(err=>{
  		 res.status(400)
  		res.send(err)
  	});
  	}else{
  		 res.status(401)
  		res.send('Token is not specified')
  	}
  	
  }
}

module.exports.ProfileController = ProfileController;
