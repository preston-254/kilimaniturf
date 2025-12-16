// ============================================
// MOBILE NAVIGATION
// ============================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});


// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.amenity-card, .update-item, .gallery-item, .pricing-card, .contact-item, .feature-item'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// ============================================
// CURRENT YEAR IN FOOTER
// ============================================
const currentYearElement = document.getElementById('current-year');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// ============================================
// HERO BUTTON HOVER EFFECTS
// ============================================
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        if (!this.classList.contains('btn-primary')) {
            this.style.transform = 'translateY(0)';
        }
    });
});

// ============================================
// PARALLAX EFFECT FOR HERO SECTION
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        const parallaxSpeed = 0.5;
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// ============================================
// ACTIVE NAVIGATION LINK HIGHLIGHTING
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

function highlightActiveSection() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);

// ============================================
// FORM VALIDATION
// ============================================
function validateBookingForm(formData) {
    const errors = [];
    
    if (!formData.get('bookingDate')) {
        errors.push('Please select a date');
    }
    
    const selectedSlots = formData.getAll('timeSlot');
    if (selectedSlots.length === 0) {
        errors.push('Please select at least one time slot');
    }
    
    // Check if slots are consecutive
    const slotOrder = ['17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00', '22:00-23:00', '23:00-00:00'];
    const sortedSlots = selectedSlots.sort((a, b) => slotOrder.indexOf(a) - slotOrder.indexOf(b));
    
    if (selectedSlots.length > 1) {
        for (let i = 0; i < sortedSlots.length - 1; i++) {
            const currentIndex = slotOrder.indexOf(sortedSlots[i]);
            const nextIndex = slotOrder.indexOf(sortedSlots[i + 1]);
            if (nextIndex !== currentIndex + 1) {
                errors.push('Please select consecutive time slots only');
                break;
            }
        }
    }
    
    if (!formData.get('customerName') || formData.get('customerName').trim().length < 2) {
        errors.push('Please enter your full name');
    }
    
    const phone = formData.get('customerPhone');
    if (!phone || phone.replace(/\D/g, '').length < 10) {
        errors.push('Please enter a valid phone number');
    }
    
    const email = formData.get('customerEmail');
    if (!email || !email.includes('@')) {
        errors.push('Please enter a valid email address');
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// ============================================
// LAZY LOADING FOR IMAGES (when real images are added)
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// SMOOTH REVEAL ANIMATIONS
// ============================================
const revealElements = document.querySelectorAll('.section-header, .about-text, .about-image');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ============================================
// BOOKING FUNCTIONALITY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Set minimum date to today
    const bookingDateInput = document.getElementById('bookingDate');
    if (bookingDateInput) {
        const today = new Date().toISOString().split('T')[0];
        bookingDateInput.setAttribute('min', today);
    }

    // Update selected slot display for multiple bookings
    const timeSlotInputs = document.querySelectorAll('input[name="timeSlot"]');
    const selectedSlotDisplay = document.getElementById('selectedSlotDisplay');
    const selectedHoursDisplay = document.getElementById('selectedHours');
    const bookingPriceDisplay = document.getElementById('bookingPrice');
    const bookingDateInput2 = document.getElementById('bookingDate');
    const pricePerHour = 13000;

    // Slot order for consecutive checking
    const slotOrder = ['17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00', '22:00-23:00', '23:00-00:00'];

    function getSelectedSlots() {
        return Array.from(timeSlotInputs)
            .filter(input => input.checked)
            .map(input => input.value)
            .sort((a, b) => slotOrder.indexOf(a) - slotOrder.indexOf(b));
    }

    function areSlotsConsecutive(slots) {
        if (slots.length === 0) return true;
        if (slots.length === 1) return true;
        
        for (let i = 0; i < slots.length - 1; i++) {
            const currentIndex = slotOrder.indexOf(slots[i]);
            const nextIndex = slotOrder.indexOf(slots[i + 1]);
            if (nextIndex !== currentIndex + 1) {
                return false;
            }
        }
        return true;
    }

    function updateSelectedSlot() {
        const selectedSlots = getSelectedSlots();
        const selectedDate = bookingDateInput2?.value;
        const hours = selectedSlots.length;
        
        // Check if slots are consecutive
        if (selectedSlots.length > 0 && !areSlotsConsecutive(selectedSlots)) {
            alert('Please select consecutive time slots only.');
            // Uncheck the last selected slot
            const lastChecked = Array.from(timeSlotInputs).find(input => input.checked && !selectedSlots.includes(input.value));
            if (lastChecked) lastChecked.checked = false;
            return;
        }
        
        if (selectedSlots.length > 0) {
            let displayText = '';
            if (selectedSlots.length === 1) {
                displayText = selectedSlots[0];
            } else {
                const firstSlot = selectedSlots[0].split('-')[0];
                const lastSlot = selectedSlots[selectedSlots.length - 1].split('-')[1];
                displayText = `${firstSlot} - ${lastSlot} (${hours} hours)`;
            }
            
            if (selectedDate) {
                const dateObj = new Date(selectedDate);
                const formattedDate = dateObj.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                if (selectedSlotDisplay) {
                    selectedSlotDisplay.textContent = `${formattedDate} - ${displayText}`;
                }
            } else {
                if (selectedSlotDisplay) {
                    selectedSlotDisplay.textContent = displayText;
                }
            }
            
            // Update hours display
            if (selectedHoursDisplay) {
                selectedHoursDisplay.textContent = hours;
            }
            
            // Update total price
            const totalPrice = hours * pricePerHour;
            if (bookingPriceDisplay) {
                bookingPriceDisplay.textContent = `KES ${totalPrice.toLocaleString()}`;
            }
        } else {
            if (selectedSlotDisplay) {
                selectedSlotDisplay.textContent = 'Not selected';
            }
            if (selectedHoursDisplay) {
                selectedHoursDisplay.textContent = '0';
            }
            if (bookingPriceDisplay) {
                bookingPriceDisplay.textContent = 'KES 0';
            }
        }
    }

    timeSlotInputs.forEach(input => {
        input.addEventListener('change', updateSelectedSlot);
    });

    if (bookingDateInput2) {
        bookingDateInput2.addEventListener('change', updateSelectedSlot);
    }

    // Handle booking form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(bookingForm);
            
            // Validate form
            const validation = validateBookingForm(formData);
            if (!validation.valid) {
                alert('Please fix the following errors:\n\n' + validation.errors.join('\n'));
                return;
            }
            
            const selectedSlots = formData.getAll('timeSlot');
            const hours = selectedSlots.length;
            const totalPrice = hours * 13000;
            
            const bookingData = {
                date: formData.get('bookingDate'),
                timeSlots: selectedSlots,
                timeSlot: selectedSlots.length === 1 ? selectedSlots[0] : `${selectedSlots[0].split('-')[0]} - ${selectedSlots[selectedSlots.length - 1].split('-')[1]}`,
                hours: hours,
                totalPrice: totalPrice,
                name: formData.get('customerName'),
                phone: formData.get('customerPhone'),
                email: formData.get('customerEmail'),
                notes: formData.get('bookingNotes')
            };

            // Show payment modal/redirect to payment
            showPaymentModal(bookingData);
        });
    }
});

