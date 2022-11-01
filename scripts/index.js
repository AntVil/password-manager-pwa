const ICON_SIZE = 64;

let passwords;

window.onload = function(){
    if("serviceWorker" in navigator){
        navigator.serviceWorker.register("./sw.js");
    }
    
    document.documentElement.style.setProperty('--screenWidth', `${window.innerWidth}px`);
    document.documentElement.style.setProperty('--screenHeight', `${window.innerHeight}px`);

    loadPasswords();
    updatePasswordList();
}

function loadPasswords(){
    passwords = JSON.parse(localStorage.getItem("passwords"));
    if(passwords === null){
        passwords = [];
    }
}

function savePasswords(){
    localStorage.setItem("passwords", JSON.stringify(passwords))
}

function updatePasswordList(){
    let sort = document.getElementById("listSort").value;
    
    let passwordList = document.getElementById("passwordList");
    passwordList.innerHTML = "";
    
    for(let password of passwords.sort(
        (a, b) => `${a[sort]}`.localeCompare(`${b[sort]}`)
    )){
        let item = document.createElement("li");
        let icon = document.createElement("img");
        let name = document.createElement("span");
        let label = document.createElement("span");
        
        item.id = `${password.name}PasswordItem`;
        icon.src = `data:image/png;base64,${password.image}`;
        name.innerText = password.name;
        label.innerText = password.label;

        item.onclick = () => {
            document.getElementById("accessScreenManager").checked = true;
            updateAccessPassword(password);
        }

        item.appendChild(icon);
        item.appendChild(name);
        item.appendChild(label);
        passwordList.appendChild(item);
    }
}

function updateAccessPassword(p){
    document.getElementById("accessPasswordName").innerText = p.name;
    document.getElementById("accessPasswordLabel").innerText = p.label;
    document.getElementById("accessPasswordIcon").src = `data:image/png;base64,${p.image}`;
}

function updateEditPassword(){
    document.getElementById("editPasswordName").innerText = document.getElementById("accessPasswordName").innerText;
    document.getElementById("editPasswordLabel").value = document.getElementById("accessPasswordLabel").innerText;
    document.getElementById("editPasswordIcon").src = document.getElementById("accessPasswordIcon").src;
}

function createPassword(){
    let name = document.getElementById("createPasswordName").value.trim();
    let label = document.getElementById("createPasswordLabel").value.trim();
    let icon = document.getElementById("createPasswordIcon");

    if(name === "" || label === ""){
        return;
    }

    for(let password of passwords){
        if(password.name == name){
            alert("password exits");
            return;
        }
    }

    passwords.push({
        name: name,
        label: label,
        image: getBase64Image(icon)
    });

    savePasswords();
    updatePasswordList();

    document.getElementById("listScreenManager").checked = true;
    setTimeout(
        () => document.getElementById(`${name}PasswordItem`).scrollIntoView()
    , 300);
}

function getBase64Image(img) {
    let canvas = document.createElement("canvas");
    canvas.width = ICON_SIZE;
    canvas.height = ICON_SIZE;

    let ctx = canvas.getContext("2d");
    if(img.width < img.height){
        let height = img.height * ICON_SIZE / img.width;
        let y = (height - ICON_SIZE) / 2;
        ctx.drawImage(img, 0, y, ICON_SIZE, height);
    }else{
        let width = img.width * ICON_SIZE / img.height;
        let x = (width - ICON_SIZE) / 2;
        ctx.drawImage(img, x, 0, width, ICON_SIZE);
    }

    let dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function accessPassword(){
    let masterPassword = document.getElementById("masterPassword").value;
    let name = document.getElementById("accessPasswordName").innerText;

    let stringToHash = `${masterPassword}_${name}`;

    crypto.subtle.digest("SHA-384", new TextEncoder().encode(stringToHash)).then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        
        navigator.clipboard.writeText(hashHex);
    });
}
