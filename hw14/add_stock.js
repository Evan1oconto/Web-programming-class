const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://elocon:App1e5tink5!@cluster0.xtohr.mongodb.net/companies?retryWrites=true&w=majority";  

var fs = require('fs');
var readline = require('readline');


MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if(err) { 
        return console.log(err); 
    }
    
      var dbo = db.db("hw14");
      var collection = dbo.collection('companies');

      file = 'companies.csv';
      var read_interface = readline.createInterface({
        input : fs.createReadStream(file)
      })

      read_interface.on('line', function(line) {
        if(line != "Company,Ticker") {
          var info = line.split(',');
          var newData = { "company": info[0], "ticker": info[1] };

          collection.insertOne(newData, function(err, res) {
            if(err) { 
                console.log("query err: " + err); 
                return; 
            }

            console.log("new company inserted");
            });
        }
    })

      console.log("Successfully inserted data into database!");

  });
