# Car Parking Training Simulator

A web-based training application designed to help practice precise parking maneuvers using realistic car physics based on the Toyota C-HR 2021 HEV.

## Features

- **Realistic Physics**: Based on actual Toyota C-HR 2021 HEV specifications
  - Length: 4.39m
  - Width: 1.795m
  - Wheelbase: 2.64m
  - Turning radius: 5.21m
  - Accurate steering mechanics using bicycle model physics

- **Top-Down View**: Bird's eye perspective showing:
  - Complete car outline
  - Rear view mirrors (visual reference points)
  - Driver seat position indicator
  - Real-time steering visualization

- **Six Training Scenarios**:
  1. **Street to Underground Entrance**: Navigate a 90° right turn from a 4.5m wide street into a 2.7m wide underground entrance
  2. **Underground Hall to Parking Box**: Enter from 2.7m entrance, turn 90° right in the hall, and park in a tight box (2.14m gate, 3m wide, 5.1m long) at the bottom wall
  3. **Exit Parking Box**: Exit from the parking box and navigate back to the entrance
  4. **Parallel Parking**: Classic parallel parking maneuver between two cars with a 6m space on a 6m wide street
  5. **Perpendicular Parking**: Park straight into a 90° perpendicular space between two cars in a parking lot
  6. **Angle Parking (60°)**: Park into an angled parking space at 60° - easier entry than perpendicular parking

- **Interactive Controls**:
  - Arrow keys for steering and acceleration
  - Realistic forward and reverse gears
  - Visual feedback for collisions
  - Real-time vehicle status display

## How to Use

### Controls

- **↑ (Up Arrow)**: Move forward
- **↓ (Down Arrow)**: Move in reverse
- **← (Left Arrow)**: Steer left
- **→ (Right Arrow)**: Steer right
- **Space**: Brake
- **R**: Reset to starting position

### Running the Application

Simply open `index.html` in a modern web browser. No server or build process required.

```bash
# Option 1: Direct file access
open index.html

# Option 2: Simple HTTP server (recommended)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Technical Details

### Project Structure

```
parkingapp/
├── index.html          # Main HTML structure
├── styles.css          # Styling and layout
├── car.js              # Car physics and control logic
├── scenarios.js        # Parking scenario definitions and collision detection
├── renderer.js         # Canvas rendering engine
└── game.js             # Main game loop and state management
```

### Physics Model

The car uses a bicycle model for realistic steering behavior:
- Front wheel steering with accurate Ackermann geometry
- Speed-dependent turning radius
- Realistic acceleration and braking
- Natural friction and deceleration

### Collision Detection

- Line segment intersection algorithm for wall collisions
- Real-time collision feedback with visual warnings
- Prevents car from passing through walls

### Scenario Design

All scenarios are based on real-world parking challenges:
- Accurate dimensions for streets, entrances, and parking spaces
- Realistic wall placements
- Target zones with position and angle requirements

## Development

The application is built with vanilla JavaScript (ES6+) and HTML5 Canvas, with no external dependencies.

### Customization

You can easily add new scenarios by editing `scenarios.js`:

```javascript
SCENARIOS[4] = {
    name: "Custom Scenario",
    description: "Your description here",
    startPosition: { x: 10, y: 10, angle: 0 },
    walls: [
        { x1: 0, y1: 0, x2: 10, y2: 0 },
        // Add more walls...
    ],
    target: {
        x: 5,
        y: 5,
        width: 3,
        height: 5,
        angle: 0
    },
    cameraScale: 40,
    cameraOffset: { x: 5, y: 5 }
};
```

## Browser Compatibility

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires HTML5 Canvas support.

## License

MIT License - Feel free to use and modify for your own training purposes.

## Acknowledgments

Vehicle specifications based on the Toyota C-HR 2021 HEV model.
