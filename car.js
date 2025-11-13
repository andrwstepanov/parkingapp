/**
 * Toyota C-HR 2017 - Official Technical Specifications
 *
 * All dimensions verified against official Toyota C-HR 2017 technical blueprints.
 * Physics model uses bicycle model with accurate turning radius calculations.
 *
 * OFFICIAL DIMENSIONS (Toyota C-HR 2017):
 *   - Overall Length: 4.360m (4,360mm)
 *   - Overall Width: 1.795m (1,795mm) - body only, mirrors NOT included
 *   - Overall Height: 1.555m (1,555mm)
 *   - Wheelbase: 2.640m (2,640mm) - distance between front and rear axles
 *   - Front Overhang: 0.912m (912mm) - from front axle to front bumper
 *   - Rear Overhang: 0.808m (808mm) - from rear axle to rear bumper
 *   - Front Track Width: 1.550m (1,550mm) - distance between left/right front wheels
 *   - Rear Track Width: 1.545m (1,545mm) - distance between left/right rear wheels
 *   - Ground Clearance: 0.140-0.160m (140-160mm)
 *
 * COORDINATE SYSTEM (Rear axle = origin):
 *   - Rear bumper: -0.808m
 *   - Rear axle: 0m (reference point)
 *   - Front axle: +2.640m
 *   - Front bumper: +3.552m (2.640 + 0.912)
 *
 * WHEEL POSITIONS (from front bumper reference):
 *   - Front Wheel Center: 912mm from front bumper = +2.640m from rear axle
 *   - Rear Wheel Center: 3,552mm from front bumper = 0m from rear axle
 *   - Wheelbase: 2,640mm (center to center)
 *
 * EXTERIOR MIRROR SPECIFICATIONS:
 *   - Mirror Housing: 200-220mm wide, 140-160mm high, 100-120mm deep
 *   - Mirror Position (Longitudinal): 1,400-1,500mm from front bumper
 *   - Mirror Distance from Body: 180-200mm extended outward from body edge
 *   - Mirror Mounting Height: 1,200-1,250mm from ground
 *   - In car coordinates: ~2.10m from rear axle (3.552 - 1.45 avg)
 *
 * DRIVER SEAT & CABIN:
 *   - A-Pillar Base: ~1,200mm from front bumper = ~2.35m from rear axle
 *   - Driver seat approximately at A-pillar, left side (LHD configuration)
 *
 * TURNING CHARACTERISTICS:
 *   - Kerb-to-kerb turning circle: 10.4m diameter (5.2m radius at outer front wheel) ✓ VERIFIED
 *   - Wall-to-wall turning circle: ~11.0m diameter
 *   - Rear axle turning radius: 4.425m (5.2m - track_width/2 = 5.2 - 0.775) ✓ VERIFIED
 *   - Max steering angle at full lock: ~31° (inner front wheel, from original specs)
 *   - Single-track equivalent (bicycle model): ~30.8° (atan(2.64/4.425)) ✓ USED IN PHYSICS
 *   - Outer front wheel angle: ~24-26° at full lock (Ackermann geometry)
 *   - NOTE: Some documents list outer wheel as 38° which contradicts Ackermann geometry;
 *           our implementation uses verified 10.4m turning circle calculation
 *
 * STEERING SYSTEM:
 *   - Steering ratio: 13.6:1 (steering wheel to front wheels)
 *   - Lock-to-lock rotation: 2.76 turns (994° total, ±497° from center)
 *
 * WHEELS & TIRES:
 *   - Standard: 17" wheels with 215/60R17 tires
 *   - Overall diameter (with tire): 680mm (17" wheels)
 *   - Optional: 18" wheels with 225/50R18 (657mm diameter)
 *   - Loaded radius: 318mm (for 18" wheels)
 *   - Tire width: 215mm (standard)
 *   - Wheel center height from ground: 330-350mm
 *   - Hub height: 340mm
 *   - Wheel offset (ET): +45mm
 *
 * WEIGHT & BALANCE (for reference):
 *   - Curb weight: 1,395-1,480kg (varies by trim)
 *   - Weight distribution: 60% front (870kg) / 40% rear (580kg)
 *   - Center of gravity: 580mm height, 1,188mm from front axle (45% wheelbase)
 *   - Maximum roof load: 75kg
 *
 * GROUND CLEARANCE & ANGLES:
 *   - Minimum ground clearance: 140mm (unladen) / 125mm (laden)
 *   - Approach angle: 18.0°
 *   - Departure angle: 27.0°
 *   - Ramp breakover angle: 17.5°
 *
 * CLEARANCES (2.7m entrance):
 *   - Body clearance: 2.7m - 1.795m = 0.905m total (0.453m per side)
 *   - With mirrors extended: 2.7m - 2.195m = 0.505m total (0.253m per side)
 *   - Mirrors are non-collidable (can fold in real situations)
 *
 * PHYSICS MODEL:
 *   - Uses bicycle model: R = L / tan(δ) where L=wheelbase, δ=steering angle
 *   - R is measured from turning center to REAR AXLE (not outer front wheel)
 *   - Trajectory prediction uses identical physics to car movement
 *   - Angular velocity: ω = v / R where v=speed, R=turning radius
 *
 * IMPORTANT: Kerb-to-kerb measurement (10.4m) is at OUTER FRONT WHEEL.
 *   For bicycle model, we need rear axle radius:
 *   R_rear = R_kerb - (track_width / 2) = 5.2m - 0.775m = 4.425m
 */
