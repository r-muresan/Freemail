const SMTPServer = require("smtp-server").SMTPServer;

exports.startServer = (callbackFunc) => {
	const server = new SMTPServer({
		authOptional: true,
		onData(stream, session, callback) {
			callbackFunc(stream, session);
			stream.on("end", callback);
		}
	});
	server.listen(1587, "127.0.0.1");
};
