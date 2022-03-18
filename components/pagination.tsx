import { cls } from "@libs/client/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface PaginationProps {
	nowPage: number | undefined;
	dataSize: number;
}
type Direction = "prev" | "next";

export default function Pagination({ nowPage, dataSize }: PaginationProps) {
	const router = useRouter();
	const maxPage = Number((dataSize / 10).toFixed()) + 1;
	let [showPage, setShowPage] = useState<number[]>([]);

	const pageClick = (page: number) => {
		router.push(`${router.pathname}?page=${page}`);
	};
	const arrowClick = (direction: Direction) => {
		if (direction === "prev") {
			router.push(`${router.pathname}?page=${nowPage! - 1}`);
		} else {
			router.push(`${router.pathname}?page=${nowPage! + 1}`);
		}
	};
	useEffect(() => {
		if (nowPage !== undefined && nowPage > 3 && nowPage + 3 < maxPage) {
			setShowPage([
				nowPage - 2,
				nowPage - 1,
				nowPage,
				nowPage + 1,
				nowPage + 2,
			]);
		}
		if (nowPage !== undefined && nowPage <= 3) {
			setShowPage([1, 2, 3, 4, 5]);
		}
		if (nowPage !== undefined && nowPage + 3 >= maxPage) {
			setShowPage([
				maxPage - 4,
				maxPage - 3,
				maxPage - 2,
				maxPage - 1,
				maxPage,
			]);
		}
	}, [nowPage, maxPage]);
	return (
		<div className="flex item-center justify-center space-x-1 py-5">
			<div
				className={cls(
					"w-10 rounded-full aspect-square flex items-center justify-center cursor-pointer",
					nowPage === 1 ? "hidden" : "block"
				)}
				onClick={() => {
					arrowClick("prev");
				}}
			>
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M15 19l-7-7 7-7"
					></path>
				</svg>
			</div>
			<div
				className={cls(
					"flex items-center justify-center",
					nowPage! < 4 ? "hidden" : ""
				)}
			>
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
					></path>
				</svg>
			</div>
			{showPage?.map((page, index) => {
				return (
					<div
						className={cls(
							"w-10 rounded-full aspect-square flex items-center justify-center",
							page === nowPage ? "bg-teal-400" : "cursor-pointer"
						)}
						onClick={() => {
							pageClick(page);
						}}
						key={index}
					>
						<span className="">{page}</span>
					</div>
				);
			})}
			<div
				className={cls(
					"flex items-center justify-center",
					nowPage! + 3 > maxPage ? "hidden" : ""
				)}
			>
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
					></path>
				</svg>
			</div>
			<div
				className={cls(
					"w-10 rounded-full aspect-square flex items-center justify-center cursor-pointer",
					nowPage === maxPage ? "hidden" : "block"
				)}
				onClick={() => {
					arrowClick("next");
				}}
			>
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M9 5l7 7-7 7"
					></path>
				</svg>
			</div>
		</div>
	);
}
