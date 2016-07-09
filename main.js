/**
*	Kode server aplikasi chat 
*/

// modul pembuatan server 
var http = require('http');

// modul file system 
var fs = require('fs');

// modul untuk memfilter tag html agar tidak terjadi xss attack
var sanitize = require('validator');

/*
	Objek server yang berhasil dibentuk akan disimpan di variabel app.
	Terdapat fungsi callback yang akan dipanggil saat server menerima 
	connection request dari client.
*/	
var app = http.createServer(function (request, response) {
	/* 	membaca isi file "client.html" dan akan ditampilkan saat client me-request halaman
		localhost:8080
	*/
    fs.readFile("client.html", 'utf-8', function (error, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
});

// server akan menerima connection request dari client pada port 8080 (harus free port)
app.listen(8080);
 
console.log("Server is running...");
 
// modul untuk pembentukan socket antara server dan client 
var io = require('socket.io').listen(app);
 
io.sockets.on('connection', function(socket) {
	
	// event-handler saat server menerima event message_to_server dari client 
    socket.on('message_to_server', function(data) {
		
		/*	data yang diterima akan difilter, sehingga data yang memiliki script tidak akan 
			diinterpretasikan oleh browser
		*/
        var escaped_message = sanitize.escape(data["message"]);
		
		// mengirimkan data yang diterima dari client tertentu ke semua client yang terhubung ke server 
        io.sockets.emit("message_to_client",{ message: escaped_message });
    });
});