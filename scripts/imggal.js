document.addEventListener('DOMContentLoaded', () => {
    var galModal = document.getElementById("galModal");
    var modalImg = document.getElementById("galImg");
    var captionText = document.getElementById("galCaption");

    const images = document.querySelectorAll('.imggal');
    images.forEach((img, index) => {
        const newDiv = document.createElement('div');
        newDiv.className="p3desc"
        newDiv.textContent = `${img.alt}`;
        img.insertAdjacentElement('afterend', newDiv);
        img.onclick = () => {
            galModal.style.display = "block";
            modalImg.style.float = "none";
            modalImg.src = img.src;
            captionText.innerHTML = img.alt;
            modalImg.onclick = function() {
                galModal.style.display = "none";
            }
        }
        newDiv.onclick = () => img.onclick();
    });
});

let closeBtn = document.getElementById("galClose");
if (closeBtn) {
    closeBtn.onclick = function() {
        galModal.style.display = "none";
    }
}

/*
* Slideshows 
* 
* Please see v2/misc/img.html for example of usage.
*/
class Slideshow {
    constructor(name) {
      this.name = name;
      this.slideIndex = 1;
      this.timeout = undefined;
    }

    // Next/previous controls
    ssPlusSlides(n) { this.showSlides( this.slideIndex += n, false ); }

    // Thumbnail image controls
    currentSlide(n) { this.showSlides( this.slideIndex = n, false ); }

    showSlides(n, automatic) {
      if (automatic) {
        this.timeout = setTimeout( (n, a) => this.showSlides(n, a), 2000, this.slideIndex += 1, true);
      }
      else if (this.timeout) {
        this.slideIndex = --n;
        clearTimeout(this.timeout);
        this.timeout = undefined;
      }

      let ss = document.getElementById(this.name);
      let slides = ss.getElementsByClassName( 'dmbSlides' );
      let dots = ss.nextSibling.childNodes;
      if (n > slides.length) { n = this.slideIndex = 1; }
      if (n < 1) { n = this.slideIndex = slides.length; }
      for (let s of slides) { s.style.display = 'none'; }
      for (let d of dots) { d.className = d.className.replace(' dmbSlideActive', ''); }
      slides[n-1].style.display = 'block';
      dots[n-1].className += ' dmbSlideActive';
    }
}

  function generateSlideshows() {
    const slideshows = document.getElementsByClassName('slideshow-container');
    for (let ss of slideshows) {
      const ssid = ss.getAttribute('id');
      let obj = new Slideshow(ssid);
      const images = ss.getElementsByTagName('img');
      // Put all images in temporary array
      const imgtmp = [];
      const len = images.length;
      for (let i = 0; i < len; ++i) {
        imgtmp.push( images[i] );
      }            
      for (img of imgtmp) {
        img.remove();
      }
      for (let i = 0; i < len; ++i) {
        const slide = document.createElement( 'div' );
        slide.className = "dmbSlides";
        const numbertext = document.createElement( 'div' );
        numbertext.className = "numbertext";
        numbertext.appendChild( document.createTextNode(`${i+1} / ${len}`) );
        slide.appendChild( numbertext );
        slide.appendChild( imgtmp[ i ] );

        const txt = imgtmp[i].getAttribute('alt')
        if (txt) {
          const desc = document.createElement( 'div' );
          desc.className="text";
          desc.appendChild( document.createTextNode(txt) );
          slide.appendChild(desc);
        }
        ss.appendChild(slide);
      }
      // prev/next
      const prev = document.createElement( 'a' );
      prev.className = "dmbSlidesPrev";
      prev.innerHTML = '&#10094;';
      prev.addEventListener('click', () => { obj.ssPlusSlides(-1) });
      const next = document.createElement( 'a' );
      next.className = "dmbSlidesNext";
      next.innerHTML = '&#10095;';
      next.addEventListener('click', () => { obj.ssPlusSlides(1) });
      ss.appendChild(prev);
      ss.appendChild(next);
      // dots
      const dotsdiv = document.createElement( 'div' )
      dotsdiv.style.textAlign = 'center';
      for (let i = 0; i < len; ++i) {
        const span = document.createElement( 'span' );
        span.className = 'dmbSlidesDot';
        span.addEventListener('click', () => { obj.currentSlide( i ) } );
        dotsdiv.appendChild(span);
      }
      ss.insertAdjacentElement( "afterend", dotsdiv );

      obj.showSlides(obj.slideIndex, true);
    }
  }                        

