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
  enhanceStoryElements();
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
    
    // Add click handler to make illustrations do a full spin
    img.addEventListener('click', () => {
      img.style.transition = 'transform 1s ease';
      img.style.transform = 'perspective(800px) rotateY(360deg)';
      
      // Reset after animation completes
      setTimeout(() => {
        img.style.transition = 'all 0.3s ease';
        img.style.transform = 'perspective(800px) rotateY(0deg)';
      }, 1000);
    });
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
    const originalText = sfx.textContent;
    sfx.innerHTML = `<span class="magical-text">${originalText}</span>`;
    
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
 * Enhance story elements with interactive features
 * Adds special styling to dialogues, magical objects, and emphasizes key moments
 */
function enhanceStoryElements() {
  // First, clear specific paragraphs of any special styling
  const paragraphsToReset = [
    "Walking past them, Dad winked at the boys",
    "A wide grin spread across Billius's face"
  ];
  
  // Find and reset paragraphs that contain our target phrases
  document.querySelectorAll('p').forEach(p => {
    if (hasAnyPhrase(p.textContent, paragraphsToReset)) {
      p.classList.remove('emotional', 'climax-moment');
      // Also remove any styling from spans inside
      p.querySelectorAll('.dialogue, .magic-object, .clock-reference, .magic-spell, .character-name, .thought').forEach(span => {
        const text = span.textContent;
        const textNode = document.createTextNode(text);
        span.parentNode.replaceChild(textNode, span);
      });
    }
  });
  
  // Safely process each paragraph to avoid HTML string contamination
  const paragraphs = document.querySelectorAll('p');
  
  paragraphs.forEach(paragraph => {
    // Skip the paragraphs we want to keep normal
    if (hasAnyPhrase(paragraph.textContent, paragraphsToReset)) {
      return; // Skip this paragraph entirely
    }
    
    // Create a temporary div for manipulations
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = paragraph.innerHTML;
    
    // Replace text without affecting existing HTML - strategically selected highlights
    
    // Strategically select key dialogue moments
    const keyDialogues = [
      "Honestly, Ronin, if you blast your socks through the floorboards one more time, you can patch it up yourself!",
      "Mum! Where's my Cleansweep Seven manual? It's not in my trunk!",
      "I don't know!",
      "You borrowed it? Borrowed it?",
      "I just wanted to see if it would point to Hogwarts for me",
      "Try… try Reparo?",
      "All's well that ends well!",
      "Ow! Get off!",
      "Suppose you're not completely hopeless. Might even survive Hogwarts… eventually."
    ];
    tempDiv.innerHTML = tempDiv.innerHTML.replace(/"([^"<>]+)"/g, (match, content) => {
      if (keyDialogues.some(dialogue => content.includes(dialogue))) {
        return `<span class="dialogue">${match}</span>`;
      }
      return match;
    });
    
    // Highlight the clock at strategic moments in the plot
    const keyClockMoments = [
      "clock hand went haywire",
      "detached itself completely from the clock face",
      "hand was gone",
      "the Weasley family clock",
      "hand settled firmly onto its peg",
      "Billius looked up at the clock, now back to normal"
    ];
    tempDiv.innerHTML = tempDiv.innerHTML.replace(/\b(clock('s)? hand|clock face|golden hand)\b/gi, (match) => {
      if (keyClockMoments.some(moment => tempDiv.textContent.includes(moment))) {
        return `<span class="clock-reference">${match}</span>`;
      }
      return match;
    });
    
    // Only highlight actual spells when cast
    replaceTextWithSpans(tempDiv, /\b(Accio|Reparo|Finite)\b/g, 'magic-spell');
    
    // Highlight character names at strategic story points
    const keyCharacterMoments = [
      "Ronin's hand was gone",
      "panic flooded Billius",
      "Billius tapped Ronin's hand firmly",
      "Ronin stared. His ears started to turn red",
      "Billius swallowed hard",
      "the hand settled firmly",
      "for the first time that afternoon, Billius began to smile"
    ];
    tempDiv.innerHTML = tempDiv.innerHTML.replace(/\b(Billius|Ronin)\b/g, (match) => {
      if (keyCharacterMoments.some(moment => tempDiv.textContent.includes(moment))) {
        return `<span class="character-name">${match}</span>`;
      }
      return match;
    });
    
    // Update original paragraph
    paragraph.innerHTML = tempDiv.innerHTML;
    
    // Add appropriate classes to paragraphs based on content - dramatically reduced
    // Skip the paragraphs we want to keep normal
    const skipPhrases = [
      "Walking past them, Dad winked at the boys",
      "A wide grin spread across Billius's face"
    ];
    
    // Select key emotional moments strategically
    if (!hasAnyPhrase(paragraph.textContent, skipPhrases) &&
        hasAnyPhrase(paragraph.textContent, [
          "panic flooded Billius",
          "Billius winced. He knew, with dreadful certainty, that this was his fault",
          "A wave of relief flooded the two brothers",
          "Billius had a very bad feeling that things were about to get a lot less ordinary"
        ])) {
      paragraph.classList.add('emotional');
    }
    
    // Highlight a few more climax moments for dramatic effect
    if (hasAnyPhrase(paragraph.textContent, [
      "the hand settled firmly onto its peg, snug and secure",
      "Ronin's hand was gone",
      "With a sudden, impulsive movement, Billius tapped Ronin's hand firmly",
      "With an enraged shriek, the gnome launched itself",
      "That was Ronin's chance"
    ])) {
      paragraph.classList.add('climax-moment');
    }
  });
  
  // Add scene breaks for key story transitions
  const chapterBreaks = document.querySelectorAll('.chapter-content');
  chapterBreaks.forEach(chapter => {
    // Add visual breaks at pivotal moments
    const keyPhrases = [
      "Ronin's hand wasn't just missing; it was lost.",  // Primary plot point
      "No one had seen.",  // Key moment when Billius realizes he's in trouble
      "just had to put it back, and everything would return to normal."  // Resolution approach
    ];
    
    // Find paragraphs containing key phrases
    const allParagraphs = chapter.querySelectorAll('p');
    allParagraphs.forEach((para, index) => {
      if (index < allParagraphs.length - 1) { // Skip the last paragraph
        keyPhrases.forEach(phrase => {
          if (para.textContent.includes(phrase)) {
            // Create scene break
            const sceneBreak = document.createElement('div');
            sceneBreak.classList.add('scene-break');
            para.insertAdjacentElement('afterend', sceneBreak);
          }
        });
      }
    });
  });
  
  // Make magic spells interactive
  document.querySelectorAll('.magic-spell').forEach(spell => {
    spell.addEventListener('click', () => {
      // Add temporary animation effects
      const spellTrail = document.createElement('div');
      spellTrail.style.position = 'fixed';
      spellTrail.style.top = '0';
      spellTrail.style.left = '0';
      spellTrail.style.width = '100%';
      spellTrail.style.height = '100%';
      spellTrail.style.pointerEvents = 'none';
      spellTrail.style.background = `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(255, 214, 116, 0.4), transparent 70%)`;
      spellTrail.style.zIndex = '999';
      spellTrail.style.opacity = '0.7';
      document.body.appendChild(spellTrail);
      
      // Animate the spell trail
      spellTrail.animate([
        { opacity: 0.7, transform: 'scale(0.1)' },
        { opacity: 0, transform: 'scale(3)' }
      ], {
        duration: 1000,
        easing: 'ease-out'
      }).onfinish = () => {
        spellTrail.remove();
      };
    });
  });
}

