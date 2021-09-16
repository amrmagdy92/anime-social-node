var router = require('express').Router();
const FlagReasonsController = require('../Controllers/FlagReasons/FlagReasons');

router.get('/', FlagReasonsController.getFlagReasons());

module.exports = router;