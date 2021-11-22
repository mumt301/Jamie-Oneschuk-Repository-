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
    httpGet(queryURL,getAlbums);
    getAlbums(artistMBID)
}


function getAlbums(xhttp) {
   let retrievedData = xhttp.responseXML;
   console.log(retrievedData);
   let albums=retrievedData.getElementsByTagName('release-group');
   let placeholder = document.getElementById('placeholder');
   let i=row
   let table = "<table><tr><th>Title</th><th>Date</th></tr>";
   for (let i=0;i<albums.length; i++){
   let data = albums[row];
   let AlbumNames = data.getElementsByTagName("title")[0].innerHTML;
   console.log(AlbumNames);
   let AlbumDates = data.getElementsByTagName("first-release-date")[0].innerHTML;
   console.log(AlbumDates);
   table += "<tr><td>" + AlbumNames + "</td>" + "<td>" + AlbumDates + "</td><tr>"
   }
   table += "</table>" 
   placeholder.innerHTML = table;
   }
window.onload = queryArtist;