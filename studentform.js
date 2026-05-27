const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("password").value
  };

  await fetch("https://script.google.com/macros/s/AKfycbyInGOI9DrR869idf_NyKfM3Czj4xcG3m4rQ_yKreqWRvwBXBRbLFJXOWG59uWqg2Vrpw/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  alert("Form Submitted!");
});