## **AI Prompts Used**

**1st Prompt**\
Ok write me a prompt for cursor for the frontend intern assignment i mentioned above. i already have basic nextjs app set up. explain the UI should look like trello with plucking animations on removing from a board and adding to a board like in trello. use react query for managing state from APIs. and use zustand for frontend state management if required anywhere. but for react query use the above hooks and apis implemention i mentioned with query keys as constants in src/lib/constants.ts and the API client pattern for centralised error handling and stuff\
use micro component architecture. use react query for handling queries and state. use shadcn for component that can be used but use the shadcn command pnpm dlx shadcn@latest add <component-name> for adding components. also use pnpm as package manager. do incremental commits. forget the AI_PROMPTS.md ill fill that later. for the variant my name starts with v. keep the prompt detailed but no extra unnecessary information and give the prompt to me as text not markdown.

**Explanation:** This was the initial setup prompt for Cursor to define the assignment. It laid out architecture choices, state management, API integration pattern, and coding standards to ensure a professional and scalable setup.

---

**2nd Prompt**\
I need you to help me build a frontend intern assignment - a Sprint Board application that looks and feels like Trello.\
EXISTING SETUP: I already have a basic Next.js 15 app with TypeScript and Tailwind set up.

PROJECT REQUIREMENTS:\
Build a Sprint Board Lite with 3 columns: Todo | In Progress | Done. The UI should look like Trello with smooth plucking animations when removing cards from boards and adding to boards, just like Trello's drag and drop experience.

TECH STACK TO USE:

- React Query for API state management

- Zustand for frontend state management (only if needed)

- Tailwind for styling

- Framer Motion for animations

- shadcn/ui components (use: pnpm dlx shadcn@latest add <component-name>)

- pnpm as package manager

- Micro component architecture

ARCHITECTURE PATTERNS:

- API Layer: src/api/ - Pure API functions using API client pattern

- React Query Hooks: src/hooks/api/ - Custom hooks that call API functions

- Query Keys: src/lib/constants.ts - All query keys as constants

- API Client: Centralized error handling, auth headers, base URL configuration

- Micro components: Break down UI into small, reusable components

FEATURES TO IMPLEMENT:

- Authentication with mocked login/logout

- Guarded routes

- Task CRUD with optimistic updates and simulated API failures

- Trello-like drag and drop with animations

- Filters, search, responsive design, dark mode, loading/error states

VARIANT IMPLEMENTATION:\
Since my name starts with "v", implement Offline Queue variant with queued writes when offline, replay when back online, and visual badges for queued cards.

MOCK API SETUP:\
Use json-server with GET/POST/PATCH/DELETE endpoints and middleware to simulate 10% failure on write requests.

DEVELOPMENT APPROACH:\
Incremental commits, TypeScript typing, proper error boundaries, loading/error states.

ANIMATION REQUIREMENTS:\
Smooth dragging, plucking, insertion, micro-interactions, and dark mode transitions.

**Explanation:** This was the detailed master prompt defining the entire assignment. It described architecture, features, mock API setup, variant implementation, and UI polish expectations. This acted as the main project roadmap.

---

**3rd Prompt**\
dont create a server.js file, we are using json-server. just create a middleware in nextjs app only that has a 10% probability of failing the request. everytime a req is made get a random number and if less than or equal to 0.1 throw error, we dont need a server.js running seaparetly. only backend system will be the json-server library

**Explanation:** This clarified the API failure simulation approach. Instead of a separate server.js, failures are handled via middleware inside the Next.js app, keeping the setup simple.

---

**4th Prompt**\
fix the drag and drop, if its selected but then is dropped in the same column or dropped outside the other columns revert the dropping dont just delete it. 2nd after its dropped theres a movement where it sort of goes back to its original position and then ig when the api state gets updated it moves to the correct column again, i believe thats because of an issue with the optimistic update. 3rd add toasts when rolling back.

**Explanation:** This fixed UX bugs in drag-and-drop. It ensured tasks don't disappear on invalid drops, solved the double-movement issue caused by optimistic updates, and added user feedback with toasts on rollbacks.

---

**5th Prompt**\
firstly allow changing of position amongst each other of the cards by dragging and dropping and secondly don't duplicate the cards both while dragging and while dropping. so when i pick the card the card just disappears from its current list and just exists in my the overlay. obviously if i drop it nowehere then revert and add it back. similarly when i drop it the card gets added at the position its dropped at. and also make the cards editable.

**Explanation:** This expanded drag-and-drop functionality. It allowed card reordering within columns, prevented duplication during drag, handled overlay rendering correctly, and added the ability to edit cards.

---

**6th Prompt**\
there should be a queued icon on the card also if its a queued card and we are offline. also keep a queued tasks list in local storage to persist over refreshes.

**Explanation:** This completed the Offline Queue variant. It added UI indicators for queued tasks, and ensured persistence of queued operations across refreshes using localStorage.
