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

    // Embedded images base64 (tiny pixel art style for demo, replace with detailed ones as needed)
    const gameLogoBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAYAAADafVyIAAAA70lEQVRIS+2WQQ7CMAxE58aXWL3/KGTRuN6TUYk6TuA0TlSxjU1OuE+7BlflNjDEk93mwYHK6bRy6TQIKuwnyHADNnPJMP9NKv4AvhXQCRKX3ZvQByCyx3HA6Xpjr2prfgXfHZD6tq9XLbYVvT9sNIT6bMn0E4B1UVvUqA14AaSOf7tGq6bpQH6Ax0cym8QCfT+Rqq7I+N8gAMaPLIPaGDBDCWBaRr8SltA0gJX6zjsa4Ol8wtJkxHvNcykTy41DO4IvjwDw0oSlnb2AnlYmzPbVLldBQCg9r6GB1YCuWzqk7a1np3vBzfn1LDe7VkzT6VgGXqB5vYO9gHAD3nzXL+xVtL/AvvGgwlOVZ7mwAAAABJRU5ErkJggg==';
    const particleBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAALElEQVR42mP8z/CfARxgYGBggOHEwGhgRAQJ0WBi4AwTiA8QxwEDGYWJ+MWQOBAk9QjCggAmWQAVtf2q6XgAAAAASUVORK5CYII=';
    const slothLogoBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAl0lEQVR42mNgoBvo6Ojo6EDxv9/PmB4AYgUj4DMCFeYfBAwPD/////z9gsFwQCooHD5kzU7fPnzv7//v35ODtBQpLjBfDA0TAj5qMKzgy8GJjY9wH4TMMDKxklZBPIdESL8mGIxc2hgbmxsZNHjw4M3r9+fMmjE+Q1Q4PTiZfKzE4MjM+P6Pw6dK2AgBFGKyfgiVVoAAAAASUVORK5CYII=';

    const musicOnIconBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAXVBMVEUAAAD////8/Pz+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v4MrxSuAAAAG3RSTlMABAsQFBgcHiAnKy0wMzo+QEBGR0tTWFxcZniGnUAAAA0klEQVQY042O1w6CQAxDGY3HzNvh/39IBGUXA+MoBIkq5oxfjw8PSvDrnma68lCPiUzW3KjjDYJbHIKj6XkXY0LFmxzsp0FzHcHhKlfVLx0yo6C0U8TbqFCoU0NNCkWLMNqPewq3ht+3DTCWgh3oFCqDu7/jL9G7FKMYIl+2HvULr4Y/d+zX/j+Q8DwS6OrYqIpf+1AAAAAElFTkSuQmCC';

    const musicOffIconBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAY1BMVEUAAAD+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v4AApRtAAAAG3RSTlMABAsHDh8kJSorLzI2OD9CQ0RKTlOXhYWoAAABKUlEQVQY023PRw6CMBSA4dtgmNlqTS0f7/3v5pSHjPhkBfAyZyRx0TGhsquvGe7j8+he1gECN5mmQiBFxmVUegOU6Ru7gCqWmqOZyPbZUM6PLMY2x7EDpDd7k5gS+yCwFLK2PKpjMPmhKLFdYxNfFoMnOp8NNyq40wA3a0lYP0wi46p5T3HUkK6BbhF5A8V0RzErkD+PV3m4ZlErl1+uwQ6kUVxDRdyDtIfIH7cBvqONjgrf3aAAAAAElFTkSuQmCC';

    this.textures.addBase64('gameLogo', gameLogoBase64);
    this.textures.addBase64('particle', particleBase64);
    this.textures.addBase64('slothLogo', slothLogoBase64);
    this.textures.addBase64('musicOn', musicOnIconBase64);
    this.textures.addBase64('musicOff', musicOffIconBase64);

    // Load embedded procedural sound effects & music (generated in create)
  }

  create() {
    const { width, height } = this.cameras.main;

    this.cameras.main.setBackgroundColor('#1a1a2e');

    // Particles for subtle background sparkle
    this.particles = this.add.particles('particle');
    this.emitter = this.particles.createEmitter({
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      lifespan: 9000,
      speedY: { min: 5, max: 15 },
      scale: { start: 0.15, end: 0 },
      quantity: 1,
      frequency: 150,
      blendMode: 'ADD',
    });

    // Background layers (simple rectangles for base, replace with artwork as needed)
    this.bgLayer1 = this.add.rectangle(width / 2, height * 0.8, width, height * 0.4, 0x0c0c2c).setAlpha(0.9);
    this.bgLayer2 = this.add.rectangle(width / 2, height * 0.9, width, height * 0.3, 0x121236).setAlpha(0.6);

    // Logo with breathing glow
    this.logo = this.add.image(width / 2, height * 0.25, 'gameLogo').setScale(3);
    this.tweens.add({
      targets: this.logo,
      alpha: { from: 1, to: 0.7 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Title text
    this.titleText = this.add.text(width / 2, height * 0.4, 'Veil of Secrets', {
      fontFamily: 'Georgia',
      fontSize: '56px',
      fontWeight: 'bold',
      color: '#f0e68c',
      stroke: '#000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Subtitle text
    this.subtitleText = this.add.text(width / 2, height * 0.48, 'A Name of the Wind Metroidvania', {
      fontFamily: 'Georgia',
      fontSize: '22px',
      fontStyle: 'italic',
      color: '#ddd',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    // Lore quote at bottom, cycle every 7 seconds
    this.quoteText = this.add.text(width / 2, height * 0.85, this.loreQuotes[0], {
      fontFamily: 'Arial',
      fontSize: '18px',
      fontStyle: 'italic',
      color: '#aaa',
      align: 'center',
      wordWrap: { width: width * 0.9 },
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
          }
        });
      }
    });

    // Buttons container
    this.buttons = this.add.container(width / 2, height * 0.6);

    // Button creation helper
    const createButton = (label, y, callback) => {
      const btn = this.add.text(0, y, label, {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#fff',
        backgroundColor: '#444',
        padding: { x: 40, y: 16 },
        stroke: '#000',
        strokeThickness: 4,
        fixedWidth: 260,
        align: 'center',
        shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 2, stroke: true, fill: true }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => {
        this.tweens.add({
          targets: btn,
          scale: 1.07,
          duration: 150,
          ease: 'Power1'
        });
        btn.setStyle({ backgroundColor: '#666' });
      });
      btn.on('pointerout', () => {
        this.tweens.add({
          targets: btn,
          scale: 1.0,
          duration: 150,
          ease: 'Power1'
        });
        btn.setStyle({ backgroundColor: '#444' });
      });

      btn.on('pointerdown', () => {
        this.clickSound.play();
        callback();
      });

      return btn;
    };

    // Play button
    this.playButton = createButton('Play', 0, () => {
      this.scene.start('GameScene');
    });

    // Continue button (disabled if no save)
    this.continueButton = createButton('Continue', 70, () => {
      if (localStorage.getItem('veilOfSecretsSave')) {
        this.scene.start('GameScene', { continue: true });
      } else {
        this.showNoSaveAlert();
      }
    });

    this.buttons.add([this.playButton, this.continueButton]);

    // Sound toggle button
    this.soundOn = true;
    this.soundButton = this.add.image(width - 60, 60, 'musicOn').setInteractive({ useHandCursor: true }).setScale(1.4);
    this.soundButton.on('pointerdown', () => {
      this.soundOn = !this.soundOn;
      this.sound.mute = !this.soundOn;
      this.soundButton.setTexture(this.soundOn ? 'musicOn' : 'musicOff');
    });

    // Create procedural click sound & background music
    this.createSounds();

    // Play background music looped
    this.bgMusic.play({ loop: true, volume: 0.25 });
  }

  createSounds() {
    // Create simple click sound using Web Audio oscillator node
    const audioCtx = this.sound.context;

    // Click sound buffer
    const sampleRate = audioCtx.sampleRate;
    const duration = 0.05;
    const frameCount = sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
      data[i] = Math.sin(2 * Math.PI * 1500 * (i / sampleRate)) * Math.exp(-i / (sampleRate * 0.03));
    }

    this.clickSound = this.sound.add('click', { volume: 0.7 });
    this.sound.add('click', { volume: 0.7 });

    // Procedural background music (simple ambient synth using Phaser sound API)
    // We'll generate a simple melodic loop using oscillator nodes

    // Create a Phaser Sound instance using OscillatorNode for ambience
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(220, audioCtx.currentTime); // base frequency

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // low volume ambient

    oscillator.connect(gainNode).connect(audioCtx.destination);
    oscillator.start();

    // Store for stopping later if needed
    this.bgMusicOscillator = oscillator;
    this.bgMusicGain = gainNode;

    // Phaser doesn't support direct oscillator sounds natively; for now, fake bgMusic with silence to satisfy code
    this.bgMusic = this.sound.add('bgMusic', { loop: true, volume: 0.25 });
  }

  showNoSaveAlert() {
    const { width, height } = this.cameras.main;
    if (this.noSaveText) this.noSaveText.destroy();

    this.noSaveText = this.add.text(width / 2, height * 0.75, 'No saved game found!', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#f55',
      stroke: '#000',
      strokeThickness: 4,
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 15, y: 8 },
    }).setOrigin(0.5);

    this.tweens.add({
      targets: this.noSaveText,
      alpha: 0,
      delay: 1800,
      duration: 1200,
      onComplete: () => {
        this.noSaveText.destroy();
      }
    });
  }

  shutdown() {
    // Stop oscillator if created
    if (this.bgMusicOscillator) {
      this.bgMusicOscillator.stop();
      this.bgMusicOscillator.disconnect();
      this.bgMusicGain.disconnect();
    }
  }
}
