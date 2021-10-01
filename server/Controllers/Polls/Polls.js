const pollsDBMethods = require('./PollsMySQL');
const AccessController = require('../ACL/ACL');

module.exports = {
    createPoll: (authorization, pollLength, postID, choicesData) => {
        var checkAuthorization = AccessController.isAuthorizedUser(authorization);
        if (checkAuthorization.status == 'error') {
            return checkAuthorization;
        };

        var authorized = checkAuthorization.access;
        var authorID = authorized.user_id;

        if (!pollLength) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_poll_length',
                message: 'Invalid poll length'
            };
        };

        if (!choicesData) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_choices_data',
                message: 'Invalid choices data'
            };
        };

        if (Object.keys(choicesData).length > 10) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_choices_limit',
                message: 'invalid choices limit'
            };
        };

        var checkPost = pollsDBMethods.checkPost(postID, authorID);
        if (!checkPost) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_post',
                message: 'invalid post'
            };
        };

        var checkPoll = pollsDBMethods.checkPoll(postID, authorID);
        if (!checkPoll) {
            return result = {
                status: 'error',
                code: 400,
                reason: 'invalid_poll',
                messahe: 'poll_exist'
            };
        };

        var pollID = pollsDBMethods.insertPoll(postID, pollLength, authorID);
        var animeID;
        var charactersID;

        for (choice in choicesData) {
            animeID = choice.anime_id ? choice.anime_id : null;
            charactersID = choice.characters_id ? choice.characters_id : null;
            pollsDBMethods.insertChoice(pollID, choice.choice_title, animeID, charactersID);
        };

        return result = {
            status: 'success',
            code: 200,
            message: 'poll added successfully'
        };
    },
    addVote: () => {}
}