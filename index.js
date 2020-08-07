//const _sodium = require('libsodium-wrappers');
const mailout = require('./mailout.js');
const mailin = require('./mailin.js');
const daft = require('./daft.js');
//const fs = require('fs');

daft_functions = daft.start();
mailin.startServer(async (stream, session) => {
	var mailHolder = "";
	stream.on("data", (chunk) => {
		mailHolder += chunk;
	});

	stream.on("end", () => {
		// push email to ipfs	
	var cid = daft_functions.send_mail_file(mailHolder);
//	var encryptionKeys = []
	for (let i=0; i < session.envelope.rcptTo.length; ++i) {
		// TODO: try to get an appropriate encryption key from FNCM
		// else check file based on recipient address 
		// assuming format: [eth-address]@[path-to-thread-id-file]..[path-to-encryption-key-file]
		
		// else push undefined
		//encryptionKeys[i] = undefined;

		// NONE OF THE ABOVE MATTERS NOW
		// just push each one to IPFS, and send an appropriate message
		// should push here, but since no encryption = same hash, will push above
		// daft_functions.send_mail_file(mailHolder);

		// now I am sending the headers
		let rcpt = session.envelope.rcptTo[i].split('@');
		sendHeader(cid, rcpt[0], rcpt[1]);
	}
	});
});
/*
	await daft_functions;
	for (let i=0; i < session.envelope.rcptTo.length; ++i) {
		if (encryptionKeys[i] == undefined) {
			// TODO: implement get_encryption_key(address)
			encryptionKeys[i] = daft_functions.get_encryption_key(session.envelope.rcptTo[i]);
		}
	}
*/
		//daft_functions.encryptMail()
	// TODO: pipe to surrogate FNCM

/*
let message = 
	"Hello.\nThis message was sent from a really awesome module.\nMay your life be long and prosperous!";

mailout.send_email("the_mainframe", "<kingdan@the_mainframe>", "Commisar-General Dan", "<daniel>", "Puny Weakling", 
	"My superiority", message);
*/
/*
(async() => {
	await _sodium.ready;
	const sodium = _sodium;
	let message = "This is my message. Let's encrypt it!";
	let keySet = sodium.crypto_box_keypair();
	console.log(keySet);
	
	let encryptedMessage = sodium.crypto_box_seal(message, keySet.publicKey);
	console.log("encrypted message", encryptedMessage);
	console.log("decrypted message", sodium.to_string(sodium.crypto_box_seal_open(encryptedMessage, keySet.publicKey, keySet.privateKey)));
})();
*/
