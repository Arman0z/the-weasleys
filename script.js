/**
 * The Weasleys - Magical Website
 * JavaScript Interactions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  initWeasleyClock();
  initScrollEffects();
  initGnomePopups();
  initBackToTopButton();
  initSpellEffects();
});

/**
 * Initialize the Weasley family clock
 * Creates SVG clock with animated hands
 */
function initWeasleyClock() {
  const clockContainer = document.querySelector('.weasley-clock');
  if (!clockContainer) return;
  
  // Create SVG clock face
  const clockSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  clockSVG.setAttribute('viewBox', '0 0 200 200');
  clockSVG.setAttribute('class', 'clock-svg');
  
  // Clock face
  const clockFace = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  clockFace.setAttribute('cx', '100');
  clockFace.setAttribute('cy', '100');
  clockFace.setAttribute('r', '95');
  clockFace.setAttribute('fill', '#e8d9b6');
  clockFace.setAttribute('stroke', '#7d2b2b');
  clockFace.setAttribute('stroke-width', '5');
  
  // Clock center
  const clockCenter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  clockCenter.setAttribute('cx', '100');
  clockCenter.setAttribute('cy', '100');
  clockCenter.setAttribute('r', '5');
  clockCenter.setAttribute('fill', '#3a2614');
  
  clockSVG.appendChild(clockFace);
  
  // Add clock locations
  const locations = [
    'Home', 'School', 'Work', 'Traveling', 
    'Lost', 'Hospital', 'Prison', 'Mortal Peril', 'Mischief Managed'
  ];
  
  locations.forEach((location, index) => {
    const angle = (index * 40) * Math.PI / 180;
    const x = 100 + 75 * Math.sin(angle);
    const y = 100 - 75 * Math.cos(angle);
    
    // Location text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '8');
    text.setAttribute('fill', '#3a2614');
    text.textContent = location;
    
    clockSVG.appendChild(text);
  });
  
  // Add clock hands for family members
  const familyMembers = [
    { name: 'Billius', location: 'Home', angle: 0 },
    { name: 'Ronin', location: 'School', angle: 40 },
    { name: 'Mum', location: 'Home', angle: 0 },
    { name: 'Dad', location: 'Work', angle: 80 },
    { name: 'Charlie', location: 'Traveling', angle: 120 },
    { name: 'Percy', location: 'School', angle: 40 },
    { name: 'Fred', location: 'Mischief Managed', angle: 320 },
    { name: 'George', location: 'Mischief Managed', angle: 320 },
    { name: 'Ginny', location: 'Home', angle: 0 }
  ];
  
  familyMembers.forEach((member, index) => {
    // Create hand
    const hand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hand.setAttribute('x1', '100');
    hand.setAttribute('y1', '100');
    hand.setAttribute('x2', 100 + 70 * Math.sin(member.angle * Math.PI / 180));
    hand.setAttribute('y2', 100 - 70 * Math.cos(member.angle * Math.PI / 180));
    hand.setAttribute('stroke', '#ffd674');
    hand.setAttribute('stroke-width', '2');
    hand.setAttribute('data-name', member.name);
    hand.setAttribute('class', 'clock-hand');
    
    // Add animation for Ronin's and Billius's hands
    if (member.name === 'Ronin' || member.name === 'Billius') {
      hand.classList.add('animated-hand');
    }
    
    clockSVG.appendChild(hand);
    
    // Add tiny name label at the end of each hand
    const nameLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    nameLabel.setAttribute('x', 100 + 60 * Math.sin(member.angle * Math.PI / 180));
    nameLabel.setAttribute('y', 100 - 60 * Math.cos(member.angle * Math.PI / 180));
    nameLabel.setAttribute('text-anchor', 'middle');
    nameLabel.setAttribute('font-size', '6');
    nameLabel.setAttribute('fill', '#3a2614');
    nameLabel.textContent = member.name;
    
    clockSVG.appendChild(nameLabel);
  });
  
  clockSVG.appendChild(clockCenter);
  clockContainer.appendChild(clockSVG);
  
  // Add click event to clock hands
  document.querySelectorAll('.clock-hand').forEach(hand => {
    hand.addEventListener('click', (e) => {
      const name = e.target.getAttribute('data-name');
      // Find next mention of this character in the text
      const paragraphs = document.querySelectorAll('p');
      for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].textContent.includes(name)) {
          paragraphs[i].scrollIntoView({ behavior: 'smooth' });
          // Highlight the paragraph briefly
          paragraphs[i].classList.add('highlight');
          setTimeout(() => {
            paragraphs[i].classList.remove('highlight');
          }, 2000);
          break;
        }
      }
    });
  });
  
  // Animate Ronin's hand to wobble between Home and School
  animateClockHands();
}

/**
 * Animate the clock hands
 */
