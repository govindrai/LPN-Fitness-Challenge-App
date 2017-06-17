// Modules
var _ = require('lodash');

// Models
var User = require('./../models/user'),
  Challenge = require('./../models/challenge');

// middleware to check if the user is logged in
function verifyAuthorization(req, res, next) {
  // if x-auth key doesn't exist in session object
  //  render the 404 view (meaning they are not logged in)
  // else
  //  verify the JWT and find the user associated with the JWT
  var exemptPaths = ['/login', '/register', '/logout'];
  if (_.includes(exemptPaths, req.path)) {
    next();
  } else {
    if (!req.session["x-auth"]) {
      res.render('sessions/unauthorized');
    } else {
      var token = req.session["x-auth"];
      User.decodeAuthorizationToken(token)
      .then(user => {
        if (!user) res.status(404).send('UNAUTHORIZED.');
        res.locals.loggedIn = true;
        res.locals.user = user;
        res.locals.home = '/families/' + user.family.name;
        return user.getRegisterableChallengesCount();
      })
      .then(challengeCount => {
        res.locals.challengeCount = challengeCount;
        return Challenge.getCurrentChallenge();
      })
      .then(currentChallenge => {
        res.locals.currentChallenge = currentChallenge;
        next();
      })
      .catch(e => console.log(e));
    }
  }
}

module.exports = verifyAuthorization;