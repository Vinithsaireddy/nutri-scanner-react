# NutriScan: Food Product Explorer

A high-performance React application designed to help users search, filter, and analyze food products globally using the OpenFoodFacts API. 

## Live Demo
[Insert Your Vercel/Netlify Link Here]

---

## Methodology & Tech Stack
This project was built with a focus on **Modular Architecture** and **Performance Optimization**.

- **Frontend:** React + Vite (for lightning-fast development and optimized production builds).
- **Styling:** Tailwind CSS for a responsive, utility-first design.
- **Animations:** Framer Motion for premium UI transitions (inspired by 21st.dev).
- **State Management:** React Context API for handling global search filters and theme toggling.
- **API Strategy:** Implemented a dedicated service layer with custom `User-Agent` headers to comply with OpenFoodFacts community guidelines.
- **Search Logic:** Utilized **Debouncing** (300ms) to reduce redundant API calls and stay within rate limits.

## AI Collaboration
In the spirit of modern design engineering, **Gemini** was utilized as a pair-programmer to assist in:
- **Architectural Planning:** Defining a scalable folder structure (Service-Pattern).
- **API Integration:** Interpreting complex nutrition data structures from OpenFoodFacts.
- **Problem Solving:** Refining logic for the barcode search and pagination state management.

## Key Features
- **Smart Search:** Search by product name with real-time feedback.
- **Barcode Lookup:** Direct access to product data via unique barcode ID.
- **Advanced Filtering:** Filter by food categories (Beverages, Dairy, Snacks, etc.).
- **Smart Sorting:** Sort by Nutri-Score (A to E) or Product Name.
- **Responsive Detail View:** Comprehensive view of nutritional values, labels (Vegan/Gluten-Free), and ingredients.
- **Visual Feedback:** Custom Skeleton loaders for all loading states and dark mode support.

## Time Taken
| Task | Estimated Time |
| Project Setup & API Research | 1.5 Hours |
| Core Logic (API Service & Hooks) | 3 Hours |
| UI/UX Development & Animations | 3 Hours |
| Final Testing & Documentation | 1 Hour |
| **Total** | **8.5 Hours** |

## Setup & Installation
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>