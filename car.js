// Toyota C-HR 2021 HEV Specifications (in meters)
const CAR_SPECS = {
    length: 4.39,           // Total length
    width: 1.795,           // Total width
    wheelbase: 2.64,        // Distance between front and rear axles
    turningRadius: 5.21,    // Curb-to-curb turning radius
    frontOverhang: 0.88,    // Distance from front axle to front bumper
    rearOverhang: 0.87,     // Distance from rear axle to rear bumper
    trackWidth: 1.52,       // Distance between left and right wheels
};

// Calculate maximum steering angle from turning radius
// Using formula: turning_radius = wheelbase / sin(max_angle)
CAR_SPECS.maxSteeringAngle = Math.asin(CAR_SPECS.wheelbase / CAR_SPECS.turningRadius);

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
    getCorners() {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);

        // Car dimensions relative to rear axle
        const front = this.wheelbase + this.frontOverhang;
        const rear = -this.rearOverhang;
        const halfWidth = this.width / 2;

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

        // Positions relative to rear axle
        const mirrorX = this.wheelbase * 0.3; // Mirrors at 30% of wheelbase
        const mirrorY = this.width / 2 + 0.15; // Slightly outside car width
        const driverX = this.wheelbase * 0.25; // Driver seat position
        const driverY = this.width / 2 - 0.3; // Right side (assuming right-hand drive for parking reference)

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
