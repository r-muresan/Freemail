const readline = require('readline');
const fs = require("fs");
const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);



function exposeAddressbook(collection) {
	async function getOutbox(address) {
		let contact = await collection.findOne({_id: address});
		if (contact == null)
			return;
		return contact.outbox;
	}
	async function getInbox(address) {
		if (address == undefined || address == "GENERAL_INBOX") {
			let inboxVal = await collection.findOne({_id: "GENERAL_INBOX"})
			return { inbox: inboxVal.addr, nonce: inboxVal.nonce };
		}
		let contact = await collection.findOne({_id: address});
		if (contact == null)
			return getInbox();
		return contact.inbox;
	}
	async function getAllInboxes() {
		return (await collection.find().project({ inbox: 1})).toArray();
	}
	async function getSecretKey(address) {
		if (address == undefined)
			return (await collection.findOne({_id: "GENERAL_INBOX"})).secret_key;
		let entry = await collection.findOne({_id: address});
		if (entry == null || entry.public_key == undefined)
			return getSecretKey();
		return entry.secret_key;
	}
	async function getPublicKey(address) {
		if (address == undefined)
			return (await collection.findOne({_id: "GENERAL_INBOX"})).public_key;
		let entry = await collection.findOne({_id: address});
		if (entry == null || entry.public_key == undefined)
			return getPublicKey();
		return entry.public_key;
	}
	async function getContactPublicKey(address) {
		let entry = await collection.findOne({_id: address});
		if (entry == null)
			return;
		return entry.contact_pub_key;
	}
	async function createContact(eth_address) {
		await collection.insertOne({_id: eth_address});
		return;
	}

	async function editContact(eth_address, toUpdate) {
		let entry = await collection.findOne({_id: address});
		if (entry == null)	
			await createContact(eth_address);
		await collection.updateOne({_id: eth_address}, {$set: toUpdate});
		return;
	}

	async function deleteContact(eth_address) {
		collection.deleteOne({_id: eth_address});
		return;
	}

	async function getMyEthAddress() {
		return (await collection.findOne({_id: "GENERAL_INBOX"})).eth_address;
	}

	return {
		getOutbox, 
		getInbox,
		getAllInboxes, 
		getSecretKey, 
		getPublicKey, 
		getContactPublicKey, 
		createContact, 
		editContact, 
		deleteContact,
		getMyEthAddress
		};
}

exports.start = async (generalInboxFunc, onSwitch) => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	//rl.setPrompt("\n> ");
	try {
		await client.connect();
		// const adminDb = client.db("test").admin();
		const db = client.db("test");

		function addUser() {
			rl.question("Username: ", (username) => {
				rl.question("Password :", async (password) => {
					db.createCollection(username).then(console.log("created collection", username));
					let collection = db.collection(username);
					generalInbox = await generalInboxFunc();
					generalInbox._id = "GENERAL_INBOX";
					//generalInbox.inbox.nonce = 0;
					collection.insertOne(generalInbox);
				});
			});
		}
		function removeUser() {
			rl.question("Username: ", (username) => {
				rl.question("Password: ", (password) => {
					db.dropCollection(username).then(console.log("dropped collection", username));
				});
			});
		}
		function logIn(resolveFunc) {
			rl.question("Username: ", (username) => {
				rl.question("Password :", (password) => {
					// TODO: return all the addressbook functions in an object
					let collection = db.collection(username);
					resolveFunc(exposeAddressbook(collection));
				});
			});
		}
		function logOut() {
			rl.question("Are you sure you would like to log out?", (answer) => {
				if (answer == "yes" || answer == 'y') {
					//onDisconnect();
				}
			});
		}
		function switchAccounts() {
			rl.question("Are you sure you would like to log out?", (answer) => {
				if (answer == "yes" || answer == 'y') {
					rl.question("Username: ", (username) => {
						rl.question("Password :", (password) => {
							// TODO: return all the addressbook functions in an object
							let collection = db.collection(username);
							onSwitch(exposeAddressbook(collection));
						});
					});
				}
			});
		}
			
		return new Promise((resolveFunc, rejectFunc) => {
			rl.on("line", (input) => {
				//console.log(input)
				if (input == "quit") {
					rl.close();
					client.close();
				}
				else if (input == "adduser") {
					addUser();
				}
				else if (input == "killuser") {
					removeUser();
				}
				else if (input == "login") {
					logIn(resolveFunc);
				}
				else if (input == "logout") {
					logOut();
				}
				else if (input == "switchuser") {
					switchAccounts();
				}
			});
		});
	} catch (error) {
		console.error(error);
	} finally {
	}
}


	

/*
rl.question("Username:   ", (username) => {
	console.log("welcome, ", username);
});
*/

