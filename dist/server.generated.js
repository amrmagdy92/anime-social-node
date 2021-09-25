/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./server/Controllers/Comments/Comments.js":
/*!*************************************************!*\
  !*** ./server/Controllers/Comments/Comments.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var databaseMethods = __webpack_require__(/*! ./CommentsMySQL */ \"./server/Controllers/Comments/CommentsMySQL.js\");\n\nmodule.exports = {\n  createComment: () => {},\n  updateComment: () => {},\n  deleteComment: () => {},\n  getComments: () => {},\n  reaction: () => {}\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Comments/Comments.js?");

/***/ }),

/***/ "./server/Controllers/Comments/CommentsMySQL.js":
/*!******************************************************!*\
  !*** ./server/Controllers/Comments/CommentsMySQL.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("__webpack_require__(/*! dotenv */ \"dotenv\").config();\n\nvar mysql = __webpack_require__(/*! mysql */ \"mysql\");\n\nconst dbSync = __webpack_require__(/*! ../DB/db */ \"./server/Controllers/DB/db.js\"); // TODO: figure out a better name\n\n\nvar connection = mysql.createConnection({\n  host: process.env.ANIME_SOCIAL_HOST,\n  user: process.env.ANIME_SOCIAL_USER,\n  password: process.env.ANIME_SOCIAL_PASSWORD\n});\nconnection.connect();\nmodule.exports = {\n  getReferenceObject: (commentReferenceID, commentReferenceType) => {\n    if (commentReferenceID && commentReferenceType) {\n      var query = `SELECT post_id comment_reference_id FROM anime_social_db.posts WHERE post_id = ${commentReferenceID} LIMIT 1`;\n      connection.query(query, (err, results, field) => {\n        if (err) {\n          console.error(`Encountered the following error: ${err}`);\n        } else if (results.length == 0) {\n          return [];\n        } else {\n          return results[0];\n        }\n      });\n    }\n  },\n  getCommentByID: commentID => {\n    var query = `SELECT comments.comment_id, comments.author_id, comments.comment_parent_id, comment_reference_type FROM anime_social_db.comments WHERE comments.comment_id = ${commentID} LIMIT 1`;\n    connection.query(query, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return results[0];\n      }\n    });\n  },\n  getComments: params => {\n    const pageNumber = params._page_number;\n    const recordsPerPage = params._records_per_page;\n    const start = params._start;\n    const orderBy = params._order_by;\n    const commentReferenceID = params.comment_reference_id.trim();\n    const commentReferenceType = params.comment_reference_type;\n    const defaultRecordsPerPage = [25, 50, 75, 100];\n    const defaultOrderBys = {\n      'comment_created_at_desc': 'Created At Desc'\n    };\n\n    if (!pageNumber && !(pageNumber > 0)) {\n      pageNumber = 1;\n    }\n\n    if (!defaultRecordsPerPage.includes(recordsPerPage)) {\n      recordsPerPage = 100;\n    }\n\n    if (!start || start > 0) {\n      start = 0;\n    }\n\n    if (!defaultOrderBys.hasOwnProperty(orderBy)) {\n      orderBy = 'comment_created_at_desc';\n    }\n\n    var JOIN = '';\n    var WHERE = '';\n\n    if (commentReferenceType == 'posts') {\n      JOIN = ' INNER JOIN anime_social_db.posts_comments ON comments.comment_id = posts_comments.comment_id';\n      WHERE = `AND posts_comments.post_id = ${commentReferenceID}`;\n    }\n\n    var query = `SELECT oauth_users.user_id, oauth_users.username, users.user_full_name, users.user_image, comments.comment_id, comments.comment_parent_id, comment_text, comment_is_spoiler, comment_is_reply, comment_replies_count, comment_likes_count, comment_dislikes_count, comment_flags_count, comment_created_at FROM anime_social_db.comments INNER JOIN anime_social_db.oauth_users ON comments.author_id = ouath_users.user_id INNER JOIN anime_social_db.users ON oauth_users.user_id = users.user_id ${JOIN} WHERE 1 = 1 ${WHERE}`;\n\n    if (orderBy == 'comment_created_at_desc') {\n      query += 'ORDER BY comments.comment_created_at DESC';\n    }\n\n    connection.query(query, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return results;\n      }\n    });\n  },\n  insertComment: (commentReferenceID, commentReferenceType, authorID, commentParentID, commentText, commentIsSpoiler, commentReplyToUserID) => {\n    var data = {\n      'comment_reference_type': commentReferenceType,\n      'author_id': authorID,\n      'comment_parent_id': commentParentID,\n      'comment_reply_to_user_id': commentReplyToUserID,\n      'comment_text': commentText,\n      'comment_is_spoiler': commentIsSpoiler,\n      'comment_created_at': new Date().toISOString().split('T')[0]\n    };\n    var query = 'INSERT INTO anime_social_db.comments SET ?';\n    var comment_id;\n    connection.query(query, data, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return comment_id = results.insertID;\n      }\n    });\n\n    if (commentParentID) {\n      dbSync.syncCommentRepliesCount(commentParentID);\n    }\n\n    if (commentReferenceType == 'posts') {\n      data = {\n        'comment_id': comment_id,\n        'post_id': commentReferenceID\n      };\n      query = 'INSERT INTO anime_social_db.posts_comments SET ?';\n      connection.query(query, data, (err, results, fields) => {\n        if (err) {\n          console.error(`Encountered the following error: ${err}`);\n        } else if (results.length == 0) {\n          return [];\n        } else {\n          return 'Insert was successful';\n        }\n      });\n      dbSync.syncPostCommentsCount(commentReferenceID);\n    }\n  },\n  updateComment: (commentID, commentText, commentIsSpoiler) => {\n    var query = `UPDATE anime_social_db.comments SET comment_text = ${commentText}, comment_is_spoile = ${commentIsSpoiler}, WHERE comment_id = ${commentID}`;\n    connection.query(query, err => {\n      if (err) console.error(err);\n    });\n  },\n  deleteComment: (commentID, commentParentID, authorID) => {\n    var query = `DELETE FROM anime_social_db.comments WHERE comment_id = ${commentID}`;\n    connection.query(query, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return 'DELETE was successful';\n      }\n    });\n    query = `UPDATE anime_social_db.comments SET comment_parent_id = '' WHERE comment_parentK_id = ${commentID}`;\n    connection.query(query, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        for (result in results) {\n          return result;\n        }\n      }\n    });\n    var comment = this.getCommentByID(commentID);\n\n    if (commentParentID) {\n      dbSync.syncCommentRepliesCount(commentParentID);\n    }\n  },\n  saveCommentReaction: (userID, commentID, reaction) => {\n    var query = `DELETE FROM anime_social_db.comments_reactions WHERE comment_id = ${commentID} AND user_id = ${userID}`;\n    connection.query(query, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return 'DELETE reaction was successful';\n      }\n    });\n    var data = {\n      'comment_id': commentID,\n      'user_id': userID,\n      'reaction': reaction,\n      'reaction_at': new Date().toISOString().split('T')[0]\n    };\n    connection.query('INSERT INTO anime_social_db.comments_reactions SET ?', data, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return 'INSERT reaction was successful';\n      }\n    });\n    dbSync.syncCommentReactionsCount();\n  }\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Comments/CommentsMySQL.js?");

