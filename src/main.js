// src/main.js

import Phaser from 'phaser';

import PreloadScene from './scenes/PreloadScene.js';
import SplashScene from './scenes/SplashScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import GameScene from './scenes/GameScene.js';
import OptionsScene from './scenes/OptionsScene.js';
import LoreScene from './scenes/LoreScene.js';
import MapScene from './scenes/MapScene.js';

import AudioManager from './utils/AudioManager.js';
import SaveManager from './utils/SaveManager.js';

/**
 * A custom EventBus class that extends Phaser's EventEmitter.
 * This allows for communication between different parts of the game
 * without direct dependencies.
 */
class EventBus extends Phaser.Events.EventEmitter {
  constructor() {
    super();
  }
}

/**
 * Manages the entire global state of the game. All access and modifications
 * to game data should go through this manager to ensure consistency.
 */
class StateManager {
  constructor(initialState) {
    this.state = initialState;
  }

  /**
   * Returns a copy of the current game state to prevent direct modification.
   * @returns {object} The current global game state.
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Updates the game state with new data.
   * @param {object} newState The new state to merge.
   */
  setState(newState) {
    this.state = { ...this.state,
      ...newState
    };
  }
}

/**
 * A placeholder for a future InputManager class. This is where you would
 * define and manage all of the player's input bindings.
 */
class InputManager {
  constructor(game) {
    this.game = game;
    this.bindings = {
      jump: ['SPACE', 'TOUCH_TAP'],
      attack: ['KEY_Z', 'TOUCH_SWIPE'],
      interact: ['KEY_E', 'TOUCH_HOLD'],
    };
  }
  // TODO: Add real input methods, binding listeners, etc. here.
}

/**
 * A centralized controller to handle the initialization of all game systems.
 * This class orchestrates the setup, keeping the main configuration clean.
 */
class GameController {
  constructor(game) {
    this.game = game;
    this.DEBUG_MODE = false;

    // A placeholder for game-wide assets
    this.game.assetManager = {};

    this.game.eventsBus = new EventBus();

    // The central source of game data
    const initialState = {
      playerStats: {
        health: 100,
        mana: 100,
        experience: 0,
        level: 1,
      },
      settings: {
        soundVolume: 1.0,
        musicVolume: 0.8,
        accessibility: {
          colorblindMode: false,
          subtitles: true,
          highContrast: false,
        },
        language: 'en',
      },
      journalEntries: [],
      mapDiscoveredAreas: [],
      saveLoaded: false,
      saveSlots: [null, null, null],
      difficultyLevel: 'normal',
    };
    this.game.stateManager = new StateManager(initialState);

    // Initialize all other managers
    this.game.audioManager = new AudioManager(game);
    const savedSettings = this.game.stateManager.getState().settings;
    this.game.audioManager.setVolume(savedSettings.musicVolume);

    this.game.saveManager = new SaveManager(game);
    this.game.saveManager.load().then(() => {
      this.game.stateManager.setState({
        saveLoaded: true
      });
      this.game.eventsBus.emit('saveLoaded');
    });

    this.game.inputManager = new InputManager(game);

    this.setupEventListeners();
    this.setupDebugTools();

    this.game.eventsBus.emit('gameInitialized');
  }

  setupEventListeners() {
    // A debug hotkey for toggling the debug console
    window.addEventListener('keydown', (e) => {
      if (e.key === '`') {
        this.game.debugConsoleVisible = !this.game.debugConsoleVisible;
        this.game.eventsBus.emit('toggleDebugConsole', this.game.debugConsoleVisible);
        console.log(`Debug Console: ${this.game.debugConsoleVisible ? 'Shown' : 'Hidden'}`);
      }
    });

    this.game.eventsBus.on('sceneStart', (sceneKey) => {
      console.log(`Analytics: Scene started - ${sceneKey}`);
    });

    this.game.localization = {
      currentLanguage: this.game.stateManager.getState().settings.language,
      strings: {},
      translate: (key) => {
        return this.game.localization.strings[key] || key;
      },
    };
  }

  setupDebugTools() {
    if (this.DEBUG_MODE) {
      // Add a basic FPS counter for debug mode
      const fpsText = this.game.scene.scenes[0].add.text(10, 10, '', {
        font: '16px monospace',
        fill: '#0f0'
      });
      this.game.events.on('step', () => {
        const fps = Math.floor(this.game.loop.actualFps);
        fpsText.setText(`FPS: ${fps}`);
      });
    }
  }
}

const config = {
  // Use Phaser.AUTO to automatically detect canvas or WebGL
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: document.body,
  backgroundColor: '#050510',
  // The list of all scenes in your game, in the order they will be loaded.
  scene: [
    PreloadScene,
    SplashScene,
    MainMenuScene,
    GameScene,
    OptionsScene,
    LoreScene,
    MapScene,
  ],
  // Configure the scaling to fit the screen and be centered.
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // Set up the physics system (Arcade physics is great for 2D games).
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false, // Debug is now managed in GameController
    },
  },
  // Enable multiple pointers for multi-touch support on mobile devices.
  input: {
    activePointers: 3,
  },
  audio: {
    disableWebAudio: false,
  },
  // The postBoot callback is now very simple; it just starts the GameController.
  callbacks: {
    postBoot: (game) => {
      try {
        window.gameController = new GameController(game);
      } catch (error) {
        console.error('Error during game initialization:', error);
      }
    },
  },
};

// Start the game instance
window.game = new Phaser.Game(config);

// Event listeners for window resizing and orientation changes, important for mobile
window.addEventListener('resize', () => {
  if (window.game && window.game.scale) {
    window.game.scale.resize(window.innerWidth, window.innerHeight);
  }
});

window.addEventListener('orientationchange', () => {
  if (window.game && window.game.scale) {
    window.game.scale.resize(window.innerWidth, window.innerHeight);
    window.game.eventsBus.emit('orientationChanged', window.orientation);
  }
});
