const flagReasonsDBMethods = require('./FlagReasonsMySQL');
const AccessController = require('../ACL/ACL');

module.exports = {
    getFlagReasons: (authorization, params) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);

        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var validationErrors;

        var flagReasonReferenceTypes = ['comments', 'posts'];
        if (!flagReasonReferenceTypes.includes(params.flag_reason_reference_type.trim())) {
            validationErrors.flag_reason_reference_type = {
                reason: 'in_array',
                message: `Type must be: ${flagReasonReferenceTypes.join(',')}`
            };
        };

        params.flag_reason_status = 'Active';

        if (validationErrors) {
            return result = {
                status: 'error',
                code: 422,
                reason: 'validation_errors',
                message: 'Please correct the highlighted errors',
                validationErrors
            };
        };

        var data = flagReasonsDBMethods.getFlagReasons(params);

        return result = {
            status: 'success',
            code: 200,
            message: 'Comment flagged successfully',
            data
        };
    }
}