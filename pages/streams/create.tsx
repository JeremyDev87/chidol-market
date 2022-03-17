import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import useUser from "@libs/client/useUser";
import useMutation from "@libs/client/useMutation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Stream } from ".prisma/client";

interface CreateForm {
	name: string;
	price: string;
	description: string;
}
interface CreateResponse {
	ok: boolean;
	stream: Stream;
}
const Create: NextPage = () => {
	const { user } = useUser();
	const router = useRouter();
	const { register, handleSubmit } = useForm<CreateForm>();
	const [createStream, { data, loading }] =
		useMutation<CreateResponse>("/api/streams");

	const onValid = (form: CreateForm) => {
		if (loading) return;
		createStream(form);
	};

	useEffect(() => {
		if (data && data?.ok) {
			router.push(`/streams/${data.stream.id}`);
		}
	}, [data, router]);

	return (
		<Layout canGoBack title="Go Live">
			<form
				className=" space-y-4 py-10 px-4"
				onSubmit={handleSubmit(onValid)}
			>
				<Input
					required
					label="Name"
					name="name"
					type="text"
					register={register("name", { required: true })}
				/>
				<Input
					required
					label="Price"
					name="price"
					type="text"
					kind="price"
					register={register("price", {
						required: true,
						valueAsNumber: true,
					})}
				/>
				<TextArea
					name="description"
					label="Description"
					register={register("description", { required: true })}
				/>
				<Button text={loading ? "Loading..." : "Go Live"} />
			</form>
		</Layout>
	);
};

export default Create;
