// src/scenes/PreloadScene.js
import Phaser from 'phaser';

/**
 * The PreloadScene is responsible for loading all game assets before the
 * game starts. This includes images, spritesheets, audio, and more.
 */
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  /**
   * The `preload` method is where you load all of your assets.
   */
  preload() {
    console.log("PreloadScene: Preloading assets...");

    // === EMBEDDED ASSETS (from user's original SplashScene.js) ===
    // While it's great for small assets, it's generally better to load them
    // from separate files. For this example, we'll keep them here, but
    // a production game would have these as .png and .wav files.
    
    // Pixel-art game logo 64x64 PNG base64 (simple golden 'V' shape for "Veil of Secrets")
    const gameLogoBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAACCAYAAACpz3Z7AAAAL0lEQVR42mNkYGAwZmBgYFBg+M9AWDmAxjAQ1gBQzmAaGRApCxI0pghkcyxQgQHWBGKsEwQAPGCEHzrT07gAAAABJRU5ErkJggg==';

    // Pixel-art Sleuthy Sloth Games logo 64x64 PNG base64 (sloth at desk simplified pixel icon)
    const slothLogoBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAACCAYAAACpz3Z7AAAAMklEQVR42mNkYGBg+M8w0QAGYAxjAQ1gBQzmBMaEBooioTiQqj1IjBqI4Fg6mg4zQGAAGCoTxjMjIyMBoA4yhUHEEawfAAAAAElFTkC... (truncated for brevity)';

    // Spinner image 32x32 PNG base64 (simple circular spinner)
    const spinnerBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAjklEQVR4Ae3TsQkAMAwFUPT/ys+xFAOQOEQhAGrg/8NhLW2a9YlxG8ExwpAqF8CjAGlgFlQC+8o+XzAZXkAkMxSAu7YBOJuAQdhYct91Nnt7oXxyPaD7QEW9qX4goAmEoAD3Z5BTsEYZ/B9a9gk9hXxOawhh9RAKldOXG+yHNUz1BiwZ8Vj7KwBMmM+UAAAAASUVORK5CYII=';

    // Composed ambient music ~30s loop WAV base64 (simple synthesized ambient drone)
    const ambientMusicBase64 =
      'data:audio/wav;base64,UklGRtQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YT8AAABdWlM9PENMUU1RUUtMUklNTFVRV1hRU1ZUVFNNVFJTVVJYVVRDVVZPUkZTVlNUUlZUVlNUUlJVVVNUUlVUVlNUUlZUVlNUUlJRVk1RUlpSUlNUUlRUVlNUUlJVUVNVU1JVUlZTVlNUUlJRVk1RU1N... (truncated for brevity)';
    
    // Add images as textures from Base64
    this.textures.addBase64('gameLogo', gameLogoBase64);
    this.textures.addBase64('slothLogo', slothLogoBase64);
    this.textures.addBase64('spinner', spinnerBase64);

    // Add audio from Base64
    this.load.audio('ambientMusic', ambientMusicBase64);
    
    // === USER-PROVIDED ASSETS ===
    // Load the main menu background image
    this.load.image('main-menu-bg', 'uploaded:image.png-723f1b5c-5518-48e7-a0f9-2562c82b8c60');

    // Load the spritesheet for the falling leaves
    this.load.spritesheet('leaves', 'uploaded:image.png-d08449a4-20e7-4150-865b-e85467be9a71', { frameWidth: 105, frameHeight: 105, startFrame: 6, endFrame: 15 });

    // === LOADING BAR UI ===
    // Display a loading bar to show progress
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    }).setOrigin(0.5, 0.5);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      console.log("PreloadScene: Preloading complete. Starting SplashScene.");
    });
  }

  /**
   * The `create` method is called after all assets have been loaded.
   * It's a good place to start the next scene.
   */
  create() {
    this.scene.start('SplashScene');
  }
}
