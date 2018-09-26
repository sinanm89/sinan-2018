const https = require('https');
var db = require('./users_db');
const crypto = require('crypto');

const constants = require('./server_constants');

function send(req, res, data, message=''){
    var postData = JSON.stringify(
        {data: data, msg: message}
    );
    res.writeHead(200, {
        'Content-Type': 'application/json', 'Content-Length': postData.length
    });
    res.write(postData);
    res.end();
}

function fail(req, res, message, status_code=400){
    if(typeof(message) === 'object') {
        console.log(message.stack)
        message = 'Unexpected error occurred';
    }
    var postData = JSON.stringify(
        {'msg': message}
    );
    res.writeHead(status_code, {
        'Content-Type': 'application/json', 'Content-Length': postData.length
    });
    res.write(postData);
    res.end();
}

function clean_url_input(req, res){
    // console.log('cleaned url.')
    var uname = req.url.split('/')[2];
    // only get alphanumeric values and _- this helps with validation and security
    var clean_uname = uname.replace(/[\W_-]+/ig, '');
    if (uname !== clean_uname){
        throw fail(req, res, 'Invalid username', 422);
    }
    req.uname = clean_uname;
}

function user_exists(req, res) {
    // console.log('checking user existance')
    if (db.users[req.uname] === undefined) {
        throw fail(req, res, 'No such user.', 404); 
    } else {
        // if user exists, save to request obj for future use
        // should the user model get more complex we can have a minified version of the user object
        req.user = db.users[req.uname];
    }
}   

function is_authenticated(req, res) {
    // console.log('checking authentication');
    // Since we have https our POST body is securely encrypted.
    if (req.body.username !== undefined && req.body.password !== undefined){
        throw fail(req, res, 'User not authenticated.', 422);
    }
    if (req.user === undefined) req.user = db.users[req.body.username];
    if (req.body.password !== req.user.password) {
        throw fail(req, res, 'User not authenticated.', 422);
    }
}

function parseJSON (req, res, json) {
    var parsed;
    try {
        parsed = JSON.parse(json);
    } catch (e) {
        throw fail(req, res, e, 422);
    }
    return parsed;
}

function is_signed_by_user(req, res, middleware){
    for (var i=0; i<middleware.length; i++){
        middleware[i](req, res);
    }

    if (req.user.pub_key === undefined) {
        throw fail(req, res, 'User has no public key.');
    }
    const verifier = crypto.createVerify('SHA256');
    verifier.update(req.body.actual);
    const verified = verifier.verify(req.user.pub_key, req.body.msg, 'base64');
    send(req, res, JSON.stringify({verified: verified}));
}


function save_users_pub_key(req, res, middleware){
    for (var i=0; i<middleware.length; i++){
        middleware[i](req, res);
    }
    // this might be overkill but since the maximum key size is so large,
    // it might be best to use base64 to decrease the size of the payload at the cost of computational power.
    var pub_key = Buffer.from(req.body.pub_key, 'base64').toString('ascii');
    db.users[req.user.username].pub_key = pub_key;
    send(req, res, JSON.stringify(true, 202));
}


async function handle_request_body(req, res){
      
    return new Promise((resolve, reject) => {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                req.body = parseJSON(req, res, body);
                resolve(req);
            });
            req.on('error', (e) => {
                reject(e);
            });

            req.on('timeout', (e) => {
                reject(e);
            });
        }
    });
}

async function handle_requests(req, res){
    req = await handle_request_body(req, res).catch((err) => {
        return fail(req, res, err);
    });
    var url_route = req.url.split('/')[1];
    if (url_route === undefined) throw fail(req, res, 'url invalid');
    if(url_route ==='signed'){
        is_signed_by_user(req, res, [clean_url_input, user_exists]);
    }
    else if(url_route ==='save-key'){
        save_users_pub_key(req, res, [clean_url_input, user_exists, is_authenticated]);
    }
}

https.createServer(constants.https_options, async function (req, res) {
      
    handle_requests(req, res).catch((err) => {
        console.log(err);
    });
}).listen(constants.port, function(){
    console.log('server start at port 3000'); //the server object listens on port 3000
});
