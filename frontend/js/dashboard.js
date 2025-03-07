document.addEventListener('DOMContentLoaded', () => {
  // Get necessary DOM elements
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const userForm = document.getElementById('userForm');
  const rolesTableBody = document.getElementById('rolesTableBody');
  const addRoleForm = document.getElementById('addRoleForm');
  const body = document.querySelector('body'); // To apply fade background
  const jwtToken = localStorage.getItem("jwtToken")

  // Role management elements
  const addRoleBtn = document.getElementById("addRoleBtn");
  const addRolePanel = document.getElementById("addRolePanel");
  const cancelAddRole = document.getElementById("cancelAddRole");
  const saveRole = document.getElementById("saveRole");

  // form related data
  const dobInput = userForm.querySelector("input[name='dob']");
  const mobileInput = userForm.querySelector("input[name='phoneNumber']");
  const passwordInput = userForm.querySelector('input[name="password"]');
  const confirmPasswordInput = userForm.querySelector('input[name="confirmPassword"]');

  const dobErrorElement = document.createElement("div");
  const mobileErrorElement = document.createElement("div");
  const passwordStrengthError = document.createElement("div");
  const passwordMatchError = document.createElement("div");

  const submitBtn = document.querySelector('.submit-btn');
  const userSuccessMessage = document.getElementById('userSuccessMessage');
  const userErrorMessage = document.getElementById('userErrorMessage');

  const roleSuccessMessage = document.getElementById('roleSuccessMessage');
  const roleErrorMessage = document.getElementById('roleErrorMessage');


  // check for the authentication

  function checkAuth() {
    if (!jwtToken) {
        // Redirect to login page if token is not present
        console.log("helooooo");
        window.location.href = "index.html";
    }
    else{
        console.log(jwtToken);
    }
}

  checkAuth(); // Call authentication check
 

  // Show the Add Role Panel when button is clicked
  addRoleBtn.addEventListener("click", function () {
    addRolePanel.classList.toggle("hidden"); // Toggle visibility
});

  // Hide the panel when cancel button is clicked
  cancelAddRole.addEventListener("click", function () {
      addRolePanel.classList.add("hidden"); // Hide the panel
  });

    // Save the role when save button is clicked

    

if(addRoleForm){
    addRoleForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        console.log("Reached here");
        saveRole.disabled = true;
        saveRole.style.opacity = "0.5";
        saveRole.style.cursor = "not-allowed";


        roleSuccessMessage.classList.add('hidden');
        roleSuccessMessage.style.display = 'none';
        roleSuccessMessage.classList.add('hidden');
        roleSuccessMessage.style.display = 'none';

        roleErrorMessage.classList.add('hidden');
        roleErrorMessage.style.display = 'none';
        roleErrorMessage.classList.add('hidden');
        roleErrorMessage.style.display = 'none';

        const formData = new FormData(addRoleForm);
        let json = {};

        for (const [key, value] of formData.entries()) {
            console.log(key, value);
            json[key] = value;
        }

        try {
            const response = await fetch("https://startup-project-40wn.onrender.com/addRole", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + jwtToken,
                },
                body: JSON.stringify(json),
            });
           

            // Check if response is JSON or plain text
            const contentType = response.headers.get('Content-Type');
            let responseBody;

            if (contentType && contentType.includes('application/json')) {
                // If the response is JSON
                responseBody = await response.json();
            } else {
                // If the response is not JSON (e.g., plain text)
                responseBody = await response.text();
            }

            console.log("Response Body:", responseBody);

            if (response.ok) {
                console.log("✅ Success:", responseBody);
                // Add the new role to the table

                document.getElementById('roleSuccessMessage').textContent = 'Role added successfully!';
                document.getElementById('roleSuccessMessage').classList.remove('hidden');
                document.getElementById('roleSuccessMessage').style.display = 'block'; // Force visibility

                setTimeout(() => {
                    location.reload();
                }, 1000);


            } else {
                console.log("Error adding role:", responseBody);
                document.getElementById('roleErrorMessage').textContent = 'Role Already Exists !!!';
                document.getElementById('roleErrorMessage').classList.remove('hidden');
                document.getElementById('roleErrorMessage').style.display = 'block'; // Force visibility
            }

        } catch (error) {
                console.error("Network Error:", error); 
                document.getElementById('userErrorMessage').textContent = 'There was a network error. Please try again later!!.';
                document.getElementById('userErrorMessage').classList.remove('hidden');
                document.getElementById('userErrorMessage').style.display = 'block'; // Force visibility
        }

        saveRole.disabled = false;
        saveRole.style.opacity = "1";
        saveRole.style.cursor = "pointer";
    });
}


  // Function to calculate age and check if user is 18 or older
