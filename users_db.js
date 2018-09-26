const fs = require('fs');
const path = require('path');

// Assuming all users passwords are hashed with pbkdf2Sync and stored
// for increased security individual user salts can be kept
// public keys dont need to be hashed since they are public
var USERS_DB = {
    'snn': {
      'id': 1,
      'username': 'snn',
      'password': 'kalem',
      'pub_key' : '-----BEGIN PUBLIC KEY-----'+
          'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0o0jbuQZQMl0i1wpzKKp\n'+
          'Bjpyn6Pxw/N1ofbmezlNSVAp1V7RM0sy9vK1ADpydP2Kdz4JXnZrsqM1+RK6oYun\n'+
          '8xp5V+0JoCWOfmN2aK6AcIncCBJyX3jba/3C+OI5V19csjqj+QTnQMSjfexg1TuN\n'+
          '+X8n40l87pcQGGoIfLXtmEUe9HWrpsqFWZYykJtUMg1o2whUlTe+xhC0kjh6gJT7\n'+
          '5CUs5r7itbu9yPhjn7r01B6R6oNkX2jnycCbYJMV8YHq0uYvbIehlvHAsLOuTO62\n'+
          '4W6et73twMOZYOF5uY+rzhXi6MzucF4AMFwCFeKQVylwc1Qsf5kRF/Aa1Rt0swJk\n'+
          'qwIDAQAB\n'+'-----END PUBLIC KEY-----'
    },
    'snn2': {
      'id': 2,
      'username': 'snn2',
      'password': 'kalem2',
      'pub_key' : '-----BEGIN PUBLIC KEY-----\n'+
          'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA532mWBlkRd+h+T9UE/Cc\n'+
          'fHI+PlqhA4I20GQi30JXHA/c6hGEG7Jq5xxLhbZ41kkPbmLXfvCs3k8i6QxwrUtQ\n'+
          'm1xHRrQcn7RpMFw8EtI/rZSxRBOMZlyLUezGnJfhMuoSdl2fIwGSpY8omZKfq3T2\n'+
          'jRPBmCPVIXWCdfF9DfioUPQzFj/jOpUtxiTfoUW4qR1LDeb+llUhnEGZEOxgzmOt\n'+
          'x6wCNl5VeEn4rmV5OMVAOwrgFrm5iS2+S4DTGjQ3h9WbrjGEBM0XWyhzMxLBd4pQ\n'+
          'kL00dJEYP5+xTN05fg+Ip6VVRPUzceB9p5ix1Fk4o5LT9U7E4pwwGq2ZJMFe3h8x\n'+
          'hwIDAQAB\n'+'-----END PUBLIC KEY-----'
    },
    'snn3': {
      'id': 3,
      'username': 'snn3',
      'password': 'kalem3'
    },
}
// var contents = fs.readFileSync(path.join(__dirname, 'keys/snn_pub.pem'), 'utf8');
// USERS_DB.snn.pub_key = contents
// var contents = fs.readFileSync(path.join(__dirname, 'keys/snn2_pub.pem'), 'utf8');
// USERS_DB.snn2.pub_key = contents
module.exports= {
  'users': USERS_DB
};