class Utils {

    constructor() {

    }

    static getRequestParameter(parameterName){
        if(parameterName = (new RegExp('[?&]' + encodeURIComponent(parameterName) + '=([^&]*)')).exec(location.search))
            return decodeURIComponent(parameterName[1]);
    }

    static async streamCamera() {
        try {
            let mediaConstraints = {
                audio: false,
                video: true
            };
            const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
            const video = document.getElementById("video");
            video.srcObject = stream;
            Utils.onMediaSuccess(stream)
        } catch(err) {
            alert("Unable to access camera");
            console.log(err);
        }
    }

    static onMediaSuccess(stream) {
        stream.getTracks().forEach((track) => console.log(track));
        let options = {mimeType: 'video/webm;codecs=h264'};
        let mediaRecorder  = new MediaRecorder(stream,options);
        mediaRecorder.start(250);
        mediaRecorder.ondataavailable  = function(blob) {
            console.log(blob.data);
            //let blobURL = URL.createObjectURL(blob);
        };

    }

}