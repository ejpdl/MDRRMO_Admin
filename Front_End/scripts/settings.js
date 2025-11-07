function togglePassword() {

    const passwordField = document.getElementById("password");
    const toggleIcon = document.querySelector(".toggle-password");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.textContent = "visibility_off";
    } else {
        passwordField.type = "password";
        toggleIcon.textContent = "visibility";
    }
}