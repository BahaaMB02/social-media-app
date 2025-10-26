

// ======INFINITY SCROLL======//

let currentPage=1
  let currentEditingPostId = null;

window.addEventListener("scroll", function() {
      const endOfPage =  window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 10;

    if(endOfPage ) 
    {
       
        currentPage++;
         getAllPosts(false,currentPage);
       
    }

})  
// ======// INFINITY SCROLL //======//


 async function getAllPosts(reload=true,page) {
     try {
        let response = await fetch(`http://localhost:3000/api/post?page=${page}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        let posts = await response.json();
        let postsContainer = document.getElementById("posts");

        if (reload) {

            postsContainer.innerHTML = "";
        }
        
         let postTitle = '';
        for(let post of posts.data) {
           if(post.title!== null) { postTitle = post.title;  }

             let card=document.createElement('div')
             card.setAttribute('data-bs-theme','dark')
             card.setAttribute('data-id', post.id);
             card.setAttribute('class','card shadow rounded my-4')

            card.innerHTML += `
                        <div class="card-header d-flex" data-bs-theme="dark">
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

                                <div class="d-flex justify-content-end w-100">
                                    <div class="dropdown">
                                        <p class=" dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        </p>
                                        <ul class="dropdown-menu dropdown-menu-dark">
                                            <li><button class="dropdown-item edit" type="submit" data-bs-toggle="modal" data-bs-target="#EditPostModal">Edit</button></li>
                                            <li><button class="dropdown-item del">Delete</button></li>
                                        </ul>
                                    </div>
                                </div>
                         </div>
                           <div class="card-body">
                                    <img src="${post.image}" style="width: 100%; height: 50vh;">
                                    <h5 style="color: gray;">
                                        ${post.createdAtFormatted}
                                    </h5>
                                    
                                    <p class="card-text">${post.title}</p>
                                    <p class="d-inline-flex gap-1">

                                    <p class="text-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                        </svg>
                                        <i class="bi bi-chat-left-text"></i> (${post.comments.length}) comments
                                    </p>
                                </p>

                           </div>
                    `   
                 card.querySelector('.card-body').addEventListener('click',function postid()
                    {
                        window.location.assign(`postDetails.html?id=${post.id}`)
                    })

                card.querySelector('.del').addEventListener('click',function(){
                    deletePost(post.id)
                    })    

                     card.querySelector('.edit').addEventListener('click',function(){
                        currentEditingPostId = post.id; 
                       document.getElementById("newpostBody").value = post.body;

                    })
                    postsContainer.appendChild(card)      
        }



                    document.getElementById("editPost").addEventListener("click", async function() {
                        const token = localStorage.getItem("token");
                        const newbody = document.getElementById("newpostBody").value;
                        const newimage = document.getElementById("newpostImage").files[0];
                        if (!token) {
                            appendEditPostAlert('Faild to Edit A Post', 'warning');
                        }
                        else{
                            await editPost( currentEditingPostId, newbody, newimage);
                            appendEditPostAlert('You Edit A Post Successfully ✅', 'success');
                        }

                    })


     } catch (error) {
        console.log("Error fetching posts:", error);
     }
}



async function createPost(token, body, image) 
{

  try {
    
        let formData = new FormData();
        formData.append("title", body);
        formData.append("image", image);

        let response=await fetch("http://localhost:3000/api/post/add",{
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
       if (!response.ok) {
            throw new Error("Network response was not ok");
        }   

        let newPost = await response.json();
           
        const modalElement = document.getElementById("CreatePostModal");
        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modal.hide();

        document.getElementById("postBody").value = "";
        document.getElementById("postImage").value = "";
        getAllPosts(); 

  } catch (error) {
     console.log("Error creating post:", error);
  }
}


// Alert for successful post creation
    const alertPlaceholder = document.getElementById('CreatePostAlert')
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
 
// Event listener for creating a post 
document.getElementById("createPost").addEventListener("click", async function() {
    const token = localStorage.getItem("token");
    const body = document.getElementById("postBody").value;
    const image = document.getElementById("postImage").files[0];
    if (!token) {
        appendAlert('You must be logged in to create a post', 'warning');
    }
    else{
        await createPost(token, body, image);
        appendAlert('You Create A Post Successfully ✅', 'success');
    }

})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function editPost(postId ,newbody,newimage)
{
    try {
        let token = localStorage.getItem("token");

        let formData = new FormData();
        formData.append("title", newbody);
           if(newimage) formData.append("image", newimage);

         let response=await fetch(`http://localhost:3000/api/post/update/${postId}`,{
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData 
        });
      if (!response.ok) {
            throw new Error("Network response was not ok");
        }   
   

        getAllPosts(true,currentPage)
        const modalElement = document.getElementById("EditPostModal");
        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modal.hide();

        document.getElementById("newpostBody").value = "";
        document.getElementById("newpostImage").value = "";



    } catch (error) {
        console.log(error)
    }
}


// Alert for successful post Edit
    const editPostalert = document.getElementById('EditPostAlert')
    const appendEditPostAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    editPostalert.append(wrapper)
          const alertEl = wrapper.querySelector('.alert');
          const alert = bootstrap.Alert.getOrCreateInstance(alertEl);
          setTimeout(() => { alert.close(); }, 2000);
    }
 

async function deletePost(postId) {
    try {
        let response=await fetch(`http://localhost:3000/api/post/delete/${postId}`,{
            method: "DELETE",
            headers: {

                "Authorization": `Bearer ${token}`
            }
        });

    if (!response.ok) {
            throw new Error("Network response was not ok");
        }   
      getAllPosts(); 
        
    } catch (error) {
        console.log(error)
    }
}



getAllPosts(true,currentPage);