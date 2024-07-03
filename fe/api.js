const baseURL = "http://localhost:8081"; // Include the protocol

export const getAllCards = async (value) => {
	try {
		var path = "";
		if (value === "" || value === undefined) {
			path = `${baseURL}/v1/card`;
		} else {
			path = `${baseURL}/v1/card?value=${encodeURIComponent(value)}`;
		}

		console.log("path: " + path);

		const res = await fetch(path);

		// Check if the response is successful
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const cards = await res.json();
		return cards.value;
	} catch (error) {
		console.error("Error fetching cards:", error);
		return null; // Or throw the error to be handled by the calling function
	}
};

export const setCard = async (val) => {
	try {
		const res = await fetch(`${baseURL}/v1/card`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(val),
		});
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const card = await res.json();
		return card.value;
	} catch (error) {
		console.error("Error fetching cards:", error);
		return null; // Or throw the error to be handled by the calling function
	}
};
