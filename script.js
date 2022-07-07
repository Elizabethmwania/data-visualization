//Globally usable variables
        const url = "https://data.nasdaq.com/api/v3/datatables/WIKI/PRICES.json?api_key=fhbrmNqTQJ94Q7yieQrX";
        const data = {};
        const ctx = document.getElementById("myChart");
        let myChart;
        let dateMin = undefined;
        let dateMax = undefined;
        //Make an ajax call to the api endpoint to get the data
        $.ajax({
            url: url, 
            type: 'GET',
            success: function(response) {                
                const companyNames = [];
                response.datatable.data.forEach(row => {
                    let name = row[0];
                    let date = row[1];
                    let close = row[5];
                    if(!(name in data)) {
                        data[name] = [{date: date, close: close}]
                    }else{
                        data[name].push({date: date, close: close})
                    }

                    if(!dateMin || date < dateMin) {
                        dateMin = date;
                    }

                    if(!dateMax || date > dateMax) {
                        dateMax = date;
                    }

                    if(!companyNames.includes(row[0])) {
                        companyNames.push(row[0]);
                    }
                });
                
                //Set the min amd the max dates
                document.getElementById("start-date").max = dateMax;
                document.getElementById("start-date").min = dateMin;
                document.getElementById("end-date").max = dateMax;
                document.getElementById("end-date").min = dateMin;
                //Set the default values for the dates
                document.getElementById("start-date").value = dateMin;
                document.getElementById("end-date").value = dateMax;

                let output =   ``;
                for(let i = 0; i < companyNames.length; i++) {
                    output += `<option value="${companyNames[i]}">${companyNames[i]}</option>`;
                }

                document.getElementById("company-name").innerHTML = output;
                handleInputChanged();
            },
            error: function(err) {
                console.log(err);
                alert("Error calling the endpoint: "+url)
            }
        });
      
       
      //The function to display graph
      const displayGraph = function(labels, companyName, theData) {
        if(myChart) {
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
        type: "line",
        lineThickness: 0.01,
        data: {
          labels: labels,
          datasets: [
            {
              label: companyName,
              data: theData,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      }
      //The function that handles the population of data
      const handleInputChanged = function() {
        const startDate = document.getElementById("start-date").value;
        const endDate = document.getElementById("end-date").value;
        const companyName = document.getElementById("company-name").value;
        let salesData = data[companyName];
        let labels = [];
        let theData = [];
        for(let i = 0; i < salesData.length; i++) {
            if(salesData[i].date >= startDate && salesData[i].date <= endDate) {
                labels.push(salesData[i].date)
                theData.push(salesData[i].close)
            }
            
        }
       //Call display graph
       displayGraph(labels, companyName, theData); 
      }
