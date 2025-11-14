[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/EETRpb8U)
# HW4: Pokedex

> In this homework, you will use **React** and **Vite** to build a Pokedex application.

A Pokedex is a handheld device that displays information about Pokémon and tracks which ones you've caught. You'll be building a **web-based Pokedex** using the API we've provided.

This homework is **open-ended**, so feel free to get creative with the design and features while meeting the core requirements below.

**API Documentation:** See [API.md](./API.md) for complete endpoint details and response types.

**Important:** Box management endpoints require authentication via Bearer token. You'll need to obtain a JWT token from your instructor to access these features. This will be the **same JWT token** you used in HW2, so please copy and reuse your token from that homework's API! 

## Terminology

- **Pokedex**: A device for viewing Pokémon information and tracking catches
- **Pokémon**: A creature that can be caught and stored in your Pokedex
- **Box**: A storage container for caught Pokémon entries

## Requirements

- [ ] Create a new React project using Vite with TypeScript
- [ ] Fetch Pokémon data from the provided API
- [ ] Display Pokémon data in a **paginated** list
- [ ] Allow users to mark a Pokémon as caught and add it to their Box
- [ ] Display a user's caught Pokémon in a Box view
- [ ] Show detailed information for individual Pokémon
- [ ] Enable users to delete Box entries
- [ ] Enable users to edit Box entries

## Recommended Steps

### Step 1: Set up the project

Create a new React project using Vite with TypeScript:

```bash
npm create vite@latest pokedex --template react-ts
```

