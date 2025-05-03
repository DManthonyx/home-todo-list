# Todo List App

A modern todo list application built with React, TypeScript, and Firebase. Features include:

- Google Authentication
- Real-time todo updates
- Create, read, update, and delete todos
- Dark mode UI
- Responsive design
- Offline support

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Firebase (Authentication, Firestore, Hosting)
- Vite

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/todo-list.git
cd todo-list
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Deployment

The app is deployed using Firebase Hosting. To deploy:

```bash
npm run build
firebase deploy
```

## License

MIT