/*
* Lightboxes
* 
* Please see v2/misc/img.html for example of usage.
*/
class Lightbox {
    constructor(name, thumbs=4) {
      this.name = name;
      this.slideIndex = 1;
      this.thumbs = thumbs;
    }

    // Next/previous controls
    plusSlides(n) { this.showSlides( this.slideIndex += n, false ); }

    // Thumbnail image controls
    currentSlide(n) { this.showSlides( this.slideIndex = n, false ); }

    showSlides(n) {
      const modal = document.getElementById('lbModal_' + this.name);
      let i;
      const slides = modal.getElementsByClassName("lb-slides");
      if (slides) {
        if (n > slides.length) { this.slideIndex = 1; }
        if (n < 1) { this.slideIndex = slides.length; }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[this.slideIndex-1].style.display = "block";
      }

      const dots = modal.getElementsByClassName("lb-demo");      
      let min = 0;
      let max = this.thumbs-1;
      const half = Math.round(this.thumbs/2.0)
      if (this.slideIndex > half) {
        const d = this.slideIndex - half;
        min += d;
        max += d;
        if (max >= dots.length)
        {
            min = dots.length - this.thumbs;
            max = dots.length;
        }
      }
      if (dots) {
        for (i = 0; i < dots.length; i++) {
            if (i < min || i > max) dots[i].style.display = 'none';
            else dots[i].style.display = 'block';
            dots[i].className = dots[i].className.replace(" lb-active", "");
        }
        dots[this.slideIndex-1].className += " lb-active";
      }

      const captionText = modal.getElementsByClassName("lb-caption")[0];
      if (captionText) {
        let alt = slides[this.slideIndex-1].getElementsByTagName('img')[0].alt;
        captionText.innerHTML = alt ? alt : "&nbsp;";
      }
    }

    open() { document.getElementById("lbModal_"+this.name).style.display = "block"; }
    close() { document.getElementById("lbModal_"+this.name).style.display = "none"; }

    openModal(n) {
        this.open();
        this.currentSlide(n);
    }
}


