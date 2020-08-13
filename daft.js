const _sodium = require('libsodium-wrappers');
const EthAccounts = require("web3-eth-accounts");
const Addressbook = require("./accounts.js");
const FNCM = require("./app.js");
const mailconfig = require("./mailsettings.json");
const mailout = require("./mailout.js");

exports.start = async () => {
	// var accounts = new Accounts();
	await _sodium.ready;
	const sodium = _sodium;

	// start general inbox, then put that into the line below here
	const fncm = await FNCM.start();
	//const addressbook = await Addressbook.start(async () => {return await generateInbox()});
	//fncm.read_messages(await addressbook.getAllInboxes(), receiveHeader);
	//const ipfs = await IPFS.create();

	await resetAccount(await Addressbook.start(async () => {return await generateInbox()}, resetAccount));

	async function resetAccount(newAddressbook) {
		//fncm.wipeBoxes();
		addressbook = newAddressbook;
		fncm.read_messages(await addressbook.getAllInboxes(), receiveHeader);
		return;
	}

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
	}

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
			outbox = {addr: _outbox, nonce: 1};
		}
		console.log("outbox: ", outbox);

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
		let inboxAddress = await fncm.new_inbox("generalinbox");
		let inboxObj = {
			public_key: "test public key",
			private_key: "test private key",
			inbox: {
				addr: inboxAddress
			}
		};
		console.log("generated inbox:", inboxObj);
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
