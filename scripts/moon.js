"strict mode";
/*
This code works in conjunction with HTML and SVG graphics.
See svg.html for usage example.
*/
function getMoonPhase(date) {
  const dbg = document.getElementById('moon_debug');
  const shadow = document.getElementById('svg_earthshadow');
  if (!dbg && !shadow) {
    console.log("nothing to do!");
    return;
  }

  const newMoonRefDate = new Date('2000-01-06T18:14:00Z');  // Known New Moon reference date (Jan 6, 2000)
  const lunarCycleDays = 29.53058867;  // Average length of the lunar cycle in days
  // Calculate the difference in days between the input date and the reference New Moon date
  const diffInTime = date.getTime() - newMoonRefDate.getTime();
  const diffInDays = diffInTime / (1000 * 60 * 60 * 24);
  // Calculate the moon's age in the current cycle
  const lunarAge = diffInDays % lunarCycleDays;
  // Normalize the lunar age to be between 0 and 29.53
  const normalizedLunarAge = (lunarAge + lunarCycleDays) % lunarCycleDays;

  // Determine the moon phase based on the lunar age
  let text = "";
  if (normalizedLunarAge < 1) text = "new";
  else if (normalizedLunarAge < 7.4) { text = "wax.cresc"; }
  else if (normalizedLunarAge < 14.8) { text = "1<sup>st</sup>&frac14;&rarr;wax.gibbous"; }
  else if (normalizedLunarAge < 15.8) { text = "full"; }
  else if (normalizedLunarAge < 22.1) { text = "wan.gibbous"; }
  else if (normalizedLunarAge < 28) { text = "last&frac14;&rarr;wan.cresc"; } 
  else text="new";

  // fraction of the moon maths
  const fraction = normalizedLunarAge/lunarCycleDays;
  const percentage = Math.round( fraction * 100 );

  // illuminatin
  const lum = 0.5 * (1 - Math.cos(2*Math.PI * fraction) );

  let cx; // center of the Earth shadow
  if (fraction < 0.5) {
    // growing, shadow moves from -80 (when fraction is 0) to 80 (when fraction is 0.5)
    cx = -80 + 160 * (1 - fraction * 2);
  }
  else {
    // from="280" (when fraction is 0.5) to="120" (when fraction is 1)
    cx = -320 * fraction + 440;
  }

  if (dbg) dbg.innerHTML = `${date.toDateString()}: ${percentage}%, "${text}", lum=${Math.round((lum)*100)}%<br>`;
  if (shadow) shadow.setAttribute('cx', cx);
}

function moonPreviousDay() {
  moonDate.setDate( moonDate.getDate() - 1 );
  getMoonPhase( moonDate );  
}

function moonNextDay() {
  moonDate.setDate( moonDate.getDate() + 1 );
  getMoonPhase( moonDate );  
}

let moonDate = new Date();
getMoonPhase( moonDate );

export { moonPreviousDay, moonNextDay }