function togglePassword(fieldId, iconElement) {
    
    const passwordField = document.getElementById(fieldId);

    if (passwordField.type === "password") {
        passwordField.type = "text";
        iconElement.textContent = "visibility_off";
    } else {
        passwordField.type = "password";
        iconElement.textContent = "visibility";
    }
}