function isAgeValid(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 18;
}

// Function to validate phone number (basic check for format)
function isValidPhoneNumber(phone) {
    const phonePattern = /^[0-9]{10}$/; // Basic pattern for 10-digit phone number
    return phonePattern.test(phone);
}

// Function to validate password (check for uppercase and special character)
function isValidPassword(password) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[@#$%!^&])[A-Za-z0-9@#$%!^&]{6,}$/;
    return passwordPattern.test(password);
}

// Function to validate password match
function arePasswordsMatching(password, confirmPassword) {
    return password === confirmPassword;
}

// Real-time password validation
passwordInput.addEventListener("input", function () {
    const existingPasswordStrengthError = userForm.querySelector('.password-strength-error');
    if (existingPasswordStrengthError) existingPasswordStrengthError.remove();

    if (!isValidPassword(passwordInput.value)) {
        passwordStrengthError.textContent = "Password must contain at least one uppercase letter and one special character (@, #, $, %, !).";
        passwordStrengthError.style.color = "red";
        passwordStrengthError.style.fontSize = "12px";
        passwordStrengthError.classList.add('password-strength-error');
        passwordInput.parentElement.appendChild(passwordStrengthError);
    }
});

confirmPasswordInput.addEventListener("input", function () {
    const existingPasswordMatchError = userForm.querySelector('.password-match-error');
    if (existingPasswordMatchError) existingPasswordMatchError.remove();

    if (!arePasswordsMatching(passwordInput.value, confirmPasswordInput.value)) {
        passwordMatchError.textContent = "Passwords do not match.";
        passwordMatchError.style.color = "red";
        passwordMatchError.style.fontSize = "12px";
        passwordMatchError.classList.add('password-match-error');
        confirmPasswordInput.parentElement.appendChild(passwordMatchError);
    }
});


  // ======== Navigation Functionality ===========
  if (navLinks.length > 0) {
      navLinks.forEach(link => {
          link.addEventListener('click', (e) => {
              e.preventDefault();

              // Remove active class from all links
              navLinks.forEach(navLink => navLink.classList.remove('active'));

              // Add active class to clicked link
              link.classList.add('active');

              // Show corresponding section
              const targetSection = link.getAttribute('data-section');
              sections.forEach(section => {
                  if (section.id === `${targetSection}-section`) {
                      section.classList.remove('hidden');
                  } else {
                      section.classList.add('hidden');
                  }
              });

              // Show or hide "Add Role" button based on section
              if (targetSection === 'roles') {
                  addRoleBtn.classList.remove('hidden');
              } else {
                  addRoleBtn.classList.add('hidden');
                  addRolePanel.classList.add("hidden"); // Ensure panel is hidden when switching sections
              }
          });
      });
  }

  // ======== User Form Submission ===========
 // Helper function to delay execution
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

