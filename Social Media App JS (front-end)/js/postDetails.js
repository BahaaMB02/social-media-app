

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

async function postDetails(postId) {
    
    try {
        let response=await fetch(`http://localhost:3000/api/post/${postId}`)
        
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        let posts = await response.json();
        let postsContainer = document.getElementById("posts");
        let postTitle = '';
        let post=posts.data
           if(post.title!== null) { postTitle = post.title;  }

             let card=document.createElement('div')
             card.setAttribute('data-bs-theme','dark')
             card.setAttribute('class','card shadow rounded my-3')

            card.innerHTML = `
                   <h2 class="m-3 text-light" style="background-color: transparent;">${posts.message}</h2>
                    <div class="card-header" data-bs-theme="dark">
                        <div class="d-flex align-items-start mb-2">
                        <!-- صورة البروفايل -->
                        <img
                            class="border border-1 rounded-circle"
                            src="${post.user.profilePicture}"
                            style="width: 40px; height: 40px; object-fit: cover;"
                        />

                        <!-- الاسم واليوزرنيم -->
                        <div class="ms-3">
                            <div class="fw-bold text-light mb-0" style="white-space: nowrap;">
                                 <a href="userProfile.html?id=${post.user._id}" class="nav-link active">
                                        ${post.user.name}
                                </a>
                            </div>
                            <div class="text-muted" style="font-size: 13px;">
                            @${post.user.username}
                            </div>
                        </div>
                    </div>
                        <div class="card-body">
                                <img src="${post.image}" style="width: 100%; height: 50vh;">
                                <h5 style="color: gray;">
                                    ${post.createdAtFormatted}
                                </h5>
                                <h5 class="card-title"> ${post.title}</h5>
                                <p class="d-inline-flex gap-1">

                                <p class="primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                    </svg>
                                 <i class="bi bi-chat-left-text"></i> (${post.comments.length}) comments
                                </p>
                            </p>
                                <div id="comments-section" >

                                </div>

                                <div>
                                    <input id="commentBody" class="w-75" type="text" placeholder="Add a comment...">
                                     <button id="addComment" type="submit">Add Comment</button>
                                </div>
                            
                        </div>
                `
                          postsContainer.innerHTML = ""; 
                          postsContainer.appendChild(card)

                          let commentsSection = document.getElementById("comments-section");
                            for (let comment of post.comments) {
                                commentsSection.innerHTML += `
                                    <div class="card card-body mb-3 p-2" style="border: none;">
                                    <div class="d-flex align-items-center mb-2">
                                        <img src="${comment.user.profilePicture}" class="rounded-circle border border-2" style="width: 40px; height: 40px; object-fit: cover;">
                                        <div class="ms-2">
                                        <b style="font-size: 14px;">${comment.user.username}</b>
                                        </div>
                                    </div>
                                    <p class="mb-0" style="font-size: 15px;">${comment.text}</p>
                                    </div>`;
                                }

                         // Event listener for adding a comment
                            document.getElementById("addComment").addEventListener("click", async function() {
                                const token = localStorage.getItem("token");
                                const body = document.getElementById("commentBody").value;
                                if (!token) {
                                    appendAlert('You must be logged in to Add a Comment', 'warning');
                                }
                                else if(body.trim()==="")
                                {
                                    appendAlert("You Can't Add an Empty Comment", 'warning');
                                }
                                else{
                                    await addComment(token, body);
                                    appendAlert('You Create A Comment Successfully ✅', 'success');
                                }

                            }) 

                            document.getElementById("commentBody").addEventListener("keydown",async function(event)
                                {
                                       if (event.key === "Enter") {
                                            event.preventDefault(); 
                                                const token = localStorage.getItem("token");
                                                const body = document.getElementById("commentBody").value;
                                                if (!token) {
                                                    appendAlert('You must be logged in to Add a Comment', 'warning');
                                                }
                                                else if(body.trim()==="")
                                                {
                                                    appendAlert("You Can't Add an Empty Comment", 'warning');
                                                }
                                                else{
                                                    await addComment(token, body);
                                                    appendAlert('You Create A Comment Successfully ✅', 'success');
                                                }
                                        } 
                                })
            


    } catch (error) {
        console.log(error)
    }
    
    
}

async function addComment(token, body) 
{

  try {
        let response=await fetch(`http://localhost:3000/api/post/${postId}/addcomment`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                text:body
            })
        });
       if (!response.ok) {
            const errorText = await response.text();
            console.error("Signup failed with status:", response.status);
            console.error("Response body:", errorText);
            throw new Error("Network response was not ok");
        }   

        let newPost = await response.json();
           
        document.getElementById("commentBody").value = "";
        postDetails(postId)

  } catch (error) {
     console.log("Error creating post:", error);
  }
}


// Alert for successful add a comment 
    const alertPlaceholder = document.getElementById('AddCommentAlert')
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
 



postDetails(postId);

