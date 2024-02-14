const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'
 
// Fetch the JSON data, log it to console.
d3.json(url).then(function(data) {
    console.log(data);
  });

 
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to fetch sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // Set variables for sample names
        let names = data.names;

        // Add samples to dropdown menu
        names.forEach((id) => {

            // Log the value of id on each iteration. 
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Variable for first sample
        let firstSample = names[0];
        // Log the value of sample_one
        console.log(firstSample);

        // Build the initial plots
        metadata(firstSample);
        barChart(firstSample);
        bubbleChart(firstSample);

    });
};

function metadata(sample) {

    // Use D3 to fetch the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // Log the array of metadata objects
        console.log(value)

        // Fetch the first index from the array
        let valueData = value[0];

        // Clear metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pair
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};


// Bar Chart
function barChart(sample){

        //Use D3 to fetch data
        d3.json(url).then((data) => {
            
            // Data values
            let selectedData = data.samples;
            let value = selectedData.filter(results => results.id == sample);

            // Log value
            console.log(value)

            let valueData = value[0];

            let otuIDS = valueData.otu_ids;
            let otuLabels = valueData.otu_labels;
            let sampleValues = valueData.sample_values;
            
            // Set top ten items to display in descending order
            let yticks = otuIDS.slice(0,10).map(id => `OTU ${id}`).reverse();
            let xticks = sampleValues.slice(0,10).reverse();
            let labels = otuLabels.slice(0,10).reverse();
    
            // Bar chart trace
            let trace = {
                x: xticks,
                y: yticks,
                text: labels,
                type: "bar",
                orientation: "h"
    };

        // Layout & title
        let layout1 = {
            title: "Top 10 OTUs Present"
        };

    // Use Plotly to plot
        Plotly.newPlot("bar", [trace], layout1)
    });
};

// Bubble Chart
function bubbleChart(sample){

        // Use D3 to fetch data
        d3.json(url).then((data) => {
            
            // Data Values
            let selectedData = data.samples;
            let value = selectedData.filter(results => results.id == sample);

            // Log values 
            console.log(value)

            let valueData = value[0];

            let otuIDS = valueData.otu_ids;
            let otuLabels = valueData.otu_labels;
            let sampleValues = valueData.sample_values;
       
    
            // Bubble chart trace
            let trace1 = {
                x: otuIDS,
                y: sampleValues,
                text: otuLabels,
                mode: "markers",
                marker: {
                    size: sampleValues,
                    color: otuIDS,
                    colorscale: "Jet"
                }
    };

        // Layout & title
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closet",
            xaxis: {title: "OTU ID"}
        };

    // Use Plotly to plot 
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

    
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    metadata(value);
    barChart(value);
    bubbleChart(value);
 

};

// Call the initialize function
init();