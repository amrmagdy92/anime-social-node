const postsDBMethods = require('./PostsMySQL');
const AccessController = require('../ACL/ACL');
const ImagesController = require('../Images/Images');
const ImagesDBMethods = require('../Images/ImagesMySQL');

module.exports = {
    createPost: (authorization, postText, postScope, postIsSpoiler, animeID, postYoutubeURL, imageIDs, pollLength, choicesData, postType, imageFiles) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var authorID = authorized.user_id;
        var postsCountToday = postsDBMethods.getPostsCountForToday(authorID, postScope);
        
        if (postScope == 'Public' && postsCountToday >= authorized.user.user_per_day_limit_for_public_posts) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'public_posts_limit_exceeded',
                message: `A maximum of ${authorized.user.user_per_day_limit_for_public_posts} is allowed everyday.`
            };
        };

        if (postScope == 'Following' && postsCountToday >= authorized.user.user_per_day_limit_for_following_posts) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'following_posts_limit_exceeded',
                message: `A maximum of ${authorized.user.user_per_day_limit_for_following_posts} is allowed everyday.`
            };
        };

        var objects = 0;
        if (postYoutubeURL) objects++;
        if (imageIDs) objects++;
        if (choicesData) objects++;

        if (objects > 1) {
            return result = {
                status: 'error',
                code: 400,
                reson: 'objects_exceeded',
                message: 'Only one object allowed at a time choose either embedded URL, images or video'
            };
        };

        if (!postType) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'post_type',
                message: 'post_type is empty'
            };
        };

        var validationErrors;

        if (!postText) {
            validationErrors.post_text = {
                reason: 'empty',
                message: 'Please enter post text'
            };
        };

        if (postText && postText.length > 2000) {
            validationErrors.post_text = {
                reason: 'strlen',
                message: 'Please enter less than 2000 char.'
            };
        };

        var postScopes = ['Public', 'Following'];
        if (!postScopes.includes(postScope)) {
            validationErrors.post_scope = {
                reason: 'in_array',
                message: `Please slect from: ${postScopes.join(',')}.`
            };
        };

        var postIsSpoilerValues = ['Yes', 'No'];
        if (!postIsSpoilerValues.includes(postIsSpoiler)) {
            validationErrors.post_is_spoiler = {
                reason: 'in_array',
                message: `Please select from: ${postIsSpoilerValues.join(',')}.`
            };
        };

        if (animeID) {
            var anime = postsDBMethods.getAnimeByID(animeID);
            var key;

            if (authorized.platform == 'iOS') {
                key = 'authorized_ios_published';
            } else if (authorized.platform == 'android') {
                key = 'anime_android_published';
            };

            if (anime.key != 'Published') {
                validationErrors.anime_id = {
                    reason: 'invalid_anime',
                    message: 'Please select a valid anime'
                };
            };
        }

        if (imageFiles) {
            var image_IDs = ImagesController.createImages(authorization, 'posts', imageFiles);
            if (typeof image_IDs != 'object') {
                validationErrors.image_ids = {
                    reason: 'is_json',
                    message: 'Image list must be an array'
                };
            };

            if (!validationErrors.hasOwnProperty('image_ids')) {
                if (Set(imageIDs).size != imageIDs.length) {
                    validationErrors.image_ids = {
                        reason: 'duplicate',
                        message: 'Duplicate image found.'
                    };
                };
            };

            if (!validationErrors.hasOwnProperty('image_ids')) {
                if (image_IDs.length != process.env.MAX_IMAGES_SINGLE_POST) {
                    validationErrors.image_ids = {
                        reason: 'max_limit_reached',
                        message: `A maximum of ${process.env.MAX_IMAGES_SINGLE_POST} images is allowed.`
                    };
                };
            };

            if (!validationErrors.hasOwnProperty('image_ids')) {
                Object.keys(image_IDs).forEach(([key, value]) => {
                    var image = ImagesDBMethods.getImageByID(key);
                    if (!image) {
                        validationErrors.image_ids = {
                            reason: 'invalid_image',
                            message: 'Please select valid image.'
                        };
                    };
                });
            };
        };

        if (validationErrors) {
            return result = {
                status: 'error',
                code: 422,
                reason: 'validation_errors',
                message: 'Please correct highlighted errors.',
                validationErrors
            };
        };
        var post_id = postsDBMethods.insertPost(authorID, postText, postScope, postIsSpoiler, postYoutubeURL,postType);

        if (animeID) {
            postsDBMethods.insertPostAnime(post_id, animeID);
        };

        if (choicesData) {
            var poll_id = postsDBMethods.insertPoll(post_id, pollLength, authorID);
            Object.keys(choicesData).forEach(([key, value]) => {
                var anime_id = choicesData[key].anime_id ? choicesData[key].anime_id : null;
                var characters_id = choicesData[key].characters_id ? choicesData[key].characters_id : null;
                postsDBMethods.insertChoice(poll_id, choicesData[key].choice_title, anime_id, characters_id);
            });
        };

        if (imageIDs) {
            Object.keys(imageIDs).forEach(([key, value]) => {
                postsDBMethods.insertPostImage(post_id, imageIDs[key]);
            });
        };

        // TODO: Add insert video

        return result = {
            status: 'success',
            code: 200,
            message: 'Post created successfully'
        };
    },
    updatePost: (authorization, postID, postText, postIsSpoiler) =>{
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var authorID = authorized.user_id;

        var post = postsDBMethods.getPostByID(postID.trim());
        if (!post) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_post_id',
                message: 'Invalid post_id'
            };
        };

        if (post.author_id != authorID.trim()) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_author',
                message: 'Not authoried to perform the requested operation'
            };
        };

        var validationErrors;

        if (!postText) {
            validationErrors.post_text = {
                reason: 'empty',
                message: 'Please enter post text'
            };
        };

        if (postText && postText.length > 2000) {
            validationErrors.post_text = {
                reason: 'strlen',
                message: 'Please enter less than 2000 char.'
            };
        };

        var postIsSpoilerValues = ['Yes', 'No'];
        if (!postIsSpoilerValues.includes(postIsSpoiler.trim())) {
            validationErrors.post_is_spoiler = {
                reason: 'in_json',
                message: `Please select from: ${postIsSpoilerValues.join(',')}`
            };
        };

        if (validationErrors) {
            return result = {
                status: 'error',
                code: 422,
                reason: 'validation_errors',
                message: 'Please correct highlighted errors',
                validationErrors
            };
        };

        postsDBMethods.updatePost(postID.trim(), postText.trim(), postIsSpoiler.trim());

        return result = {
            status: 'success',
            code: 200,
            message: 'Post updated successfully'
        };
    },
    deletePost: (authorization, postID) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var authorID = authorized.user_id;

        var post = postsDBMethods.getPostByID(postID.trim());
        if (!post) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_post_id',
                message: 'Invalid post_id'
            };
        };

        if (post.author_id != authorID.trim()) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_author',
                message: 'Not authorized to perform the requested operation'
            };
        };

        postsDBMethods.deletePost(postID.trim());

        return result = {
            status: 'success',
            code: 200,
            message: 'Post deleted successfully'
        };
    },
    hide: (authorization, postID) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var userID = authorized.user_id;

        var post = postsDBMethods.getPostByID(postID.trim());
        if (!post) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_post_id',
                message: 'Invalid post_id'
            };
        };

        postsDBMethods.hidePost(postID.trim(), userID);

        return result = {
            status: 'success',
            code: 200,
            message: 'Post hidden successfully'
        };
    },
    reaction: (authorization, postID, reaction) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var userID = authorized.user_id;

        var post = postsDBMethods.getPostByID(postID);
        if (!post) {
            return result = {
                status: 'error',
                reason: 'invalid_post_id',
                message: 'Invalid post_id'
            };
        };

        var validationErrors;
        
        var reactionValues = ['like', 'dislike', 'rlike', 'rdislike'];
        if (!reactionValues.includes(reaction.trim())) {
            validationErrors.reaction = {
                reason: 'in_array',
                message: `Please select from: ${reactionValues.join(',')}`
            };
        };

        if (validationErrors) {
            return result = {
                status: 'error',
                code: 422,
                reason: 'validation_errors',
                message: 'Please correct highlighted errors',
                validationErrors
            };
        };

        postsDBMethods.savePostReaction(userID, postID.trim(), reaction.trim());

        return result = {
            status: 'success',
            code: 200,
            message: 'Post reaction saved successfully'
        };
    },
    getPosts: (authorization, params) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        }

        var authorized = checkAuthorization.access;
        var userID = authorized.user_id;

        var validationErrors;
        var postScopes = ['Public', 'Following'];
        if (!postScopes.includes(params.post_scope.trim())) {
            validationErrors.post_scope = {
                reason: 'in_json',
                message: `Please select from: ${postScopes.join(',')}`
            };
        };

        if (validationErrors) {
            return result = {
                status: 'error',
                code: 422,
                reason: 'validation_errors',
                message: 'Please correct highlighted errors',
                validationErrors
            };
        };
        
        params._order_by = 'post_created_at_desc';
        params._records_per_page = 25;
        params.user_id = userID;

        var data = postsDBMethods.getPosts(params);

        return result = {
            status: 'success',
            code: 200,
            data
        };
    }
};