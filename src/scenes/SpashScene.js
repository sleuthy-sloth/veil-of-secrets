// src/scenes/SplashScene.js
import Phaser from 'phaser';

/**
 * The SplashScene displays the game's splash screen with the logos and
 * waits for user input before transitioning to the MainMenuScene.
 */
export default class SplashScene extends Phaser.Scene {
  constructor() {
    super('SplashScene');
    // Your planned variables for future features
    this.highContrast = false;
    this.easterEggTapCount = 0;
  }

  /**
   * The `create` method is where you build the scene's content.
   */
  create() {
    console.log("SplashScene: Created.");

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Display the Sleuthy Sloth Games logo
    const slothLogo = this.add.image(centerX, centerY - 100, 'slothLogo').setScale(8, 8);
    // Display the game logo
    const gameLogo = this.add.image(centerX, centerY + 100, 'gameLogo').setScale(8, 8);

    // Animate the logos to fade in for a professional look
    this.tweens.add({
      targets: [slothLogo, gameLogo],
      alpha: { from: 0, to: 1 },
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        // Wait a moment and then display the "Click to Continue" text
        this.time.delayedCall(500, () => {
          const clickText = this.add.text(
            centerX,
            centerY + 200,
            'Click to Continue',
            {
              font: '24px Inter',
              fill: '#ffffff',
              align: 'center'
            }
          ).setOrigin(0.5, 0.5);

          // Add a pulsating effect to the text to draw attention
          this.tweens.add({
            targets: clickText,
            alpha: { from: 0.5, to: 1 },
            duration: 1000,
            yoyo: true,
            repeat: -1
          });
        });
      }
    });

    // Make the entire scene interactive to transition to the Main Menu
    this.input.once('pointerdown', () => {
      // Add a fade-out transition for a smooth scene change
      this.tweens.add({
        targets: [slothLogo, gameLogo],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.scene.start('MainMenuScene');
        }
      });
    });

    // You can also play the ambient music here once it's loaded
    // this.sound.play('ambientMusic', { loop: true });
  }
}
