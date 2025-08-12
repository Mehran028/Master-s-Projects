document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    if (!email || !password) {
      alert("Please fill in both email and password");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
      if (response.ok) {
        // Store login state in sessionStorage
        sessionStorage.setItem("loggedIn", "true");
        sessionStorage.setItem("role", result.role); // Save the user's role
  
        // Redirect based on role
        if (result.role === "consumer") {
          window.location.href = "consumer.html";
        } else if (result.role === "creator") {
          window.location.href = "index.html";
        } else {
          alert("Role not recognized. Contact support.");
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to log in. Please try again.");
    }
  });
  