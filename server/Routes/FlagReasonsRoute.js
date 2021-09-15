var router = require('express').Router();
const FlagReasonsController = require('./Controllers/FlagReasons');

router.get('/', FlagReasonsController.getFlagReasons());

module.exports = router;