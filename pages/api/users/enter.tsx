import client from "@libs/server/client";
import twilio from "twilio";
import mail from "@sendgrid/mail";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.GMAIL_ID,
		pass: process.env.GMAIL_PW,
	},
});
// mail.setApiKey(process.env.SENDGRID_KEY!);
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const { email, phone } = req.body;
	const user = phone ? { phone: phone } : email ? { email } : null;
	if (!user) {
		return res.status(400).json({
			ok: false,
		});
	}
	const payload = Math.floor(100000 + Math.random() * 900000) + "";
	const token = await client.token.create({
		data: {
			payload,
			user: {
				connectOrCreate: {
					where: {
						...user,
					},
					create: {
						name: "Anoymous",
						...user,
					},
				},
			},
		},
	});
	console.log(token);
	if (phone) {
		// await twilioClient.messages.create({
		// 	messagingServiceSid: process.env.TWILIO_MSID,
		// 	to: process.env.MYPHONE!,
		// 	body: `인증번호 : ${payload}`,
		// });
	} else if (email) {
		const sendEmail = await transporter
			.sendMail({
				from: `soundbrokaz <soundbrokaz@gmail.com>`,
				to: email,
				subject: "취돌 인증메일",
				text: `인증번호 : ${payload}`,
				html: `         <div style="text-align: center;">
				<h3 style="color: #FA5882">취돌 인증 메일</h3>
				<br />
				<p>인증번호 :  ${payload}</p>
			  </div>`,
			})
			.then((result: any) => console.log(result))
			.catch((err: any) => console.log(err));
	}
	return res.status(200).json({
		ok: true,
	});
}

export default withHandler("POST", handler);
