(function () {
    console.log("IMGUR Running");

    function uploader() {
        this._started = false;
    }
    uploader.prototype = {
        /**
         * Start to handle screenshot events.
         * @memberof Screenshot.prototype
         */
        start: function () {
            if (this._started) {
                throw 'Instance should not be start()\'ed twice.';
            }
            this._started = true;

            window.addEventListener('mozChromeEvent', this);
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

            window.removeEventListener('mozChromeEvent', this);
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
                        this.handleTakeScreenshotSuccess(evt.detail.file);
                    } else if (evt.detail.type === 'take-screenshot-error') {
                        this._notify('screenshotFailed', evt.detail.error);
                    }
                    break;

                default:
                    //console.debug('Unhandled event: ' + evt.type);
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

                //UPLOAD

                /**
                this._getDeviceStorage(function (storage) {
                    var d = new Date();
                    d = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
                    var filename = 'screenshots/' + d.toISOString().slice(0, -5).replace(/[:T]/g, '-') + '.png';

                    var saveRequest = storage.addNamed(file, filename);
                    saveRequest.onsuccess = (function ss_onsuccess() {
                        // Vibrate again when the screenshot is saved
                        navigator.vibrate(100);

                        // Display filename in a notification
                        this._notify('screenshotSaved', filename, null,
                        this.openImage.bind(this, filename));
                    }).bind(this);

                    saveRequest.onerror = (function ss_onerror() {
                        this._notify('screenshotFailed', saveRequest.error.name);
                    }).bind(this);
                });**/
            } catch (e) {
                console.log('exception in screenshot handler', e);
                this._notify('screenshotFailed', e.toString());
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
        _notify: function notify(titleid, body, bodyid, onClick) {
            var title = navigator.mozL10n.get(titleid) || titleid;
            body = body || navigator.mozL10n.get(bodyid);
            var notification = new window.Notification(title, {
                body: body,
                icon: '/style/icons/Gallery.png',
                tag: 'screenshot:' + (new Date().getTime()),
                data: {
                    systemMessageTarget: 'screenshot'
                }
            });

            notification.onclick = function () {
                notification.close();
                if (onClick) {
                    onClick();
                }
            };
        }
    };

}());