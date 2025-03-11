"strict mode";

const out = document.getElementById( 'output' );
const main = document.getElementById( 'main' );

if ( document.getElementById('valx') ) {
  document.getElementById('valx').innerHTML = Math.round(Math.random() * 100);
  document.getElementById('valy').innerHTML = Math.round(Math.random() * 100);
}

function byTagName(tag, parent = document) {
  if (! parent) return;
  const e = parent.getElementsByTagName(tag);
  if (out) out.innerHTML += 'There are ' + e.length + ' &lt;' + tag + '&gt; elements in ' + parent.nodeName + '<br>';
}

function byClassName(name, parent = document) {
  const e = parent.getElementsByClassName(name);
  if (out) out.innerHTML += 'There are ' + e.length + ' elements of class "' + name + '" in ' + parent.nodeName + '<br>';
}

function bySelector(selector, parent = document) {
  if (! parent) return;

  const e = parent.querySelectorAll(selector);
  if (out) out.innerHTML += 'There are ' + e.length + ' selector "' + selector + '" in ' + parent.nodeName + '<br>';
}

function allLinks() {
  if (!out) return;

  out.innerHTML += '<br>Links:<ul>';
  for (let item of document.links) {
    out.innerHTML += `<li>${item.href}</li>`;
  }
  out.innerHTML += '</ul>'
}

function title() {
  if (out) out.innerHTML += `Document title is '${document.title}'<br>`;
}

function home(id) {
  img = document.getElementById(id).src = '../../img/shiba.jpg';
}

function street(id) {
  img = document.getElementById(id).src = '../../img/shiba-outside.jpg';
}

function fields(id) {
  img = document.getElementById(id).src = '../../img/shiba-fields.jpg';
}

function validateForm() {
  const f = document.forms['myForm'];
  const x = f['puzzle'].value;
  let res = true;
  let text;

  const expected = Number(document.getElementById('valx').innerHTML) + Number(document.getElementById('valy').innerHTML);

  if (x != expected) {
    text = "Wrong answer!";
    console.log("Expected=" + expected);
    res = false;
  }
  else {
    text = "Correct";
  }
  const msg = document.getElementById('puzzle_msg');
  msg.innerHTML = text;
  msg.style.color = res ? "var(--dgreen)" : "var(--lred)";
  return res;
}

let animId = null;

function myMove(btn) {
  const cont = document.getElementById("container");
  const elem = document.getElementById("animate");
  if (btn.innerHTML == "Start") {
    btn.innerHTML = "Stop";
    cont.addEventListener("click", miss, true);
    elem.addEventListener("click", hit, true);
  }
  else {
    btn.innerHTML = "Start";
    clearInterval(animId);
    // need to use capture to handle clicks properly
    elem.removeEventListener("click", hit, true);
    cont.removeEventListener("click", miss, true);
    return;
  }

  let posX = 0, posY = 0;
  let dirX = 1, dirY = 1;
  animId = setInterval(frame, 10);

  function frame() {
    let changed=false;
    if (posX == 350 || posX < 0) { 
      dirX *= -1; 
      changed = true;
      elem.style.width = "45px";
    }
    if (posY == 400 || posY < 0) { 
      dirY *= -1;
      changed = true;
      elem.style.height = "45px";
    }

    if (changed) {
      setTimeout( () => { elem.style.width = "50px"; elem.style.height = "50px"}, 250 );
    }

    posX += dirX;
    posY += dirY;
    elem.style.top = `${posY}px`;
    elem.style.left = `${posX}px`;
  }
}

function hit() { 
  document.getElementById('animMsg').innerHTML = "HIT!"; 
  document.getElementById("animate").style.backgroundColor = "var(--dred)";
  setTimeout(() => document.getElementById("animate").style.backgroundColor = "var(--lred)", 300);
}

function miss() { document.getElementById('animMsg').innerHTML = "MISS!"; }


title();

byTagName( 'p' );
byTagName( 'div' );
byTagName( 'div', main );

