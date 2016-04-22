var Asteroids = Asteroids || {};

Asteroids.MenuState = {
    create: function() {
        this.spinningHead = this.game.add.sprite(this.game.world.centerX - 25, this.game.world.centerY - 200, 'asteroid1');
        this.spinningHead.anchor.set(0.5);
        this.spinningHead.scale.set(4);

        var titleTextStyle = {font: '100px Arial', fill: '#FFFFFF', align: 'center'};
        this.titleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Bellsteroids', titleTextStyle);
        this.titleText.anchor.set(0.5);

        this.startButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200, 'startButton', this.startGame, this);
        this.startButton.anchor.set(0.5);
    },
    update: function () {
        this.spinningHead.angle++;
    },
    startGame: function() {
                this.state.start('Game');
    }
};