function generateLightboxes() {
    const lightboxes = document.getElementsByClassName('lightbox');
    for (let lb of lightboxes) {
        const lbid = lb.getAttribute('id');
        let obj = new Lightbox(lbid);
        const images = lb.getElementsByTagName('img');
        // Put all images in temporary array
        const imgtmp = [];
        const len = images.length;
        for (let i = 0; i < len; ++i) {
          imgtmp.push( images[i] );
        }            
        for (img of imgtmp) {
          img.remove();
        }  

        // add 4 first images
        const row = document.createElement( 'div' );
        row.className = "lb-row";

        for (let i = 0; i < Math.min(len, 4); ++i) {
            const col = document.createElement( 'div' );
            col.className = "lb-column";
            imgtmp[i].className = "lb-hover-shadow";
            col.appendChild( imgtmp[ i ] );
            row.appendChild(col);
            imgtmp[i].addEventListener('click', () => { obj.openModal( i+1 ) } );
        }

        lb.appendChild(row);

        // Create a div for modal dialog
        const modal = document.createElement( 'div' );
        modal.id = 'lbModal_' + lbid;
        modal.className = 'lb-modal';

        window.addEventListener("click",  function (event) {
            if (event.target == modal) { 
                modal.style.display = 'none'; 
            } 
        });

        // Main picture view
        const content = document.createElement( 'div' );
        content.className = 'lb-modal-content';

        const glass = document.createElement("DIV");
        glass.setAttribute("class", "img-magnifier-glass");
        glass.style.backgroundRepeat = 'no-repeat';
        content.appendChild(glass);       
        glass.style.display = 'none';
        
        const close = document.createElement( 'span' );
        close.className = 'lb-close';
        close.innerHTML = '&times;'
        close.addEventListener('click', () => { obj.close(); });
        content.appendChild(close);

        for (let i = 0; i < imgtmp.length; ++i) {
           const slide = document.createElement('div');
           slide.className = 'lb-slides';
           const numb = document.createElement('div');
           numb.className = 'lb-numbertext';
           numb.innerHTML = `${i+1} / ${imgtmp.length}`;
           slide.appendChild( numb );
           const img = document.createElement('img');
           img.src = imgtmp[i].src;
           img.style.width = '100%';
           img.alt = imgtmp[i].alt;
           slide.appendChild( img );
           img.addEventListener( 'mousemove', (e) => moveMagnifier(e, img, glass) );
           img.addEventListener( 'touchmove', (e) => moveMagnifier(e, img, glass) );
           glass.addEventListener( 'mousemove', (e) => moveMagnifier(e, img, glass) );
           glass.addEventListener( 'touchmove', (e) => moveMagnifier(e, img, glass) );
           content.appendChild( slide );
        }

        // Controls
        const prev = document.createElement('a');
        prev.className = 'lb-prev';
        prev.innerHTML = '&#10094;';
        prev.addEventListener('click', () => { obj.plusSlides(-1) });
        const next = document.createElement( 'a' );
        next.className = "lb-next";
        next.innerHTML = '&#10095;';
        next.addEventListener('click', () => { obj.plusSlides(1) });
        content.appendChild(prev);
        content.appendChild(next);

        // caption text 
        const caption = document.createElement( 'div' );
        caption.className = 'lb-caption-container';
        const caption_p = document.createElement( 'p' );
        caption_p.className = 'lb-caption';
        caption.appendChild(caption_p);
        content.appendChild(caption);

        // Previews
        for (let i = 0; i < imgtmp.length; ++i) {
            const col = document.createElement( 'div' );
            col.className = 'lb-column';
            const img = document.createElement( 'img' );
            img.src = imgtmp[i].src;
            img.alt = imgtmp[i].alt;
            img.className = 'lb-demo';
            img.addEventListener('click', () => { obj.currentSlide(i+1); } );
            col.appendChild( img );
            content.appendChild(col);
        }

        modal.appendChild(content);        
        lb.insertAdjacentElement( "afterend", modal );
        obj.showSlides( 1 );
    }
}


