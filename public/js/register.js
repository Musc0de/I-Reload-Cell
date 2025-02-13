function validateForm() {
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var address = document.getElementById("address").value;
    var password = document.getElementById("password").value;
    
    var usernameError = document.getElementById("usernameError");
    var emailError = document.getElementById("emailError");
    var phoneError = document.getElementById("phoneError");
    var addressError = document.getElementById("addressError");
    var passwordError = document.getElementById("passwordError");

    var isValid = true;

    // Validate username
    if (username === "") {
        usernameError.innerHTML = "Username harus diisi";
        isValid = false;
    } else {
        usernameError.innerHTML = "";
    }

    // Validate email
    // You can use regular expression to validate email format
    // For simplicity, I'll check if it contains @ symbol
    if (email === "" || !email.includes("@")) {
        emailError.innerHTML = "Email tidak valid";
        isValid = false;
    } else {
        emailError.innerHTML = "";
    }

    // Validate phone number
    // You can use regular expression to validate phone number format
    // For simplicity, I'll check if it contains only digits and has minimum length of 10
    if (phone === "" || !/^\d{10,}$/.test(phone)) {
        phoneError.innerHTML = "Nomor telepon tidak valid";
        isValid = false;
    } else {
        phoneError.innerHTML = "";
    }

    // Validate address
    if (address === "") {
        addressError.innerHTML = "Alamat harus diisi";
        isValid = false;
    } else {
        addressError.innerHTML = "";
    }

    // Validate password
    if (password === "" || password.length < 8) {
        passwordError.innerHTML = "Password harus memiliki minimal 8 karakter";
        isValid = false;
    } else {
        passwordError.innerHTML = "";
    }

    return isValid;
}