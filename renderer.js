class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = 40; // pixels per meter
        this.offsetX = 0;
        this.offsetY = 0;
    }

    setCamera(scale, offsetX, offsetY) {
        this.scale = scale;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    // Convert world coordinates to screen coordinates
    worldToScreen(x, y) {
        return {
            x: (x - this.offsetX) * this.scale + this.canvas.width / 2,
            y: (y - this.offsetY) * this.scale + this.canvas.height / 2
        };
    }

    // Clear the canvas
    clear() {
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Draw a wall
    drawWall(wall) {
        const p1 = this.worldToScreen(wall.x1, wall.y1);
        const p2 = this.worldToScreen(wall.x2, wall.y2);

        this.ctx.strokeStyle = '#34495e';
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();

        // Draw wall edge highlight
        this.ctx.strokeStyle = '#95a5a6';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }

    // Draw parking target zone
    drawTarget(target) {
        const pos = this.worldToScreen(target.x, target.y);
        const width = target.width * this.scale;
        const height = target.height * this.scale;

        this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
        this.ctx.rotate(target.angle);

        // Draw dashed rectangle
        this.ctx.strokeStyle = '#27ae60';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([10, 10]);
        this.ctx.strokeRect(-width / 2, -height / 2, width, height);

        // Draw semi-transparent fill
        this.ctx.fillStyle = 'rgba(39, 174, 96, 0.2)';
        this.ctx.fillRect(-width / 2, -height / 2, width, height);

        // Draw target indicator
        this.ctx.fillStyle = '#27ae60';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('TARGET', 0, 0);

        this.ctx.restore();
        this.ctx.setLineDash([]);
    }

    // Draw parking box outline
    drawParkingBox(box) {
        if (!box) return;

        const pos = this.worldToScreen(box.x, box.y);
        const width = box.width * this.scale;
        const height = box.height * this.scale;

        // Draw box outline
        this.ctx.strokeStyle = '#f39c12';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([15, 10]);
        this.ctx.strokeRect(pos.x, pos.y, width, height);
        this.ctx.setLineDash([]);

        // Draw gate marking
        const gatePos = this.worldToScreen(box.gateCenter, box.y + box.height);
        const gateWidth = box.gateWidth * this.scale;

        this.ctx.strokeStyle = '#2ecc71';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(gatePos.x - gateWidth / 2, gatePos.y);
        this.ctx.lineTo(gatePos.x + gateWidth / 2, gatePos.y);
        this.ctx.stroke();
    }

    // Draw grid for reference
    drawGrid(scenario) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        // Determine grid bounds based on scenario
        const minX = -5, maxX = 30;
        const minY = -5, maxY = 20;

        // Draw vertical lines (every meter)
        for (let x = minX; x <= maxX; x += 1) {
            const p1 = this.worldToScreen(x, minY);
            const p2 = this.worldToScreen(x, maxY);
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
        }

        // Draw horizontal lines (every meter)
        for (let y = minY; y <= maxY; y += 1) {
            const p1 = this.worldToScreen(minX, y);
            const p2 = this.worldToScreen(maxX, y);
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
        }
    }

    // Draw the car
    drawCar(car) {
        const corners = car.getCorners();
        const screenCorners = corners.map(c => this.worldToScreen(c.x, c.y));

        // Draw car body shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        screenCorners.forEach((corner, i) => {
            if (i === 0) this.ctx.moveTo(corner.x + 3, corner.y + 3);
            else this.ctx.lineTo(corner.x + 3, corner.y + 3);
        });
        this.ctx.closePath();
        this.ctx.fill();

        // Draw car body
        if (car.colliding) {
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.strokeStyle = '#c0392b';
        } else {
            this.ctx.fillStyle = '#3498db';
            this.ctx.strokeStyle = '#2980b9';
        }
        this.ctx.lineWidth = 3;

        this.ctx.beginPath();
        screenCorners.forEach((corner, i) => {
            if (i === 0) this.ctx.moveTo(corner.x, corner.y);
            else this.ctx.lineTo(corner.x, corner.y);
        });
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Draw car details
        this.drawCarDetails(car);

        // Draw reference points
        this.drawReferencePoints(car);

        // Draw wheels
        this.drawWheels(car);
    }

    drawCarDetails(car) {
        const pos = this.worldToScreen(car.x, car.y);

        this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
        this.ctx.rotate(car.angle);

        const scale = this.scale;
        const bodyColor = car.colliding ? '#c0392b' : '#2980b9';

        // Draw wheel arches (before other details)
        this.ctx.fillStyle = car.colliding ? '#a93226' : '#1f5f8b';

        // Front wheel arches
        const frontArchX = car.wheelbase * scale;
        const archWidth = CAR_SPECS.wheelDiameter * 1.1 * scale;
        const archHeight = car.width * 0.45 * scale;

        this.ctx.fillRect(frontArchX - archWidth / 2, -archHeight / 2, archWidth, archHeight);

        // Rear wheel arches
        this.ctx.fillRect(-archWidth / 2, -archHeight / 2, archWidth, archHeight);

        // Draw windshield (C-HR has a swept-back design)
        const windshieldStartX = car.wheelbase * 0.4 * scale;
        const windshieldEndX = car.wheelbase * 0.7 * scale;
        const windshieldWidth = car.width * 0.65 * scale;

        this.ctx.fillStyle = 'rgba(150, 190, 220, 0.6)';
        this.ctx.beginPath();
        this.ctx.moveTo(windshieldStartX, -windshieldWidth / 2);
        this.ctx.lineTo(windshieldEndX, -windshieldWidth / 2);
        this.ctx.lineTo(windshieldEndX, windshieldWidth / 2);
        this.ctx.lineTo(windshieldStartX, windshieldWidth / 2);
        this.ctx.closePath();
        this.ctx.fill();

        // Draw front windshield slope line (A-pillar)
        this.ctx.strokeStyle = car.colliding ? '#7f1d1d' : '#1a4d6d';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(windshieldStartX, -windshieldWidth / 2);
        this.ctx.lineTo(windshieldStartX, windshieldWidth / 2);
        this.ctx.stroke();

        // Draw rear window (C-HR has distinctive rear glass)
        const rearWindowX = car.wheelbase * 0.1 * scale;
        const rearWindowWidth = car.width * 0.55 * scale;
        const rearWindowLength = car.wheelbase * 0.25 * scale;

        this.ctx.fillStyle = 'rgba(130, 170, 200, 0.5)';
        this.ctx.fillRect(rearWindowX - rearWindowLength / 2, -rearWindowWidth / 2,
                         rearWindowLength, rearWindowWidth);

        // Draw roof line
        this.ctx.strokeStyle = car.colliding ? '#8b1e1e' : '#1e5a7a';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.moveTo(windshieldStartX, -car.width * 0.35 * scale);
        this.ctx.lineTo(rearWindowX, -car.width * 0.35 * scale);
        this.ctx.moveTo(windshieldStartX, car.width * 0.35 * scale);
        this.ctx.lineTo(rearWindowX, car.width * 0.35 * scale);
        this.ctx.stroke();

        // Draw hood line
        const hoodX = (car.wheelbase + car.frontOverhang * 0.6) * scale;
        this.ctx.strokeStyle = car.colliding ? '#c0392b' : '#2c3e50';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(hoodX, -car.width * 0.4 * scale);
        this.ctx.lineTo(hoodX, car.width * 0.4 * scale);
        this.ctx.stroke();

        // Draw headlights
        const headlightX = (car.wheelbase + car.frontOverhang * 0.85) * scale;
        const headlightY = car.width * 0.35 * scale;
        const headlightSize = 0.15 * scale;

        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(headlightX - headlightSize / 2, -headlightY - headlightSize / 2,
                         headlightSize, headlightSize);
        this.ctx.fillRect(headlightX - headlightSize / 2, headlightY - headlightSize / 2,
                         headlightSize, headlightSize);

        // Draw taillights
        const taillightX = -(car.rearOverhang * 0.8) * scale;
        const taillightY = car.width * 0.35 * scale;
        const taillightSize = 0.12 * scale;

        this.ctx.fillStyle = '#ff3333';
        this.ctx.fillRect(taillightX - taillightSize / 2, -taillightY - taillightSize / 2,
                         taillightSize, taillightSize);
        this.ctx.fillRect(taillightX - taillightSize / 2, taillightY - taillightSize / 2,
                         taillightSize, taillightSize);

        // Draw C-HR character line (body crease)
        this.ctx.strokeStyle = car.colliding ? '#a93226' : '#236fa5';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo((car.wheelbase + car.frontOverhang * 0.5) * scale, -car.width * 0.45 * scale);
        this.ctx.lineTo(-car.rearOverhang * 0.3 * scale, -car.width * 0.48 * scale);
        this.ctx.moveTo((car.wheelbase + car.frontOverhang * 0.5) * scale, car.width * 0.45 * scale);
        this.ctx.lineTo(-car.rearOverhang * 0.3 * scale, car.width * 0.48 * scale);
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawReferencePoints(car) {
        const refs = car.getReferencePoints();

        // Draw left mirror (more realistic shape)
        const leftMirror = this.worldToScreen(refs.leftMirror.x, refs.leftMirror.y);

        // Mirror housing
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.beginPath();
        this.ctx.arc(leftMirror.x, leftMirror.y, 8, 0, 2 * Math.PI);
        this.ctx.fill();

        // Mirror glass
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.beginPath();
        this.ctx.arc(leftMirror.x, leftMirror.y, 5, 0, 2 * Math.PI);
        this.ctx.fill();

        // Mirror glass reflection
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(leftMirror.x - 1, leftMirror.y - 1, 2, 0, 2 * Math.PI);
        this.ctx.fill();

        // Draw right mirror
        const rightMirror = this.worldToScreen(refs.rightMirror.x, refs.rightMirror.y);

        // Mirror housing
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.beginPath();
        this.ctx.arc(rightMirror.x, rightMirror.y, 8, 0, 2 * Math.PI);
        this.ctx.fill();

        // Mirror glass
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.beginPath();
        this.ctx.arc(rightMirror.x, rightMirror.y, 5, 0, 2 * Math.PI);
        this.ctx.fill();

        // Mirror glass reflection
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(rightMirror.x - 1, rightMirror.y - 1, 2, 0, 2 * Math.PI);
        this.ctx.fill();

        // Draw driver seat indicator (more prominent on LEFT side)
        const driver = this.worldToScreen(refs.driverSeat.x, refs.driverSeat.y);

        // Driver seat circle
        this.ctx.fillStyle = '#ff6b35';
        this.ctx.beginPath();
        this.ctx.arc(driver.x, driver.y, 7, 0, 2 * Math.PI);
        this.ctx.fill();

        // Highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.beginPath();
        this.ctx.arc(driver.x - 1, driver.y - 1, 3, 0, 2 * Math.PI);
        this.ctx.fill();

        // Border
        this.ctx.strokeStyle = '#c44820';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(driver.x, driver.y, 7, 0, 2 * Math.PI);
        this.ctx.stroke();

        // Draw label with background
        this.ctx.fillStyle = 'rgba(255, 107, 53, 0.9)';
        this.ctx.fillRect(driver.x - 25, driver.y - 20, 50, 14);

        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('DRIVER', driver.x, driver.y - 13);
    }

    drawWheels(car) {
        const pos = this.worldToScreen(car.x, car.y);

        this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
        this.ctx.rotate(car.angle);

        const scale = this.scale;
        // Use actual wheel dimensions: diameter (length along car) and width (perpendicular)
        const wheelDiameter = CAR_SPECS.wheelDiameter * scale; // 0.69m - 17" wheel + tire
        const wheelWidth = CAR_SPECS.wheelWidth * scale;       // 0.22m - 215mm tire width
        const trackHalf = CAR_SPECS.trackWidth / 2 * scale;

        // Front wheels (with steering)
        this.ctx.save();
        this.ctx.translate(car.wheelbase * scale, 0);

        // Front left wheel
        this.ctx.save();
        this.ctx.translate(0, -trackHalf);
        this.ctx.rotate(car.steeringAngle);

        // Wheel tire (black)
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(-wheelDiameter / 2, -wheelWidth / 2, wheelDiameter, wheelWidth);

        // Wheel rim (dark gray)
        this.ctx.fillStyle = '#4a4a4a';
        this.ctx.fillRect(-wheelDiameter / 2 + 3, -wheelWidth / 2 + 2, wheelDiameter - 6, wheelWidth - 4);

        this.ctx.restore();

        // Front right wheel
        this.ctx.save();
        this.ctx.translate(0, trackHalf);
        this.ctx.rotate(car.steeringAngle);

        // Wheel tire (black)
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(-wheelDiameter / 2, -wheelWidth / 2, wheelDiameter, wheelWidth);

        // Wheel rim (dark gray)
        this.ctx.fillStyle = '#4a4a4a';
        this.ctx.fillRect(-wheelDiameter / 2 + 3, -wheelWidth / 2 + 2, wheelDiameter - 6, wheelWidth - 4);

        this.ctx.restore();

        this.ctx.restore();

        // Rear wheels (no steering)
        // Rear left wheel
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(-wheelDiameter / 2, -trackHalf - wheelWidth / 2, wheelDiameter, wheelWidth);

        // Rear left rim
        this.ctx.fillStyle = '#4a4a4a';
        this.ctx.fillRect(-wheelDiameter / 2 + 3, -trackHalf - wheelWidth / 2 + 2, wheelDiameter - 6, wheelWidth - 4);

        // Rear right wheel
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(-wheelDiameter / 2, trackHalf - wheelWidth / 2, wheelDiameter, wheelWidth);

        // Rear right rim
        this.ctx.fillStyle = '#4a4a4a';
        this.ctx.fillRect(-wheelDiameter / 2 + 3, trackHalf - wheelWidth / 2 + 2, wheelDiameter - 6, wheelWidth - 4);

        this.ctx.restore();
    }

    // Draw scenario
    drawScenario(scenario, car) {
        this.clear();
        this.drawGrid(scenario);

        // Draw target first (under car)
        if (scenario.target) {
            this.drawTarget(scenario.target);
        }

        // Draw parking box if present
        if (scenario.parkingBox) {
            this.drawParkingBox(scenario.parkingBox);
        }

        // Draw walls
        scenario.walls.forEach(wall => this.drawWall(wall));

        // Draw car
        this.drawCar(car);

        // Draw steering indicator
        this.drawSteeringIndicator(car);
    }

    drawSteeringIndicator(car) {
        const radius = 30;
        const centerX = 60;
        const centerY = this.canvas.height - 60;

        // Draw circle background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.strokeStyle = '#34495e';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Draw center dot
        this.ctx.fillStyle = '#95a5a6';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
        this.ctx.fill();

        // Draw steering indicator
        const angle = car.steeringAngle;
        const indicatorLength = radius - 8;

        this.ctx.strokeStyle = '#e74c3c';
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(
            centerX + indicatorLength * Math.sin(angle),
            centerY - indicatorLength * Math.cos(angle)
        );
        this.ctx.stroke();

        // Draw max steering range
        this.ctx.strokeStyle = 'rgba(52, 73, 94, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);

        const maxAngle = car.maxSteeringAngle;

        // Left limit
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(
            centerX + (radius - 8) * Math.sin(-maxAngle),
            centerY - (radius - 8) * Math.cos(-maxAngle)
        );
        this.ctx.stroke();

        // Right limit
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(
            centerX + (radius - 8) * Math.sin(maxAngle),
            centerY - (radius - 8) * Math.cos(maxAngle)
        );
        this.ctx.stroke();

        this.ctx.setLineDash([]);

        // Draw label
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('STEERING', centerX, centerY + radius + 15);
    }
}
