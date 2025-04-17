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
  
  // Throttle variables for animation performance
  let lastFrameTime = 0;
  const frameThrottle = 1000 / 30; // Limit to 30 FPS for clock animation
  
  // Pre-compute expensive values
  const PI_180 = Math.PI / 180;
  const sin = {};
  const cos = {};
  
  // Pre-calculate sin and cos values for common angles
  for (let angle = 0; angle <= 360; angle++) {
    sin[angle] = Math.sin(angle * PI_180);
    cos[angle] = Math.cos(angle * PI_180);
  }
  
  // Get nearest pre-calculated value
  function getSin(angle) {
    const roundedAngle = Math.round(angle);
    return sin[roundedAngle >= 0 ? roundedAngle % 360 : (roundedAngle % 360) + 360];
  }
  
  function getCos(angle) {
    const roundedAngle = Math.round(angle);
    return cos[roundedAngle >= 0 ? roundedAngle % 360 : (roundedAngle % 360) + 360];
  }
  
  function updateHands(timestamp) {
    // Throttle frame rate for better performance
    if (timestamp - lastFrameTime < frameThrottle) {
      requestAnimationFrame(updateHands);
      return;
    }
    
    lastFrameTime = timestamp;
    
    // Update Ronin's hand
    if (roninDirection === 1) {
      roninAngle += 0.5;
      if (roninAngle >= 40) roninDirection = -1;
    } else {
      roninAngle -= 0.5;
      if (roninAngle <= 0) roninDirection = 1;
    }
    
    roninHand.setAttribute('x2', 100 + 70 * getSin(roninAngle));
    roninHand.setAttribute('y2', 100 - 70 * getCos(roninAngle));
    
    // Update Billius's hand - only update every other frame 
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
      billiusHand.setAttribute('x2', 100 + 70 * getSin(billiusAngle));
      billiusHand.setAttribute('y2', 100 - 70 * getCos(billiusAngle));
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
  
  // Use document fragment for batch DOM operations
  const fragment = document.createDocumentFragment();
  
  // Reduce sparkle count from 12 to 8 for better performance
  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    sparkle.style.setProperty('--delay', `${Math.random() * 5}s`);
    sparkle.style.setProperty('--size', `${Math.random() * 8 + 4}px`);
    // Add will-change property to optimize animation performance
    sparkle.style.setProperty('will-change', 'opacity, transform');
    fragment.appendChild(sparkle);
  }
  
  sparklesContainer.appendChild(fragment);
  document.body.appendChild(sparklesContainer);
  
  // Use pointer events where supported, falling back to mouse events
  const hasPointerEvents = window.PointerEvent !== undefined;
  let isEnabled = true;
  let lastMove = 0;
  const mouseMoveThrottle = 32; // Reduce to 30fps for cursor effects
  
  // Function to handle cursor movement with throttling
  const handleMove = (x, y) => {
    const now = Date.now();
    if (now - lastMove > mouseMoveThrottle) {
      lastMove = now;
      // Use transforms instead of left/top for GPU acceleration
      sparklesContainer.style.transform = `translate(${x}px, ${y}px)`;
    }
  };
  
  // Add event handler with improved performance
  if (hasPointerEvents) {
    document.addEventListener('pointermove', (e) => {
      if (isEnabled) handleMove(e.clientX, e.clientY);
    }, { passive: true });
  } else {
    document.addEventListener('mousemove', (e) => {
      if (isEnabled) handleMove(e.clientX, e.clientY);
    }, { passive: true });
  }
  
  // Disable effects when tab is not visible to save resources
  document.addEventListener('visibilitychange', () => {
    isEnabled = document.visibilityState === 'visible';
  });
  
  // Add magical hover effects to illustrations
  const illustrations = document.querySelectorAll('.illustration img');
  // Use document fragment for batch DOM operations
  const illustrationFragment = document.createDocumentFragment();
  const processedImages = [];
  
  illustrations.forEach(img => {
    // Create a magical glow container
    const glowContainer = document.createElement('div');
    glowContainer.classList.add('magical-glow');
    
    // Clone the image instead of moving it to avoid potential reference issues
    const imgClone = img.cloneNode(true);
    glowContainer.appendChild(imgClone);
    
    // Store original image to replace later
    processedImages.push({
      original: img,
      replacement: glowContainer
    });
    
    // Add click handler to make illustrations do a full spin
    imgClone.addEventListener('click', function() {
      // Don't set inline styles - use class toggle for better performance
      this.classList.add('spinning');
      
      // Reset after animation completes
      setTimeout(() => {
        this.classList.remove('spinning');
      }, 1000);
    });
  });
  
  // Replace images with enhanced versions in a single batch
  processedImages.forEach(item => {
    if (item.original.parentNode) {
      item.original.parentNode.replaceChild(item.replacement, item.original);
    }
  });
}

