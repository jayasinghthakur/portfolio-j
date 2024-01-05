const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

// server used to send send emails
const port = process.env.port || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(port, () => console.log("Server Running"));


console.log(process.env.EMAIL_USER,process.env.EMAIL_PASS);

const contactEmail = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

contactEmail.verify((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready to Send");
    }
});

router.post("/contact", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    const mail = {
        from: name,
        to: process.env.EMAIL_USER,
        subject: "Contact Form Submission - Portfolio",
        html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Subject: ${subject}</p>
           <p>Message: ${message}</p>`,
    };

    console.log(mail);
    //   contactEmail.sendMail(mail, (error) => {
    //     if (error) {
    //       res.json(error);
    //     } else {
    //       res.json({ code: 200, status: "Message Sent" });
    //     }
    //   });
    contactEmail.sendMail(mail, (error, info) => {
        console.log("send mail");
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Email sent: ' + info.response);
            res.json({ code: 200, status: 'Message Sent' });
        }
    });
});