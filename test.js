const cheese = require("./app.js");

(async () => {
    const yes = await cheese.start();
    let inbox_address = await yes.new_inbox("no");



    yes.send_message(1, inbox_address, "hello");

    await yes.send_message(2, inbox_address, "hello");



    await yes.read_messages([
        {
            inbox: { addr: inbox_address, nonce: 0 },
            _id: 0
        }], (address, payload) => {
            console.log(address);
            console.log(payload);
        });

	yes.send_message(3, inbox_address, "this is another message");



})();
