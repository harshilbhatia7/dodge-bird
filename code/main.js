import kaboom from "kaboom"

document.title = "Dodge Bird"

kaboom({
  canvas: document.getElementById("game"),
  fullscreen: true,
  mobile: true,
})

loadSprite("background", "sprites/background.jpg");
loadSprite("bird", "sprites/dodgebird.png");
loadSprite("pipe", "sprites/pipe.png");
loadSound("OtherworldlyFoe", "sounds/OtherworldlyFoe.mp3");
loadSound("wooosh", "sounds/wooosh.mp3");
loadSound("bug", "sounds/bug.mp3");
loadSound("danger", "sounds/danger.mp3");

const playMusic = play("OtherworldlyFoe", {loop: true, volume:0.5 });
let highScoreEasy = localStorage.getItem('highScoreEasy') || 0;
let highScoreMedium = localStorage.getItem('highScoreMedium') || 0;
let highScoreHard = localStorage.getItem('highScoreHard') || 0;

scene("welcome", () => {
  add([
    sprite("background", {width: width(), height: height()})
  ]);
  add([
    pos(width() * 0.05, height() * 0.1),
    text("Please play the game in full screen for better experience.\n\nTo read instructions to play the game press enter or swipe vertically up.\n\nFor Easy level, press j or space for non-touch devices, or swipe horizontally right for touch devices.\n\nFor Medium level, press k for non-touch devices, or swipe horizontally left for touch devices.\n\nFor Hard level, press l for non-touch devices, or swipe vertically down for touch devices.\n\nBy default, pressing space will start the game in Easy mode\n\n\n\nThis game was made using Kaboom.js\n\nMade by Harshil Bhatia (www.harshilbhatia.com)", {
      size: Math.min(width() * 0.03, height() * 0.03),
      width: width() * 0.9,
      height: height() * 0.8,
      wrap: true,
      align: "left",
    })
  ]);

  const MIN_SWIPE_DISTANCE = 100;
  let touchStartX;
  let touchStartY;

  function touchStartListener(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function touchEndListener(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > MIN_SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
      document.removeEventListener("touchstart", touchStartListener);
      document.removeEventListener("touchend", touchEndListener);
      if (dx > 0) {
        go("easy");
      } else {
        go("medium");
      }
    } else if (Math.abs(dy) > MIN_SWIPE_DISTANCE && Math.abs(dy) > Math.abs(dx)) {
      document.removeEventListener("touchstart", touchStartListener);
      document.removeEventListener("touchend", touchEndListener);
      if (dy > 0) {
        go("hard");
      } else {
        go("instructions");
      }
    }
  }

  document.addEventListener("touchstart", touchStartListener);
  document.addEventListener("touchend", touchEndListener);

  onKeyDown("j", () => {
    go("easy");
  })
  onKeyDown("k", () => {
    go("medium");
  })
  onKeyDown("l", () => {
    go("hard");
  })
  keyPress("space", () => {
    go("easy");
  });
  keyPress("enter", () => {
    go("instructions");
  });
})

scene("instructions", () => {
  add([
  	  sprite("background", {width: width(), height: height()})
  ])
  add([
  pos(width() * 0.05, height() * 0.05),
  text("Dodge Bird is inspired from Flappy Bird\n\nThere are 3 levels in the game:- East, Medium and Hard\n\nThe difficulty and speed vary according to the level chosen\n\nThe gap between the pipes, the speed with which ojects move\nall change with levels\n\nIn the game, press space to make the bird jump\n\nYou have to make the bird pass between the pipes\n\n\n\To go back to the welcome screen, press enter", {
      size: Math.min(width() * 0.04, height() * 0.04),
      width: width() * 0.9,
      height: height() * 0.8,
      wrap: true,
      align: "left",
  })
])

  const MIN_SWIPE_DISTANCE = 100;
  let touchStartX;
  let touchStartY;

  function touchStartListener(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function touchEndListener(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > MIN_SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
      document.removeEventListener("touchstart", touchStartListener);
      document.removeEventListener("touchend", touchEndListener);
      if (dx > 0) {
        go("easy");
      } else {
        go("medium");
      }
    } else if (Math.abs(dy) > MIN_SWIPE_DISTANCE && Math.abs(dy) > Math.abs(dx)) {
      document.removeEventListener("touchstart", touchStartListener);
      document.removeEventListener("touchend", touchEndListener);
      if (dy > 0) {
        go("hard");
      } else {
        go("welcome");
      }
    }
  }

  document.addEventListener("touchstart", touchStartListener);
  document.addEventListener("touchend", touchEndListener);
  
  keyPress("enter", () => {
    go("welcome");
  });
})

