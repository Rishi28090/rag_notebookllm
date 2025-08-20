📒 Notebook LLM

A local PDF & website-based Question-Answering app built with Node.js, Express, and EJS. Users can upload PDFs or provide website URLs and interact with an LLM-powered chatbot to ask questions about the uploaded content.

🚀 Features

Upload PDF documents or enter website URLs as sources.

Ask questions about your uploaded content using a chatbot interface.

View chat history with user messages and bot responses.

Keep track of uploaded sources in one place.

Modern dark-themed UI using EJS + CSS.

🛠 Tech Stack

Node.js – Server runtime

Express.js – Web framework

EJS – Templating engine

Multer – File upload handling

Qdrant – Vector database for storing embeddings

LLM Service – For question-answering on uploaded documents (RAG pipeline)

⚡ Installation

Clone the repository:

git clone <your-repo-url>
cd notebook-llm


Install dependencies:

npm install


Create a .env file with your environment variables:

PORT=3000
OPENAI_API_KEY=your_openai_key
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_api_key



Start the server:

npm start


Open your browser at:

http://localhost:5000

📂 Project Structure
.
├── server.js           # Entry point
├── views/
│   └── chat.ejs        # Main UI page
├── src/
│   ├── routes/
│   │   └── index.js    # Routes for upload & chat
│   ├── middlewares/
│   │   └── upload.js   # Multer file upload
│   └── services/
│       ├── loader.js    # Load PDF or website content
│       ├── qdrant.js    # Save docs to Qdrant
│       └── chat.js      # Chat with documents
├── uploads/             # Uploaded PDFs
└── package.json

🖥 Usage

Upload a PDF or enter a website URL.

Click Upload to process the content.

Type your question in the chat box and click Ask.

View the bot response and sources below.

Chat history and sources are displayed on the same page.

💡 Notes

You can upload either a PDF or a website URL, or both.

Uploaded PDFs are stored in the uploads/ folder.

Messages and sources are stored in memory, so they reset on server restart.