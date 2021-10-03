const embeddedDBMethods = require('./EmbeddedURLsMySQL');
const AccessController = require('../ACL/ACL');

module.exports = {
    createEmbeddedURL: (authorization, embeddedURLReferenceType, embeddedURL) => {
        var embeddedURLReferenceTypes = ['posts'];
        var urlScheme = ['http', 'https'];
        var embedded_url;
        var validationErrors;
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);

        try {
            embedded_url = new URL(embeddedURL);
        } catch (err) {
            return result = {
                status: 'error',
                code: 400,
                message: 'Please enter a valid URL'
            };
        };

        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        if (!embeddedURLReferenceTypes.includes(embeddedURLReferenceType)) {
            validationErrors.embedded_url_reference_types = {
                reason: 'in_array',
                message: `Reference type must be: ${embeddedURLReferenceTypes.join(',')}`
            };
        };

        if (!embeddedURL) {
            validationErrors.embedded_url = {
                reason: 'empty',
                message: 'Please enter a url'
            };
        };

        if (embedded_url && !urlScheme.includes(embedded_url.protocol)) {
            validationErrors.embedded_url = {
                reason: 'invalid_url',
                message: 'Please enter a valid url'
            };
        };

        if (validationErrors) {
            return result = {
                status: 'error',
                code: 422,
                message: 'Please correct highlighted errors',
                validationErrors
            };
        };

        var embedded_title = embedded_url.searchParams.get('title');
        var embedded_description = embedded_url.searchParams.get('description');
        var embedded_thumbnail = embedded_url.searchParams.get('thumbnail');

        if (!embedded_title && !embedded_description && !embedded_thumbnail) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'url_parsed_error',
                message: 'Could not parse given url'
            };
        };

        var embeddedURLID = embeddedDBMethods.insertEmbeddedURL(embeddedURLReferenceType, embeddedURL, embedded_title, embedded_description, embedded_thumbnail);
        var data = embeddedDBMethods.getEmbeddedURLByID(embeddedURLID);

        return result = {
            status: 'success',
            code: 400,
            message: 'URL Parsed successfully',
            data
        };
    },
    deleteEmbeddedURL: (authorization, embeddedURLID) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var url = embeddedDBMethods.getEmbeddedURLByID(embeddedURLID);
        if (!url) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_embedded_url_id',
                message: 'invalid embedded_url_id'
            };
        };

        embeddedDBMethods.deleteEmbeddedURL(embeddedURLID);

        return result = {
            status: 'success',
            code: 200,
            message: 'URL details deleted successfully'
        };
    }
};