Install any necessary dependencies (we've included a package.json with linting and prettier configs) and organize your project structure appropriately.

**Recommended Project Structure:**

```
pokedex/
├── src/
│   ├── components/
│   │   ├── PokemonList.tsx
│   │   ├── PokemonCard.tsx
│   │   ├── PokemonDetails.tsx
│   │   ├── BoxList.tsx
│   │   ├── BoxCard.tsx
│   │   ├── BoxForm.tsx
│   │   └── Modal.tsx
│   ├── api/
│   │   └── PokemonAPI.ts
│   ├── types/
│   │   └── types.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── package.json
└── tsconfig.json
```

This structure keeps your code organized and makes it easy to find and modify specific features.

### Step 2: Define TypeScript types and build the basic interface

**TypeScript Types:**

First, create type definitions based on the API documentation. Create a `types.ts` file with interfaces that match the API responses:

```typescript
// From API.md - Pokemon types
export interface PokemonType {
  name: string;
  color: string;
}

export interface PokemonMove {
  name: string;
  power?: number;
  type: PokemonType;
}

export interface Pokemon {
  id: number;
  name: string;
  description: string;
  types: PokemonType[];
  moves: PokemonMove[];
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
  };
  stats: {
    hp: number;
    speed: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
  };
}

// Box entry types
export interface BoxEntry {
  id: string;
  createdAt: string;
  level: number;
  location: string;
  notes?: string;
  pokemonId: number;
}

export interface InsertBoxEntry {
  createdAt: string;
  level: number;
  location: string;
  notes?: string;
  pokemonId: number;
}

export interface UpdateBoxEntry {
  createdAt?: string;
  level?: number;
  location?: string;
  notes?: string;
  pokemonId?: number;
}
```

**Component Structure:**

Create the foundational UI components for your Pokedex:

- `PokemonList` — displays the paginated list of Pokémon with pagination controls
- `PokemonCard` — shows individual Pokémon (image, name, types) in the list
- `PokemonDetails` — displays detailed Pokémon information in a modal
- `BoxList` — displays the user's caught Pokémon
- `BoxCard` — shows a Box entry with edit/delete buttons
- `BoxForm` — form for creating/editing Box entries
- `Modal` — reusable modal component for forms and details

**Component Props:**

Define clear prop interfaces for each component:

```typescript
interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

interface BoxCardProps {
  entry: BoxEntry;
  pokemon: Pokemon;
  onEdit: (entry: BoxEntry) => void;
  onDelete: (id: string) => void;
}
```

When defining prop and state types for each component, reference the response types provided in `API.md`.

### Step 3: Create an API service class

Create an API service class (e.g., `PokemonAPI`) to encapsulate all API requests. This class should:

**Configuration:**
- Use base URL: `https://cis1962-hw4-server.esinx.net/api/`
- Store and manage the JWT authentication token (provided by your instructor)
- Handle adding the `Authorization: Bearer {token}` header for Box endpoints
- Implement error handling for failed requests

**API Endpoints to Support:**

Refer to [API.md](./API.md) for complete details on all endpoints. Your class should support:

**Pokémon Endpoints** (no authentication required):
- `GET /pokemon/` - List Pokémon with pagination (requires `limit` and `offset` query params)
- `GET /pokemon/:name` - Get details for a specific Pokémon by name

**Box Endpoints** (authentication required):
- `GET /box/` - List all Box entry IDs for the authenticated user
- `POST /box/` - Create a new Box entry
- `GET /box/:id` - Get a specific Box entry
- `PUT /box/:id` - Update a Box entry
- `DELETE /box/:id` - Delete a Box entry

Design your API class methods however you prefer, ensuring they properly call these endpoints and handle responses/errors.

**Pagination Tips:** 
- Listing endpoints require `limit` and `offset` parameters
- We recommend a page size of `10`, though you're free to choose differently
- Calculate offset as `pageNumber * pageSize` to fetch the correct page

### Step 4: Integrate the API with components

With your basic interface and API class ready, connect them together. 

**State Management:**
Create state variables in your components to track:
- `pokemon: Pokemon[]` — the current page of Pokémon
- `loading: boolean` — whether data is being fetched
- `error: string | null` — any error messages
- `currentPage: number` — the current pagination page

**Data Fetching Flow:**
1. When the component mounts, call the `GET /pokemon/` endpoint with appropriate `limit` and `offset`
2. Set `loading` to `true` before the request
3. On success, update the `pokemon` state and set `loading` to `false`
4. On error, store the error message and set `loading` to `false`
5. Display loading spinners, error messages, or the Pokémon list based on state

**Pagination Controls:**
- Add "Previous" and "Next" buttons to navigate between pages
- Disable "Previous" when on the first page
- Update the `currentPage` state when buttons are clicked
- Fetch new data whenever `currentPage` changes (use `useEffect`)

**Pokémon Details:**
- When a user clicks on a `PokemonCard`, fetch details via `GET /pokemon/:name`
- Display the detailed information in a modal
- The API response includes:
  - Stats (HP, Attack, Defense, Special Attack, Special Defense, Speed)
  - Sprites (front_default, back_default, front_shiny, back_shiny)
  - Types with colors (useful for styling!)
  - Moves with power and type information

**Note:** You **may not** use third-party libraries for state management or data fetching (like React Query, SWR, Redux, etc.). Use React's built-in `useState` and `useEffect` hooks.

By the end of this step, you should have a working Pokedex that displays a paginated list of Pokémon and shows detailed information in a modal when a Pokémon is clicked.

### Step 5: Implement Box functionality

With the basic Pokedex working, add the ability to catch and store Pokémon.

**Box Entry Structure:**
Each Box entry must contain:
- `pokemonId: number` — The Pokémon's ID
- `location: string` — Where it was caught (e.g., "Route 1", "Viridian Forest")
- `createdAt: string` — Catch date and time in ISO 8601 format (e.g., "2024-01-15T10:30:00Z")
- `level: number` — The level at which it was caught (1-100)
- `notes?: string` — Optional notes about the catch

**Implementation Steps:**

1. **Add a catch button:**
   - Add an "Add to Box" or "Catch" button to the `PokemonDetails` modal
   - When clicked, open a new modal or form overlay

2. **Create a Box entry form:**
   - Create form inputs for each required field
   - Use controlled components (inputs tied to state variables)
   - Add validation:
     - Location: non-empty string
     - Level: number between 1 and 100
     - Date: valid ISO 8601 string (use `new Date().toISOString()` for current time)
   - Notes field is optional

3. **Handle form submission:**
   - Construct an `InsertBoxEntry` object with the form data
   - Send a `POST` request to `/box/` with the entry data in the request body
   - Include the authentication token in the `Authorization` header
   - On success, close the modal and refresh the Box list
   - Handle any errors appropriately

4. **Error handling:**
   - Handle authentication errors (401) — invalid or missing token
   - Handle validation errors (400) — invalid input data
   - Display error messages to users in a user-friendly way

### Step 6: Implement Box list view

Create a view for users to see their caught Pokémon.

**View Switching:**
- Add a toggle or tab navigation to switch between "All Pokémon" and "My Box" views
- Keep these views separate (don't unmount them unnecessarily to preserve scroll position)
- Consider using state like `view: 'pokemon' | 'box'` to control which view is shown

**Fetching Box Data:**

The Box API works differently from the Pokémon list:
1. First, call `GET /box/` to get an array of Box entry IDs
2. Then, for each ID, call `GET /box/:id` to get the complete entry
3. For each entry, you'll need to fetch the corresponding Pokémon data

**Important Challenge:** Box entries only store `pokemonId` (a number), but `GET /pokemon/:name` requires a name (string). To solve this:
- **Option A:** When initially loading Pokémon, create a Map of `id -> name` that you can reference later
- **Option B:** Extend your Box entry state to also store the Pokemon name when creating entries
- **Option C:** Fetch all Pokemon first and create a lookup function that finds by ID

We recommend Option A: maintain a Pokemon ID-to-name mapping at the app level. Fetch a large batch of Pokemon on app load, build a Map, then use it to look up names when displaying Box entries.

**Box Card Component:**

Create a `BoxCard` component that displays:
- The Pokémon's name and sprite (fetch from Pokemon data)
- Catch location
- Catch date (format the ISO string to be readable)
- Level
- Notes (if present)
- Action buttons:
  - **Edit** — opens a modal with pre-filled form to update the entry
  - **Delete** — confirms and deletes the entry

**Edit Functionality:**
1. When "Edit" is clicked, open a modal with the form pre-populated with current values
2. Allow users to modify location, level, and notes
3. On submit, send a `PUT` request to `/box/:id` with the updated fields
4. Refresh the Box list after successful update

**Delete Functionality:**
1. When "Delete" is clicked, show a confirmation dialog
2. On confirmation, send a `DELETE` request to `/box/:id`
3. Remove the entry from state or refetch the entire list

**Auto-refresh:**
After creating, updating, or deleting an entry, refresh the Box list by re-fetching the data from the API.

### Step 7: Polish and test your application

Before submitting, ensure your application is complete and polished.

**Error Handling:**
- Test what happens when the API is unreachable
- Handle all error codes appropriately:
  - `401 UNAUTHORIZED` — Show message about invalid/missing authentication token
  - `404 NOT_FOUND` — Handle when a Pokémon or Box entry doesn't exist
  - `400 BAD_REQUEST` — Display validation errors to users
  - `500 INTERNAL_SERVER_ERROR` — Show a generic error message

**Loading States:**
- Show loading spinners or skeletons while fetching data
- Disable buttons during API calls to prevent duplicate requests
- Consider optimistic updates for better UX (update UI before API response)

**Styling and UX:**
- Make your application visually appealing
- Use the `color` property from Pokemon types to add themed styling
- Display Pokemon sprites prominently
- Ensure forms are user-friendly with clear labels and validation messages
- Add hover effects and transitions
- Make it responsive for different screen sizes

**Edge Cases to Test:**
- Empty states (no Box entries)
- First/last page of pagination
- Creating multiple Box entries for the same Pokémon
- Editing entries with optional fields (notes)
- Very long notes or location names
- Form validation (negative levels, empty required fields)

**TypeScript:**
- Ensure all types are properly defined
- No `any` types without good reason
- Use the types from `API.md` as interfaces in your code

## Submission Checklist

Before submitting, verify that your application:

- ✅ Displays a paginated list of Pokémon
- ✅ Shows detailed Pokémon information when clicked
- ✅ Allows users to add Pokémon to their Box with all required fields
- ✅ Displays a separate view for Box entries
- ✅ Allows editing Box entries
- ✅ Allows deleting Box entries
- ✅ Has proper error handling and loading states
- ✅ Uses TypeScript with proper types
- ✅ Has a clean, intuitive UI
- ✅ Works without third-party state management/data fetching libraries

## Tips and Common Pitfalls

**API Tips:**
- The Box API returns IDs first, then you fetch individual entries — this is intentional for flexibility
- Remember to include the `Bearer` prefix in your Authorization header
- Use `Promise.all()` to fetch multiple Box entries efficiently
- Store your JWT token securely (not in version control!)

**React Tips:**
- Use `useEffect` with proper dependencies to avoid infinite loops
- Clean up event listeners and abort controllers in `useEffect` cleanup functions
- Consider creating custom hooks for reusable logic (e.g., `usePokemon`, `useBoxEntries`)
- Lift state up when multiple components need access to the same data