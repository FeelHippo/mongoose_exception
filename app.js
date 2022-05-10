var express = require('express');
var mongoose = require('mongoose');

// Express App
var app = express();
var mongoDB = 'mongodb://127.0.0.1/my_database';

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(8081, () => {
   var host = server.address().address
   var port = server.address().port

   mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Dammit!'));
   
   console.log("All Good at: ", host, port)

   // create schema
   const TransactionSchema = new mongoose.Schema({
     transaction_id: 'string',
     status: 'string',
     more_data: 'string',
   },
   {
     timestamps: true,
     autoCreate: true,
     autoIndex: true,
   });

   TransactionSchema.index({ transaction_id: 1 }, { name: 'transaction_id_index', unique: true });

   var TransactionModel = mongoose.model('transactions', TransactionSchema);

   // create a bunch of documents
   ['a', 'b', 'c'].forEach(document => {
      // create new and unique document
      var transactionModelInstance = new TransactionModel({transaction_id: document, status: 'I am good, thanks', more_data: 'so_much_data_mamma_mia'});

      // .save() takes in a callback function in case of error
      transactionModelInstance.save(
       console.log
      );
   });

   setTimeout(async () => {
      var newStatus = 'I feel like shit on a shit stick';
      var transaction = await TransactionModel.findOneAndUpdate(
        { transaction_id: 'd' }, 
        { status: newStatus },
        { useFindAndModify: false },
      ).exec();

      console.log('By default findOneAndUpdate will return ', transaction, ' if a transaction does not exist');

      var transaction = await TransactionModel.findOneAndUpdate(
        { transaction_id: 'e' }, 
        { status: newStatus },
        { useFindAndModify: false },
        (err, doc) => {
          if (!doc) throw new Error();
        },
      ).clone();
   }, 2000);
})

// RUN WITH: $node app.js
