
import cryptoJS from 'crypto-js';

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
let secret = "HCFQQARAAHRGMYDK";


cryptoJS.enc.u8array = {
    stringify: function (wordArray) {
      var words = wordArray.words;
      var sigBytes = wordArray.sigBytes;
      var u8 = new Uint8Array(sigBytes);
      for (var i = 0; i < sigBytes; i++) {
        var byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        u8[i] = byte;
      }
      return u8;
    },
    parse: function (u8arr) {
      var len = u8arr.length;
      var words = new Array(Math.ceil(len / 4)).fill(0); // Initialize the array with zeros
      for (var i = 0; i < len; i++) {
        words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
      }
      return cryptoJS.lib.WordArray.create(words, len);
    },
  };

function readChar(char) {
  var idx = alphabet.indexOf(char);
  if (idx === -1) {
    throw new Error('Invalid character found: ' + char);
  }
  return idx;
}

function decode(input) {
  let length = input.length;
  const leftover = (length * 5) % 8;
  const offset = leftover === 0 ? 0 : 8 - leftover;
  let bits = 0, value = 0, index = 0;
  var output = new Uint8Array(Math.ceil((length * 5) / 8));
  for (var i = 0; i < length; i++) {
    value = (value << 5) | readChar(input[i]);
    bits += 5;
    if (bits >= 8) {
      output[index++] = (value >>> (bits + offset - 8)) & 255;
      bits -= 8;
    }
  }
  if (bits > 0) {
    output[index] = (value << (bits + offset - 8)) & 255;
  }
  if (leftover !== 0) {
    output = output.slice(1);
  }
  return output;
}

const truncate = (digest) => {
  const offset = digest[19] & 0xf;
  const v =
    ((digest[offset] & 0x7f) << 24) +
    (digest[offset + 1] << 16) +
    (digest[offset + 2] << 8) +
    digest[offset + 3];
  return (v % 10 ** 6).toString(10).padStart(6, "0");
};

const cryptoJSTotp = (interval, secret) => {
  let digest = cryptoJS.HmacSHA1(cryptoJS.enc.Hex.parse(interval), cryptoJS.enc.u8array.parse(decode(secret))).toString(cryptoJS.enc.u8array);
  return truncate(digest);
};

export const generateOtpAndEncryptBody = (body) => {
  const time = Math.floor(new Date().getTime() / 1000);
  const interval = Math.floor(time / 30).toString(16).padStart(16, "0");
  const otp = cryptoJSTotp(interval, secret);
  console.log("Pre-Request OTP", otp);
  console.log("Pre-Request SECRETKEY", secret);

  const encryptedBody = cryptoJS.AES.encrypt(JSON.stringify(body), otp).toString();
  return { encryptedBody, otp };
};
