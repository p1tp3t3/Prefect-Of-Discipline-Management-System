export class Broadcast {
    constructor(
        broadcastType = 'private', 
        broadcastChannel = null, 
        broadcastEvent = null, 
        callBack = (e) => {},
        enableConfiguration = false
    ) {
        this.broadcastType = broadcastType;
        this.broadcastChannel = broadcastChannel;
        this.broadcastEvent = broadcastEvent;
        this.callBack = callBack;
        this.setter = null
        if(enableConfiguration) this.configure();
    }
    configure(message = '') {
        switch(this.getBroadcastType()) {
            case 'public':
                Echo.channel(this.getBroadcastChannel())
                    .subscribed(() => {
                        console.log(`subscribed. ready for broadcasting public channel. ${message}`)
                    })
                    .listen(`${this.getBroadcastEvent()}`, this.getCallBack())
                break
            case 'private':
                Echo.private(this.getBroadcastChannel())
                    .subscribed(() => {
                        console.log(`subscribed. ready for broadcasting private channel. ${message}`)
                    })
                    .listen(`${this.getBroadcastEvent()}`, this.getCallBack())
                break
        }
    }
    setBroadcastType(broadcastType) {
        this.broadcastType = broadcastType;
    }
    setBroadcastChannel(broadcastChannel) {
        this.broadcastChannel = broadcastChannel;
    }
    setBroadcastEvent(broadcastEvent) {
        this.broadcastEvent = broadcastEvent;
    }
    setCallBack(callBack) {
        this.callBack = callBack;
    }
    setSetter(setter) {
        this.setter = setter
    }
    getBroadcastType() {
        return this.broadcastType;
    }
    getBroadcastChannel() {
        return this.broadcastChannel;
    }
    getBroadcastEvent() {
        return this.broadcastEvent;
    }
    getCallBack() {
        return this.callBack;
    }
    getSetter() {
        return this.setter
    }
}