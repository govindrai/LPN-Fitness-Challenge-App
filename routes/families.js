// Modules
var express = require('express');

// Models
var Family = require('./../models/family'),
  Challenge = require('./../models/challenge'),
  Participation = require('./../models/participation'),
  Point = require('./../models/point'),
  User = require('./../models/user');

var router = express.Router();

/* View all families */
router.get('/', function(req, res, next) {
  Family.find({}).then((families) => {
    res.render('families/index', {families});
  });
});

/* Create a new family */
router.get('/new', function(req, res, next) {
  res.render('families/new');
});

router.post('/', (req, res, next) => {
	var family = new Family(req.body);

	family.save().then(() => {
    res.params({added: true});
		res.redirect('/families');
	}).catch((e) => console.log(e))
});

// Family Show Page/ Authorized User Landing Page
router.get('/:family_name', (req, res) => {
    var family, currentChallenge, users, familyParticipations, participation;
    var participatingUsers = [];
    Family.findOne({name: req.params["family_name"]})
    .then((familyObj) => {
      family = familyObj;
      return Challenge.getCurrentChallenge();
    })
    .then((challenge) => {
      currentChallenge = challenge;
      return Participation.getParticipation(res.locals.user, [currentChallenge]);
    })
    .then(() => {
      return Participation.getParticipationByFamily(currentChallenge._id, family._id);
    })
    .then((participations) => {
      familyParticipations = participations;
      participation = familyParticipations.filter((participation) => {
        return participation.user._id.toString() == res.locals.user._id.toString();
      })
      console.log(participation)
      return Point.getPointsByDay(participation, '2017-06-08 07:00:00.000Z')
    })
    .then((points) => {
      console.log('points', points);
      res.render('families/show', {family, familyParticipations, currentChallenge});
    })
    .catch(e => console.log(e));
});

module.exports = router;