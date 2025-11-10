// Scenario definitions for parking challenges

const SCENARIOS = {
    1: {
        name: "Street to Underground Entrance",
        description: "Navigate from a 2.5m wide street through a 90° left turn into a 2.4m wide underground entrance",
        startPosition: { x: 15, y: 8, angle: 0 }, // Start at beginning of street, facing right
        walls: [
            // Street boundaries (horizontal street on right side)
            { x1: 10, y1: 6.75, x2: 25, y2: 6.75 }, // Top wall of street
            { x1: 10, y1: 9.25, x2: 25, y2: 9.25 }, // Bottom wall of street

            // Underground entrance (vertical entrance on left)
            { x1: 8.8, y1: 3, x2: 8.8, y2: 8 },     // Left wall of entrance
            { x1: 11.2, y1: 3, x2: 11.2, y2: 8 },   // Right wall of entrance

            // Corner walls connecting street to entrance
            { x1: 10, y1: 6.75, x2: 11.2, y2: 6.75 }, // Top corner
            { x1: 8.8, y1: 8, x2: 10, y2: 8 },        // Transition wall top
            { x1: 10, y1: 8, x2: 10, y2: 9.25 },      // Vertical transition

            // End walls
            { x1: 8.8, y1: 3, x2: 11.2, y2: 3 },      // Entrance end
            { x1: 25, y1: 6.75, x2: 25, y2: 9.25 },   // Street end
        ],
        target: {
            x: 10,
            y: 4.5,
            width: 2.4,
            height: 1.5,
            angle: -Math.PI / 2 // Facing down
        },
        cameraScale: 40, // pixels per meter
        cameraOffset: { x: 15, y: 8 }
    },

    2: {
        name: "Underground Hall to Parking Box",
        description: "Enter from 2.4m entrance, turn 90° left in the hall, and park in box 4m from entrance",
        startPosition: { x: 15, y: 8, angle: -Math.PI / 2 }, // Start in entrance, facing down/left
        walls: [
            // Entrance (2.4m wide, vertical)
            { x1: 13.8, y1: 8, x2: 13.8, y2: 12 },   // Left wall of entrance
            { x1: 16.2, y1: 8, x2: 16.2, y2: 12 },   // Right wall of entrance
            { x1: 13.8, y1: 12, x2: 16.2, y2: 12 },  // Top of entrance (street side)

            // Wall to the right of entrance (6m long)
            { x1: 16.2, y1: 2, x2: 16.2, y2: 8 },    // Right wall continuing down

            // Hall extending to the left (15m)
            { x1: 1, y1: 8, x2: 13.8, y2: 8 },       // Top wall of hall
            { x1: 1, y1: 2, x2: 1, y2: 8 },          // Left end wall
            { x1: 1, y1: 2, x2: 16.2, y2: 2 },       // Bottom wall of hall

            // Parking box (4m from entrance on the same side)
            // Box gate 2.14m, total width 3m, length 5.1m
            // Box starts 4m from entrance (x = 13.8 - 4 = 9.8)
            { x1: 9.8, y1: 8, x2: 7.66, y2: 8 },     // Left side of box opening
            { x1: 7.66, y1: 8, x2: 7.66, y2: 3 },    // Box left wall (5m deep, using 3m for parking + 2m approach)
            { x1: 7.66, y1: 3, x2: 10.66, y2: 3 },   // Box back wall (3m wide)
            { x1: 10.66, y1: 3, x2: 10.66, y2: 8 },  // Box right wall
            { x1: 10.66, y1: 8, x2: 11.94, y2: 8 },  // Right side of box opening (gate is 2.14m, starts at 11.94)
            { x1: 11.94, y1: 8, x2: 13.8, y2: 8 },   // Wall between box and entrance
        ],
        parkingBox: {
            x: 7.66,
            y: 3,
            width: 3,
            height: 5,
            gateWidth: 2.14,
            gateCenter: 9.16 // Center of the gate
        },
        target: {
            x: 9.16,
            y: 4.5,
            width: 2.5,
            height: 4,
            angle: -Math.PI / 2 // Facing into the box (down)
        },
        cameraScale: 35,
        cameraOffset: { x: 10, y: 6 }
    },

    3: {
        name: "Exit Parking Box",
        description: "Exit from parking box and navigate back to the entrance",
        startPosition: { x: 9.16, y: 4.5, angle: -Math.PI / 2 }, // Start inside box, facing out
        walls: [
            // Same walls as scenario 2
            // Entrance
            { x1: 13.8, y1: 8, x2: 13.8, y2: 12 },
            { x1: 16.2, y1: 8, x2: 16.2, y2: 12 },
            { x1: 13.8, y1: 12, x2: 16.2, y2: 12 },

            // Wall to the right
            { x1: 16.2, y1: 2, x2: 16.2, y2: 8 },

            // Hall
            { x1: 1, y1: 8, x2: 13.8, y2: 8 },
            { x1: 1, y1: 2, x2: 1, y2: 8 },
            { x1: 1, y1: 2, x2: 16.2, y2: 2 },

            // Parking box
            { x1: 9.8, y1: 8, x2: 7.66, y2: 8 },
            { x1: 7.66, y1: 8, x2: 7.66, y2: 3 },
            { x1: 7.66, y1: 3, x2: 10.66, y2: 3 },
            { x1: 10.66, y1: 3, x2: 10.66, y2: 8 },
            { x1: 10.66, y1: 8, x2: 11.94, y2: 8 },
            { x1: 11.94, y1: 8, x2: 13.8, y2: 8 },
        ],
        parkingBox: {
            x: 7.66,
            y: 3,
            width: 3,
            height: 5,
            gateWidth: 2.14,
            gateCenter: 9.16
        },
        target: {
            x: 15,
            y: 10,
            width: 2.4,
            height: 1.5,
            angle: Math.PI / 2 // Facing up (toward exit)
        },
        cameraScale: 35,
        cameraOffset: { x: 10, y: 6 }
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
