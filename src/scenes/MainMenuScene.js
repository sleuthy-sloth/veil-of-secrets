// src/scenes/MainMenuScene.js
import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');

    this.loreQuotes = [
      '“Words are pale shadows of forgotten names.”',
      '“Sympathy binds the world’s secrets together.”',
      '“The path of the musician is also the path of the warrior.”',
      '“Every lock has a key, every mystery a veil.”',
      '“To know the truth, you must first know yourself.”',
    ];
    this.currentQuoteIndex = 0;
  }

  preload() {
    const { width, height } = this.cameras.main;

    // Embedded assets base64
    const gameLogoBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAACCAYAAACpz3Z7AAAAL0lEQVR42mNkYGAwZmBgYFBg+M9AWDmAxjAQ1gBQzmAaGRApCxI0pghkcyxQgQHWBGKsEwQAPGCEHzrT07gAAAABJRU5ErkJggg==';

    const particleBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAgMBAiL5/AAAAABJRU5ErkJggg==';

    // Glowing quill cursor 32x32 PNG base64 (custom image)
    const quillCursorBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAHo0lEQVRYhe2WX2hVVRTHf7vZqCGLpkZaA0GCRpCmIgYyRlQiQqosGlYgKyE1liW3bIQksYX68R1Y2JF/ABqkRlsokB6ES7MxAgkkJFhRaSiACII0EGRInZvd7Z/b+u+7uS7s1j/m6v0W93rM7/fdP+ey88/l93vnPOTsn7NKcRAxXz3LZ3VLxQcE5rBF0AlcgHX9J/06Pqa5X+c/Vc7x/7qS9/3kZpzO+8dX+q7fK+O6a0OrC1exV3IgLHhvr3eg1WW92xXzpKmMq1Ht+3aKmxY+lWYvZLIAlvlcX/0a3sO7Edpj4JuP2ekf1H6w/n6Q3PXqPeMwvOYEXvyH26ep8nwY3rXc9Y70UuBY7A7gE2wuosFrEu3PdJKr7MPn4uhS6kdKFOgUt8LVA5nvHnMP3IKcAzyq3bF2xSx1ASn1D+f6zW0LEr0OkKnjTnkg5nTn1Q/VfX3V1Te71hyKnYNPvwWh/3DrfQoYle12v+ca5fDD7B75/7Qipv3CWkJmG7L6xge8fG3pS5tZZiYxn5FKzA+ZBpkQ+7RYsxjcaZ0uVqlRhZ/LUIq1bRm77hWQv19C8z9l+F+nZ2trgQ9gMsi4MtAz9trLfj2/yB75RdQ8fgocchWeB3kTz2GsCfe8H6z3qRcxzoLdjW+SwldlhqR5tDgFxw1jY4ClP6vpvYDwGfAO7b6+tNxMcbx3+fz1W+EFLybX12A+q2wNhDlxRcuT9Y+lXuLKFvpy2Qp9aKuQ6mD0eICyk24BLP+hy3qCSu2mITRnqGY75RKUxrq0iE4Z4qHn+OPCh3AA+4rXxc8Y/uqLlS5cqWPvAVu64HvAYK5VPeBvlAVvYog8HvsQ43RDd2o4j2oy2F3RaIfEMBh+q9IjzqNq33kOVg92uRz5CHylQqJSXVvqZ11C1xlk6OnESZMt9fcJz8bYV+7r1x6W/cNgN/oEXxvKNuB/gybd15RoGHgBfJnlbQGhx6yiSxVvHXgXEgqHP0pKYenLldNUAacpNxJhAwcQ40W0kCy27XcTiyORroJnMCv/BXEd9hCrHdO+INvgDTMC1sXxM0aDmNuRBqXscxMnmYPd4v6JvnL7vB3jyci6jvMQiVa+IY7T+j9azYqE2MEW8Hy9Rx3zXz+X7vK6DxJHRvKkK8T9f+3oVeqJ8VdxD8wC9Sk7KfCXQeZcwkcJ+1n12AtR5aOKK4wScFZ0dZoGo5I0vqIcXPt7EdO3Fs+5PhY/zqS8q8VeB74K7+H6KCyj86e0YgQxOsXnN1N1Ee4Lv1m49rT1D+Ie3OnLh4D3qOun0G2vfEAfPy7fZ2wOxwbxLfgx89bwn22SgAAAAASUVORK5CYII=';

    // Load embedded textures
    this.textures.addBase64('gameLogo', gameLogoBase64);
    this.textures.addBase64('particle', particleBase64);

    // Load external assets (background image, music)
    this.load.image('universityBg', 'src/assets/images/university_bg.png');
    this.load.audio('mainMenuMusic', ['src/assets/audio/veil_of_secrets_theme.mp3']);

    // Load button sounds from embedded base64
    this.load.audio('clickBell', this.bellSoundBase64);
    this.load.audio('clickRustle', this.rustleSoundBase64);
    this.load.audio('clickLock', this.lockClickSoundBase64);

    // Load click default sound
    const clickSoundBase64 =
      'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YSgAAAAA//8AAP//AA==';
    this.load.audio('clickDefault', clickSoundBase64);

    // Set custom cursor
    this.input.setDefaultCursor(`url(${quillCursorBase64}) 16 16, pointer`);
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background image with subtle parallax
    this.bg = this.add.image(width / 2, height / 2, 'universityBg');
    this.bg.setDisplaySize(width, height);
    this.bg.setDepth(-10);

    // Particle emitter near bottom for drifting motes
    this.particles = this.add.particles('particle');
    this.emitter = this.particles.createEmitter({
      x: { min: 0, max: width },
      y: { min: height * 0.85, max: height },
      lifespan: 15000,
      speedY: { min: -5, max: -20 },
      scale: { start: 0.12, end: 0 },
      quantity: 1,
      blendMode: 'ADD',
      frequency: 250,
    });

    // Add glowing game logo with breathing tween (pulse)
    this.logo = this.add.image(width / 2, height * 0.25, 'gameLogo').setScale(3);
    this.logoTween = this.tweens.add({
      targets: this.logo,
      alpha: { from: 1, to: 0.7 },
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Title text
    this.titleText = this.add.text(width / 2, height * 0.4, 'Veil of Secrets', {
      fontFamily: 'Georgia',
      fontSize: '56px',
      fontWeight: 'bold',
      color: '#F0E68C',
      stroke: '#000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Subtitle text
    this.subtitleText = this.add.text(width / 2, height * 0.48, 'A Name of the Wind Metroidvania', {
      fontFamily: 'Georgia',
      fontSize: '22px',
      fontStyle: 'italic',
      color: '#DDD',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    // Lore quotes cycling at bottom
    this.quoteText = this.add.text(width / 2, height * 0.85, this.loreQuotes[0], {
      fontFamily: 'Arial',
      fontSize: '18px',
      fontStyle: 'italic',
      color: '#AAA',
      wordWrap: { width: width * 0.9 },
      align: 'center',
    }).setOrigin(0.5);

    this.time.addEvent({
      delay: 7000,
      loop: true,
      callback: () => {
        this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.loreQuotes.length;
        this.tweens.add({
          targets: this.quoteText,
          alpha: 0,
          duration: 800,
          yoyo: true,
          onComplete: () => {
            this.quoteText.setText(this.loreQuotes[this.currentQuoteIndex]);
          },
        });
      },
    });

    // Music playback setup with fade in
    this.music = this.sound.add('mainMenuMusic', { loop: true, volume: 0 });
    this.music.play();
    this.tweens.add({
      targets: this.music,
      volume: 0.4,
      duration: 3000,
      ease: 'Linear',
    });

    // Load button sounds
    this.sounds = {
      play: this.sound.add('clickBell', { volume: 0.6 }),
      continue: this.sound.add('clickRustle', { volume: 0.6 }),
      settings: this.sound.add('clickLock', { volume: 0.6 }),
      default: this.sound.add('clickDefault', { volume: 0.6 }),
    };

    // Buttons container
    this.buttons = this.add.container(width / 2, height * 0.6);

    // Play button with glow tween & tooltip
    this.playBtn = this.createButton('Play', 0, () => {
      this.sounds.play.play();
      console.log('Play pressed');
      // TODO: start game scene
    });

    // Continue button with hold to confirm, glow tween & tooltip
    this.continueBtn = this.createButton('Continue', 60, () => {
      this.sounds.continue.play();
      console.log('Continue pressed');
      // TODO: load saved game or prompt
    }, { holdConfirm: true });

    // Settings button with glow tween & tooltip
    this.settingsBtn = this.createButton('Settings', 120, () => {
      this.sounds.settings.play();
      console.log('Settings pressed');
      // TODO: open settings scene
    });

    this.buttons.add([this.playBtn, this.continueBtn, this.settingsBtn]);

    // First time user prompt
    if (!localStorage.getItem('veilOfSecretsPlayed')) {
      this.firstTimePrompt = this.add.text(width / 2, height * 0.75, 'Tap "Play" to start your adventure!', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FFF',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: { x: 15, y: 8 },
        stroke: '#000',
        strokeThickness: 4,
        align: 'center',
      }).setOrigin(0.5);

      this.tweens.add({
        targets: this.firstTimePrompt,
        alpha: 0,
        delay: 6000,
        duration: 1200,
        onComplete: () => {
          this.firstTimePrompt.destroy();
        },
      });

      localStorage.setItem('veilOfSecretsPlayed', 'true');
    }
  }

  createButton(text, y, callback, options = {}) {
    const btn = this.add.text(0, y, text, {
      fontFamily: 'Arial',
      fontSize: '30px',
      color: '#FFF',
      backgroundColor: '#444',
      padding: { x: 30, y: 14 },
      stroke: '#000',
      strokeThickness: 4,
      fixedWidth: 250,
      align: 'center',
      shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 2, stroke: true, fill: true },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Pulsing glow tween
    btn.glowTween = this.tweens.add({
      targets: btn,
      alpha: { from: 1, to: 0.7 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      paused: true,
    });

    btn.on('pointerover', () => {
      this.tweens.add({
        targets: btn,
        scale: 1.05,
        duration: 120,
        ease: 'Power1',
      });
      btn.setStyle({ backgroundColor: '#666' });
      btn.glowTween.play();

      // Tooltip text near button
      if (!btn.tooltip) {
        btn.tooltip = this.add.text(btn.x + 140, btn.y, this.getTooltipText(text), {
          fontFamily: 'Arial',
          fontSize: '16px',
          color: '#FFF',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: { x: 6, y: 4 },
          stroke: '#000',
          strokeThickness: 3,
          align: 'left',
          wordWrap: { width: 200 },
        }).setOrigin(0, 0.5).setDepth(1000);
        this.buttons.add(btn.tooltip);
      }
    });

    btn.on('pointerout', () => {
      this.tweens.add({
        targets: btn,
        scale: 1.0,
        duration: 120,
        ease: 'Power1',
      });
      btn.setStyle({ backgroundColor: '#444' });
      btn.glowTween.pause();
      btn.setAlpha(1);

      if (btn.tooltip) {
        btn.tooltip.destroy();
        btn.tooltip = null;
      }
    });

    if (options.holdConfirm) {
      let holdTimer = null;
      let isHeld = false;

      btn.on('pointerdown', () => {
        holdTimer = this.time.delayedCall(1000, () => {
          isHeld = true;
          callback();
        });
      });
      btn.on('pointerup', () => {
        if (holdTimer) holdTimer.remove(false);
        if (!isHeld) {
          // Optionally play a sound or show message: "Hold to confirm"
        }
        isHeld = false;
      });
      btn.on('pointerout', () => {
        if (holdTimer) holdTimer.remove(false);
        isHeld = false;
      });
    } else {
      btn.on('pointerup', callback);
    }

    return btn;
  }

  getTooltipText(buttonText) {
    switch (buttonText) {
      case 'Play':
        return 'Start a new adventure in the world of the Name of the Wind.';
      case 'Continue':
        return 'Load your previous progress. Hold to confirm.';
      case 'Settings':
        return 'Adjust audio, controls, and display options.';
      default:
        return '';
    }
  }

  // Fade out music on scene shutdown
  shutdown() {
    if (this.music) {
      this.tweens.add({
        targets: this.music,
        volume: 0,
        duration: 1500,
        onComplete: () => this.music.stop(),
      });
    }
  }
}
