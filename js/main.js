let api_url = "";
let matchmaking_socket = new ReconnectingWebSocket(api_url + "/ws/matchmaking/");
let debug_screen = document.getElementById("debug-screen");

let game_tag = document.getElementById("personal-id");
let gamer_id = generateName();
game_tag.value = gamer_id;

let room_code;

matchmaking_socket.onopen = function (event) {
  add_debug_message(gamer_id + " joins matchmaking service!")
  matchmaking_socket.send(JSON.stringify({
    "message": gamer_id
  }))
}

matchmaking_socket.onmessage = function (event) {
  let data = JSON.parse(event.data);
  let message = data["message"];
  add_debug_message(message);
  let verify_status = data["status"];
  if (verify_status){
    room_code = data["room"];
    connect(room_code);
  }else {
    add_debug_message("Failed to verify!");
  }
}

// Add Debug Message
function add_debug_message(text_message){
  let tag = document.createElement("p");
  let text = document.createTextNode(text_message);
  tag.append(text);
  debug_screen.appendChild(tag);
  debug_screen.scrollTop = debug_screen.scrollHeight;
}

function connect(room){
  let game_socket = new ReconnectingWebSocket(api_url + "/ws/game/" + room + "/");
  game_socket.onopen = function (event) {
    game_socket.send(JSON.stringify({
      "message": "ALL HAIL HYDRA",
      "player": gamer_id
    }))
  }

  game_socket.onmessage = function (event) {
    let data = JSON.parse(event.data);
    add_debug_message(data["message"]);
  }
  game_socket.onerror = function (e) {
    add_debug_message("Error in game socket");
    console.log("Unexpected error has occurred");
    console.log(e);
  }
  game_socket.onclose = function (e) {
    add_debug_message("Game socket sudden close");
    console.log(e);
    console.log("Websocket unexpectedly closed");
  }
}
