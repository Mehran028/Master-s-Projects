document.getElementById("register-btn").addEventListener("click", async () => {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const role = document.getElementById("register-role").value;
  
    if (!email || !password || !role) {
      alert("Please fill out all fields!");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("Registration successful! Redirecting to login...");
        // Redirect to the login page
        window.location.href = "login.html";
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register. Please try again.");
    }
  });
  
  // Redirect to login page when "Login" is clicked
  document.getElementById("login-link").addEventListener("click", () => {
    window.location.href = "login.html";
  });
  