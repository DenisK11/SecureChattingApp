# Secure Chatting App with End-to-End Encryption

A simple yet effective real-time chat application that integrates RSA-OAEP-256 end-to-end encryption (E2EE) on top of a Node.js + WebCrypto-powered backend.

This project demonstrates how secure communication can be achieved in a chat environment while keeping users anonymous and messages confidential, even over insecure infrastructures.

🚀 Features

    End-to-End Encryption using RSA-OAEP-256
    Room-based chatting system with password protection
    Anonymous participation (only username, room, and password required)
    Live room & participant listing
    Message encryption/decryption before transmission and upon receipt
    Real-time communication using socket.io

🛠 Technologies

    Node.js – server and app logic
    WebCrypto API – cryptographic operations
    Socket.IO – real-time communication
    Express.js – backend framework
    HTML, CSS – frontend

📂 Project Structure

    /server
    - node_modules/        # dependencies
    - index.html           # frontend UI
    - style.css            # UI styling
    - index.js             # client-side logic
    - app.js               # server logic & crypto integration
    - package.json         # dependencies & metadata
    - README.md            # project documentation

⚙️ Installation

Clone the repository:

    git clone https://github.com/DenisK11/SecureChattingApp.git
    cd SecureChattingApp/server

Install dependencies:

    npm install

Start the server:

    node app.js

Open the app in your browser:

    http://localhost:3000


Or use the deployed version here:

    👉 Secure Chatting App on Render

DISCALMIER: The app does not have automatic deployment, so it may not be online.

🔒 How It Works

    Each session generates public/private RSA keys for the user.
    Messages are encrypted with the receiver’s public key and decrypted with their private key.
    Even if messages are intercepted, they remain unreadable without the private key.
    Chat rooms are protected by passwords; if a room does not exist, the first user creates it.

📊 Results

    Secure, encrypted chat messaging between users
    Easy to set up without prior cryptography knowledge
    Demonstrates practical use of WebCrypto in real-time apps

🔮 Future Improvements

    Improved UI/UX design
    Enhanced styling and responsiveness
    Bug fixes & backend improvements

📜 License

    This project is released under the MIT License.