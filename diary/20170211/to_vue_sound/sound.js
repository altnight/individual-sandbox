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
          id: 'Some',
          path: 'assets/Some.mp3'
        },
        {
          id: 'Other',
          path: 'assets/Other.mp3'
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
    toggleMute: function() {
      this.muted ? this.muted = false : this.muted = true;
    },
    loadSound: function() {
      this.sounds.forEach(function(sound) {
        createjs.Sound.registerSound(sound.path, sound.id);
      })
    },
    playSound: function() {
      this.sounds.forEach(function(sound) {
        createjs.Sound.stop(sound.id)
      })
      this.soundInstance = createjs.Sound.play(this.sound.id);
    },
    togglePan: function() {
      if (this.soundInstance.getPan()) {
        this.soundInstance.setPan(false);
        this.pan = false;
      } else {
        this.soundInstance.setPan(true);
        this.pan = true;
      }
    },
    toggleLoop: function() {
      if (this.soundInstance.getLoop()) {
        this.soundInstance.setLoop(false)
        this.loop = false;
      } else {
        this.soundInstance.setLoop(true);
        this.loop = true;
      }
    },
    toggleMuted: function() {
      if (this.soundInstance.getMuted()) {
        this.soundInstance.setMuted(false)
        this.muted = false
      } else {
        this.soundInstance.setMuted(true);
        this.muted = true
      }
    },
    togglePaused: function() {
      if (this.soundInstance.getPaused()) {
        this.soundInstance.setPaused(false)
        this.paused = false
      } else {
        this.soundInstance.setPaused(true);
        this.paused = true
      }
    },
  },
  watch: {
    volume: function(val) {
      if (!this.sound || !this.soundInstance) return

      this.soundInstance.setVolume(val);
    }
  }
})
