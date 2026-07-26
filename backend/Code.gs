const CONFIG = {
  providerName: "Digital Movement Marketing Ltd",
  providerAddress: "128 City Road, London EC1V 2NX, United Kingdom",
  companyNumber: "17110525",
  replyTo: "alex@digitalmovement.uk",
  internalRecipient: "alex@digitalmovement.uk",
  sheetName: "Orders",
  contractDelayHours: 24
};

const HEADERS = [
  "Order ID",
  "Created",
  "Contract due",
  "Status",
  "Email",
  "First name",
  "Last name",
  "Company",
  "Phone",
  "Address",
  "Postal code",
  "City",
  "Services JSON",
  "Pricing JSON",
  "Contract sent"
];

function setupOrderSystem() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheetId = properties.getProperty("ORDER_SHEET_ID");
  if (!spreadsheetId) {
    const spreadsheet = SpreadsheetApp.create("Digitec Checkout Orders");
    const sheet = spreadsheet.getActiveSheet();
    sheet.setName(CONFIG.sheetName);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    spreadsheetId = spreadsheet.getId();
    properties.setProperty("ORDER_SHEET_ID", spreadsheetId);
  }

  const exists = ScriptApp.getProjectTriggers().some(
    trigger => trigger.getHandlerFunction() === "sendDueContracts"
  );
  if (!exists) {
    ScriptApp.newTrigger("sendDueContracts").timeBased().everyHours(1).create();
  }

  return {
    spreadsheetUrl: SpreadsheetApp.openById(spreadsheetId).getUrl(),
    triggerInstalled: true
  };
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const order = parseOrder_(event);
    validateOrder_(order);
    const sheet = getOrderSheet_();
    rejectDuplicate_(sheet, order.orderId);

    const created = new Date(order.createdAt || new Date().toISOString());
    const due = new Date(created.getTime() + CONFIG.contractDelayHours * 60 * 60 * 1000);
    sheet.appendRow([
      order.orderId,
      created,
      due,
      "WELCOME_SENT",
      order.customer.email,
      order.customer.firstName,
      order.customer.lastName,
      order.customer.company,
      order.customer.phone,
      order.customer.address,
      order.customer.postalCode,
      order.customer.city,
      JSON.stringify(order.services),
      JSON.stringify(order.pricing),
      ""
    ]);

    sendWelcome_(order);
    sendInternalNotification_(order);
    return json_({ ok: true, orderId: order.orderId });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, message: String(error.message || error) });
  } finally {
    lock.releaseLock();
  }
}

function sendDueContracts() {
  const sheet = getOrderSheet_();
  const values = sheet.getDataRange().getValues();
  const now = new Date();

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const row = values[rowIndex];
    const status = row[3];
    const due = new Date(row[2]);
    if (status !== "WELCOME_SENT" || Number.isNaN(due.getTime()) || due > now) continue;

    try {
      const order = orderFromRow_(row);
      sendContract_(order);
      sheet.getRange(rowIndex + 1, 4).setValue("CONTRACT_SENT");
      sheet.getRange(rowIndex + 1, 15).setValue(new Date());
    } catch (error) {
      console.error(`Contract failed for row ${rowIndex + 1}: ${error}`);
      sheet.getRange(rowIndex + 1, 4).setValue("CONTRACT_RETRY");
    }
  }
}

function retryContracts() {
  const sheet = getOrderSheet_();
  const values = sheet.getDataRange().getValues();
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    if (values[rowIndex][3] === "CONTRACT_RETRY") {
      sheet.getRange(rowIndex + 1, 4).setValue("WELCOME_SENT");
    }
  }
  sendDueContracts();
}

function parseOrder_(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error("Empty order");
  }
  return JSON.parse(event.postData.contents);
}

function validateOrder_(order) {
  if (!order || !/^[A-Z0-9-]{8,40}$/.test(String(order.orderId || ""))) {
    throw new Error("Invalid order ID");
  }
  const customer = order.customer || {};
  if (!customer.firstName || !customer.lastName || !customer.company) {
    throw new Error("Customer data is incomplete");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(customer.email || ""))) {
    throw new Error("Invalid email");
  }
  if (!Array.isArray(order.services) || order.services.length === 0) {
    throw new Error("No services selected");
  }
  if (!order.pricing || Number(order.pricing.monthlyTotal) < 0 || Number(order.pricing.oneTimeTotal) < 0) {
    throw new Error("Invalid pricing");
  }
}

