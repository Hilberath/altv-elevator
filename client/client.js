import * as alt from "alt-client";

let webView = null;
let currentFloor = null; // Variable für die aktuelle Etage

const elevators = [
  {
    id: 1,
    position: { x: 465.63, y: -976.07, z: 30.71 },
    floors: [
      { etage: "3", desc: "Helipad", position: { x: 467.63, y: -975.71, z: 43.7 }, heading: 3.07 },
      { etage: "2", desc: "Teambereich", position: { x: 465.63, y: -976.07, z: 39.41 }, heading: 1.58 },
      { etage: "1", desc: "Büros", position: { x: 465.63, y: -976.07, z: 35.06 }, heading: 1.58 },
      { etage: "EG", desc: "Eingang", position: { x: 465.63, y: -976.07, z: 30.71 }, heading: 1.58 },
      { etage: "-1", desc: "Garage, Zellen", position: { x: 467.63, y: -975.71, z: 25.45 }, heading: 3.07 },
    ],
  },
];

function showElevatorMenu(elevatorId, floors) {
  if (webView !== null) {
    webView.destroy();
  }

  webView = new alt.WebView("http://resource/client/menu.html");
  webView.focus();
  alt.showCursor(true);
  alt.toggleGameControls(false);

  webView.on("selectFloor", (floorIndex) => {
    alt.emitServer("requestElevator", elevatorId, floorIndex);
    closeMenu();
  });

  webView.on("closeMenu", () => {
    closeMenu();
  });

  // Ermitteln der aktuellen Etage
  const playerPos = alt.Player.local.pos;
  const elevator = elevators.find((e) => e.id === elevatorId);
  if (elevator) {
    const currentFloor = elevator.floors.find((floor) => isPlayerNearElevator(playerPos, floor.position));
    if (currentFloor) {
      webView.emit("updateCurrentFloor", currentFloor);
    }
  }

  webView.emit("loadFloors", floors);
}

function closeMenu() {
  if (webView !== null) {
    webView.destroy();
    webView = null;
  }
  alt.showCursor(false);
  alt.toggleGameControls(true);
}

alt.onServer("teleportToFloor", (position) => {
  if (position && position.x !== undefined && position.y !== undefined && position.z !== undefined) {
    alt.log(`Teleporting to: ${JSON.stringify(position)}`);
    alt.Player.local.pos = new alt.Vector3(position.x, position.y, position.z);
  } else {
    alt.log("Invalid position data received.");
  }
});

alt.on("keydown", (key) => {
  if (key === "E".charCodeAt(0)) {
    const playerPos = alt.Player.local.pos;
    const nearbyElevator = elevators.find((elevator) => elevator.floors.some((floor) => isPlayerNearElevator(playerPos, floor.position)));

    if (nearbyElevator) {
      showElevatorMenu(nearbyElevator.id, nearbyElevator.floors);
    } else {
      alt.log("You are not near any elevator.");
    }
  }
});

function isPlayerNearElevator(playerPos, elevatorPos, range = 2.0) {
  const dist = Math.sqrt(Math.pow(playerPos.x - elevatorPos.x, 2) + Math.pow(playerPos.y - elevatorPos.y, 2) + Math.pow(playerPos.z - elevatorPos.z, 2));
  return dist <= range;
}