if (userForm) {
    userForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        let isValid = true;
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
        submitBtn.style.cursor = "not-allowed";
        
        userSuccessMessage.classList.add('hidden');
        userSuccessMessage.style.display = 'none';
        userSuccessMessage.classList.add('hidden');
        userSuccessMessage.style.display = 'none';

        userErrorMessage.classList.add('hidden');
        userErrorMessage.style.display = 'none';
        userErrorMessage.classList.add('hidden');
        userErrorMessage.style.display = 'none';

        // Add a 3-second delay before continuing with validation and submission

        // Validation checks
        const existingDobError = userForm.querySelector('.dob-error');
        if (existingDobError) existingDobError.remove();

        const existingMobileError = userForm.querySelector('.mobile-error');
        if (existingMobileError) existingMobileError.remove();

        // Validate Date of Birth (DOB)
        if (!isAgeValid(dobInput.value)) {
            isValid = false;
            dobErrorElement.textContent = "You must be at least 18 years old.";
            dobErrorElement.style.color = "red";
            dobErrorElement.style.fontSize = "12px";
            dobErrorElement.classList.add('dob-error');
            dobInput.parentElement.appendChild(dobErrorElement);
        }

        // Validate phone number
        if (!isValidPhoneNumber(mobileInput.value)) {
            isValid = false;
            mobileErrorElement.textContent = "Please enter a valid 10-digit mobile number.";
            mobileErrorElement.style.color = "red";
            mobileErrorElement.style.fontSize = "12px";
            mobileErrorElement.classList.add('mobile-error');
            mobileInput.parentElement.appendChild(mobileErrorElement);
        }

        // Validate password and confirm password
        if (!isValidPassword(passwordInput.value)) {
            isValid = false;
            passwordStrengthError.textContent = "Password must contain at least one uppercase letter and one special character (@, #, $, %, !).";
            passwordStrengthError.style.color = "red";
            passwordStrengthError.style.fontSize = "12px";
            passwordStrengthError.classList.add('password-strength-error');
            passwordInput.parentElement.appendChild(passwordStrengthError);
        }

        if (!arePasswordsMatching(passwordInput.value, confirmPasswordInput.value)) {
            isValid = false;
            passwordMatchError.textContent = "Passwords do not match.";
            passwordMatchError.style.color = "red";
            passwordMatchError.style.fontSize = "12px";
            passwordMatchError.classList.add('password-match-error');
            confirmPasswordInput.parentElement.appendChild(passwordMatchError);
        }

        // If validation fails, stop form submission
        if (!isValid) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
            submitBtn.style.cursor = "pointer";
            return;
        }

        await delay(3000);  // 3-second delay

        const formData = new FormData(userForm);
        let json = {};

        for (const [key, value] of formData.entries()) {
            if (key === 'roles') {
                const roleSelect = userForm.querySelector('[name="roles"]');
                const selectedText = roleSelect.options[roleSelect.selectedIndex].text;
                json.roles = [{
                    roleName: selectedText
                }];
            } else {
                json[key] = value;
            }
        }

        try {
            const response = await fetch("https://startup-project-40wn.onrender.com/adduser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + jwtToken,
                },
                body: JSON.stringify(json),
            });

            // Check if response is JSON or plain text
            const contentType = response.headers.get('Content-Type');
            let responseBody;

            if (contentType && contentType.includes('application/json')) {
                // If the response is JSON
                responseBody = await response.json();
            } else {
                // If the response is not JSON (e.g., plain text)
                responseBody = await response.text();
            }

            console.log("Response Body:", responseBody);

            if (response.ok) {
                console.log("✅ Success:", responseBody);
                // Show success message
                document.getElementById('userSuccessMessage').textContent = 'User added successfully!';
                document.getElementById('userSuccessMessage').classList.remove('hidden');
                document.getElementById('userSuccessMessage').style.display = 'block'; // Force visibility

            }
            else{
                console.error("Error adding user:", responseBody);
                document.getElementById('userErrorMessage').textContent = 'User Already Exists !!!';
                document.getElementById('userErrorMessage').classList.remove('hidden');
                document.getElementById('userErrorMessage').style.display = 'block'; // Force visibility
            }

        } catch (error) {
            console.error("Network Error:", error);
            document.getElementById('userErrorMessage').textContent = 'There was a network error. Please try again later!!.';
            document.getElementById('userErrorMessage').classList.remove('hidden');
            document.getElementById('userErrorMessage').style.display = 'block'; // Force visibility
        }

        // Re-enable the button after completion
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.style.cursor = "pointer";
    });
}


   // Fetching the role from the server
   const rolesDropdown = document.getElementById("roles");
   if (rolesDropdown) {
       fetch("https://startup-project-40wn.onrender.com/getRoles",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + jwtToken,
            }
       })
           .then(response => {
               if (!response.ok) {
                   console.error("Error fetching roles:", response);
                   return;
               }
               return response.json();
           })
           .then(data => {
               data.forEach(role => {
                   let option = document.createElement("option");
                   option.value = role.id;
                   option.textContent = role.roleName;
                   rolesDropdown.appendChild(option);
               });
           })
           .catch(error => console.error("Error fetching roles:", error));
   }

