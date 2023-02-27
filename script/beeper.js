//create audio
audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function beep(freq, wave, vol, dur) {
// freq:130-1000 hz; wave:[0=sine|1=square|2=sawtooth|3=triangle], 
// vol:0-1.0; dur in ms
  var oscillator = audioCtx.createOscillator();
  var gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.value = vol;
  oscillator.frequency.value = freq;
  oscillator.type = wave;
  oscillator.start();
  
  setTimeout(
    function(){
      oscillator.stop();
    }, dur
  ); 
} 
