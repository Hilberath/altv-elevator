import alt from "alt-server";

const elevators = [
  {
    id: 1,
    floors: [
      { etage: "3", desc: "Helipad", position: { x: 467.63, y: -975.71, z: 43.7 }, heading: 3.07 },
      { etage: "2", desc: "Teambereich", position: { x: 465.63, y: -976.07, z: 39.41 }, heading: 1.58 },
      { etage: "1", desc: "Büros", position: { x: 465.63, y: -976.07, z: 35.06 }, heading: 1.58 },
      { etage: "0", desc: "Eingang", position: { x: 465.63, y: -976.07, z: 30.71 }, heading: 1.58 },
      { etage: "-1", desc: "Garage, Zellen", position: { x: 467.63, y: -975.71, z: 25.45 }, heading: 3.07 },
    ],
  },
  // Weitere Fahrstühle können hier hinzugefügt werden
];

alt.onClient("requestElevator", (player, elevatorId, floorIndex) => {
  const elevator = elevators.find((e) => e.id === elevatorId);
  if (elevator) {
    const floor = elevator.floors[floorIndex];
    if (floor) {
      alt.emitClient(player, "teleportToFloor", floor.position);
    }
  }
});
