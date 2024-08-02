function submitForm() {
    // Gather form data
    let formData = {
        firstName: document.querySelector('[name="firstName"]').value,
        lastName: document.querySelector('[name="lastName"]').value,
        email: document.querySelector('[name="email"]').value,
        phone: document.querySelector('[name="phone"]').value,
        subject: document.querySelector('[name="subject"]').value,
        message: document.querySelector('[name="message"]').value
    };

// Send the data to the backend
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        
        // Replace form content with a confirmation message
        let formContent = document.getElementById('formContent');
        formContent.innerHTML = `
            <p style="color:white">Thank you! Your request has been submitted.</p>
            <button class="submit-btn" onclick="closeContactForm()">Close</button>
        `;
    })
    .catch((error) => {
        
        // Replace form content with an error message
        let formContent = document.getElementById('formContent');
        formContent.innerHTML = `
            <p style="color:white">There was an error. Please try again later.</p>
            <button class="submit-btn" onclick="closeContactForm()">Close</button>
        `;
    });
}




    // Functions to control the contact form
    function showContactForm() {
        document.getElementById('contactModal').style.display = 'block';
    }

    function closeContactForm() {
        document.getElementById('contactModal').style.display = 'none';
    }

