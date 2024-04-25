let conversation_history = []

async function sendMessage(message, conversationHistory)
{
    const endpoint = 'https://i43ejyk2csrbfjsgshaoe7j2qq0voeep.lambda-url.us-west-1.on.aws';
    const queryParams = `?q=${encodeURIComponent(message)}&conversation_history=${encodeURIComponent(JSON.stringify(conversationHistory))}`;

    let response = await fetch(endpoint + queryParams);
    return response
}

function startLoad()
{
    let scrollbar = document.getElementById('vedusgpt-chat-scrollbar')
    let loadContent = '<img class="vedusgpt-loading-img" src="./images/loading.gif">'
    let loadMessageData =
    {
        "content": loadContent,
        "src": "./images/gpt.png",
        "isUser": false
    }
    let loadMessage = generateMessage(loadMessageData)
    scrollbar.appendChild(loadMessage)

    return loadMessage
}

function endLoad(loadMessage)
{
    let scrollbar = document.getElementById('vedusgpt-chat-scrollbar')
    loadMessage.remove()
}

function generateMessage(messageData)
{
    let message = messageData.content
    let src = messageData.src
    let isUser = messageData.isUser

    let messageContainer = document.createElement('div')
    messageContainer.classList = isUser ? "vedusgpt-message vedusgpt-user" : "vedusgpt-message"

    let imageContainer = document.createElement('div')
    imageContainer.className = "vedusgpt-message-user-image"

    let image = document.createElement('img')
    image.className = "vedusgpt-user-image"
    image.src = src

    let messageContent = document.createElement('div')
    messageContent.className = "vedusgpt-message-content"
    messageContent.innerHTML = message

    messageContainer.appendChild(imageContainer)
    messageContainer.appendChild(messageContent)

    imageContainer.appendChild(image)

    return messageContainer
}

async function submitMessage()
{
    let input = document.getElementById('vedusgpt-chat-input')
    let scrollbar = document.getElementById('vedusgpt-chat-scrollbar')
    let message = input.value
    input.value = ""

    let messageData = {
        "content": message,
        "src": "./images/user.png",
        "isUser": true
    }
    let userMessage = generateMessage(messageData)
    scrollbar.append(userMessage)
    scrollbar.scrollTop = scrollbar.scrollHeight;


    let placeholder = startLoad()
    let gptResponse = await sendMessage(message, conversation_history)
    let gptResult = await gptResponse.json()
    endLoad(placeholder)
    let gptMessageData =
    {
        "content": gptResult.result["choices"][0]["message"]["content"],
        "src": "./images/gpt.png",
        "isUser": false
    }
    let gptMessage = generateMessage(gptMessageData)
    scrollbar.append(gptMessage)
    scrollbar.scrollTop = scrollbar.scrollHeight;
    conversation_history = gptResult.conversation_history
}


let submit = document.getElementById('vedusgpt-submit-button')
submit.addEventListener('click', submitMessage)

let chatInput = document.getElementById('vedusgpt-chat-input');

chatInput.addEventListener("keydown", function (event)
{
    if (event.key === "Enter")
    {
        event.preventDefault();
        submitMessage()
    }
});

document.addEventListener("DOMContentLoaded", function ()
{

    let hash = window.location.hash;
    if (hash)
    {
        hash = hash.substr(1)
    }


    var contextMessage = `You are now a ${hash}. you will give detailed but consise ${hash} advice to me. Be formal yet not too difficult to understand and answer their questions to the best of your abilities.`
    conversation_history.push({ 'role': 'user', 'content': contextMessage })
    sendMessage(contextMessage, [])

    let scrollbar = document.getElementById('vedusgpt-chat-scrollbar')
    let initMessage = "Hello! I'm here to help you with treatment. Ask me any questions you have!"
    let initMessageData =
    {
        "content": initMessage,
        "src": "./images/gpt.png",
        "isUser": false
    }
    let message = generateMessage(initMessageData)
    scrollbar.append(message)
    conversation_history.push({ 'role': 'assistant', 'content': initMessage })
})

// add textlike border to convo