/**
 * Initialize back-to-top button
 */
function initBackToTopButton() {
  const backToTopBtn = document.getElementById('floo-powder-btn');
  if (!backToTopBtn) return;
  
  // Cache DOM references and values
  let ticking = false;
  let scrollY = window.scrollY;
  let isButtonVisible = false;
  const threshold = window.innerHeight; // Cache this value
  
  // Add will-change hint for better animation performance
  backToTopBtn.style.willChange = 'opacity, transform';
  
  function updateButtonVisibility() {
    // Only update DOM if visibility changes
    const shouldBeVisible = scrollY > threshold;
    
    if (shouldBeVisible !== isButtonVisible) {
      isButtonVisible = shouldBeVisible;
      
      if (shouldBeVisible) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
    
    ticking = false;
  }
  
  // More aggressive throttling - update only every 100ms max
  let lastScrollHandled = 0;
  const scrollThreshold = 100; // ms
  
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    
    const now = Date.now();
    if (now - lastScrollHandled < scrollThreshold) {
      return; // Skip this scroll event entirely
    }
    
    lastScrollHandled = now;
    
    if (!ticking) {
      window.requestAnimationFrame(updateButtonVisibility);
      ticking = true;
    }
  }, { passive: true });
  
  // Scroll to top when clicked
  backToTopBtn.addEventListener('click', () => {
    // Using 'smooth' scroll behavior only if supported
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Fallback for browsers that don't support smooth scrolling
      window.scrollTo(0, 0);
    }
  });
  
  // Clean up event handlers when page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // Force update when page becomes hidden to avoid unnecessary processing
      ticking = false;
    }
  });
}

/**
 * Initialize spell effects
 * Adds audio and visual effects to spell text - optimized for performance
 */
