document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btn-login");
    const btnRegister = document.getElementById("btn-register");
    const tabIndicator = document.querySelector(".tab-indicator");
    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");

    function updateIndicator(button) {
        const buttonRect = button.getBoundingClientRect();
        const tabsRect = button.parentElement.getBoundingClientRect();

        tabIndicator.style.width = `${buttonRect.width}px`;
        tabIndicator.style.left = `${buttonRect.left - tabsRect.left}px`;
    }
    
    updateIndicator(btnLogin);

    btnLogin.addEventListener("click", () => {
        btnLogin.classList.add("active");
        btnRegister.classList.remove("active");

        formLogin.classList.remove("hidden");
        formRegister.classList.add("hidden");

        updateIndicator(btnLogin)
    });

    btnRegister.addEventListener("click", () => {
        btnRegister.classList.add("active");
        btnLogin.classList.remove("active");

        formRegister.classList.remove("hidden");
        formLogin.classList.add("hidden");

        updateIndicator(btnRegister)
    });
});

