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

class EventBus extends Phaser.Events.EventEmitter {
  constructor() {
    super();
  }
}

class InputManager {
  constructor(game) {
    this.game = game;
    this.bindings = {
      jump: ['SPACE', 'TOUCH_TAP'],
      attack: ['KEY_Z', 'TOUCH_SWIPE'],
      interact: ['KEY_E', 'TOUCH_HOLD'],
    };
  }
  // Real input methods, binding listeners, etc.
}

const DEBUG_MODE = false;

const globalGameData = {
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

const eventBus = new EventBus();

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: document.body,
  backgroundColor: '#050510',
  scene: [
    PreloadScene,
    SplashScene,
    MainMenuScene,
    GameScene,
    OptionsScene,
    LoreScene,
    MapScene,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: DEBUG_MODE,
    },
  },
  input: {
    activePointers: 3,
  },
  audio: {
    disableWebAudio: false,
  },
  callbacks: {
    postBoot: (game) => {
      try {
        game.globalData = globalGameData;
        game.eventsBus = eventBus;
        game.debugMode = DEBUG_MODE;

        game.audioManager = new AudioManager(game);
        game.audioManager.setVolume(globalGameData.settings.musicVolume);

        game.saveManager = new SaveManager(game);
        game.saveManager.load().then(() => {
          globalGameData.saveLoaded = true;
          eventBus.emit('saveLoaded');
        });

        game.inputManager = new InputManager(game);

        window.addEventListener('keydown', (e) => {
          if (e.key === '`') {
            game.debugConsoleVisible = !game.debugConsoleVisible;
            eventBus.emit('toggleDebugConsole', game.debugConsoleVisible);
            console.log(`Debug Console: ${game.debugConsoleVisible ? 'Shown' : 'Hidden'}`);
          }
        });

        if (DEBUG_MODE) {
          const fpsText = game.scene.scenes[0].add.text(10, 10, '', { font: '16px monospace', fill: '#0f0' });
          game.events.on('step', () => {
            const fps = Math.floor(game.loop.actualFps);
            fpsText.setText(`FPS: ${fps}`);
          });
        }

        eventBus.on('sceneStart', (sceneKey) => {
          console.log(`Analytics: Scene started - ${sceneKey}`);
        });

        game.localization = {
          currentLanguage: globalGameData.settings.language,
          strings: {},
          translate: (key) => {
            return game.localization.strings[key] || key;
          },
        };

        eventBus.emit('gameInitialized');
      } catch (error) {
        console.error('Error during game initialization:', error);
      }
    },
  },
};

window.game = new Phaser.Game(config);

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