/***/ }),

/***/ "./server/Controllers/DB/db.js":
/*!*************************************!*\
  !*** ./server/Controllers/DB/db.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("__webpack_require__(/*! dotenv */ \"dotenv\").config();\n\nvar mysql = __webpack_require__(/*! mysql */ \"mysql\");\n\nvar connection = mysql.createConnection({\n  host: process.env.ANIME_SOCIAL_HOST,\n  user: process.env.ANIME_SOCIAL_USER,\n  password: process.env.ANIME_SOCIAL_PASSWORD\n});\nconnection.connect();\nmodule.exports = {\n  createUserSocialDetails: userID => {\n    var query = `CALL anime_social_db.create_users_social_details(${userID})`;\n    connection.query(query, err => {\n      if (err) throw err;\n    });\n  },\n  syncUserFollowingsCount: followerID => {\n    var query = `CALL anime_social_db.sync_user_followings_count(${followerID})`;\n    connection.query(query, err => {\n      if (err) throw err;\n    });\n  },\n  syncUserFollowersCount: followingID => {\n    var query = `CALL anime_social_db.sync_user_followers_count(${followingID})`;\n    connection.query(query, err => {\n      if (err) throw err;\n    });\n  },\n  syncCommentRepliesCount: commentParentID => {\n    var query = `CALL anime_social_db.sync_comments_replies_count(${commentParentID})`;\n    connection.query(query, err => {\n      if (err) throw err;\n    });\n  },\n  syncPostFlagsCount: postID => {\n    var query = `CALL anime_social_db.sync_post_flags_count)${postID}`;\n    connection.query(query, err => {\n      if (err) throw err;\n    });\n  },\n  syncCommentFlagsCount: commentID => {\n    var query = `CALL anime_social_db.sync_comment_flags_count(${commentID})`;\n    connection.query(query, err => {\n      if (err) throw err;\n    });\n  },\n  syncPostCommentsCount: postID => {\n    var query = `CALL anime_social_db.sync_post_comments_count(${postID})`;\n    connection.query(query, err => {\n      if (err) throw err;\n    });\n  },\n  syncCommentReactionsCount: commentID => {\n    var query = `CALL anime_social_db.sync_comment_reactions_count(${commentID})`;\n    connection.query(query, err => {\n      if (err) throw err;\n    });\n  },\n  syncPostReactionsCount: postID => {\n    var query = `CALL anime_social_db.sync_post_reactions_count(${postID})`;\n    connection.query(query, err => {\n      if (err) throw err;\n    });\n  },\n  createBlockedUser: (blockerUserID, blockedUserID, blockedAt) => {\n    var query = `CALL anime_social_db.create_blocked_user(${blockerUserID}, ${blockedUserID}, ${blockedAt})`;\n    connection.query(query, err => {\n      if (err) throw err;\n    });\n  },\n  checkIfThisPostIsMine: (userID, postID) => {}\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/DB/db.js?");

/***/ }),

/***/ "./server/Controllers/FlagReasons/FlagReasons.js":
/*!*******************************************************!*\
  !*** ./server/Controllers/FlagReasons/FlagReasons.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var databaseMethods = __webpack_require__(/*! ./FlagReasonsMySQL */ \"./server/Controllers/FlagReasons/FlagReasonsMySQL.js\");\n\nmodule.exports = {\n  getFlagReasons: () => {}\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/FlagReasons/FlagReasons.js?");

/***/ }),

/***/ "./server/Controllers/FlagReasons/FlagReasonsMySQL.js":
/*!************************************************************!*\
  !*** ./server/Controllers/FlagReasons/FlagReasonsMySQL.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("__webpack_require__(/*! dotenv */ \"dotenv\").config();\n\nvar mysql = __webpack_require__(/*! mysql */ \"mysql\");\n\nvar connection = mysql.createConnection({\n  host: process.env.ANIME_SOCIAL_HOST,\n  user: process.env.ANIME_SOCIAL_USER,\n  password: process.env.ANIME_SOCIAL_PASSWORD\n});\nconnection.connect();\nmodule.exports = {\n  getFlagReasons: params => {\n    var orderBy = params._order_by;\n    var orderBys = {\n      'flag_reason_order_asc': 'Flag Reason Order Asc'\n    };\n    var flagReasonStatus = params.flag_reason_status;\n    var flagReasonReferenceType = params.flag_reason_reference_type;\n    var WHERE = '';\n    var query = ''; // TODO: ask what is the usage of this.\n\n    if (orderBys.hasOwnProperty(orderBy)) {\n      orderBy = 'flag_reason_order_asc';\n    }\n\n    ;\n\n    if (flagReasonStatus) {\n      WHERE += ` AND flag_reason_reference_type = ${flagReasonReferenceType}`;\n    }\n\n    ;\n    query += ` SELECT flag_reason_id, flag_reason_text FROM anime_social_db.flags_reasons WHERE 1 = 1 ${WHERE}`;\n\n    if (orderBy == 'flag_reason_order_asc') {\n      query += ' ORDER BY flag_reason_order ASC';\n    }\n\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return results[0];\n    });\n  }\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/FlagReasons/FlagReasonsMySQL.js?");

