const flagsDBMethods = require('./FlagsMySQL');
const AccessController = require('../ACL/ACL');

module.exports = {
    createFlag: (authorization, flagReferenceID, flagReferenceType, flagReasonID, flagExplanation) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);

        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var authorID = authorized.user_id;

        var flag = flagsDBMethods.getUserFlagged(
            flagReferenceID.trim(),
            flagReferenceType.trim(),
            authorID
        );

        if (flag) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'already_flagged',
                message: 'User can only be flagged once'
            };
        };

        var validationErrors;

        if (!flagReferenceID.trim()) {
            validationErrors.flag_reference_id = {
                reason: 'empty',
                message: 'Reference ID could not be empty'
            };
        }

        var flagReferenceTypes = ['posts', 'comments'];
        if (!flagReferenceTypes.includes(flagReferenceType.trim())) {
            validationErrors.flag_reference_type = {
                reason: 'in_array',
                message: `Reference type must be: ${flagReferenceTypes.join(',')}`
            };
        };

        if (validationErrors.hasOwnProperty(flag_reference_id) && validationErrors.hasOwnProperty(flag_reference_type)) {
            var reference = flagsDBMethods.getReferenceObject(flagReferenceID.trim(), flagReferenceType.trim());
            if (!reference) {
                validationErrors.flag_reference_id = {
                    reason: 'invalid_reference_id',
                    message: `Reference ID not foind for ${flagReferenceType}`
                };
            };
        };

        var flagReason = flagsDBMethods.getFlagReasonById(flagReasonID.trim());
        if (!flagReason || flagReason.flag_reason_reference_type != flagReferenceID.trim() || flagReason.flag_reason_status != 'Active') {
            validationErrors.flag_reason_id = {
                reason: 'invalid_flag_reason_id',
                message: 'Invlaid flag_reason_id'
            };
        };

        if (!flagExplanation && flagExplanation.length > 1000) {
            validationErrors.flag_explanation = {
                reason: 'strlen',
                message: 'Please enter less thatn 1000 char.'
            };
        };

        if (validationErrors) {
            return result = {
                status: 'error',
                code: 422,
                reason: 'validation_errors',
                message: 'Please correct the highlighted errors',
                validationErrors
            };
        };

        flagsDBMethods.insertFlag(flagReferenceID.trim(), flagReferenceType.trim(), authorID, flagReasonID.trim(), flagExplanation.trim());

        return result = {
            status: 'success',
            code: 200,
            message: 'Flag created successfully'
        };
    }
}