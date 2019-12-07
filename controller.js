async function addOrUpdateCard(cardData) {
	const c = new Card(cardData);
	c.persist();
}

function getCard(id) {
	return Card.find(id);
}