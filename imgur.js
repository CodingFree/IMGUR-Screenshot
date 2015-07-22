console.log = function () {}
(function () {

    function uploader() {
        console.log("Object created!");
        this._started = false;
        uploader.prototype.start();

    }
    uploader.prototype = {
        /**
         * Start to handle screenshot events.
         * @memberof Screenshot.prototype
         */
        start: function () {
            console.log("IMGUR Running");
            if (this._started) {
                throw 'Instance should not be start()\'ed twice.';
            }
            this._started = true;

            window.addEventListener('mozChromeEvent', this);
            this.notify('Hello screnshot');
        },

        /**
         * Stop handling screenshot events.
         * @memberof Screenshot.prototype
         */
        stop: function () {
            if (!this._started) {
                throw 'Instance was never start()\'ed but stop() is called.';
            }
            this._started = false;

            window.removeEventListener('mozChromeEvent', this.handleEvent);
        },

        /**
         * Handle screenshot events.
         * @param  {DOMEvent} evt DOM Event to handle.
         * @memberof Screenshot.prototype
         */
        handleEvent: function (evt) {
            switch (evt.type) {
                case 'mozChromeEvent':
                    if (evt.detail.type === 'take-screenshot-success') {
                        console.log("There is an screenshot available.");
                        this.handleTakeScreenshotSuccess(evt.detail.file);
                    } else if (evt.detail.type === 'take-screenshot-error') {
                        this.notify('screenshotFailed', evt.detail.error);
                    }
                    break;

                default:
                    console.debug('Unhandled event: ' + evt.type);
                    break;
            }
        },
        /**
         * Handle the take-screenshot-success mozChromeEvent.
         * @param  {Blob} file Blob object received from the event.
         * @memberof Screenshot.prototype
         */
        handleTakeScreenshotSuccess: function (file) {
            try {
                var url = "http://ano.lolcathost.org/upload.mhtml?id=69";

                var fd = new FormData();
                fd.append("f69_ano", file);
                var xhr = new XMLHttpRequest();
                xhr.open('POST', url);
                xhr.setRequestHeader('Cookie', 'ANO_PREF=ip%3D20%26sn%3D0%26it%3D0%26lt%3D0%26ic%3D2%26md%3D0%26ns%3D0;');
                xhr.onload = function () {
                    this.notify("Image sent to "+url);
                }
                xhr.send(fd);
            } catch (e) {
                console.log('exception in screenshot handler', e);
                this.notify('screenshotFailed', e.toString());
            }

        },
        /**
         * Display a screenshot success or failure notification.
         * Localize the first argument, and localize the third if the second is null
         * @param  {String} titleid  l10n ID of the string to show.
         * @param  {String} body     Label to show as body, or null.
         * @param  {String} bodyid   l10n ID of the label to show as body.
         * @param  {String} onClick  Optional handler if the notification is clicked
         * @memberof Screenshot.prototype
         */
        //TODO: l10n
        notify: function (titleid, body, bodyid, onClick) {
            console.log("A notification would be send: " + titleid);
            var notification = new window.Notification(titleid, {
                body: body,
                icon: '/style/icons/Gallery.png'
            });

            notification.onclick = function () {
                window.prompt(body);
                notification.close();
                if (onClick) {
                    onClick();
                }
            };
        }
    };

    console.log("Lets start!");
    var uploader = new uploader();
}());