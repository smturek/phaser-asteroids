var Asteroids = Asteroids || {};

Asteroids.PreloadState = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loadBar');
        this.preloadBar.anchor.setTo(0.5);
        this.preloadBar.scale.setTo(100, 1);

        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('player', 'assets/ship.png');
        this.load.image('asteroid1', 'assets/oldMan.png');
        this.load.image('asteroid2', 'assets/oldMan2.png');
        this.load.image('bullet', 'assets/monster.png');
    },
    create: function() {
        this.state.start('Game');
    }
};
