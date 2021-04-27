import Utils from '../common/Utils';

export default class Snapshot {
    constructor(videoPlayer) {
        this.videoPlayer = videoPlayer;
        this.init().catch(error => console.log('Could not initialize snapshot button, due to ' + error));
    }

    async init() {
        this.element = this.videoPlayer.shadowRoot.getElementById("snapshot-btn");
        this.element.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            this.videoPlayer.videoElement.setAttribute('crossorigin', 'Anonymous');
            canvas.width = this.videoPlayer.videoElement.videoWidth;
            canvas.height = this.videoPlayer.videoElement.videoHeight;
            canvas.getContext('2d').drawImage(this.videoPlayer.videoElement, 0, 0, canvas.width, canvas.height);

            const todayDate = new Date();
            const fileName = `Screenshot ${[
                todayDate.getDate(),
                todayDate.getMonth() + 1,
                todayDate.getFullYear(),
                todayDate.getHours(),
                todayDate.getMinutes()
            ].join('-')}`;
            let snapshotURL;
            canvas.toBlob((blob) => {
                snapshotURL = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = snapshotURL;
                link.download = fileName;
                link.style.display = 'none';
                link.click();
                URL.revokeObjectURL(snapshotURL);
            });

        });
    }
}