function getOrderSheet_() {
  const setup = setupOrderSystem();
  const spreadsheet = SpreadsheetApp.openByUrl(setup.spreadsheetUrl);
  return spreadsheet.getSheetByName(CONFIG.sheetName);
}

function rejectDuplicate_(sheet, orderId) {
  if (sheet.getLastRow() < 2) return;
  const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getDisplayValues().flat();
  if (ids.includes(orderId)) throw new Error("Duplicate order");
}

function sendWelcome_(order) {
  const fullName = `${order.customer.firstName} ${order.customer.lastName}`.trim();
  const services = order.services
    .map(service => `<li style="margin:0 0 8px">${escapeHtml_(service.name)}</li>`)
    .join("");
  const html = emailShell_(`
    <p style="margin:0 0 8px;color:#716879">Bestellnummer ${escapeHtml_(order.orderId)}</p>
    <h1 style="margin:0 0 18px;font-size:30px;line-height:1.15;color:#1a0e2e">Willkommen, ${escapeHtml_(order.customer.firstName)}.</h1>
    <p style="margin:0 0 20px;color:#372945;line-height:1.6">Wir haben Ihre Auswahl erhalten und bereiten alles für den nächsten Schritt vor.</p>
    <div style="padding:18px 20px;border-radius:16px;background:#f7f1ff">
      <strong style="color:#1a0e2e">Ihre Auswahl</strong>
      <ul style="margin:12px 0 0;padding-left:20px;color:#372945">${services}</ul>
    </div>
    <table role="presentation" style="width:100%;margin:20px 0;border-collapse:collapse">
      <tr><td style="padding:10px 0;color:#716879">Monatlich</td><td style="padding:10px 0;text-align:right;font-weight:700;color:#1a0e2e">${money_(order.pricing.monthlyTotal)}</td></tr>
      <tr><td style="padding:10px 0;color:#716879">Einmalig</td><td style="padding:10px 0;text-align:right;font-weight:700;color:#1a0e2e">${money_(order.pricing.oneTimeTotal)}</td></tr>
    </table>
    <p style="margin:0;color:#372945;line-height:1.6">Ihre Vertragsunterlagen erhalten Sie automatisch innerhalb von 24 Stunden als PDF.</p>
  `);

  MailApp.sendEmail({
    to: order.customer.email,
    replyTo: CONFIG.replyTo,
    name: "Digital Movement",
    subject: `Bestätigung ${order.orderId} · Willkommen bei Digital Movement`,
    htmlBody: html,
    body: `Hallo ${fullName}, wir haben Ihre Bestellung ${order.orderId} erhalten. Ihre Vertragsunterlagen folgen innerhalb von 24 Stunden.`
  });
}

function sendInternalNotification_(order) {
  MailApp.sendEmail({
    to: CONFIG.internalRecipient,
    subject: `Neue Digitec-Bestellung · ${order.orderId}`,
    body: [
      `${order.customer.firstName} ${order.customer.lastName}`,
      order.customer.company,
      order.customer.email,
      "",
      order.services.map(service => `- ${service.name}`).join("\n"),
      "",
      `Monatlich: ${money_(order.pricing.monthlyTotal)}`,
      `Einmalig: ${money_(order.pricing.oneTimeTotal)}`
    ].join("\n")
  });
}

function sendContract_(order) {
  const pdf = createContractPdf_(order);
  const html = emailShell_(`
    <p style="margin:0 0 8px;color:#716879">Bestellnummer ${escapeHtml_(order.orderId)}</p>
    <h1 style="margin:0 0 18px;font-size:30px;line-height:1.15;color:#1a0e2e">Ihre Vertragsunterlagen.</h1>
    <p style="margin:0;color:#372945;line-height:1.6">Im Anhang finden Sie die Leistungsvereinbarung zu Ihrer Auswahl. Bei Fragen antworten Sie einfach auf diese E-Mail.</p>
  `);

  MailApp.sendEmail({
    to: order.customer.email,
    replyTo: CONFIG.replyTo,
    name: "Digital Movement",
    subject: `Ihre Vertragsunterlagen · ${order.orderId}`,
    htmlBody: html,
    body: `Ihre Vertragsunterlagen zur Bestellung ${order.orderId} finden Sie im Anhang.`,
    attachments: [pdf]
  });
}

