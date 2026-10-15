# Customer Support Chatbot Feature (`src/features/support-chatbot`)

This module implements a clean, deterministic, rule-based Customer Support Chatbot for the Campus Marketplace project.

## Requirements Satisfied

- **No External AI API Key Required**: Fully offline and cost-free; operates without OpenAI/Gemini/Anthropic API keys.
- **No Fake AI Integration**: Answers are powered by structured FAQ rules and keyword matching.
- **Reuse Existing App Design**: Uses the project's native green and mint color palette (`#1C7057`, `#1B3A33`, `#F7FAF8`), clean message bubbles, and typography.
- **Message Bubbles & Chat Interface**: Left-aligned bubbles for the assistant, right-aligned brand green bubbles for the student, with timestamps and sender labels.
- **Welcome Message & Quick-Reply Chips**: Initial greeting with one-tap quick-replies (e.g. "🔍 How to search?", "🏷️ How to sell?", "🤝 Rent or Borrow?", "📦 Browse Categories", "🔒 Campus Rules & Safety").
- **Uses Existing Marketplace Data**: Dynamically references `categories` and `seedListings` from `src/data.ts`.
- **Preserves Seller Messaging**: The existing peer-to-peer seller conversation system (`MessagesPage.tsx`) remains completely untouched.

## File Structure

- `types.ts`: TypeScript contracts for `ChatMessage` and `QuickReplyOption`.
- `knowledgeBase.ts`: Rule-based intent matcher, FAQ knowledge base, and responses.
- `components/SupportChatScreen.tsx`: Full interactive chat screen with message history, typing animation, chips, and text input.
- `components/SupportChatModal.tsx`: Slide-up modal container for the chat screen.
- `components/SupportChatButton.tsx`: Floating action button to launch the support chat from any view.
- `index.ts`: Barrel export.
