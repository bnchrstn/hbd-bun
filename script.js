document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  const box = document.querySelector(".box");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let audio = new Audio('hbd.mp3');

  // imgage elements for display
  const image4u = createImage('4u.png', 'image4u', 'left: 300px; top: 54%; width: 180px; height: auto; transform: translateY(-50%);');
  const imageBday = createImage('bday.png', 'imageBday', 'right: 200px; top: 54%; width: 320px; height: auto; transform: translateY(-50%);');

  function createImage(src, id, style) {
      const img = document.createElement('img');
      img.src = src;
      img.id = id;
      img.style.cssText = `position: absolute; ${style} opacity: 0; transition: opacity 1s ease-in-out;`;
      document.body.appendChild(img);
      return img;
  }

  function updateCandleCount() {
      const activeCandles = candles.filter(
          (candle) => !candle.classList.contains("out")
      ).length;
      candleCountDisplay.textContent = activeCandles;
  }

  function addCandle(left, top) {
      const candle = document.createElement("div");
      candle.className = "candle";
      candle.style.left = left + "px";
      candle.style.top = top + "px";

      const flame = document.createElement("div");
      flame.className = "flame";
      candle.appendChild(flame);

      cake.appendChild(candle);
      candles.push(candle);
      updateCandleCount();
  }

  function showGiftBox() {
    setTimeout(() => {
        document.querySelector(".box").style.display = "block";
        document.getElementById("image4u").style.opacity = "1";
        document.getElementById("imageBday").style.opacity = "1";
    }, 1000); // Adjust the delay (in milliseconds) as needed
}


  cake.addEventListener("click", function (event) {
      const rect = cake.getBoundingClientRect();
      const left = event.clientX - rect.left;
      const top = event.clientY - rect.top;
      addCandle(left, top);
  });

  function isBlowing() {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
      }
      let average = sum / bufferLength;

      return average > 50; // ito baguhin
  }

  function blowOutCandles() {
      let blownOut = 0;

      // Only check for blowing if there are candles and at least one is not blown out
      if (candles.length > 0 && candles.some((candle) => !candle.classList.contains("out"))) {
          if (isBlowing()) {
              candles.forEach((candle) => {
                  if (!candle.classList.contains("out") && Math.random() > 0.5) {
                      candle.classList.add("out");
                      blownOut++;
                  }
              });
          }

          if (blownOut > 0) {
              updateCandleCount();
          }

          // If all candles are blown out, trigger confetti after a small delay
          if (candles.every((candle) => candle.classList.contains("out"))) {
              setTimeout(function() {
                  triggerConfetti();
                  setTimeout(showImages, 500); // Delay the appearance of images
                  endlessConfetti(); // Start the endless confetti
              }, 200);
              audio.play();
              showGiftBox();
          }
      }
  }

  if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(function (stream) {
              audioContext = new (window.AudioContext || window.webkitAudioContext)();
              analyser = audioContext.createAnalyser();
              microphone = audioContext.createMediaStreamSource(stream);
              microphone.connect(analyser);
              analyser.fftSize = 256;
              setInterval(blowOutCandles, 200);
          })
          .catch(function (err) {
              console.log("Unable to access microphone: " + err);
          });
  } else {
      console.log("getUserMedia not supported on your browser!");
  }
});

function triggerConfetti() {
  confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
  });
}

function endlessConfetti() {
  setInterval(function() {
      confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0 }
      });
  }, 1000);
}

function showImages() {
  document.getElementById('image4u').style.opacity = '1';
  document.getElementById('imageBday').style.opacity = '1';
}