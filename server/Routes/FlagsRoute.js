var router = require('express').Router();
const FlagsController = require('../Controllers/Flags/Flags');

router.post('/create', FlagsController.createFlag());

module.exports = router;