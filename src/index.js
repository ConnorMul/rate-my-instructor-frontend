
// DOM ELEMENTS
let instructorName = document.querySelector("h1")
let instructorSchool = document.querySelector("h3")
let instructorBio = document.querySelector("#bio")
let instructorLikes = document.querySelector("#likes")
let instructorComments = document.querySelector("#comments")
let instructorList = document.querySelector("#instructor-list")
instructorList.innerHTML = ""

// FETCH FUNCTIONS
function fetchOneInstructor(id) {
    fetch(`http://localhost:3000/instructors/${id}`)
    .then(resp => resp.json())
    .then(instructorObj => renderInstructor(instructorObj))
}

function fetchAllInstructors() {
    fetch("http://localhost:3000/instructors")
    .then(resp => resp.json())
    .then(data => console.log(data))
}


// RENDER FUNCTIONS
function renderInstructor(instructorObj) {
    instructorName.textContent = instructorObj.name
    instructorSchool.textContent = instructorObj.school
    instructorBio.textContent = instructorObj.bio
    instructorLikes.textContent = `${instructorObj.likes} Likes`
        
    instructorObj.comments.forEach((comment) => {
        let commentLi = document.createElement("li")
        commentLi.dataset.id = comment.instructor_id

        let agreeButton = document.createElement("button")

        commentLi.textContent = comment.content
        agreeButton.textContent = `${comment.agree} agree with this`
            
        commentLi.append(agreeButton)
        instructorComments.append(commentLi)
    })
}




// EVENT LISTENERS


// INITIAL RENDER
fetchOneInstructor(1)
fetchAllInstructors()
//     let instructorLi = document.createElement("li")
//     instructorLi.textContent = instructorObj.name
//     instructorLi.addEventListener("click", render)
    
    
//     instructorList.append(instructorLi)