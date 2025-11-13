// Scenario definitions for parking challenges

const SCENARIOS = {
    1: {
        name: "Street to Underground Entrance",
        description: "Navigate from a 4.5m wide street through a 90° right turn into a 2.7m wide underground entrance",
        startPosition: { x: 18, y: 8, angle: Math.PI }, // Start at beginning of street, facing left (right to left)
        walls: [
            // Street boundaries (horizontal street, 4.5m wide, car drives right to left)
            { x1: 5, y1: 5.75, x2: 8.65, y2: 5.75 },   // Top wall of street (before entrance)
            { x1: 11.35, y1: 5.75, x2: 25, y2: 5.75 }, // Top wall of street (after entrance)
            { x1: 5, y1: 10.25, x2: 8.65, y2: 10.25 },   // Bottom wall of street (before entrance)
            { x1: 11.35, y1: 10.25, x2: 25, y2: 10.25 }, // Bottom wall of street (after entrance)

            // Underground entrance (vertical entrance, 2.7m wide, opens into street)
            { x1: 8.65, y1: 3, x2: 8.65, y2: 5.75 },   // Left wall of entrance
            { x1: 11.35, y1: 3, x2: 11.35, y2: 5.75 }, // Right wall of entrance
            { x1: 8.65, y1: 10.25, x2: 8.65, y2: 12 },  // Left wall extension (if needed)
            { x1: 11.35, y1: 10.25, x2: 11.35, y2: 12 }, // Right wall extension (if needed)

            // End walls
            { x1: 8.65, y1: 3, x2: 11.35, y2: 3 },  // Entrance end
            { x1: 25, y1: 5.75, x2: 25, y2: 10.25 },   // Street end (right side)
            { x1: 5, y1: 5.75, x2: 5, y2: 10.25 },     // Street start (left side)
        ],
        target: {
            x: 10,
            y: 4.5,
            width: 2.5,
            height: 1.5,
            angle: -Math.PI / 2 // Facing down
        },
        cameraScale: 40, // pixels per meter
        cameraOffset: { x: 15, y: 8 }
    },

    2: {
        name: "Underground Hall to Parking Box",
        description: "Enter from 2.7m entrance, turn 90° right in the hall, and park in box at bottom wall",
        startPosition: { x: 15, y: 8, angle: -Math.PI / 2 }, // Start in entrance, facing down
        walls: [
            // Entrance (2.7m wide, vertical)
            { x1: 13.65, y1: 8, x2: 13.65, y2: 12 },  // Left wall of entrance
            { x1: 16.35, y1: 8, x2: 16.35, y2: 12 },  // Right wall of entrance
            { x1: 13.65, y1: 12, x2: 16.35, y2: 12 }, // Top of entrance (street side)

            // Wall to the right of entrance (6m long)
            { x1: 16.35, y1: 2, x2: 16.35, y2: 8 },   // Right wall continuing down

            // Hall extending to the left (15m)
            { x1: 1, y1: 8, x2: 13.65, y2: 8 },       // Top wall of hall
            { x1: 1, y1: 2, x2: 1, y2: 8 },           // Left end wall

            // Bottom wall of hall (split by parking box gate)
            { x1: 1, y1: 2, x2: 7.66, y2: 2 },        // Bottom wall - left of box
            { x1: 7.66, y1: 2, x2: 8.09, y2: 2 },     // Box wall - left of gate
            // Gate opening from x=8.09 to x=10.23 (2.14m wide)
            { x1: 10.23, y1: 2, x2: 10.66, y2: 2 },   // Box wall - right of gate
            { x1: 10.66, y1: 2, x2: 16.35, y2: 2 },   // Bottom wall - right of box

            // Parking box (extending downward from bottom wall)
            // Box gate 2.14m, total width 3m, length 5.1m
            // Box center at x=9.16, gate center at x=9.16
            { x1: 7.66, y1: 2, x2: 7.66, y2: -3.1 },    // Box left wall (5.1m deep)
            { x1: 7.66, y1: -3.1, x2: 10.66, y2: -3.1 }, // Box back wall (3m wide)
            { x1: 10.66, y1: -3.1, x2: 10.66, y2: 2 },  // Box right wall (5.1m deep)
        ],
        parkingBox: {
            x: 7.66,
            y: -3.1,
            width: 3,
            height: 5.1,
            gateWidth: 2.14,
            gateCenter: 9.16 // Center of the gate at y=2
        },
        target: {
            x: 9.16,
            y: -0.55,  // Center of box depth: 2 - 5.1/2 = -0.55
            width: 2.5,
            height: 4,
            angle: -Math.PI / 2 // Facing into the box (down)
        },
        cameraScale: 35,
        cameraOffset: { x: 10, y: 2 }
    },

    3: {
        name: "Exit Parking Box",
        description: "Exit from parking box at bottom wall and navigate back to the entrance",
        startPosition: { x: 9.16, y: -0.55, angle: Math.PI / 2 }, // Start inside box, facing up/out
        walls: [
            // Same walls as scenario 2
            // Entrance (2.7m wide, vertical)
            { x1: 13.65, y1: 8, x2: 13.65, y2: 12 },
            { x1: 16.35, y1: 8, x2: 16.35, y2: 12 },
            { x1: 13.65, y1: 12, x2: 16.35, y2: 12 },

            // Wall to the right
            { x1: 16.35, y1: 2, x2: 16.35, y2: 8 },

            // Hall
            { x1: 1, y1: 8, x2: 13.65, y2: 8 },
            { x1: 1, y1: 2, x2: 1, y2: 8 },

            // Bottom wall of hall (split by parking box gate)
            { x1: 1, y1: 2, x2: 7.66, y2: 2 },
            { x1: 7.66, y1: 2, x2: 8.09, y2: 2 },
            // Gate opening from x=8.09 to x=10.23
            { x1: 10.23, y1: 2, x2: 10.66, y2: 2 },
            { x1: 10.66, y1: 2, x2: 16.35, y2: 2 },

            // Parking box (extending downward from bottom wall)
            { x1: 7.66, y1: 2, x2: 7.66, y2: -3.1 },
            { x1: 7.66, y1: -3.1, x2: 10.66, y2: -3.1 },
            { x1: 10.66, y1: -3.1, x2: 10.66, y2: 2 },
        ],
        parkingBox: {
            x: 7.66,
            y: -3.1,
            width: 3,
            height: 5.1,
            gateWidth: 2.14,
            gateCenter: 9.16
        },
        target: {
            x: 15,
            y: 10,
            width: 2.5,
            height: 1.5,
            angle: Math.PI / 2 // Facing up (toward exit)
        },
        cameraScale: 35,
        cameraOffset: { x: 10, y: 2 }
    },

    4: {
        name: "Parallel Parking",
        description: "Parallel park between two cars on a 6m wide street with a 6.5m parking space",
        startPosition: { x: 20, y: 10, angle: Math.PI }, // Start on street, facing left
        walls: [
            // Street boundaries (6m wide street)
            { x1: 5, y1: 7, x2: 25, y2: 7 },   // Top curb
            { x1: 5, y1: 13, x2: 25, y2: 13 }, // Bottom curb
            { x1: 5, y1: 7, x2: 5, y2: 13 },   // Left end
            { x1: 25, y1: 7, x2: 25, y2: 13 }, // Right end

            // Front parked car (4.5m long, positioned at x=8 to x=12.5)
            { x1: 8, y1: 7, x2: 8, y2: 8.8 },         // Front left corner
            { x1: 8, y1: 7, x2: 12.5, y2: 7 },        // Front side (curb)
            { x1: 12.5, y1: 7, x2: 12.5, y2: 8.8 },   // Front right corner
            { x1: 8, y1: 8.8, x2: 12.5, y2: 8.8 },    // Front car rear

            // Rear parked car (4.5m long, positioned at x=19 to x=23.5) - moved 0.5m right
            { x1: 19, y1: 7, x2: 19, y2: 8.8 },       // Rear left corner
            { x1: 19, y1: 7, x2: 23.5, y2: 7 },       // Rear side (curb)
            { x1: 23.5, y1: 7, x2: 23.5, y2: 8.8 },   // Rear right corner
            { x1: 19, y1: 8.8, x2: 23.5, y2: 8.8 },   // Rear car rear
        ],
        target: {
            x: 15.75, // Center of 6.5m space (12.5 to 19)
            y: 7.9,   // Close to curb
            width: 5.5, // Lenient width tolerance
            height: 1.5, // Depth tolerance
            angle: Math.PI // Facing left, parallel to street
        },
        cameraScale: 30,
        cameraOffset: { x: 15, y: 10 }
    },

    5: {
        name: "Perpendicular Parking",
        description: "Park straight into a perpendicular parking space between two cars",
        startPosition: { x: 15, y: 14.2, angle: -Math.PI / 2 }, // Start in driving lane, facing space
        walls: [
            // Parking lot driving lane boundaries
            { x1: 5, y1: 12, x2: 25, y2: 12 },  // Top of driving lane
            { x1: 5, y1: 17, x2: 25, y2: 17 },  // Bottom of driving lane
            { x1: 5, y1: 12, x2: 5, y2: 17 },   // Left end
            { x1: 25, y1: 12, x2: 25, y2: 17 }, // Right end

            // Back wall of parking spaces (no wall in target space)
            { x1: 5, y1: 7, x2: 13.2, y2: 7 },    // Left section (up to target space)
            { x1: 16.8, y1: 7, x2: 25, y2: 7 },   // Right section (after target space)

            // Left parked car (2.4m wide space, x=9.4 to x=11.8)
            { x1: 9.4, y1: 7, x2: 9.4, y2: 11.39 },   // Left side
            { x1: 11.8, y1: 7, x2: 11.8, y2: 11.39 }, // Right side
            { x1: 9.4, y1: 11.39, x2: 11.8, y2: 11.39 }, // Front of car

            // Right parked car (2.4m wide space, x=18.2 to x=20.6)
            { x1: 18.2, y1: 7, x2: 18.2, y2: 11.39 }, // Left side
            { x1: 20.6, y1: 7, x2: 20.6, y2: 11.39 }, // Right side
            { x1: 18.2, y1: 11.39, x2: 20.6, y2: 11.39 }, // Front of car

            // Parking space dividers (painted lines - shortened to avoid collision)
            { x1: 11.8, y1: 7, x2: 11.8, y2: 11.8 },    // Left divider
            { x1: 13.2, y1: 7, x2: 13.2, y2: 11.8 },    // Left of target space
            { x1: 16.8, y1: 7, x2: 16.8, y2: 11.8 },    // Right of target space
            { x1: 18.2, y1: 7, x2: 18.2, y2: 11.8 },    // Right divider
        ],
        target: {
            x: 15,   // Center of 3.6m space (13.2 to 16.8)
            y: 9,    // Middle depth
            width: 3.0,  // Width tolerance
            height: 3.5, // Depth tolerance
            angle: -Math.PI / 2 // Facing into space (down)
        },
        cameraScale: 32,
        cameraOffset: { x: 15, y: 12 }
    },

    6: {
        name: "Angle Parking (60°)",
        description: "Park at a 60° angle into an angled parking space - easier than perpendicular",
        startPosition: { x: 20, y: 15, angle: Math.PI }, // Start in driving lane, facing left
        walls: [
            // Driving lane boundaries
            { x1: 5, y1: 12, x2: 25, y2: 12 },  // Top of driving lane
            { x1: 5, y1: 17, x2: 25, y2: 17 },  // Bottom of driving lane
            { x1: 5, y1: 12, x2: 5, y2: 17 },   // Left end
            { x1: 25, y1: 12, x2: 25, y2: 17 }, // Right end

            // Angled parking spaces back wall sections
            { x1: 5, y1: 7.5, x2: 9.5, y2: 7.5 },     // Far left
            { x1: 11.3, y1: 7.5, x2: 13.5, y2: 7.5 }, // Left of target
            { x1: 16.5, y1: 7.5, x2: 18.7, y2: 7.5 }, // Right of target
            { x1: 20.5, y1: 7.5, x2: 25, y2: 7.5 },   // Far right

            // Left angled car (60° angle)
            // Space from x=9.5, angled at 60° from horizontal
            { x1: 9.5, y1: 7.5, x2: 11.3, y2: 7.5 },   // Back edge
            { x1: 9.5, y1: 7.5, x2: 7.7, y2: 11.6 },   // Left side (angled)
            { x1: 11.3, y1: 7.5, x2: 9.5, y2: 11.6 },  // Right side (angled)
            { x1: 7.7, y1: 11.6, x2: 9.5, y2: 11.6 },  // Front edge

            // Right angled car (60° angle)
            // Space from x=18.7, angled at 60° from horizontal
            { x1: 18.7, y1: 7.5, x2: 20.5, y2: 7.5 },  // Back edge
            { x1: 18.7, y1: 7.5, x2: 16.9, y2: 11.6 }, // Left side (angled)
            { x1: 20.5, y1: 7.5, x2: 18.7, y2: 11.6 }, // Right side (angled)
            { x1: 16.9, y1: 11.6, x2: 18.7, y2: 11.6 }, // Front edge

            // Angled divider lines (60° from horizontal)
            { x1: 11.3, y1: 7.5, x2: 9.5, y2: 12 },    // Left of target
            { x1: 13.5, y1: 7.5, x2: 11.7, y2: 12 },   // Left boundary
            { x1: 16.5, y1: 7.5, x2: 14.7, y2: 12 },   // Right boundary
            { x1: 18.7, y1: 7.5, x2: 16.9, y2: 12 },   // Right of target
        ],
        target: {
            x: 15,    // Center of angled space
            y: 9.5,   // Middle depth
            width: 2.5,  // Width tolerance
            height: 3.5, // Depth tolerance
            angle: -Math.PI / 2 - Math.PI / 6 // Facing into space at -90° - 30° = -120° (60° from horizontal)
        },
        cameraScale: 32,
        cameraOffset: { x: 15, y: 12 }
    }
};

