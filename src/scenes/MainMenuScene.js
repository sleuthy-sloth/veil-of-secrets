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

    this.fxSprites = [];
    this.pad = null;
    this.music = null;
  }

  // The preload() method has been moved to PreloadScene.js
  // All assets are now loaded before this scene starts.

  create() {
    const { width, height } = this.cameras.main;

    // Background as tileSprite for parallax-scrolling it lightly
    // 'universityBg' is loaded in the PreloadScene
    this.bg = this.add.tileSprite(width / 2, height / 2, width, height, 'universityBg').setDepth(-10);

    // Particle emitter near bottom for drifting motes
    // 'particle' is loaded in the PreloadScene
    this.particles = this.add.particles('particle');
    this.emitter = this.particles.createEmitter({
      x: { min: 0, max: width },
      y: { min: height * 0.80, max: height },
      lifespan: 15000,
      speedY: { min: -5, max: -20 },
      scale: { start: 0.12, end: 0 },
      quantity: 1,
      blendMode: 'ADD',
      frequency: 250,
    });

    // Add glowing logo (from embedded base64), breathing tween
    // 'gameLogo' is loaded in the PreloadScene
    this.logo = this.add.image(width / 2, height * 0.23, 'gameLogo').setScale(3);
    this.logoTween = this.tweens.add({
      targets: this.logo,
      alpha: { from: 1, to: 0.7 },
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Title & subtitle
    this.titleText = this.add.text(width / 2, height * 0.36, 'Veil of Secrets', {
      fontFamily: 'Georgia',
      fontSize: '56px',
      fontWeight: 'bold',
      color: '#F0E68C',
      stroke: '#000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.subtitleText = this.add.text(width / 2, height * 0.44, 'A Name of the Wind Metroidvania', {
      fontFamily: 'Georgia',
      fontSize: '22px',
      fontStyle: 'italic',
      color: '#DDD',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    // Lore quote cycling at bottom
    this.quoteText = this.add.text(width / 2, height * 0.86, this.loreQuotes[0], {
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

    // Music: create and fade in safely using a tween counter
    // 'mainMenuMusic' is loaded in the PreloadScene
    this.music = this.sound.add('mainMenuMusic', { loop: true, volume: 0 });
    this.music.play();
    this.tweens.addCounter({
      from: 0,
      to: 0.4,
      duration: 3000,
      ease: 'Linear',
      onUpdate: (tween) => {
        const v = tween.getValue();
        if (this.music && this.music.setVolume) this.music.setVolume(v);
      },
    });

    // Load button sounds (we put them into an object to match your usage)
    this.sounds = {
      // 'clickBell', 'clickRustle', 'clickLock', 'clickDefault' are loaded in PreloadScene
      play: this.sound.add('clickBell', { volume: 0.6 }),
      continue: this.sound.add('clickRustle', { volume: 0.6 }),
      settings: this.sound.add('clickLock', { volume: 0.6 }),
      default: this.sound.add('clickDefault', { volume: 0.6 }),
    };

    // Prepare FX spritesheet animations (4x4 frames, 128x128 each)
    // 'mainmenu_fx' is loaded in the PreloadScene
    this.anims.create({
      key: 'fx_cloud',
      frames: this.anims.generateFrameNumbers('mainmenu_fx', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1,
    });
    this.anims.create({
      key: 'fx_leafA',
      frames: this.anims.generateFrameNumbers('mainmenu_fx', { start: 4, end: 7 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'fx_leafB',
      frames: this.anims.generateFrameNumbers('mainmenu_fx', { start: 8, end: 11 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'fx_dust',
      frames: this.anims.generateFrameNumbers('mainmenu_fx', { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });

    // Spawn FX sprites with different depths/speeds for parallax
    for (let i = 0; i < 3; i++) {
      const cloud = this.add.sprite(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(40, 160),
        'mainmenu_fx'
      );
      cloud.play('fx_cloud');
      cloud.setScale(Phaser.Math.FloatBetween(1.2, 2.2));
      cloud.scrollSpeed = Phaser.Math.FloatBetween(0.08, 0.25); // slow drift
      cloud.setAlpha(0.7);
      this.fxSprites.push(cloud);
    }

    for (let i = 0; i < 6; i++) {
      const leaf = this.add.sprite(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(-height * 0.2, height * 0.5),
        'mainmenu_fx'
      );
      leaf.play(i % 2 === 0 ? 'fx_leafA' : 'fx_leafB');
      leaf.setScale(Phaser.Math.FloatBetween(0.6, 1.1));
      leaf.scrollSpeed = Phaser.Math.FloatBetween(0.35, 0.9); // faster fall
      leaf.setAlpha(0.95);
      this.fxSprites.push(leaf);
    }

    // Small dust motes for foreground
    for (let i = 0; i < 6; i++) {
      const dust = this.add.sprite(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(height * 0.5, height),
        'mainmenu_fx'
      );
      dust.play('fx_dust');
      dust.setScale(Phaser.Math.FloatBetween(0.4, 0.9));
      dust.scrollSpeed = Phaser.Math.FloatBetween(0.12, 0.4);
      dust.setAlpha(0.5);
      this.fxSprites.push(dust);
    }

    // Buttons container centered
    this.buttons = this.add.container(width / 2, height * 0.62);

    // Create Play / Continue / Settings buttons with your createButton helper
    this.playBtn = this.createButton('Play', 0, () => {
      this.sounds.play.play();
      this.startGame();
    });

    this.continueBtn = this.createButton('Continue', 72, () => {
      this.sounds.continue.play();
      if (localStorage.getItem('veilOfSecretsSave')) {
        this.startGame({ continue: true });
      } else {
        this.showNoSaveAlert();
      }
    }, { holdConfirm: true });

    this.settingsBtn = this.createButton('Settings', 144, () => {
      this.sounds.settings.play();
      // TODO: open settings scene/modal
      console.log('Open Settings');
    });

    this.buttons.add([this.playBtn, this.continueBtn, this.settingsBtn]);

    // First-time prompt (fades)
    if (!localStorage.getItem('veilOfSecretsPlayed')) {
      this.firstTimePrompt = this.add.text(width / 2, height * 0.78, 'Tap "Play" to start your adventure!', {
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

    // Touch: start by tapping the Play button or anywhere? we'll keep Play button explicit.
    this.input.on('pointerdown', (pointer, currentlyOver) => {
      if (!pointer.event._target || pointer.event._target.nodeName === 'CANVAS') {
        // commented out to require explicit Play tap
      }
    });

    // Gamepad detection
    this.input.gamepad.once('connected', (pad) => {
      this.pad = pad;
    });

    // Ensure scene shutdown cleans up music
    this.events.on('shutdown', this.shutdown, this);
    this.events.on('destroy', this.shutdown, this);
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
      fixedWidth: 300,
      align: 'center',
      shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 2, stroke: true, fill: true },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Pulsing glow tween (paused until hover)
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

      // Tooltip near button
      if (!btn.tooltip) {
        btn.tooltip = this.add.text(btn.x + 170, btn.y, this.getTooltipText(text), {
          fontFamily: 'Arial',
          fontSize: '16px',
          color: '#FFF',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: { x: 6, y: 4 },
          stroke: '#000',
          strokeThickness: 3,
          align: 'left',
          wordWrap: { width: 220 },
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
        this.sounds.default.play();
        holdTimer = this.time.delayedCall(1000, () => {
          isHeld = true;
          callback();
        });
      });
      btn.on('pointerup', () => {
        if (holdTimer) holdTimer.remove(false);
        if (!isHeld) {
          const tmp = this.add.text(btn.x + 170, btn.y + 24, 'Hold to confirm', {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#ffdd88',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: { x: 6, y: 4 },
            stroke: '#000',
            strokeThickness: 2,
          }).setOrigin(0, 0).setDepth(1001);
          this.buttons.add(tmp);
          this.time.delayedCall(900, () => tmp.destroy());
        }
        isHeld = false;
      });
      btn.on('pointerout', () => {
        if (holdTimer) holdTimer.remove(false);
        isHeld = false;
      });
    } else {
      btn.on('pointerup', () => {
        this.sounds.default.play();
        callback();
      });
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

  showNoSaveAlert() {
    const { width, height } = this.cameras.main;
    if (this.noSaveText) this.noSaveText.destroy();

    this.noSaveText = this.add.text(width / 2, height * 0.72, 'No saved game found!', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#f88',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 12, y: 8 },
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(1002);

    this.tweens.add({
      targets: this.noSaveText,
      alpha: 0,
      delay: 1600,
      duration: 1000,
      onComplete: () => {
        if (this.noSaveText) {
          this.noSaveText.destroy();
          this.noSaveText = null;
        }
      }
    });
  }

  startGame(options = {}) {
    if (this.music) {
      this.tweens.addCounter({
        from: this.music.volume || 0.4,
        to: 0,
        duration: 900,
        onUpdate: (tween) => {
          if (this.music && this.music.setVolume) this.music.setVolume(tween.getValue());
        },
        onComplete: () => {
          try { this.music.stop(); } catch (e) {}
          this.scene.start('GameScene', options);
        }
      });
    } else {
      this.scene.start('GameScene', options);
    }
  }

  update(time, delta) {
    this.bg.tilePositionX += 0.03 * (delta / 16.67);

    const w = this.scale.width;
    const h = this.scale.height;
    for (let i = 0; i < this.fxSprites.length; i++) {
      const s = this.fxSprites[i];
      s.x += s.scrollSpeed * (delta / 16.67);
      if (s.texture && s.texture.key === 'mainmenu_fx') {
        if (s.scrollSpeed > 0.3) s.y += 0.25 * (delta / 16.67);
      }
      if (s.x > w + 150) {
        s.x = -150;
        s.y = Phaser.Math.Between(0, h);
      }
      if (s.y > h + 100) {
        s.y = Phaser.Math.Between(-180, -20);
        s.x = Phaser.Math.Between(0, w);
      }
    }

    if (this.pad) {
      if (this.pad.buttons && this.pad.buttons[0] && this.pad.buttons[0].pressed) {
        this.startGame();
      }
    }
  }

  shutdown() {
    if (this.music) {
      this.tweens.addCounter({
        from: this.music.volume || 0.4,
        to: 0,
        duration: 600,
        onUpdate: (tween) => {
          if (this.music && this.music.setVolume) this.music.setVolume(tween.getValue());
        },
        onComplete: () => {
          try { this.music.stop(); } catch (e) {}
        },
      });
    }
  }
}
