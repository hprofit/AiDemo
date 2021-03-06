(function (ng) {
    'use strict';

    ng.module('aidemo.models.chip.sound', [])
        .factory('Sound', ['$document', function ($document) {

            /**
             * Class that loads a mp3 file and stores it for play later
             * @param params - Object with params, MUST HAVE A 'soundFile' PROPERTY
             * @constructor
             */
            function Sound(params) {
                params = params || {};

                if (!params.soundFile) {
                    throw new Error("ERROR INSTANTIATING SOUND: MUST HAVE A SOUNDFILE");
                }
                this.soundFile = params.soundFile;

                //this.audioElement = ng.element('<audio />');//document.createElement("audio");
                this.audioElement = $document.createElement("audio");
                this.audioElement.preload = "auto";

                //var src = ng.element('<source />'); //document.createElement("source");
                var src = $document.createElement("source");
                src.src = this.soundFile + ".mp3";
                this.audioElement.appendChild(src);
                this.audioElement.load();
                this.audioElement.volume = 1.0;
            }

            /**
             * A collection of sound URLs related to Item type
             */
            var soundRoot = "sounds/";
            Sound.DEATH = soundRoot + "death";

            /**
             * Given a time, sets the audioElement's current time then calls play
             * @param when - Number
             */
            Sound.prototype.play = function (when) {
                this.audioElement.currentTime = _.isNumber(when) ? when : 0.01;

                this.audioElement.play();
            };

            return Sound;
        }]);
})(angular);

