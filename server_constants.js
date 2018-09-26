const fs = require('fs');
var path = require('path');

var server_path = path.join(__dirname);

function read_args() {

  const args = process.argv
      .slice(2)
      .map(arg => arg.split('='))
      .reduce((args, [value, key]) => {
          args[value] = key;
          return args;
      }, {});

  return args
}

const args = read_args()

var port = process.env.MY_PORT || 3000

var https_key = args.https_cert || process.env.HTTPS_KEY || path.join(__dirname, 'server_cert/server.key');
var https_cert = args.https_key || process.env.HTTPS_CERT || path.join(__dirname, 'server_cert/server.crt');

var production = args.production || false

const options = {
  key: fs.readFileSync(https_key, 'utf8'),
  cert: fs.readFileSync(https_cert, 'utf8'),
};

module.exports = {
  "port": port,
  "https_options": options
  "debug": !production
};