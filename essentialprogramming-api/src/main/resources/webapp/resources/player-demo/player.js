class LivePlayer {
    constructor(div, options) {
        this.videoURL = options["url"];
        this.debug = options["debug"];

        this.video = document.createElement("video");
        this.video.setAttribute("controls", "controls");
        this.video.setAttribute("height", "270");

        this.statusMessage = document.createElement("div");
        this.statusMessage.setAttribute("id", "statusMessage")
        this.statusMessage.style.display = 'none';

        div.appendChild(this.video);
        div.appendChild(this.statusMessage);

        this.bufferingInProgress = false;
        this.playerStarted = false;

        this.segmentsQueue = [];

        this.video.addEventListener("pause", (event) => this.closePlayback(event), false);

        if (this.debug) {
            this.attachVideoDebug(this.video);
        }


    }

    PlayStream() {
        showMessage(this.video, "Connecting...", false);
        let mediaSource = this.initMediaSource();
        mediaSource.addEventListener('sourceopen', () => this.mediaSourceOpen());

    }

    initMediaSource() {
        this.mediaSource = new MediaSource();
        if (this.video.src) {
            URL.revokeObjectURL(this.video.src);
        }
        this.video.src = URL.createObjectURL(this.mediaSource);
        return this.mediaSource
    }

    mediaSourceOpen() {
        fetchNextSegment(this.videoURL + "?singleFragment=1")
            .then((request) => {
                this.appendSegment(request);
                this.lastRequest = request;
                return this.video.play();
            })
            .then(() => this.statusMessage.style.display = 'none')
            .catch(e => {
                console.log("Video playback failed")
            })
    }


    closePlayback(event) {
        //event.preventDefault();
    }


    appendSegment(request) {

        if ((this.video.duration - this.video.currentTime < 0.5) && !this.bufferingInProgress) {
            this.bufferingInProgress = true;
            showMessage(this.video, "Buffering...", false);
            this.video.pause();
        } else if ((this.video.duration - this.video.currentTime >= 5) && this.bufferingInProgress) {
            this.bufferingInProgress = false;
            this.statusMessage.style.display = 'none';
            this.video.play().then(() => {});
        }

        const response = new Uint8Array(request.response);
        const sequenceHeader = request.getResponseHeader("X-Sequence");
        if (sequenceHeader === null) {
            throw "Response header X-Sequence not found.";
        }
        const sequenceNumber = parseInt(sequenceHeader, 10);

        // process result
        let sourceBuffer;
        if (this.playerStarted) {
            sourceBuffer = this.mediaSource.sourceBuffers[0];
        } else {
            this.playerStarted = true;
            sourceBuffer = this.mediaSource.addSourceBuffer(request.getResponseHeader("Content-type"));
            sourceBuffer.addEventListener("updateend", () => {
                // seek to the start time of the buffer
                if (this.video.currentTime === 0 && this.video.readyState > 0) {
                    this.video.currentTime = sourceBuffer.buffered.start(0);

                }
                if ((sourceBuffer != null) && !sourceBuffer.updating) {
                    if (this.segmentsQueue.length > 0) {
                        sourceBuffer.appendBuffer(this.segmentsQueue.shift());

                    }
                }
            }, false);

            if (this.debug) {
                this.attachBufferDebug(sourceBuffer);
            }
        }
        if (sourceBuffer.updating || this.segmentsQueue.length > 0)
            this.segmentsQueue.push(response);
        else
            sourceBuffer.appendBuffer(response);

        showMessage(this.video, "Sequence: " + sequenceNumber, false);
        // request next fragment
        fetchNextSegment(this.videoURL + "?singleFragment=1&sendHeader=0&fragmentSequence=" + (sequenceNumber + 1))
            .then((request) => {
                this.appendSegment(request);
                this.lastRequest = request
            });
    }


    attachVideoDebug(video) {
        const events = ["loadstart", "progress", "suspend", "abort", "error", "emptied", "stalled", "loadedmetadata", "loadeddata", "canplay", "canplaythrough", "playing", "waiting", "seeking", "seeked", "ended", "durationchange", "timeupdate", "play", "pause", "ratechange", "resize", "volumechange"];
        for (let i = 0; i < events.length; i++) {
            video.addEventListener(events[i], this.logVideoEvent);
        }
    }


    attachBufferDebug(sourceBuffer) {
        const events = ["updatestart", "update", "updateend", "error", "abort"];
        for (let i = 0; i < events.length; i++) {
            sourceBuffer.addEventListener(events[i], this.logVideoEvent);
        }
    }


    logVideoEvent(event) {
        let video = event.target;
        let debugTable = document.getElementById("videoDebug");
        if (!debugTable) {
            debugTable = document.createElement("table");
            debugTable.id = "videoDebug";
            debugTable.innerHTML = '<tr><td>Time</td><td>Target</td><td>Event</td><td>Current time</td><td>Network state</td><td>Ready state</td><td>Duration</td><td>Error</td><td>Buffer length</td><td>Last buffer</td></tr>';
            debugTable.style.borderSpacing = 10 + 'px';
            document.body.appendChild(debugTable);
        }
        const tr = document.createElement("tr");
        if (debugTable.children.length > 1) {
            debugTable.insertBefore(tr, debugTable.children[1]);
        } else {
            debugTable.appendChild(tr);
        }
        const date = new Date();
        tr.innerHTML = '<td>' + (date.getHours() + ":" + date.getMinutes() + ":<b>" + date.getSeconds() + "." + date.getMilliseconds()) + '</b></td><td>' + Object.getPrototypeOf(event.target).constructor.name + '</td><td style="color: orange; font-weight: bold;">' + event.type + '</td><td>' + video.currentTime + '</td><td>' + video.networkState + '</td><td>' + video.readyState + '</td><td>' + video.duration + '</td><td>' + (video.error ? video.error.code : '-') + '</td><td>' + video.buffered.length + '</td><td>' + (video.buffered.length ? (video.buffered.start(video.buffered.length - 1) + " - " + video.buffered.end(video.buffered.length - 1)) : 0) + '</td>';
    }

}


fetchNextSegment = function (segmentUrl) {

    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.responseType = "arraybuffer";
        request.onload = (event) => resolve(event.currentTarget);
        request.onerror = () => reject(request.statusText);
        request.open("GET", segmentUrl, true);
        request.send();
    });
};

function showMessage(video, msg, err) {
    let statusMessage = document.getElementById("statusMessage");
    if (err)
        statusMessage.style.top = -1 * video.height + 20 + 'px';
    else
        statusMessage.style.top = '-50px';

    statusMessage.style.left = video.offsetWidth - video.width + 5 + 'px';
    statusMessage.innerHTML = msg;
    statusMessage.style.display = 'block';
}

