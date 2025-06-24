# AIM-Inspired Chat App Example

This project is a modern web chat application inspired by the classic AOL Instant Messenger (AIM) interface. It demonstrates how to build a nostalgic, retro-themed chat UI using Next.js, React, and Tailwind CSS, with real-time agent interaction.

## Features

- AIM-style Buddy List home screen
- AIM-style chat window with online indicator, retro fonts, and colored usernames
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

### Buddy List (Home Page)

![Buddy List Screenshot](/images/home.png)
_The AIM-inspired Buddy List, showing all available agents._

### Chat Screen

![Chat Screen Screenshot](/images/chat.png)
_The chat window, styled after classic AIM conversations._

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

## Customization

- Update the agent API endpoint in `src/app/page.tsx` and `src/app/agents/[agentId]/chat/page.tsx` to use your own data source.
- Replace the images in the `/images/` directory with your own screenshots for documentation.

## License

MIT
