function jsonPost(url, data) {
  return new Promise((resolve, reject) => {
    var x = new XMLHttpRequest();
    x.onerror = () => reject(new Error("jsonPost failed"));
    //x.setRequestHeader('Content-Type', 'application/json');
    x.open("POST", url, true);
    x.send(JSON.stringify(data));

    x.onreadystatechange = () => {
      if (x.readyState == XMLHttpRequest.DONE) {
        if (x.status == 200) {
          resolve(JSON.parse(x.responseText));
        } else {
          reject(new Error("status is not 200"));
        }
      }
    };
  });
}

const sendBtn = document.getElementById("btnSend");
const input = document.getElementById("message");

input.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    listener();
  }
});

sendBtn.addEventListener("click", () => {
  listener();
});

function listener() {
  if (input.value.length !== 0) {
    jsonPost("http://students.a-level.com.ua:10012", {
      func: "addMessage",
      nick: "Anna",
      message: input.value,
    })
      .then(() => {
        input.value = "";
        getMessage();
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  } else {
    alert("Message must not be empty");
  }
}

let messageContainer = document.getElementById("messages");

async function getMessage() {
  try {
    let response = await jsonPost("http://students.a-level.com.ua:10012", {
      func: "getMessages",
      messageId: 0,
    });

    messageContainer.innerHTML = "";

    let lastMessages = response.data.slice(-15);
    lastMessages.forEach((message) => {
      const date = new Date(message.timestamp);
      const formattedDate = date.toLocaleString();
      const messageHTML = `
          <div class="message">
            <span class="nick">${message.nick}</span>: ${message.message}<br>
            <span class="timestamp">${formattedDate}</span>
          </div>
        `;
      messageContainer.innerHTML += messageHTML;
    });

    messageContainer.scrollTop = messageContainer.scrollHeight;
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
}

getMessage();
