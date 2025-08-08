// src/scenes/PreloadScene.js

import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // --- Loading bar setup ---
    const { width, height } = this.cameras.main;

    // Background for loading bar
    const barBackground = this.add.graphics();
    barBackground.fillStyle(0x222222, 0.8);
    barBackground.fillRect(width / 4 - 2, height / 2 - 18, width / 2 + 4, 36);

    // Loading bar fill
    const loadingBar = this.add.graphics();

    // Percent text
    const percentText = this.add.text(width / 2, height / 2 + 30, '0%', {
      font: '18px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);

    // Listen to loading progress
    this.load.on('progress', (value) => {
      loadingBar.clear();
      loadingBar.fillStyle(0xffffff, 1);
      loadingBar.fillRect(width / 4, height / 2 - 15, (width / 2) * value, 30);
      percentText.setText(parseInt(value * 100) + '%');
    });

    // When load complete
    this.load.on('complete', () => {
      loadingBar.destroy();
      barBackground.destroy();
      percentText.destroy();
    });

    // --- Assets to preload ---

    // Embedded minimal placeholder art replaced by real pixel art sprites (example)
    this.load.image('logo', 'assets/images/logo.png');
    this.load.image('tileset', 'assets/images/tileset.png');

    // Load audio assets (embedded or external)
    this.load.audio('theme_music', ['assets/audio/theme_music.mp3', 'assets/audio/theme_music.ogg']);

    // Load sprite sheets or atlases for characters
    this.load.spritesheet('kvothe_idle', 'assets/images/kvothe_idle.png', { frameWidth: 48, frameHeight: 64 });
    this.load.spritesheet('enemy_walk', 'assets/images/enemy_walk.png', { frameWidth: 48, frameHeight: 64 });

    // Load JSON data (map, dialogue, collectibles)
    this.load.json('game_data', 'assets/data/game_data.json');
  }

  create() {
    // Play a short startup sound or theme (optional)
    this.sound.play('theme_music', { volume: 0.5, loop: true });

    // Start next scene after small delay for polish
    this.time.delayedCall(1000, () => {
      this.scene.start('SplashScene');
      this.events.emit('sceneStart', 'SplashScene');
      this.game.eventsBus.emit('sceneStart', 'SplashScene');
    });
  }
}
