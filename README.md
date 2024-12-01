# Keychron - Keyboard website

Keychron is a modern, performant e-commerce platform specializing in custom mechanical keyboards, featuring real-time configuration, dynamic visualization, and a seamless ordering system.

## 🌟 Features

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

## 📄 License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

See [CREDITS](CREDITS.md) file for more details.
