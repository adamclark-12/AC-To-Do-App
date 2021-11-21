function itemTemplate(item){
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button date-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button date-id="${item._id}"class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}

//initial page load render
let ourHTML = items.map(function(item){
    return itemTemplate(item)
}).join('')
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML)

//create feature
let createField = document.getElementById("create-field")
document.getElementById("create-form").addEventListener("submit",function(e){
    e.preventDefault()
    axios.post('/create-item', {text: createField.value}).then(function(response){
        document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
        createField.value = "" //clears text field for user
        createField.focus() // puts the cursor back into the text field
    }).catch(function(){
        console.log ("Error on catch side")
    })//promise

})

document.addEventListener("click", function(e){
    //Delete feature
    if(e.target.classList.contains("delete-me"))
    {
        if(confirm("Delete? Are you sure?")){
            axios.post('/delete-item', {id: e.target.getAttribute("date-id")}).then(function(){
                e.target.parentElement.parentElement.remove() //updates the edit in real time once the server is done
            }).catch(function(){
                console.log ("Error on catch side")
            })//promise

        }
    }

    //Update feature
    if(e.target.classList.contains("edit-me"))
    {
        let userInput = prompt("Enter your new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)//prepops the field with the text to be edited
        if(userInput) //IF statment stops deleting text if cancel is clicked.
        {
            axios.post('/update-item', {text: userInput, id: e.target.getAttribute("date-id")}).then(function(){
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput // updates the edit in real time once the server is done
            }).catch(function(){
                console.log ("Error on catch side")
            })//promise

        }

    }

})