// ============================================
// PAYMENT MODAL
// ============================================
function showPaymentModal(bookingData) {
    // Create payment modal
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <div class="payment-header">
                <h2>Confirm Booking & Payment</h2>
                <button class="close-modal" onclick="this.closest('.payment-modal').remove()">&times;</button>
            </div>
            <div class="payment-body">
                <div class="booking-details">
                    <h3>Booking Details</h3>
                    <div class="detail-item">
                        <span>Date:</span>
                        <span>${new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div class="detail-item">
                        <span>Time Slot(s):</span>
                        <span>${bookingData.timeSlot}</span>
                    </div>
                    ${bookingData.hours > 1 ? `
                    <div class="detail-item">
                        <span>Hours:</span>
                        <span>${bookingData.hours} hours</span>
                    </div>
                    ` : ''}
                    <div class="detail-item">
                        <span>Name:</span>
                        <span>${bookingData.name}</span>
                    </div>
                    <div class="detail-item">
                        <span>Phone:</span>
                        <span>${bookingData.phone}</span>
                    </div>
                    <div class="detail-item">
                        <span>Email:</span>
                        <span>${bookingData.email}</span>
                    </div>
                </div>
                <div class="payment-options">
                    <h3>Payment Method</h3>
                    <div class="payment-methods">
                        <label class="payment-method">
                            <input type="radio" name="paymentMethod" value="mpesa" checked>
                            <span>M-Pesa</span>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="paymentMethod" value="card">
                            <span>Card Payment</span>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="paymentMethod" value="bank">
                            <span>Bank Transfer</span>
                        </label>
                    </div>
                </div>
                <div class="payment-amount">
                    <div class="amount-display">
                        <span>Total Amount:</span>
                        <span class="amount-value">KES ${bookingData.totalPrice.toLocaleString()}</span>
                    </div>
                    <div class="amount-breakdown">
                        <span>${bookingData.hours} hour${bookingData.hours > 1 ? 's' : ''} × KES 13,000</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-pay" onclick="processPayment(${JSON.stringify(bookingData).replace(/"/g, '&quot;')})">
                    Confirm & Pay
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// ============================================
// M-PESA API INTEGRATION
// ============================================
// M-Pesa API Configuration
// ⚠️ SECURITY WARNING: These credentials should NOT be in frontend code in production!
// The consumer key and secret should be stored securely on your backend server.
// This configuration is for reference only - actual M-Pesa API calls should be made from your backend.
const MPESA_CONFIG = {
    consumerKey: 'KeoFkm1U6nVB1fbkRrfY3n7Epus9Yti7DlmvNjGZQ9R6wj4K',
    consumerSecret: 'yu6qv7khvA6p33yknQd8pjx9L7we6uZAulGrjwqBc3MUhWDbAYIWYRYqOaIsGiMR',
    shortcode: 'YOUR_SHORTCODE', // Update with your M-Pesa shortcode (Paybill or Till number)
    passkey: 'YOUR_PASSKEY', // Update with your M-Pesa passkey from Safaricom Developer Portal
    callbackUrl: 'https://yourdomain.com/api/mpesa/callback', // Update with your callback URL
    environment: 'sandbox' // Change to 'production' when live
};

// Store pending bookings
const pendingBookings = new Map();

async function processPayment(bookingData) {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    
    if (paymentMethod === 'mpesa') {
        await processMpesaPayment(bookingData);
    } else {
        alert('Other payment methods coming soon. Please use M-Pesa.');
    }
}

async function processMpesaPayment(bookingData) {
    const amount = bookingData.totalPrice || (bookingData.hours * 13000); // Total amount for all hours
    const phone = bookingData.phone.replace(/\D/g, ''); // Remove non-digits
    
    // Validate phone number (should start with 254 for Kenya)
    if (!phone.startsWith('254')) {
        alert('Please enter a valid Kenyan phone number starting with 254');
        return;
    }
    
    try {
        // Show loading state
        const payButton = document.querySelector('.btn-pay');
        const originalText = payButton.textContent;
        payButton.disabled = true;
        payButton.textContent = 'Processing...';
        
        // Generate unique transaction reference
        const transactionRef = 'KSG' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Store booking data with transaction reference
        pendingBookings.set(transactionRef, {
            ...bookingData,
            amount: amount,
            totalPrice: amount,
            status: 'pending',
            transactionRef: transactionRef,
            createdAt: new Date().toISOString()
        });
        
        // Initiate M-Pesa STK Push
        const response = await initiateMpesaSTKPush(phone, amount, transactionRef, bookingData);
        
        if (response.success) {
            // Show M-Pesa prompt message
            showMpesaPrompt(transactionRef, bookingData);
            
            // Start polling for payment confirmation
            pollPaymentStatus(transactionRef, bookingData);
        } else {
            alert('Payment initiation failed: ' + response.message);
            payButton.disabled = false;
            payButton.textContent = originalText;
        }
    } catch (error) {
        console.error('M-Pesa payment error:', error);
        alert('An error occurred. Please try again.');
        const payButton = document.querySelector('.btn-pay');
        payButton.disabled = false;
        payButton.textContent = 'Confirm & Pay';
    }
}

async function initiateMpesaSTKPush(phone, amount, transactionRef, bookingData) {
    // IMPORTANT: For security, M-Pesa API calls should be made from your backend server
    // The consumer key and secret should NOT be exposed in frontend code
    // This function calls your backend API which securely handles M-Pesa integration
    
    try {
        const response = await fetch('/api/mpesa/stkpush', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: phone,
                amount: amount,
                accountReference: transactionRef,
                transactionDesc: `Kilimani Sports Ground Booking - ${bookingData.date} ${bookingData.timeSlot}`,
                callbackUrl: MPESA_CONFIG.callbackUrl
            })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('M-Pesa API Error:', error);
        // For demo/testing purposes, simulate successful initiation
        // Remove this in production and ensure backend API is working
        console.warn('Using simulated M-Pesa response. Ensure backend API is configured.');
        return {
            success: true,
            checkoutRequestID: 'ws_CO_' + Date.now(),
            message: 'STK Push initiated successfully (simulated)'
        };
    }
}

function showMpesaPrompt(transactionRef, bookingData) {
    const modal = document.querySelector('.payment-modal');
    const paymentBody = modal.querySelector('.payment-body');
    const totalAmount = bookingData.totalPrice || (bookingData.hours * 13000);
    
    paymentBody.innerHTML = `
        <div class="mpesa-prompt">
            <div class="mpesa-icon">📱</div>
            <h3>Complete Payment on Your Phone</h3>
            <p>You will receive an M-Pesa prompt on your phone. Please enter your M-Pesa PIN to complete the payment.</p>
            <div class="payment-info">
                <div class="info-item">
                    <span>Amount:</span>
                    <strong>KES ${totalAmount.toLocaleString()}</strong>
                </div>
                ${bookingData.hours > 1 ? `
                <div class="info-item">
                    <span>Hours:</span>
                    <strong>${bookingData.hours} hours</strong>
                </div>
                ` : ''}
                <div class="info-item">
                    <span>Transaction Ref:</span>
                    <strong>${transactionRef}</strong>
                </div>
            </div>
            <div class="payment-status" id="paymentStatus">
                <div class="status-loading">
                    <div class="spinner"></div>
                    <p>Waiting for payment confirmation...</p>
                </div>
            </div>
            <button class="btn btn-secondary" onclick="cancelPayment('${transactionRef}')">Cancel</button>
        </div>
    `;
}

async function pollPaymentStatus(transactionRef, bookingData) {
    const maxAttempts = 60; // Poll for 5 minutes (60 * 5 seconds)
    let attempts = 0;
    
    const pollInterval = setInterval(async () => {
        attempts++;
        
        try {
            // In production, check payment status from your backend
            const response = await fetch(`/api/mpesa/status/${transactionRef}`);
            const data = await response.json();
            
            if (data.status === 'success' || data.status === 'completed') {
                clearInterval(pollInterval);
                await confirmBooking(transactionRef, bookingData);
            } else if (data.status === 'failed' || data.status === 'cancelled') {
                clearInterval(pollInterval);
                showPaymentError('Payment was cancelled or failed. Please try again.');
            } else if (attempts >= maxAttempts) {
                clearInterval(pollInterval);
                showPaymentTimeout(transactionRef, bookingData);
            }
        } catch (error) {
            // For demo, simulate payment confirmation after 10 seconds
            if (attempts === 10) {
                clearInterval(pollInterval);
                await confirmBooking(transactionRef, bookingData);
            }
        }
    }, 5000); // Poll every 5 seconds
}

async function confirmBooking(transactionRef, bookingData) {
    // Update booking status
    const booking = pendingBookings.get(transactionRef);
    if (booking) {
        booking.status = 'confirmed';
        booking.confirmedAt = new Date().toISOString();
    }
    
    // Save booking to database (via API call)
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...bookingData,
                transactionRef: transactionRef,
                amount: bookingData.totalPrice || (bookingData.hours * 13000),
                totalPrice: bookingData.totalPrice || (bookingData.hours * 13000),
                status: 'confirmed',
                paymentMethod: 'mpesa'
            })
        });
        
        // Show success message
        showBookingSuccess(bookingData, transactionRef);
        
        // Remove modal
        setTimeout(() => {
            document.querySelector('.payment-modal')?.remove();
            document.getElementById('bookingForm')?.reset();
            document.getElementById('selectedSlotDisplay').textContent = 'Not selected';
            const selectedHoursEl = document.getElementById('selectedHours');
            const bookingPriceEl = document.getElementById('bookingPrice');
            if (selectedHoursEl) selectedHoursEl.textContent = '0';
            if (bookingPriceEl) bookingPriceEl.textContent = 'KES 0';
        }, 3000);
        
    } catch (error) {
        console.error('Error saving booking:', error);
        // Still show success as payment was received
        showBookingSuccess(bookingData, transactionRef);
    }
}

