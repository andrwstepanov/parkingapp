// Main game logic

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);

        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Current scenario
        this.currentScenarioId = 1;
        this.scenario = SCENARIOS[this.currentScenarioId];

        // Create car
        this.car = new Car(
            this.scenario.startPosition.x,
            this.scenario.startPosition.y,
            this.scenario.startPosition.angle
        );

        // Input state
        this.keys = {};

        // Game state
        this.isPaused = false;
        this.isCompleted = false;
        this.lastTime = performance.now();

        // Wheel traces for trajectory visualization
        this.wheelTraces = {
            frontLeft: [],
            frontRight: [],
            rearLeft: [],
            rearRight: []
        };
        this.traceInterval = 0.05; // Record trace every 0.05 seconds
        this.lastTraceTime = 0;
        this.maxTracePoints = 500; // Limit trace length to prevent memory issues

        // Setup event listeners
        this.setupEventListeners();

        // Setup camera
        this.updateCamera();

        // Start game loop
        this.gameLoop();
    }

    resizeCanvas() {
        // Make canvas responsive while maintaining aspect ratio
        const container = this.canvas.parentElement;
        const width = container.clientWidth;
        const height = Math.min(width * 0.75, window.innerHeight * 0.7);

        this.canvas.width = width;
        this.canvas.height = height;
    }

    setupEventListeners() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Reset on R key
            if (e.key === 'r' || e.key === 'R') {
                this.resetCar();
            }

            // Prevent default for arrow keys and space
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Scenario selection buttons
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const scenarioId = parseInt(btn.dataset.scenario);
                this.loadScenario(scenarioId);

                // Update active button
                document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetCar();
        });
    }

    loadScenario(scenarioId) {
        this.currentScenarioId = scenarioId;
        this.scenario = SCENARIOS[scenarioId];
        this.isCompleted = false;
        this.resetCar();
        this.updateCamera();
    }

    resetCar() {
        const start = this.scenario.startPosition;
        this.car.reset(start.x, start.y, start.angle);
        this.isCompleted = false;
        this.hideCollisionWarning();

        // Clear wheel traces
        this.wheelTraces = {
            frontLeft: [],
            frontRight: [],
            rearLeft: [],
            rearRight: []
        };
        this.lastTraceTime = 0;
    }

    updateCamera() {
        this.renderer.setCamera(
            this.scenario.cameraScale,
            this.scenario.cameraOffset.x,
            this.scenario.cameraOffset.y
        );
    }

    updateCarControls() {
        // Throttle (forward/reverse)
        if (this.keys['ArrowUp']) {
            this.car.throttle = 1;
            this.car.brake = 0;
        } else if (this.keys['ArrowDown']) {
            this.car.throttle = -1;
            this.car.brake = 0;
        } else {
            this.car.throttle = 0;
        }

        // Brake
        if (this.keys[' ']) {
            this.car.brake = 1;
            this.car.throttle = 0;
        } else if (!this.keys['ArrowUp'] && !this.keys['ArrowDown']) {
            this.car.brake = 0;
        }

        // Steering
        if (this.keys['ArrowLeft']) {
            this.car.steeringInput = -1;
        } else if (this.keys['ArrowRight']) {
            this.car.steeringInput = 1;
        } else {
            this.car.steeringInput = 0;
        }
    }

    updateUI() {
        // Speed
        document.getElementById('speed-value').textContent =
            `${Math.abs(this.car.getSpeedKmh()).toFixed(1)} km/h`;

        // Gear
        document.getElementById('gear-value').textContent = this.car.getGear();

        // Steering
        document.getElementById('steering-value').textContent =
            `${this.car.getSteeringDegrees().toFixed(0)}°`;

        // Position
        document.getElementById('position-value').textContent =
            `X: ${this.car.x.toFixed(1)}m Y: ${this.car.y.toFixed(1)}m`;
    }

    showCollisionWarning() {
        document.getElementById('collision-warning').classList.remove('hidden');
    }

    hideCollisionWarning() {
        document.getElementById('collision-warning').classList.add('hidden');
    }

    checkCollisions() {
        const wasColliding = this.car.colliding;
        this.car.colliding = checkCarWallCollision(this.car, this.scenario.walls);

        if (this.car.colliding && !wasColliding) {
            this.showCollisionWarning();
        } else if (!this.car.colliding && wasColliding) {
            this.hideCollisionWarning();
        }
    }

    checkCompletion() {
        if (this.isCompleted) return;

        if (checkCarInTarget(this.car, this.scenario.target)) {
            this.isCompleted = true;
            this.showCompletionMessage();
        }
    }

    showCompletionMessage() {
        // Create completion overlay
        const overlay = document.createElement('div');
        overlay.className = 'completion-overlay';
        overlay.innerHTML = `
            <div class="completion-message">
                <h2>Excellent Parking!</h2>
                <p>You've successfully completed this scenario.</p>
                <button onclick="location.reload()">Continue Training</button>
            </div>
        `;
        document.body.appendChild(overlay);

        // Add styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .completion-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.5s ease;
            }

            .completion-message {
                background: white;
                padding: 40px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                animation: slideUp 0.5s ease;
            }

            .completion-message h2 {
                color: #27ae60;
                font-size: 2em;
                margin-bottom: 20px;
            }

            .completion-message p {
                font-size: 1.2em;
                margin-bottom: 30px;
                color: #555;
            }

            .completion-message button {
                padding: 15px 40px;
                background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1.1em;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .completion-message button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(39, 174, 96, 0.4);
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    update(dt) {
        if (this.isPaused || this.isCompleted) return;

        // Update car controls from input
        this.updateCarControls();

        // Update car physics
        this.car.update(dt);

        // Record wheel traces at intervals
        this.lastTraceTime += dt;
        if (this.lastTraceTime >= this.traceInterval && Math.abs(this.car.speed) > 0.01) {
            this.lastTraceTime = 0;
            const positions = this.car.getWheelPositions();

            // Add new trace points
            this.wheelTraces.frontLeft.push({ x: positions.frontLeft.x, y: positions.frontLeft.y });
            this.wheelTraces.frontRight.push({ x: positions.frontRight.x, y: positions.frontRight.y });
            this.wheelTraces.rearLeft.push({ x: positions.rearLeft.x, y: positions.rearLeft.y });
            this.wheelTraces.rearRight.push({ x: positions.rearRight.x, y: positions.rearRight.y });

            // Limit trace length
            if (this.wheelTraces.frontLeft.length > this.maxTracePoints) {
                this.wheelTraces.frontLeft.shift();
                this.wheelTraces.frontRight.shift();
                this.wheelTraces.rearLeft.shift();
                this.wheelTraces.rearRight.shift();
            }
        }

        // Check collisions
        this.checkCollisions();

        // Check completion
        this.checkCompletion();

        // Update UI
        this.updateUI();
    }

    render() {
        this.renderer.drawScenario(this.scenario, this.car, this.wheelTraces);
    }

    gameLoop() {
        const currentTime = performance.now();
        const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Cap dt at 100ms
        this.lastTime = currentTime;

        this.update(dt);
        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    const game = new Game();
});
