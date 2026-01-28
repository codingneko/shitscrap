const container = document.getElementById("item-container");
const failCounter = document.getElementById("fail-counter");
const successCounter = document.getElementById("success-counter");
var failCount = 0;

var amount;
var url;
var idLength;
var postfix;
var type;

var searching = false;

function updateFields() {
    amount = document.getElementById("number").value;
    url = document.getElementById("base-url").value;
    idLength = document.getElementById("id-length").value;
    postfix = document.getElementById("postfix").value;
    type = document.getElementById("type").value;
}

async function search() {
    if (searching) return;
    searching = true;
    updateFields();
    failCount = 0;

    switch (type) {
        case "text":
            await fetchText();
            break;
        case "html":
            await fetchHtml();
            break;
        case "image":
            await fetchImage();
            break;
        case "video":
            console.log("video not yet implemented");
            break;
    }
    searching = false;
}

function stopSearch() {
    searching = false;
}

async function fetchText() {
    let counter = amount;

    while (counter > 0 && searching) {
        const id = generateId(Number(idLength))
        const source = `${encodeURIComponent(url)}${id}${postfix}`;
        const response = await fetch(source);
        const content = await response.text();

        if (response.status < 400 && content != "") {
            const dispayElement = document.createElement('div');
            dispayElement.classList.add("text-item");
            dispayElement.innerText = content;
            container.appendChild(dispayElement);
            counter--;
        } else {
            failCount++;
        }

        failCounter.innerText = failCount;
        successCounter.innerText = amount - counter;

        delay(300);
    }
}

async function fetchImage() {
    let counter = amount;

    while (counter > 0 && searching) {
        const id = generateId(Number(idLength))
        const source = `${url}${id}${postfix}`;
        if (await checkImageExists(source)) {
            const dispayElement = document.createElement('img');
            dispayElement.classList.add("image-item")
            dispayElement.src = source;
            container.appendChild(dispayElement);
            counter--;
        } else {
            failCount++;
        }

        failCounter.innerText = failCount;
        successCounter.innerText = amount - counter;
        delay(300);
    }
}

async function fetchHtml() {
    let counter = amount;

    while (counter > 0 && searching) {
        const id = generateId(Number(idLength));
        const source = `${url}${id}${postfix}`;

        if (await checkWebsiteResponds(source)) {
            const dispayElement = document.createElement("div");
            dispayElement.innerHTML = "<a href=" + source + ">" + source + "</a></br>";
            container.appendChild(dispayElement);
            counter--;
        } else {
            failCount++;
        }
    }
}

function generateId(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
            if (img.naturalHeight <= 200 && img.naturalHeight <= 100) {
                resolve(false);
            } else {
                resolve(true);
            }
        };
        img.onerror = () => resolve(false);

        img.src = url;
    });
}

async function checkWebsiteResponds(url) {
    try {
        let req = await fetch(`/check/${encodeURIComponent(url)}`);
        let response = await req.json();
    } catch (error) {
        console.log(error);
        return false;
    }

    return response.status < 400;
}


function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}