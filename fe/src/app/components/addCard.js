import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import { setCard } from "../../../api";
import { Router, useRouter } from "next/router";

const AddCard = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [letter, setLetter] = useState("");
	const [author, setAuthor] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setLetter("");
		setAuthor("");
		setErrorMessage("");
	};

	const handleLetterChange = (e) => {
		if (e.target.value.length <= 1000) {
			setLetter(e.target.value);
		} else {
			setErrorMessage("Letter cannot be more than 1000 characters.");
		}
	};

	const handleAuthorChange = (e) => {
		if (e.target.value.length <= 20) {
			setAuthor(e.target.value);
		} else {
			setErrorMessage("Author name cannot be more than 20 characters.");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (letter.length > 1000 || author.length > 20) {
			setErrorMessage("Please adhere to the character limits.");
		} else {
			try {
				const newCard = { letter, author };
				const result = await setCard(newCard);
				console.log("Card added successfully:", result);
				handleCloseModal();
			} catch (error) {
				setErrorMessage("Error adding card. Please try again.");
				console.error("Error adding card:", error);
			}
		}
	};

	return (
		<div>
			<button
				type="button"
				onClick={handleOpenModal}
				className="btn btn-primary py-4 px-4 bg-indigo-400 font-sans rounded-lg text-white hover:bg-blue-600"
			>
				<GoPlus size={30} />
			</button>

			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
					<div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
						<h2 className="text-2xl font-bold mb-4">Add New Card</h2>
						{errorMessage && (
							<p className="text-red-500 mb-4">{errorMessage}</p>
						)}
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label
									className="block text-gray-500 text-sm font-bold mb-2"
									htmlFor="letter"
								>
									Letter (max 1000 characters)
								</label>
								<textarea
									id="letter"
									value={letter}
									onChange={handleLetterChange}
									className="w-full p-2 border rounded text-black"
									rows="5"
								/>
								<p className="text-sm text-gray-500">{letter.length}/1000</p>
							</div>
							<div className="mb-4">
								<label
									className="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="author"
								>
									Author (max 20 characters)
								</label>
								<input
									id="author"
									type="text"
									value={author}
									onChange={handleAuthorChange}
									className="w-full p-2 border rounded text-black"
								/>
								<p className="text-sm text-gray-500">{author.length}/20</p>
							</div>
							<div className="flex justify-end">
								<button
									type="button"
									onClick={handleCloseModal}
									className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-indigo-400 text-white rounded hover:bg-blue-600"
								>
									Save
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default AddCard;
