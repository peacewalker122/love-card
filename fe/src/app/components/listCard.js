import React, { useState, useEffect } from "react";
import { getAllCards } from "../../../api";

const ListCard = () => {
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true); // To handle loading state
	const [error, setError] = useState(null); // To handle error state

	useEffect(() => {
		const fetchCards = async () => {
			try {
				const fetchedCards = await getAllCards();
				// Ensure the response is an array
				if (Array.isArray(fetchedCards)) {
					setCards(fetchedCards);
				} else {
					throw new Error("API response is not an array");
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCards();
	}, []);

	if (loading) {
		return <p>Loading...</p>; // Render loading state
	}

	if (error) {
		return <p>Error: {error}</p>; // Render error state
	}

	return (
		<article className="bg-indigo-400 shadow-md rounded-lg p-6 w-3/4 h-full flex flex-col justify-items-center">
			{cards.map((item, index) => (
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
