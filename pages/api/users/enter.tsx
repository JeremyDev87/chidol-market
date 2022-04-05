import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const { email, phone, password } = req.body;
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
						password: "1234",
						...user,
					},
				},
			},
		},
	});
	const foundToken = await client.token.findUnique({
		where: {
			payload: token.payload,
		},
		include: { user: true },
	});
	if (!foundToken) return res.status(404).end();
	req.session.user = {
		id: foundToken.userId,
	};
	await req.session.save();
	await client.token.deleteMany({
		where: {
			userId: foundToken.userId,
		},
	});
	return res.status(200).json({
		ok: true,
	});
}

export default withApiSession(
	withHandler({
		methods: ["GET", "POST"],
		handler,
		isPrivate: false,
	})
);
