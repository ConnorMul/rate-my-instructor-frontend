// class InstructorCard {
//     constructor(instructorData) {
//         this.instructorData = instructorData
//     }

//     updateLikes = () => {
//         this.instructorObj.likes++


//     }

//     render = () => {
//         this.card = document.createElement("div")
//         const imageDiv = document.createElement("div")
//         const instructorImg = document.createElement("img")
//         const instructorH4 = document.createElement("h4")
//         this.likeButton = document.createElement("button")
        

//         this.card.classList.add("instructor")
//         imageDiv.classList.add("image")

//         instructorH4.classList.add("instructor-name")
//         instructorH4.textContent = this.instructorData.name

//         instructorImg.src = this.instructorData.image

//         this.likeButton.classList.add("#like-button")
//         this.likeButton.textContent = `${this.instructorData.likes} Likes`
//         this.likeButton.dataset.id = this.instructorData.id

//         this.likeButton.addEventListener("click", this.updateLikes)

//         const instructorContainer = document.querySelector(".instructor-container")
//         imageDiv.append(instructorImg)
//         this.card.append(imageDiv, instructorH4, this.likeButton)
//         instructorContainer.append(this.card)
//     }
// }

// function initialize() {
//     client.get("/instructors")
//     .then((instructorsArray) => {
//         instructorsArray.forEach((instructorPostObj) => {
//             const instructor = new InstructorCard(instructorPostObj)
//             instructor.render()
//         })
//     })
// }

// initialize()