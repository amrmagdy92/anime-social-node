const imagesDBMethods = require('./ImagesMySQL');
const AccessController = require('../ACL/ACL');
const path = require('path');
const fs = require('fs');
const uniqueID = require('../../Misc/utility');

module.exports = {
    createImages: (authorization, imageReferenceType, imageFiles) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var validationErrors;
        const imageReferenceTypes = ['posts'];

        if (!imageReferenceTypes.includes(imageReferenceType)) {
            validationErrors.image_reference_type = {
                reason: 'in_array',
                message: `Reference type must be: ${imageReferenceTypes.join(',')}`
            };
        };

        if (typeof imageFiles != 'object') {
            validationErrors.image_files = {
                reason: 'is_json',
                message: 'List of images must be JSON.'
            };
        };

        if (!validationErrors.hasOwnProperty('image_files')) {
            if (imageReferenceType == 'posts' && Object.keys(imageFiles).length > maxLength) {
                validationErrors.image_files = {
                    reason: 'max_limit_exceeded',
                    message: `A maximum of ${process.env.MAX_IMAGES_SINGLE_POST} is allowed in a single post`
                };
            };

            Object.entries(imageFiles).forEach(([key, value]) => {
                if (value == null || value == undefined) {
                    validationErrors.imageFiles = {
                        reason: 'empty',
                        message: `Please select image file. The image number: ${key} is empty`
                    };
                };
                break;
            });

            Object.entries(imageFiles).forEach(([key, value]) => {
                // TODO: check file size here
                // TODO: shouldn't file size check be a front end job?
            });

            Object.entries(imageFiles).forEach(([key, value]) => {
                var extension = path.extname(value);
                if (!process.env.ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
                    validationErrors.image_files = {
                        reason: 'invalid_file_type',
                        message: `The image number ${key} has an invalid extension. Only use images with extensions: ${process.env.ALLOWED_IMAGE_EXTENSIONS.join(',')}`
                    };
                };
                break;
            });

            // TODO: Add lines 129-139 from ImagesService.php
        };

        if(validationErrors) {
            return result = {
                status: 'error',
                code: 422,
                reason: 'validation_errors',
                message: 'Please correct the highlighted errors',
                validationErrors
            };
        };

        var image_ids = [];
        Object.entries(imageFiles).forEach(([key, value]) => {
            var extension = path.extname(value);
            var baseName = `${new Date().toISOString().split('T')[0]}-${uniqueID(8)}`;

            // TODO: try to understand the logic from the PHP file
        });
    },
    deleteImage: () => {}
};