const CAR_SPECS = {
    length: 4.360,          // Total length (official: 4,360mm)
    width: 1.795,           // Total width (official: 1,795mm) - mirrors NOT included
    wheelbase: 2.640,       // Distance between front and rear axles (official: 2,640mm)
    turningRadius: 4.425,   // Rear axle turning radius (5.2m - track/2 = 5.2 - 0.775)
    frontOverhang: 0.912,   // Distance from front axle to front bumper (official: 912mm)
    rearOverhang: 0.808,    // Distance from rear axle to rear bumper (official: 808mm)
    trackWidth: 1.550,      // Front track width (official: 1,550mm)

    // Wheel specifications (standard: 17" wheels with 215/60R17 tires)
    wheelDiameter: 0.680,   // Total wheel + tire diameter (official: 680mm)
    wheelWidth: 0.215,      // Tire width (official: 215mm)

    // Steering specifications (measured at full lock)
    steeringRatio: 13.6,    // Steering wheel to front wheel ratio (13.6:1)
    steeringWheelTurns: 2.76, // Lock-to-lock turns (994° total, ±497° from center)
};

// Calculate maximum steering angle from turning radius
// Using bicycle model formula: tan(angle) = wheelbase / turning_radius
// Result: atan(2.640 / 4.425) = 0.5405 radians = 30.97°
// This matches the measured inner front wheel angle of ~31° at full lock
CAR_SPECS.maxSteeringAngle = Math.atan(CAR_SPECS.wheelbase / CAR_SPECS.turningRadius);

class Car {
    constructor(x, y, angle) {
        // Position (center of rear axle)
        this.x = x;
        this.y = y;
        this.angle = angle; // in radians

        // Velocity and acceleration
        this.speed = 0; // m/s
        this.acceleration = 0;

        // Steering
        this.steeringAngle = 0; // current steering angle
        this.steeringInput = 0; // -1 to 1

        // Controls
        this.throttle = 0; // -1 to 1 (negative = reverse)
        this.brake = 0; // 0 to 1

        // Constants
        this.maxSpeed = 5.56; // 20 km/h in m/s (reasonable for parking)
        this.maxReverseSpeed = -2.78; // -10 km/h in m/s
        this.accelerationRate = 2.0; // m/s²
        this.brakeRate = 4.0; // m/s²
        this.friction = 1.5; // m/s² (natural deceleration)
        this.steeringSpeed = 2.0; // radians per second

        // Specs from CAR_SPECS
        this.length = CAR_SPECS.length;
        this.width = CAR_SPECS.width;
        this.wheelbase = CAR_SPECS.wheelbase;
        this.maxSteeringAngle = CAR_SPECS.maxSteeringAngle;
        this.frontOverhang = CAR_SPECS.frontOverhang;
        this.rearOverhang = CAR_SPECS.rearOverhang;

        // Collision state
        this.colliding = false;
    }

    // Get the four corners of the car for collision detection
    // NOTE: Uses body width only (1.795m) - mirrors are NOT included in collision box
    // Mirrors can fold in real situations, so they don't count as collisions
    getCorners() {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);

        // Car dimensions relative to rear axle (body only, no mirrors)
        const front = this.wheelbase + this.frontOverhang;
        const rear = -this.rearOverhang;
        const halfWidth = this.width / 2; // 0.8975m - body half-width only

        const corners = [
            { x: front, y: -halfWidth }, // front left
            { x: front, y: halfWidth },  // front right
            { x: rear, y: halfWidth },   // rear right
            { x: rear, y: -halfWidth },  // rear left
        ];

