export default class PopUp {
    constructor(videoPlayer) {
        this.videoPlayer = videoPlayer;
        this.videoPlayer.addEventListener('playerReady', async () => {
            await this.init().catch(error => console.log("Could not initialize pop up controller, due to " + error))
        });
    }

    async init() {
        this.popUp = this.videoPlayer.shadowRoot.querySelector('slot[name=pop-up]').assignedNodes({ flatten: true })[0];
        if (this.popUp) {
            const playerAdapter = this.videoPlayer.playerAdapter;
            function popUpCloseHandler() {
                playerAdapter.play();
                this.popUp.removeEventListener('popup-close', boundCloseHandler);
            }
            const boundCloseHandler = popUpCloseHandler.bind(this);

            this.popUp.addEventListener('popup-open', () => {
                if (!playerAdapter.isPaused()) {
                    playerAdapter.pause();
                    this.popUp.addEventListener('popup-close', boundCloseHandler);
                }
            });
        }
    }

    popUpSilentClose() {
        if (this.popUp) {
            this.popUp.setAttribute('open', false);
            this.popUp.classList.remove('open');
        }
    }
}