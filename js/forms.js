// Form handling and validation
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add form validation
        addFormValidation(form);
        
        // Add form enhancement
        enhanceFormFields(form);
    });
    
    // Form validation function
    function addFormValidation(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
        
        // Form submission validation
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showFormError('Por favor, corrija os erros antes de enviar o formulário.');
            }
        });
    }
    
    // Field validation
    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const isRequired = field.hasAttribute('required');
        
        // Clear previous errors
        clearFieldError(field);
        
        // Required field validation
        if (isRequired && !value) {
            showFieldError(field, 'Este campo é obrigatório.');
            return false;
        }
        
        // Skip validation if field is empty and not required
        if (!value && !isRequired) {
            return true;
        }
        
        // Email validation
        if (fieldType === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Por favor, insira um e-mail válido.');
                return false;
            }
        }
        
        // Phone validation
        if (fieldType === 'tel') {
            const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, 'Por favor, insira um telefone válido. Ex: (11) 99999-9999');
                return false;
            }
        }
        
        // Date validation
        if (fieldType === 'date') {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showFieldError(field, 'A data de entrega deve ser hoje ou uma data futura.');
                return false;
            }
            
            // Check if it's too far in the future (optional)
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 6);
            
            if (selectedDate > maxDate) {
                showFieldError(field, 'Por favor, selecione uma data dentro dos próximos 6 meses.');
                return false;
            }
        }
        
        // Name validation
        if (field.name === 'nome') {
            if (value.length < 2) {
                showFieldError(field, 'O nome deve ter pelo menos 2 caracteres.');
                return false;
            }
            
            const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
            if (!nameRegex.test(value)) {
                showFieldError(field, 'O nome deve conter apenas letras e espaços.');
                return false;
            }
        }
        
        return true;
    }
    
    // Show field error
    function showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: fadeIn 0.3s ease-out;
        `;
        
        field.parentNode.appendChild(errorElement);
        
        // Add error styles to field
        field.style.borderColor = '#e74c3c';
        field.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
    }
    
    // Clear field error
    function clearFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Show form error
    function showFormError(message) {
        // Create or update form error message
        let formError = document.querySelector('.form-error');
        
        if (!formError) {
            formError = document.createElement('div');
            formError.className = 'form-error';
            formError.style.cssText = `
                background: #e74c3c;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                text-align: center;
                animation: shake 0.5s ease-in-out;
            `;
            
            const form = document.querySelector('form');
            form.insertBefore(formError, form.firstChild);
        }
        
        formError.textContent = message;
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (formError.parentNode) {
                formError.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => formError.remove(), 300);
            }
        }, 5000);
    }
    
    // Enhance form fields
    function enhanceFormFields(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Add floating labels effect
            if (input.type !== 'submit' && input.type !== 'button') {
                addFloatingLabel(input);
            }
            
            // Add character counter for textarea
            if (input.tagName === 'TEXTAREA') {
                addCharacterCounter(input);
            }
            
            // Add input formatting
            if (input.type === 'tel') {
                addPhoneFormatting(input);
            }
            
            // Add date restrictions
            if (input.type === 'date') {
                addDateRestrictions(input);
            }
        });
    }
    
    // Floating label effect
    function addFloatingLabel(input) {
        const formGroup = input.parentNode;
        const label = formGroup.querySelector('label');
        
        if (!label) return;
        
        // Add floating label styles
        label.style.cssText = `
            position: absolute;
            top: 50%;
            left: 15px;
            transform: translateY(-50%);
            background: white;
            padding: 0 5px;
            color: #666;
            transition: all 0.3s ease;
            pointer-events: none;
            font-size: 1rem;
        `;
        
        formGroup.style.position = 'relative';
        
        // Check if field has value or is focused
        function updateLabel() {
            if (input.value || input === document.activeElement) {
                label.style.top = '0';
                label.style.fontSize = '0.875rem';
                label.style.color = '#7FB069';
                label.style.transform = 'translateY(-50%)';
            } else {
                label.style.top = '50%';
                label.style.fontSize = '1rem';
                label.style.color = '#666';
                label.style.transform = 'translateY(-50%)';
            }
        }
        
        input.addEventListener('focus', updateLabel);
        input.addEventListener('blur', updateLabel);
        input.addEventListener('input', updateLabel);
        
        // Initial check
        updateLabel();
    }
    
    // Character counter for textarea
    function addCharacterCounter(textarea) {
        const maxLength = textarea.getAttribute('maxlength') || 500;
        
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: #666;
            margin-top: 0.25rem;
        `;
        
        function updateCounter() {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${textarea.value.length}/${maxLength}`;
            
            if (remaining < 50) {
                counter.style.color = '#e74c3c';
            } else if (remaining < 100) {
                counter.style.color = '#f39c12';
            } else {
                counter.style.color = '#666';
            }
        }
        
        textarea.addEventListener('input', updateCounter);
        textarea.parentNode.appendChild(counter);
        
        // Set max length if not set
        if (!textarea.getAttribute('maxlength')) {
            textarea.setAttribute('maxlength', maxLength);
        }
        
        updateCounter();
    }
    
    // Phone formatting
    function addPhoneFormatting(input) {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 7) {
                value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            }
            
            e.target.value = value;
        });
        
        // Add placeholder
        if (!input.placeholder) {
            input.placeholder = '(11) 99999-9999';
        }
    }
    
    // Date restrictions
    function addDateRestrictions(input) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        input.setAttribute('min', today);
        
        // Set maximum date to 6 months from now
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 6);
        input.setAttribute('max', maxDate.toISOString().split('T')[0]);
        
        // Add weekend warning (optional)
        input.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const dayOfWeek = selectedDate.getDay();
            
            // Check if it's weekend (Saturday = 6, Sunday = 0)
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                const warning = document.createElement('div');
                warning.className = 'date-warning';
                warning.textContent = 'Nota: Entregas aos finais de semana podem ter custo adicional.';
                warning.style.cssText = `
                    color: #f39c12;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    animation: fadeIn 0.3s ease-out;
                `;
                
                // Remove existing warning
                const existingWarning = this.parentNode.querySelector('.date-warning');
                if (existingWarning) {
                    existingWarning.remove();
                }
                
                this.parentNode.appendChild(warning);
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    if (warning.parentNode) {
                        warning.style.animation = 'fadeOut 0.3s ease-out';
                        setTimeout(() => warning.remove(), 300);
                    }
                }, 5000);
            } else {
                // Remove weekend warning if exists
                const existingWarning = this.parentNode.querySelector('.date-warning');
                if (existingWarning) {
                    existingWarning.remove();
                }
            }
        });
    }
    
    // Form auto-save (optional)
    function addAutoSave(form) {
        const formId = form.id || 'default-form';
        const inputs = form.querySelectorAll('input, select, textarea');
        
        // Load saved data
        inputs.forEach(input => {
            const savedValue = localStorage.getItem(`${formId}-${input.name}`);
            if (savedValue && input.type !== 'submit') {
                input.value = savedValue;
            }
        });
        
        // Save data on input
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.type !== 'submit') {
                    localStorage.setItem(`${formId}-${input.name}`, input.value);
                }
            });
        });
        
        // Clear saved data on successful submission
        form.addEventListener('submit', function(e) {
            if (this.checkValidity()) {
                inputs.forEach(input => {
                    localStorage.removeItem(`${formId}-${input.name}`);
                });
            }
        });
    }
    
    // Add auto-save to contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        addAutoSave(contactForm);
    }
    
    console.log('Form enhancements loaded successfully!');
});

