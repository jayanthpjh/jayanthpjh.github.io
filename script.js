const roles = [
  "Senior Data Engineer",
  "Databricks & Spark Specialist",
  "Cloud Data Architect",
  "Streaming & Big Data Expert"
];

let roleIndex = 0;
let charIndex = 0;
const typingElement = document.querySelector(".typing");

function typeRole() {
  if (charIndex < roles[roleIndex].length) {
    typingElement.textContent += roles[roleIndex][charIndex++];
    setTimeout(typeRole, 100);
  } else {
    setTimeout(eraseRole, 2000);
  }
}

function eraseRole() {
  if (charIndex > 0) {
    typingElement.textContent = roles[roleIndex].substring(0, --charIndex);
    setTimeout(eraseRole, 50);
  } else {
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeRole, 500);
  }
}

typeRole();
