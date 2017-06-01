// Modules
var express = require('express');

// Models
var Activity = require('./../models/activity'),
  Point = require('./../models/point'),
  Unit = require('./../models/unit');

var router = express.Router()

router.get('/new', (req, res) => {
  Activity.find({}).then((activities) => {
    Point.find({}).populate('activityId').then((points) => {
      var activitiesArray = [];
      res.render('points/new', {points, activities});
    });
  })
  .catch(e => console.log(e));
});

router.post('/', (req, res) => {
  var point = new Point(req.body)
  point.save().then((point) => {
		res.redirect('/');
	}).catch((e) => console.log(e))
});

module.exports = router;
