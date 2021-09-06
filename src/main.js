
function onHomepage(e) {
  const builder = CardService.newCardBuilder();

  const dataInput = CardService.newTextInput().setTitle('Data to encode')
      .setFieldName('data')
      .setHint(`Required. Up to 500 characters`);

  const widthInput = CardService.newTextInput().setTitle('Generated image width')
      .setFieldName('width')
      .setValue('200')
      .setHint(`Required. Number between 64 and 64, inclusive.`);

  const submitAction = CardService.newAction()
      .setFunctionName('onGenerateImage')
      .setLoadIndicator(CardService.LoadIndicator.SPINNER);
  const submitButton = CardService.newTextButton()
      .setText('Generate and insert Tracking code')
      . setOnClickAction(submitAction);
  const optionsSection = CardService.newCardSection()
      .addWidget(dataInput)
      .addWidget(widthInput)
      .addWidget(submitButton);

  builder.addSection(optionsSection);
  return builder.build();
}

/**
 * Action for generating and inserting QR Code.
 * @param {Object} e - Event from add-on server
 * @return {CardService.ActionResponse} result of action
 */
function onGenerateImage(e) {
  /*
  const data = e.formInput.data;
  let width = e.formInput.width;
  */

  const imageUrl = generateTrackingCodeUrl(e);
  if (e.hostApp == 'gmail') {
      const html = `<img style="display: block" src="${imageUrl}"/>`;
      const updateAction = CardService.newUpdateDraftBodyAction()
          .addUpdateContent(html, CardService.ContentType.MUTABLE_HTML)
          .setUpdateType(CardService.UpdateDraftBodyType.IN_PLACE_INSERT);
      return CardService.newUpdateDraftActionResponseBuilder()
          .setUpdateDraftBodyAction(updateAction)
          .build();
  }
  return notify('Host app not supported.');
}

function generateTrackingCodeUrl(e) {
  const mautic_secret = `MYSECRETHARDCODED`;
  const from = encodeURIComponent(`FROMHARDCODED`);
  const to = encodeURIComponent(e.gmail.toRecipients.join(';'));
  const subject = encodeURIComponent(e.gmail.subject);
  let qs = `from=${from}&email=${to}&subject=${subject}&body=`;
  const buf = Utilities.newBlob(pako.gzip(qs, {'to':'string'}));
  var d = encodeURIComponent(Utilities.base64Encode(buf.getBytes()));

  var cr = CryptoJS.PHP_CRYPT_MD5(d, "$1$" + mautic_secret);
  var hash = crc32(cr).toString();
  while (hash.length < 8) hash = '0' + hash.toString();

  const base_url = `https://MY_URL_HARDCODED/plugin/Gmail/tracking.gif`;
  return `${base_url}?d=${d}&sig=${hash}`;
}

/**
 * Builds an action response with a notification message only.
 *
 * @param {string} message - Message to display to user
 * @return {CardService.ActionResponse} response
 */
function notify(message) {
  const notification = CardService.newNotification().setText(message);
  return CardService.newActionResponseBuilder()
      .setNotification(notification)
      .build();
}
