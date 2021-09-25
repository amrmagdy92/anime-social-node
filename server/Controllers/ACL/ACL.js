const ACLDBMethods = require('./ACLMySQL');

module.exports = {
    isAuthorizedUSer: (authorizationToken) => {
        var tokenParts = authorizationToken.split(' ');
        var tokenType = tokenParts[0].trim();
        var accessToken = tokenParts[1].trim();
        var result;

        if (tokenType != 'Bearer') {
            return result = {
                errorCode: 403,
                errorDescription: 'invalid_token_type',
                errorMessage: 'Authorization header must be like: (Bearer access-token)'
            };
        };

        var access = ACLDBMethods.getAccessToken(accessToken);
        if (!access || !access.access_token || !access.client_id || !access.expired_at || !access.user_id) {
            return result = {
                errorCode: 403,
                errorDescription: 'invalid_access_token',
                errorMessage: 'Invalid access token'
            };
        };

        if (Date.now > Date.parse(access.expired_at)) {
            return result = {
                errorCode: 401,
                errorDescription: 'expired_access_token',
                errorMessage: 'Access token has expired'
            };
        };

        return result = {
            code: 200,
            access
        };
    }
}