function animateClockHands() {
  const roninHand = document.querySelector('.clock-hand[data-name="Ronin"]');
  const billiusHand = document.querySelector('.clock-hand[data-name="Billius"]');
  
  if (!roninHand || !billiusHand) return;
  
  // Ronin's hand wobbles between Home and School
  let roninAngle = 0;
  let roninDirection = 1;
  
  // Billius's hand occasionally moves to Mischief Managed
  let billiusAngle = 0;
  let billiusState = 'normal';
  let billiusTimer = 0;
  
  function updateHands() {
    // Update Ronin's hand
    if (roninDirection === 1) {
      roninAngle += 0.5;
      if (roninAngle >= 40) roninDirection = -1;
    } else {
      roninAngle -= 0.5;
      if (roninAngle <= 0) roninDirection = 1;
    }
    
    roninHand.setAttribute('x2', 100 + 70 * Math.sin(roninAngle * Math.PI / 180));
    roninHand.setAttribute('y2', 100 - 70 * Math.cos(roninAngle * Math.PI / 180));
    
    // Update Billius's hand
    billiusTimer++;
    
    if (billiusState === 'normal' && billiusTimer > 200) {
      billiusState = 'transitioning';
      billiusTimer = 0;
    } else if (billiusState === 'transitioning') {
      billiusAngle += 2;
      if (billiusAngle >= 320) {
        billiusState = 'mischief';
        billiusTimer = 0;
      }
    } else if (billiusState === 'mischief' && billiusTimer > 100) {
      billiusState = 'returning';
      billiusTimer = 0;
    } else if (billiusState === 'returning') {
      billiusAngle -= 2;
      if (billiusAngle <= 0) {
        billiusState = 'normal';
        billiusTimer = 0;
        billiusAngle = 0;
      }
    }
    
    if (billiusState !== 'normal') {
      billiusHand.setAttribute('x2', 100 + 70 * Math.sin(billiusAngle * Math.PI / 180));
      billiusHand.setAttribute('y2', 100 - 70 * Math.cos(billiusAngle * Math.PI / 180));
    }
    
    requestAnimationFrame(updateHands);
  }
  
  requestAnimationFrame(updateHands);
}

/**
 * Initialize scroll effects
 * Reveals elements as they enter the viewport
 */
function initScrollEffects() {
  const chapters = document.querySelectorAll('.chapter');
  const sfxElements = document.querySelectorAll('.sfx');
  
  // Intersection Observer for chapters
  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  // Intersection Observer for SFX elements
  const sfxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Play sound effect if available
        const audio = document.querySelector(`audio[data-sfx="${entry.target.textContent}"]`);
        if (audio) {
          audio.play();
        }
      }
    });
  }, { threshold: 0.8 });
  
  // Observe all chapters
  chapters.forEach(chapter => {
    chapterObserver.observe(chapter);
  });
  
  // Observe all SFX elements
  sfxElements.forEach(sfx => {
    sfxObserver.observe(sfx);
  });
}

/**
 * Initialize magical elements
 * Adds animated magical effects throughout the story
 */
function initGnomePopups() {
  // Create magic sparkles that follow cursor
  const sparklesContainer = document.createElement('div');
  sparklesContainer.classList.add('magic-sparkles');
  document.body.appendChild(sparklesContainer);
  
  // Add sparkle elements
  for (let i = 0; i < 15; i++) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    sparkle.style.setProperty('--delay', `${Math.random() * 5}s`);
    sparkle.style.setProperty('--size', `${Math.random() * 8 + 4}px`);
    sparklesContainer.appendChild(sparkle);
  }
  
  // Update sparkle positions on mouse move
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    sparklesContainer.style.left = `${mouseX}px`;
    sparklesContainer.style.top = `${mouseY}px`;
  });
  
  // Add magical hover effects to illustrations
  const illustrations = document.querySelectorAll('.illustration img');
  illustrations.forEach(img => {
    // Create a magical glow container
    const glowContainer = document.createElement('div');
    glowContainer.classList.add('magical-glow');
    
    // Insert the glow container before the image
    img.parentNode.insertBefore(glowContainer, img);
    
    // Move the image inside the glow container
    glowContainer.appendChild(img);
  });
}

/**
 * Initialize back-to-top button
 */
function initBackToTopButton() {
  const backToTopBtn = document.getElementById('floo-powder-btn');
  if (!backToTopBtn) return;
  
  // Show button when scrolled down
  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top when clicked
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Initialize spell effects
 * Adds audio and visual effects to spell text
 */
function initSpellEffects() {
  // Create audio elements for spell sounds
  const spellSounds = [
    { name: 'CRASH!', src: 'sounds/crash.mp3' },
    { name: 'sproing', src: 'sounds/sproing.mp3' },
    { name: 'plink', src: 'sounds/plink.mp3' }
  ];
  
  // Add audio elements to the page
  const audioContainer = document.createElement('div');
  audioContainer.style.display = 'none';
  
  spellSounds.forEach(sound => {
    const audio = document.createElement('audio');
    audio.src = sound.src;
    audio.setAttribute('data-sfx', sound.name);
    audio.preload = 'auto';
    audioContainer.appendChild(audio);
  });
  
  document.body.appendChild(audioContainer);
  
  // Add magical hover effect to SFX text
  const sfxElements = document.querySelectorAll('.sfx');
  sfxElements.forEach(sfx => {
    sfx.innerHTML = `<span class="magical-text">${sfx.textContent}</span>`;
    
    // Add magic wand icon
    const wandIcon = document.createElement('span');
    wandIcon.classList.add('wand-icon');
    wandIcon.innerHTML = '✨';
    sfx.appendChild(wandIcon);
    
    // Add spell trail animation
    sfx.addEventListener('mouseover', () => {
      const trail = document.createElement('div');
      trail.classList.add('spell-trail');
      
      // Position the trail along the text
      trail.style.left = `${Math.random() * 100}%`;
      trail.style.top = `${Math.random() * 100}%`;
      
      sfx.appendChild(trail);
      
      // Remove the trail after animation completes
      setTimeout(() => {
        trail.remove();
      }, 2000);
    });
  });
  
  // Add floating letters effect to chapter headings
  const chapterTitles = document.querySelectorAll('.chapter h2');
  chapterTitles.forEach(title => {
    const text = title.textContent;
    let newHTML = '';
    
    // Wrap each letter in a span for animation
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        newHTML += ' ';
      } else {
        newHTML += `<span class="floating-letter" style="--delay: ${i * 0.05}s">${text[i]}</span>`;
      }
    }
    
    title.innerHTML = newHTML;
  });
}

/**
 * Helper function to check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
