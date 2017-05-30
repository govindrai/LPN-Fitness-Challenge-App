var User = require('./../models/user');

function verifyAuthorization(req, res, next) {
  var token = req.session["x-auth"];
  User.verifyAuthorizationToken(token)
  .then((user) => {
    if (!user) {
      res.send("YOU DONT Belong here brah");
    }
    res.locals.loggedIn = true;
    res.locals.user = user;
    next();
  })
  .catch((e) => console.log(e));
}

module.exports = verifyAuthorization;