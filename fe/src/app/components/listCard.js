import React from "react";

const ListCard = ({ val }) => {
	return (
		<article className="bg-indigo-400 shadow-md rounded-lg p-6 w-3/4 h-full flex flex-col justify-items-center">
			{val.map((item, index) => (
				<div
					key={`div-${index}`}
					className="bg-gray-800 p-4 rounded-lg shadow-md my-4"
				>
					<time dateTime={item.date} className="text-white text-sm">
						{new Date(item.createdAt * 1000).toLocaleDateString()}
					</time>
					<p className="text-white text-lg mt-2">{item.letter}</p>
					<p className="text-white text-sm mt-4">Author: {item.author}</p>
				</div>
			))}
		</article>
	);
};

export default ListCard;
