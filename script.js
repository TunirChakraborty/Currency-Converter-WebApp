const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const amountInput = document.querySelector(".amount input");
const messageDiv = document.querySelector(".msg");

const apiKey = `cur_live_MOv6pRtXcmsfOXW0gSfdKFcxV2e2HvyMckvAA5hT`;
const apiRequestURL = `https://api.currencyapi.com/v3/latest?apikey=cur_live_MOv6pRtXcmsfOXW0gSfdKFcxV2e2HvyMckvAA5hT`;

// populate the drop down with currency options

for (let select of dropdowns){
    for (currCode in countryList){
        let newOption = document.createElement("option");

        newOption.innerText = currCode;
        newOption.value = currCode;
        
        if (select.name === "from" && currCode === "USD"){
            newOption.selected = "selected";
        }
        else if (select.name === "to" && currCode === "INR"){
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt)=>{
        updateFlag(evt.target);
    })
}

// function to change flags of countries based on selection

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

// button is clicked to convert 

btn.addEventListener("click",async (evt) => {
    evt.preventDefault(); // prevents a browser refresh everytime
    
    let amount = amountInput.value;
    let fromCurrency = fromCurr.value;
    let toCurrency = toCurr.value;

    // check if amount is valid

    if (amount === "" || amount < 1){
        amount = 1;
        amountInput.value = "1";
    }

    try{
        // fetch conversion rates from API
        const response = await fetch(`${apiRequestURL}&base_currency=${fromCurrency}`);
        const data = await response.json();

        // check if the response contains the conversion rate
        if (data.data && data.data[toCurrency]){
            let conversionRate = data.data[toCurrency].value;
            let convertedAmount = (amount * conversionRate).toFixed(2);

            // display the conversion result
            messageDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;   
        }
        else{
            messageDiv.textContent = "conversion rate not availible";
        }
    }
    catch(error){
        console.log("error fetching : ",error);
        messageDiv.textContent = "Error fetching conversion data";
    }

})