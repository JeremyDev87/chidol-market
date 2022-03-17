import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const { id } = req.query;
	const stream = await client.stream.findUnique({
		where: {
			id: +id.toString(),
		},
	});
	res.json({ ok: true, stream });
}

export default withApiSession(
	withHandler({
		methods: ["GET"],
		handler,
		isPrivate: false,
	})
);
