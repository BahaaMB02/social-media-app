const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("id");

async function loadUserProfile(userId) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/api/user/posts/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        const user = data.data;

        console.log(user.posts)
        renderUserInfo(user);
        renderUserPosts(user.posts,user);

    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
}

function renderUserInfo(user) {
    const container = document.getElementById("userProfile");

    container.innerHTML = `
     <div class="mt-5 pt-5 text-center">
        <img class="profile-img rounded-circle border border-2" src="${user.profilePicture}" alt="صورة المستخدم" />
        <h2 class="mt-3">${user.name}</h2>
        <p class="text-secondary">@${user.username}</p>
        <hr class="text-light">
    </div>
    `;
}


function renderUserPosts(posts , user) {
       const postsContainer = document.getElementById("userPosts");
    postsContainer.innerHTML = ""; // فرغ الحاوية قبل البدء

    if (!posts || posts.length === 0) {
        postsContainer.innerHTML = `<p class="text-center text-light">No posts yet.</p>`;
        return;
    }

    for(let post of posts){
        const card = document.createElement('div');
        card.setAttribute('data-bs-theme', 'dark');
        card.className = 'card shadow rounded my-3';

        card.innerHTML = `
            <div class="card-header" data-bs-theme="dark">
                <div class="d-flex align-items-start mb-2">
                    <img
                        class="border border-1 rounded-circle"
                        src="${user.profilePicture}"
                        style="width: 40px; height: 40px; object-fit: cover;"
                        alt="صورة البروفايل"
                    />
                    <div class="ms-3">
                        <div class="fw-bold text-light mb-0" style="white-space: nowrap;">
                            ${user.name}
                        </div>
                        <div class="text-muted" style="font-size: 13px;">
                            @${user.username}
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                ${post.image ? `<img src="${post.image}" style="width: 100%; height: 50vh; object-fit: cover;">` : ''}
                <h5 style="color: gray;">${post.createdAtFormatted}</h5>
                <h5 class="card-title">${post.title}</h5>

                <p class="d-inline-flex gap-1 primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                    </svg>
                    <i class="bi bi-chat-left-text"></i> (${post.comments.length}) comments
                </p>
            </div>
        `;
                     card.querySelector('.card-body').addEventListener('click',function postid()
                    {
                        window.location.assign(`postDetails.html?id=${post.id}`)
                    })

            postsContainer.appendChild(card);
    };
}

// Initialize
loadUserProfile(userId);