function generateNonModalLightboxes() {
    const lightboxes = document.getElementsByClassName('nonmodal-lightbox');
    for (let lb of lightboxes) {
        const lbid = lb.getAttribute('id');
        let obj = new Lightbox(lbid, 5);
        const images = lb.getElementsByTagName('img');
        // Put all images in temporary array
        const imgtmp = [];
        const len = images.length;
        for (let i = 0; i < len; ++i) {
          imgtmp.push( images[i] );
        }            
        for (let img of imgtmp) {
          img.remove();
        }  

        // Main picture view
        const content = document.createElement( 'div' );
        content.id = 'lbModal_' + lbid;
        content.className = 'lb-modal-content';

        const glass = document.createElement("DIV");
        glass.setAttribute("class", "img-magnifier-glass");
        glass.style.backgroundRepeat = 'no-repeat';

        content.appendChild(glass);
         
        glass.style.display = 'none';
    
        content.appendChild( glass );

        const viewer = document.createElement( 'div' );

        const close = document.createElement( 'span' );
        close.className = 'lb-close-ins';
        close.innerHTML = '&times;'
        close.addEventListener('click', () => { glass.style.display='none', viewer.style.display='none'; });
        viewer.appendChild(close);
        
        for (let i = 0; i < imgtmp.length; ++i) {
           const slide = document.createElement('div');
           slide.className = 'lb-slides';
           const numb = document.createElement('div');
           numb.className = 'lb-numbertext';
           numb.innerHTML = `${i+1} / ${imgtmp.length}`;
           slide.appendChild( numb );
           const img = document.createElement('img');
           img.src = imgtmp[i].src;
           img.style.width = '100%';
           img.alt = imgtmp[i].alt;
           img.addEventListener( 'mousemove', (e) => moveMagnifier(e, img, glass) );
           img.addEventListener( 'touchmove', (e) => moveMagnifier(e, img, glass) );
           glass.addEventListener( 'mousemove', (e) => moveMagnifier(e, img, glass) );
           glass.addEventListener( 'touchmove', (e) => moveMagnifier(e, img, glass) );
   
           slide.appendChild( img );
           viewer.appendChild( slide );
        }

        // Controls
        const prev = document.createElement('a');
        prev.className = 'lb-prev';
        prev.innerHTML = '&#10094;';
        prev.addEventListener('click', () => { obj.plusSlides(-1) });
        const next = document.createElement( 'a' );
        next.className = "lb-next";
        next.innerHTML = '&#10095;';
        next.addEventListener('click', () => { obj.plusSlides(1) });
        viewer.appendChild(prev);
        viewer.appendChild(next);

        // caption text 
        const caption = document.createElement( 'div' );
        caption.className = 'lb-caption-container';
        const caption_p = document.createElement( 'p' );
        caption_p.className = 'lb-caption';
        caption.appendChild(caption_p);
        viewer.appendChild(caption);

        content.appendChild(viewer);

        // Previews
        const previewClass = imgtmp.length > 4 ? 'lb-column5' : 'lb-column';
        for (let i = 0; i < imgtmp.length; ++i) {
            const col = document.createElement( 'div' );
            col.className = previewClass;
            const img = document.createElement( 'img' );
            img.src = imgtmp[i].src;
            img.alt = imgtmp[i].alt;
            img.className = 'lb-demo';
            img.style.height = imgtmp[i].style.height;
            img.addEventListener('click', () => { viewer.style.display='block'; obj.currentSlide(i+1); } );
            col.appendChild( img );
            content.appendChild(col);
        }

        const clearfix = document.createElement( 'clearfix' );
        clearfix.className = 'clearfix';
        lb.appendChild(content);        
        lb.appendChild(clearfix);

        obj.showSlides( 1 );
    }
}

function getCursorPos(e, img) {
    const a = img.getBoundingClientRect();
    x = e.pageX - a.left - window.scrollX;
    y = e.pageY - a.top - window.scrollY;
    return {x : x, y : y };
}

function moveMagnifier( e, img, glass ) {
    if (img.parentElement.style.display == 'none') return;

    const zoom = 2.5;


    const bgimg = 'url("' + img.src + '")';
    if ( glass.style.backgroundImage !== bgimg ) {
        glass.style.backgroundImage = bgimg;
        glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
    }

    const bw = 1;
    const w = glass.offsetWidth / 2;
    const h = glass.offsetHeight / 2;

    e.preventDefault();
    const pos = getCursorPos( e, img );
    x = pos.x;
    y = pos.y;
    let display = "block";
    if ( x < 0 || x > img.width ) { display = 'none'; }
    if ( y < 0 || y > img.height ) { display = 'none'; }

    glass.style.display = display;
    if ( display == 'block' ) {
        glass.style.left = ( x - w ) + "px";
        glass.style.top = ( y - h ) + "px";
        glass.style.backgroundPosition = "-" + ( ( x * zoom ) - w + bw ) + "px -" + ( ( y * zoom ) - h + bw ) + "px";
    }
}   


function imageZoom(imgID, resultID) {
    const img = document.getElementById(imgID);
    const result = document.getElementById(resultID);
    const lens = document.createElement('div');
    lens.setAttribute('class', 'img-zoom-lens');
    img.parentElement.insertBefore(lens, img);

    // Calculate the ratio between result DIV and lens
    const cx = result.offsetWidth / lens.offsetWidth; // offsetWidth is an object width including borders, scrollbars etc
    const cy = result.offsetHeight / lens.offsetHeight;

    // Set background to the result div
    result.style.backgroundImage = "url(" + img.src + ")";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    function moveLens(e) {
        e.preventDefault();
        const pos = getCursorPos(e, img);
        let x = pos.x - (lens.offsetWidth / 2);
        let y = pos.y - (lens.offsetHeight / 2);
        if (x > img.width - lens.offsetWidth) { x = img.width - lens.offsetWidth; }
        if (x < 0) { x = 0; }
        if (y > img.height - lens.offsetHeight) { y = img.height - lens.offsetHeight; }
        if (y < 0) { y = 0; }
        lens.style.left = x + "px";
        lens.style.top = y + "px";
        result.style.backgroundPosition = "-" + (x*cx) + "px -" + (y*cy) + "px";
    }
}

