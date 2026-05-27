// UI Slider Logic
const signUpBtn = document.getElementById('signUpBtn');
const signInBtn = document.getElementById('signInBtn');
const container = document.getElementById('container');

signUpBtn.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInBtn.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Sign Up Data Capture
const signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("up-name").value;
    const email = document.getElementById("up-email").value;
    const password = document.getElementById("up-password").value;
    const role = document.getElementById("up-role").value;

    console.log("Sign Up Attempt:", { name, email, role });
    // Firebase Auth code will go here soon!
});

// Sign In Data Capture
const signInForm = document.getElementById("signInForm");
signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("in-email").value;
    const password = document.getElementById("in-password").value;

    console.log("Sign In Attempt:", { email });
    // Firebase Auth code will go here soon!
});