function createContractPdf_(order) {
  const document = DocumentApp.create(`Vertragsunterlagen ${order.orderId}`);
  const body = document.getBody();
  body.appendParagraph("DIGITAL MOVEMENT").setHeading(DocumentApp.ParagraphHeading.TITLE);
  body.appendParagraph("Leistungsvereinbarung").setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph(`Bestellnummer: ${order.orderId}`);
  body.appendParagraph(`Erstellt am: ${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd.MM.yyyy")}`);
  body.appendHorizontalRule();

  body.appendParagraph("Vertragspartner").setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendTable([
    ["Auftragnehmer", `${CONFIG.providerName}\n${CONFIG.providerAddress}\nCompany No. ${CONFIG.companyNumber}`],
    ["Auftraggeber", `${order.customer.company}\n${order.customer.firstName} ${order.customer.lastName}\n${order.customer.address}\n${order.customer.postalCode} ${order.customer.city}\n${order.customer.email}`]
  ]);

  body.appendParagraph("Ausgewählte Leistungen").setHeading(DocumentApp.ParagraphHeading.HEADING2);
  const serviceRows = [["Leistung", "Monatlich", "Einmalig"]];
  order.services.forEach(service => {
    const monthly = Number(service.monthly || 0);
    const oneTime = Number(service.onetime || 0);
    serviceRows.push([
      service.name,
      monthly ? money_(monthly * (1 - Number(order.pricing.discountPercent || 0) / 100)) : "—",
      service.id === "website-development" && order.pricing.websiteWaived ? "0 € · enthalten" : (oneTime ? money_(oneTime) : "—")
    ]);
  });
  body.appendTable(serviceRows);

  body.appendParagraph("Preisübersicht").setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendTable([
    ["Monatlicher Gesamtpreis", money_(order.pricing.monthlyTotal)],
    ["Einmaliger Gesamtpreis", money_(order.pricing.oneTimeTotal)],
    ["Monatlicher Rabatt", `${Number(order.pricing.discountPercent || 0)} %`]
  ]);
  body.appendParagraph("Alle Preise verstehen sich zuzüglich gesetzlicher Umsatzsteuer.");

  body.appendParagraph("Rahmen").setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph("Der konkrete Projektstart, Zugänge, Ansprechpartner und Liefertermine werden im Kick-off gemeinsam bestätigt. Für ein ausgewähltes SEO-Paket gilt eine Mindestvertragslaufzeit von sechs Monaten. Die Website ist bei gleichzeitiger Auswahl von SEO Standard ohne Extra-Kosten enthalten.");
  body.appendParagraph("Diese Unterlagen dienen der abschließenden Prüfung und Unterzeichnung durch beide Vertragspartner.");

  body.appendParagraph("\nOrt, Datum: ______________________________");
  body.appendParagraph("Für den Auftraggeber: _____________________");
  body.appendParagraph("Für Digital Movement: _____________________");
  document.saveAndClose();

  const file = DriveApp.getFileById(document.getId());
  const pdf = file.getAs(MimeType.PDF).setName(`Vertragsunterlagen-${order.orderId}.pdf`);
  file.setTrashed(true);
  return pdf;
}

function orderFromRow_(row) {
  return {
    orderId: row[0],
    createdAt: new Date(row[1]).toISOString(),
    customer: {
      email: row[4],
      firstName: row[5],
      lastName: row[6],
      company: row[7],
      phone: row[8],
      address: row[9],
      postalCode: row[10],
      city: row[11]
    },
    services: JSON.parse(row[12]),
    pricing: JSON.parse(row[13])
  };
}

function money_(value) {
  return `${Number(value || 0).toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`;
}

function emailShell_(content) {
  return `
    <div style="margin:0;padding:28px;background:#f6f3f7;font-family:Arial,sans-serif">
      <div style="max-width:620px;margin:0 auto;padding:32px;border-radius:24px;background:#ffffff">
        <div style="margin-bottom:28px;font-weight:700;color:#1a0e2e">Digital Movement</div>
        ${content}
        <p style="margin:30px 0 0;padding-top:20px;border-top:1px solid #e7e1eb;color:#716879;font-size:12px;line-height:1.5">Raoul Alex Müller · Digital Movement UK<br>alex@digitalmovement.uk</p>
      </div>
    </div>
  `;
}

function escapeHtml_(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
