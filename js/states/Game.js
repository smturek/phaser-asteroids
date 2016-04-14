var Asteroids = Asteroids || {};

Asteroids.GameState = {
    init: function() {
        this.PLAYER_PROPERTIES = {
            drag: 100,
            acceleration: 300,
            maxVelocity: 300,
            angularVelocity: 200,
            bulletSpeed: 500,
            bulletInterval: 250,
            bulletLifeSpan: 2000,
            startingLives: 3,
            timeToReset: 3
        };

        this.ASTEROID_PROPERTIES = {
            startingNumber: 4,
            maxNumber: 20,
            increment: 2,
            minVelocity: 50,
            minAngularVelocity: 0,
            maxAngularVelocity: 200,

            large: {maxVelocity: 150, score: 20, nextSize: 'medium', pieces: 2, scale: 2},
            medium: {maxVelocity: 200, score: 50, nextSize: 'small', pieces: 2, scale: 1},
            small: {maxVelocity: 300, score: 100, scale: 0.5}
        };

        this.HUD_STYLE = {font: '40px Arial', fill: '#FFFFFF', align: 'center'};
    },
    create: function() {
        this.initPlayer();
        this.initBullets();
        this.initAsteroids();
        this.placeAsteroids();

        //controls
        this.key_left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.key_right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.key_thrust = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.key_fire = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    update: function() {
        if (this.player.alive) {
            this.checkPlayerInput();
        }

        this.checkBoundaries(this.player);
        this.bulletGroup.forEachExists(this.checkBoundaries, this);
        this.asteroidGroup.forEachExists(this.checkBoundaries, this);

        //collisions
        this.game.physics.arcade.overlap(this.player, this.asteroidGroup, this.asteroidCollision, null, this);
        this.game.physics.arcade.overlap(this.bulletGroup, this.asteroidGroup, this.asteroidCollision, null, this);
    },
    initPlayer: function() {
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
        this.player.angle = -90;
        this.player.anchor.setTo(0.5);
        this.game.physics.enable(this.player);
        this.player.body.drag.set(this.PLAYER_PROPERTIES.drag);
        this.player.body.maxVelocity.set(this.PLAYER_PROPERTIES.maxVelocity);

        this.playerLives = this.PLAYER_PROPERTIES.startingLives;
        this.playerScore = 0;

        this.livesText = this.game.add.text(20, 10, this.playerLives, this.HUD_STYLE);

        this.scoreText = this.game.add.text(this.game.width - 20, 10, this.playerScore, this.HUD_STYLE);
        this.scoreText.align = 'right';
        this.scoreText.anchor.set(1,0);
    },
    initBullets: function() {
        this.bulletGroup = this.game.add.group();
        this.bulletGroup.enableBody = true;
        this.bulletInterval = 0;
    },
    initAsteroids: function() {
        this.asteroidGroup = this.game.add.group();
        this.asteroidGroup.enableBody = true;
        this.asteroidCount = this.ASTEROID_PROPERTIES.startingNumber;
    },
    checkPlayerInput: function() {
        if (this.key_left.isDown) {
            this.player.body.angularVelocity = -this.PLAYER_PROPERTIES.angularVelocity;
        }
        else if (this.key_right.isDown) {
            this.player.body.angularVelocity = this.PLAYER_PROPERTIES.angularVelocity;
        }
        else {
            this.player.body.angularVelocity = 0;
        }

        if (this.key_thrust.isDown) {
            this.game.physics.arcade.accelerationFromRotation(this.player.rotation, this.PLAYER_PROPERTIES.acceleration, this.player.body.acceleration);
        }
        else {
            this.player.body.acceleration.set(0);
        }

        if (this.key_fire.isDown) {
            this.fire();
        }
    },
    checkBoundaries: function(sprite) {
        if (sprite.x < 0) {
            sprite.x = this.game.width;
        }
        else if (sprite.x > this.game.width) {
            sprite.x = 0;
        }

        if (sprite.y < 0) {
            sprite.y = this.game.height;
        }
        else if (sprite.y > this.game.height) {
            sprite.y = 0;
        }
    },
    fire: function() {
        if (this.game.time.now > this.bulletInterval) {
            var bullet = this.bulletGroup.getFirstExists(false);
            var length = this.player.width * 0.5;
            var x = this.player.x + (Math.cos(this.player.rotation) * length);
            var y = this.player.y + (Math.sin(this.player.rotation) * length);

            if (!bullet) {
                bullet = this.game.add.sprite(x, y, 'bullet');
                bullet.anchor.setTo(0.5);
                bullet.scale.setTo(0.25);
                this.bulletGroup.add(bullet);
            }
            else {
                bullet.reset(x,y);
            }

            bullet.lifespan = this.PLAYER_PROPERTIES.bulletLifeSpan;
            bullet.rotation = this.player.rotation;

            this.game.physics.arcade.velocityFromRotation(this.player.rotation, this.PLAYER_PROPERTIES.bulletSpeed, bullet.body.velocity);
            this.bulletInterval = this.game.time.now + this.PLAYER_PROPERTIES.bulletInterval;
        }
    },
    createAsteroid: function(x, y, size, pieces) {
        if (pieces === undefined) {
            pieces = 1;
        }

        for (var i = 0; i < pieces; i++) {
            var variant = this.game.rnd.integerInRange(1, 2);
            //shouldn't just make new one every time.  Do like bullets instead
            var asteroid = this.asteroidGroup.create(x, y, 'asteroid' + variant);
            asteroid.anchor.set(0.5);
            asteroid.body.angularVelocity = this.game.rnd.integerInRange(this.ASTEROID_PROPERTIES.minAngularVelocity, this.ASTEROID_PROPERTIES.maxAngularVelocity);
            asteroid.asteroidSize = size;

            asteroid.scale.setTo(this.ASTEROID_PROPERTIES[size].scale);

            var randomAngle = this.game.math.degToRad(this.game.rnd.angle());
            var randomVelocity = this.game.rnd.integerInRange(this.ASTEROID_PROPERTIES.minVelocity, this.ASTEROID_PROPERTIES[size].maxVelocity);

            this.game.physics.arcade.velocityFromRotation(randomAngle, randomVelocity, asteroid.body.velocity);
        }
    },
    placeAsteroids: function() {
        for (var i=0; i < this.asteroidCount; i++) {
            var side = Math.round(Math.random());
            var x, y;

            if (side) {
                x = Math.round(Math.random()) * this.game.width;
                y = Math.random() * this.game.height;
            }
            else {
                x = Math.random() * this.game.width;
                y = Math.round(Math.random()) * this.game.height;
            }

            this.createAsteroid(x, y, 'large');
        }
    },
    asteroidCollision: function(target, asteroid) {
        target.kill();
        asteroid.kill();

        if (target.key == 'player') {
            this.destroyShip();
        }

        this.splitAsteroid(asteroid);
        this.updateScore(this.ASTEROID_PROPERTIES[asteroid.asteroidSize].score);

        if (!this.asteroidGroup.countLiving()) {
            this.game.time.events.add(Phaser.Timer.SECOND * this.PLAYER_PROPERTIES.timeToReset, this.nextLevel, this);
        }
    },
    destroyShip: function() {
        this.playerLives--;
        this.livesText.text = this.playerLives;

        if (this.playerLives) {
            this.game.time.events.add(Phaser.Timer.SECOND * this.PLAYER_PROPERTIES.timeToReset, this.resetShip, this);
        }
        else {
            this.gameOverText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'GAME OVER', this.HUD_STYLE);
            this.gameOverText.anchor.set(0.5);
        }
    },
    resetShip: function() {
        this.player.reset(this.game.world.centerX, this.game.world.centerY);
        this.player.angle = -90;
    },
    splitAsteroid: function(asteroid) {
        if (this.ASTEROID_PROPERTIES[asteroid.asteroidSize].nextSize) {
            this.createAsteroid(asteroid.x, asteroid.y, this.ASTEROID_PROPERTIES[asteroid.asteroidSize].nextSize, this.ASTEROID_PROPERTIES[asteroid.asteroidSize].pieces);
        }
    },
    updateScore: function(score) {
        this.playerScore += score;
        this.scoreText.text = this.playerScore;
    },
    nextLevel: function() {
        this.asteroidGroup.removeAll(true);

        if (this.asteroidCount < this.ASTEROID_PROPERTIES.maxNumber) {
            this.asteroidCount += this.ASTEROID_PROPERTIES.increment;
        }

        this.placeAsteroids();
    }
};
