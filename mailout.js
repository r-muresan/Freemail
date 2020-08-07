const net = require("net");

exports.send_email = (from_server, from_address, from_name, to_address, to_name, subject, mail, date) => {
	if (date == undefined)
		let date = new Date();
	let day = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
	let month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
	let year = date.getFullYear();
	let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	let offset = '-500';
	const tcpclient = net.createConnection({ port: 24 }, () => {
	//        console.log("connected to dovecot!\n");
		tcpclient.write("LHLO "+from_server+"\n");
		tcpclient.write("MAIL FROM:"+from_address+"\n");
		tcpclient.write("RCPT TO:"+to_address+"\n");
		tcpclient.write("DATA\n");
		tcpclient.write('From: "'+from_name+'" '+from_address+'\n');
		tcpclient.write('To: '+to_name+' '+to_address+'\n');
		tcpclient.write('Cc: \n');
		tcpclient.write('Date: ' + day + ', ' + date + ' ' + month + ' ' + year + ' ' + time + ' ' + offset + '\n');
		tcpclient.write('Subject: ' + subject + '\n\n');
		tcpclient.write(mail + '\n');
		tcpclient.write('.\n');
		tcpclient.write('QUIT\n');
	});
};

exports.send_email_json = (mail, from_server, from_address, to) => {
	let day = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
	let month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
	let year = date.getFullYear();
	let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	let offset = '-500';
	const tcpclient = net.createConnection({ port: 24 }, () => {
	//        console.log("connected to dovecot!\n");
		tcpclient.write("LHLO " + from_server + "\n");
		tcpclient.write("MAIL FROM:" + from_address + "\n");
		tcpclient.write("RCPT TO:" + to + "\n");
		tcpclient.write("DATA\n");
		tcpclient.write('From: "' + mail.from.value[0].name + '" ' + mail.from.value[0].address + '\n');
		tcpclient.write('To: ' + mail.to.value[0].name + ' ' + mail.to.value[0].address + '\n');
		tcpclient.write('Cc: \n');
		tcpclient.write('Date: ' + day + ', ' + date + ' ' + month + ' ' + year + ' ' + time + ' ' + offset + '\n');
		tcpclient.write('Subject: ' + mail.subject + '\n\n');
		tcpclient.write(mail.textAsHtml + '\n');
		tcpclient.write('.\n');
		tcpclient.write('QUIT\n');
	});
};

exports.send_email_string = (mail, from_server, from_address, to) => {
	const tcpclient = net.createConnection({ port: 24 }, () => {
		tcpclient.write("LHLO " + from_server + "\n");
		tcpclient.write("MAIL FROM:" + from_address + "\n");
		tcpclient.write("RCPT TO:" + to + "\n");
		tcpclient.write("DATA\n");
		tcpclient.write(mail);
		tcpclient.write('.\n');
		tcpclient.write('QUIT\n');
	});
};

//tcpclient.on("data", (data) => console.log(data.toString()));
//tcpclient.on("end", () => console.log("disconnected from server"));