/***/ }),

/***/ "./server/Controllers/Flags/Flags.js":
/*!*******************************************!*\
  !*** ./server/Controllers/Flags/Flags.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var databaseMethods = __webpack_require__(/*! ./FlagsMySQL */ \"./server/Controllers/Flags/FlagsMySQL.js\");\n\nmodule.exports = {\n  createFlag: () => {}\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Flags/Flags.js?");

/***/ }),

/***/ "./server/Controllers/Flags/FlagsMySQL.js":
/*!************************************************!*\
  !*** ./server/Controllers/Flags/FlagsMySQL.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("__webpack_require__(/*! dotenv */ \"dotenv\").config();\n\nvar mysql = __webpack_require__(/*! mysql */ \"mysql\");\n\nconst dbSync = __webpack_require__(/*! ../DB/db */ \"./server/Controllers/DB/db.js\");\n\nvar connection = mysql.createConnection({\n  host: process.env.ANIME_SOCIAL_HOST,\n  user: process.env.ANIME_SOCIAL_USER,\n  password: process.env.ANIME_SOCIAL_PASSWORD\n});\nconnection.connect();\nmodule.exports = {\n  getUserFlagged: (flagReferenceID, flagReferenceType, authorID) => {\n    var query = `SELECT flags.flag_id FROM anime_social_db.flags LEFT OUTER JOIN anime_social_db.posts_flags ON  flags.flag_id = posts_flags.flag_id LEFT OUTER JOIN anime_social_db.comments_flags ON flags.flag_id = comments_flags.flag_id WHERE flag_reference_type = ${flagReferenceType} AND (posts_flags.post_id = ${flagReferenceID} OR comments_flags.comment_id = ${flagReferenceID}) AND flags.author_id = ${authorID}`;\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(err);\n      if (results.length == 0) return [];\n      return results[0];\n    });\n  },\n  getReferenceObject: (flagReferenceID, flagReferenceType) => {\n    var query = '';\n\n    if (flagReferenceID && flagReferenceType == 'posts') {\n      query = `SELECT post_id flag_reference_id FROM anime_social_db.posts WHERE post_id = ${flagReferenceID} LIMIT 1`;\n    }\n\n    if (flagReferenceID && flagReferenceType == 'comments') {\n      query = `SELECT comment_id flag_reference_id FROM anime_social_db.comments WHERE comment_id = ${flagReferenceID} LIMIT 1`;\n    }\n\n    if (query === \"\") {\n      return [];\n    } else {\n      connection.query(query, (err, results, fields) => {\n        if (err) console.error(err);\n        if (results.length == 0) return [];\n        return results[0];\n      });\n    }\n  },\n  getFlagReasonById: flagReasonID => {\n    var query = `SELECT flag_reason_reference_type, flag_reason_Status FROM anime_social_db.flags_reasons WHERE flag_reason_id = ${flagReasonID} LIMIT 1`;\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(err);\n      if (results.length == 0) return [];\n      return results[0];\n    });\n  },\n  insertFlag: (flagReferenceID, flagReferenceType, authorID, flagReasonID, flagExplanation) => {\n    var data = {\n      \"flag_reference_type\": flagReferenceType,\n      \"author_id\": authorID,\n      \"flag_reason_id\": flagReasonID,\n      \"flag_explanation\": flagExplanation,\n      \"flaged_at\": new Date().toISOString().split('T')[0]\n    };\n\n    if (flagReferenceType == 'posts') {\n      data = {\n        \"flag_id\": flagID,\n        \"post_id\": flagReferenceID\n      };\n      var query = 'INSERT INTO anime_social_db.posts_flags SET ?';\n      connection.query(query, data, (err, results, fields) => {\n        if (err) {\n          console.error(`Encountered the following error: ${err}`);\n        } else if (results.length == 0) {\n          return [];\n        } else {\n          console.log('INSERT was successful');\n        }\n      });\n      dbSync.syncPostFlagsCount(flagReferenceID);\n    }\n\n    if (flagReferenceType === \"comments\") {\n      data = {\n        \"flag_id\": flagID,\n        \"comment_id\": flagReferenceID\n      };\n      var query = 'INSERT INTO anime_social_db.comments_flags SET ?';\n      connection.query(query, data, (err, results, fields) => {\n        if (err) {\n          console.error(`Encountered the following error: ${err}`);\n        } else if (results.length == 0) {\n          return [];\n        } else {\n          console.log('INSERT was successful');\n        }\n      });\n      dbSync.syncCommentFlagsCount(flagReferenceID);\n    }\n  }\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Flags/FlagsMySQL.js?");

/***/ }),

/***/ "./server/Controllers/Follows/Follows.js":
/*!***********************************************!*\
  !*** ./server/Controllers/Follows/Follows.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var databaseMethods = __webpack_require__(/*! ./FollowsMySQL */ \"./server/Controllers/Follows/FollowsMySQL.js\");\n\nmodule.exports = {\n  follow: () => {},\n  unfollow: () => {},\n  blockUser: () => {},\n  unblockUser: () => {},\n  getSearchFollowings: () => {},\n  getFollowings: () => {},\n  getFollowers: () => {},\n  getBlockedUsers: () => {}\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Follows/Follows.js?");

