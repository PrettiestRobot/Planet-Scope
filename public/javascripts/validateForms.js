// <!-- Bootstrap error handling -->
    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (function () {
    'use strict'
    
    //initializes bs-custom-file-input. Not required for validation.
    // bsCustomFileInput.init()

    // Fetch all the forms we want to apply custom Bootstrap validation styles to with the class "validate-form"
    var forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    // Array.prototype.slice.call(forms) - this is the old way of doing things
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
        })
    })()