import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import Input from "@components/input";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { useRouter } from "next/router";

interface EnterForm {
	email?: string;
	phone?: string;
	password: string;
}
interface MutationResult {
	ok: boolean;
}
const Enter: NextPage = () => {
	const [enter, { loading, data, error }] =
		useMutation<MutationResult>("/api/users/enter");
	const [method, setMethod] = useState<"email" | "phone">("email");
	const { register, watch, reset, handleSubmit } = useForm<EnterForm>();
	const onEmailClick = () => {
		reset();
		setMethod("email");
	};
	const onPhoneClick = () => {
		reset();
		setMethod("phone");
	};
	const onValid = (validForm: EnterForm) => {
		if (loading) return;
		enter(validForm);
	};
	const router = useRouter();
	useEffect(() => {
		if (data?.ok) {
			router.push("/");
		}
	}, [data, router]);

	return (
		<div className="mt-16 px-4">
			<h3 className="text-3xl font-bold text-center">Hobbyist</h3>
			<div className="mt-12">
				<div className="flex flex-col items-center">
					<h5 className="text-sm text-gray-500 font-medium">
						Sign in
					</h5>
					<div className="grid  border-b  w-full mt-8 grid-cols-2 ">
						<button
							className={cls(
								"pb-4 font-medium text-sm border-b-2",
								method === "email"
									? " border-teal-500 text-teal-400"
									: "border-transparent hover:text-gray-400 text-gray-500"
							)}
							onClick={onEmailClick}
						>
							Email
						</button>
						<button
							className={cls(
								"pb-4 font-medium text-sm border-b-2",
								method === "phone"
									? " border-teal-500 text-teal-400"
									: "border-transparent hover:text-gray-400 text-gray-500"
							)}
							onClick={onPhoneClick}
						>
							Phone
						</button>
					</div>
				</div>
				<form
					onSubmit={handleSubmit(onValid)}
					className="flex flex-col mt-8 space-y-4"
				>
					{method === "email" ? (
						<Input
							register={register("email", {
								required: true,
							})}
							name="email"
							label="Email address"
							type="email"
							kind="email"
							required
						/>
					) : null}
					{method === "phone" ? (
						<Input
							register={register("phone", {
								required: true,
							})}
							name="phone"
							label="Phone number"
							type="number"
							kind="phone"
							required
						/>
					) : null}
					<Input
						register={register("password", {
							required: true,
						})}
						name="password"
						label="Password"
						type="text"
						kind="password"
						required
					/>
					{method === "email" ? (
						<Button text={loading ? "Loading" : "E-mail Sign-in"} />
					) : null}
					{method === "phone" ? (
						<Button text={loading ? "Loading" : "Mobile Sign-in"} />
					) : null}
				</form>
			</div>
		</div>
	);
};
export default Enter;