/**
 * Helper function to safely replace text with spans in HTML
 * @param {Element} element - The DOM element to process
 * @param {RegExp} regex - The regex pattern to match
 * @param {string} className - The class name to add to the spans
 * @param {boolean} addEmoji - Whether to add an emoji after the element
 */
function replaceTextWithSpans(element, regex, className, addEmoji = false) {
  const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
  const nodesToReplace = [];
  
  // First pass: collect nodes to replace
  while (walk.nextNode()) {
    const node = walk.currentNode;
    if (node.parentElement && !isInSpecialElement(node.parentElement)) {
      nodesToReplace.push(node);
    }
  }
  
  // Second pass: replace nodes
  nodesToReplace.forEach(node => {
    const text = node.nodeValue;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
      }
      
      // Create span for the match
      const span = document.createElement('span');
      span.className = className;
      span.textContent = match[0];
      fragment.appendChild(span);
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
    }
    
    // Replace the original node with the fragment
    node.parentNode.replaceChild(fragment, node);
  });
}

/**
 * Check if an element is already a special element we don't want to process
 * @param {Element} element - The DOM element to check
 * @returns {boolean} - Whether the element is a special element
 */
function isInSpecialElement(element) {
  const specialClasses = ['dialogue', 'magic-object', 'clock-reference', 'magic-spell', 'character-name', 'floating-letter', 'magical-text'];
  for (const cls of specialClasses) {
    if (element.classList.contains(cls) || element.closest(`.${cls}`)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a string contains any of the given phrases
 * @param {string} text - The text to check
 * @param {Array<string>} phrases - The phrases to look for
 * @returns {boolean} - Whether the text contains any of the phrases
 */
function hasAnyPhrase(text, phrases) {
  const lowerText = text.toLowerCase();
  return phrases.some(phrase => lowerText.includes(phrase.toLowerCase()));
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