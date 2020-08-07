const _sodium = require('libsodium-wrappers');
const EthAccounts = require("web3-eth-accounts");
const Addressbook = require("./accounts.js");

/*
(async() => {
        await _sodium.ready;
        const sodium = _sodium;

        let message = "This is my message. Let's encrypt it!";
        let keySet = sodium.crypto_box_keypair();
        console.log(keySet);

        let encryptedMessage = sodium.crypto_box_seal(message, keySet.publicKey);
        console.log("encrypted message", encryptedMessage);
        console.log("decrypted message", sodium.to_string(sodium.crypto_box_seal_open(encryptedMessage, keySet.publicKey, keySet.private
Key)));
})();
*/


exports.start = async () => {
	var accounts = new Accounts();
	await _sodium.ready;
	const sodium = _sodium;

	// start general inbox, then put that into the line below here
	const addressbook = await Addressbook.start();

	function receiveHeader(id, message) {
		// TODO decrypt, validate

		// for now, assume that message is decrypted, and a stringified JSON
		let decryptedMessage = JSON.parse(message);
		// addressbook.updateContact()
/*
		let decryptedMessage = JSON.parse(sodium.to_string(sodium.crypto_box_seal_open(message, pub_key, sec_key)));
		// decryptedMessage should contain "data" and "signature"

		// TODO ensure validity of message by signature; retrieve public key from 3Box
		
		if (address != undefined) {
			if (accounts.recover(decryptedMessage.data, decryptedMessage.signature) != address) {
				console.log("STRANGER DANGER: signature disagrees with FNCM");
			}
		} else {
			if (accounts.recover(decryptedMessage.data, decryptedMessage.signature) != decryptedMessage.data.address) {
				console.log("STRANGER DANGER: signature does not match address provided in message data");
			}
		}
		// TODO update address book
		let updateObject = { 
			pub_key: decryptedMessage.data.pub_key,
			buck_id: decryptedMessage.data.buck_id
		};

		return { update: updateObject, CID: decryptedMessage.data.CID };
	}
*/

	function getEncryptionKey(address) {
		// Only if encryption key cannot be obtained from FNCM;
		// this function gets the encryption key from 3Box
	}

	function encryptMail(mail, pub_key) { 
		// TODO: encrypt mail
	}
	
	function sendHeader(message_cid, address) {
		// TODO: send a header
		// check if contact for address exists
		// if not, createContact
	}

	return {receive_header: receiveHeader, encrypt_mail: encryptMail, send_header: sendHeader};
}

