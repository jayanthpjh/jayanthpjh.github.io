// Intersection Observer for Scroll Animations (More efficient than window.onscroll)
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(section => {
  observer.observe(section);
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  const isFlex = navLinks.style.display === 'flex';
  navLinks.style.display = isFlex ? 'none' : 'flex';
  
  // Basic mobile styling injection for toggle
  if (!isFlex) {
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.right = '0';
    navLinks.style.backgroundColor = '#112240';
    navLinks.style.flexDirection = 'column';
    navLinks.style.width = '100%';
    navLinks.style.padding = '20px';
  }
});
