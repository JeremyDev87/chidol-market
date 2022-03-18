import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import useCoords from "@libs/client/useCoords";

interface WriteForm {
	question: string;
}

interface WriteResponse {
	ok: boolean;
	post: Post;
}

const Write: NextPage = () => {
	const { latitude, longitude } = useCoords();
	console.log(latitude, longitude);
	const router = useRouter();
	const { register, handleSubmit } = useForm<WriteForm>();
	const [post, { loading, data }] = useMutation<WriteResponse>("/api/posts/");
	const onValid = (data: WriteForm) => {
		if (loading) return;
		post({ ...data, latitude, longitude });
	};
	useEffect(() => {
		if (data && data?.ok) {
			router.push(`/community/${data?.post?.id}`);
		}
	}, [data, router]);
	return (
		<Layout canGoBack title="Write Post">
			<form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
				<TextArea
					placeholder="Ask a question!"
					register={register("question", {
						required: true,
						minLength: 5,
					})}
				/>
				<Button text={loading ? "loading..." : "Submit"} />
			</form>
		</Layout>
	);
};

export default Write;