/***/ }),

/***/ "./server/Controllers/Follows/FollowsMySQL.js":
/*!****************************************************!*\
  !*** ./server/Controllers/Follows/FollowsMySQL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("__webpack_require__(/*! dotenv */ \"dotenv\").config();\n\nvar mysql = __webpack_require__(/*! mysql */ \"mysql\");\n\nconst dbSync = __webpack_require__(/*! ../DB/db */ \"./server/Controllers/DB/db.js\");\n\nvar connection = mysql.createConnection({\n  host: process.env.ANIME_SOCIAL_HOST,\n  user: process.env.ANIME_SOCIAL_USER,\n  password: process.env.ANIME_SOCIAL_PASSWORD\n});\nconnection.connect();\nmodule.exports = {\n  getUserById: userID => {\n    var query = `SELECT user_id FROM anime_db.oauth_users WHERE user_id = ${userID} LIMIT 1`;\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(err);\n      if (results.length == 0) return [];\n      return results[0];\n    });\n  },\n  getFollowed: (followerID, followingID) => {\n    var query = `SELECT follow_id FROM anime_social_db.follows WHERE follower_id = ${followerID} AND following_id = ${followingID} LIMIT 1`;\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(err);\n      if (results.length == 0) return [];\n      return results[0];\n    });\n  },\n  isBlockedUser: (blockerUserID, blockedUserID) => {\n    var query = `SELECT id FROM anime_db.blocked_users WHERE (blocker_user_id = ${blockerUserID} AND blocked_user_id = ${blockedUserID}) OR (blocker_user_id = ${blockedUserID} AND blocked_user_id = ${blockerUserID}) LIMIT 1`;\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(err);\n      if (results.length == 0) return [];\n      return results[0];\n    });\n  },\n  insertFollow: (followerID, followingID) => {\n    var data = {\n      \"follower_id\": followerID,\n      \"following_id\": followingID\n    };\n    var query = \"INSERT INTO anime_social_db.follows SET ?\";\n    var comment_id;\n    connection.query(query, data, (err, results, fields) => {\n      if (err) console.error(err);\n      if (results.length == 0) return [];\n      return comment_id = results.insertID;\n    });\n    dbSync.syncUserFollowingsCount(followerID);\n    dbSync.syncUserFollwersCount(followingID);\n  },\n  deleteFollow: (followerID, followingID) => {\n    var query = `DELETE FROM anime_social_db.follows WHERE follower_id = ${followerID} AND following_id = ${followingID}`;\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(err);\n      if (results.length == 0) return [];\n      return results[0];\n    });\n    dbSync.syncUserFollowingsCount(followerID);\n    dbSync.syncUserFollwersCount(followingID);\n  },\n  createBlockedUser: (blockerUserID, blockedUserID) => {\n    // TODO: Ask Lelouch how this is is built in FollowsStorage.php\n    var blockedAt = new Date().toISOString().split('T')[0];\n  },\n  deleteBlockedUser: (blockerUserID, blockedUserID) => {\n    var query = `DELETE FROM anime_db.blocked_users WHERE blocker_user_id = ${blockerUserID} AND blocked_user_id = ${blockedUserID}`;\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(err);\n      if (results.length == 0) return [];\n      return results[0];\n    });\n  },\n  searchUsers: params => {// TODO: Check with Lelouch how this function works\n  },\n  getFollows: params => {\n    var type = params._type;\n    var pageNumber = params._page_number;\n    var recordsPerPage = params._records_per_page;\n    var start = params._start;\n    var orderBy = params._order_by;\n    var types = ['followings', 'followers', 'search-followings', 'block-followers'];\n\n    if (!types.includes(type)) {\n      console.error(`This type is not allowed ${type}. It should be one of these: ${types}`);\n    }\n\n    ;\n\n    if (!pageNumber && !(pageNumber > 0)) {\n      pageNumber = 1;\n    }\n\n    ;\n    var recordsPerPages = ['25', '50', '75', '100'];\n\n    if (!recordsPerPages.includes(recordsPerPage)) {\n      recordsPerPage = '100';\n    }\n\n    ;\n\n    if (!start && start > 0) {\n      start = 0;\n    }\n\n    ;\n    var orderBys = {\n      'followed_at_asc': 'Followed At Asc',\n      'followed_at_desc': 'Followed At Desc',\n      'user_created_at_asc': 'User Created At Asc',\n      'user_created_at_desc': 'User Created At Desc',\n      'user_full_name_asc': 'User Full Name Asc',\n      'user_full_name_desc': 'User Full Name Desc',\n      'blocked_at_asc': 'Blocked At Asc',\n      'blocked_at_desc': 'Blocked At Desc'\n    };\n\n    if (!orderBys.hasOwnProperty(orderBy)) {\n      orderBy = 'user_created_at_desc';\n    }\n\n    ;\n    var COLS = '';\n    var WHERE = '';\n    var JOIN = '';\n    var loggedUserID = params.logged_user_id.trim();\n\n    if (type === 'followings') {\n      var followerID = params.follower_id.trim();\n\n      if (!followerID || typeof followerID != String) {\n        console.error(`The follower_id field cannot be empty and must be a string`);\n      }\n\n      JOIN += ` INNER JOIN anime_social_db.follows ON oauth_users.user_id = follows.following_id AND follower_id = ${followerID}`;\n    }\n\n    if (type === 'followers') {\n      var followingID = params.following_id.trim();\n\n      if (!followingID || typeof followingID != String) {\n        console.error(`The following_id field cannot be empty and should be a string`);\n      }\n\n      JOIN += ` INNER JOIN anime_social_db.follows ON oauth_users.user_id = follows.follower_id AND following_id = ${followingID}`;\n    }\n\n    if (type === 'search-followings') {\n      var keyword = params.keyword.trim().toLowerCase();\n      var followerID = params.loggedUserID.trim();\n      JOIN += ` LEFT OUTER JOIN anime_socail_db.follows ON oauth_users.user_id = follows.folloing_id AND follower_id = ${followerID}`;\n      WHERE += ` AND follow_id IS NULL AND oauth_users.user_id != ${followerID} AND users.username LIKE ${keyword}`;\n    }\n\n    if (type === 'block-followers') {\n      var blocker_user_id = params.blocker_user_id.trim();\n      JOIN += ` INNER JOIN anime_social_db.blocked_users ON oauth_users.user_id = blocker_users.blocker_user_id AND blocked_users.blocker_user_id = ${blocker_user_id}`;\n    }\n\n    if (loggedUserID === '' && ['followings', 'followers'].includes(type)) {\n      COLS += `, IF(your_followings.following_id IS NULL, \\'No\\',\\'Yes\\') is_you_following, IF(follows_you.follower_id IS NULL, \\'No\\',\\'Yes\\') is_follows_you`;\n      JOIN += ` LEFT OUTER JOIN follows your_followings ON oauth_users.user_id = your_followings.following_id AND your_followings.follower_id = ${loggedUserID} LEFT OUTER JOIN follows follows_you ON oauth_users.user_id = follows_you.follower_id AND follows_you.following_id = ${loggedUserID}`;\n    }\n\n    var query = `SELECT oauth_users.user_id, users.username, users.user_full_name, users.user_image, IF(users_social_details.user_followings_count IS NULL, \\'0\\', users_social_details.user_followings_count) user_followings_count, IF(users_social_details.user_followers_count IS NULL, \\'0\\', users_social_details.user_followers_count) user_followers_count ${COLS} FROM anime_db.oauth_users INNER JOIN anime_db.users ON oauth_users.user_id = users.user_id ${JOIN} LEFT OUTER JOIN anime_social_db.users_social_details ON oauth_users.user_id = users_social_details.user_id WHERE 1 = 1 ${WHERE}`;\n\n    if (orderBy === 'followed_at_asc') {\n      query += ' ORDER BY follows.followed_at ASC';\n    } else if (orderBy === 'followed_at_desc') {\n      query += ' ORDER BY follows.followed_at DESC';\n    } else if (orderBy === ' blocked_at_asc') {\n      query += ' ORDER BY blocked_users.blocked_at ASC';\n    } else if (orderBy === 'blocked_at_desc') {\n      query += ' ORDER BY blocked_users.blocked_at DESC';\n    } else if (orderBy === 'user_created_at_asc') {\n      query += ' ORDER BY users.created_at ASC';\n    } else if (orderBy === 'user_created_at_desc') {\n      query += ' ORDER BY users.created_at DESC';\n    } else if (orderBy === 'user_full_name_asc') {\n      query += ' ORDER BY users.user_full_name ASC';\n    } else if (orderBy === 'user_full_name_desc') {\n      query += ' ORDER BY users,user_full_name DESC';\n    }\n\n    connection.query(query, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return {\n          meta: {\n            'page_number': pageNumber,\n            'records_per_page': recordsPerPage,\n            'order_by': orderBy,\n            'count': results.length\n          },\n          data: {\n            results\n          }\n        };\n      }\n    });\n  }\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Follows/FollowsMySQL.js?");

