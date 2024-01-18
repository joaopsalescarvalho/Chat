const login = document.querySelector(".login")
const loginForm = login.querySelector(".login-form")
const loginInput = login.querySelector(".login-input")
/*chat elements*/ 
const chat = document.querySelector(".chat")
const chatMessages = document.querySelector(".chat-messages")
const chatForm = document.querySelector(".chat-form")
const chatInput = chat.querySelector(".chat-input")
const chatButton = chat.querySelector(".chat-button")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "gold",
    "hotpink",
    "darkkhaki",
    "corkflowerblue"
]

const user = { id:"", name: "", color:"" }

let websocket; 

const createElementMessageSelf = (content) => {
    const div = document.createElement('div')
    div.classList.add('message-self')
    div.innerHTML = content

    return div
}
const createElementMessageOther = (content,sender,senderColor) => {
    const div = document.createElement('div')
    const span = document.createElement('span')
    div.classList.add('message-another')
    span.classList.add('message-sender')
    div.appendChild(span)
    span.style.color = senderColor
    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () =>{
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
})
}

const processMessage = ({data}) => {
    const { userId,userName,userColor,content } = (JSON.parse(data))

    const message = user.id == userId 
    ? createElementMessageSelf(content) 
    : createElementMessageOther(content,userName,userColor)

    chatMessages.appendChild(message)
    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()
    user.name= loginInput.value;
    user.id=crypto.randomUUID()
    user.color = getRandomColor()
    login.style.display = "none";
    chat.style.display = "flex";
    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content:chatInput.value
    }

    websocket.send(JSON.stringify(message))
    chatInput.value= "";
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)