var router = require('express').Router();
const FlagReasonsController = require('../Controllers/FlagReasons/FlagReasons');

router.get('/', (req, res) => {
    res.json(FlagReasonsController.getFlagReasons(
        req.headers.authorization,
        req.params
    ));
});

module.exports = router;