/***/ }),

/***/ "./server/Controllers/Polls/Polls.js":
/*!*******************************************!*\
  !*** ./server/Controllers/Polls/Polls.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var databaseMethods = __webpack_require__(/*! ./PollsMySQL */ \"./server/Controllers/Polls/PollsMySQL.js\");\n\nmodule.exports = {\n  addVote: () => {}\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Polls/Polls.js?");

/***/ }),

/***/ "./server/Controllers/Polls/PollsMySQL.js":
/*!************************************************!*\
  !*** ./server/Controllers/Polls/PollsMySQL.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("__webpack_require__(/*! dotenv */ \"dotenv\").config();\n\nvar mysql = __webpack_require__(/*! mysql */ \"mysql\");\n\nvar connection = mysql.createConnection({\n  host: process.env.ANIME_SOCIAL_HOST,\n  user: process.env.ANIME_SOCIAL_USER,\n  password: process.env.ANIME_SOCIAL_PASSWORD\n});\nconnection.connect();\nmodule.exports = {\n  checkPost: (postID, authorID) => {\n    var query = `SELECT post_id, author_id FROM anime_social_db.posts WHERE post_id = ${postID} AND author_id = ${authorID} LIMIT 1`;\n    connection.query(query, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return results[0];\n      }\n    });\n  },\n  checkPoll: (postID, authorID) => {\n    var query = `SELECT post_id, author_id FROM anime_social_db.posts_polls WHERE post_id = ${postID}, authort_id = ${authorID} LIMIT 1`;\n    connection.query(query, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return results[0];\n      }\n    });\n  },\n  getPollByID: postID => {\n    var query = `SELECT post_id, author_id FROM anime_social_db.posts_polls WHERE post_id = ${postID} LIMIT 1`;\n    connection.query(query, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return results[0];\n      }\n    });\n  },\n  checkVote: (postID, pollID, choiceID, userID) => {\n    var query = `SELECT post_id FROM anime_social_db.posts_polls_choices_users WHERE post_id = ${postID} AND user_id = ${userID} AND choice_id = ${choiceID} AND poll_id = ${pollID} LIMIT 1`;\n    connection.query(query, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return results[0];\n      }\n    });\n  },\n  insertPoll: (postID, pollLength, authorID) => {\n    var query = 'INSERT INTO anime_social_db.posts_polls SET ?';\n    var data = {\n      'post_id': postID,\n      'poll_length': pollLength,\n      'author_id': authorID,\n      'created_date': new Date().toISOString().split('T')[0]\n    };\n    var pollID;\n    connection.query(query, data, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return pollID = results[0].insertID;\n      }\n    });\n  },\n  insertChoice: (pollID, choiceTitle, animeID, charactersID) => {\n    var query = 'INSERT INTO anime_social_db.posts_polls_choices SET ?';\n    var data = {\n      'poll_id': pollID,\n      'choice_title': choiceTitle,\n      'anime_id': animeID,\n      'characters_id': charactersID\n    };\n    var choiceID;\n    connection.query(query, data, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return choiceID = results[0].insertID;\n      }\n    });\n  },\n  inserVote: (userID, postID, pollID, choiceID) => {\n    var query = 'INSERT INTO anime_social_db.posts_polls_choices_users SET ?';\n    var data = {\n      'user_id': userID,\n      'post_id': postID,\n      'poll_id': pollID,\n      'choice_id': choiceID\n    };\n    connection.query(query, data, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return 'INSERT was done successfully';\n      }\n    });\n    query = `UPDATE anime_social_db.posts_polls_choices SET anime_social_db.posts_polls_choices.count = (SELECT COUNT(anime_social_db.posts_polls_choices_users.id) FROM anime_social_db.posts_polls_choices_users WHERE anime_social_db.posts_polls_choices_users.choice_id = ${choiceID}) WHERE anime_social_db.posts_polls_choices.choice_id = ${choiceID}`;\n    connection.query(query, (err, results, fields) => {\n      if (err) {\n        console.error(`Encountered the following error: ${err}`);\n      } else if (results.length == 0) {\n        return [];\n      } else {\n        return 'UPDATE was done successfully';\n      }\n    });\n  }\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Polls/PollsMySQL.js?");

