const crypto = require('crypto')

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7Jat1/19NDxOObrFpW8USTia6
uHt34Sac1Arm6F2QUzsdUEUmvGyLIOIGcdb+F6pTdx4ftY+wZi7Aomp4k3vNqXmX
T0mE0vpQlCmsPUcMHXuUi93XTGPxLXIv9NXxCJZXSYI0JeyuhT9/ithrYlbMlyNc
wKB/BwSpp+Py2MTT2wIDAQAB
-----END PUBLIC KEY-----
`

function encrypt(plainText, key, algorithm) {
	algorithm = algorithm || "aes-128-cbc"
	var cipher = crypto.createCipher(algorithm, key)
	var cryptedText = cipher.update(plainText, 'utf8', 'binary')
	cryptedText += cipher.final('binary')
	cryptedText = new Buffer(cryptedText, 'binary').toString('base64')

	return cryptedText
}

function decrypt(cryptedText, key, algorithm) {
	algorithm = algorithm || "aes-128-cbc"
	cryptedText = new Buffer(cryptedText, 'base64').toString('binary')
	var decipher = crypto.createDecipher(algorithm, key)
	var plainText = decipher.update(cryptedText, 'binary', 'utf8')
	plainText += decipher.final('utf8')

	return plainText
}

function rsaPublicEncrypt(plain, key) {
	key = key || PUBLIC_KEY
    var buffer = new Buffer(plain)
    var encrypted = crypto.publicEncrypt({key: key, padding: crypto.constants.RSA_PKCS1_PADDING}, buffer)
    return encrypted.toString("base64")
}

function rsaPrivateDecrypt(encrypted, key) {
    var buffer = new Buffer(encrypted, "base64")
    var decrypted = crypto.privateDecrypt({key: key, padding: crypto.constants.RSA_PKCS1_PADDING}, buffer)
    return decrypted.toString("utf8")
}

function rsaPrivateEncrypt(plain, key) {
    var buffer = new Buffer(plain)
    var encrypted = crypto.privateEncrypt({key: key, padding: crypto.constants.RSA_PKCS1_PADDING}, buffer)
    return encrypted.toString("base64")
}

function rsaPublicDecrypt(encrypted, key) {
	key = key || PUBLIC_KEY
    var buffer = new Buffer(encrypted, "base64")
    var decrypted = crypto.publicDecrypt({key: key, padding: crypto.constants.RSA_PKCS1_PADDING}, buffer)
    return decrypted.toString("utf8")
}

function multiRsaPrivateEncrypt(plain, key, times) {
	var encrypted = [plain]
	while(times-- > 0) {
		encrypted = encrypted.map(chunk => _.chunk(rsaPrivateEncrypt(chunk, key), 86).map(chunk => chunk.join(""))).reduce((result, chunk) => result.concat(chunk), [])
	}

	return encrypted.join("\n")
}

function multiRsaPublicDecrypt(encrypted, key, times) {
	var decrypted = encrypted.split("\n")
	while(times-- > 0) {
		decrypted = decrypted.reduce((result, chunk, index) => index % 2 == 0 ? result.concat(chunk) : result.slice(0, -1).concat(result[result.length - 1] + chunk), []).map(chunk => rsaPublicDecrypt(chunk, key))
	}

	return decrypted[0]
}

module.exports.PUBLIC_KEY = PUBLIC_KEY
module.exports.encrypt = encrypt
module.exports.decrypt = decrypt

module.exports.rsaPublicEncrypt = rsaPublicEncrypt
module.exports.rsaPrivateDecrypt = rsaPrivateDecrypt
module.exports.rsaPrivateEncrypt = rsaPrivateEncrypt
module.exports.rsaPublicDecrypt = rsaPublicDecrypt

module.exports.multiRsaPrivateEncrypt = multiRsaPrivateEncrypt
module.exports.multiRsaPublicDecrypt = multiRsaPublicDecrypt
