const socket = io('https://securechattingapp.onrender.com')

const pwdInput = document.querySelector('#pwd')
const msgInput = document.querySelector('#message')
const nameInput = document.querySelector('#name')
const chatRoom = document.querySelector('#room')
const activity = document.querySelector('.activity')
const usersList = document.querySelector('.user-list')
const roomList = document.querySelector('.room-list')
const chatDisplay = document.querySelector('.chat-display')
const allRooms = new String

const { subtle } = globalThis.crypto;

generateKey()

async function generateKey() 
{
  const key = await subtle.generateKey(
    {
    name: "RSA-OAEP",
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: { name: "SHA-256" },
  }, true, ['encrypt', 'decrypt']);

  console.log(key)

  const publicKey = await window.crypto.subtle.exportKey('jwk', key.publicKey)
  const privateKey = await window.crypto.subtle.exportKey('jwk', key.privateKey)

  console.log(publicKey)
  console.log(privateKey)
  
  console.log("The value of the public key is:\n", publicKey.n)
  console.log("The value of the private key is:\n", privateKey.n)

  publicKey.key_ops = ['encrypt'];
  privateKey.key_ops = ['decrypt'];
  publicKey.alg = 'RSA-OAEP-256';
  privateKey.alg = 'RSA-OAEP-256';

  publicKeyReloaded = await window.crypto.subtle.importKey("jwk", publicKey, {name: "RSA-OAEP", hash: {name: "SHA-256"}}, true, ["encrypt"]);    
  privateKeyReloaded = await window.crypto.subtle.importKey("jwk", privateKey,{name: "RSA-OAEP", hash: {name: "SHA-256"}}, true, ["decrypt"]);    
  
  console.log(publicKeyReloaded)
  console.log(privateKeyReloaded)

} 

function reloadMessage(arrayBuffer) {
    return window.btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
}

async function Encrypt(message) 
{
    const ec = new TextEncoder()
    const encodedText = ec.encode(message)
    const encryptedText = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, publicKeyReloaded, encodedText)

    console.log(reloadMessage(encryptedText));

    return encryptedText
  }
  
async function Decrypt(encryptedText)
{
    const dec = new TextDecoder();
    const decryptedText = await window.crypto.subtle.decrypt({name: "RSA-OAEP"}, privateKeyReloaded, encryptedText)

    const original = dec.decode(decryptedText)
    console.log(original);

    return original
  } 

function sendMessage(e) 
{
    e.preventDefault()
    if (nameInput.value && msgInput.value && chatRoom.value) 
    {
        const encMsg = Encrypt(msgInput.value)
        const decMsg = encMsg.then((result) => {Decrypt(result)})

        socket.emit('message', {
            name: nameInput.value,
            text: msgInput.value
        })
        msgInput.value = ""
    }
    msgInput.focus()
}

function enterRoom(e) {
    e.preventDefault()
    const roomDoesNotExist = 1
    if (nameInput.value && 
        chatRoom.value && 
        pwdInput.value) {
        socket.emit('enterRoom', {
            name: nameInput.value,
            room: chatRoom.value
        })
    }   
}

document.querySelector('.form-msg')
    .addEventListener('submit', sendMessage)

document.querySelector('.form-join')
    .addEventListener('submit', enterRoom)

msgInput.addEventListener('keypress', () => {
    socket.emit('activity', nameInput.value)
})

// Listen for messages 
socket.on("message", (data) => {
    activity.textContent = ""
    const { name, text, time } = data
    const li = document.createElement('li')
    li.className = 'post'
    if (name === nameInput.value) li.className = 'post post--left'
    if (name !== nameInput.value && name !== 'Admin') li.className = 'post post--right'
    if (name !== 'Admin') {
        li.innerHTML = `<div class="post__header ${name === nameInput.value
            ? 'post__header--user'
            : 'post__header--reply'
            }">
        <span class="post__header--name">${name}</span> 
        <span class="post__header--time">${time}</span> 
        </div>
        <div class="post__text">${text}</div>`
    } else {
        li.innerHTML = `<div class="post__text">${text}</div>`
    }
    document.querySelector('.chat-display').appendChild(li)

    chatDisplay.scrollTop = chatDisplay.scrollHeight
})

let activityTimer
socket.on("activity", (name) => {
    activity.textContent = `${name} is typing...`

    // Clear after 3 seconds 
    clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 3000)
})

socket.on('userList', ({ users }) => {
    showUsers(users)
})

socket.on('roomList', ({ rooms }) => {
    showRooms(rooms)
})

function showUsers(users) {
    usersList.textContent = ''
    if (users) {
        usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`
        users.forEach((user, i) => {
            usersList.textContent += ` ${user.name}`
            if (users.length > 1 && i !== users.length - 1) {
                usersList.textContent += ","
            }
        })
    }
}

function showRooms(rooms) {
    roomList.textContent = ''
    allRooms.textContent = ''
    if (rooms) {
        roomList.innerHTML = '<em>Active Rooms:</em>'
        rooms.forEach((room, i) => {
            roomList.textContent += ` ${room}`
            allRooms.textContent += room
            if (rooms.length > 1 && i !== rooms.length - 1) 
                {
                roomList.textContent += ","
                allRooms.textContent += ","
            }
        })
    }
}