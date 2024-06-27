import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchButton = ({ onSearch, setList }) => {
	const [searchString, setSearchString] = useState("");

	const handleInputChange = (e) => {
		setSearchString(e.target.value);
	};

	const handleSearchClick = async () => {
		const fetchedCards = await onSearch(searchString);
		setList(fetchedCards);
	};

	return (
		<div className="flex items-center text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full">
			<input
				type="text"
				value={searchString}
				onChange={handleInputChange}
				placeholder="Search..."
				className="bg-black text-white px-4 py-2 rounded-l focus:outline-none w-3/4"
			/>
			<button
				type="button"
				onClick={handleSearchClick}
				className="flex items-center bg-black text-white px-4 py-2 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/4"
			>
				<FaSearch className="mr-2" />
				Search
			</button>
		</div>
	);
};

export default SearchButton;