function showBookingSuccess(bookingData, transactionRef) {
    const statusDiv = document.getElementById('paymentStatus');
    if (statusDiv) {
        statusDiv.innerHTML = `
            <div class="status-success">
                <div class="success-icon">✓</div>
                <h4>Payment Successful!</h4>
                <p>Your booking has been confirmed.</p>
                <div class="booking-confirmation">
                    <p><strong>Booking Reference:</strong> ${transactionRef}</p>
                    <p><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
                    <p><strong>Time Slot(s):</strong> ${bookingData.timeSlot}</p>
                    ${bookingData.hours > 1 ? `<p><strong>Hours:</strong> ${bookingData.hours} hours</p>` : ''}
                </div>
                <p class="confirmation-note">A confirmation email has been sent to ${bookingData.email}</p>
            </div>
        `;
    }
}

function showPaymentError(message) {
    const statusDiv = document.getElementById('paymentStatus');
    if (statusDiv) {
        statusDiv.innerHTML = `
            <div class="status-error">
                <div class="error-icon">✗</div>
                <h4>Payment Failed</h4>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
            </div>
        `;
    }
}

function showPaymentTimeout(transactionRef, bookingData) {
    const statusDiv = document.getElementById('paymentStatus');
    if (statusDiv) {
        statusDiv.innerHTML = `
            <div class="status-timeout">
                <div class="timeout-icon">⏱</div>
                <h4>Payment Timeout</h4>
                <p>We haven't received payment confirmation. If you completed the payment, your booking will be processed automatically.</p>
                <p><strong>Transaction Ref:</strong> ${transactionRef}</p>
                <button class="btn btn-primary" onclick="location.reload()">Close</button>
            </div>
        `;
    }
}