/***/ }),

/***/ "./server/Controllers/Posts/Posts.js":
/*!*******************************************!*\
  !*** ./server/Controllers/Posts/Posts.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var databaseMethods = __webpack_require__(/*! ./PostsMySQL */ \"./server/Controllers/Posts/PostsMySQL.js\");\n\nmodule.exports = {\n  createPost: () => {},\n  updatePost: () => {},\n  deletePost: () => {},\n  hide: () => {},\n  reaction: () => {},\n  getPosts: () => {}\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Posts/Posts.js?");

/***/ }),

/***/ "./server/Controllers/Posts/PostsMySQL.js":
/*!************************************************!*\
  !*** ./server/Controllers/Posts/PostsMySQL.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("__webpack_require__(/*! dotenv */ \"dotenv\").config();\n\nvar mysql = __webpack_require__(/*! mysql */ \"mysql\");\n\nconst dbSync = __webpack_require__(/*! ../DB/db */ \"./server/Controllers/DB/db.js\");\n\nvar connection = mysql.createConnection({\n  host: process.env.ANIME_SOCIAL_HOST,\n  user: process.env.ANIME_SOCIAL_USER,\n  password: process.env.ANIME_SOCIAL_PASSWORD\n});\nconnection.connect();\nmodule.exports = {\n  getAnimeByID: animeID => {\n    var query = `SELECT anime_id, anime_android_published, anime_ios_published FROM anime_db.animes WHERE anime_id = ${animeID} LIMIT 1`;\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return results[0];\n    });\n  },\n  getPostByID: postID => {\n    var query = `SELECT post_id, authore_id FROM anime_social_db.posts WHERE post_id = ${postID} LIMIT 1`;\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return results[0];\n    });\n  },\n  getPostsCountForToday: (authorID, postScope) => {\n    var today = new Date().toISOString().split('T')[0];\n    var query = `SELECT COUNT(post_id) posts_count_for_today FROM anime_social_db.posts WHERE author_id = ${authorID} AND post_scope = ${postScope} AND post_created_at = ${today} LIMIT 1`;\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return results[0];\n    });\n  },\n  getPosts: params => {\n    var pageNumber = params._page_number;\n    var recordsPerPage = params._records_per_page;\n    var start = params._start;\n    var orderBy = params._order_by;\n    var userID = params.user_id;\n    var postScope = params.post_scope;\n\n    if (!pageNumber || !(pageNumber > 0)) {\n      pageNumber = 1;\n    }\n\n    var recordsPerPages = ['25', '50', '75', '100'];\n\n    if (!recordsPerPages.includes(recordsPerPage)) {\n      recordsPerPage = 100;\n    }\n\n    if (!start || !(start > 0)) {\n      start = 0;\n    }\n\n    var orderBys = {\n      'post_created_at_desc': 'Created At Desc'\n    };\n\n    if (!orderBys.hasOwnProperty(orderBy)) {\n      orderBy = 'post_created_at_desc';\n    }\n\n    var JOIN = '';\n    var WHERE = '';\n\n    if (postScope == 'Public') {\n      WHERE = ` AND posts.post_scope = ${postScope}`;\n    }\n\n    if (postScope == 'Following') {\n      JOIN = ` INNER JOIN follows ON posts.author_id = follows.following_id `;\n      WHERE = ` AND posts.post_scope = ${postScope} AND (follows.follower_id = ${userID} OR posts.author_id = ${userID})`;\n    }\n\n    if (userID) {\n      JOIN = ` LEFT OUTER JOIN posts_hidden ON (posts.post_id = posts_hidden.post_id AND posts_hidden.user_id = ${userID})`;\n      WHERE = ` AND posts_hidden.post_id IS NULL`;\n    }\n\n    var query = `SELECT oauth_users.user_id, oauth_users.username, users.user_full_name, users.user_image, posts.post_id, posts.post_text, posts.post_scope, posts.ost_is_spoiler, posts.post_created_at, posts.post_likes_count, posts.post_dislikes_count, posts.post_comments_count, posts.post_flags_count FROM anime_social_db.posts INNER JOIN anime_db.oaith_users ON posts.author_id = oauth_users.user_id INNER JOIN anime_db.users ON oauth_users.user_id = users.user_id LEFT OUTER JOIN anime_social_db.posts_animes ON posts.post_id = posts_animes.post_id ${JOIN} WHERE 1 = 1 ${WHERE}`;\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n    });\n  },\n  insertPost: (authorID, postText, postScope, postIsSpoiler, postYoutubeURL, postType) => {\n    var regExp = /(^|[^a-z0-9_])#([a-z0-9_]+)/i; // TODO: Ask lelouch how preg_match_all works in php\n  },\n  insertPostAnime: (postID, animeID) => {\n    var query = 'INSERT INTO anime_social_db.posts_animes SET ?';\n    var data = {\n      'post_id': postID,\n      'anime_id': animeID\n    };\n    connection.query(query, data, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return 'INSERT was successful';\n    });\n  },\n  insertPostEmbeddedUrl: (postID, embeddedURLID) => {\n    var query = 'INSERT INTO anime_social_db.posts_embedded_urls SET ?';\n    var data = {\n      'post_id': postID,\n      'embedded_url_d': embeddedURLID\n    };\n    connection.query(query, data, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return 'INSERT was successful';\n    });\n  },\n  insertPostImage: (postID, imageID) => {\n    var query = 'INSERT INTO anime_social_db.posts_images SET ?';\n    var data = {\n      'post_id': postID,\n      'image_id': imageID\n    };\n    connection.query(query, data, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return 'INSERT was successful';\n    });\n  },\n  insertPostVideo: (postID, videoID) => {\n    var query = 'INSERT INTO anime_social_db.posts_videos SET ?';\n    var data = {\n      'post_id': postID,\n      'video_id': videoID\n    };\n    connection.query(query, data, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return 'INSERT was successful';\n    });\n  },\n  updatePost: (postID, postText, postIsSpoiler) => {\n    var query = `UPDATE anime_social_db.posts SET post_text = ${postText}, post_is_spoiler = ${postIsSpoiler} WHERE post_id = ${postID}`;\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return 'UPDATE was successful';\n    });\n  },\n  deletePost: postID => {\n    var query = `DELETE FROM anime_social_db.posts WHERE post_id = ${postID}`;\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return 'DELETE was successful';\n    });\n  },\n  hidePost: (postID, userID) => {\n    var query = `DELETE FROM anime_social_db.posts_hidden WHERE post_id = ${postID} AND user_id = ${userID}`;\n    var data = {\n      'post_id': postID,\n      'user_id': userID,\n      'post_hidden_at': new Date().toISOString().split('T')[0]\n    };\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return 'DELETE was successful';\n    });\n    query = `INSERT INTO anime_social_db.posts_hidden SET ?`;\n    connection.query(query, data, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return 'INSERT was successful';\n    });\n  },\n  savePostReaction: (userID, postID, reaction) => {\n    var query = `DELETE FROM anime_social_db.posts_reactions WHERE post_id = ${postID} AND user_id = ${userID}`;\n    connection.query(query, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return 'DELETE was successful';\n    });\n    var reactionValues = ['rlike', 'rdislike'];\n\n    if (!reactionValues.includes(reaction)) {\n      query = 'INSERT INTO anime_social_db.posts_reactions SET ?';\n      var data = {\n        'post_id': postID,\n        'user_id': userID,\n        'reaction': reaction,\n        'reaction_at': new Date().toISOString().split('T')[0]\n      };\n      connection.query(query, data, (err, results, fields) => {\n        if (err) console.error(`Encountered the following error: ${err}`);\n        if (results.length == 0) return [];\n        return 'INSERT was successful';\n      });\n    }\n\n    ;\n    dbSync.syncPostReactionsCount(postID);\n  },\n  insertPoll: (postID, pollLength, authorID) => {\n    var query = 'INSERT INTO anime_social_db.posts_polls SET ?';\n    var data = {\n      'post_id': postID,\n      'poll_length': pollLength,\n      'author_id': authorID,\n      'created_at': new Date().toISOString().split('T')[0]\n    };\n    connection.query(query, data, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return results[0].insertID;\n    });\n  },\n  insertChoice: (pollID, choiceTitle, animeID, charactersID) => {\n    var query = 'INSERT INTO anime_social_db.posts_polls_choices SET ?';\n    var data = {\n      'poll_id': pollID,\n      'choice_title': choiceTitle,\n      'anime_id': animeID,\n      'characters_id': charactersID\n    };\n    connection.query(query, data, (err, results, fields) => {\n      if (err) console.error(`Encountered the following error: ${err}`);\n      if (results.length == 0) return [];\n      return results[0].insertID;\n    });\n  }\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Posts/PostsMySQL.js?");

