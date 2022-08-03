
if(!newCampground){
    //override default app.css settings.
    document.querySelector('#lon').style.display = "block";
    document.querySelector('#lat').style.display = "block";
}

//helper function to validate gps coords
function validateLatLng(lat, lng) {    
    let pattern = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');
    
    return pattern.test(lat) && pattern.test(lng);
  }

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
function foundPosition(pos) {
    const crd = pos.coords;
    document.querySelector('#longitude').value = crd.longitude;
    document.querySelector('#latitude').value = crd.latitude;
    }
  
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    console.warn(`cannot find location from device`);
    }
  
const radioButtons = document.querySelectorAll('input[name="CoordSource"]');
for (const radioButton of radioButtons) {
    radioButton.addEventListener('change', chosenCoordSource);
  }

function chosenCoordSource(e) {
    if (this.value=='location') {
    //document.querySelector('#output').innerText = `You selected ${this.value}`;
    
    //hide lon and lat blocks
    if(newCampground){
        //override default app.css settings.
        document.querySelector('#lon').style.display = "none";
        document.querySelector('#lat').style.display = "none";
        
    }

    //disable lon and lat blocks
    document.querySelector('#longitude').disabled = true;
    document.querySelector('#latitude').disabled = true;
    document.querySelector('#longitude').readOnly = true;
    document.querySelector('#latitude').readOnly = true;
    }
    if (this.value=='device') {
    //document.querySelector('#output').innerText = `You selected ${this.value}`;
    navigator.geolocation.getCurrentPosition(foundPosition, error, options);
    
    //disable lon and lat blocks
    document.querySelector('#longitude').disabled = false;
    document.querySelector('#latitude').disabled = false;
    document.querySelector('#longitude').readOnly = true;
    document.querySelector('#latitude').readOnly = true;
    //show lon lat blocks
    document.querySelector('#lon').style.display = "block";
    document.querySelector('#lat').style.display = "block";
    }

    if (this.value=='map') {
    //document.querySelector('#output').innerText = `You selected ${this.value}`;
    console.log('not yet implemented for manual map point entry')
    }

    if (this.value=='manual') {
    //document.querySelector('#output').innerText = `You selected ${this.value}`;
    
    //enable lon lat blocks
    document.querySelector('#longitude').disabled = false;
    document.querySelector('#latitude').disabled = false;
    document.querySelector('#longitude').readOnly = false;
    document.querySelector('#latitude').readOnly = false;
    //show lon lat blocks
    document.querySelector('#lon').style.display = "block";
    document.querySelector('#lat').style.display = "block";
    }
}

  console.log('JS loaded')
  