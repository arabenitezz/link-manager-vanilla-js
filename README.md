# Link Manager Pro 🔗

A modern web application for organizing, sharing, and discussing your favorite links! 📚

## Features ✨

- 🏷️ Organize links with custom tags
- 💬 Comment on shared links
- 👍 Vote on the most useful resources
- 📱 Responsive design for all devices
- 🌐 Clean and intuitive interface

## Tech Stack 🛠️

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome for icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- REST API

## Getting Started 🚀

### Prerequisites
- Node.js (v12 or higher)
- MongoDB installed and running
- npm or yarn package manager

### Installation 📥

1. Clone the repository:
```bash
git clone https://github.com/yourusername/link-manager-pro.git
cd link-manager-pro
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

4. Start the server:
```bash
npm start
```

5. Open `index.html` in your browser or serve it through a local server.

## API Endpoints 🛣️

### Links
- `GET /api/links` - Get all links
- `GET /api/links?tag=example` - Get links by tag
- `GET /api/links/:id` - Get specific link with comments
- `POST /api/links` - Create new link
- `PATCH /api/links/:id/vote` - Vote on a link

### Comments
- `POST /api/comments` - Add a comment to a link

## Project Structure 📁

```
link-manager-pro/
├── front/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── back/
│   ├── routes/
│   │   ├── links.js
│   │   └── comments.js
│   ├── models/
│   │   ├── link.js
│   │   └── comment.js
│   └── server.js
└── README.md
```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments 🙏

- Font Awesome for the icons