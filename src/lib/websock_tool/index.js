class WebSocketTool {
    constructor(wss_url) {
        this.isOpen = false;
        this.event = new EventTarget();
        if(window.WebSocket) {
            if(!this.websocket) this.websocket = new WebSocket(wss_url);
        } else {
            throw new Error('不支持WebSocket');
        }
        this.connect();
    }
    on(event, callback) {
        this.event.addEvent(event, callback);
    }
    onMessage(callback) {
        this.event.addEvent('message', callback);
    }
    onError(callback) {
        this.event.addEvent('error', callback);
    }
    onOpen(callback) {
        this.event.addEvent('open', callback);
    }
    onClose(callback) {
        this.event.addEvent('close', callback);
    }
    connect() {
        if(this.websocket) {
            try {
                this.websocket.onopen = () => {
                    this.isOpen = true;
                    this.event.fireEvent('open');
                };

                this.websocket.onmessage = (message) => {
                    let data = message.data;
                    if(!data || data == "") {
                        this.event.fireEvent('error', message);
                    } else {
                        this.event.fireEvent('message', message.data);
                    }
                }
                
                this.websocket.onclose = () => {
                    this.event.fireEvent('close');
                    this.isOpen = false;
                }

                this.websocket.onerror = (e) => {
                    this.isOpen = false;
                    this.event.fireEvent('error', e);
                }
            } catch(e) {
                this.event.fireEvent('error', e);
            }
        }
    }
    send(cmd) {
        if(this.isOpen && this.websocket) {
            this.websocket.send(cmd);
        }
    }
    close() {
        this.isOpen = false;
        this.websocket && this.websocket.close();
    }
}

export default WebSocketTool;

const EventTarget = function() {
    this._listener = {};
};

EventTarget.prototype = {
    constructor: this,
    addEvent: function(type, fn) {
        if (typeof type === "string" && typeof fn === "function") {
            if (typeof this._listener[type] === "undefined") {
                this._listener[type] = [fn];
            } else {
                this._listener[type].push(fn);    
            }
        }
        return this;
    },
    fireEvent: function(type) {
        if (type && this._listener[type]) {
            var events = {
                type: type,
                target: this
            };
            
            for (var length = this._listener[type].length, start=0; start<length; start+=1) {
                let res = [];
                for(let i = 1; i < arguments.length; i++) {
                    res.push(arguments[i]);
                }
                res.push(events);
                this._listener[type][start].call(this, ...res);
            }
        }
        return this;
    },
    removeEvent: function(type, key) {
        var listeners = this._listener[type];
        if (listeners instanceof Array) {
            if (typeof key === "function") {
                for (var i=0, length=listeners.length; i<length; i+=1){
                    if (listeners[i] === listener){
                        listeners.splice(i, 1);
                        break;
                    }
                }
            } else if (key instanceof Array) {
                for (var lis=0, lenkey = key.length; lis<lenkey; lis+=1) {
                    this.removeEvent(type, key[lenkey]);
                }
            } else {
                delete this._listener[type];
            }
        }
        return this;
    }
};