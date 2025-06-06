console.log('DOM loaded');
console.log('Theme switch element:', document.getElementById('theme-switch'));
console.log('Yes button element:', document.getElementById('btn-yes'));
console.log('No button element:', document.getElementById('btn-no'));

document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;
    
    // Check if user preference is stored
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeSwitch.checked = true;
    }
    
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Screen navigation
    const screens = document.querySelectorAll('.screen');
    let currentScreen = 1;
    
    function showScreen(screenNumber) {
        screens.forEach(screen => {
            screen.removeAttribute('active');
        });
        document.getElementById(`screen-${screenNumber}`).setAttribute('active', '');
        currentScreen = screenNumber;
        
        // Reset scroll position on screen change
        window.scrollTo(0, 0);
    }
    
    // Button Yes Event
    const btnYes = document.getElementById('btn-yes');
    if (btnYes) {
        btnYes.addEventListener('click', function() {
            showScreen(2);
        });
    }
    
    // Button No Event - Move away from cursor
    const btnNo = document.getElementById('btn-no');
    if (btnNo) {
        btnNo.addEventListener('mouseover', function(e) {
            const randomX = Math.random() * 200 - 100;
            const randomY = Math.random() * 200 - 100;
            
            // Make sure button stays within view
            const rect = btnNo.getBoundingClientRect();
            const viewWidth = window.innerWidth;
            const viewHeight = window.innerHeight;
            
            let newX = rect.left + randomX;
            let newY = rect.top + randomY;
            
            // Boundary check
            if (newX < 0) newX = 20;
            if (newX > viewWidth - rect.width) newX = viewWidth - rect.width - 20;
            if (newY < 0) newY = 20;
            if (newY > viewHeight - rect.height) newY = viewHeight - rect.height - 20;
            
            btnNo.style.position = 'fixed';
            btnNo.style.left = newX + 'px';
            btnNo.style.top = newY + 'px';
        });
    }
    
    // Continue buttons
    document.getElementById('continue-to-place').addEventListener('click', function() {
        showScreen(3);
    });
    
    document.getElementById('continue-to-time').addEventListener('click', function() {
        const selectedPlace = document.querySelector('.place-options .selected');
        if (selectedPlace) {
            showScreen(4);
        } else {
            alert('Please select a place first!');
        }
    });
    
    document.getElementById('continue-to-food').addEventListener('click', function() {
        const dateInput = document.getElementById('date-input');
        const timeInput = document.getElementById('time-input');
        
        if (dateInput.value && timeInput.value) {
            showScreen(5);
        } else {
            alert('Please select a date and time!');
        }
    });
    
    document.getElementById('continue-to-drinks').addEventListener('click', function() {
        const selectedFood = document.querySelector('.food-options .selected');
        if (selectedFood) {
            showScreen(6);
        } else {
            alert('Please select some food!');
        }
    });
    
    document.getElementById('continue-to-final').addEventListener('click', function() {
        const selectedDrink = document.querySelector('.drink-options .selected');
        if (selectedDrink) {
            showScreen(7);
        } else {
            alert('Please select a drink!');
        }
    });
    
    // Option selection
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            // Check if multi-select is allowed for this group
            const parent = this.parentElement;
            
            // For single selection, clear other selections first
            const siblings = parent.querySelectorAll('.option');
            siblings.forEach(sib => sib.classList.remove('selected'));
            
            // Toggle this option
            this.classList.add('selected');
            
            // Show confirmation text
            const confirmationText = parent.parentElement.querySelector('.confirmation-text');
            if (confirmationText) {
                confirmationText.classList.add('visible');
            }
        });
    });
    
    // Date time picker
    const dateInput = document.getElementById('date-input');
    const timeInput = document.getElementById('time-input');
    const addTimeBtn = document.getElementById('add-time');
    const removeTimeBtn = document.getElementById('remove-time');
    
    // Set minimum date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    
    // Add new time option
    addTimeBtn.addEventListener('click', function() {
        const dateTimePicker = document.querySelector('.date-time-picker');
        const newTimePicker = document.createElement('div');
        newTimePicker.className = 'date-time-picker';
        newTimePicker.innerHTML = `
            <div class="date-picker">
                <label>Date</label>
                <input type="date" min="${yyyy}-${mm}-${dd}">
            </div>
            <div class="time-picker">
                <label>Time</label>
                <input type="time">
            </div>
            <div class="time-actions">
                <button class="action-btn remove-time">✕</button>
            </div>
        `;
        
        dateTimePicker.parentElement.insertBefore(newTimePicker, addTimeBtn);
        
        // Add event listener to new remove button
        newTimePicker.querySelector('.remove-time').addEventListener('click', function() {
            newTimePicker.remove();
        });
    });
    
    // Remove time option
    removeTimeBtn.addEventListener('click', function() {
        dateInput.value = '';
        timeInput.value = '';
    });
    
    // Show confirmation text when date and time are selected
    function checkDateTime() {
        const confirmationText = document.querySelector('#screen-4 .confirmation-text');
        if (dateInput.value && timeInput.value) {
            confirmationText.classList.add('visible');
        } else {
            confirmationText.classList.remove('visible');
        }
    }
    
    dateInput.addEventListener('change', checkDateTime);
    timeInput.addEventListener('change', checkDateTime);
    
    // Custom cursor effect
    const container = document.querySelector('.container');
    
    document.addEventListener('mousemove', function(e) {
        if (currentScreen === 7) {
            // Create heart particles on mouse move in the final screen
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.className = 'heart-particle';
            heart.style.left = e.pageX + 'px';
            heart.style.top = e.pageY + 'px';
            heart.style.position = 'absolute';
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';
            heart.style.animation = 'fadeUp 1s forwards';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 1000);
        }
    });
    
    // Add CSS for heart animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeUp {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-50px) rotate(20deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
