function queryArtist() {
    let params = (new URL(document.location)).searchParams;
    if (params.has('artist')) {
        let artistName = params.get('artist');
        console.log(artistName);
        let mbBaseURL = "https://musicbrainz.org/ws/2/";
        let mbResource = "artist?query=";
        let queryURL = mbBaseURL + mbResource + artistName;
        console.log(queryURL);
        httpGet(queryURL, getMBID);
    }
}


function httpGet(theURL, cbFunction) {
    let xmlHttp = new XMLHttpRequest(); 
    xmlHttp.open("GET", theURL); 
    xmlHttp.send(); 
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            cbFunction(this);
        }
    };
}

function getMBID(xhttp) {
    let retrievedData = xhttp.responseXML;
    console.log(retrievedData);
    let artistData = retrievedData.getElementsByTagName('artist')[0];
    console.log(artistData);
    let artistName = artistData.getElementsByTagName('name')[0].innerHTML;
    console.log(artistName);
    let artistMBID = artistData.id;
    console.log(artistMBID);
    let mBaseURL = "https://musicbrainz.org/ws/2/release-group?artist="; 
    let queryURL = mBaseURL + artistMBID;
    console.log(queryURL);
   queryAlbums(artistMBID)
}


function getAlbums(xhttp) {
   let retrievedData = xhttp.responseXML;
   console.log(retrievedData);
   let albums=retrievedData.getElementsByTagName('release-group');
   console.log (albums)
   let placeholder = document.getElementById('placeholder');
   let tableHTML = `<table><tr><th>Album Title</th><th>Release Date</th></tr>`;
                        let albumHTML;
                        let albumTitle;
                        let releaseDate;
                        for (row=0; row<discography.length; row++)
                {

                    albumHTML=discography[row]
                    albumTitle=albumHTML.getElementsByTagName('title')[0].innerHTML;
                    releaseDate=albumHTML.getElementsByTagName('first-release-date')[0].innerHTML;
                    tableHTML += `<tr><td>${albumTitle}</td><td>${releaseDate}</td></tr>`;
                }
                
                
                
                tableHTML += `</table>`;
                placeholder.innerHTML=tableHTML;
                
                
                }

            

            window.onload = queryArtist;



       
    
   

