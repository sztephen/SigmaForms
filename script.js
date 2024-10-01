// Array to store questions
let questions = [];

// Form ID to differentiate forms (if multiple forms are created in future)
const formId = 'mainForm'; // For simplicity, using a single form ID

// DOM Elements
const addQuestionBtn = document.getElementById('add-question');
const generateLinkBtn = document.getElementById('generate-link');
const openResultsBtn = document.getElementById('open-results');
const questionInput = document.getElementById('question-input');
const questionList = document.getElementById('question-list');
const formSection = document.getElementById('form-section');
const dynamicForm = document.getElementById('dynamic-form');
const submitFormBtn = document.getElementById('submit-form');
const resultsDiv = document.getElementById('results');

// Password for accessing results
const RESULTS_PASSWORD = 'sigmaforms';

// Check if the URL has 'questions' parameter
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('questions')) {
        const encodedQuestions = params.get('questions');
        try {
            questions = JSON.parse(decodeURIComponent(atob(encodedQuestions)));
            renderForm();
            formSection.style.display = 'block';
            formCreatorVisibility(false);
        } catch (error) {
            alert('Invalid form link.');
        }
    }
};

// Toggle visibility of form creator section
function formCreatorVisibility(visible) {
    document.getElementById('form-creator').style.display = visible ? 'block' : 'none';
    generateLinkBtn.style.display = visible ? 'block' : 'none';
}

// Add question to the list
addQuestionBtn.addEventListener('click', function() {
    const questionText = questionInput.value.trim();
    if (questionText !== "") {
        questions.push(questionText);
        questionInput.value = '';
        displayQuestions();
    }
});

// Display the list of questions
function displayQuestions() {
    questionList.innerHTML = '';
    questions.forEach((question, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${question}`;
        questionList.appendChild(li);
    });
}

// Generate shareable link
generateLinkBtn.addEventListener('click', function() {
    if (questions.length === 0) {
        alert('Please add at least one question.');
        return;
    }
    const encodedQuestions = btoa(encodeURIComponent(JSON.stringify(questions)));
    const url = `${window.location.origin}${window.location.pathname}?questions=${encodedQuestions}`;
    navigator.clipboard.writeText(url).then(() => {
        alert('Shareable link copied to clipboard!');
    }).catch(() => {
        prompt('Copy your shareable link:', url);
    });
});

// Render the form based on questions
function renderForm() {
    dynamicForm.innerHTML = '';
    questions.forEach((question, index) => {
        const label = document.createElement('label');
        label.textContent = question;
        const input = document.createElement('input');
        input.type = 'text';
        input.name = `answer${index}`;
        input.required = true;
        dynamicForm.appendChild(label);
        dynamicForm.appendChild(input);
    });
}

// Handle form submission
submitFormBtn.addEventListener('click', function(event) {
    event.preventDefault();
    const formData = new FormData(dynamicForm);
    let responses = {};
    formData.forEach((value, key) => {
        responses[key] = value.trim();
    });

    // Store responses in localStorage
    let storedResponses = JSON.parse(localStorage.getItem('formResponses')) || [];
    storedResponses.push(responses);
    localStorage.setItem('formResponses', JSON.stringify(storedResponses));

    alert('Your responses have been submitted!');
    dynamicForm.reset();
});

// Open results with password protection
openResultsBtn.addEventListener('click', function() {
    const password = prompt('Enter the password to view results:');
    if (password === RESULTS_PASSWORD) {
        displayResults();
    } else {
        alert('Incorrect password.');
    }
});

// Function to display results
function displayResults() {
    const storedResponses = JSON.parse(localStorage.getItem('formResponses')) || [];
    if (storedResponses.length === 0) {
        resultsDiv.innerHTML = '<p>No responses yet.</p>';
        return;
    }
    let resultsHTML = '<h2>Responses:</h2>';
    storedResponses.forEach((response, index) => {
        resultsHTML += `<div class="response">
                            <h3>Response ${index + 1}</h3>`;
        Object.keys(response).forEach(key => {
            const questionIndex = parseInt(key.replace('answer', ''));
            const question = questions[questionIndex] || 'Unknown Question';
            const answer = response[key] || 'No Answer';
            resultsHTML += `<p><strong>${question}:</strong> ${answer}</p>`;
        });
        resultsHTML += `</div>`;
    });
    resultsDiv.innerHTML = resultsHTML;
}
