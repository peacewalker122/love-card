"use client";
import { useState } from "react";
import AddCard from "./components/addCard";
import SearchButton from "./components/search";
import ListCard from "./components/listCard";

export default function Home() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();
		// Handle the login logic here
		console.log("Username:", username);
		console.log("Password:", password);
	};

	return (
		<body className="w-screen h-screen bg-indigo-500">
			<div className="flex flex-col h-screen text-center justify-between">
				<div className="flex justify-center items-start h-20">
					<SearchButton />
				</div>

				<div className="flex flex-grow justify-center items-center">
					<ListCard />
				</div>

				<div className="flex justify-end items-end h-20 mr-4 mb-4">
					<AddCard />
				</div>
			</div>
		</body>
	);
}
