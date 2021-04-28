const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://elocon:App1e5tink5!@cluster0.xtohr.mongodb.net/companies?retryWrites=true&w=majority"; 

var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
var port = process.env.PORT || 8080;

http.createServer(function(req, res)
{
    if(req.url == "/") {
        file = 'index.html';
        fs.readFile(file, function(err, txt){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(txt);
        res.end();
        });
    }

    else if(req.url == "/process_stocks")
    {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write("<h2> PROCESSING </h2>");
        input_data = "";
        req.on('data', data => {
            input_data += data.toString();
        });

        req.on('end', () => {
        input_data = querystring.parse(input_data);

        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if(err) { 
                console.log("Connection err: " + err); 
                return; 
            }
          
            var dbo = db.db("hw14");
            var collection = dbo.collection('companies');

            console.log("searching");

            user_query = {company:input_data['company_input']};

            if (input_data['company_input'] == "")
                user_query = {ticker:input_data['ticker_input']};

            collection.find(user_query).toArray(function(err, items) {
              if (err) {
                console.log("Error: " + err);
              } 
              else 
              {                
                for (i = 0; i < items.length; i++)
                    res.write(i + ": " + items[i].company + " Ticker: " + items[i].ticker);
                if (items.length == 0)
                    res.write("Not found");
              }   
              db.close();
            });
        });
        })
    }
    else 
    {
        res.end();
    }

}).listen(port);