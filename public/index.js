'use strict';

//list of truckers
//useful for ALL 5 exercises
var truckers = [{
    'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
    'name': 'les-routiers-bretons',
    'pricePerKm': 0.05,
    'pricePerVolume': 5
}, {
    'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
    'name': 'geodis',
    'pricePerKm': 0.1,
    'pricePerVolume': 8.5
}, {
    'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
    'name': 'xpo',
    'pricePerKm': 0.10,
    'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL exercises
//The `price` is updated from exercice 1
//The `commission` is updated from exercice 3
//The `options` is useful from exercice 4
var deliveries = [{
    'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
    'shipper': 'bio-gourmet',
    'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
    'distance': 100,
    'volume': 4,
    'options': {
        'deductibleReduction': false
    },
    'price': 0,
    'commission': {
        'insurance': 0,
        'convargo': 0
    }
}, {
    'id': '65203b0a-a864-4dea-81e2-e389515752a8',
    'shipper': 'librairie-lu-cie',
    'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
    'distance': 650,
    'volume': 12,
    'options': {
        'deductibleReduction': true
    },
    'price': 0,
    'commission': {
        'insurance': 0,
        'convargo': 0
    }
}, {
    'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
    'shipper': 'otacos',
    'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
    'distance': 1250,
    'volume': 30,
    'options': {
        'deductibleReduction': true
    },
    'price': 0,
    'commission': {
        'insurance': 0,
        'convargo': 0
    }
}];

//list of actors for payment
//useful from exercise 5
const actors = [{
    'rentalId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
    'payment': [{
        'who': 'shipper',
        'type': 'debit',
        'amount': 0
    }, {
        'who': 'owner',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'insurance',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'treasury',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'convargo',
        'type': 'credit',
        'amount': 0
    }]
}, {
    'rentalId': '65203b0a-a864-4dea-81e2-e389515752a8',
    'payment': [{
        'who': 'shipper',
        'type': 'debit',
        'amount': 0
    }, {
        'who': 'owner',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'insurance',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'treasury',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'convargo',
        'type': 'credit',
        'amount': 0
    }]
}, {
    'rentalId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
    'payment': [{
        'who': 'shipper',
        'type': 'debit',
        'amount': 0
    }, {
        'who': 'owner',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'treasury',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'insurance',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'convargo',
        'type': 'credit',
        'amount': 0
    }]
}];

euroVolume();

function euroVolume(){
    var numero = 1;
    for (var shipper of deliveries){
        var trucker = truckers.find(function(element) {
            return element.id == shipper.truckerId;
        });
        var distance = shipper.distance * trucker.pricePerKm;
        var volume = shipper.volume * trucker.pricePerVolume;

        var total = distance + volume;
        total = decreasing(shipper.volume,total);

        commission(total, shipper);
        shipper.price = total;
        var deductibleReductionNumber = 0;
        deductible(shipper, total, deductibleReductionNumber)
        var tostring = "The shipping price for the shipper " + numero + " is :  " + shipper.price +"euros.";
        console.log(tostring);
        payTheActors(shipper, deductibleReductionNumber);
        console.log();
        numero++;
    }
}

function decreasing(volume, total){
    if (volume > 25){
        total = total * 0.5;
        console.log("You have a 50% discount, Congratulations!")
    }else if(volume > 10){
        total = total * 0.7;
        console.log("You have a 30% discount, Congratulations!")
    }else if(volume > 5){
        total = total * 0.9;
        console.log("You have a 10% discount, Congratulations!")
    }
    return total;
}

function commission(total, shipper){
    var resultat = total * 0.3;
    shipper.commission.insurance = resultat * 0.5;
    resultat = resultat - 0.5;
    var treasury = parseInt(shipper.distance/500);
    shipper.commission.treasury = treasury;
    var convargo = resultat - treasury;
    shipper.commission.convargo = convargo;
    console.log(shipper.commission);
}

function deductible(shipper, total, deductibleReductionNumber){
    if (shipper.options.deductibleReduction){
        deductibleReductionNumber = 1 * shipper.volume;
        shipper.price = shipper.price + deductibleReductionNumber;
        console.log("Thanks for choose the deductible reduction, your charge amounts is: " + deductibleReductionNumber);

    }
}

function payTheActors(shipper, deductibleReductionNumber){
    var rental = actors.find(function(element) {
            return element.rentalId == shipper.id;
        });
    for(var actor of rental.payment){
        if(actor.who == "shipper"){
            actor.amount = shipper.price;
        }
        else if(actor.who == "owner"){
            actor.amount = shipper.price - (shipper.commission.convargo + shipper.commission.insurance + shipper.commission.treasury);
            
        }else if(actor.who == "insurance"){
            actor.amount = shipper.commission.insurance;
            
        }else if(actor.who == "treasury"){
            actor.amount = shipper.commission.treasury;
        }else{
            //who == convargo
            actor.amount = shipper.commission.convargo + deductibleReductionNumber;
        }
    }
              console.log(rental);
  

}