scene("easy", () => {
  let gameScore = 0;
  const pipeGap = 200;

  add([
  	sprite("background", {width: width(), height: height()}),
  ])

  const showScore = add([
    pos(0.02 * width(), 0.02 * height()),
    text(gameScore, {size: 0.05 * Math.min(width(), height())})
  ])

  add([
    pos(0.02 * width(), 0.07 * height()),
    text("Game Level: Easy\n", {size: 0.05 * Math.min(width(), height())})
  ])

  const player = add([
    sprite("bird"),
    scale(0.35),
    pos(80, 40),
    area({ width: 30, height: 20 }),
    body(),
  ]);
  
  function producePipes() {
    let offset = rand(-200, 30);
    
    add([
    	sprite("pipe"),
      scale(9),
    	pos(width(), height() / 2 + offset + pipeGap / 2),
      "pipe",
      area(),
      {passed: false}
    ]);
    
    add([
    	sprite("pipe", {flipY: true}),
      scale(9),
    	pos(width(), height() / 2 + offset - pipeGap / 2),
      origin("botleft"),
      "pipe",
      area(),
    ]);
  }

  loop(2.0, () => {
    producePipes();
  });
  
  action("pipe", (pipe) => { 
    pipe.move(-540, 0);
    if(pipe.passed === false && pipe.pos.x < player.pos.x) {
      pipe.passed = true;
      gameScore++;
      showScore.text = "Score: " + gameScore;
    }
  });
  
  player.collides("pipe", () => {
    play("danger");
    go("gameover-easy", gameScore);
  });

  player.action(() => {
    if(player.pos.y > height() + 30 || player.pos.y < -30) {
      play("bug");
      go("gameover-easy", gameScore);
    }
  })

  touchStart(() => {
    play("wooosh");
    player.jump(400);
  });

  mouseClick(() => {
    play("wooosh");
    player.jump(400);
  });
  
  keyPress("space", () => {
    play("wooosh");
    player.jump(400);
  });
});

scene("medium", () => {
  let gameScore = 0;
  const pipeGap = 200;

  add([
  	sprite("background", {width: width(), height: height()}),
  ])

  const showScore = add([
    pos(0.02 * width(), 0.02 * height()),
    text(gameScore, {size: 0.05 * Math.min(width(), height())})
  ])

  add([
    pos(0.02 * width(), 0.07 * height()),
    text("Game Level: Medium\n", {size: 0.05 * Math.min(width(), height())})
  ])
  
  const player = add([
  	sprite("bird"),
    scale(0.35),
  	pos(80, 40),
  	area(),
    body(),
  ]);

  function producePipes() {
    let offset = rand(-200, 30);
    
    add([
    	sprite("pipe"),
      scale(9),
    	pos(width(), height() / 2 + offset + pipeGap / 2),
      "pipe",
      area(),
      {passed: false}
    ]);
    
    add([
    	sprite("pipe", {flipY: true}),
      scale(9),
    	pos(width(), height() / 2 + offset - pipeGap / 2),
      origin("botleft"),
      "pipe",
      area(),
    ]);
  }

  loop(1.8, () => {
    producePipes();
  });
  
  action("pipe", (pipe) => { 
    pipe.move(-600, 0);
    if(pipe.passed === false && pipe.pos.x < player.pos.x) {
      pipe.passed = true;
      gameScore++;
      showScore.text = "Score: " + gameScore;
    }
  });
  
  player.collides("pipe", () => {
    play("danger");
    go("gameover-medium", gameScore);
  });

  player.action(() => {
    if(player.pos.y > height() + 30 || player.pos.y < -30) {
      play("bug");
      go("gameover-medium", gameScore);
    }
  })

  touchStart(() => {
    play("wooosh");
    player.jump(400);
  });

  mouseClick(() => {
    play("wooosh");
    player.jump(400);
  });
  
  keyPress("space", () => {
    play("wooosh");
    player.jump(400);
  });
});

