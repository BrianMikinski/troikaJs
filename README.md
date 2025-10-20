# troikaJs

Hello world of troikajs - A bare bones Angular 20 application demonstrating troika-three-text

## Overview

This project demonstrates how to integrate [Troika.js](https://github.com/protectwise/troika) with Angular 20, specifically showcasing the `troika-three-text` package for rendering high-quality 3D text in Three.js scenes.

## Features

- **Angular 20**: Latest version of Angular with standalone components
- **Three.js Integration**: 3D scene with camera, lighting, and renderer
- **Troika Three Text**: High-quality 3D text rendering using signed distance fields (SDF)
- **Animated Scene**: Rotating 3D text, cube, and sphere
- **TypeScript Support**: Full type definitions for troika-three-text

## Project Structure

```
angular-troika-app/
├── src/
│   ├── app/
│   │   ├── app.ts          # Main component with Three.js scene
│   │   ├── app.html        # Template
│   │   └── app.css         # Styles
│   ├── types/
│   │   └── troika-three-text.d.ts  # TypeScript definitions
│   └── styles.css          # Global styles
├── public/
│   └── Roboto-Regular.ttf  # Font file for troika-three-text
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

1. Navigate to the Angular application directory:
   ```bash
   cd angular-troika-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

### Building for Production

Build the application:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## How It Works

The application creates a Three.js scene with:

1. **3D Text**: Uses `troika-three-text` to render animated text
   - Text: "Hello World! Welcome to Troika.js with Angular 20"
   - Green color (`0x00ff00`)
   - Rotates on the Y-axis
   - Uses local Roboto font file

2. **Wireframe Cube**: A rotating cube positioned on the left

3. **Solid Sphere**: A rotating sphere positioned on the right

4. **Lighting**: Ambient and directional lights for proper rendering

## Key Technologies

- **Angular 20**: Modern web framework
- **Three.js**: 3D graphics library
- **troika-three-text**: High-quality text rendering for Three.js
- **TypeScript**: Type-safe development

## Resources

- [Troika GitHub](https://github.com/protectwise/troika)
- [Troika Getting Started](https://protectwise.github.io/troika/getting-started/setup/)
- [Troika Three Text Documentation](https://protectwise.github.io/troika/troika-three-text/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Angular Documentation](https://angular.dev/)

## License

MIT
