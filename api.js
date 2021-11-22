function queryArtist() {
    // Step 2: Parse the data submitted through the form 
    // In other words, get the parameters from the URL (@name = 'artist')
    let params = (new URL(document.location)).searchParams;
    if (params.has('artist')) {
        let artistName = params.get('artist');
        console.log(artistName);

        // Step 3: Craft the MusicBrainz call/message for requesting information about the artist
        // GET request --> type 'search'
        let mbBaseURL = "https://musicbrainz.org/ws/2/";
        let mbResource = "artist?query=";
        let queryURL = mbBaseURL + mbResource + artistName;
        console.log(queryURL);
        // Step 4–6
        httpGet(queryURL, getMBID);
        // Step 4: Make the HTTP request call to MusicBrainz and wait for its response
        // When the response is ready, it will use the callback function getMBID().
        // getMBID() will perform steps 5 and 6, parsing the response of the server
        // and rendering the results in the browser.
    }
}

/*
    Auxiliary functions
    - httpGet, function for executing the XMLHttpRequest object
    - callback functions (for each AJAX task)
*/
function httpGet(theURL, cbFunction) {
    // Step 4: Make the HTTP request call to MusicBrainz
    
    // Creates a new XMLHttpRequest object
    let xmlHttp = new XMLHttpRequest();
    
    // Specify the request method and URL of the request, and send the request to the server
    xmlHttp.open("GET", theURL);
    xmlHttp.send();
    
    // Wait for the response to be ready and store it in a variable
    xmlHttp.onreadystatechange = function () {
        // Define a function to be called when the readyState property changes
        if (this.readyState == 4 && this.status == 200) {
            // when readyState is 4 and status is 200, the response is ready
            cbFunction(this); // Then, we call the callback function to parse the response and render the appropriate results
        }
    };
}

/* Callback Function
https://www.w3schools.com/xml/ajax_xmlhttprequest_response.asp
A "callback function" is a function passed as a parameters to another function.
If you have more than one AJAX task in a website, 
you should create one function for executing the XMLHttpRequest object, 
and one callback function for each AJAX task.
The function call should contain the URL and what function to call when the response is ready.
*/
function getMBID(xhttp) {
    let retrievedData = xhttp.responseXML; // Returns the response as XML data
    console.log(retrievedData);

    // Step 5: Parse the response from the server
    let artistData = retrievedData.getElementsByTagName("artist")[0];
    console.log(artistData);
    let artistName = artistData.getElementsByTagName('name')[0].innerHTML; // => Construct this in parts: ('name'), [0], innerHTML
    console.log(artistName);
    let artistMBID = artistData.id;
    console.log(artistMBID);
    let artistCountry = artistData.getElementsByTagName("country")[0].innerHTML; // => Construct this in parts: ('country'), [0], innerHTML
    console.log(artistCountry);

    // Step 6: Render the data in the browser as bullet points
    let placeholder = document.getElementById('placeholder');
    placeholder.innerHTML = `The data for <b>${artistName}</b> is:
    <ul>
        <li><b>MusicBrainz ID</b> is <i>${artistMBID}</i></li>
        <li><b>Country</b> is <i>${artistCountry}</i></li>
    </ul>
    `
    //console.log(document);
}

// Call to the main function at loading
window.onload = queryArtist;