/***/ }),

/***/ "./server/Routes/CommentsRoute.js":
/*!****************************************!*\
  !*** ./server/Routes/CommentsRoute.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var router = __webpack_require__(/*! express */ \"express\").Router();\n\nconst CommentsController = __webpack_require__(/*! ../Controllers/Comments/Comments */ \"./server/Controllers/Comments/Comments.js\");\n\nrouter.get('/', CommentsController.getComments());\nrouter.post('/create', CommentsController.createComment());\nrouter.post('/reaction', CommentsController.reaction());\nrouter.post('/update/:comment_id', CommentsController.updateComment());\nrouter.delete('/delete/:comment_id', CommentsController.deleteComment());\nmodule.exports = router;\n\n//# sourceURL=webpack://anime-social-node/./server/Routes/CommentsRoute.js?");

/***/ }),

/***/ "./server/Routes/FlagReasonsRoute.js":
/*!*******************************************!*\
  !*** ./server/Routes/FlagReasonsRoute.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var router = __webpack_require__(/*! express */ \"express\").Router();\n\nconst FlagReasonsController = __webpack_require__(/*! ../Controllers/FlagReasons/FlagReasons */ \"./server/Controllers/FlagReasons/FlagReasons.js\");\n\nrouter.get('/', FlagReasonsController.getFlagReasons());\nmodule.exports = router;\n\n//# sourceURL=webpack://anime-social-node/./server/Routes/FlagReasonsRoute.js?");

