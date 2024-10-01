// Array to store questions
let questions = [];

// Add question to the array and display the form
document.getElementById('add-question').addEventListener('click', function() {
    const questionInput = document.getElementById('question-input');
    const questionText = questionInput.value.trim();
    if (questionText !== "") {
        questions.push(questionText);
        questionInput.value = '';
        renderForm();
    }
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
        form.appendChild(document.createElement('br'));
    });
}

// Handle form submission and display results
document.getElementById('submit-form').addEventListener('click', function() {
    const form = document.getElementById('dynamic-form');
    const formData = new FormData(form);
    let results = '<h2>Results:</h2>';
    formData.forEach((value, key) => {
        results += `<p><strong>${questions[key.slice(-1)]}:</strong> ${value}</p>`;
    });
    document.getElementById('results').innerHTML = results;
});
