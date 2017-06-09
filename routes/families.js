// Modules
var express = require('express'),
  pug = require('pug');

// Models
var Family = require('./../models/family'),
  Challenge = require('./../models/challenge'),
  Participation = require('./../models/participation'),
  Point = require('./../models/point'),
  User = require('./../models/user');

var router = express.Router();

/* View all families */
router.get('/', function(req, res) {
  Family.find({}).then((families) => {
    res.render('families/index', {families});
  });
});

/* Create a new family */
router.get('/new', function(req, res) {
  res.render('families/new');
});

router.post('/', (req, res, next) => {
	var family = new Family(req.body);

	family.save().then(() => {
    res.params({added: true});
		res.redirect('/families');
	}).catch(e => console.log(e));
});

function weekDates() {
  var today = new Date();
  var day = today.getDay();
  var monday = new Date(today.setDate(today.getDate() - (day - 1)));
  var dates = [new Date(monday)];
  for (var i = 0; i < 6; i++) {
    dates.push(new Date(monday.setDate(monday.getDate() + 1)));
  }
  console.log(dates);
  return dates;
}

// Family Show Page/Authorized User Landing Page
router.get('/:familyName', (req, res) => {
    var family, currentChallenge, users, familyParticipations, participation;
    var participatingUsers = [];
    var dates = weekDates();

    Family.findOne({name: req.params.familyName})
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
      return familyParticipations.filter((participation) => {
        return participation.user._id.toString() == res.locals.user._id.toString();
      });
    })
    .then((currentParticipation) => {
      participation = currentParticipation;
      res.render('families/show', {dates, family, participation, familyParticipations, currentChallenge});
    })
    .catch(e => console.log(e));
});

router.get('/calendar', (req, res) => {
  if (req.xhr) {
    dates = [5,6,7,8,9,10,11];
    res.send(pug.renderFile(process.env.PWD + '/views/families/_calendar.pug', {dates}));
  }
});

router.get('/points', (req, res) => {
  if (req.xhr) {
    res.send()
  }
})


module.exports = router;