/***/ }),

/***/ "./server/Routes/FlagsRoute.js":
/*!*************************************!*\
  !*** ./server/Routes/FlagsRoute.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var router = __webpack_require__(/*! express */ \"express\").Router();\n\nconst FlagsController = __webpack_require__(/*! ../Controllers/Flags/Flags */ \"./server/Controllers/Flags/Flags.js\");\n\nrouter.post('/create', FlagsController.createFlag());\nmodule.exports = router;\n\n//# sourceURL=webpack://anime-social-node/./server/Routes/FlagsRoute.js?");

/***/ }),

/***/ "./server/Routes/PollsRoute.js":
/*!*************************************!*\
  !*** ./server/Routes/PollsRoute.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var router = __webpack_require__(/*! express */ \"express\").Router();\n\nconst PollsController = __webpack_require__(/*! ../Controllers/Polls/Polls */ \"./server/Controllers/Polls/Polls.js\");\n\nrouter.post('/vote', PollsController.addVote());\nmodule.exports = router;\n\n//# sourceURL=webpack://anime-social-node/./server/Routes/PollsRoute.js?");

/***/ }),

/***/ "./server/Routes/PostsRoute.js":
/*!*************************************!*\
  !*** ./server/Routes/PostsRoute.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var router = __webpack_require__(/*! express */ \"express\").Router();\n\nconst PostsController = __webpack_require__(/*! ../Controllers/Posts/Posts */ \"./server/Controllers/Posts/Posts.js\");\n\nrouter.get('/', PostsController.getPosts());\nrouter.post('/create', PostsController.createPost());\nrouter.post('/hide', PostsController.hide());\nrouter.post('/reaction', PostsController.reaction());\nrouter.post('/update/:post_id', PostsController.updatePost());\nrouter.delete('/update/:post_id', PostsController.deletePost());\nmodule.exports = router;\n\n//# sourceURL=webpack://anime-social-node/./server/Routes/PostsRoute.js?");

/***/ }),

/***/ "./server/app.js":
/*!***********************!*\
  !*** ./server/app.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var express = __webpack_require__(/*! express */ \"express\");\n\nconst FollowController = __webpack_require__(/*! ./Controllers/Follows/Follows */ \"./server/Controllers/Follows/Follows.js\");\n\nconst PostsRouter = __webpack_require__(/*! ./Routes/PostsRoute */ \"./server/Routes/PostsRoute.js\");\n\nconst CommentsRouter = __webpack_require__(/*! ./Routes/CommentsRoute */ \"./server/Routes/CommentsRoute.js\");\n\nconst FlagsRouter = __webpack_require__(/*! ./Routes/FlagsRoute */ \"./server/Routes/FlagsRoute.js\");\n\nconst FlagReasonsRouter = __webpack_require__(/*! ./Routes/FlagReasonsRoute */ \"./server/Routes/FlagReasonsRoute.js\");\n\nconst PollsRouter = __webpack_require__(/*! ./Routes/PollsRoute */ \"./server/Routes/PollsRoute.js\");\n\nvar app = express();\napp.use(express.json());\napp.use(express.urlencoded({\n  extended: true\n})); // FIXME: Need to find a better route structure for the Follows logic\n// Follows\n\napp.post('/api/follow', FollowController.follow());\napp.post('/api/unfollow', FollowController.unfollow());\napp.post('/api/block-user', FollowController.blockUser());\napp.post('/api/unblock-user', FollowController.unblockUser());\napp.get('/api/search-followings', FollowController.getSearchFollowings());\napp.get('/api/followings', FollowController.getFollowings());\napp.get('/api/followers', FollowController.getFollowers());\napp.get('/api/blocked-users', FollowController.getBlockedUsers()); // Posts\n\napp.use('/api/posts', PostsRouter); // Comments\n\napp.use('/api/comments', CommentsRouter); // Flags\n\napp.use('/api/flags', FlagsRouter); // Flag Reasons\n\napp.use('/api/flag-reasons', FlagReasonsRouter); //Polls\n\napp.use('/api/polls', PollsRouter);\nmodule.exports = app;\n\n//# sourceURL=webpack://anime-social-node/./server/app.js?");

/***/ }),

/***/ "./server/server.js":
/*!**************************!*\
  !*** ./server/server.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("__webpack_require__(/*! dotenv */ \"dotenv\").config();\n\nconst cluster = __webpack_require__(/*! cluster */ \"cluster\");\n\nconst process = __webpack_require__(/*! process */ \"process\");\n\nconst http = __webpack_require__(/*! http */ \"http\");\n\nconst CPU_COUNT = __webpack_require__(/*! os */ \"os\").cpus().length;\n\nconst app = __webpack_require__(/*! ./app */ \"./server/app.js\");\n\nif (cluster.isMaster) {\n  console.info(`Master process is running at ${process.pid}`);\n\n  for (let i = 0; i < CPU_COUNT; i++) {\n    cluster.fork();\n    console.log(`Created worker #${i + 1}`);\n  }\n\n  cluster.on('exit', (worker, code, signal) => {\n    console.error(`Worker(${worker.process.pid}) died with code(${code}) and signal(${signal})`);\n    cluster.fork();\n  });\n} else {\n  http.createServer(app).listen(process.env.SERVER_PORT);\n  console.log(`Server(${process.pid}) is listening at port(${process.env.SERVER_PORT})`);\n}\n\n;\n\n//# sourceURL=webpack://anime-social-node/./server/server.js?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "mysql":
/*!************************!*\
  !*** external "mysql" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("mysql");

/***/ }),

/***/ "cluster":
/*!**************************!*\
  !*** external "cluster" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("cluster");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./server/server.js");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;