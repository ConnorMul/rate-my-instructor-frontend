
//************* DOM ELEMENTS *************//
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
const divLoginForm2 = document.querySelector(`#div-login-form2`) //This is for the popup after logging in
const instructorImg = document.querySelector("img")
const bioHeader = document.querySelector("#bio-header")


instructorList.innerHTML = ""

let globalLoginedUserID = null; 
let viewedInstructorID = 27 // change this when reseed.

let clickedEasterEgg = 0; 


//*************  FETCH FUNCTIONS *************//

function fetchOneInstructor(id) {
    client.get(`/instructors/${id}`)
    .then(instructorObj => renderInstructor(instructorObj))
}

function fetchAllInstructors() {
    instructorList.innerHTML = ''
    client.get("/instructors")
    .then(instructorArray => instructorArray.forEach(renderInstructorNavBar))
}



//************ RENDER FUNCTIONS ***************//

let renderInstructor = (instructorObj) => {
    instructorImg.src = instructorObj.image
    instructorName.textContent = instructorObj.name
    instructorSchool.textContent = instructorObj.school
    bioHeader.textContent = `Here's a little bit about ${instructorObj.name}...`
    instructorBio.textContent = instructorObj.bio
    instructorLikes.textContent = `${instructorObj.likes} Likes`
    instructorLikes.dataset.id = instructorObj.id
    commentForm.dataset.id = instructorObj.id
    targetID = instructorObj.id
    instructorComments.innerHTML = ''
    

    clickedEasterEgg = 0;

    instructorObj.comments.forEach((comment) => {
        let commentLi = document.createElement("li")
        commentLi.dataset.id = comment.id


        let agreeButton = document.createElement("button")
        agreeButton.dataset.id = comment.id
        agreeButton.classList.add("comment-button")
        let deleteButton = document.createElement("button")
        deleteButton.classList.add("hidden-button")

        commentLi.textContent = `${comment.content}   `
        agreeButton.textContent = `${comment.agree} agree with this`
            
        if (comment.user_id === globalLoginedUserID) {
            
            deleteButton.classList.remove("hidden-button")
            deleteButton.classList.add("comment-button")
            deleteButton.dataset.id = comment.id
            deleteButton.innerText = "Delete"

           
            deleteButton.addEventListener("click", () => {
                client.delete(`/comments/${deleteButton.dataset.id}`)
                .then(commentObj => commentLi.remove())
            })
            // commentLi.textContent += "This is your comment (TEST)"
        }
        //console.log(comment.user_id)


        commentLi.append(agreeButton, deleteButton)
        instructorComments.append(commentLi)


    })
}


function renderInstructorNavBar(instructorObj) {
    let instructorLi = document.createElement("li")
    
    instructorLi.textContent = instructorObj.name
    instructorLi.dataset.id = instructorObj.id

    instructorList.append(instructorLi)
}


//************ EVENT LISTENERS ************//

