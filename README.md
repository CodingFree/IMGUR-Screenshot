# IMGUR UPLOADER

This addon was intented to upload any screenshot from Firefox OS to IMGUR. How is it supposed to work?

  - Listen for any mozChromeEvent, until its type is "take-screenshot-success".
  - Then ask the user for a PIN: a clickable notification is displayed. If it is clicked, it should open the RequestUrl.
  - After that, get a token.
  - Use both things to upload the file, which details are in evt.detail.file.

However there are some issues:
  - Obviously, String.Format doesn't work. It is from C#, but I tried to make it clearer.
  - Asking for a PIN may not be a good idea, since there should by an input somewhere to answer.
  - Could be used a XHR to get the PIN automatically?
  - We need a real ClientId and ClientSecret: https://api.imgur.com/oauth2/addclient