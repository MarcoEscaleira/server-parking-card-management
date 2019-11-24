import nodemailer from "nodemailer";

// Transported setup
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "endersonlcfernandes@gmail.com",
		pass: "123asd123zxc!",
	},
});

export const sendEmail = (to: string, subject: string, text: string) => {
	const mailOptions = {
		from: "ParkingCardsMindera@mindera.com",
		to,
		subject,
		text,
	};

	transporter.sendMail(mailOptions, (err, data) => {
		if (err) {
			console.log("Error sending email", err);
		}

		if (data) {
			console.log("Email send successfully to ", to);
		}
	});
};
