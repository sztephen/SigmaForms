// Array to store questions
let questions = [];

// Check if there are questions in the URL
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('questions')) {
        const encodedQuestions = params.get('questions');
        questions = JSON.parse(decodeURIComponent(atob(encodedQuestions)));
        renderForm();
        document.getElementById('form-section').style.display = 'block';
        document.getElementById('form-creator').style.display = 'none';
        document.getElementById('generate-link').style.display = 'none';
    }
};

// Add question to the array
document.getElementById('add-question').addEventListener('click', function() {
    const questionInput = document.getElementById('question-input');
    const questionText = questionInput.value.trim();
    if (questionText !== "") {
        questions.push(questionText);
        questionInput.value = '';
        displayQuestions();
    }
});

// Display the list of questions
function displayQuestions() {
    const list = document.getElementById('question-list');
    if (!list) {
        const ul = document.createElement('ul');
        ul.id = 'question-list';
        document.getElementById('form-creator').appendChild(ul);
    }
    const ul = document.getElementById('question-list');
    ul.innerHTML = '';
    questions.forEach((question, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${question}`;
        ul.appendChild(li);
    });
}

// Generate shareable link
document.getElementById('generate-link').addEventListener('click', function() {
    if (questions.length === 0) {
        alert('Please add at least one question.');
        return;
    }
    const encodedQuestions = btoa(encodeURIComponent(JSON.stringify(questions)));
    const url = `${window.location.origin}${window.location.pathname}?questions=${encodedQuestions}`;
    prompt('Share this link:', url);
});

// Function to render the form based on questions
function renderForm() {
    const form = document.getElementById('dynamic-form');
    form.innerHTML = '';
    questions.forEach((question, index) => {
        const label = document.createElement('label');
        label.textContent = question;
        const input = document.createElement('input');
        input.type = 'text';
        input.name = `answer${index}`;
        form.appendChild(label);
        form.appendChild(input);
    });
}

// Handle form submission and store responses
document.getElementById('submit-form').addEventListener('click', function() {
    const form = document.getElementById('dynamic-form');
    const formData = new FormData(form);
    let responses = {};
    formData.forEach((value, key) => {
        responses[key] = value;
    });
    // Store responses in localStorage
    let storedResponses = JSON.parse(localStorage.getItem('formResponses')) || [];
    storedResponses.push(responses);
    localStorage.setItem('formResponses', JSON.stringify(storedResponses));
    alert('Your responses have been submitted!');
    form.reset();
});

// Password-protected results viewing
document.getElementById('results-button').addEventListener('click', function() {
    const password = prompt('Enter the password to view results:');
    if (password === 'yourpassword') { // Replace 'yourpassword' with your desired password
        displayResults();
    } else {
        alert('Incorrect password.');
    }
});

// Function to display results
function displayResults() {
    const resultsDiv = document.getElementById('results');
    const storedResponses = JSON.parse(localStorage.getItem('formResponses')) || [];
    if (storedResponses.length === 0) {
        resultsDiv.innerHTML = '<p>No responses yet.</p>';
        return;
    }
    let resultsHTML = '<h2>Responses:</h2>';
    storedResponses.forEach((response, index) => {
        resultsHTML += `<h3>Response ${index + 1}:</h3>`;
        Object.keys(response).forEach(key => {
            const questionIndex = key.replace('answer', '');
            resultsHTML += `<p><strong>${questions[questionIndex]}:</strong> ${response[key]}</p>`;
        });
    });
    resultsDiv.innerHTML = resultsHTML;
}
