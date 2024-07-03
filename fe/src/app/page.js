"use client";
import AddCard from "./components/addCard";
import SearchButton from "./components/search";
import ListCard from "./components/listCard";
import { getAllCards } from "../../api";
import { useState, useEffect } from "react";

export default function Home() {
	const [cards, setCards] = useState([]);

	// Fetch cards only once when the component mounts
	useEffect(() => {
		getAllCards().then((cards) => {
			setCards(cards);
		});
	}, []); // The empty dependency array ensures this runs only once

	return (
		<body className="w-screen h-screen bg-indigo-500">
			<div className="flex flex-col h-screen text-center justify-between">
				<div className="flex justify-center items-start h-20">
					<SearchButton onSearch={getAllCards} setList={setCards} />
				</div>

				<div className="flex flex-grow justify-center items-center">
					<ListCard val={cards} />
				</div>

				<div className="flex justify-end items-end h-20 mr-4 mb-4">
					<AddCard />
				</div>
			</div>
		</body>
	);
}
