# TypeScript & React Concepts - Study Notes

## Table of Contents

1. [TypeScript Interfaces](#typescript-interfaces)
2. [Component Props](#component-props)
3. [Optional Chaining (?.)](#optional-chaining-)
4. [Function Passing in React](#function-passing-in-react)
5. [Sprites and Images](#sprites-and-images)

---

## TypeScript Interfaces

### What Are Interfaces?

Interfaces define the **shape/structure** of objects. They specify what properties an object should have and their types, providing type safety and autocompletion.

### Basic Usage

```typescript
// Define the interface
interface Pokemon {
    id: number;
    name: string;
    types: PokemonType[];
}

// Use it to type variables
const pikachu: Pokemon = {
    id: 25,
    name: "Pikachu",
    types: [{ name: "electric", color: "#F7D02C" }]
};

// Use it in function parameters
function displayPokemon(pokemon: Pokemon) {
    console.log(pokemon.name);
}
```

### Benefits

- **Type Safety**: TypeScript errors if you access invalid properties
- **Autocomplete**: Editor suggests available properties
- **Refactoring**: Changes propagate automatically
- **Documentation**: Self-documenting code

---

## Component Props

### Two Types of Interfaces

#### 1. Data Structure Interfaces (types.ts)

Defines **what the data IS**:

```typescript
interface Pokemon {
    id: number;
    name: string;
    sprites: { front_default: string; };
    // ... describes the pokemon data structure
}
```

#### 2. Component Props Interfaces (Component.tsx)

Defines **what the component NEEDS**:

```typescript
interface PokemonCardProps {
    pokemon: Pokemon;           // The data
    onClick?: (p: Pokemon) => void;  // The behavior
}
```

### Why Separate?

A component might need:

- Multiple pieces of data
- Callback functions (like `onClick`)
- Configuration options
- Other non-data inputs

### Example: Why onClick in Props?

Makes components **reusable** with different behaviors:

```typescript
// Scenario 1: Click opens a modal
<PokemonCard 
    pokemon={pikachu} 
    onClick={(p) => openModal(p)} 
/>

// Scenario 2: Click navigates
<PokemonCard 
    pokemon={charizard} 
    onClick={(p) => navigate(`/pokemon/${p.id}`)} 
/>

// Scenario 3: No click behavior
<PokemonCard pokemon={squirtle} />
```

The `?` makes it **optional** - component works with or without it.

---

## Determining Props from API

### Decision Process

1. **Look at API endpoint** → What data does it return?
2. **What does component display?** → All these in the interface?
3. **What can users do?** → Need callback functions?
4. **Does component trigger API calls?** → Need action callbacks?

### Example: PokemonList Component

**API**: `GET /pokemon/` returns `Pokemon[]`

**Props Needed**:

```typescript
interface PokemonListProps {
    pokemons: Pokemon[];  // Data from API
    onPokemonClick?: (pokemon: Pokemon) => void;  // User interaction
    isLoading?: boolean;  // Loading state
}
```

### Example: BoxCard Component

**API**: `GET /box/:id` returns `BoxEntry`
**Also needs**: Full Pokemon data (API only returns `pokemonId`)

**Props Needed**:

```typescript
interface BoxCardProps {
    entry: BoxEntry;     // From GET /box/:id
    pokemon: Pokemon;    // Fetched separately using pokemonId
    onEdit: (id: string) => void;    // PUT /box/:id
    onDelete: (id: string) => void;  // DELETE /box/:id
}
```

---

## Props Destructuring

### Two Equivalent Ways

```typescript
// Option 1: Destructuring (common in React)
function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
    return <h1>{pokemon.name}</h1>;
}

// Option 2: Using props object directly
function PokemonCard(props: PokemonCardProps) {
    return <h1>{props.pokemon.name}</h1>;
}
```

**Destructuring extracts properties:**

```typescript
// What React passes:
const props = { 
    pokemon: pikachu, 
    onClick: handleClick 
}

// Destructuring pulls them out:
const { pokemon, onClick } = props;
```

Destructuring is preferred - cleaner code!

---

## Optional Chaining (?.)

### What It Does

Safely accesses properties or calls functions that **might not exist** (undefined or null).

```typescript
// Without ?. - crashes if undefined
onPokemonClick(pokemon);  // ❌ Error if undefined

// With ?. - safe
onPokemonClick?.(pokemon);  // ✅ Only calls if exists
```

### How It Works

```typescript
interface PokemonListProps {
    onPokemonClick?: (pokemon: Pokemon) => void;  // Optional
    //             ^
}

// Using it:
onPokemonClick?.(pokemon)
//            ^^^
//            Only call if it exists
```

### Execution Flow

**When provided:**

```typescript
<PokemonList 
    onPokemonClick={(p) => console.log(p.name)}  // Provided
/>

// Click triggers:
onPokemonClick?.(pokemon)
// ↓ Function exists, so calls it
console.log(pokemon.name)  // "pikachu"
```

**When NOT provided:**

```typescript
<PokemonList pokemonList={pokemons} />  // Not provided

// Click triggers:
onPokemonClick?.(pokemon)
// ↓ Function is undefined, does nothing
// No error, no crash
```

### Syntax Breakdown

```typescript
onPokemonClick?.(pokemon)
//            │└─ Call with pokemon argument
//            └── But only if exists

// It's TWO operators:
// 1. ?.  - Optional chaining
// 2. (pokemon) - Function call
```

### Equivalent Without ?

```typescript
// Using ?. (clean)
onClick={() => onPokemonClick?.(pokemon)}

// Without ?. (verbose)
onClick={() => {
    if (onPokemonClick !== undefined && onPokemonClick !== null) {
        onPokemonClick(pokemon);
    }
}}
```

### Other Uses

```typescript
// Property access
const city = user?.address?.city;

// Method calls
pokemon?.moves?.[0]?.name;

// Array indexing
const firstMove = pokemon.moves?.[0];
```

---

## Function Passing in React

### Function Signatures in Interfaces

Interfaces define the **function signature** - inputs and outputs:

```typescript
interface PokemonCardProps {
    onClick?: (pokemon: Pokemon) => void;
    //        ^^^^^^^^^^^^^^^^^^^  ^^^^
    //        Input parameters     Return type
}
```

This is a **contract**: any function passed must match this signature.

### Examples

```typescript
// ✅ Valid - matches signature
const handleClick = (pokemon: Pokemon) => {
    console.log(pokemon.name);
};

// ❌ Invalid - wrong parameter type
const handleClick = (id: number) => {
    console.log(id);
};

// ❌ Invalid - returns something
const handleClick = (pokemon: Pokemon): string => {
    return pokemon.name;
};
```

### Why Arrow Function Wrappers?

**Direct pass vs. Wrapped:**

```typescript
// Version 1: Direct pass
onClick={onPokemonClick}

// Version 2: Arrow wrapper
onClick={() => onPokemonClick?.(pokemon)}
```

**Problem with direct pass:** The function doesn't receive the arguments you want.

```typescript
// PokemonCard calls onClick with no arguments
<div onClick={onClick}>  // Called as: onClick()

// But you need to pass pokemon:
onPokemonClick(pokemon)  // Needs pokemon argument
```

**Solution:** Arrow function wrapper captures the pokemon:

```typescript
<PokemonCard 
    onClick={() => onPokemonClick?.(pokemon)} 
/>
//      ^^^ Creates new function  ^^^^^^^ Passes pokemon
```

### When Arrow Wrapper Is NOT Needed

If the child component passes the argument itself:

```typescript
// PokemonCard.tsx - passes pokemon itself
export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
    return (
        <div onClick={() => onClick?.(pokemon)}>
        //            ^^^^^^^^^^^^^^^^^^^^^^^^^ Child handles passing pokemon
            {/* ... */}
        </div>
    );
}

// Then in PokemonList you can simplify:
<PokemonCard onClick={onPokemonClick} />
//                    ^^^^^^^^^^^^^^^ No wrapper needed!
```

### Important: HTML onClick vs Custom onClick

```typescript
// ❌ This calls the function immediately:
<div onClick={onClick?.(pokemon)}>

// ✅ This passes a function to be called later:
<div onClick={() => onClick?.(pokemon)}>
```

HTML `onClick` expects a **function reference**, not the result of calling a function.

---

## Sprites and Images

### What Are Sprites?

Not a dictionary - an **object with specific string properties**, each holding a **URL**:

```typescript
sprites: {
    front_default: string;   // URL to front image
    back_default: string;    // URL to back image
    front_shiny: string;     // URL to shiny front
    back_shiny: string;      // URL to shiny back
}
```

### Example Data

```typescript
{
    id: 25,
    name: "pikachu",
    sprites: {
        front_default: "https://raw.githubusercontent.com/.../pikachu.png",
        back_default: "https://raw.githubusercontent.com/.../pikachu-back.png",
        front_shiny: "https://raw.githubusercontent.com/.../pikachu-shiny.png",
        back_shiny: "https://raw.githubusercontent.com/.../pikachu-back-shiny.png"
    }
}
```

Each property value is a **URL string** pointing to an image.

### Using with `<img>` Tag

```typescript
// Access ONE property (which is a string URL)
<img src={pokemon.sprites.front_default} alt={pokemon.name} />

// Becomes:
<img src="https://raw.githubusercontent.com/.../pikachu.png" alt="pikachu" />
```

### Step-by-Step

```typescript
// 1. Access the string URL
pokemon.sprites.front_default  // → "https://example.com/pikachu.png"

// 2. Pass to img src
<img src={pokemon.sprites.front_default} />

// 3. Browser fetches and displays the image from that URL
```

### Multiple Sprites Example

```typescript
// Toggle between normal and shiny
const [isShiny, setIsShiny] = useState(false);

<img src={isShiny 
    ? pokemon.sprites.front_shiny 
    : pokemon.sprites.front_default
} />
```

---

## Component Organization: List vs. Direct Mapping

### Option 1: No Separate List Component

```typescript
// App.tsx
function App() {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    
    return (
        <div className="pokemon-grid">
            {pokemons.map((pokemon) => (
                <PokemonCard 
                    key={pokemon.id}
                    pokemon={pokemon}
                    onClick={handleClick}
                />
            ))}
        </div>
    );
}
```

### Option 2: With Separate List Component

```typescript
// App.tsx
function App() {
    return <PokemonList pokemons={pokemons} onPokemonClick={handleClick} />;
}

// PokemonList.tsx
export function PokemonList({ pokemons, onPokemonClick }: PokemonListProps) {
    return (
        <div className="pokemon-grid">
            {pokemons.map((pokemon) => (
                <PokemonCard 
                    key={pokemon.id}
                    pokemon={pokemon}
                    onClick={onPokemonClick}
                />
            ))}
        </div>
    );
}
```

### When to Use Each

**Option 1 (Direct)**: Simple apps, single use case

**Option 2 (Separate List)**:

- Better organization
- Reusable across multiple pages
- List-specific logic (filtering, sorting, empty states)
- Cleaner App.tsx

Both are valid! Choose based on app complexity.

---

## Key Takeaways

1. **Interfaces define contracts** - data structures AND component props
2. **Props = data + callbacks** - determined by API and component needs
3. **Optional chaining (?.)** - safe function/property access
4. **Arrow wrappers** - needed when you want to pass specific arguments
5. **Sprites are URLs** - strings pointing to images, not the images themselves
6. **Component organization** - balance simplicity with reusability

---

## Common Patterns

### Pattern: Component Props from API

```
API Endpoint → Data Type → Component Props
GET /pokemon/:name → Pokemon → { pokemon: Pokemon, onClick?: ... }
GET /box/ → BoxEntry[] → { entries: BoxEntry[], onDelete?: ... }
```

### Pattern: Function Signatures

```typescript
// No parameters, no return
onClose?: () => void;

// Takes data, no return
onClick?: (pokemon: Pokemon) => void;

// Takes data, returns boolean
isSelected?: (pokemon: Pokemon) => boolean;

// Async operation
onSave?: (entry: BoxEntry) => Promise<void>;
```

### Pattern: Optional Chaining

```typescript
// Function calls
onClick?.(pokemon)

// Property access
user?.profile?.avatar

// Array access
items?.[0]?.name
```

---

## Class Syntax: No const/let/function Keywords

### Why Classes Don't Need Declaration Keywords

In TypeScript/JavaScript, **classes have their own syntax** that's different from regular statements.

#### Outside a Class = "Statement Land"

You need declaration keywords because there's no context:

```typescript
// Every line needs to declare what it is
const x = 5;              // "This is a constant"
let y = 10;               // "This is a variable"
var z = 15;               // "This is an old-style variable"
function doThing() {}     // "This is a function"
type MyType = string;     // "This is a type"
```

Without the keyword, JavaScript doesn't know what you're declaring!

#### Inside a Class = "Class Member Land"

The **class context itself** tells JavaScript what things are:

```typescript
class MyClass {
    // No keywords needed - the class context provides the meaning
    x = 5;              // Property (context: we're in a class)
    y = 10;             // Property
    
    doThing() {}        // Method (the parentheses indicate it's a function)
    otherMethod() {}    // Method
    
    static z = 20;      // Static property
    static staticMethod() {}  // Static method
}
```

### Analogy: Sentences vs. Forms

**Statements = Complete Sentences**

```typescript
const name = "John";        // Full sentence with grammar
```

**Class Members = Form Fields**

```typescript
class Person {
    name = "John";          // Just fill the field - form provides context
}
```

On a form, you don't write "The name is John" - you just write "John" in the name field.

### Comparison

```typescript
// OUTSIDE class - needs keywords
const BASE_URL = 'https://...';
let authToken = null;
function listPokemon() {}

// INSIDE class - no keywords needed
class PokemonAPI {
    static readonly BASE_URL = 'https://...';  // ✅ No const
    static authToken = null;                   // ✅ No let
    static listPokemon() {}                    // ✅ No function keyword
}

// Inside function - back to "statement land"
function myFunction() {
    const x = 1;    // Need const again!
    let y = 2;
}
```

### Class Properties Are Mutable by Default

```typescript
class PokemonAPI {
    static authToken = null;  // Can be modified
}

// Modify it:
PokemonAPI.authToken = 'new-token';  // ✅ Works!
PokemonAPI.authToken = 'another-token';  // ✅ Still works!
```

### Making Properties Immutable

Use `readonly` to prevent modification:

```typescript
class PokemonAPI {
    static readonly BASE_URL = 'https://...';  // Cannot be changed
    static authToken = null;                   // Can be changed
}

// This works:
PokemonAPI.authToken = 'token123';  // ✅

// This errors:
PokemonAPI.BASE_URL = 'https://other.com';  // ❌ readonly property
```

### Access Modifiers

```typescript
class PokemonAPI {
    // Public - accessible from anywhere (default)
    static authToken = null;
    
    // Private - only accessible inside the class
    private static cache = new Map();
    
    // Readonly - can't be modified (public but immutable)
    static readonly VERSION = '1.0.0';
    
    // Both private and readonly
    private static readonly SECRET_KEY = 'abc123';
}
```

---

## useEffect and Async Functions

### The Problem: Can't Use Async Directly in useEffect

You might think you can do this:

```typescript
// ❌ This doesn't work!
useEffect(async () => {
  const data = await PokemonAPI.get_all_pokemons(1, 10)
  setPokemons(data)
}, [])
```

**Why not?** Because `useEffect` has a rule about what its callback can return.

### Understanding useEffect Return Values

`useEffect` expects its callback to return **either nothing OR a cleanup function**:

```typescript
// Return nothing (undefined) ✅
useEffect(() => {
  console.log('component mounted')
}, [])

// Return a cleanup function ✅
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000)
  
  return () => {
    clearInterval(timer)  // Cleanup
  }
}, [])
```

### The Async Problem

When you make a function `async`, it **always returns a Promise**:

```typescript
// Regular function - returns undefined
const regular = () => {
  console.log('hi')
}
regular()  // Returns: undefined ✅

// Async function - returns a Promise!
const asyncFunc = async () => {
  console.log('hi')
}
asyncFunc()  // Returns: Promise<undefined> ❌
```

So this doesn't work:

```typescript
// ❌ useEffect callback is async
useEffect(async () => {
  await fetch()
}, [])

// Problem: This async function returns Promise<undefined>
// But useEffect expects: undefined OR cleanup function
// React gives a warning!
```

### The Solution: Wrap Async in Regular Function

Create an `async` function **inside** the regular `useEffect` callback, then call it:

```typescript
useEffect(() => {                           // Regular function ✅
  const fetchPokemon = async () => {       // Async function inside
    const data = await PokemonAPI.get_all_pokemons(1, 10)
    setPokemons(data)
  }
  
  fetchPokemon()                           // Call the async function
  
  // The outer function still returns undefined ✅
}, [])
```

**Why this works:**

- The outer callback is a regular function (returns undefined)
- Inside, we create and immediately call an async function
- React is happy because the callback returned undefined
- We still get to use `await` inside the async function

### Why React Has This Rule

React designed it this way so it can handle cleanup:

```typescript
// React needs to know: is this a cleanup function or a Promise?
return () => { /* cleanup */ }     // Cleanup ✅
return somePromise                 // Promise ❌ (confusing!)
```

If callbacks could be async, React wouldn't be able to distinguish between cleanup functions and Promises.

### Pattern: The Standard useEffect with Async

This is the pattern you'll use everywhere in React:

```typescript
import { useState, useEffect } from 'react'
import type { Pokemon } from './types/types'
import { PokemonAPI } from './api/PokemonAPI'

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const data = await PokemonAPI.get_all_pokemons(1, 10)
        setPokemons(data)
      } catch (err) {
        setError('Failed to fetch Pokemon')
      } finally {
        setLoading(false)
      }
    }

    fetchPokemon()
  }, [])  // Empty array = run once on component mount

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && <PokemonList pokemonList={pokemons} />}
    </>
  )
}
```

### Flow Visualization

The execution flow when a component mounts:

1. Component mounts
2. useEffect runs (because of empty `[]`)
3. fetchPokemon() function is called
4. setLoading(true) → Component re-renders with loading state
5. await API call → Waits for data from server
6. setPokemons(data) → Component re-renders with new data
7. setLoading(false) → Component re-renders without loading spinner

### Alternative: IIFE Pattern

Some people use an "Immediately Invoked Function Expression" (IIFE):

```typescript
useEffect(() => {
  (async () => {
    const data = await PokemonAPI.get_all_pokemons(1, 10)
    setPokemons(data)
  })()  // Creates and calls in one line
}, [])
```

This works but is harder to read. The named function approach is preferred.

---

## CSS Grid for Responsive Layouts

### The Problem

We want a grid of cards that automatically adjusts columns based on screen size, without writing media queries for every breakpoint.

### The Solution: `auto-fill` and `minmax`

```css
.pokemon-grid {
    display: grid;
    /* The Magic Line */
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 20px;
}
```

### How it Works

1. **`repeat(auto-fill, ...)`**: "Fit as many columns as possible in the row."
2. **`minmax(200px, 1fr)`**:
   - **Minimum**: Each column must be at least `200px` wide.
   - **Maximum**: If there's extra space, share it equally (`1fr`).

### Result

- **Large Screen**: Many columns (e.g., 5 columns of 250px).
- **Small Screen**: Fewer columns (e.g., 2 columns of 200px).
- **Mobile**: 1 column (if screen < 400px).

---

## CSS Modules

### What are CSS Modules?

A way to scope CSS to a specific component so class names don't clash globally.

### File Naming

Must end in `.module.css` (e.g., `PokemonCard.module.css`).

### Usage

**1. Create the CSS file (`PokemonCard.module.css`)**

```css
/* Standard CSS syntax */
.pokemonCard {
    background: white;
    border: 1px solid #ddd;
}

.cardImage {
    width: 100%;
}
```

**2. Import and Use in Component (`PokemonCard.tsx`)**

```typescript
import styles from './PokemonCard.module.css';

export function PokemonCard() {
    // Access classes as properties of the styles object
    return (
        <div className={styles.pokemonCard}>
            <img className={styles.cardImage} />
        </div>
    );
}
```

### Important Note on Naming

- **CSS**: You can use kebab-case (`.pokemon-card`) or camelCase (`.pokemonCard`).
- **JS**: camelCase is easier (`styles.pokemonCard`).
- If you use kebab-case in CSS, you must use bracket notation in JS: `styles['pokemon-card']`.

---

## Modal Component Pattern

### The "Children" Prop

To make a Modal reusable, it shouldn't know *what* it's displaying. It should just be a container. We use the special `children` prop for this.

```typescript
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode; // Accepts any valid JSX
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="overlay">
            <div className="content">
                {children} {/* Render whatever was passed inside */}
            </div>
        </div>
    );
}
```

### Usage in Parent

```typescript
<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
    {/* We can put ANYTHING here */}
    <PokemonDetails pokemon={selectedPokemon} />
</Modal>
```

---

## Fetching Details Pattern

### The Scenario

1. **List View**: API returns minimal data (name, url).
2. **Detail View**: Needs full data (stats, moves, abilities).

### The Pattern: Fetch on Mount

Don't fetch everything upfront. Fetch details only when the specific component mounts.

**1. Parent (App.tsx)**

Passes the minimal info (like name or ID) to the child.

```typescript
{selectedPokemon && <PokemonDetails pokemon={selectedPokemon} />}
```

**2. Child (PokemonDetails.tsx)**

Uses `useEffect` to fetch full details when it loads.

```typescript
export function PokemonDetails({ pokemon }: Props) {
    const [details, setDetails] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Fetch full details using the name from props
            const data = await PokemonAPI.get_pokemon_by_name(pokemon.name);
            setDetails(data);
            setLoading(false);
        };

        fetchData();
    }, [pokemon.name]); // Re-run if pokemon name changes

    if (loading) return <div>Loading...</div>;
    if (!details) return null;

    return (
        <div>
            <h1>{details.name}</h1>
            <p>HP: {details.stats.hp}</p>
        </div>
    );
}
```

---

## Interfaces vs. Classes vs. Python Dataclasses

### TypeScript Interfaces vs. Python Dataclasses

| Feature | TypeScript Interface | Python Dataclass |
| :--- | :--- | :--- |
| **Nature** | Structural contract (compile-time only) | Class generator (runtime existence) |
| **Output** | Removed in compiled JavaScript | Exists as a Python class at runtime |
| **Usage** | Defining shape of JSON/Objects | Creating objects with state/methods |
| **Validation** | Static (during coding) | Runtime (if using libraries like Pydantic) |

**Key Takeaway**: Interfaces are "ghosts" that disappear after compilation. They just tell TypeScript "expect this shape". Dataclasses are real object factories.

### Classes vs. Interfaces in TypeScript

- **Use Interfaces** when:
  - You just need to define the **shape** of data (e.g., API responses, Props).
  - You don't need methods or internal state logic attached to the data itself.
  - *Most React props and state definitions use Interfaces.*

- **Use Classes** when:
  - You need **runtime code** (methods, constructors).
  - You need `instanceof` checks.
  - You are managing complex stateful logic (though React Hooks often replace this).

---

## Controlled Components (Forms)

In HTML, input elements like `<input>` maintain their own state. In React, we want the **state to be the single source of truth**.

### The Pattern

1. **State**: Create a state variable for the input value.
2. **Value Prop**: Bind the input's `value` to that state.
3. **OnChange**: Update the state whenever the user types.

```tsx
const [name, setName] = useState("");

// The input is "controlled" by React state
<input 
    value={name}                  // 1. Display current state
    onChange={(e) => setName(e.target.value)} // 2. Update state on change
/>
```

---

## Passing Functions as Props

### 1. Direct Reference (`onClick={handleClick}`)

Passes the function itself. It will be called with the event object (or whatever arguments the child component passes).

```tsx
const handleClick = (event) => { console.log("Clicked"); };
<button onClick={handleClick}>Click Me</button>
```

### 2. Arrow Function Wrapper (`onClick={() => handleClick(id)}`)

Creates a **new function** that calls your function. Essential when you need to pass **custom arguments**.

```tsx
const deleteItem = (id) => { ... };
// WRONG: onClick={deleteItem(5)} -> Calls immediately on render!
// RIGHT: onClick={() => deleteItem(5)} -> Calls only when clicked
<button onClick={() => deleteItem(5)}>Delete</button>
```

### 3. Common Pitfall: Execution during Render

If you write `onClick={myFunction()}`, React executes `myFunction` *immediately* when the component renders, not when the user clicks.

---

## Debugging Checklist

### API Headers

When sending JSON data with a Bearer token, ensure headers are structured correctly:

**Incorrect:**

```typescript
headers: {
    'Authorization: Bearer': token // Wrong key
}
```

**Correct:**

```typescript
headers: {
    'Authorization': 'Bearer ' + token, // Standard HTTP format
    'Content-Type': 'application/json'
}
```

### Prop Drilling (Modal Closing)

If a child component (like a Modal) isn't closing:

1. Check if the **Parent** (`App.tsx`) is passing the close handler (`onClose={closeModal}`).
2. Check if the **Child** (`PokemonDetails.tsx`) accepts it in its Interface.
3. Check if the **Grandchild** (if applicable) calls it correctly.

---

## Advanced React Patterns

### Incremental Development Strategy

When building complex features with multiple interconnected components, use an incremental approach:

1. **State Management First**: Establish app-level state and navigation structure
2. **Atomic Components**: Build smallest reusable pieces (individual cards)
3. **Container Components**: Create list/collection managers
4. **Feature Extension**: Enhance existing components with new modes
5. **Integration Testing**: Connect all pieces and verify workflow

**Why This Works**: Catches errors early, allows for easier debugging, and ensures each piece works independently before integration.

### Component Data Fetching Patterns

**Self-Contained vs Parent-Fetched**:

Components can fetch their own data (autonomous) or receive it from parent (controlled):

```typescript
// Self-contained: Component fetches its own data
function BoxCard({ pokemonName }) {
    const [pokemon, setPokemon] = useState(null);
    useEffect(() => {
        fetchPokemon(pokemonName).then(setPokemon);
    }, [pokemonName]);
}

// Parent-controlled: Parent provides all data
function BoxCard({ pokemon }) {
    // Just display, no fetching
}
```

**Trade-offs**:

- **Self-contained**: More flexible, parallel loading, but harder to coordinate
- **Parent-controlled**: Easier to manage loading states, but parent complexity grows

### Conditional Component Modes

A single component can handle multiple operations using conditional logic:

**Pattern**: Optional props change behavior

```typescript
interface FormProps {
    initialData?: Entry;  // Present = Edit mode, Absent = Create mode
}

function Form({ initialData }: FormProps) {
    const isEditing = !!initialData;  // Convert to boolean
    
    // Conditional behavior
    const submitHandler = isEditing ? updateAPI : createAPI;
    const buttonText = isEditing ? "Update" : "Create";
}
```

**Benefits**: DRY (Don't Repeat Yourself), single source of truth, easier maintenance.

---

## useEffect Cleanup Functions

### The Race Condition Problem

When async operations occur in `useEffect`, subsequent effect runs can cause **race conditions**:

**Scenario**: User clicks "Next Page" rapidly

1. Effect 1 starts fetching Page 1
2. User clicks Next → Effect 2 starts fetching Page 2
3. Page 2 data arrives → State updates to Page 2 ✓
4. Page 1 data arrives (slower) → State updates to Page 1 ✗ **WRONG!**

Result: UI shows "Page 2" but displays Page 1 data.

### Solution: Cleanup Function with Ignore Flag

```typescript
useEffect(() => {
    let ignore = false;  // Local to this effect instance
    
    const fetchData = async () => {
        const data = await API.fetch();
        if (!ignore) {  // Only update if still valid
            setState(data);
        }
    };
    
    fetchData();
    
    // Cleanup function runs when:
    // 1. Dependencies change (new effect about to run)
    // 2. Component unmounts
    return () => { 
        ignore = true;  // Invalidate this effect
    };
}, [dependency]);
```

### How Cleanup Works

React calls the cleanup function BEFORE running the effect again:

```
User action → Dependency changes
    ↓
React: "New effect needed!"
    ↓
1. Run cleanup from OLD effect (ignore = true)
2. Run NEW effect (new ignore = false)
```

**Result**: Old async operations complete but can't update state (ignored).

### When to Use Cleanup

- **Async operations**: API calls, timers, subscriptions
- **Event listeners**: Window resize, scroll, keyboard
- **Intervals/Timeouts**: `setInterval`, `setTimeout`
- **WebSocket connections**: Real-time data streams

### Alternative: AbortController

Modern approach using browser API:

```typescript
useEffect(() => {
    const controller = new AbortController();
    
    fetch(url, { signal: controller.signal })
        .then(data => setState(data))
        .catch(err => {
            if (err.name === 'AbortError') return; // Cancelled
            console.error(err);
        });
    
    return () => controller.abort();  // Cancel fetch
}, [url]);
```

**Advantage**: Actually cancels network request (saves bandwidth).

---

## API Response Handling

### HTTP Status Codes and Response Bodies

Not all successful API responses return JSON data:

| Status Code | Meaning | Response Body |
|------------|---------|---------------|
| 200 OK | Success with data | JSON/XML/etc |
| 201 Created | Resource created | Often JSON of new resource |
| 204 No Content | Success, no data | **EMPTY** |
| 304 Not Modified | Cached version valid | **EMPTY** |

### Common Error: Parsing Empty Responses

```typescript
// ❌ WRONG: Assumes all responses have JSON
async function deleteItem(id) {
    const response = await fetch(`/api/item/${id}`, { method: 'DELETE' });
    return await response.json();  // 💥 Crashes on 204!
}
```

**Error**: `SyntaxError: Unexpected end of JSON input`

### Checking for Response Body

```typescript
// ✅ CORRECT: Handle empty responses
async function deleteItem(id): Promise<void> {
    const response = await fetch(`/api/item/${id}`, { method: 'DELETE' });
    
    if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
    }
    
    // No return = returns undefined (void)
}
```

**Key Practice**: Always check API documentation for expected response format before implementing handlers.

---

## CSS Grid Responsive Design

### Understanding `auto-fill` vs `auto-fit`

CSS Grid can automatically calculate column count based on container width:

```css
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
```

**How it works**:

1. **Container width**: Browser measures available space
2. **Calculate columns**: `width ÷ (minWidth + gap)` = max columns
3. **Distribute space**: Columns grow from `250px` to share remaining space

**`auto-fill` vs `auto-fit`**:

- **`auto-fill`**: Creates ghost columns if space exists (grid maintains width)
- **`auto-fit`**: Collapses empty columns (items expand to fill)

### Responsive Without Media Queries

Traditional approach (verbose):

```css
.grid { grid-template-columns: repeat(6, 1fr); }
@media (max-width: 1400px) { .grid { grid-template-columns: repeat(5, 1fr); } }
@media (max-width: 1200px) { .grid { grid-template-columns: repeat(4, 1fr); } }
/* ... more breakpoints ... */
```

Modern approach (automatic):

```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}
```

**Single rule handles all screen sizes!**

### The `minmax()` Function

```css
minmax(250px, 1fr)
```

- **First value (min)**: Smallest allowed width
- **Second value (max)**: Largest allowed width (`1fr` = equal fraction of remaining space)

**Behavior**:

- If container > `(250px × columns) + gaps`: Each column gets equal share of extra space
- If container < minimum needed: Grid drops to fewer columns automatically

### Layout Constraints in Vite Apps

Default Vite React template includes centering styles that limit app width:

```css
/* Common constraint pattern */
body {
    display: flex;
    place-items: center;  /* Centers in viewport */
}

#root {
    max-width: 1280px;  /* Caps app width */
}
```

**Effect**: App stays narrow on wide screens, creating wasted space.

**Solution**: Remove constraints for full-width layouts, or keep for centered card-style apps.

---

## Data-Driven Styling

### Backend-Controlled UI

Instead of hardcoding styles in frontend, APIs can provide styling information:

**API Provides Colors**:

```json
{
    "type": "electric",
    "color": "#F8D030"  // Backend defines this
}
```

**Frontend Applies Colors**:

```typescript
<span style={{ color: type.color }}>
    {type.name}
</span>
```

### Benefits of API-Driven Styling

1. **Consistency**: All clients (web, mobile, desktop) use same colors
2. **Centralized Updates**: Change color in one place (backend)
3. **No Mapping Logic**: Frontend doesn't need color lookup tables
4. **Dynamic Themes**: Backend can return different colors per user/theme

### When to Use Frontend-Defined Styles

Use CSS/frontend styling for:

- **Layout/Structure**: Grids, flexbox, spacing
- **Interaction States**: Hover, focus, active
- **Responsive Design**: Media queries, breakpoints
- **Animations**: Transitions, keyframes

Use API-driven styling for:

- **Content-Specific Colors**: Status colors, type colors, category colors
- **User Preferences**: Theme colors, accessibility settings
- **Dynamic Content**: User-generated content styling

### Separation of Concerns

**Good Architecture**:

- **Frontend**: Handles "how to display"
- **Backend**: Provides "what to display" (including color metadata)
- **Design System**: Both reference shared tokens (optional)
