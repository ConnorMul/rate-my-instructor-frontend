
// DOM ELEMENTS
const instructorName = document.querySelector("h1")
const instructorSchool = document.querySelector("h3")
const instructorBio = document.querySelector("#bio")
const instructorLikes = document.querySelector("#likes")
const instructorComments = document.querySelector("#comments")
const instructorList = document.querySelector("#instructor-list")
const commentForm = document.querySelector(`#comment-form`)
const instructorForm = document.querySelector(`#instructor-form`)
instructorList.innerHTML = ""

let targetID = null;

// FETCH FUNCTIONS
function fetchOneInstructor(id) {
    fetch(`http://localhost:3000/instructors/${id}`)
    .then(resp => resp.json())
    .then(instructorObj => renderInstructor(instructorObj))
}

function fetchAllInstructors() {
    instructorList.innerHTML = ''
    fetch("http://localhost:3000/instructors")
    .then(resp => resp.json())
    .then(instructorArray => instructorArray.forEach(renderInstructorNavBar))
}


// RENDER FUNCTIONS
function renderInstructor(instructorObj) {
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

function instructorArray(instructorObj){

    


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
    
    const configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
           likes: likesNum
        })
    }

    fetch(`http://localhost:3000/instructors/${id}`, configObj)
    .then(resp => resp.json())
    .then(instructorObj => instructorLikes.textContent = `${instructorObj.likes} Likes`)
})

instructorComments.addEventListener("click", evt => {
    if(evt.target.matches("button")) {
        const id = evt.target.dataset.id
        const agreeButton = evt.target
        const agreeStr = agreeButton.innerHTML.slice(0, -16)
        agreeNum = parseInt(agreeStr)
        agreeNum++
       
        
        const configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
               agree: agreeNum
            })
        }

        fetch(`http://localhost:3000/comments/${id}`, configObj)
        .then(resp => resp.json())
        .then(commentObj => agreeButton.textContent = `${commentObj.agree} agree with this`)
    }
})

commentForm.addEventListener("submit", event => {
    event.preventDefault();

    let newComment = event.target.content.value 

    console.log(newComment)

    data = { 
        content: newComment, 
        agree: 1, 
        user_id: 1, 
        instructor_id: targetID
    }

    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(data)
    }

    fetch(`http://localhost:3000/comments/`, configObj)
    .then(response => response.json())
    //.then(commentObj => console.log(commentObj))
    .then(commentObj => fetchOneInstructor(targetID))

})

instructorForm.addEventListener("submit", evt => {
    evt.preventDefault()

    let newInstructorName = evt.target.name.value
    let newInstructorYearsTeaching = evt.target.years_teaching.value
    let newInstructorBio = evt.target.bio.value


    let data = {
        name: newInstructorName,
        years_teaching: newInstructorYearsTeaching,
        bio: newInstructorBio,
        school: "Flatiron",
        likes: 1
    }

    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(data)
    }

    fetch(`http://localhost:3000/instructors/`, configObj)
    .then(resp => resp.json())
    //.then(instructorObj => console.log(instructorObj))
    .then(instructorObj => fetchAllInstructors())
})

// INITIAL RENDER
fetchOneInstructor(1)
fetchAllInstructors()
