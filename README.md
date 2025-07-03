## PoopieChat is a playful, Doodles-inspired chat frontend that brings the iconic poopie trait to life with a fun custom, expressive and instantly recognizable UI.

# derived from the AIM-Inspired Chat App Example

## Features

- Poopie-style Agend Select Screen
- Poopie-style chat window with various costumizations
- Responsive, accessible, and easy to customize
- Powered by Next.js, React, and Tailwind CSS

## API Endpoints & Credentials

This project uses the following API endpoints:

- **List agents:** `https://agents-api.doodles.app/agents`  
  Used in [`src/app/page.tsx`](src/app/page.tsx) to fetch and display the buddy list.
- **Agent details:** `https://agents-api.doodles.app/agents/[agentId]`  
  Used in [`src/app/agents/[agentId]/chat/page.tsx`](src/app/agents/[agentId]/chat/page.tsx) to fetch agent info.
- **Send message:** `https://agents-api.doodles.app/[agentId]/user/message`  
  Used in [`src/app/agents/[agentId]/chat/page.tsx`](src/app/agents/[agentId]/chat/page.tsx) to send and receive chat messages.

### Credentials

API credentials (mini-app id and secret) are set directly in the fetch headers in [`src/app/agents/[agentId]/chat/page.tsx`](src/app/agents/[agentId]/chat/page.tsx):

```js
headers: {
  "Content-Type": "application/json",
  "x-mini-app-id": "YOUR_MINI_APP_ID",
  "x-mini-app-secret": "YOUR_MINI_APP_SECRET",
}
```

Replace these values with your own credentials as needed.

## Screenshots

### PoopieChat (Home Page)

![PoopieChat Screenshot](/images/home.png)
_The Poopie-inspired chat overview, showing all available agents._

### PoopieChat Screen

![Chat Screen Screenshot](/images/chat.png)
_The chat window, inspired by the Poopie trait._

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Live-Demo
_See PoopieChat live in demo mode._
https://dreamnet-poopiechat.vercel.app/

## License

MIT
