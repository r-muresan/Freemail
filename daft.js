const _sodium = require('libsodium-wrappers');
const EthAccounts = require("web3-eth-accounts");
const Addressbook = require("./accounts.js");
const FNCM = require("./app.js");
const mailconfig = require("./mailsettings.json");
const mailout = require("./mailout.js");

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
	// var accounts = new Accounts();
	await _sodium.ready;
	const sodium = _sodium;

	// start general inbox, then put that into the line below here
	const fncm = await FNCM.start();
	const addressbook = await Addressbook.start(async () => {return await generateInbox});
	const ipfs = await IPFS.create();

	function receiveHeader(id, message) {
		// TODO decrypt, validate

		// for now, assume that message is decrypted, and a stringified JSON
		let decryptedMessage = JSON.parse(message);
		// addressbook.updateContact()
		addressbook.editContact(decryptedMessage.update);

		//get content from IPFS	
		
		mailout.send_email_string(fncm.getFile(decryptedMessge.cid), 
			"Received Freemail", 
			decryptedMessge.update._id + "@" + decryptedMessage.return_address,
			to_address
		);
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
	
	async function sendHeader(message_cid, address, _outbox) {
		// TODO: send a header
		// check if contact for address exists
		// if not, createContact
		let outbox = await addressbook.getOutbox(address);
		if (outbox == undefined) {
			outbox = _outbox;
		}

		// modify addressbook here

		let headerObj = {
			update: {
				contact_pub_key: await addressbook.getPublicKey(address),
				_id: await addressbook.getMyEthAddress(),
				inbox: await addressbook.getOutbox(address)
				},
			cid: message_cid,
			return_address: (await addressbook.getInbox(address)).addr
		};
		let headerObjString = JSON.stringify(headerObj);
		//TODO: encrypt the header
		fncm.send_message(outbox.nonce, outbox.addr, headerObjString);
		return;
	}
	async function generateInbox() {
		let inboxAddress = await fncm.new_inbox("general inbox");
		let inboxObj = {
			public_key: "test public key",
			private_key: "test private key",
			inbox: {
				addr: inboxAddress
			}
		};
		return inboxObj;
	}
	async function sendMailFile(mail_file) {
		return await fncm.pushFile(mail_file);
	}

	return {
		receive_header: receiveHeader, 
		encrypt_mail: encryptMail, 
		send_header: sendHeader, 
		send_mail_file: sendMailFile
	};
}
