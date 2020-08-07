const readline = require('readline');
const fs = require("fs");
const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);



function exposeAddressbook(collection) {
	async function getOutbox(address) {
		return (await collection.findOne({_id: address})).outbox;
	}
/*
	async function getInbox(address) {
		if (address == undefined || address == "GENERAL_INBOX") {
			let inboxVal = await collection.findOne({_id: "GENERAL_INBOX"})
			return { inbox: inboxVal.addr, nonce: inboxVal.nonce };
		}
		return (await collection.findOne({_id: address})).inbox;
	}
*/
	async function getAllInboxes() {
		return await collection.find().project({ inbox: 1});
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

	return {
		getOutbox, 
		getAllInboxes, 
		getSecretKey, 
		getPublicKey, 
		getContactPublicKey, 
		createContact, 
		editContact, 
		deleteContact
		};
}

exports.start = async (generalInbox, onDisconnect) => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.setPrompt("\n> ");
	try {
		await client.connect();
		// const adminDb = client.db("test").admin();
		const db = client.db("test");

		function addUser() {
			rl.question("Username: ", (username) => {
				rl.question("Password :", async (password) => {
					db.createCollection(username).then(console.log("created collection", username));
					let collection = db.collection(username);
					await generalInbox;
					generalInbox._id = "GENERAL_INBOX";
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
				if (answer == "yes" || answer == 'y')
					onDisconnect();
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

