import NativePlayer from "./adapters/NativePlayer.js";
import DashPlayer from "./adapters/DashPlayer.js";
import Factory from "./PlayerFactory.js";
import PlayButton from "./controls/Play.js";
import TimeControl from "./controls/Time.js";

const factory = new Factory();
const videoElement = document.getElementById("videoPlayer");

factory.registerPlayer(new DashPlayer({
    'videoElement': videoElement,
    'src': 'vendor/dashjs/js/dash.all.min.js',
    'autoplay': false
}));

factory.registerPlayer(new NativePlayer({
    'videoElement': videoElement,
    "autoplay": false
}));

let urlMpdExtern = "http://www.bok.net/dash/tears_of_steel/cleartext/stream.mpd"
let urlThumbNail = "http://dash.edgesuite.net/akamai/bbb_30fps/bbb_with_multiple_tiled_thumbnails.mpd"
let urlMultiPeriod = "https://dash.akamaized.net/dash264/TestCases/5a/nomor/1.mpd"
let urlMp4 = "/api/video/stream/mp4/Tom&Jerry";
let urlMpd = "manifest.mpd";
let streamM = "http://localhost:8080/consume/first"

factory.getPlayer(urlMpd).then(function (player) {
        const playControl = new PlayButton(player);
        const timeControl = new TimeControl(player);

        document.getElementById("controlsContainer").appendChild(playControl.getElement());
        document.getElementById("timeContainer").appendChild(timeControl.getElement());
    },
    function (reason) {
        alert(reason);
    }
);

