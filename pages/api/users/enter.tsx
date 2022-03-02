import client from "@libs/server/client";
import twilio from "twilio";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const { email, phone } = req.body;
	const user = phone ? { phone: +phone } : email ? { email } : null;
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
		await twilioClient.messages.create({
			messagingServiceSid: process.env.TWILIO_MSID,
			to: process.env.MYPHONE!,
			body: `인증번호 : ${payload}`,
		});
	}
	return res.status(200).json({
		ok: true,
	});
}

export default withHandler("POST", handler);
