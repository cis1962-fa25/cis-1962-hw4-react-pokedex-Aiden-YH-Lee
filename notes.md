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
