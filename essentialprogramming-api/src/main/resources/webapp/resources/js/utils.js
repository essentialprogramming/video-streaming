class Utils {

    constructor() {

    }

    static getRequestParameter(parameterName){
        if(parameterName = (new RegExp('[?&]' + encodeURIComponent(parameterName) + '=([^&]*)')).exec(location.search))
            return decodeURIComponent(parameterName[1]);
    }

    static async streamCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            const video = document.getElementById("video");
            video.srcObject = stream;
        } catch(err) {
            alert("Unable to access camera");
            console.log(err);
        }
    }

}