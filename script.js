//1. Getting DOM Elements first
const resultElement = document.getElementById('result');
const pokemonImageElement = document.getElementById('pokemonImage');
const optionsContainer = document.getElementById('options');
const pointsElement = document.getElementById('pointsValue');
const totalCount = document.getElementById('totalCount');
const mainContainer = document.getElementsByClassName('container');
const loadingContainer = document.getElementById('loadingContainer');

//8.1 Initialize variables
// This is gonna store past questions so we dont have repeating questions
let usedPokemonIds = [];
//15.3 Initial count for the total of questions answered
let count = 0
// Initial points for the total of questions correct
let points = 0
let showLoading = false

//2. Creating function to fetch Pokemon with ID
async function fetchPokemonById(id) {
    showLoading = true
    //response is fetching info from the pokeapi
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    //data is waiting for response to finish and then turning the info into 'json' or raw data for the pokemon 
    const data = await response.json()
    return data
    //finishing up the function by returning all the information
}

//3. Test your function to see what its retrieving
// async function testFetch() {
//     //*pokemon is calling the function fetchPokemonByID to retrieve whatever we're looking for
//     const pokemon = await fetchPokemonById(getRandomPokemonId())
//     console.log(pokemon)
//     //*then just console logging it
// }
// //4. This just calls the test function
// testFetch()

//6. Making a function to load questions with random options
async function loadQuestionsWithOptions() {
    if (showLoading) {
        showLoadingWindow();
        hidePuzzleWindow( )
    }
//7. Fetch correct answer first
    let pokemonId = getRandomPokemonId();

//8.2 Check if current question had already been used
// the while loops just checks if the id already exists in the used questions and it just loops over and over until we get a new ID
    while (usedPokemonIds.includes(pokemonId)) {
        pokemonId = getRandomPokemonId()
    }

//8.3 Everytime we get a new ID, its gonna be added to the usedPokemonIds array and set as the new const\
//this pushes the current unique pokemon into the usedPokemonId array so we dont use it again
    usedPokemonIds.push(pokemonId)
// pokemon will give you the current unique pokemon but await makes it wait for fetchPokemonById to finish
    const pokemon = await fetchPokemonById(pokemonId)

//9. Create the options array for the question

    const options = [pokemon.name]
    const optionsIds = [pokemon.id]

//10. Get the rest of the random Pokemon names for the options
    while (options.length < 4) {
        let randomPokemonId = getRandomPokemonId()
//10.1 Ensure that the right option doesnt exist in the rest of the options for no duplicates, we're using a loop using the correct pokemon id until we get one thats unique
        while (optionsIds.includes(randomPokemonId)) {
            randomPokemonId = getRandomPokemonId()
        }
        // this pushes the new pokemon.id into the array optionsId to keep track
        optionsIds.push(randomPokemonId)

//10.2 Using randomPokemonId, we can wait for the function to run then getting the id and taking the name then pushing it into the word choices
        //this waits specifically for randomPokemonId to get a unique pokemon.id 
        const randomPokemon = await fetchPokemonById(randomPokemonId)
        //this gives randomOption the name of the pkm from randomPokemon's id
        const randomOption = randomPokemon.name
        //this puts that name into the word choices
        options.push(randomOption)

//10.3 Testing the option choices
console.log(options)
console.log(optionsIds)
        //16.5 Turn off loading icon if all options loaded
        if (options.length === 4) {
            showLoading = false
        }
    }

    shuffleArray(options)

//13. Clear previous question and answer and update the img for the next question
    resultElement.textContent = "Who's That Pokemon?";
    //this changes the sprite on the webpage accordingly to the pokemon 
    pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default

//14. Create options HTML element using options array from part 9
    //creates and sets the container for the options as empty and removing all buttons
    optionsContainer.innerHTML = "";
    //for each option, it takes that and runs it through creating a button
    options.forEach((option) => {
        //which then we create a button for each option
        const button = document.createElement("button");
        //putting the text/name of the pkm as the button text content
        button.textContent = option;
        //this checks our answer when we click on the button (not done yet)
        button.onclick = (event) =>  checkAnswer(option === pokemon.name, event);
        //this attaches the buttons we made into the empty optionsContainer
        optionsContainer.appendChild(button)
    })

    if (!showLoading) {
        hideLoadingWindow();
        showPuzzleWindow()
    }
}

//15. Make a function for checkAnswer
function checkAnswer(isCorrect, event) {
    //15.1 Checks if any button is already selected, if not then theres no element and returns null
        const selectedButton = document.querySelector('.selected')
    //15.2 If a button is already selected, then nothing happens and it exits the function
        if (selectedButton) {
            return
        }
    
    //15.4 This adds a selected class to the button so we know which one we clicked
        event.target.classList.add("selected")
        // then it adds one to the count and shown in the counter under the options
        count++;
        totalCount.textContent = count;

        if (isCorrect) {
            // if isCorrect returns true then it will call the function displayResult
            displayResult("Correct answer!")
            // then it increases the points total
            points++;
            pointsElement.textContent = points
            event.target.classList.add('correct')
        } else {
            displayResult("Wrong answer...")
            event.target.classList.add('wrong')
        }

        //Load next question with 1s delay so user can read the result
        // this will show the loading icon then will call the loadQuestionsWithOptions function again for a new question
        setTimeout(() => {
            showLoading = true
            loadQuestionsWithOptions()
      }, 1000)

    }


//11 Calling the entire question function for it to load
loadQuestionsWithOptions()

// --- UTILITY FUNCTION ---

//5. Make a function to randomize the pokemon ID for the game
function getRandomPokemonId() {
    //Math.random gives you a random number from 0 to 1 not inclusive with 1, then Math.floor rounds down
    return Math.floor(Math.random() * 151) + 1
}


//12 Make a function to shuffle the options array
function shuffleArray(array) {
    //** not sure check after  
    return array.sort(() => Math.random() - 0.5)
}

//15.5 Make a function to update the result and class name
function displayResult(result) {
    resultElement.textContent = result
}

//17. Hide loading
function hideLoadingWindow() {
    loadingContainer.classList.add("hide")
}

//18. Show loading window
function showLoadingWindow() {
    mainContainer[0].classList.remove("show")
    loadingContainer.classList.remove("hide")
    loadingContainer.classList.add('show')
}

//19 Show puzzle window
function showPuzzleWindow() {
    loadingContainer.classList.remove("show")
    mainContainer[0].classList.remove("hide")
    mainContainer[0].classList.add('show')
}

//20 Hide puzzle window
function hidePuzzleWindow() {
    mainContainer[0].classList.add("hide")
}