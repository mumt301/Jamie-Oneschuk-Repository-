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
    httpGet(queryURL, getAlbums)
}


function getAlbums(xhttp) {
    let retrievedData = xhttp.responseXML;
    console.log(retrievedData);
    var discography = []; 
    let albums=retrievedData.getElementsByTagName('release-group');
    for (var i = albums.length - 1; i >=0; i--) {
        let type=albums[i].getAttribute('type');
        console.log(type);
        if(type=='Album') {
            discography.push(albums[i]);
        }
    }

}

function displayTable(discography) {
    let table = document.createElement('table');
    table.id = 'table';
    tr = document.createElement('tr');
    td1 = document.createElement('td');
    td2 = document.createElement('td');
    td1.innerHTML = "<b>Album Name<b>";
    td2.innerHTML = "<b>Date of Release<b>";
  
    
    for (row = 0; row < discography.length; row++) {
        tr = document.createElement('tr');
        td1 = document.createElement('td');
        td2 = document.createElement('td');
        td1.innerHTML = discography[row].getElementsByTagName('title')[0].innerHTML;
        td2.innerHTML = discography[row].getElementsByTagName('first-release-date')[0].innerHTML;
       
    }
    
   

window.onload = queryArtist;}