scene("hard", () => {
  let gameScore = 0;
  const pipeGap = 200;

  add([
  	sprite("background", {width: width(), height: height()}),
  ])

  const showScore = add([
    pos(0.02 * width(), 0.02 * height()),
    text(gameScore, {size: 0.05 * Math.min(width(), height())})
  ])

  add([
    pos(0.02 * width(), 0.07 * height()),
    text("Game Level: Hard\n", {size: 0.05 * Math.min(width(), height())})
  ])
  
  const player = add([
  	sprite("bird"),
    scale(0.35),
  	pos(80, 40),
  	area(),
    body(),
  ]);

  function producePipes() {
    let offset = rand(-200, 30);
    
    add([
    	sprite("pipe"),
      scale(9),
    	pos(width(), height() / 2 + offset + pipeGap / 2),
      "pipe",
      area(),
      {passed: false}
    ]);
    
    add([
    	sprite("pipe", {flipY: true}),
      scale(9),
    	pos(width(), height() / 2 + offset - pipeGap / 2),
      origin("botleft"),
      "pipe",
      area(),
    ]);
  }

  loop(1.2, () => {
    producePipes();
  });
  
  action("pipe", (pipe) => { 
    pipe.move(-720, 0);
    if(pipe.passed === false && pipe.pos.x < player.pos.x) {
      pipe.passed = true;
      gameScore++;
      showScore.text = "Score: " + gameScore;
    }
  });
  
  player.collides("pipe", () => {
    play("danger");
    wait(2, () => {
      playMusic.volume(1)
    })
    go("gameover-hard", gameScore);
  });

  player.action(() => {
    if(player.pos.y > height() + 30 || player.pos.y < -30) {
      play("bug");
      go("gameover-hard", gameScore);
    }
  })

  touchStart(() => {
    play("wooosh");
    player.jump(400);
  });

  mouseClick(() => {
    play("wooosh");
    player.jump(400);
  });
  
  keyPress("space", () => {
    play("wooosh");
    player.jump(400);
  });
});

scene("gameover-easy", (gameScore) => {
  add([
  	  sprite("background", {width: width(), height: height()})
  ])
  
  if (gameScore > highScoreEasy) {
    highScoreEasy = gameScore;
    localStorage.setItem('highScoreEasy', highScoreEasy);
  }
  
  add([
  pos(width() * 0.1, height() * 0.1),
  text("Game Over!\n\nYour score is: " + gameScore + "\nHigh score in Easy Level: " + highScoreEasy + "\n\nPress space or j or swipe right to start the easy level again\n\nPress enter or swipe up to return to welcome screen\n\nPress k or swipe left to start medium level\n\nPress l or swipe down to start hard level", {
    size: Math.min(width(), height()) * 0.05,
    width: width() * 0.8,
    align: 'center',
  })
]);

  const MIN_SWIPE_DISTANCE = 100;
  let touchStartX;
  let touchStartY;

  function touchStartListener(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function touchEndListener(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > MIN_SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
      document.removeEventListener("touchstart", touchStartListener);
      document.removeEventListener("touchend", touchEndListener);
      if (dx > 0) {
        go("easy");
      } else {
        go("medium");
      }
    } else if (Math.abs(dy) > MIN_SWIPE_DISTANCE && Math.abs(dy) > Math.abs(dx)) {
      document.removeEventListener("touchstart", touchStartListener);
      document.removeEventListener("touchend", touchEndListener);
      if (dy > 0) {
        go("hard");
      } else {
        go("welcome");
      }
    }
  }

  document.addEventListener("touchstart", touchStartListener);
  document.addEventListener("touchend", touchEndListener);
  
  onKeyDown("j", () => {
    go("easy");
  })
  onKeyDown("k", () => {
    go("medium");
  })
  onKeyDown("l", () => {
    go("hard");
  })
  keyPress("space", () => {
    go("easy");
  });
  keyPress("enter", () => {
    go("welcome");
  });
})

