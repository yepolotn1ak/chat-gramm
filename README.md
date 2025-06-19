# Chat-Gramm

## Description  
A secure real-time web messenger built with end-to-end encryption. Users can exchange messages without providing personal data or passwords — just a chosen nickname. The application supports group chats, encrypted local message storage, and fully responsive design.

⚠️ This app uses a **self-signed SSL certificate**, so browsers may warn about the connection being unsafe. You can safely proceed by accepting the warning.

## Features  
- **Real-Time Messaging**: Send and receive messages instantly using WebSocket.
- **End-to-End Encryption**: Messages are encrypted with AES-256-GCM and key-exchanged via X25519 (ECDH).
- **Group Chats**: Create and manage group conversations with secure key distribution.
- **No Login Required**: Simply enter a username to join.
- **Responsive Interface**: Optimized for desktop, tablet, and mobile use.
- **Secure Local Storage**: Keys are stored in sessionStorage, and messages are stored in encrypted form in the database.
- **Dockerized Deployment**: Backend, frontend, and Nginx reverse proxy are containerized for easy launch.

## Data  
All messages are stored on the backend in encrypted form. The encryption includes metadata such as `IV`, `authTag`, and sender’s public key. Group chats use a sender key distribution mechanism.

## Technologies Used

### **Frontend:**
- React + TypeScript  
- SCSS  
- Axios  

### **Backend:**
- Node.js  
- Express  
- WebSocket (`ws`)  
- PostgreSQL + Sequelize  
- Crypto (AES, X25519)  

### **Інше:**
- Docker + docker-compose  
- Nginx (HTTPS + reverse proxy)  
- AWS EC2 (сервер)

## Links  
- **Preview:** [DEMO LINK](https://13.48.148.108:4443/)  
- **GitHub:** [chat-gramm Repository](https://github.com/yepolotn1ak/chat-gramm)

## Launch Instructions  
1. **Fork** the repo.  
2. **Clone** the forked repo.  
3. Create a `.env` file with PostgreSQL credentials:
   ```
   POSTGRES_DB=your_db
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password
   ```
4. Make sure SSL certificate files `server.crt` and `server.key` are present.  
5. Run with Docker:
   ```bash
   docker-compose up --build
   ```
