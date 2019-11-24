function createCard({front, back}) {
	const c = new Card(front, back);
	c.persist();
}
