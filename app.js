const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');


exports.start = async () => {
	const ipfs = await IPFS.create();
	const orbitdb = await OrbitDB.createInstance(ipfs);
	var inboxes = [];

	async function readMessages(inbox_list, callback) {
		console.log("subscribing to read messages from: ", inbox_list);
		for (let i = 0; i < inbox_list.length; ++i) {
			let db = await orbitdb.open(inbox_list[i].inbox.addr);

			//ITERATE THROUGH, FIND 

			await db.load();
			let z = await db.get('');


			for (let q = inbox_list[i].inbox.nonce; q < z.length; q++) {
				callback(inbox_list[i]._id, z[q]);
			}
			db.events.on('write', (address, entry, heads) => {
				console.log(entry.payload.value);
				callback(inbox_list[i]._id, entry.payload.value.message);
			});
			inboxes.push(db);
		}

	}

	async function newInbox(inbox_name) {
		console.log("created new inbox");
		let db = await orbitdb.docs(inbox_name);
		console.log(db.address.toString());
		return db.address.toString();
	}

	async function newOutbox(outbox_name) {
		console.log("created new outbox");
		let db = await orbitdb.docs(outbox_name);
		return db.address.toString();
	}

	async function sendMessage(id, address, msg) {
		console.log("sending message: ", msg);
		let db = await orbitdb.open(address);
		let message = await db.put({ _id: id, message: msg }, { pin: true });
		await db.load();
		console.log(db.get(''));
		await db.close();
	}

	async function createStartBlock(inbox_address, start_block) {
		console.log("creating new startblock");
		let db = await orbitdb.open(inbox_address);
		await db.put({ _id: "crypto", data: start_block }, { pin: true });
		await db.close();
	}

	async function getStartBlock(inbox_address) {
		console.log("getting startblock");
		await db.load();
		let startBlock = await orbitdb.open(inbox_address).get("crypto")[0].data;
		await db.close();
		return startBlock;
	}

	async function pushFile(contents) {
		console.log("pushing file to ipfs");
		return (await ipfs.add({path: "/", content: contents})).cid;
	}

	async function getFile(cid) {
		console.log("getting file from ipfs");
		const chunks = [];
		for await (const chunk of ipfs.cat(cid)) {
			chunks.push(chunk);
		}
		return Buffer.concat(chunks).toString();
	}

	return {
	read_messages: readMessages,
	new_inbox: newInbox,
	new_outbox: newOutbox,
	send_message: sendMessage,
	create_start_block: createStartBlock,
	get_start_block: getStartBlock,
	pushFile
	}
}

