const followsDBMethods = require('./FollowsMySQL');
const AccessController = require('../ACL/ACL');

module.exports = {
    follow: (authorization, followingID) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var followerID = authorized.user_id;

        if (!followingID.trim() || isNaN(followingID.trim())) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_following_id',
                message: 'following_id must be valid numeric digits'
            };
        };

        if (followerID == followingID.trim()) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'following_himself',
                message: 'Cannot follow self'
            };
        };

        var following = followsDBMethods.getUserById(followingID.trim());
        if (!following) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_following_id',
                message: 'following_id does not exist'
            };
        };

        var followed = followsDBMethods.getFollowed(followerID, followingID.trim());
        if (followed) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'already_following',
                message: 'User already following this user'
            };
        };

        var blocked = followsDBMethods.isBlockedUser(followingID.trim(), followerID);
        if (blocked) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'blocked_following',
                message: 'Blocked user could not follow'
            };
        };

        followsDBMethods.insertFollow(followerID, followingID.trim());

        return result = {
            status: 'success',
            code: 200,
            message: 'Added to following list'
        };
    },
    unfollow: (authorization, followingID) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var followerID = authorized.user_id;

        if (!followingID || isNaN(followingID.trim())) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_following_id',
                message: 'following_id must be valid numeric digits'
            };
        };

        var followed = followsDBMethods.getFollowed(followerID, followingID.trim());
        if (!followed) {
            return result = {
                status = 'error',
                code: 400,
                reason: 'invalid_following',
                message: 'User not following this user'
            };
        };

        followsDBMethods.deleteFollow(followerID, followingID.trim());

        return result = {
            status: 'success',
            code: 200,
            message: 'User removed from following list'
        };
    },
    blockUser: (authorization, blockedUserID) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var blockerUserID = authorized.user_id;

        if (!blockedUserID || isNaN(blockedUserID.trim())) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_blocked_user_id',
                message: 'blocked_user_id must be valid numeric digits'
            };
        };

        if (blockerUserID == blockedUserID.trim()) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'blocking_himself',
                message: 'Could not block himself'
            };
        };

        var user = followsDBMethods.getUserById(blockedUserID.trim());
        if (!user) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_blocked_user_id',
                message: 'blocked_user_id does not exist'
            };
        };

        followsDBMethods.createBlockedUser(blockerUserID, blockedUserID.trim());

        return result = {
            status: 'success',
            code: 200,
            message: 'User has been blocked.'
        };
    },
    unblockUser: (authorization, blockedUserID) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var blockerUserID = authorized.user_id;

        if (!blockedUserID.trim() || isNaN(blockedUserID.trim())) {
            return result = {
                status: 'error',
                code: '400',
                reason: 'invalid_blocked_user_id',
                message: 'blocked_user_id must be valid numeric digits'
            };
        };

        followsDBMethods.deleteBlockedUser(blockerUserID, blockedUserID.trim());

        return result = {
            status: 'success',
            code: 200,
            message: 'User has been unblocked.'
        };
    },
    getSearchFollowings: (authorization, params) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        var loggedUserID = '';

        if (checkAuthorization.status == 'success') {
            loggedUserID = checkAuthorization.access.user_id;
        };

        var keyword = params.keyword.trim();
        if (!keyword) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'keyword_required',
                message: 'Please enter searching keyword'
            };
        };

        params = {
            '_type' : 'search-followings',
            '_order_by': 'user_full_name_asc',
            '_records_per_page': 25,
            'keyword': keyword,
            'logged_user_id': loggedUserID
        };

        var data = followsDBMethods.searchUsers(params);

        return result = {
            status: 'success',
            code: 200,
            message: data
        };
    },
    getFollowings: () => {},
    getFollowers: () => {},
    getBlockedUsers: () => {}
}