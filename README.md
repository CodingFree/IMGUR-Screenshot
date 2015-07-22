# ANO UPLOADER

This addon was intented to upload any screenshot from Firefox OS to ANO. How is it supposed to work?

  - Listen for any mozChromeEvent, until its type is "take-screenshot-success".
  - Use evt.detail.file to upload the file.