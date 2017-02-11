Vue.component('sound', {
  template: '#sound-template',
  mounted: function() {
    this.loadSound();
    if (this.sounds) {
      this.sound = this.sounds[0]
    }
  },
  data: function() {
    return {
      sounds: [
        {
          id: null, // Some
          path: null, // 'assets/Some.mp3'
        },
      ],
      sound: null,
      soundInstance: null,

      volume: 0.5,
      muted: false,
      pan: false,
      loop: false,
      paused: false,
    }
  },
  computed: {
    volumeDisplay: function() {
      return this.volume * 100
    }
  },
  methods: {
    loadSound: function() {
      this.sounds.forEach(function(sound) {
        // for gh-pages
        // createjs.Sound.registerSound(sound.path, sound.id);
      })
    },
    playSound: function() {
      this.sounds.forEach(function(sound) {
        createjs.Sound.stop(sound.id)
      })
      this.soundInstance = createjs.Sound.play(this.sound.id);
    },
    togglePan: function() {
      this.soundInstance.getPan() ?  this.soundInstance.setPan(false) : this.soundInstance.setPan(true);
      this.pan = this.soundInstance.getPan();
    },
    toggleLoop: function() {
      this.soundInstance.getLoop() ?  this.soundInstance.setLoop(false) : this.soundInstance.setLoop(true);
      this.loop = this.soundInstance.getLoop();
    },
    toggleMuted: function() {
      this.soundInstance.getMuted() ?  this.soundInstance.setMuted(false) : this.soundInstance.setMuted(true);
      this.muted = this.soundInstance.getMuted()
    },
    togglePaused: function() {
      this.soundInstance.getPaused() ? this.soundInstance.setPaused(false) : this.soundInstance.setPaused(true);
      this.paused = this.soundInstance.getPaused()
    },
  },
  watch: {
    volume: function(val) {
      if (!this.sound || !this.soundInstance) return 0

      this.soundInstance.setVolume(val);
    }
  }
})
