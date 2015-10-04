var UIEvents = require("../../../service/UI/UIEvents");
var EventEmitter = require("events");
var eventEmitter = new EventEmitter();
var WARNING_REPEAT_DELAY = 600000;
var warningLastShownAt = -1;

var MuteAlerter = {
    registerListeners:function (){
        APP.statistics.addAudioLevelListener(audioLevelChanged);
        APP.UI.addListener(UIEvents.LOCAL_AUDIO_MUTED, microphoneMuted);
        APP.UI.addListener(UIEvents.LOCAL_VIDEO_MUTED, microphoneMuted);

    },

    addMuteAlertListener:function(listener){
        eventEmitter.on(UIEvents.MUTE_ALERT, listener);
    }

};

function audioLevelChanged(jid, audioLevel) {

    //console.log("FUCK YOU MA.al="+audioLevel);
    if (jid === APP.statistics.LOCAL_JID
        && APP.RTC.localAudio.isMuted()
        && audioLevel > 0.02
        && (new Date().getTime() - warningLastShownAt > WARNING_REPEAT_DELAY)) {

        warningLastShownAt = new Date().getTime();
        eventEmitter.emit(UIEvents.MUTE_ALERT);
    }
}

function microphoneMuted(muted) {
    console.log("muted=" + muted);
    warningLastShownAt = 0;

}

module.exports = MuteAlerter;
