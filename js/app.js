var Asteroids = Asteroids || {};

Asteroids.game = new Phaser.Game(1920, 1080, Phaser.AUTO);

Asteroids.game.state.add('Boot', Asteroids.BootState);
Asteroids.game.state.add('Preload', Asteroids.PreloadState);
Asteroids.game.state.add('Game', Asteroids.GameState);
Asteroids.game.state.add('Menu', Asteroids.MenuState);

Asteroids.game.state.start('Boot');
