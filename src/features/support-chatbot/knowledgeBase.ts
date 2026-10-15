import { categories, seedListings } from "../../data";
import { ChatMessage, QuickReplyOption } from "./types";

export const INITIAL_QUICK_REPLIES: QuickReplyOption[] = [
  { id: "1", label: "🔍 How to search?", query: "How to search products" },
  { id: "2", label: "🏷️ How to sell?", query: "How do I sell an item?" },
  { id: "3", label: "🤝 Rent or Borrow?", query: "How does Rent/Borrow work?" },
  { id: "4", label: "📦 Browse Categories", query: "Show available categories" },
  { id: "5", label: "🔒 Campus Rules & Safety", query: "What are the marketplace rules?" },
];

export const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome-1",
  sender: "bot",
  text: "Hello! 👋 Welcome to Campus Marketplace Support. I'm here to help you navigate, search for items, sell your goods, or answer questions about campus trading. How can I help you today?",
  timestamp: Date.now(),
  quickReplies: [
    "🔍 How to search?",
    "🏷️ How to sell?",
    "🤝 Rent or Borrow?",
    "📦 Browse Categories",
    "🔒 Campus Rules & Safety",
  ],
};

interface FAQRule {
  keywords: string[];
  response: string | (() => string);
  quickReplies?: string[];
}

const FAQ_RULES: FAQRule[] = [
  {
    keywords: ["search", "find", "looking for", "browse", "filter"],
    response:
      "🔍 **Searching & Browsing**:\n\n• On the **Explore** page, use the top search bar to type keywords (e.g., 'textbook', 'desk', 'headphones').\n• You can tap category chips at the top to filter items instantly.\n• All searches are performed in real-time right on your device for instant results!",
    quickReplies: ["📦 Browse Categories", "🏷️ How to sell?", "♡ How to save items?"],
  },
  {
    keywords: ["sell", "listing", "publish", "post", "create item", "upload"],
    response:
      "🏷️ **Selling an Item**:\n\n1. Tap the green **＋ Sell** button at the bottom of the screen.\n2. Enter the item's Title, Price ($), Category, Condition, and Description.\n3. Make sure you are signed in with your university Google account so students can contact you.\n4. Tap 'Publish listing' and your item will appear in the Explore feed immediately!",
    quickReplies: ["🔍 How to search?", "My listings", "Edit listing"],
  },
  {
    keywords: ["rent", "borrow", "lend", "lending", "loan"],
    response:
      "🤝 **Rent or Borrow Feature**:\n\n• When viewing any listing, tap the **Rent or Borrow** button.\n• Choose whether you need to **Borrow** (free temporary loan) or **Rent** (temporary paid use).\n• Enter the duration (e.g., '3 days', 'exam week') and send a request to the seller.\n• Once the seller accepts, the item is marked as rented and removed from the active feed until returned!",
    quickReplies: ["🔍 How to search?", "🏷️ How to sell?", "Contact Seller"],
  },
  {
    keywords: ["category", "categories", "types of items", "what can i buy"],
    response: () => {
      const catList = categories
        .filter((c) => c !== "All items")
        .map((c) => `• **${c}**`)
        .join("\n");
      return `📦 **Currently Available Categories**:\n\n${catList}\n\nWe have items available across multiple campus dorms and departments!`;
    },
    quickReplies: ["🔍 How to search?", "🏷️ How to sell?"],
  },
  {
    keywords: ["save", "favorite", "bookmark", "wishlist"],
    response:
      "♡ **Saving Items**:\n\n• Tap the heart icon (♡) on any listing card to save it for later.\n• View all your saved finds anytime under the **Saved** tab in the bottom navigation bar.",
    quickReplies: ["🔍 How to search?", "📦 Browse Categories"],
  },
  {
    keywords: ["login", "sign in", "google", "account", "auth", "profile"],
    response:
      "🔐 **Account & Google Sign-In**:\n\n• You can freely browse and search items without signing in.\n• To contact sellers, send rent requests, or publish items, sign in using your Google account on the Profile page.\n• Your profile is automatically created upon your first login.",
    quickReplies: ["🔒 Campus Rules & Safety", "🏷️ How to sell?"],
  },
  {
    keywords: ["safety", "rules", "rule", "scam", "policy", "legit", "campus"],
    response:
      "🔒 **Campus Marketplace Rules & Safety**:\n\n1. **Students Only**: Designed for verified campus community members.\n2. **In-Person Meetups**: Always meet at safe, public campus locations (e.g., student union, library, daylight spots).\n3. **Inspect Before Paying**: Examine items in person before completing trades or rentals.\n4. **Respect**: Be prompt when borrowing and return items on time in good condition.",
    quickReplies: ["🤝 Rent or Borrow?", "Human agent / support"],
  },
  {
    keywords: ["contact", "agent", "human", "support", "help", "email", "phone", "admin"],
    response:
      "👤 **Contact Support**:\n\nNeed extra help or have an issue with a transaction?\n• **Campus Support Desk**: Available Mon–Fri, 9:00 AM – 5:00 PM\n• **Email**: support@campusmarketplace.edu\n• **Office**: Student Activities Center, Room 204\n\nYou can also browse our quick guides below!",
    quickReplies: ["🔍 How to search?", "🏷️ How to sell?", "🔒 Campus Rules & Safety"],
  },
];

/**
 * Intelligent deterministic response generator based on user input.
 * Matches keywords and intents without requiring external AI APIs.
 */
export function getBotResponse(userMessage: string): ChatMessage {
  const query = userMessage.toLowerCase().trim();

  // Find matching FAQ rule
  for (const rule of FAQ_RULES) {
    const matched = rule.keywords.some((kw) => query.includes(kw));
    if (matched) {
      const responseText =
        typeof rule.response === "function"
          ? (rule.response as unknown as () => string)()
          : rule.response;

      return {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: responseText,
        timestamp: Date.now(),
        quickReplies: rule.quickReplies || ["🔍 How to search?", "🏷️ How to sell?"],
      };
    }
  }

  // Fallback response with helpful hints
  return {
    id: "bot-" + Date.now(),
    sender: "bot",
    text: `I'm not sure I understood "${userMessage}", but I can help you with:\n\n• 🔍 Searching & browsing items\n• 🏷️ Listing & selling your items\n• 🤝 Renting or borrowing gear\n• 🔒 Campus trading safety & guidelines\n\nPlease select one of the quick options below:`,
    timestamp: Date.now(),
    quickReplies: [
      "🔍 How to search?",
      "🏷️ How to sell?",
      "🤝 Rent or Borrow?",
      "📦 Browse Categories",
      "👤 Contact Support",
    ],
  };
}