function magnify(imgID, zoom) {
    const img = document.getElementById(imgID);
    if (!img) return;
    const glass = document.createElement("DIV");
    glass.setAttribute("class", "img-magnifier-glass");
  
    img.parentElement.insertBefore(glass, img);
  
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
    const bw = 3;
    const w = glass.offsetWidth / 2;
    const h = glass.offsetHeight / 2;
  
    glass.addEventListener( 'mousemove', moveMagnifier );
    img.addEventListener( 'mousemove', moveMagnifier );
    glass.addEventListener( 'touchmove', moveMagnifier );
    img.addEventListener( 'touchmove', moveMagnifier );

    glass.style.display = 'none';

    function moveMagnifier( e ) {
        e.preventDefault();
        const pos = getCursorPos( e );
        x = pos.x;
        y = pos.y;
        let display = "block";
        if ( x < 0 || x > img.width ) { display = 'none'; }
        if ( y < 0 || y > img.height ) { display = 'none'; }
    
        glass.style.display = display;
        if ( display == 'block' ) {
            glass.style.left = ( x - w ) + "px";
            glass.style.top = ( y - h ) + "px";
            glass.style.backgroundPosition = "-" + ( ( x * zoom ) - w + bw ) + "px -" + ( ( y * zoom ) - h + bw ) + "px";
        }
    }

    function getCursorPos(e) {
        const a = img.getBoundingClientRect();
        x = e.pageX - a.left - window.scrollX;
        y = e.pageY - a.top - window.scrollY;
        return {x : x, y : y };
    }

  }

magnify( 'avercamp2', 3.5 );

function initComparisions() {
    let x = document.getElementsByClassName( 'img-comp-overlay' );
    for ( let e of x ) {
        compareImages(e);
    }

    function compareImages(img) {
        const w = img.offsetWidth;
        const h = img.offsetHeight;
        if (w == 0 || h == 0) return; // image is invisible
        if (img.parentElement.getElementsByClassName('img-comp-slider').length != 0) return; // slider already added
        img.style.width = (w / 2) + "px";
        const slider = document.createElement( 'div' );
        slider.setAttribute( 'class', 'img-comp-slider' );
        img.parentElement.insertBefore( slider, img );
        slider.style.top = (h / 2) - (slider.offsetHeight / 2) + "px";
        slider.style.left = (w / 2) - (slider.offsetWidth / 2) + "px";
        slider.addEventListener( 'mousedown', slideReady );
        slider.addEventListener( 'mouseup', slideFinish );
        slider.addEventListener( 'touchstart', slideReady );
        slider.addEventListener( 'touchend', slideFinish );

        let clicked = 0;

        function slideReady( e ) {
            e.preventDefault();
            clicked = 1;
            slider.addEventListener( 'mousemove', slideMove );
            slider.addEventListener( 'touchmove', slideMove );
        }

        function slideFinish() {
            clicked = 0;
        }

        function slideMove( e ) {
            if ( clicked == 0 ) return false;
            let pos = getCursorPos( e );
            if (pos < 0) pos = 0;
            if (pos > w) pos = w;
            slide(pos);
        }

        function getCursorPos( e ) {
            e = e.changedTouches ? e.changedTouches[0] : e;
            const a = img.getBoundingClientRect();
            let x = e.pageX - a.left;
            x -= window.scrollX;
            return x;
        }

        function slide( x ) {
            img.style.width = x + "px";
            slider.style.left = img.offsetWidth - (slider.offsetWidth / 2) + "px";
        }
    }
}

initComparisions();