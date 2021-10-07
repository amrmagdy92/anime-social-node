require('dotenv').config();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.ANIME_SOCIAL_HOST,
    user: process.env.ANIME_SOCIAL_USER,
    password: process.env.ANIME_SOCIAL_PASSWORD
});
connection.connect();

module.exports = {
    getFlagReasons: (params) => {
        var orderBy = params._order_by;
        var orderBys = {'flag_reason_order_asc':'Flag Reason Order Asc'};
        var flagReasonStatus = params.flag_reason_status;
        var flagReasonReferenceType = params.flag_reason_reference_type;
        var WHERE = '';
        var query = '';
        if (orderBys.hasOwnProperty(orderBy)) {
            orderBy = 'flag_reason_order_asc';
        };

        if (flagReasonStatus) {
            WHERE += ` AND flag_reason_reference_type = ${flagReasonReferenceType}`;
        };

        query += ` SELECT flag_reason_id, flag_reason_text FROM anime_social_db.flags_reasons WHERE 1 = 1 ${WHERE}`;

        if (orderBy == 'flag_reason_order_asc') {
            query += ' ORDER BY flag_reason_order ASC';
        }

        connection.query(query, (err, results, fields) => {
            if (err) console.error(`Encountered the following error: ${err}`);
            if (results.length == 0) return [];
            return results[0];
        });
    }
}