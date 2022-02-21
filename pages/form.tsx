import React from "react";
import { FieldErrors, useForm } from "react-hook-form";

interface LoginForm {
	username: string;
	email: string;
	password: string;
}

export default function Form() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({ mode: "onChange" });
	const onValid = (data: LoginForm) => {
		console.log("onValid execute");
	};
	const onInvalid = (errors: FieldErrors) => {
		console.log(errors);
	};
	return (
		<form onSubmit={handleSubmit(onValid, onInvalid)}>
			<input
				{...register("username", {
					required: "Username is required",
					minLength: {
						value: 5,
						message: "5글자 이상 써 넣어라",
					},
				})}
				type="text"
				placeholder="username"
			/>
			{errors.username?.message}
			<input
				{...register("email", {
					required: "Email is required",
					validate: {
						notGmail: (value) =>
							!value.includes("@gmail.com") || "Gmail 쓰지마라",
					},
				})}
				type="email"
				placeholder="email"
				className={`${
					Boolean(errors.email?.message) ? "border-red-500" : ""
				}`}
			/>
			{errors.email?.message}
			<input
				{...register("password", { required: "Password is required" })}
				type="password"
				placeholder="password"
			/>
			{errors.password?.message}
			<input type="submit" value="Create Account" />
		</form>
	);
}