// Collision detection helper functions
function lineSegmentIntersection(p1, p2, p3, p4) {
    const x1 = p1.x, y1 = p1.y;
    const x2 = p2.x, y2 = p2.y;
    const x3 = p3.x, y3 = p3.y;
    const x4 = p4.x, y4 = p4.y;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 0.0001) return false;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    return (t >= 0 && t <= 1 && u >= 0 && u <= 1);
}

function checkCarWallCollision(car, walls) {
    const corners = car.getCorners();

    // Check each edge of the car against each wall
    for (let i = 0; i < corners.length; i++) {
        const p1 = corners[i];
        const p2 = corners[(i + 1) % corners.length];

        for (const wall of walls) {
            const p3 = { x: wall.x1, y: wall.y1 };
            const p4 = { x: wall.x2, y: wall.y2 };

            if (lineSegmentIntersection(p1, p2, p3, p4)) {
                return true;
            }
        }
    }

    return false;
}

function checkCarInTarget(car, target) {
    const carCenter = car.getFrontAxle(); // Using front axle as reference
    const targetCenterX = target.x;
    const targetCenterY = target.y;

    // Check if car center is within target bounds
    const inBounds = Math.abs(carCenter.x - targetCenterX) < target.width / 2 &&
                     Math.abs(carCenter.y - targetCenterY) < target.height / 2;

    // Check if car angle is close to target angle (within 15 degrees)
    let angleDiff = Math.abs(car.angle - target.angle);
    angleDiff = Math.min(angleDiff, 2 * Math.PI - angleDiff); // Normalize to 0-PI
    const angleOk = angleDiff < (15 * Math.PI / 180);

    // Check if car is nearly stopped
    const speedOk = Math.abs(car.speed) < 0.1;

    return inBounds && angleOk && speedOk;
}
