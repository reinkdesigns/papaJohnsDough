let PNS=[]
let numberOfDays = 3
$(document).ready(function() {
    var numberOfDays = 3;
  
    function updateTableHeaders() {
      $('.PNSLineBreak').attr('colspan',numberOfDays+1)
      var dayHeadersRow = $(".PNSHead");
      var dayInputRow = $(".PNSValues");
      dayHeadersRow.empty(); // Clear existing headers
      dayInputRow.empty(); // Clear existing inputs
  
      // Add an empty cell at the beginning
      dayHeadersRow.append("<th></th>");
      dayInputRow.append("<td>PNS</td>");
  
      // Add headers based on the selected number of days
      for (var i = 1; i <= numberOfDays; i++) {
        dayHeadersRow.append("<th>Day " + i + "</th>");
        dayInputRow.append('<td id="PNS'+i+'"class="resetField" inputmode="numeric" contenteditable="true"></td>');
      }
    }

    $(".resetField").on("input", function() {
      var inputText = $(this).text();
      if (isNaN(inputText)) {
          // If the input is not a valid number, remove the non-numeric characters
          //having an issue with this where if user types a letter it moves the cursor to the start of the field
          $(this).text(inputText.replace(/[^0-9.]/g, ""));
      }
  });
  
  //code to add adjustable PNS days, impliments but disabled as of now, feature was requested but determined unnessicary
  //as no part of the calculations called for anything beyond the next 3 days of projected sales.
  //left code in incase this changes or we have a use for a greater than 3 day PNS.
    // $("input[type='radio']").change(function() {
    //   numberOfDays = parseInt($(this).val());
    //   $('.resetField').html("")
    //   updateTableHeaders();
    // });

    $("#resetButton").click(function() {
      $('.resetField').html("")
      $("#3dayRadio").prop("checked", true);
      numberOfDays = 3;
      updateTableHeaders();
    })
  
    $("#submitButton").click(function() {
        PNS=[0]
        for (var i = 1; i <= numberOfDays; i++) {
            PNS.push($('#PNS'+i).html())
        }
      calculateDough()
    });
  
    // Initial setup
    updateTableHeaders();
  });


  function calculateDough(){
    console.log("Calculating Dough")
    
    var traysSmall=[]
    var traysMedium=[]
    var traysLarge=[]
    var traysExtra=[]
    var doughYeild=[]
    var doughOnHand=[]

// 0=small
// 1=medium
// 2=large
// 3=extra large

    for(i=0;i<=3;i++){
        doughYeild.push($('#yield'+i).html())
        doughOnHand.push($('#hand'+i).html())
    }

    //divides out 3 day projected net sales aginst our store yeild(average usage for the past 21 days)
    for(i=1;i<=numberOfDays;i++){
        console.log("i is"+i)
        traysSmall.push(Math.ceil(PNS[i] / doughYeild[0])) 
        traysMedium.push(Math.ceil(PNS[i] / doughYeild[1]))
        traysLarge.push(Math.ceil(PNS[i] / doughYeild[2]))
        traysExtra.push(Math.ceil(PNS[i] / doughYeild[3]))
    }

    // traysExtra.slice(0,3).reduce(function(a,b){return a+b},0)) may need if we add more PNS days

    //adds the 3 day need and compairs to what the store has onhand to establish if we need
    //to get anymore dough from other stores
    //updates variance grid
  $('#smallVar').html('<b>'+(doughOnHand[0] - traysSmall.reduce(function(a,b){return a+b},0))+'</b>')
  $('#mediumVar').html('<b>'+(doughOnHand[1] - traysMedium.reduce(function(a,b){return a+b},0))+'</b>')
  $('#largeVar').html('<b>'+(doughOnHand[2] - traysLarge.reduce(function(a,b){return a+b},0))+'</b>')
  $('#extraVar').html('<b>'+(doughOnHand[3] - traysExtra.reduce(function(a,b){return a+b},0))+'</b>')

  //loop to update dough Need grid.
  for(i=0;i<3;i++){
    $('#'+(i+1)+'Small').html('<b>'+traysSmall[i]+'</b')
    $('#'+(i+1)+'Medium').html('<b>'+traysMedium[i]+'</b')
    $('#'+(i+1)+'Large').html('<b>'+traysLarge[i]+'</b')
    $('#'+(i+1)+'Extra').html('<b>'+traysExtra[i]+'</b')
  }
 
  //guard clause set all var to red
    $('#smallVar').css('background-color', '#ce3939');
    $('#mediumVar').css('background-color', '#ce3939');
    $('#largeVar').css('background-color', '#ce3939');
    $('#extraVar').css('background-color', '#ce3939');

  //set cells back to white if we have suficcent amounts        
    if(parseInt($('#smallVar').text())>=0){$('#smallVar').css('background-color', 'white');}
    if(parseInt($('#mediumVar').text())>=0){$('#mediumVar').css('background-color', 'white');}
    if(parseInt($('#largeVar').text())>=0){$('#largeVar').css('background-color', 'white');}
    if(parseInt($('#extraVar').text())>=0){$('#extraVar').css('background-color', 'white');}
   
    }