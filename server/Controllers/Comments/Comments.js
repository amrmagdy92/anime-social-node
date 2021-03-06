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

        if (!commentText.trim()) {
            validationErrors.comment_text = {
                reason: 'empty',
                message: 'Please enter a comment.'
            };
        };

        if (commentText.trim() && commentText.length > 1000) {
            validationErrors.comment_text = {
                reason: 'string length',
                message: 'Please enter less than 1000 char'
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
    updateComment: (authorization, commentID, commentText, commentIsSpoiler) => {
        checkAuthorization = AccessController.isAuthorizedUser(authorization);

        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var authorID = authorized.user_id;

        var comment = commentsDBMethods.getCommentByID(commentID);

        if (!comment) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalide_comment_id',
                message: 'Invalid comment_id'
            };
        };

        if (comment.author_id != authorID) {
            return result = {
                status: 'error',
                code: '403',
                reason: 'invalid_author',
                message: 'Not authorizedto perform the requested operation'
            };
        };

        var validationErrors;

        if (!commentText.trim()) {
            validationErrors.comment_text = {
                reason: 'empty',
                message: 'Please enter a comment.'
            };
        };

        if (commentText.trim() && commentText.length > 1000) {
            validationErrors.comment_text = {
                reason: 'string length',
                message: 'Please enter less than 1000 char'
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

        commentsDBMethods.updateComment(commentID, commentText, commentIsSpoiler);

        return result = {
            status: 'success',
            code: 200,
            message: 'Comment updated successfully'
        }
    },
    deleteComment: (authorization, commentID) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);

        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var authorID = authorized.user_id;

        var comment = commentsDBMethods.getCommentByID(commentID.trim());
        
        if (!comment) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalide_comment_id',
                message: 'Invalid comment_id'
            };
        };

        commentsDBMethods.deleteComment(commentID.trim(), comment.comment_parent_id, authorID);

        return result = {
            status: 'success',
            code: 200,
            message: 'Comment deleted successfully'
        };
    },
    reaction: (authorization, commentID, reaction) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var userID = authorized.user_id;

        var comment = commentsDBMethods.getCommentByID(commentID.trim());
        if (!comment) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_comment_id',
                message: 'Invalid comment_id'
            };
        };

        var validationErrors;
        var reactionValues = ['like', 'dislike'];

        if (reactionValues.includes(reaction)) {
            validationErrors.reaction = {
                reason: 'in_array',
                message: `Please select from: ${reactionValues.join(',')}`
            };
        }

        if (validationErrors) {
            return result = {
                status: 'error',
                code: 422,
                reason: 'validation_errors',
                message: 'Please correct the highlighted errors',
                validationErrors
            };
        };

        commentsDBMethods.saveCommentReaction(userID, commentID, reaction);

        return result = {
            status: 'success',
            code: 200,
            message: 'Comment reaction saved successfully'
        };
    }
}