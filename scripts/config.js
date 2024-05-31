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
      change: [
        {
          time: 5000,
          styles: {
            backgroundColor: "orange",
            border: "5px solid red",
          },
          content: "I am orange",
        },
        {
          time: 10000,
          styles: {
            height: "20vh",
            width: "20vw",
            backgroundColor: "purple",
            borderRadius: "50%",
          },
          content: "I am a circle",
        },
        {
          time: 15000,
          styles: {
            backgroundColor: "green",
            transform: "rotate(45deg)",
          },
          content: "I am rotated",
        },
        {
          time: 20000,
          styles: {
            border: "10px dashed black",
            backgroundColor: "pink",
          },
          content: "I am pink",
        },
        {
          time: 25000,
          styles: {
            borderRadius: "0%",
            backgroundColor: "blue",
            height: "15vh",
            width: "10vw",
          },
          content: "I am a rectangle",
        },
      ],
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
      change: [
        {
          time: 5000,
          styles: {
            backgroundColor: "yellow",
            border: "3px dotted green",
          },
          content: "I am yellow",
        },
        {
          time: 10000,
          styles: {
            height: "15vh",
            width: "15vh",
            backgroundColor: "lightgreen",
          },
          content: "I am bigger",
        },
        {
          time: 15000,
          styles: {
            backgroundColor: "blue",
            border: "5px solid pink",
          },
          content: "I am blue",
        },
        {
          time: 20000,
          styles: {
            borderRadius: "0%",
            height: "20vh",
            width: "10vw",
            backgroundColor: "lightyellow",
          },
          content: "I am a rectangle",
        },
        {
          time: 25000,
          styles: {
            borderRadius: "50%",
            height: "10vh",
            width: "10vh",
            backgroundColor: "lightcoral",
          },
          content: "I am a circle again",
        },
      ],
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
      change: [
        {
          time: 5000,
          styles: {
            borderBottom: "10vh solid red",
            borderLeft: "5vw solid transparent",
            borderRight: "5vw solid transparent",
          },
          content: "I am red",
        },
        {
          time: 10000,
          styles: {
            borderLeft: "10vw solid transparent",
            borderRight: "10vw solid transparent",
            borderBottom: "20vh solid purple",
          },
          content: "I am bigger",
        },
        {
          time: 15000,
          styles: {
            backgroundColor: "transparent",
            borderBottom: "10vh solid blue",
          },
          content: "I am blue",
        },
        {
          time: 20000,
          styles: {
            borderLeft: "10vw solid transparent",
            borderRight: "10vw solid transparent",
            borderBottom: "20vh solid green",
            transform: "rotate(90deg)",
          },
          content: "I am rotated",
        },
        {
          time: 25000,
          styles: {
            borderBottom: "10vh solid lightgreen",
            borderLeft: "5vw solid transparent",
            borderRight: "5vw solid transparent",
          },
          content: "I am a triangle again",
        },
      ],
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
      change: [
        {
          time: 5000,
          styles: {
            backgroundColor: "lightblue",
            border: "2px solid red",
          },
          content: "I am lightblue",
        },
        {
          time: 10000,
          styles: {
            height: "15vh",
            width: "7vw",
            backgroundColor: "orange",
          },
          content: "I am bigger",
        },
        {
          time: 15000,
          styles: {
            backgroundColor: "purple",
            border: "4px dashed green",
          },
          content: "I am purple",
        },
        {
          time: 20000,
          styles: {
            height: "10vh",
            width: "5vw",
            backgroundColor: "brown",
          },
          content: "I am brown",
        },
        {
          time: 25000,
          styles: {
            border: "none",
            backgroundColor: "lightyellow",
          },
          content: "I am a rectangle again",
        },
      ],
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
      change: [
        {
          time: 5000,
          styles: {
            backgroundColor: "yellow",
            border: "2px solid blue",
          },
          content: "I am yellow",
        },
        {
          time: 10000,
          styles: {
            height: "15vh",
            width: "20vw",
            backgroundColor: "green",
          },
          content: "I am bigger",
        },
        {
          time: 15000,
          styles: {
            borderRadius: "0%",
            height: "10vh",
            width: "15vw",
            backgroundColor: "red",
          },
          content: "I am red",
        },
        {
          time: 20000,
          styles: {
            height: "5vh",
            width: "25vw",
            backgroundColor: "blue",
          },
          content: "I am a different shape",
        },
        {
          time: 25000,
          styles: {
            borderRadius: "50%",
            height: "10vh",
            width: "15vw",
            backgroundColor: "lightpink",
          },
          content: "I am an oval again",
        },
      ],
      duration: 30000,
    },
  },
];
