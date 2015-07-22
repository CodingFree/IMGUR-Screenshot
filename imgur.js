(function () {
    console.log("IMGUR Running");

    var uploader = {

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
         * Ask the user to get the PIN from Imgur.
         * @param  {Blob} file Blob object received from the event.
         * @memberof Screenshot.prototype
         */
        _GetPin: function () {
            var OAuthUrlTemplate = "https://api.imgur.com/oauth2/authorize?client_id={0}&response_type={1}&state={2}";
            var RequestUrl = String.Format(OAuthUrlTemplate, clientId, "pin", "whatever");
            var Pin = String.Empty;

            // Promt the user to browse to that URL or show the Webpage in your application
            this._notify('screenshotPin', "You need to get the PIN from "+RequestUrl);

            return Pin;
        },
        /**
         * Handle the take-screenshot-success mozChromeEvent.
         * @param  {Blob} file Blob object received from the event.
         * @memberof uploader.prototype
         */
        _GetToken: function () {
            var Url = "https://api.imgur.com/oauth2/token/";
            var DataTemplate = "client_id={0}&client_secret={1}&grant_type=pin&pin={2}";
            var Data = String.Format(DataTemplate, clientId, clientSecret, pin);

            /** TBD
            using(WebClient Client = new WebClient())
            {
                string ApiResponse = Client.UploadString(Url, Data);

                // Use some random JSON Parser, you´ll get access_token and refresh_token
                var Deserializer = new JavaScriptSerializer();
                var Response = Deserializer.DeserializeObject(ApiResponse) as Dictionary<string, object>;

                return new ImgurToken()
                {
                    AccessToken = Convert.ToString(Response["access_token"]),
                    RefreshToken = Convert.ToString(Response["refresh_token"])
                };
            }**/
        },
        /**
         * Handle the take-screenshot-success mozChromeEvent.
         * @param  {Blob} file Blob object received from the event.
         * @memberof Screenshot.prototype
         */
        handleTakeScreenshotSuccess: function (file) {
            try {
                const string ClientId = "abcdef123";
                const string ClientSecret = "Secret";

                string Pin = this._GetPin(ClientId, ClientSecret);
                string Tokens = this._GetToken(ClientId, ClientSecret, Pin);

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
                });
            } catch (e) {
                console.log('exception in screenshot handler', e);
                this._notify('screenshotFailed', e.toString());
            }**/
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

    window.addEventListener("mozChromeEvent", uploader, false);
}());