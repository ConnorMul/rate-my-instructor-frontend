
// DOM ELEMENTS
const instructorName = document.querySelector("h2")
const instructorSchool = document.querySelector("h3")
const instructorBio = document.querySelector("#bio")
const instructorLikes = document.querySelector("#likes")
const instructorComments = document.querySelector("#comments")
const instructorList = document.querySelector("#instructor-list")
const commentForm = document.querySelector(`#comment-form`)
const instructorForm = document.querySelector(`#instructor-form`)
const navbar = document.querySelector("#navbar")
const loginForm = document.querySelector(`#login-form`)
const divLoginForm = document.querySelector(`#div-login-form`)
const instructorImg = document.querySelector("img")

instructorList.innerHTML = ""

let globalLoginedUser = null; //not being used
let isUserUnique = false; 
let targetID = null; //not being used 


// FETCH FUNCTIONS
function fetchOneInstructor(id) {
    client.get(`/instructors/${id}`)
    .then(instructorObj => renderInstructor(instructorObj))
}

function fetchAllInstructors() {
    instructorList.innerHTML = ''
    client.get("/instructors")
    .then(instructorArray => instructorArray.forEach(renderInstructorNavBar))
}


// RENDER FUNCTIONS
let renderInstructor = (instructorObj) => {
    instructorImg.src = instructorObj.image
    instructorName.textContent = instructorObj.name
    instructorSchool.textContent = instructorObj.school
    instructorBio.textContent = instructorObj.bio
    instructorLikes.textContent = `${instructorObj.likes} Likes`
    instructorLikes.dataset.id = instructorObj.id
    commentForm.dataset.id = instructorObj.id
    targetID = instructorObj.id
    instructorComments.innerHTML = ''
    
        
    instructorObj.comments.forEach((comment) => {
        let commentLi = document.createElement("li")
        commentLi.dataset.id = comment.id


        let agreeButton = document.createElement("button")
        agreeButton.dataset.id = comment.id

        commentLi.textContent = comment.content
        agreeButton.textContent = `${comment.agree} agree with this`
            
        commentLi.append(agreeButton)
        instructorComments.append(commentLi)
    })
}

function renderInstructorNavBar(instructorObj) {
    let instructorLi = document.createElement("li")
    
    instructorLi.textContent = instructorObj.name
    instructorLi.dataset.id = instructorObj.id

    instructorList.append(instructorLi)
}



// EVENT LISTENERS

instructorList.addEventListener("click", evt => {
    if (evt.target.matches("li")) {
        //console.log(evt.target.dataset.id)
        let id = evt.target.dataset.id

        instructorComments.innerHTML = "";
        fetchOneInstructor(id);

    }
})

instructorLikes.addEventListener("click", evt => {

    const id = evt.target.dataset.id
    const likesStr = instructorLikes.innerHTML.slice(0, -5)
    let likesNum = parseInt(likesStr);
    likesNum++

    dataObj = {
        likes: likesNum
    }
    
    client.patch(`/instructors/${id}`, dataObj)
    .then(instructorObj => instructorLikes.textContent = `${instructorObj.likes} Likes`)
})

instructorComments.addEventListener("click", evt => {
    if(evt.target.matches("button")) {
        const id = evt.target.dataset.id
        const agreeButton = evt.target
        const agreeStr = agreeButton.innerHTML.slice(0, -16)
        agreeNum = parseInt(agreeStr)
        agreeNum++

        dataObj = {
            agree: agreeNum
        }

        client.patch(`/comments/${id}`, dataObj)
        .then(commentObj => agreeButton.textContent = `${commentObj.agree} agree with this`)
    }
})

commentForm.addEventListener("submit", event => {
    event.preventDefault();

    let newComment = event.target.content.value 

    dataObj = { 
        content: newComment, 
        agree: 1, 
        user_id: 11, 
        instructor_id: targetID
    }

     client.post('/comments', dataObj)
     .then(commentObj => fetchOneInstructor(targetID))

})

instructorForm.addEventListener("submit", evt => {
    evt.preventDefault()

    let newInstructorName = evt.target.name.value
    let newInstructorYearsTeaching = evt.target.years_teaching.value
    let newInstructorBio = evt.target.bio.value


    let dataObj = {
        name: newInstructorName,
        years_teaching: newInstructorYearsTeaching,
        bio: newInstructorBio,
        school: "Flatiron",
        likes: 1
    }

    client.post('/instructors', dataObj)
    .then(instructorObj => fetchAllInstructors())

    document.getElementById("instructor-form").reset();
})



loginForm.addEventListener("submit", evt => { //Logins in the wrong wayy
    evt.preventDefault()
    isUserUnique = false;

    let loginUsername = evt.target.username.value
    //document.cookie = `username=${username}`
    //console.log(document.cookie)


    client.get("/users")
    // //.then(userArray => console.log(userArray.find( userObj => userObj.username === "loginUsername" )))
    .then(userArray => checkUser(userArray, loginUsername))

    if (isUserUnique === true){
            console.log("making Post request")
            dataObj = { username: loginUsername }
            // client.post("/users", dataObj)
            // .then(response => console.log(response.id))
    }


    divLoginForm.innerHTML = ''

    let newContent = document.createElement("p")
    newContent.dataset.id = 1
    newContent.id = "username-container"
    newContent.textContent = `Welcome ${loginUsername}`
    
    let newButton = document.createElement("button")
    newButton.textContent = `Log Out`

    divLoginForm.append(newContent)
    divLoginForm.append(newButton)

    
    logoutButton = document.querySelector('#div-login-form > button')
    //console.log(logoutButton)

    logoutButton.addEventListener("click", event =>{
        evt.preventDefault()
        //console.log(event.target)

        globalLoginedUser = null; 
        divLoginForm.innerHTML = ''

    //     divLoginForm.innerHTML = `
    //     <form  class="form-container" id="login-form">
    //     <h4>Login</h4>
    
    //     <label for="email"><b>Username</b></label>
    //     <input type="text" placeholder="Enter Username" name="username" required>
    
    //     <!-- <label for="psw"><b>Password</b></label>
    //     <input type="password" placeholder="Enter Password" name="psw" required> -->
    
    //     <button type="submit" class="btn">Login</button>
    //     <button type="button" class="btn cancel" onclick="closeForm()">Close</button>
    //   </form>
    //     `
    } )

})




function checkUser (userArray, loginUsername) {

    //let index = userArray.find( userObj => userObj.username == loginUsername)
    //find not working 

    let checked = false; 

    userArray.forEach( userObj => {if (userObj.username === loginUsername){
        checked = true; 
        isUserUnique = true;
        }
    })

    //console.log(loginUsername, checked)

    // if (checked == false) {
    //     //console.log("test")
    //     dataObj = {username: loginUsername}
    //     client.post("/users", dataObj)
        
    // }

}

// INITIAL RENDER
fetchOneInstructor(21)
fetchAllInstructors()