byClassName( 'output' );
byClassName( 'active' );

bySelector( '.column' );

bySelector( 'div.tooltip', main );

allLinks();


/*

DOCUMENT NAVIGATION 

*/
var current = document.documentElement;

function displayCurrent()
{
  const out = document.getElementById('nav_out');
  if (!out) return;
  
  var val = current.nodeValue;
  if (current.nodeValue && current.nodeValue.length > 25) {
    val = current.nodeValue.substring(0, 25) + "...";
  }
  out.innerHTML = `Current: ${current}
   [nodeName=${current.nodeName}, nodeValue=${val}, nodeType=${current.nodeType}]
   <ul>
    <li>parentNode=${current.parentNode}
    <li>children=${current.childNodes.length}
    <li>firstChild=${current.firstChild}
    <li>lastChild=${current.lastChild}
    <li>previousSibling=${current.previousSibling}
    <li>nextSibling=${current.nextSibling}    
   </ul>
  `
};

function go(target, hint) {
  if (target) {
    current = target;
    displayCurrent();
  }
  else {
    document.getElementById('nav_out').innerHTML += `<h3>${hint} is null!</h3>`
  }
}

function addElement() {
  const el = document.getElementById('add_element');
  const txt = document.getElementById('add_element_text');
  const element = document.createElement(el.value);
  const node = document.createTextNode(txt.value);
  const before = document.getElementById('add_before').checked;
  element.appendChild(node);
  if (before) {
   const p = current.parentNode;
   if (p) {
     p.insertBefore(element, current); 
   }
   else {
     document.getElementById('nav_out').innerHTML += `<h3>Parent is null!</h3>`;
   }
  }
  else {
    current.appendChild(element); 
  }
}

function goParent() { go(current.parentNode, "Parent"); }
function goFirstChild() { go(current.firstChild, "First child"); }
function goLastChild() { go(current.lastChild, "Last child"); }
function goNextSibling() { go(current.nextSibling, "Next sibling"); }
function goPrevSibling() { go(current.previousSibling, "Previous sibling"); }
function goNthChild(n) { go(current.childNodes[n], "Child " + n); }
function goBody() { go(document.body, "Body"); }
function goDocument() { go(document.documentElement, "Document"); }
function goId(id) { go(document.getElementById(id), "ID #" + id); }

function removeCurrent() { 
  current.remove();
  displayCurrent();
}

function getCollection() {
  const c = document.getElementById('coll_type');
  const k = document.getElementById('coll_class');
  let coll;
  if (k.value == "tag") {
    coll = document.getElementsByTagName(c.value);
  }
  else {
    coll = document.getElementsByClassName(c.value);
  }
  const out = document.getElementById('coll_res');
  out.innerHTML = `There are ${coll.length} "${c.value}" elements`
}

displayCurrent();

function validateForm() {
  const res = document.getElementById('validityRes');
  res.innerHTML = "";  
  
  const name = document.getElementById('fname');
  res.innerHTML += "Name: " + (name.checkValidity() ? "OK" : name.validationMessage);

  const numb = document.getElementById('numb');
  res.innerHTML += "<br>Number: " + (numb.checkValidity() ? "OK" : numb.validationMessage);
  if (! numb.checkValidity() ) {
    if ( numb.validity.rangeOverflow ) { res.innerHTML += ": too large"; }
    else if ( numb.validity.rangeUnderflow ) { res.innerHTML += ": too small"; }
    else if ( numb.validity.valueMissing ) { res.innerHTML += ": value missing"; }
    else { res.innerHTML += ": other";  }
  }

  const bin = document.getElementById('binnumb');
  res.innerHTML += "<br>Binary Number: " + (bin.checkValidity() ? "OK" : bin.validationMessage);

  const puzzle = document.getElementById('puzzle');
  res.innerHTML += "<br>Puzzle: " + (puzzle.checkValidity() ? "OK" : puzzle.validationMessage);
}