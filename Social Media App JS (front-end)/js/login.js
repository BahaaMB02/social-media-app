
async function login(username, password)
{
    try {
        
        let response = await fetch("http://localhost:3000/api/auth/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
               
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }   

        let data = await response.json();
        const user=data.data
        const token = data.accessToken;
       
         
       localStorage.setItem("token", token);
       localStorage.setItem("username", user.username);
       localStorage.setItem("userId", user._id); 
       localStorage.setItem("profile_image", user.profilePicture || "");
        


        renderUserUI(user.username);
        return data;
        } catch (error) {
            console.log("Error logging in:", error);
            throw error;
        }
}

async function signup(username, password ,name,email)
{
    try {

        let formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("profilePicture", document.getElementById("profileImage").files[0]);
        let response = await fetch("http://localhost:3000/api/auth/register",{
            method: "POST",
            body: formData
        })
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Signup failed with status:", response.status);
            console.error("Response body:", errorText);
            throw new Error("Network response was not ok");
        }   

        let data = await response.json();
        const user=data.data
        const token = data.accessToken;
        localStorage.setItem("token", token);
        localStorage.setItem("username", user.username);
        localStorage.setItem("profile_image", user.profilePicture || "");

        renderUserUI(user.username);
    
        
    } catch (error) {
        console.log("Error Sign up:", error);
    }
}

async function logout() {
    try {
        let token = localStorage.getItem("token");

        let response = await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
           headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
           }
        })

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("profile_image");
        renderGuestUI();
    } catch (error) {
        console.log("Error logging out:", error);
    }
}


function renderUserUI(username){
    let imageSrc = localStorage.getItem("profile_image") || "./pictures/user-profile.webp";
    let userId = localStorage.getItem("userId");

  document.getElementById("currentUser").innerHTML=`<img class="border border-1 rounded-circle" style="width: 2vw; height: 4vh;" src="${imageSrc}" alt="Profile Image">
                                <a href="userProfile.html?id=${userId}" class="nav-link active mx-3">
                                    <b>${username}</b>
                                </a>`;

  document.getElementById("signin_up").innerHTML= 
                       `
                        <button class="btn btn-outline-danger" style="border:none;" id="logout">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                        </button>`;                              

      const alertPlaceholder = document.getElementById('LogoutAlert')
        const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
        }

  document.getElementById("logout").addEventListener("click", async function() {      
     await logout();
     appendAlert('Logout successful ✅', 'warning');
     const alert = bootstrap.Alert.getOrCreateInstance('#LogoutAlert')
     setTimeout(() => {alert.close() }, 2000);
        })
  

}

function renderGuestUI(){
    document.getElementById("signin_up").innerHTML=`

                         <button class="btn btn-dark " type="button" data-bs-toggle="modal" data-bs-target="#loginModal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
                                <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                            </svg>
                        </button>
                        <button class="btn btn-dark mt-3" type="submit" data-bs-toggle="modal" data-bs-target="#signupModal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-door-open" viewBox="0 0 16 16">
                            <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
                            <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117M11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5M4 1.934V15h6V1.077z"/>
                            </svg>
                        </button>`
     
     document.getElementById("currentUser").innerHTML='Guest'

     const alertPlaceholder = document.getElementById('LoginAlert')
        const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)

          const alertEl = wrapper.querySelector('.alert');
          const alert = bootstrap.Alert.getOrCreateInstance(alertEl);
          setTimeout(() => { alert.close(); }, 2000);
        }
    

    document.getElementById("login").addEventListener("click", async function() {
    const  username = document.getElementById("username-input").value;
    const  password = document.getElementById("password-input").value;  
    
        try {
               const data=  await login(username, password);
                appendAlert(`Login successful ✅ welcome ${data.data.username}`, 'success');

                   } catch (error) {
                appendAlert('Login failed ❌', 'danger');
                }
    })

    document.getElementById("signup").addEventListener("click", async function() {
        const  name = document.getElementById("name").value;
        const  email = document.getElementById("email").value;
        const  username = document.getElementById("new_username").value;
        const  password = document.getElementById("new_password").value;       
        const profileImage = document.getElementById("profileImage").files[0];
        await signup(username, password,name,email,profileImage);
    })

}

let token = localStorage.getItem("token") || '';

if (token) {
  renderUserUI(localStorage.getItem("username")); 
} else {
  renderGuestUI();
}


