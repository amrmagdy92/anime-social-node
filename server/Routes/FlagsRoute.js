var router = require('express').Router();
const FlagsController = require('../Controllers/Flags/Flags');

router.post('/create', (req, res) => {
    res.json(FlagsController.createFlag(
        req.headers.authorization,
        req.body.flag_reference_id,
        req.body.flag_reference_type,
        req.body.flag_reason_id,
        req.body.flag_explanation
    ));
});

module.exports = router;