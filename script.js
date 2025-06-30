const sheetId = "1G4AyPW1VW7BxLzzhWd1Q1ZOdxWO-2HddO6S98MAJ5v0";
const sheetName = encodeURIComponent("Sheet1");
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}&range=A1:D`;

fetch(sheetURL)
  .then((response) => response.text())
  .then((csvText) => handleResponse(csvText));

async function readHtmlFileToDom(filePath) {
  const htmlContent = await loadHtmlFile(filePath);
  if (htmlContent) {
    const domDocument = parseHtmlToDom(htmlContent);
    return domDocument;
  }
  return null;
}

function generateTable(sheet) {
  const table = document.createElement("table");

  console.log(sheet);

  for (let i = 0, max = sheet.length; i < max; i++) {

    let sheetObject = sheet[i];

    console.log(sheetObject);
    let name = sheetObject['Name'];
    let position = sheetObject['Position'];
    let mail = sheetObject['mail'];
    let phone = sheetObject['Phone'];

    const tr = document.createElement("tr");
    tr.classList.add("border_bottom");
    tr.setAttribute("onclick", "myFunction(this)");

    const tdName = document.createElement("td");
    tdName.appendChild(document.createTextNode(name));
    tdName.classList.add("name");

    const tdPosition = document.createElement("td");
    tdPosition.appendChild(document.createTextNode(position));
    tdPosition.classList.add("position");

    const tdMail = document.createElement("td");
    tdMail.appendChild(document.createTextNode(mail));
    tdMail.classList.add("mail");

    const tdPhone = document.createElement("td");
    tdPhone.appendChild(document.createTextNode(phone));
    tdPhone.classList.add("phone");

    tr.appendChild(tdName);
    tr.appendChild(tdPosition);
    tr.appendChild(tdMail);
    tr.appendChild(tdPhone);

    table.appendChild(tr);
  }

  const containerSheets = document.getElementById("container_sheets");
  console.log(containerSheets);
  containerSheets.appendChild(table);
}

function handleResponse(csvText) {
  console.log(csvText);
  let sheetObjects = csvToObjects(csvText);
  console.log(sheetObjects);
  generateTable(sheetObjects)
}

function csvToObjects(csv) {
  const csvRows = csv.split("\n");
  const propertyNames = csvSplit(csvRows[0]);
  let objects = [];
  for (let i = 1, max = csvRows.length; i < max; i++) {
    let thisObject = {};
    let row = csvSplit(csvRows[i]);
    for (let j = 0, max = row.length; j < max; j++) {
      thisObject[propertyNames[j]] = row[j];
      if (propertyNames[j] === "Enrolled") {
        thisObject[propertyNames[j]] = new Date(row[j]);
      } else {
        thisObject[propertyNames[j]] = row[j];
      }
    }
    objects.push(thisObject);
  }
  return objects;
}

function csvSplit(row) {
  return row.split(",").map((val) => val.substring(1, val.length - 1));
}

async function loadHtmlFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const htmlString = await response.text();
    return htmlString;
  } catch (error) {
    console.error('Error fetching HTML file:', error);
    return null;
  }
}

function parseHtmlToDom(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  return doc;
}

function myFunction(tr) {
  readHtmlFileToDom('signature_template.html').then((domModelTemplate) => {
    let name = tr.getElementsByClassName('name')[0].innerText;
    let position = tr.getElementsByClassName('position')[0].innerText;
    let mail = tr.getElementsByClassName('mail')[0].innerText;
    let phone = tr.getElementsByClassName('phone')[0].innerText;

    console.log(domModelTemplate);

    let contactName = domModelTemplate.getElementById('contact_name');
    contactName.textContent = name;

    let contactPosition = domModelTemplate.getElementById('contact_position');
    contactPosition.textContent = position;

    let contactEmail = domModelTemplate.getElementById('contact_email');
    contactEmail.textContent = mail;

    let contactEmailLink = domModelTemplate.getElementById('contact_email_link');
    contactEmailLink.setAttribute("href", `mailto: ${mail}`);

    if (phone == "-") {
      let buttonPhone = domModelTemplate.getElementById('contact_phone');
      buttonPhone.remove();
    } else {
      let contactPhone = domModelTemplate.getElementById('contact_phone');
      contactPhone.textContent = phone;

      let contactPhoneLink = domModelTemplate.getElementById('contact_phone_link');
      contactPhoneLink.setAttribute("href", `tel: ${phone}`);
    }

    const newTab = window.open('', '_top');
    if (newTab) {
      newTab.document.writeln(domModelTemplate.documentElement.outerHTML);
      newTab.document.close();
    } else {
      alert('Popup blocked. Please allow popups for this site.');
    }
  });
}