// Fetch and display roles in the table

 if (rolesTableBody) {
        fetch("https://startup-project-40wn.onrender.com/getRoles",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + jwtToken,
            }
        })
            .then(response => response.json())
            .then(roles => {
                rolesTableBody.innerHTML = ''; // Clear existing content

                roles.forEach(role => {
                    const row = document.createElement('tr');
                    row.setAttribute("data-role-id", role.id);  // Add data-role-id attribute
                    row.innerHTML = `   
                        <td data-id="${role.id}">
                            <span class="role-name-text">${role.roleName}</span>
                        </td>
                        <td data-id="${role.id}">
                            <span class="role-status" style="color: ${role.status ? "green" : "red"};">
                                ${role.status ? "Active" : "Inactive"}
                            </span>
                            <label class="switch" style="display: none;">
                                <input type="checkbox" class="toggle-status" ${role.status ? "checked" : ""}>
                                <span class="slider"></span>
                            </label>
                        </td>
                        <td data-id="${role.id}">
                            <button class="edit-btn" data-id="${role.id}">Edit</button>
                            <button class="delete-btn" data-id="${role.id}">Delete</button>
                        </td>`;
                    rolesTableBody.appendChild(row);                    
                });

                // Attach event listeners to Edit & Delete buttons
                document.querySelectorAll('.edit-btn').forEach(button => {
                     button.addEventListener('click', handleEditClick);
                });

                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', handleDeleteClick);
                });
            })
            .catch(error => console.error("Error fetching roles:", error));
    }

   
    
    function handleEditClick(event) {
      const roleRow = event.currentTarget.closest('tr');
      highlightedRow(roleRow);
       
    }
    

    function toggleRoleStatus(event) {
        const checkbox = event.target;
        const roleRow = checkbox.closest("tr");
    
        if (!roleRow) return;
    
        const statusSpan = roleRow.querySelector(".role-status");
    
        // Update UI based on toggle state
        const newStatus = checkbox.checked ? "Active" : "Inactive";
        const newColor = checkbox.checked ? "green" : "red";
    
        setTimeout(() => {
            statusSpan.style.color = newColor;
            statusSpan.textContent = newStatus;
        }, 300);
    
        console.log("Status changed to:", newStatus);
    }
   


    async function addUpdateName(event) {
        
    }

    async function handleSaveClick(event) {
        const roleRow = event.currentTarget.closest("tr");
        
        // const roleRow = event.target.closest("tr"); 
        console.log("roleRow:", roleRow); // Check if roleRow is found
    
        if (!roleRow) {
            console.log("No <tr> found.");
            return; 
        }
    
        const roleId = roleRow.dataset.roleId; 
    
        
        // Get Role ID
        const roleNameInput = roleRow.querySelector(".role-name-input");
        
        const roleName = roleNameInput.value.trim();
        const toggleSwitch = roleRow.querySelector(".switch");
        const checkbox = roleRow?.querySelector(".toggle-status");
        const currentChecked = checkbox.checked;
        const initialChecked = toggleSwitch.dataset.originalStatus=="true";
        const roleStatus = currentChecked;
    
        // Get the role name

        let originalRoleName, currentRoleName;
        
         originalRoleName = roleNameInput.dataset.originalName;
         currentRoleName = roleNameInput.value.trim();
     
        let required = false;



        if(currentRoleName===""){
            alert("RoleName can't be Empty");
            return;
        }

        if(originalRoleName!==currentRoleName || currentChecked!==initialChecked){
            required = true;
        }

    

        if(required){
            try {
                const response = await fetch("https://startup-project-40wn.onrender.com/updateRole", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": "Bearer " + jwtToken,
                    },
                    body: JSON.stringify({
                        "id": roleId,
                        "roleName": roleName,
                        "status": roleStatus
                    })
                });
            
                const contentType = response.headers.get('Content-Type');
                let responseBody;
            
                if (contentType && contentType.includes('application/json')) {
                    responseBody = await response.json();
                } else {
                    responseBody = await response.text();
                }
           
              if(response.status===409){
                 alert(responseBody.status);
              }
              else
              if(response.status===406){
                alert(responseBody.status);
              }
              else{
                if(response.status==200){
                    roleNameInput.dataset.originalName = currentRoleName;
                    toggleSwitch.dataset.originalStatus = currentChecked ? "true" : "false";
                    alert("Rol updated Successfully");
                }
              }
              
            
            } catch (error) {
                console.error("Unexpected error:", error);
                alert(`Update failed: ${error.message}`);
            }
            
        }

        handleCancelRow(roleRow);
    
    }
    

    

     async function handleDeleteClick(event) {
        const roleId = event.currentTarget.dataset.id; // Ensure correct element
        const roleRow = event.currentTarget.closest('tr');
        const roleName = roleRow.querySelector('.role-name-text')?.textContent.trim(); // Use optional chaining for safety
        
        console.log("Yahaha tk to m pauch hi nhi rha");

        console.log("roleId",roleId);
        console.log("roleName",roleName);

        if (!roleId || !roleRow) {
            console.error("Missing roleId or roleRow.");
            return;
        }
    
        if (!confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
            return;
        }

        console.log("Deleting role with ID:", roleId);
    
        try {
            const response = await fetch(`https://startup-project-40wn.onrender.com/deleteRole/${roleId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + jwtToken,
                }
            });
    
            if (response.ok) {
                roleRow.remove();
            } else {
                const errorText = await response.text(); // Read response text for more info
                console.error(`Error deleting role: ${response.status} - ${errorText}`);
                alert("Failed to delete role. Please try again later.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("An error occurred while deleting the role.");
        }
     }
    
   
    
   

    function highlightedRow(roleRow) {

            console.log("Row clicked:", roleRow);
            if (!roleRow) return;

            // Find buttons
            const editButton = roleRow.querySelector(".edit-btn");
            const deleteButton = roleRow.querySelector(".delete-btn");

            // Find elements
            const roleNameSpan = roleRow.querySelector(".role-name-text");
            const statusSpan = roleRow.querySelector(".role-status");
            const toggleSwitch = roleRow.querySelector(".switch");
            const checkbox = toggleSwitch?.querySelector(".toggle-status");

            // Ensure elements exist before proceeding
            if (!editButton) {
                console.error("editbutton  elements are missing.");
                return;
            }

            if (!deleteButton) {
                console.error("delete  are missing.");
                return;
            }
            if (!statusSpan) {
                console.error("S missing.");
                return;
            }
            if (!toggleSwitch) {
                console.error("Ssing.");
                return;
            }
            if (!checkbox) {
                console.error("Sadad.");
                return;
            }

            if(!roleNameSpan){
                console.log("ADAsd");
                return;
            }


            // Store the original status
            if (!toggleSwitch.classList.contains("original-status-toggle")) {
                toggleSwitch.classList.add("original-status-toggle");
                toggleSwitch.dataset.originalStatus = checkbox.checked ? "true" : "false"; // Convert boolean to string
            }

            // Replace span with input
            const roleNameInput = document.createElement("input");
            roleNameInput.type = "text";
            roleNameInput.className = "role-name-input";
            roleNameInput.value = roleNameSpan.textContent.trim();

            // Store the original name **only in the input field**
            roleNameInput.dataset.originalName = roleNameSpan.textContent.trim();

            // Replace span with input
            roleNameSpan.replaceWith(roleNameInput);

            // Hide status text & show the toggle switch
            statusSpan.style.display = "none";
            toggleSwitch.style.display = "inline-block";

            // Change button text and classes
            editButton.textContent = "Save";
            deleteButton.textContent = "Cancel";
            editButton.classList.replace("edit-btn", "save-btn");
            deleteButton.classList.replace("delete-btn", "cancel-btn");

            // Remove old event listeners
            editButton.removeEventListener("click", handleEditClick);
            deleteButton.removeEventListener("click", handleDeleteClick);

            // Add new event listeners
            editButton.addEventListener("click", handleSaveClick);
            deleteButton.addEventListener("click", handleCancelClick);
    
            // Hide status text & show the toggle switch
            statusSpan.style.display = "none";
            toggleSwitch.style.display = "inline-block";
    
    
        // Remove highlight from all rows
        document.querySelectorAll("#rolesTableBody tr").forEach(row => row.classList.remove("highlighted"));
    
        // Add highlight to the clicked row
        roleRow.classList.add("highlighted");
    
        // Fade other rows
        document.querySelectorAll(".sidebar").forEach(el => el.classList.add("faded"));
        document.querySelectorAll("#rolesTableBody tr").forEach(row => {
            if (row !== roleRow) row.classList.add("faded");
        });
    
        // Disable all buttons
        document.querySelectorAll("button").forEach(button => {
            button.disabled = true;
        });
    
        // Enable only the button(s) inside the clicked row
        roleRow.querySelectorAll("button").forEach(button => {
            button.disabled = false;
        });
    
        // Disable all navigation links
        document.querySelectorAll(".nav-link").forEach(link => {
            link.classList.add("disabled");
            link.style.pointerEvents = "none"; // Prevent clicking
            link.style.opacity = "0.5"; // Reduce visibility
        });
    
        // Disable Add Role button
        const addRoleButton = document.getElementById("addRoleBtn");
        if (addRoleButton) {
            addRoleButton.classList.add("disabled");
            addRoleButton.style.opacity = "0.5";
            addRoleButton.style.pointerEvents = "none";
        }
    
        console.log("Highlight applied & buttons/links disabled except current row.");
    }
    

    function restoreUI(roleRow) {

        const editButton = roleRow.querySelector(".save-btn");
        const deleteButton = roleRow.querySelector(".cancel-btn");
        const statusSpan = roleRow.querySelector(".role-status");
        const toggleSwitch = roleRow.querySelector(".switch");
        const checkbox = toggleSwitch?.querySelector(".toggle-status");
        const roleNameInput = document.querySelector(".role-name-input");
        const originalRoleName = roleNameInput.dataset.originalName;       
        


        // Remove highlights and fades
        rolesTableBody.querySelectorAll("tr").forEach(row => row.classList.remove("highlighted"));
        
        document.querySelectorAll(".sidebar").forEach(el => el.classList.remove("faded"));
        document.querySelectorAll("#rolesTableBody tr").forEach(row => {
           row.classList.remove("faded");
        });
        // Restore Add Role button
        const addRoleButton = document.getElementById("addRoleBtn");
        if (addRoleButton) {
            addRoleButton.classList.remove("disabled");
            addRoleButton.style.opacity = "1";  // Restore original opacity
            addRoleButton.style.pointerEvents = "auto";  // Restore clicking
        }
    
        // Re-enable all buttons
        document.querySelectorAll("button").forEach(button => button.disabled = false);

       // Re-enable the nav-bar link button
        document.querySelectorAll(".nav-link").forEach(link => {
            link.classList.remove("disabled");
            link.style.pointerEvents = "auto"; 
            link.style.opacity = "1";
        });

        //Get the current checkbox state
        const isChecked = checkbox.checked;

         // Create a new span element
         const roleNameSpan = document.createElement("span");
         roleNameSpan.className = "role-name-text";
         roleNameSpan.textContent = originalRoleName; 
         roleNameInput.replaceWith(roleNameSpan);
        
        // Update status span based on checkbox state
        statusSpan.textContent = isChecked ? "Active" : "Inactive";
        statusSpan.style.color = isChecked ? "green" : "red";
        
        // Hide toggle switch and show status span
        toggleSwitch.style.display = "none";
        statusSpan.style.display = "inline-block";

        // replace the edit button and cancel button

        editButton.textContent = "Edit";
        deleteButton.textContent = "Delete";

        editButton.classList.replace("save-btn", "edit-btn");
        deleteButton.classList.replace("cancel-btn", "delete-btn");

        editButton.removeEventListener("click", handleSaveClick);
        deleteButton.removeEventListener("click", handleCancelClick);

        editButton.addEventListener("click",handleEditClick);
        deleteButton.addEventListener("click",handleDeleteClick);
    }

    function handleCancelClick(event){
        console.log("haa m hu zinda bad");
        const roleRow = event.currentTarget.closest("tr");
        restoreUI(roleRow);
    }
    
    function handleCancelRow(roleRow){
        console.log("m samya hunnn");
        restoreUI(roleRow);
    }



    document.querySelectorAll("#rolesTableBody tr").forEach(row => {
        row.addEventListener("click", function () {
            console.log("Row clicked!");  // Ensure event is firing
            highlightedRow(this);
        });
    });

    document.querySelector('[data-section="logout"]').addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        event.stopPropagation(); // Prevent section change, if handled elsewhere
    
        // Remove authentication token from localStorage/sessionStorage
        localStorage.removeItem("jwtToken"); // If stored in localStorage
        sessionStorage.removeItem("jwtToken"); // If stored in sessionStorage
    
        // Clear authentication headers (if stored globally)
        if (window.axios) {
            delete window.axios.defaults.headers.common["Authorization"];
        }
    
        console.log("User logged out.");
    
        // Optional: Show a logout message
        alert("You have been logged out!");
    
        window.location.href = "/"; 
        
    });
    





    
});


// document.addEventListener("DOMContentLoaded", function () {
//     const mainContainer = document.querySelector(".main-content");
    
//     if (!mainContainer) {
//         console.error("Error: .main-content div not found!");
//         return;
//     }

//     // Sidebar Links Click Event
//     document.querySelectorAll(".nav-link").forEach(link => {
//         link.addEventListener("click", function (event) {
//             event.preventDefault();
            
//             document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
//             this.classList.add("active");

//             let section = this.getAttribute("data-section") + ".html";
//             console.log(section);
//             loadSection(section);
//         });
//     });

//     // Load the default section after ensuring the main container exists
//     setTimeout(() => loadSection("users.html"), 100);
// });
// function loadSection(file) {
//     fetch(file)
//         .then(response => {
//             if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//             return response.text();
//         })
//         .then(html => {
//             const container = document.querySelector(".main-content");

//             if (!container) {
//                 console.error("Error: .main-content div not found!");
//                 return;
//             }

//             container.innerHTML = html;
//             console.log("✅ Content loaded successfully!");
//         })
//         .catch(error => console.error("❌ Error loading section:", error));
// }






        // statusToggle.addEventListener("change", async function (event) {
           
        //     const previousState = isActive; // Store previous state
        //     isActive = !isActive; // Toggle state before API call
        
        //     const response = await fetch(`http://localhost:8080/updateRoleStatus/${roleId}`, {
        //         method: "PUT",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({ status: isActive })
        //     });
        
        //     if (response.ok) {
        //         console.log("Role status updated successfully!");
        //          // ✅ Update the text content
        //         switchLabel.style.background = isActive ? "#4CAF50" : "#d51717"; // Update background color
        //     } else {
        //         alert("Failed to update role status. Please try again later.");
        
        //         // Restore previous state
        //         isActive = previousState;
        //         statusToggle.checked = previousState; // Restore toggle position
        //         switchLabel.style.background = previousState ? "#4CAF50" : "#d51717"; // Restore background
        
        //         // Restore the circle's position
        //         switchSpan.style.transform = previousState ? "translate(5px, -30%)" : "translate(1px, -3%)";
        //     }
        // });
