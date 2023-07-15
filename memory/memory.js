const { ChromaClient } = require('chromadb');
const { OpenAIEmbeddingFunction } = require('chromadb');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { Document } = require('langchain/document');
const { Chroma } = require('langchain/vectorstores/chroma');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
require('dotenv').config();

const { open_ai_token } = process.env;


async function indexCharacterBackground(character, characterBackground) {

	await removeCharacterBackground(character);

	const client = new ChromaClient();

	const embedder = new OpenAIEmbeddingFunction({ openai_api_key: open_ai_token });

	let collection = await client.getCollection({ name: 'character_backgrounds' });

	if(!collection) {
		collection = await client.createCollection({ name: 'character_backgrounds', embeddingFunction: embedder });
	}

	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 350,
		chunkOverlap: 100,
	});

	const docOutput = await splitter.splitDocuments([
		new Document({ pageContent: characterBackground, metadata: { character: character } }),
	]);


	const embeddings = new OpenAIEmbeddings({ openAIApiKey: open_ai_token });
	const vectorStore = new Chroma(embeddings, {
		collectionName: 'character_backgrounds',
	});

	await vectorStore.addDocuments(docOutput); // returns ids if needed


	const collectionCount = await collection.count();

	console.log(`Collection has ${collectionCount} documents.`);

	return undefined;
}


async function removeCharacterBackground(character) {
	const client = new ChromaClient();
	const meta = {};
	meta['character'] = character;
	const collection = await client.getCollection({ name: 'character_backgrounds' });
	await collection.delete(undefined, meta);
	const collectionCountAfter = await collection.count();
	console.log(`Collection has ${collectionCountAfter} documents.`);
}

indexCharacterBackground('Quincy', 'Quincy had always been a man of simple tastes. He enjoyed spending his days working in his small bakery, crafting delicious pastries that brought joy to the people in his town. He cherished the routine of measuring ingredients, kneading dough, and carefully monitoring the ovens. Life was uncomplicated, and that\'s exactly the way Quincy liked it. One fateful evening, Quincy found himself at the local tavern, surrounded by friends and acquaintances. The air buzzed with excitement as a group of adventurers, fresh from a successful quest, regaled the crowd with tales of their daring exploits. The crowd erupted in applause and admiration, their eyes filled with wonder. As the applause died down, a voice called out from the crowd, "Is there no one brave enough to guide us on our own epic journeys? We need a Dungeon Master!" Eyes turned toward Quincy, who, lost in the enthusiasm of the moment, had absentmindedly raised his hand. The room fell silent, and before he could protest, he found himself reluctantly volunteering for a role he knew little about. Quincy had heard of tabletop role-playing games like Dungeons & Dragons but had never played or even considered being a Dungeon Master. He preferred the simple pleasures of life, and the intricacies of an imaginary world seemed far removed from his reality. However, he was known for his kindness and adaptability, and the crowd\'s eager eyes seemed to urge him forward. With trepidation, Quincy accepted the mantle of Dungeon Master. He immersed himself in the rulebooks, studying the complex mechanics and learning about the art of storytelling. It wasn\'t an easy transition for him, as the rules and calculations sometimes overwhelmed his bakery-trained mind. But he persisted, driven by a desire to bring joy to his friends and provide them with an unforgettable adventure. As Quincy delved deeper into the world of tabletop gaming, he discovered unexpected talents within himself. His naturally creative nature flourished, and he began crafting intricate narratives and vivid descriptions. Players marveled at his ability to paint a picture with words, transporting them to fantastical realms where heroes rose and fell, and unimaginable treasures awaited discovery. Though Quincy never sought the title, he became a beloved Dungeon Master in his town. Word of his captivating campaigns spread, and adventurers from far and wide sought his guidance. His bakery, once the center of his world, became a meeting place for adventurers seeking respite and sustenance between their quests. Quincy learned that being a Dungeon Master wasn\'t just about rolling dice and managing statistics; it was about weaving stories, fostering camaraderie, and igniting the spark of imagination in others. He embraced his newfound role, realizing that his journey had taken an unexpected but fulfilling turn. And so, Quincy, the man who never wanted to be a Dungeon Master, became one of the most celebrated storytellers of his time. His bakery thrived alongside his newfound passion, and he continued to enchant adventurers, proving that sometimes, the greatest adventures begin with a reluctant step into the unknown.');
