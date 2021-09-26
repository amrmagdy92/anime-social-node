const commentsDBMethods = require('./CommentsMySQL');
const AccessController = require('../ACL/ACL');

module.exports = {
    getComments: (authorization, params) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var commentReferenceID = params.comment_reference_id.trim();
        var commentReferenceType = params.comment_reference_type.trim();
        var validationErrors;

        if (!commentReferenceID) {
            validationErrors.commentReferenceID = {
                reason: 'empty',
                message: 'Reference ID can not be empty'
            };
        };

        var commentReferenceTypes = ['posts'];
        if (!commentReferenceTypes.includes(commentReferenceType)) {
            validationErrors.commentReferenceType = {
                reason: 'in_array',
                message: `Reference type must be: ${commentReferenceTypes.join(', ')}`
            };
        };

        if (!validationErrors.hasOwnProperty(commentReferenceID) && validationErrors.hasOwnProperty(commentReferenceType)) {
            var reference = commentsDBMethods.getReferenceObject(commentReferenceID, commentReferenceType);
            if (!reference) {
                validationErrors.commentReferenceID = {
                    reason: 'invalid_reference_id',
                    message: `Reference ID not found for ${commentReferenceType}`
                };
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
        params._order_by = 'comment_created_at_desc';
        params._records_per_page = 25;

        var data = commentsDBMethods.getComments(params);

        return result = {
            status: 'success',
            code: 200,
            message: 'Found the queried data',
            queryResult: data
        }
    },
    createComment: () => {},
    updateComment: () => {},
    deleteComment: () => {},
    reaction: () => {}
}