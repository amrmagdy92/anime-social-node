const ACLDBMethods = require('./ACLMySQL');

module.exports = {
    isAuthorizedUser: (authorizationToken) => {
        var tokenParts = authorizationToken.split(' ');
        var tokenType = tokenParts[0].trim();
        var accessToken = tokenParts[1].trim();
        var result;

        if (tokenType != 'Bearer') {
            return result = {
                status: 'error',
                code: 403,
                description: 'invalid_token_type',
                message: 'Authorization header must be like: (Bearer access-token)'
            };
        };

        var access = ACLDBMethods.getAccessToken(accessToken);
        if (!access || !access.access_token || !access.client_id || !access.expired_at || !access.user_id) {
            return result = {
                status: 'error',
                code: 403,
                description: 'invalid_access_token',
                message: 'Invalid access token'
            };
        };

        if (Date.now > Date.parse(access.expired_at)) {
            return result = {
                status: 'error',
                code: 401,
                description: 'expired_access_token',
                message: 'Access token has expired'
            };
        };

        return result = {
            code: 200,
            access
        };
    }
}