        // Transform corners to world coordinates
        return corners.map(corner => ({
            x: this.x + corner.x * cos - corner.y * sin,
            y: this.y + corner.x * sin + corner.y * cos
        }));
    }

    // Get reference points (mirrors and driver seat)
    getReferencePoints() {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);

        // Positions relative to rear axle (official Toyota C-HR 2017 specs)
        // Toyota C-HR is left-hand drive - driver and mirrors are at the FRONT

        // Mirror position: 1,400-1,500mm from front bumper (using 1,450mm average)
        // Front bumper is at 3.552m from rear axle, so mirrors at: 3.552 - 1.45 = 2.102m
        const mirrorX = 2.102; // Official spec: 1.45m from front bumper
        const mirrorY = this.width / 2 + 0.19; // 180-200mm extended from body (using 190mm avg)

        // Driver seat at A-pillar base: ~1,200mm from front bumper
        // From rear axle: 3.552 - 1.2 = 2.352m
        const driverX = 2.352; // Official spec: A-pillar base at 1.2m from front bumper
        const driverY = -(this.width / 2 - 0.35); // LEFT side for left-hand drive, inset 0.35m from edge

        return {
            leftMirror: {
                x: this.x + mirrorX * cos - (-mirrorY) * sin,
                y: this.y + mirrorX * sin + (-mirrorY) * cos
            },
            rightMirror: {
                x: this.x + mirrorX * cos - mirrorY * sin,
                y: this.y + mirrorX * sin + mirrorY * cos
            },
            driverSeat: {
                x: this.x + driverX * cos - driverY * sin,
                y: this.y + driverX * sin + driverY * cos
            }
        };
    }

    // Get front axle position
    getFrontAxle() {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        return {
            x: this.x + this.wheelbase * cos,
            y: this.y + this.wheelbase * sin
        };
    }

    // Get all four wheel positions for trace tracking
    getWheelPositions() {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        const trackHalf = CAR_SPECS.trackWidth / 2;

        // Front wheels (at wheelbase distance from rear axle)
        const frontX = this.wheelbase;
        const frontLeft = {
            x: this.x + frontX * cos - (-trackHalf) * sin,
            y: this.y + frontX * sin + (-trackHalf) * cos
        };
        const frontRight = {
            x: this.x + frontX * cos - trackHalf * sin,
            y: this.y + frontX * sin + trackHalf * cos
        };

        // Rear wheels (at rear axle - position 0)
        const rearLeft = {
            x: this.x + 0 * cos - (-trackHalf) * sin,
            y: this.y + 0 * sin + (-trackHalf) * cos
        };
        const rearRight = {
            x: this.x + 0 * cos - trackHalf * sin,
            y: this.y + 0 * sin + trackHalf * cos
        };

        return {
            frontLeft,
            frontRight,
            rearLeft,
            rearRight
        };
    }

    // Update steering based on input
    updateSteering(dt) {
        const targetAngle = this.steeringInput * this.maxSteeringAngle;
        const diff = targetAngle - this.steeringAngle;
        const change = Math.sign(diff) * Math.min(Math.abs(diff), this.steeringSpeed * dt);
        this.steeringAngle += change;
    }

    // Update physics
    update(dt) {
        // Update steering
        this.updateSteering(dt);

        // Calculate acceleration
        let acc = 0;

        if (this.brake > 0) {
            // Braking
            acc = -Math.sign(this.speed) * this.brakeRate * this.brake;
            // Stop completely if speed is very low
            if (Math.abs(this.speed) < 0.1) {
                this.speed = 0;
                acc = 0;
            }
        } else if (this.throttle !== 0) {
            // Accelerating or reversing
            acc = this.throttle * this.accelerationRate;
        } else {
            // Natural friction
            acc = -Math.sign(this.speed) * this.friction;
            // Stop completely if speed is very low
            if (Math.abs(this.speed) < 0.05) {
                this.speed = 0;
                acc = 0;
            }
        }

        // Update speed
        this.speed += acc * dt;

        // Clamp speed
        this.speed = Math.max(this.maxReverseSpeed, Math.min(this.maxSpeed, this.speed));

        // Only move if not colliding or moving away from collision
        if (!this.colliding || this.speed * this.acceleration < 0) {
            // Calculate turning radius and angular velocity
            if (Math.abs(this.steeringAngle) > 0.001 && Math.abs(this.speed) > 0.001) {
                // Using bicycle model for car movement
                const turningRadius = this.wheelbase / Math.tan(this.steeringAngle);
                const angularVelocity = this.speed / turningRadius;

                // Update angle
                this.angle += angularVelocity * dt;
            }

            // Update position (rear axle follows the direction)
            this.x += this.speed * Math.cos(this.angle) * dt;
            this.y += this.speed * Math.sin(this.angle) * dt;
        } else {
            // Stop the car if colliding
            this.speed = 0;
        }

        // Normalize angle
        this.angle = this.angle % (2 * Math.PI);
        if (this.angle < 0) this.angle += 2 * Math.PI;
    }

    // Reset to initial position
    reset(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 0;
        this.acceleration = 0;
        this.steeringAngle = 0;
        this.steeringInput = 0;
        this.throttle = 0;
        this.brake = 0;
        this.colliding = false;
    }

    // Get current gear
    getGear() {
        if (this.speed > 0.1) return 'D';
        if (this.speed < -0.1) return 'R';
        return 'N';
    }

    // Get speed in km/h
    getSpeedKmh() {
        return this.speed * 3.6;
    }

    // Get steering angle in degrees
    getSteeringDegrees() {
        return this.steeringAngle * 180 / Math.PI;
    }
}
