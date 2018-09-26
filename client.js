const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const https = require('https');
const constants = require('./server_constants')

function check_signature(uname, signature, passphrase, actual) {
    var postData = JSON.stringify(
        {'msg': signature, 'actual': actual}
    );
    var options = {
        hostname: 'localhost',
        port: 3000,
        path: '/signed/' + uname,
        method: 'POST',
        rejectUnauthorized: false,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
        }
    };
    var req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => {body += chunk.toString();});
        res.on('end', () => {console.log(JSON.parse(body));});
    });
    req.on('error', (e) => {console.error(e);});
    req.write(postData);
    req.end();
}

function get_signatures(uname, message, private_key, passphrase){
    // if passphrase is left out its assumed the key doesnt require a password
    if (uname === undefined || message === undefined){
        throw Error('Username and message required for signature check')
    }
    // var f_name = path.join(__dirname, 'keys/' + uname + '_prv.pem');
    // const prv = fs.readFileSync(f_name, 'utf-8');
    const signer = crypto.createSign('SHA256');
    signer.update(message, 'utf8');

    var signature_hex = signer.sign({'key': private_key, 'passphrase': passphrase}, 'base64');
    console.log(signature_hex);

    return signature_hex;
}

function save_pub_key(uname, password, pub_key){
    if (uname === undefined || password === undefined || pub_key === undefined){
        throw Error('Need username, password and public key for public key save on server.');
    }
    // var f_name = path.join(__dirname, 'keys/' + uname + '_pub.pem');
    // const pub = fs.readFileSync(f_name, 'utf-8');
    var postData = JSON.stringify({
        'pub_key': Buffer.from(pub_key).toString('base64'),
        'password': password
    });
    var options = {
        hostname: 'localhost',
        port: 3000,
        path: '/save-key/' + uname,
        method: 'POST',
        // this should be true for production servers
        // I couldnt trick the client to trust my self signed certificate
        rejectUnauthorized: constants.debug,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
        }
    };
    var req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => {body += chunk.toString();});
        res.on('end', () => {console.log(JSON.parse(body));});
    });
    req.on('error', (e) => {console.error(e);});
    req.write(postData);
    req.end();

}


function decipher_task() {

    const args = process.argv
        .slice(2)
        .map(arg => arg.split('='))
        .reduce((args, [value, key]) => {
            args[value] = key;
            return args;
        }, {});
    priv_key = args.priv_key || process.env.MY_PRIVATE_KEY
    pub_key = args.pub_key || process.env.MY_PUBLIC_KEY
    if (!args.user) throw Error('We always need a username.')
    if (args.actual) { return check_signature(args.user, args.sign, args.passphrase, args.actual) }
    else if (args.password) { return save_pub_key(args.user, args.password, pub_key) }
    else if (priv_key) { 
        return get_signatures(args.user, args.message, priv_key, args.passphrase) 
    }
    return true;
}

decipher_task()
