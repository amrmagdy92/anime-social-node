var router = require('express').Router();
const FlagReasonsController = require('../Controllers/FlagReasons/FlagReasons');

router.get('/', (req, res) => {
    FlagReasonsController.getFlagReasons();
});

module.exports = router;