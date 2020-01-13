var names = [];
var metadata = [];
var samples = [];
var selectedTestSubject = '';

d3.json("static/samples.json").then((incomingData) => {
  console.log('Got json ' + JSON.stringify(incomingData));
  names = incomingData.names;
  metadata = incomingData.metadata;
  samples = incomingData.samples;
  selectedTestSubject = names[0];
  populateDropDown(names);
  updateDemographicInformation();
  createBarPlot();
  createBubblePlot();
});

function populateDropDown(data) {
  data.forEach(function(name) {
    $("#test-subject-dropdown").append(new Option(name, name));
  });
}

function updateDemographicInformation() {
  var currentSubject = metadata.filter(function(subject){
    return subject.id === Number(selectedTestSubject)
  })[0];
  console.log('Found ' + JSON.stringify(currentSubject))
  var id = currentSubject.id;
  var ethnicity = currentSubject.ethnicity;
  var gender = currentSubject.gender;
  var age = currentSubject.age;
  var location = currentSubject.location;
  var bbtype = currentSubject.bbtype;
  var wfreq = currentSubject.wfreq;
  $('#demo-id').text(id);
  $('#demo-ethnicity').text(ethnicity);
  $('#demo-gender').text(gender);
  $('#demo-age').text(age);
  $('#demo-location').text(location);
  $('#demo-bbtype').text(bbtype);
  $('#demo-wfreq').text(wfreq);
}

function createBarPlot() {
  console.log('Creating Bar Plot');
  var currentSubject = samples.filter(function(item){
    return item.id === selectedTestSubject
  })[0];
  console.log('Found bar ' + JSON.stringify(currentSubject));

  var values = currentSubject.sample_values.slice(0,10).reverse();
  var labels = currentSubject.otu_ids.slice(0,10).map(function(item){
    return "OTU " + item;
  }).reverse();
  var hover = currentSubject.otu_labels.slice(0,10).reverse();

  // Create your trace.
  var trace = {
    x: values,
    y: labels,
    text: hover,
    type: "bar",
    orientation: 'h'
  };

  // Create the data array for our plot
  var data = [trace];

  // Plot the chart to a div tag with id "bar-plot"
  Plotly.newPlot("bar-plot", data);
}

function createBubblePlot() {
  console.log('Creating bubble plot');
  console.log('Select subject is ' + selectedTestSubject);
  var currentSubject = samples.filter(function(item){
    return item.id === selectedTestSubject;
  })[0];

  console.log('Found bubble ' + JSON.stringify(currentSubject));

  var values = currentSubject.sample_values;
  var ids = currentSubject.otu_ids;
  var labels = currentSubject.otu_labels;

  var trace = {
    x: ids,
    y: values,
    text: labels,
    mode: 'markers',
    marker: {
      color: ids,
      size: values
    }
  };

  var data = [trace];

  var layout = {
    title: 'All Samples',
    showlegend: false
  };

  Plotly.newPlot('bubble-plot', data, layout);
}

$(document).ready(function(){
  console.log('document ready')

  $("#test-subject-dropdown").change(function () {
       var subject = this.value;
       if (subject !== '-1') {
         console.log('Test subject selected ' + subject);
         selectedTestSubject = subject;
         updateDemographicInformation();
         createBarPlot();
         createBubblePlot();
       }
   });
})