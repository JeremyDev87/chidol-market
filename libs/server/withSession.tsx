import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
	interface IronSessionData {
		user?: {
			id: number;
		};
	}
}

const cookieOptions = {
	cookieName: "carrotSession",
	password: process.env.IRONSESSION_PW!,
};

export function withApiSession(fn: any) {
	return withIronSessionApiRoute(fn, cookieOptions);
}
