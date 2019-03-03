var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var mysql = require('mysql');
var app = express();


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "TastyCloud"
});

var listProduct = [];
var listTranslations = [];

//home
app.get('/', function (req, res) {
    fs.readFile('./index.html', function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    })
});

app.get('/index.css', function (req, res) {
    fs.readFile('./index.css', function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.end(data);
        }
    })
});

app.get('/main.js', function (req, res) {
    fs.readFile('./main.js', function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.end(data);
        }
    })
});

app.get('/GetListItems', function (req, res) {
    GetListItems(function(list){
        res.send(list);
    });
});

//create item
app.get('/CreateItem.html', function (req, res) {
    fs.readFile('./createItem.html', function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    })
});

app.get('/createItem.js', function (req, res) {
    fs.readFile('./createItem.js', function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.end(data);
        }
    })
});

app.get('/createItemStyle.css', function (req, res) {
    fs.readFile('./createItemStyle.css', function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.end(data);
        }
    })
});

app.get('/AddItem', function (req, res) {
    var q = url.parse(req.url, true).query;
    console.log(q.item);
    var item = JSON.parse(q.item);

    var translations = [];

    for (var i = 0; i < Object.keys(item.name).length; i++) {
        var lg = Object.keys(item.name)[i];
        var name = item.name[lg];
        var desc = (item.desc[lg]) ? item.desc[lg] : '';
        translations = [...translations, { 'lg': lg, 'name': name, 'desc': desc }];
    }

    InsertItem(item.price, function(id){
        for(var i = 0; i < translations.length; i++){
            var t = translations[i];
            InsertTranslation(id, t.name, t.desc, t.lg);
        }
        res.send('done');
    });
});

// update item
app.get('/updateItem.html', function (req, res) {
    fs.readFile('./updateItem.html', function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    })
});

app.get('/updateItem.js', function (req, res) {
    fs.readFile('./updateItem.js', function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.end(data);
        }
    })
});

app.get('/ModifyItem', function (req, res) {
    var q = url.parse(req.url, true).query;
    console.log(q.item);
    var item = JSON.parse(q.item);

    var translations = [];

    for (var i = 0; i < Object.keys(item.name).length; i++) {
        var lg = Object.keys(item.name)[i];
        var name = item.name[lg];
        var desc = (item.desc[lg]) ? item.desc[lg] : '';
        translations = [...translations, { 'lg': lg, 'name': name, 'desc': desc }];
    }

    console.log(translations);
    ModifyPrice(item.id, item.price);
    
    for(var i = 0; i < translations.length; i++){
        var t = translations[i];
        ModifyItem(item.id, t.name, t.desc, t.lg);
    }
    res.send('done');
});




app.get('*', function (req, res) {
    res.status(404).send('Path not found');
});




SetUpDB = function (sqlConn) {
    con.connect(function (err) {
        if (err) {
            console.log(err);
            con.connected = false;
        }
        else {
            console.log("Connected!");
            con.connected = true;
        }
    });
}();

InsertItem = function (price, callback) {
    var sqlLastId = 'SELECT id FROM product ORDER BY id DESC LIMIT 1;';
    var sqlInsert = `INSERT INTO product (price) VALUES (${price});`;
    if (con.connected) {
        con.query(sqlInsert, function (errI, resI) {
            if (!errI){
                con.query(sqlLastId, function (errL, resL) {
                    if (!errL){
                        var lastId = resL[0].id;
                        callback(lastId);
                    }
                    else console.log(errL);
                });
            }
            else console.log(errI);
        });
    }
    else {
        console.log('not connected');
    }
}

InsertTranslation = function(id, name, desc, lg){
    var sql = `INSERT INTO translation (product_id,name, description, lg) VALUES (${id}, "${name}", "${desc}", "${lg}");`;
    if (con.connected) {
        con.query(sql, function (err, res) {
            if (err) console.log(err);
        });
    }
    else {
        console.log('not connected');
    }
}

GetListItems = function(callback){
    var list = [];
    var sql = 'SELECT id, price FROM product;';
    if (con.connected) {
        con.query(sql, function (err, res) {
            if (err) console.log(err);
            else{
                for(var i = 0; i < res.length; i ++){
                    const index = i;
                    list = [...list, {'id' : res[i].id, 'price' : res[i].price, 'info' : []}];

                    var q = `SELECT name, description, lg FROM translation WHERE product_id =${res[i].id};`;

                    con.query(q, function (err2, res2) {
                        if(!err2){
                            list[index].info = res2;

                            if(index == res.length - 1){
                                callback(list);
                            }
                        }
                        else console.log(err2);
                    });
                }
            }
        });
    }
    else {
        console.log('not connected');
    }
}

ModifyItem = function(id, name, desc, lg){
    var sqlUpdate = `UPDATE translation
               SET name = "${name}", description = "${desc}"
               WHERE lg = "${lg}" AND product_id = ${id}; `;
    
    if (con.connected) {
        con.query(sqlUpdate, function (err, res) {
            if(res.affectedRows == 0){
                console.log("ajout information");
                InsertTranslation(id, name, desc, lg);
            }
        });
    }
}

ModifyPrice = function(id, price){
    var sqlUpdate = `UPDATE product
               SET price = "${price}"
               WHERE id = ${id}; `;
    
    if (con.connected) {
        con.query(sqlUpdate, function (err, res) {
        });
    }
}



app.listen(8080);