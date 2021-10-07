var router = require('express').Router();
const FlagsController = require('../Controllers/Flags/Flags');

router.post('/create', (req, res) => {
    FlagsController.createFlag();
});

module.exports = router;