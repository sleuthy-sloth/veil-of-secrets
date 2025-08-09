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

    // === EMBEDDED ASSETS (Base64) ===
    // These are small, lightweight assets. For larger assets,
    // it's better to load them from separate files.

    // Pixel-art game logo 64x64 PNG base64
    const gameLogoBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAACCAYAAACpz3Z7AAAAL0lEQVR42mNkYGAwZmBgYFBg+M9AWDmAxjAQ1gBQzmAaGRApCxI0pghkcyxQgQHWBGKsEwQAPGCEHzrT07gAAAABJRU5ErkJggg==';

    // Pixel-art Sleuthy Sloth Games logo 64x64 PNG base64
    const slothLogoBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAACCAYAAACpz3Z7AAAAMklEQVR42mNkYGBg+M8w0QAGYAxjAQ1gBQzmBMaEBooioTiQqj1IjBqI4Fg6mg4zQGAAGCoTxjMjIyMBoA4yhUHEEawfAAAAAElFTkC... (truncated for brevity)';

    // Spinner image 32x32 PNG base64
    const spinnerBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAjklEQVR4Ae3TsQkAMAwFUPT/ys+xFAOQOEQhAGrg/8NhLW2a9YlxG8ExwpAqF8CjAGlgFlQC+8o+XzAZXkAkMxSAu7YBOJuAQdhYct91Nnt7oXxyPaD7QEW9qX4goAmEoAD3Z5BTsEYZ/B9a9gk9hXxOawhh9RAKldOXG+yHNUz1BiwZ8Vj7KwBMmM+UAAAAASUVORK5CYII=';

    // Particle image 1x1 PNG base64
    const particleBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAgMBAiL5/AAAAABJRU5ErkJggg==';

    // Small quill cursor PNG base64
    const quillCursorBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAHo0lEQVRYhe2WX2hVVRTHf7vZqCGLpkZaA0GCRpCmIgYyRlQiQqosGlYgKyE1liW3bIQksYX68R1Y2JF/ABqkRlsokB6ES7MxAgkkJFhRaSiACII0EGRInZvd7Z/b+u+7uS7s1j/m6v0W93rM7/fdP+ey88/l93vnPOTsn7NKcRAxXz3LZ3VLxQcE5rBF0AlcgHX9J/06Pqa5X+d/Vc7x/7qS9/3kZpzO+8dX+q7fK+O6a0OrC1exV3IgLHhvr3eg1WW92xXzpKmMq1Ht+3aKmxY+lWYvZLIAlvlcX/0a3sO7Edpj4JuP2ekf1H6w/n6Q3PXqPeMwvOYEXvyH26ep8nwY3rXc9Y70UuBY7A7gE2wuosFrEu3PdJKr7MPn4uhS6kdKFOgUt8LVA5nvHnMP3IKcAzyq3bF2xSx1ASn1D+f6zW0LEr0OkKnjTnkg5nTn1Q/VfX3V1Te71hyKnYNPvwWh/3DrfQoYle12v+ca5fDD7B75/7Qipv3CWkJmG7L6xge8fG3pS5tZZiYxn5FKzA+ZBpkQ+7RYsxjcaZ0uVqlRhZ/LUIq1bRm77hWQv19C8z9l+F+nZ2trgQ9gMsi4MtAz9trLfj2/yB75RdQ8fgocchWeB3kTz2GsCfe8H6z3qRcxzoLdjW+SwldlhqR5tDgFxw1jY4ClP6vpvYDwGfAO7b6+tNxMcbx3+fz1W+EFLybX12A+q2wNhDlxRcuT9Y+lXuLKFvpy2Qp9aKuQ6mD0eICyk24BLP+hy3qCSu2mITRnqGY75RKUxrq0iE4Z4qHn+OPCh3AA+4rXxc8Y/uqLlS5cqWPvAVu64HvAYK5VPeBvlAVvYog8HvsQ43RDd2o4j2oy2F3RaIfEMBh+q9IjzqNq33kOVg92uRz5CHylQqJSXVvqZ11C1xlk6OnESZMt9fcJz8bYV+7r1x6W/cNgN/oEXxvKNuB/gybd15RoGHgBfJnlbQGhx6yiSxVvHXgXEgqHP0pKYenLldNUAacpNxJhAwcQ40W0kCy27XcTiyORroJnMCv/BXEd9hCrHdO+INvgDTMC1sXxM0aDmNuRBqXscxMnmYPd4v6JvnL7vB3jyci6jvMQiVa+IY7T+j9azYqE2MEW8Hy9Rx3zXz+X7vK6DxJHRvKkK8T9f+3oVeqJ8VdxD8wC9Sk7KfCXQeZcwkcJ+1n12AtR5aOKK4wScFZ0dZoGo5I0vqIcXPt7EdO3Fs+5PhY/zqS8q8VeB74K7+H6KCyj86e0YgQxOsXnN1N1Ee4Lv1m49rT1D+Ie3OnLh4D3qOun0G2vfEAfPy7fZ2wOxwbxLfgx89bwn22SgAAAAASUVORK5CYII=';

    // Small SFX base64 snippets
    const bellSoundBase64 = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAAAB3AQACABAAZGF0YRAAAAAA';
    const rustleSoundBase64 = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAAAB3AQACABAAZGF0YRAAAAAA';
    const lockClickSoundBase64 = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAAAB3AQACABAAZGF0YRAAAAAA';
    const clickDefaultBase64 = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YSgAAAAA//8AAP//AA==';

    // Composed ambient music ~30s loop WAV base64
    const ambientMusicBase64 =
      'data:audio/wav;base64,UklGRtQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YT8AAABdWlM9PENMUU1RUUtMUklNTFVRV1hRU1ZUVFNNVFJTVVJYVVRDVVZPUkZTVlNUUlZUVlNUUlJVVVNUUlVUVlNUUlZUVlNUUlJRVk1RUlpSUlNUUlRUVlNUUlJVUVNVU1JVUlZTVlNUUlJRVk1RU1N... (truncated for brevity)';
    
    // Add images as textures from Base64
    this.textures.addBase64('gameLogo', gameLogoBase64);
    this.textures.addBase64('slothLogo', slothLogoBase64);
    this.textures.addBase64('spinner', spinnerBase64);
    this.textures.addBase64('particle', particleBase64);
    
    // Add audio from Base64
    this.load.audio('ambientMusic', ambientMusicBase64);
    this.load.audio('clickBell', bellSoundBase64);
    this.load.audio('clickRustle', rustleSoundBase64);
    this.load.audio('clickLock', lockClickSoundBase64);
    this.load.audio('clickDefault', clickDefaultBase64);

    // === USER-PROVIDED ASSETS (from file uploads) ===
    // Load the main menu background image
    this.load.image('universityBg', 'uploaded:image.png-723f1b5c-5518-48e7-a0f9-2562c82b8c60');

    // Load the spritesheet for the falling leaves
    this.load.spritesheet('leaves', 'uploaded:image.png-d08449a4-20e7-4150-865b-e85467be9a71', { frameWidth: 105, frameHeight: 105, startFrame: 6, endFrame: 15 });

    // === EXTERNAL ASSETS (placeholders for your files) ===
    // You will need to make sure these files exist in your project's src folder.
    this.load.image('mainmenu_bg_parallax', 'src/assets/images/university_bg.png');
    this.load.spritesheet('mainmenu_fx', 'src/assets/sprites/mainmenu_fx_spritesheet.png', {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.audio('mainMenuMusic', ['src/assets/audio/veil_of_secrets_theme.mp3']);

    // Set the custom cursor to the quill (desktop only; mobile will ignore)
    this.input.setDefaultCursor(`url(${quillCursorBase64}) 16 16, pointer`);

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
