var nodemailer = require('nodemailer');
var express = require('express');
var app = express();

var router = express.Router();
app.use('/sayHello', router);
router.get('/', handleSayHello); // handle the route at yourdomain.com/sayHello

function handleSayHello(req, res) {
    // Not the movie transporter!
    var transporter = nodemailer.createTransport({
        host: 'mail.gmx.com',
        port: 587,
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
        },
        logger: true, // log to console
        debug: true, // include SMTP traffic in the logs

        // define proxy configuration
        service: 'Gmx',
        auth: {
            user: 'oussayd@gmx.com', // Your email id
            pass: 'rafhaj14' // Your password
        }
    });
    // var transporter = nodemailer.createTransport(smtpTransport({
    // host: 'mail.gmx.com',
    // port: 587,
    // secure: true,
    // auth: {
    // user: 'oussayd@gxm.com', // Your email id
    // pass: 'rafhaj14' // Your password
    // }
    // }));
    var text = 'Hello world from \n\n';


    var mailOptions = {
        from: 'oussayd@gmx.com', // sender address
        to: 'oussayd@gmail.com', // list of receivers
        subject: 'Email Example', // Subject line
        text: text //, // plaintext body
            // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };


    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json({
                yo: 'error'
            });
        } else {
            console.log('Message sent: ' + info.response);
            res.json({
                yo: info.response
            });
        };
    });

}

app.listen(3001, function () {
    console.log('Example app listening on port 3000!');
});