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
    deleteImage: (authorization, imageID) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var image = imagesDBMethods.getImageByID(imageID.trim());
        if (!image) {
            return result = {
                status: 'error',
                reason: 'invalid_image_id',
                message: 'Invalid image id'
            };
        };

        if (image.image_reference_type == 'posts') {
            var fileSystemPath = process.env.FILESYSTEM_PATH_FOR_POST_IMAGE
        };

        if (image.image_filename) {
            var filePath = `${fileSystemPath}/${image.image_filename}`;
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Encountered the following error: ${err}`);
                console.log(`Image at ${filePath} was deleted successfully`);
            });
        };

        if (image.image_thumbnail_filename) {
            var filePath = `${fileSystemPath}/${image_thumbnail_filename}`;
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Encountered the following error: ${err}`);
                console.log(`Thumbnail at ${filePath} was deleted successfully`);
            });
        };

        imagesDBMethods.deleteImage(imageID);

        return result = {
            status: 'success',
            code: 200,
            message: 'Image deleted successfully'
        };
    }
};