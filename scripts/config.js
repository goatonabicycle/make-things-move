// scripts/config.js
export const elementsConfig = [
  {
    id: "div1",
    content: "I am a square",
    initialState: {
      height: "10vh",
      width: "10vw",
      top: "10vh",
      left: "10vw",
      position: "absolute",
      backgroundColor: "lightblue",
    },
    timeline: {
      rotate: {
        clockwiseDuration: 5000,
        anticlockwiseDuration: 7000,
      },
      duration: 30000,
    },
  },
  {
    id: "div2",
    content: "I am a circle",
    initialState: {
      height: "10vh",
      width: "10vh",
      borderRadius: "50%",
      top: "20vh",
      left: "20vw",
      position: "absolute",
      backgroundColor: "lightcoral",
    },
    timeline: {
      rotate: {
        clockwiseDuration: 4000,
        anticlockwiseDuration: 6000,
      },
      duration: 30000,
    },
  },
  {
    id: "div3",
    content: "I am a triangle",
    initialState: {
      height: "0",
      width: "0",
      borderLeft: "5vw solid transparent",
      borderRight: "5vw solid transparent",
      borderBottom: "10vh solid lightgreen",
      top: "30vh",
      left: "30vw",
      position: "absolute",
    },
    timeline: {
      rotate: {
        clockwiseDuration: 3000,
        anticlockwiseDuration: 5000,
      },
      duration: 30000,
    },
  },
  {
    id: "div4",
    content: "I am a rectangle",
    initialState: {
      height: "10vh",
      width: "5vw",
      top: "40vh",
      left: "40vw",
      position: "absolute",
      backgroundColor: "lightyellow",
    },
    timeline: {
      rotate: {
        clockwiseDuration: 6000,
        anticlockwiseDuration: 8000,
      },
      duration: 30000,
    },
  },
  {
    id: "div5",
    content: "I am an oval",
    initialState: {
      height: "10vh",
      width: "15vw",
      borderRadius: "50%",
      top: "50vh",
      left: "50vw",
      position: "absolute",
      backgroundColor: "lightpink",
    },
    timeline: {
      rotate: {
        clockwiseDuration: 7000,
        anticlockwiseDuration: 9000,
      },
      duration: 30000,
    },
  },
];
