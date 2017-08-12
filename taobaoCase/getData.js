var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yrh559966',
    database: 'taobao',
    port: 3306
});
conn.connect();
var allRows;
var allResults = []; //存放所有店的名称
conn.query('select * from desk', function(err, rows, fields) {
    if (err) throw err;
    allRows = rows;
    for (var i = 0; i < allRows.length; i++) {
        var content = allRows[i].content;
        var regex = /(<\/span><span>)(.*?)(?=<\/span><\/a>)/g;
        var matches;
        var results = [];
        while (matches = regex.exec(content)) {
            results.push(matches[2]);
        }
        allResults = allResults.concat(results);
    }
    var shopAddSql = "INSERT INTO shopSellData SET shopname=?";
    var shopAddSql_Params = allResults;
    //增 add
    for (let k = 0; k < shopAddSql_Params.length; k++) {
        var shopAddSql = "INSERT INTO shopSellData set shopname=" + "'" + shopAddSql_Params[k] + "'";
        conn.query(shopAddSql, function(err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                console.log(this.sql);
                return;
            }
            console.log('-------INSERT----------');
            console.log(this.sql);
            //console.log('INSERT ID:',result.insertId);       
            console.log('INSERT ID:', result);
            console.log('#######################');

        });
    }


});