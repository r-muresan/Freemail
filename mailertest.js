const net = require("net");

const tcpclient = net.createConnection({ port: 24 }, () => {
	console.log("connected to dovecot!\n");
	tcpclient.write("LHLO daniel\n");
	tcpclient.write("MAIL FROM:<daniel@daniel>\n");
	tcpclient.write("RCPT TO:<daniel>\n");
	tcpclient.write("DATA\n");
	tcpclient.write('From: "Daniel Shteinbok" <daniel@daniel>\n');
	tcpclient.write('To: Daniel Shteinbok <daniel>\n');
	tcpclient.write('Cc:\n');
	tcpclient.write('Date: Tue, 4 Aug 2020 10:55:22 -500\n');
	tcpclient.write('Subject: Test mail through tcp socket\n\n');
	tcpclient.write('will you get this?\n');
	tcpclient.write('.\n');
	tcpclient.write('QUIT\n');
});

tcpclient.on("data", (data) => console.log(data.toString()));
tcpclient.on("end", () => console.log("disconnected from server"));

/*
// IPC does not seem to work--ENONET error given. Just use TCP
const ipcclient = net.createConnection({ path: "/tmp/lmtp" }, () => {
	console.log("connected to dovecot!\n");
	client.write("LHLO daniel\n");
	client.write("MAIL FROM:<daniel@daniel>\n");
	client.write("RCPT TO:<daniel>\n");
	client.write("DATA\n");
	client.write('From: "Daniel Shteinbok" <daniel@daniel>\n');
	client.write('To: Daniel Shteinbok <daniel>\n');
	client.write('Cc: daniel\n');
	client.write('Date: Tue, 4 Aug 2020 10:55:22 -500\n');
	client.write('Subject: Test mail through ipc socket\n');
	client.write('this one was sent through the IPC!\n');
	client.write('.\n');
	client.write('QUIT\n');
});

ipcclient.on("data", (data) => console.log(data.toString()));
ipcclient.on("end", () => console.log("disconnected from server"));
*/
