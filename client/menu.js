const alt = window.alt || {};

window.addEventListener("load", () => {
  const closeButton = document.getElementById("close-button");
  closeButton.addEventListener("click", () => {
    alt.emit("closeMenu");
  });

  alt.on("loadFloors", (floors) => {
    const buttonsContainer = document.getElementById("buttons");
    buttonsContainer.innerHTML = "";

    floors.forEach((floor, index) => {
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "button-container";

      const button = document.createElement("button");
      button.className = "metallic-button";
      button.textContent = floor.etage;
      button.onclick = () => {
        alt.emit("selectFloor", index);
      };

      const floorName = document.createElement("div");
      floorName.className = "floor-name";
      floorName.textContent = floor.desc;

      buttonContainer.appendChild(button);
      buttonContainer.appendChild(floorName);
      buttonsContainer.appendChild(buttonContainer);
    });
  });

  alt.on("updateCurrentFloor", (floor) => {
    const currentFloorElement = document.getElementById("current-floor");
    if (currentFloorElement) {
      currentFloorElement.textContent = `${floor.etage}`;
    }
  });
});
