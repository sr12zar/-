//a stereo beeper modified from 
//Two Independent Oscillators by chrisguttandin
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function beep2(freqL,towL,volL,durL, freqR,towR,volR,durR) {
  // freq*:100-10000 hz; 
  // tow*:[0=sine|1=square|2=sawtooth|3=triangle], 
  // vol*:0.0-1.0; 
  // dur* in ms
  var leftOscillator = audioCtx.createOscillator();
  var leftGain = audioCtx.createGain();
  var rightOscillator = audioCtx.createOscillator();
  var rightGain = audioCtx.createGain();
  var merger = audioCtx.createChannelMerger(2);

  leftOscillator.connect(leftGain).connect(merger, 0, 0);
  rightOscillator.connect(rightGain).connect(merger, 0, 1);

  merger.connect(audioCtx.destination);

  leftOscillator.frequency.value = freqL;
  leftOscillator.type = towL;
  leftGain.gain.value = volL;
  leftOscillator.start(0);

  rightOscillator.frequency.value = freqR;
  rightOscillator.type = towR;
  rightGain.gain.value = volR;
  rightOscillator.start(0); 
 
  setTimeout( function() { leftOscillator.stop();}, durL ); 
  setTimeout( function() { rightOscillator.stop();}, durR );  
} 

