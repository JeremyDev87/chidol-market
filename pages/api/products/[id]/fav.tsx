import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import Id from ".";
import products from "..";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const {
		query: { id },
		session: { user },
	} = req;
	const alreadyExists = await client.fav.findFirst({
		where: {
			productId: +id.toString(),
		},
	});
	if (alreadyExists) {
		//delete fav
		await client.fav.delete({
			where: {
				id: alreadyExists.id,
			},
		});
	} else {
		//create fav
		await client.fav.create({
			data: {
				user: {
					connect: {
						id: user?.id,
					},
				},
				product: {
					connect: {
						id: +id.toString(),
					},
				},
			},
		});
	}
	res.json({ ok: true });
}

export default withApiSession(
	withHandler({
		methods: ["POST"],
		handler,
		isPrivate: false,
	})
);
