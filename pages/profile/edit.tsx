import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useMutation from "@libs/client/useMutation";

interface EditProfileForm {
	name?: string;
	email?: string;
	phone?: string;
	formErrors?: string;
}
interface EditProfileResponse {
	ok: boolean;
	error?: string;
}
const EditProfile: NextPage = () => {
	const { user } = useUser();

	const {
		register,
		setValue,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<EditProfileForm>();
	const [editProfile, { data, loading }] =
		useMutation<EditProfileResponse>("/api/users/me");

	const onValid = ({ email, phone, name }: EditProfileForm) => {
		if (email === "" && phone === "" && name === "") {
			return setError("formErrors", {
				message: "Email이나 Phone 둘중 하나는 채우세요",
			});
		}
		editProfile({ email, phone, name });
	};

	useEffect(() => {
		user?.email ? setValue("email", user.email) : null;
		user?.phone ? setValue("phone", user.phone) : null;
		user?.name ? setValue("name", user.name) : null;
	}, [user, setValue]);

	useEffect(() => {
		if (data && !data.ok && data?.error) {
			setError("formErrors", { message: data?.error });
		}
	}, [data, setError]);

	return (
		<Layout canGoBack title="Edit Profile">
			<form
				className="py-10 px-4 space-y-4"
				onSubmit={handleSubmit(onValid)}
			>
				<div className="flex items-center space-x-3">
					<div className="w-14 h-14 rounded-full bg-slate-500" />
					<label
						htmlFor="picture"
						className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 text-gray-700"
					>
						Change
						<input
							id="picture"
							type="file"
							className="hidden"
							accept="image/*"
						/>
					</label>
				</div>
				<Input
					required={false}
					label="Name"
					name="name"
					type="text"
					register={register("name")}
				/>
				<Input
					required={false}
					label="Email address"
					name="email"
					type="email"
					register={register("email")}
				/>
				<Input
					required={false}
					label="Phone number"
					name="phone"
					type="number"
					kind="phone"
					register={register("phone")}
				/>
				{errors?.formErrors ? (
					<span className="my-2 text-red-500 font-medium text-center block">
						{errors?.formErrors?.message}
					</span>
				) : null}
				<Button text={loading ? "Loading..." : "Update profile"} />
			</form>
		</Layout>
	);
};

export default EditProfile;
