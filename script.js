document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const submitBtn = document.getElementById('submitBtn');
    const clickCounter = document.getElementById('clickCounter');
    const message = document.getElementById('message');

    let shareCount = 0;
    const maxShares = 5;

    // Check if form was already submitted
    if (localStorage.getItem('formSubmitted') === 'true') {
        disableForm();
        message.textContent = '🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!';
    }

    // WhatsApp Share Button
    whatsappBtn.addEventListener('click', () => {
        if (shareCount < maxShares) {
            shareCount++;
            clickCounter.textContent = `Click count: ${shareCount}/${maxShares}`;
            const message = encodeURIComponent('Hey Buddy, Join Tech For Girls Community!');
            window.open(`https://wa.me/?text=${message}`, '_blank');
            if (shareCount === maxShares) {
                clickCounter.textContent = 'Sharing complete. Please continue.';
                whatsappBtn.disabled = true;
            }
        }
    });

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (shareCount < maxShares) {
            message.textContent = 'Please complete 5 WhatsApp shares before submitting.';
            return;
        }

        const formData = new FormData(form);
        const screenshotFile = formData.get('screenshot');
        let screenshotBase64 = '';
        if (screenshotFile) {
            screenshotBase64 = await fileToBase64(screenshotFile);
        }

        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            college: formData.get('college'),
            screenshot: screenshotBase64
        };

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbzc8aNJEFnm5YzsmVyuf-lP-FhxWB9i1IsiRB2NMJjM6YHUdrsdeualVYX2-N8AKZBv/exec', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            if (response.ok) {
                message.textContent = '🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!';
                localStorage.setItem('formSubmitted', 'true');
                disableForm();
            } else {
                message.textContent = `Error: ${result.message || 'Unknown error'}`;
            }
        } catch (error) {
            message.textContent = `Error submitting form: ${error.message}`;
        }
    });

    // Convert file to Base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    // Disable form after submission
    function disableForm() {
        form.querySelectorAll('input, select, button').forEach(element => {
            element.disabled = true;
        });
        whatsappBtn.disabled = true;
    }
});
