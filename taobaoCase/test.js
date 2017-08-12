var mysql = require('mysql');
var http = require('http');
const rp = require('request-promise');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yrh559966',
    database: 'taobao',
    port: 3306
});
conn.connect();
var options = {
    method: 'GET',
    qs: {
        q: '' // -> uri + '?access_token=xxxxx%20xxxxx' 
    },
    uri: 'http://console.moojing.com/api/shops/search',
    headers: { 'User-Agent': 'test' },
    json: true
}
conn.query('select * from shopSellData', function(err, rows, fields) {
    if (err) throw err;

    let i = 813; //  set your counter to 1

    function myLoop() { //  create a loop function
        setTimeout(function() { //  call a 3s setTimeout when the loop is called
            rp(options)
                .then(result => {
                    if (result.result.count > 1) {
                        console.log("count bigger than 1 " + result.result.data[0].shop_ww);
                    } else if (result.result.count == 0) {
                        console.log("count less than 0 " + result.result.data[0].shop_ww);
                    } else {
                        var data = result.result.data[0];
                        //将数据写入到数据库中去  
                        var shopAddSql = "UPDATE shopSellData set monthsell=" + "'" + data.sold + "'" + ",naturesearchindex=" + "'" + data.organic.pv + "'" + ",zhitongcheindex=" + "'" + data.simba.pv + "'" + ",taobaokemoney=" + "'" + data.tk_total_fee + "'" + ",taobaokesell=" + "'" + data.tk_total_sold + "'" + ",tianmaozhitongcheindex=" + "'" + data.tmall.pv + "'" + ",mobileindex=" + "'" + data.mobile.pv + "'" + ",monthsellmoney=" + "'" + data.sales + "'" + " where shopname='" + data.shop_title + "'";
                        conn.query(shopAddSql, function(err, result) {
                            if (err) {
                                console.log('----------INSERT ERROR--------');
                                console.log('[INSERT ERROR] - ', err.message);
                                console.log(this.sql);
                                console.log('-----------INSERT ERROR END--------');
                                return;
                            }
                            console.log('-------INSERT----------');
                            console.log(this.sql);
                            console.log('INSERT ID:', result);
                            console.log('---------------------------');

                        });
                    }
                })
                .catch(e => {
                    // handle error
                    console.log("----------Error----------");
                    console.log(e);
                    console.log("-----------Error End---------")
                })
            i++;
            if (i < rows.length) {
                let shopname = rows[i].shopname;
                options.qs.q = shopname;
                myLoop();
            }
        }, 1000)
    }
    myLoop();
});


// var options = {
//     method: 'GET',
//     qs: {
//         q: '耐家旗舰店' // -> uri + '?access_token=xxxxx%20xxxxx' 
//     },
//     uri: 'http://console.moojing.com/api/shops/search',
//     headers: { 'User-Agent': 'request' },
//     json: true
// }

// rp(options)
//     .then(result => {
//         console.log(result.result.data);
//     })
//     .catch(e => {
//         // handle error
//         console.log(e);
//     })