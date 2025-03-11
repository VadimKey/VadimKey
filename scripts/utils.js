function createTableOfContent() {
  const main = document.getElementById('main');
  const tbl = document.getElementById('tbl_of_content');

  const scrollerId = 'tbl_of_content_scrollbar';

  tbl.innerHTML += `<h2>Content</h2><div style='width:100%;height:8px;background:var(--lgrey)'>
  <div style='height:8px;background:var(--dgreen);width:0' id='${scrollerId}'></div>
  </div><ul>`

  const headers = main.getElementsByTagName("h2");
  for (const h of headers) {
    if (h.innerHTML) {

      const hid = h.getAttribute('id');
      const innerHTML = hid ? `<a href=#${hid}>${h.innerHTML}</a>` : h.innerHTML;

      tbl.innerHTML += "<li>" + innerHTML + "</li>";
    }
  }
  tbl.innerHTML += "</ul>";

  window.addEventListener('scroll', updateProgressBar);

  function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = ( winScroll / height ) * 100;
    document.getElementById(scrollerId).style.width = scrolled + '%';
  }
}


function reviver(key, value) {
  try {
      console.log(key, value);
      const val = new Date(value);
      if (! isNaN(val) ) return val;
  }
  catch(x) {
  }
  return value;
}

function validateJSON(inel, outel, withReviver) {
  const str = document.getElementById(inel).value;
  try {
      const obj = withReviver ? JSON.parse(str, reviver) : JSON.parse(str);
      document.getElementById(outel).innerHTML = "VALID<br>" + JSON.stringify(obj);
  }
  catch(err) {
      const out = document.getElementById(outel);
      out.innerHTML = "INVALID: " + err + "<br>";
      const line_match = String(err).match(/line [0-9]+/);
      if (line_match) {
          const line = +line_match[0].replace('line ', '') - 1;
          const column = +String(err).match(/column [0-9]+/)[0].replace('column ', '') - 1;
          const text = str.split('\n');
          const len = text.length;
          console.log(len);
          for (let i = 0; i < line; ++i) {
              out.innerHTML += `<i>${String(i+1).padStart(3,'0')}</i>: ${text[i]}<br>`;
          }

          out.innerHTML += `<i>${String(line+1).padStart(3,'0')}</i>:` + "<strong>";
          out.innerHTML += text[line].slice(0, column);
          out.innerHTML += '<span style="color: var(--lred)">' + text[line][column] + '</span>';
          out.innerHTML += text[line].slice(column+1) + "<br>";

          for (let i = line+1; i < len; ++i) {
              console.log(text[i]);
              out.innerHTML += `<i>${String(i+1).padStart(3,'0')}</i>: ${text[i]}<br>`;
          }
      }
  }
}


function formatCode(inp_id, out_id) {
  const input = document.getElementById(inp_id);
  const output = document.getElementById(out_id);
  const text = input.value.split("\n");
  output.innerHTML = "\&lt;div class='code'\&gt;<br>";
  for (let t of text) {
      if (t)
          output.innerHTML += t.replaceAll(" ", "&amp;nbsp;").replaceAll("<", "&amp;lt;").replaceAll(">", "&amp;gt;") + "&lt;br&gt;<br>";
  }
  output.innerHTML += "\&lt;/div\&gt;";
}

/* Copying to clipboard */
function copyToClipboard(elemid, tooltipid) {
  const source = document.getElementById(elemid);
  const text = source.innerText;
  navigator.clipboard.writeText(text);
  if (tooltipid) {
      const tooltip = document.getElementById(tooltipid);
      tooltip.innerHTML = "Copied " + text.length + " bytes"
  }
}