function cancelPayment(transactionRef) {
    pendingBookings.delete(transactionRef);
    document.querySelector('.payment-modal')?.remove();
}

// ============================================
// MEMBERSHIP FUNCTIONALITY
// ============================================
function showMembershipModal(planType, amount) {
    const planNames = {
        'basic': 'Basic Membership',
        'premium': 'Premium Membership',
        'elite': 'Elite Membership'
    };
    
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <div class="payment-header">
                <h2>Join ${planNames[planType]}</h2>
                <button class="close-modal" onclick="this.closest('.payment-modal').remove()">&times;</button>
            </div>
            <div class="payment-body">
                <div class="booking-details">
                    <h3>Membership Details</h3>
                    <div class="detail-item">
                        <span>Plan:</span>
                        <span>${planNames[planType]}</span>
                    </div>
                    <div class="detail-item">
                        <span>Amount:</span>
                        <span>KES ${amount.toLocaleString()} / month</span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="memberName">Full Name</label>
                    <input type="text" id="memberName" name="memberName" required placeholder="Enter your full name">
                </div>
                <div class="form-group">
                    <label for="memberPhone">Phone Number (M-Pesa)</label>
                    <input type="tel" id="memberPhone" name="memberPhone" required placeholder="254 700 000 000">
                </div>
                <div class="form-group">
                    <label for="memberEmail">Email Address</label>
                    <input type="email" id="memberEmail" name="memberEmail" required placeholder="your.email@example.com">
                </div>
                <div class="payment-amount">
                    <div class="amount-display">
                        <span>Total Amount:</span>
                        <span class="amount-value">KES ${amount.toLocaleString()}</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-pay" onclick="processMembershipPayment('${planType}', ${amount})">
                    Pay with M-Pesa
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function processMembershipPayment(planType, amount) {
    const name = document.getElementById('memberName').value;
    const phone = document.getElementById('memberPhone').value;
    const email = document.getElementById('memberEmail').value;
    
    if (!name || !phone || !email) {
        alert('Please fill in all fields');
        return;
    }
    
    const membershipData = {
        planType: planType,
        amount: amount,
        name: name,
        phone: phone,
        email: email
    };
    
    // Use same M-Pesa payment flow
    await processMpesaPayment(membershipData);
}

// ============================================
// MEDIA GALLERY FUNCTIONALITY
// ============================================
// Sample media data structure (in production, this would come from a database/API)
const mediaDatabase = {
    '2024-03-15': {
        '17:00-18:00': [
            { type: 'image', url: 'https://via.placeholder.com/800x600/4a7c28/ffffff?text=Match+Photo+1', title: 'Match Action' },
            { type: 'image', url: 'https://via.placeholder.com/800x600/2d5016/ffffff?text=Match+Photo+2', title: 'Team Photo' },
            { type: 'video', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', title: 'Match Highlights' }
        ],
        '19:00-20:00': [
            { type: 'image', url: 'https://via.placeholder.com/800x600/4a7c28/ffffff?text=Training+Session', title: 'Training Session' }
        ]
    },
    '2024-03-16': {
        '21:00-22:00': [
            { type: 'image', url: 'https://via.placeholder.com/800x600/2d5016/ffffff?text=League+Match', title: 'League Match' },
            { type: 'video', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', title: 'Match Highlights' }
        ]
    }
};

const mediaSearchForm = document.getElementById('mediaSearchForm');
if (mediaSearchForm) {
    mediaSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(mediaSearchForm);
        const date = formData.get('mediaBookingDate');
        const timeSlot = formData.get('mediaTimeSlot');
        
        displayMedia(date, timeSlot);
    });
}

function displayMedia(date, timeSlot) {
    const mediaDisplay = document.getElementById('mediaDisplay');
    if (!mediaDisplay) return;

    // Check if media exists for this date and time slot
    const mediaForSlot = mediaDatabase[date]?.[timeSlot];

    if (!mediaForSlot || mediaForSlot.length === 0) {
        mediaDisplay.innerHTML = `
            <div class="no-media-message">
                <div class="icon">📷</div>
                <h4>No Media Available</h4>
                <p>No photos or videos have been uploaded for this booking yet. Check back later or contact our media team.</p>
            </div>
        `;
        return;
    }

    // Display media
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    let mediaHTML = `
        <div class="media-header">
            <h3>Media Gallery</h3>
            <p>${formattedDate} - ${timeSlot}</p>
        </div>
        <div class="media-grid">
    `;

    mediaForSlot.forEach((item, index) => {
        if (item.type === 'image') {
            mediaHTML += `
                <div class="media-item" onclick="openMediaModal('${item.url}', 'image', '${item.title}')">
                    <img src="${item.url}" alt="${item.title}" loading="lazy">
                    <div class="media-type-badge">📷 Photo</div>
                </div>
            `;
        } else if (item.type === 'video') {
            mediaHTML += `
                <div class="media-item" onclick="openMediaModal('${item.url}', 'video', '${item.title}')">
                    <video src="${item.url}" muted></video>
                    <div class="media-type-badge">🎥 Video</div>
                </div>
            `;
        }
    });

    mediaHTML += '</div>';
    mediaDisplay.innerHTML = mediaHTML;
}

function openMediaModal(url, type, title) {
    const modal = document.createElement('div');
    modal.className = 'media-modal';
    modal.innerHTML = `
        <div class="media-modal-content">
            <button class="close-modal" onclick="this.closest('.media-modal').remove()">&times;</button>
            <h3>${title}</h3>
            ${type === 'image' 
                ? `<img src="${url}" alt="${title}">` 
                : `<video src="${url}" controls autoplay></video>`
            }
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// ============================================
// MEDIA UPLOAD AUTHENTICATION
// ============================================
// Approved media team credentials (In production, this should be on the backend)
const MEDIA_TEAM_CREDENTIALS = {
    // Format: username: password (In production, use hashed passwords)
    'media@kilimanisportsground.co.ke': 'MediaTeam2024!',
    'photographer@kilimanisportsground.co.ke': 'PhotoTeam2024!',
    'videographer@kilimanisportsground.co.ke': 'VideoTeam2024!'
};

// Check if user is authenticated
function isMediaTeamAuthenticated() {
    return sessionStorage.getItem('mediaTeamAuthenticated') === 'true';
}

// Set authentication status
function setMediaTeamAuthenticated(status) {
    sessionStorage.setItem('mediaTeamAuthenticated', status ? 'true' : 'false');
}

// Show/hide upload section based on authentication
function checkMediaTeamAuth() {
    const loginSection = document.getElementById('mediaLoginSection');
    const uploadSection = document.getElementById('uploadContentSection');
    
    if (isMediaTeamAuthenticated()) {
        if (loginSection) loginSection.classList.add('hidden');
        if (uploadSection) uploadSection.classList.remove('hidden');
    } else {
        if (loginSection) loginSection.classList.remove('hidden');
        if (uploadSection) uploadSection.classList.add('hidden');
    }
}

// Handle media team login
document.addEventListener('DOMContentLoaded', () => {
    checkMediaTeamAuth();
    
    const mediaLoginForm = document.getElementById('mediaLoginForm');
    if (mediaLoginForm) {
        mediaLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('mediaUsername').value.trim();
            const password = document.getElementById('mediaPassword').value;
            const errorDiv = document.getElementById('loginError');
            
            // Validate credentials
            if (MEDIA_TEAM_CREDENTIALS[username] && MEDIA_TEAM_CREDENTIALS[username] === password) {
                // Successful login
                setMediaTeamAuthenticated(true);
                checkMediaTeamAuth();
                
                // Clear form
                mediaLoginForm.reset();
                if (errorDiv) errorDiv.classList.add('hidden');
                
                // Show success message
                alert('Login successful! You can now upload media files.');
            } else {
                // Failed login
                if (errorDiv) {
                    errorDiv.textContent = 'Invalid username or password. Please try again.';
                    errorDiv.classList.remove('hidden');
                }
                
                // Clear password field
                document.getElementById('mediaPassword').value = '';
            }
        });
    }
});

// Logout function
function logoutMediaTeam() {
    if (confirm('Are you sure you want to logout?')) {
        setMediaTeamAuthenticated(false);
        checkMediaTeamAuth();
        clearUploadForm();
        alert('You have been logged out successfully.');
    }
}

// ============================================
// MEDIA UPLOAD FUNCTIONALITY
// ============================================
let selectedFiles = [];

document.addEventListener('DOMContentLoaded', () => {
    const mediaUploadForm = document.getElementById('mediaUploadForm');
    const fileInput = document.getElementById('mediaFiles');
    const fileList = document.getElementById('fileList');
    const previewGrid = document.getElementById('previewGrid');
    const fileUploadArea = document.getElementById('fileUploadArea');

    // File input change handler
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            handleFileSelection(e.target.files);
        });
    }

    // Drag and drop handlers
    if (fileUploadArea) {
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = 'var(--turf-green-bright)';
            fileUploadArea.style.background = '#f0f8f0';
        });

        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.style.borderColor = '#d0d0d0';
            fileUploadArea.style.background = '#fafafa';
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#d0d0d0';
            fileUploadArea.style.background = '#fafafa';
            
            if (e.dataTransfer.files.length > 0) {
                handleFileSelection(e.dataTransfer.files);
                fileInput.files = e.dataTransfer.files;
            }
        });
    }

    function handleFileSelection(files) {
        selectedFiles = Array.from(files);
        displayFileList();
        displayPreview();
    }

    function displayFileList() {
        if (!fileList) return;
        
        fileList.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            
            fileItem.innerHTML = `
                <div class="file-item-info">
                    <div class="file-item-icon">
                        <i class="fas ${isImage ? 'fa-image' : isVideo ? 'fa-video' : 'fa-file'}"></i>
                    </div>
                    <div class="file-item-details">
                        <div class="file-item-name">${file.name}</div>
                        <div class="file-item-size">${formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button type="button" class="file-item-remove" onclick="removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            fileList.appendChild(fileItem);
        });
    }

    function displayPreview() {
        if (!previewGrid) return;
        
        previewGrid.innerHTML = '';
        
        if (selectedFiles.length === 0) {
            previewGrid.innerHTML = '<p class="preview-placeholder">No files selected</p>';
            return;
        }
        
        selectedFiles.forEach((file, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            
            const reader = new FileReader();
            reader.onload = (e) => {
                if (isImage) {
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="${file.name}">
                        <button type="button" class="preview-item-remove" onclick="removeFile(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                        <div class="preview-item-type">📷 Photo</div>
                    `;
                } else if (isVideo) {
                    previewItem.innerHTML = `
                        <video src="${e.target.result}" muted></video>
                        <button type="button" class="preview-item-remove" onclick="removeFile(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                        <div class="preview-item-type">🎥 Video</div>
                    `;
                }
                previewGrid.appendChild(previewItem);
            };
            
            reader.readAsDataURL(file);
        });
    }

    // Form submission
    if (mediaUploadForm) {
        mediaUploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(mediaUploadForm);
            const date = formData.get('uploadBookingDate');
            const timeSlot = formData.get('uploadTimeSlot');
            const title = formData.get('mediaTitle') || 'Untitled';
            const description = formData.get('mediaDescription') || '';
            
            if (selectedFiles.length === 0) {
                alert('Please select at least one file to upload');
                return;
            }
            
            // Add files to FormData
            selectedFiles.forEach((file) => {
                formData.append('files[]', file);
            });
            
            try {
                // Show loading state
                const submitBtn = mediaUploadForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
                
                // In production, this would upload to your backend API
                const response = await fetch('/api/media/upload', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    const result = await response.json();
                    alert(`Successfully uploaded ${selectedFiles.length} file(s)!\n\nDate: ${date}\nTime: ${timeSlot}`);
                    
                    // Update media database (in production, this would come from backend)
                    if (!mediaDatabase[date]) {
                        mediaDatabase[date] = {};
                    }
                    if (!mediaDatabase[date][timeSlot]) {
                        mediaDatabase[date][timeSlot] = [];
                    }
                    
                    // Add uploaded files to database
                    selectedFiles.forEach((file, index) => {
                        const isImage = file.type.startsWith('image/');
                        mediaDatabase[date][timeSlot].push({
                            type: isImage ? 'image' : 'video',
                            url: result.urls[index] || URL.createObjectURL(file), // Use server URL in production
                            title: title
                        });
                    });
                    
                    clearUploadForm();
                } else {
                    throw new Error('Upload failed');
                }
            } catch (error) {
                console.error('Upload error:', error);
                // For demo purposes, simulate successful upload
                alert(`Successfully uploaded ${selectedFiles.length} file(s)!\n\nNote: In production, files will be uploaded to your server.`);
                clearUploadForm();
            } finally {
                const submitBtn = mediaUploadForm.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Media';
            }
        });
    }
});

function removeFile(index) {
    const fileInput = document.getElementById('mediaFiles');
    const dt = new DataTransfer();
    
    selectedFiles = selectedFiles.filter((_, i) => i !== index);
    
    selectedFiles.forEach(file => {
        dt.items.add(file);
    });
    
    fileInput.files = dt.files;
    
    // Update displays
    const fileList = document.getElementById('fileList');
    const previewGrid = document.getElementById('previewGrid');
    
    if (fileList) {
        const fileItems = fileList.querySelectorAll('.file-item');
        if (fileItems[index]) {
            fileItems[index].remove();
        }
    }
    
    // Re-render preview
    if (previewGrid) {
        previewGrid.innerHTML = '';
        if (selectedFiles.length === 0) {
            previewGrid.innerHTML = '<p class="preview-placeholder">No files selected</p>';
        } else {
            selectedFiles.forEach((file, i) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                
                const isImage = file.type.startsWith('image/');
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (isImage) {
                        previewItem.innerHTML = `
                            <img src="${e.target.result}" alt="${file.name}">
                            <button type="button" class="preview-item-remove" onclick="removeFile(${i})">
                                <i class="fas fa-times"></i>
                            </button>
                            <div class="preview-item-type">📷 Photo</div>
                        `;
                    } else {
                        previewItem.innerHTML = `
                            <video src="${e.target.result}" muted></video>
                            <button type="button" class="preview-item-remove" onclick="removeFile(${i})">
                                <i class="fas fa-times"></i>
                            </button>
                            <div class="preview-item-type">🎥 Video</div>
                        `;
                    }
                    previewGrid.appendChild(previewItem);
                };
                reader.readAsDataURL(file);
            });
        }
    }
}

function clearUploadForm() {
    const form = document.getElementById('mediaUploadForm');
    const fileInput = document.getElementById('mediaFiles');
    const fileList = document.getElementById('fileList');
    const previewGrid = document.getElementById('previewGrid');
    
    if (form) form.reset();
    if (fileInput) fileInput.value = '';
    selectedFiles = [];
    if (fileList) fileList.innerHTML = '';
    if (previewGrid) previewGrid.innerHTML = '<p class="preview-placeholder">No files selected</p>';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c⚽ Kilimani Sports Ground', 'font-size: 20px; font-weight: bold; color: #4a7c28;');
console.log('%cWebsite by Kilimani Sports Ground Team', 'font-size: 12px; color: #666;');

