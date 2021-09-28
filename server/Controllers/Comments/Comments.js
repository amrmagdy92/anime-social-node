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
                    message: `Reference ID not found for ${commentReferenceID}`
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
    createComment: (authorization, commentReferenceID, commentReferenceType, commentParentID, commentText, commentIsSpoiler, commentReplyToUserID) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);

        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var authorID = authorized.user_id;
        var comment_parent_id = commentParentID.trim();
        var comment_text = commentText.trim();
        var comment_is_spoiler = commentIsSpoiler.trim();

        var validationErrors;

        if (!commentReferenceID.trim()) {
            validationErrors.commentReferenceID = {
                reason: 'invalid_reference_id',
                message: `Reference ID not found for ${commentReferenceID}`
            };
        };

        var commentReferenceTypes = ['posts'];
        if (!commentReferenceTypes.includes(commentReferenceType)) {
            validationErrors.commentReferenceType = {
                reason: 'in_array',
                message: `Reference type must be: ${commentReferenceTypes.join(', ')}`
            };
        };

        if (!validationErrors.hasOwnProperty(commentReferenceID) && !validationErrors.hasOwnProperty(commentReferenceType)) {
            var reference = commentsDBMethods.getReferenceObject(commentReferenceID, commentReferenceType);
            if (!reference) {
                validationErrors.commentReferenceID = {
                    reason: 'invalid_reference_id',
                    message: `Reference ID not found for ${commentReferenceID}`
                };
            };
        };

        if (commentParentID) {
            comment = commentsDBMethods.getCommentByID(commentParentID);
            if (!comment || comment.commentReferenceID != commentReferenceID) {
                validationErrors.comment_parent_id = {
                    reason: 'invalid_comment_parent_id',
                    message: `The given comment_parent_id: ${commentParentID} is invalid.`
                };
            };
        };

        if (!commentText) {
            validationErrors.comment_text = {
                reason: 'empty',
                message: 'Please enter a comment.'
            };
        };

        if (commentText && commentText.length > 1000) {
            validationErrors.comment_text = {
                reason: 'string length',
                message: 'Please enter less than 100 char'
            };
        };

        var commentSpoilerValues = ['Yes', 'No'];
        if (!commentSpoilerValues.includes(commentIsSpoiler)) {
            validationErrors.comment_is_spoiler = {
                reason: 'in_array',
                message: `Please select from: ${commentSpoilerValues.join(',')}`
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

        commentsDBMethods.insertComment( commentReferenceID, commentReferenceType, authorID, commentParentID, commentText, commentIsSpoiler, commentReplyToUserID);
        
        return result = {
            status: 'success',
            code: 200,
            message: 'Comment created successfully'
        }
    },
    updateComment: () => {},
    deleteComment: () => {},
    reaction: () => {}
}