document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('.main-container');
    const showChoiceLink = document.getElementById('showChoiceLink');
    const showLoginLinks = document.querySelectorAll('.show-login-link');
    const choiceOptions = document.querySelectorAll('.signup-choice-option');


    function switchPanel(activePanel) {
        mainContainer.className = 'main-container';
        mainContainer.classList.add(activePanel);
    }

    showChoiceLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchPanel('choice-active');
    });
    showLoginLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        switchPanel('login-active');
    }));
    choiceOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const type = e.currentTarget.dataset.type;
            if (type === 'empresa') {
                switchPanel('signup-empresa-active');
            } else if (type === 'profissional') {
                switchPanel('signup-profissional-active');
            }
        });
    });

    function createStepNavigator(formId, totalSteps) {
        const form = document.getElementById(formId);
        return (step) => {
            const currentStepElement = form.querySelector('.form-part.active');
            if (!currentStepElement) return;

            const currentStep = parseInt(currentStepElement.id.split('-')[2]);

            if (step > currentStep) {
                let isValid = true;
                form.querySelectorAll(`#${formId.split('-')[0]}-part-${currentStep} [required]`).forEach(field => {
                    let fieldHasError = false;
                    if (field.type === 'radio') {
                        if (!form.querySelector(`[name="${field.name}"]:checked`)) {
                            fieldHasError = true;
                            const radioGroup = field.closest('.form-group');
                            radioGroup.style.border = '1px solid red';
                            radioGroup.style.borderRadius = '8px';
                            radioGroup.style.padding = '0.5rem';
                            setTimeout(() => {
                                radioGroup.style.border = '';
                                radioGroup.style.padding = '';
                            }, 2000);
                        }
                    } else if (!field.value.trim()) {
                        fieldHasError = true;
                    }

                    if (fieldHasError) {
                        isValid = false;
                        field.style.borderColor = 'red';
                        setTimeout(() => field.style.borderColor = '', 2000);
                    } else {
                        field.style.borderColor = '';
                    }
                });
                if (!isValid) return;
            }

            form.querySelectorAll('.form-part').forEach(p => p.classList.remove('active'));
            form.querySelector(`#${formId.split('-')[0]}-part-${step}`).classList.add('active');
            document.getElementById(`${formId.split('-')[0]}-progress-fill`).style.width = `${((step - 1) / (totalSteps - 1)) * 100}%`;
            document.querySelectorAll(`#${formId.split('-')[0]}-progress-steps .progress-step`).forEach((s, i) => s.classList.toggle('active', i < step));
        };
    }

    window.emp_navigateStep = createStepNavigator('emp-form', 4);
    window.pro_navigateStep = createStepNavigator('pro-form', 4);

    window.util_togglePassword = (toggleElement) => {
        const passwordInput = toggleElement.previousElementSibling;
        const icon = toggleElement.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    };

    const cnpjInput = document.getElementById('emp-cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '').slice(0, 14);
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
            e.target.value = value;
        });
    }
    const cpfInput = document.getElementById('pro-cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '').slice(0, 11);
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }
});