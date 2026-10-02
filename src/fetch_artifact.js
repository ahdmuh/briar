const fetch = require('node-fetch');

// Artifact icons never change, so resolved URLs are kept for the life of the process
const artifactImageCache = new Map();

const getArtifactImage = async (artifactName) => {
	const formattedName = artifactName.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');

	if (artifactImageCache.has(formattedName)) {
		return artifactImageCache.get(formattedName);
	}

	try {
		// Look up the artifact ID, then build its icon URL
		const response = await fetch(`https://cecilia-bot-api.vercel.app/api/v1/getItem?list=artifact&id=${formattedName}`, { timeout: 8000 });
		const data = await response.json();
		if (!data.id) {
			throw new Error('Artifact ID not found');
		}

		const imageUrl = `https://raw.githubusercontent.com/CeciliaBot/E7Assets-Temp/main/assets/item_arti/icon_${data.id}.png`;
		artifactImageCache.set(formattedName, imageUrl);
		return imageUrl;
	} catch (err) {
		console.error('Artifact fetch error:', err.message);
		return '';
	}
};

module.exports = getArtifactImage;