scene("gameover-medium", (gameScore) => {
  add([
  	  sprite("background", {width: width(), height: height()})
  ])

  if (gameScore > highScoreMedium) {
    highScoreMedium = gameScore;
    localStorage.setItem('highScoreMedium', highScoreMedium);
  }
  
  add([
  pos(width() * 0.1, height() * 0.1),
  text("Game Over!\n\nYour score is: " + gameScore + "\nHigh score in Medium Level: " + highScoreMedium + "\n\nPress space or k or swipe left to start the medium level again\n\nPress enter or swipe up to return to welcome screen\n\nPress j or swipe right to start easy level\n\nPress l or swipe down to start hard level", {
    size: Math.min(width(), height()) * 0.05,
    width: width() * 0.8,
    align: 'center',
  })
]);

  const MIN_SWIPE_DISTANCE = 100;
  let touchStartX;
  let touchStartY;

  function touchStartListener(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function touchEndListener(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > MIN_SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
      document.removeEventListener("touchstart", touchStartListener);
      document.removeEventListener("touchend", touchEndListener);
      if (dx > 0) {
        go("easy");
      } else {
        go("medium");
      }
    } else if (Math.abs(dy) > MIN_SWIPE_DISTANCE && Math.abs(dy) > Math.abs(dx)) {
      document.removeEventListener("touchstart", touchStartListener);
      document.removeEventListener("touchend", touchEndListener);
      if (dy > 0) {
        go("hard");
      } else {
        go("welcome");
      }
    }
  }

  document.addEventListener("touchstart", touchStartListener);
  document.addEventListener("touchend", touchEndListener);
  
  onKeyDown("j", () => {
    go("easy");
  })
  onKeyDown("k", () => {
    go("medium");
  })
  onKeyDown("l", () => {
    go("hard");
  })
  keyPress("space", () => {
    go("medium");
  });
  keyPress("enter", () => {
    go("welcome");
  });
})

scene("gameover-hard", (gameScore) => {
  add([
  	  sprite("background", {width: width(), height: height()})
  ])

  if (gameScore > highScoreHard) {
    highScoreHard = gameScore;
    localStorage.setItem('highScoreHard', highScoreHard);
  }
  
  add([
  pos(width() * 0.1, height() * 0.1),
  text("Game Over!\n\nYour score is: " + gameScore + "\nHigh score in Hard Level: " + highScoreHard + "\n\nPress space or l or swipe down to start the hard level again\n\nPress enter or swipe up to return to welcome screen\n\nPress j or swipe right to start easy level\n\nPress k or swipe left to start medium level", {
    size: Math.min(width(), height()) * 0.05,
    width: width() * 0.8,
    align: 'center',
  })
]);

  const MIN_SWIPE_DISTANCE = 100;
  let touchStartX;
  let touchStartY;

  function touchStartListener(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function touchEndListener(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > MIN_SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
      document.removeEventListener("touchstart", touchStartListener);
      document.removeEventListener("touchend", touchEndListener);
      if (dx > 0) {
        go("easy");
      } else {
        go("medium");
      }
    } else if (Math.abs(dy) > MIN_SWIPE_DISTANCE && Math.abs(dy) > Math.abs(dx)) {
      document.removeEventListener("touchstart", touchStartListener);
      document.removeEventListener("touchend", touchEndListener);
      if (dy > 0) {
        go("hard");
      } else {
        go("welcome");
      }
    }
  }

  document.addEventListener("touchstart", touchStartListener);
  document.addEventListener("touchend", touchEndListener);
  
  onKeyDown("j", () => {
    go("easy");
  })
  onKeyDown("k", () => {
    go("medium");
  })
  onKeyDown("l", () => {
    go("hard");
  })
  keyPress("space", () => {
    go("hard");
  });
  keyPress("enter", () => {
    go("welcome");
  });
})

go("welcome");