instructorList.addEventListener("click", evt => {
    if (evt.target.matches("li")) {
        let id = evt.target.dataset.id
        instructorComments.innerHTML = "";
        fetchOneInstructor(id);
        viewedInstructorID = id;
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

instructorComments.addEventListener("click", evt => { //Adds the like to a comment
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

commentForm.addEventListener("submit", event => { //New Comment 
    event.preventDefault();

    let newComment = event.target.content.value 

    dataObj = { 
        content: newComment, 
        agree: 1, 
        user_id: globalLoginedUserID, 
        instructor_id: targetID
    }

    if (globalLoginedUserID !== null) {
     client.post('/comments', dataObj)
     .then(commentObj => fetchOneInstructor(targetID))
    } else {
        console.error("You must be logged in to leave a comment")
    }
    event.target.reset()
})

instructorForm.addEventListener("submit", evt => { //Addes a new Instructor
    evt.preventDefault()

    let newInstructorName = evt.target.name.value
    let newInstructorYearsTeaching = evt.target.years_teaching.value
    let newInstructorBio = evt.target.bio.value
    let newInstructorImage = evt.target.img.value


    let dataObj = {
        name: newInstructorName,
        years_teaching: newInstructorYearsTeaching,
        bio: newInstructorBio,
        school: "Flatiron School",
        likes: 1,
        image: newInstructorImage
    }

    client.post('/instructors', dataObj)
    .then(instructorObj => fetchAllInstructors())

    document.getElementById("instructor-form").reset();
})

loginForm.addEventListener("submit", evt => {  //The Login function 
    evt.preventDefault()
    let loginUsername = evt.target.username.value
    fetchOneInstructor(viewedInstructorID); //render's if comments is made by the user. 

    divLoginForm2.style.display = "block"; //Style changes, shows the login box and hides the welcome user box
    divLoginForm.style.display = "none";

    userDisplay = document.querySelector("#username-container")
    userDisplay.textContent = `Welcome ${loginUsername}`

    client.get("/users")
    .then(userArray => checkUser(userArray, loginUsername))

    
    logoutButton = document.querySelector('#div-login-form2 > div')

    logoutButton.addEventListener("click", event =>{
        globalLoginedUserID = null;                     //resets global var and renders page again so it will not show 
        fetchOneInstructor(viewedInstructorID);         //which comments the user owened
    } )
    

})

function checkUser (userArray, loginUsername) {
    //let index = userArray.find( userObj => userObj.username == loginUsername)
    //find method not working 
    let checked = false; 

    userArray.forEach( userObj => {   //This loop checks the login name to see if it needs to be added to the backend
        if (userObj.username === loginUsername){
        globalLoginedUserID = userObj.id; 
        checked = true; 
        }
    })

    if (checked == false) {             //Adds the new login name to the back end, then changes the global logined user
        dataObj = {username: loginUsername}
        client.post("/users", dataObj)  
        .then(response => globalLoginedUserID = response.id)
    }

}

function addEasterEgg(){ //I'm so sorry -Jason

    pageName = document.querySelector('body > main > h2')
    //console.log(pageName.textContent)
         
    instructorImg.addEventListener("click", () => {
        clickedEasterEgg++;
        //console.log(clickedEasterEgg)
        let isIan = (pageName.textContent === "Ian")

        if (9 < clickedEasterEgg && clickedEasterEgg <=12 && isIan) {
            instructorImg.src = './imgs/IanJoker.png'
        }
        else if (clickedEasterEgg === 13 && isIan){
            instructorImg.src = './imgs/Ian1.png'
        }
        else if (clickedEasterEgg === 15 && isIan){
            instructorImg.src = './imgs/Ian2.jpg'
        }
        else if (clickedEasterEgg === 17 && isIan){
            instructorImg.src = './imgs/Ian3.jpg'
        }
        else if (clickedEasterEgg === 19 && isIan){
            instructorImg.src = './imgs/Ian4.jpg'
        }
        else if (clickedEasterEgg === 21 && isIan){
            instructorImg.src = './imgs/Ian5.jpg'
        }
        else if (clickedEasterEgg === 23 && isIan){
            instructorImg.src = './imgs/Ian6.jpg'
        }
        else if (clickedEasterEgg === 25 && isIan){
            instructorImg.src = './imgs/Ian7.jpg'
        }
        else if (clickedEasterEgg === 27 && isIan){
            instructorImg.src = './imgs/Ian8.jpg'
        }
        else if (clickedEasterEgg === 29 && isIan){
            instructorImg.src = './imgs/Ian9.jpg'
        }
        else if (clickedEasterEgg === 31 && isIan){
            instructorImg.src = './imgs/Ian10.png'
        }
        else if(clickedEasterEgg === 32){
            clickedEasterEgg = 10;
        }
    })
    


}

// INITIAL RENDER
fetchOneInstructor(27)
fetchAllInstructors()

//EasterEggs and more 
addEasterEgg();



