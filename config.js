export const elementsConfig = [
  {
    id: "div1",
    content: "I am a triangle",
    initialState: {
      height: "0",
      width: "0",
      borderLeft: "10vw solid transparent",
      borderRight: "10vw solid transparent",
      borderBottom: "20vh solid lightblue",
      top: "10vh",
      left: "10vw",
      position: "absolute",
    },
    timeline: {
      rotate: {
        clockwiseDuration: 5 * 1000, // 5 seconds
        anticlockwiseDuration: 5 * 1000, // 5 seconds
      },
      change: [
        {
          time: 10 * 1000, // 10 seconds
          styles: {
            height: "20vh",
            width: "20vh",
            border: "none",
            borderRadius: "50%",
            backgroundColor: "lightblue",
          },
          content: "I am a circle",
        },
        {
          time: 20 * 1000, // 20 seconds
          styles: {
            height: "0",
            width: "0",
            borderLeft: "10vw solid transparent",
            borderRight: "10vw solid transparent",
            borderBottom: "20vh solid lightblue",
            borderRadius: "0%",
            backgroundColor: "lightblue",
          },
          content: "I am a triangle",
        },
      ],
      duration: 30 * 1000, // 30 seconds total
    },
  },
  {
    id: "div2",
    content: "I am a square",
    initialState: {
      height: "60vh",
      width: "30vw",
      top: "15vh",
      left: "15vw",
      position: "absolute",
      backgroundColor: "lightcoral",
    },
    timeline: {
      circle: true,
      change: [
        {
          time: 10 * 1000, // 10 seconds
          styles: {
            height: "60vh",
            width: "60vh",
            borderRadius: "50%",
          },
          content: "I am a circle",
        },
        {
          time: 15 * 1000, // 15 seconds
          styles: {
            backgroundColor: "pink",
          },
          content: "I am pink",
        },
        {
          time: 20 * 1000, // 20 seconds
          styles: {
            backgroundColor: "darkblue",
          },
          content: "I am dark blue",
        },
      ],
      duration: 30 * 1000, // 30 seconds total
    },
  },
  {
    id: "div3",
    content: "I follow the square",
    initialState: {
      height: "10vh",
      width: "10vw",
      top: "15vh",
      left: "15vw",
      position: "absolute",
      backgroundColor: "lightgreen",
    },
    timeline: {
      follow: "div2",
      rotate: {
        clockwiseDuration: 10 * 1000, // 10 seconds
        anticlockwiseDuration: 3 * 1000, // 3 seconds
      },
      duration: 30 * 1000, // 30 seconds total
    },
  },
];
