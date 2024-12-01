# Keychron - Keyboard website

The Keychron Custom Keyboard Configurator is a modern e-commerce platform that allows users to design and order custom mechanical keyboards. Built with performance and user experience in mind, it features a real-time configurator with both 2D and 3D visualization capabilities, supporting various layouts depending on the users' needs.

This project stands out by offering a framework-free implementation focused on modern web standards and performance, while providing an intuitive interface for both desktop and mobile users. The configurator supports extensive customization options including switch types, layouts, and color themes, all with real-time visual feedback and price calculations.

## Design Process

The design process focused on meeting the needs of two primary user groups: mechanical keyboard enthusiasts and newcomers to the custom keyboard scene.

### User Stories

As a mechanical keyboard enthusiast:

- I want to customize every aspect of my keyboard, so I can create my perfect typing experience
- I want to see real-time 3D previews, so I can visualize exactly how my custom keyboard will look
- I want to save and share my configurations, so I can get feedback from the community

As a newcomer to mechanical keyboards:

- I want clear explanations of different options, so I can make informed decisions
- I want to understand how different choices affect the price, so I can stay within my budget
- I want a step-by-step configuration process, so I don't feel overwhelmed by choices

Screens: https://www.figma.com/design/LbHiFWKZqmRkvk1HDlvPnG/FED_S10258960_Raymond_Assg1_Wireframe

### 🌟 Features

### Interactive Keyboard Configurator

- Real-time 2D SVG and planned 3D visualization
- Multiple layout options
- Extensive switch type selection
- Custom color themes and materials
- Live price calculations

### Responsive Design

- Optimized for both desktop and mobile experiences
- Touch-friendly interface with gesture support
- Adaptive layout for different screen sizes
- Performance-focused implementation

### Technical Implementation

- Pure HTML/CSS/JavaScript (No frameworks)
- "Fakewinds" by spamming utils.css with random tailwinds-like utility classes
- Custom Web Components architecture
- Vite bundler for external dependencies
- Github pages as CD for deployment
- Prettier and ESLint for formatting and static analysis

## 🚀 Getting Started

### Prerequisites

- Bun v1.1.33 or higher
- Node.js 22.0.0 or higher (if not using Bun)
- Modern web browser (no internet explorer)

### Installation

1. Clone the repository

```bash
git clone https://github.com/provsalt/FED_S10258960_Raymond_Assg1_website
cd FED_S10258960_Raymond_Assg1_website
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server

```bash
# Using Bun
bun dev

# Using npm
npm run dev

# Using yarn
yarn dev
```

4. Open your browser and navigate to [http://localhost:5173/FED_S10258960_Raymond_Assg1_website](http://localhost:5173/FED_S10258960_Raymond_Assg1_website)

## 💻 Development

### Key Commands

- bun dev - Start development server
- bun run build - Build production bundle
- bunx vite preview - Start production server
- bun format - Format code

### Architecture Decisions

- Web Components: Utilized for reusable UI elements and encapsulation
- State Management: Custom implementation without external libraries
- Rendering Strategy: Client-side rendering with progressive enhancement
- Asset Loading: Implemented lazy loading and progressive loading strategies

## Testing

### Functionality Testing

#### Products

- Check loop shows all keyboards
- Check whether filters (layout, price range, features)
- Check sorting of keyboards functionality

#### Keyboard Configurator:

- Confirm color theme applications
- Verify all switch type selections
- Check price calculation accuracy
- Check if selection is not null
- Check whether the product exists

#### Cart

- Check if the cart is null
- Check if the prices.
- TODO, check for cart array schema to prevent unauthorized editing

#### Checkout

- Prevent checkout if cart is null
- Form validation using required
- Form validation using javascript with regex or dependent case such as delivery vs in-person.

### Responsive Design Testing

- Desktop (1920x1080, 1440x900)
- Mobile (Google Pixel 7 Pro, Google Pixel 6)
- Different browsers (Chromium, Firefox, Safari)

## 📄 License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments and Credits

### Content

- Content is taken from [Keychron](https://keychron.com)

See [CREDITS](CREDITS.md) file for more details.