function initSpellEffects() {
  // Create audio elements for spell sounds - use lazy loading
  const spellSoundsMap = {
    'CRASH!': 'sounds/crash.mp3',
    'sproing': 'sounds/sproing.mp3',
    'plink': 'sounds/plink.mp3'
  };
  
  // We'll create audio elements only when needed
  const audioCache = new Map();
  
  // Function to get or create audio element
  function getAudio(name) {
    if (audioCache.has(name)) {
      return audioCache.get(name);
    }
    
    const src = spellSoundsMap[name];
    if (!src) return null;
    
    const audio = new Audio();
    audio.src = src;
    audioCache.set(name, audio);
    return audio;
  }
  
  // Add magical hover effect to SFX text - use DocumentFragment for better performance
  const sfxElements = document.querySelectorAll('.sfx');
  
  // Use a debounced approach for mouseover events
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  
  // Create a single fragment to append all wand icons at once
  const fragment = document.createDocumentFragment();
  
  sfxElements.forEach(sfx => {
    const originalText = sfx.textContent;
    sfx.innerHTML = `<span class="magical-text">${originalText}</span>`;
    
    // Add magic wand icon
    const wandIcon = document.createElement('span');
    wandIcon.classList.add('wand-icon');
    wandIcon.innerHTML = '✨';
    sfx.appendChild(wandIcon);
    
    // Create pool of trail elements for reuse instead of creating/removing each time
    const trailPool = Array.from({ length: 3 }, () => {
      const trail = document.createElement('div');
      trail.classList.add('spell-trail');
      trail.style.display = 'none'; // Hide initially
      sfx.appendChild(trail);
      return trail;
    });
    
    let trailIndex = 0;
    
    // Add debounced spell trail animation
    sfx.addEventListener('mouseover', debounce(() => {
      // Get next trail from pool
      const trail = trailPool[trailIndex];
      trailIndex = (trailIndex + 1) % trailPool.length;
      
      // Position and show the trail
      trail.style.display = 'block';
      trail.style.left = `${Math.random() * 100}%`;
      trail.style.top = `${Math.random() * 100}%`;
      
      // Remove animation classes and reflow to reset animation
      trail.classList.remove('animate-trail');
      void trail.offsetWidth; // Trigger reflow
      trail.classList.add('animate-trail');
      
      // Hide after animation completes (not remove - reuse instead)
      setTimeout(() => {
        trail.style.display = 'none';
        trail.classList.remove('animate-trail');
      }, 2000);
    }, 100));
  });
  
  // Add floating letters effect to chapter headings
  const chapterTitles = document.querySelectorAll('.chapter h2');
  
  // Process titles in batches to prevent UI freezing
  function processChapterTitles(titles, startIndex, batchSize) {
    const endIndex = Math.min(startIndex + batchSize, titles.length);
    
    for (let i = startIndex; i < endIndex; i++) {
      const title = titles[i];
      const text = title.textContent;
      const fragment = document.createDocumentFragment();
      
      // Wrap each letter in a span for animation - avoid string concatenation
      for (let j = 0; j < text.length; j++) {
        if (text[j] === ' ') {
          fragment.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.className = 'floating-letter';
          span.style.setProperty('--delay', `${j * 0.05}s`);
          span.textContent = text[j];
          fragment.appendChild(span);
        }
      }
      
      // Use single DOM update
      title.innerHTML = '';
      title.appendChild(fragment);
    }
    
    // Process next batch if needed
    if (endIndex < titles.length) {
      setTimeout(() => {
        processChapterTitles(titles, endIndex, batchSize);
      }, 0);
    }
  }
  
  // Start batch processing
  if (chapterTitles.length > 0) {
    processChapterTitles(chapterTitles, 0, 2);
  }
  
  // Observer for playing sounds on SFX elements
  const sfxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sfxName = entry.target.textContent;
        const audio = getAudio(sfxName);
        if (audio) {
          // Clone audio to allow for overlapping sounds
          audio.cloneNode(true).play().catch(() => {
            // Silent catch for browsers that block autoplay
          });
        }
      }
    });
  }, { threshold: 0.8 });
  
  // Observe SFX elements
  sfxElements.forEach(sfx => {
    sfxObserver.observe(sfx);
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
  
  // Get all paragraphs and convert to array for batch processing
  const paragraphsArray = Array.from(document.querySelectorAll('p'));
  const batchSize = 10;
  
  // Cache selectors for better performance
  const specialClassSelectors = '.dialogue, .magic-object, .clock-reference, .magic-spell, .character-name, .thought';
  
  // Process paragraphs to enhance in batches
  function processParagraphs(startIndex) {
    const endIndex = Math.min(startIndex + batchSize, paragraphsArray.length);
    
    for (let i = startIndex; i < endIndex; i++) {
      const paragraph = paragraphsArray[i];
      
      // Step 1: Reset specific paragraphs that need to be kept normal
      if (hasAnyPhrase(paragraph.textContent, paragraphsToReset)) {
        paragraph.classList.remove('emotional', 'climax-moment');
        // Also remove any styling from spans inside
        const spans = paragraph.querySelectorAll(specialClassSelectors);
        spans.forEach(span => {
          const text = span.textContent;
          const textNode = document.createTextNode(text);
          span.parentNode.replaceChild(textNode, span);
        });
        continue; // Skip further processing for this paragraph
      }
      
      // Step 2: Create a temporary div for manipulations
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = paragraph.innerHTML;
      
      // Step 3: Add strategic styling
      
      // Dialogues - strategic selection with optimized RegExp checking
      const keyDialogues = [
        "Honestly, Ronin, if you blast your socks through the floorboards one more time",
        "Mum! Where's my Cleansweep Seven manual",
        "I don't know!",
        "You borrowed it? Borrowed it?",
        "I just wanted to see if it would point to Hogwarts for me",
        "Try… try Reparo?",
        "All's well that ends well!",
        "Ow! Get off!",
        "Suppose you're not completely hopeless"
      ];
      
      tempDiv.innerHTML = tempDiv.innerHTML.replace(/"([^"<>]+)"/g, (match, content) => {
        if (keyDialogues.some(dialogue => content.includes(dialogue))) {
          return `<span class="dialogue">${match}</span>`;
        }
        return match;
      });
      
      // Clock references - strategic highlighting
      const keyClockMoments = [
        "clock hand went haywire",
        "detached itself completely from the clock face",
        "hand was gone",
        "the Weasley family clock",
        "hand settled firmly onto its peg",
        "Billius looked up at the clock"
      ];
      
      tempDiv.innerHTML = tempDiv.innerHTML.replace(/\b(clock('s)? hand|clock face|golden hand)\b/gi, (match) => {
        if (keyClockMoments.some(moment => tempDiv.textContent.includes(moment))) {
          return `<span class="clock-reference">${match}</span>`;
        }
        return match;
      });
      
      // Magic spells - using optimized replaceTextWithSpans
      replaceTextWithSpans(tempDiv, /\b(Accio|Reparo|Finite)\b/g, 'magic-spell');
      
      // Character highlighting
      const keyCharacterMoments = [
        "Ronin's hand was gone",
        "panic flooded Billius",
        "Billius tapped Ronin's hand firmly",
        "Ronin stared. His ears started to turn red",
        "Billius swallowed hard",
        "the hand settled firmly",
        "Billius began to smile"
      ];
      
      tempDiv.innerHTML = tempDiv.innerHTML.replace(/\b(Billius|Ronin)\b/g, (match) => {
        if (keyCharacterMoments.some(moment => tempDiv.textContent.includes(moment))) {
          return `<span class="character-name">${match}</span>`;
        }
        return match;
      });
      
      // Update original paragraph
      paragraph.innerHTML = tempDiv.innerHTML;
      
      // Step 4: Add paragraph-level styling based on content
      if (hasAnyPhrase(paragraph.textContent, [
          "panic flooded Billius",
          "Billius winced",
          "A wave of relief flooded the two brothers",
          "Billius had a very bad feeling"
        ])) {
        paragraph.classList.add('emotional');
      }
      
      // Climax moments
      if (hasAnyPhrase(paragraph.textContent, [
          "the hand settled firmly onto its peg",
          "Ronin's hand was gone",
          "Billius tapped Ronin's hand firmly",
          "With an enraged shriek, the gnome launched itself",
          "That was Ronin's chance"
        ])) {
        paragraph.classList.add('climax-moment');
      }
    }
    
    // Process next batch if needed
    if (endIndex < paragraphsArray.length) {
      setTimeout(() => processParagraphs(endIndex), 0);
    } else {
      // After all paragraphs processed, add scene breaks
      setTimeout(addSceneBreaks, 0);
    }
  }
  
  // Add scene breaks for key story transitions
  function addSceneBreaks() {
    const chapterBreaks = document.querySelectorAll('.chapter-content');
    
    chapterBreaks.forEach(chapter => {
      // Add visual breaks at pivotal moments
      const keyPhrases = [
        "Ronin's hand wasn't just missing; it was lost.",
        "No one had seen.",
        "just had to put it back, and everything would return to normal."
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
    
    // Final step - make spell elements interactive
    initSpellInteractions();
  }
  
  // Initialize interactive spell elements
  function initSpellInteractions() {
    document.querySelectorAll('.magic-spell').forEach(spell => {
      spell.addEventListener('click', () => {
        // Create and reuse spell trail element
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
        
        // Animate with Web Animations API for better performance
        const animation = spellTrail.animate([
          { opacity: 0.7, transform: 'scale(0.1)' },
          { opacity: 0, transform: 'scale(3)' }
        ], {
          duration: 1000,
          easing: 'ease-out'
        });
        
        animation.onfinish = () => {
          spellTrail.remove();
        };
      });
    });
  }
  
  // Start the batch processing
  processParagraphs(0);
}

/**
 * Helper function to safely replace text with spans in HTML
 * Optimized version with better memory management and performance
 * 
 * @param {Element} element - The DOM element to process
 * @param {RegExp} regex - The regex pattern to match
 * @param {string} className - The class name to add to the spans
 * @param {boolean} addEmoji - Whether to add an emoji after the element
 */
function replaceTextWithSpans(element, regex, className, addEmoji = false) {
  // Create a document fragment to minimize DOM operations
  const finalFragment = document.createDocumentFragment();
  const specialClasses = ['dialogue', 'magic-object', 'clock-reference', 'magic-spell', 'character-name', 'floating-letter', 'magical-text'];
  
  // Create a function for the check to avoid repeated calls
  function isSpecialElement(el) {
    if (!el || !el.classList) return false;
    
    // Check direct class
    for (let i = 0; i < specialClasses.length; i++) {
      if (el.classList.contains(specialClasses[i])) {
        return true;
      }
    }
    
    // Check ancestors (limiting depth to improve performance)
    let parent = el.parentElement;
    let depth = 0;
    const maxDepth = 3; // Limit ancestor checks to 3 levels up
    
    while (parent && depth < maxDepth) {
      for (let i = 0; i < specialClasses.length; i++) {
        if (parent.classList && parent.classList.contains(specialClasses[i])) {
          return true;
        }
      }
      parent = parent.parentElement;
      depth++;
    }
    
    return false;
  }
  
  // Process nodes using TreeWalker for better performance
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip empty text nodes and nodes in special elements
        return (node.nodeValue.trim() && !isSpecialElement(node.parentElement))
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    },
    false
  );
  
  const nodesToReplace = [];
  let currentNode;
  
  // Collect nodes to replace (faster than modifying during traversal)
  while (currentNode = walker.nextNode()) {
    nodesToReplace.push(currentNode);
  }
  
  // Process nodes in batches to reduce layout thrashing
  const batchSize = 5;
  for (let i = 0; i < nodesToReplace.length; i += batchSize) {
    const batch = nodesToReplace.slice(i, i + batchSize);
    
    batch.forEach(node => {
      const text = node.nodeValue;
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;
      
      // Reset lastIndex for the regex
      regex.lastIndex = 0;
      
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
        
        // Handle non-global regexes
        if (!regex.global) break;
      }
      
      // Add remaining text
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }
      
      // Replace the original node with the fragment
      if (node.parentNode) {
        node.parentNode.replaceChild(fragment, node);
      }
    });
    
    // Allow browser to paint between batches if needed
    if (i + batchSize < nodesToReplace.length && nodesToReplace.length > 50) {
      setTimeout(() => {}, 0);
    }
  }
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