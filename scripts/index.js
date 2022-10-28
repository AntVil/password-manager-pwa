let passwords;

window.onload = function(){
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
    let passwordList = document.getElementById("passwordList");
    passwordList.innerHTML = "";
    for(let password of passwords){
        let item = document.createElement("li");
        let icon = document.createElement("img");
        let name = document.createElement("span");
        let label = document.createElement("span");
        
        icon.src = "password.png";
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
    console.log("access password");
}

function createPassword(){
    let name = document.getElementById("passwordName").value.trim();
    let label = document.getElementById("passwordLabel").value.trim();

    if(name === "" || label === ""){
        return;
    }

    passwords.push({
        name: name,
        label: label
    });

    savePasswords();
    updatePasswordList();
}
