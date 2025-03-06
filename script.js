let allArticlesElm = document.getElementById("allArticles")
let loaderElm = document.getElementById("loader")
let errorMessageElm = document.getElementById("errorMessage")
let searchInput = document.getElementById("searchInput");


function setErrorDisplay(){
	loaderElm.style.display = "none"
	allArticlesElm.style.display = "none"
	errorMessageElm.style.display = "block"
	}

// Function to convert Google Drive image link
function convertDriveLink(originalLink) {
    // Extract the file ID from the original link
    const fileIdMatch = originalLink.match(/(?:\/file\/d\/|id=)([^\/\?]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        // Construct the new link
        const convertedLink = `https://lh3.google.com/u/0/d/${fileId}`;
        return convertedLink;
    } else {
        // Return the original link if the file ID couldn't be extracted
        return originalLink;
    }
}


function resetArticleDisplay() {
    const articles = document.getElementsByClassName("article");

    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        article.style.display = "inline-block";
    }
}

searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();

    const articles = document.getElementsByClassName("article");
    let matchFound = false;

    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const articleName = article.querySelector("h2").textContent.toLowerCase();
        const articleDescription = article.querySelector("p").textContent.toLowerCase();

        // Check if the article name or description contains the search term
        const isMatch = articleName.includes(searchTerm) || articleDescription.includes(searchTerm);

        // Toggle a class to control visibility
        article.style.display = isMatch ? "inline-block" : "none";

        // Update matchFound based on whether any article matches the search term
        if (isMatch) {
            matchFound = true;
        }
    }

    // Display a message when no matching articles are found
    const noResultsMessage = document.getElementById("noResultsMessage");
    if (!matchFound) {
        noResultsMessage.style.display = "block";
    } else {
        noResultsMessage.style.display = "none";
    }

    // Display all articles when the search bar is cleared
    if (searchTerm === "") {
        resetArticleDisplay();
        noResultsMessage.style.display = "none";
    }
});

function enlargeImage(imgSrc) {
    // Create a modal for displaying the enlarged image
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Create an image element in the modal
    const enlargedImage = document.createElement('img');
    enlargedImage.src = imgSrc;

    // Append the image to the modal
    modal.appendChild(enlargedImage);

    // Append the modal to the body
    document.body.appendChild(modal);

    // Close the modal when clicking outside the image
    modal.addEventListener('click', function() {
        modal.remove();
    });
}

// Event delegation for dynamically created elements
document.body.addEventListener('click', function(event) {
    const clickedElement = event.target;

    // Check if the clicked element is an article image
    if (clickedElement.classList.contains('image')) {
        // Get the source of the clicked image
        const imgSrc = clickedElement.src;

        // Enlarge the image
        enlargeImage(imgSrc);
    }
});

fetch("https://api.apispreadsheets.com/data/WifCHFsQzJkJ7OQA/").then(res=>{
    if (res.status === 200){
        // SUCCESS
        res.json().then(data=>{
            const yourData = data["data"]
            for (let i=0; i<yourData.length; i++) {
                let rowInfo = yourData[i]

                let rowInfoDiv = document.createElement("div")
                rowInfoDiv.classList.add("article")

                let rowName = document.createElement("h2")
                let rowNameNode = document.createTextNode(rowInfo["Name"])
                rowName.appendChild(rowNameNode)
                // rowName.classList.add("h2")

                let rowImage = document.createElement("img")
                rowImage.src = convertDriveLink(rowInfo["Image"]); // Convert the Google Drive link
                rowImage.alt = 'Article_Image'
                rowImage.classList.add("image")

                let rowDescription = document.createElement("p")
                let rowDescriptionNode = document.createTextNode(rowInfo["Description"])
                rowDescription.appendChild(rowDescriptionNode)
                // rowDescription.classList.add("p")

                let rowPrice = document.createElement("p")
                let rowPriceNode = document.createTextNode(rowInfo["Price"])
                rowPrice.appendChild(rowPriceNode)
                rowPrice.classList.add("price")

                rowInfoDiv.appendChild(rowName)
                rowInfoDiv.appendChild(rowImage)
                rowInfoDiv.appendChild(rowDescription)
                rowInfoDiv.appendChild(rowPrice)

                allArticlesElm.appendChild(rowInfoDiv)
            }
            
            loaderElm.style.display = "none"
            allArticlesElm.style.display = "block"
            errorMessageElm.style.display = "none"

        }).catch(err => {
                setErrorDisplay()
            })
    }else{
        setErrorDisplay()
    }
}).catch(err =>{
        setErrorDisplay()
    })