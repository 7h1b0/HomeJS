var Event = require('./../models/events'),
	fs = require('fs'),
	process = require('./../services/processHandler');

exports.init = function(app){
	app.route('/event')

		.get(function(req,res){
			Event.find(function(err, bears) {
				if (err)
					res.send(err);

				res.json(bears);
			});
		})

		.post(function(req,res){
			var event = new Event(); 		
				event.name = req.body.name;
				event.hour = req.body.hour;
				event.min = req.body.min;
				event.command = req.body.command;
				event.recursive = req.body.recursive;

			event.save(function(err) {
				if (err)
					res.send(err);

				res.json({response: 'Event created!' });
			});
		});

	app.route('/event/:id_event')

		.get(function(req,res){
			Event.findById(req.params.id_event, function(err, commands) {
				if (err)
					res.send(err);

				res.json(commands);
			});
		})

		.delete(function(req, res){
			Event.remove({_id: req.params.id_event}, function(err, commands) {
				if (err)
					res.send(err);

				res.json({response: 'Successfully deleted' });
			});
		});
}


exports.check = function(){
	var date,hour_now,min_now;

	setInterval(function(){
		date = new Date(),
		hour_now = date.getHours(),
		min_now = date.getMinutes();

		Event.find({hour : hour_now},function(err,data){
			if(err) throw err;

			console.log(data.length);
			for(var i=0,l = data.length; i<l; i++){
				if(min_now == data[i].min){
					process.exec(data[i].command);
				}
			}
		});

	},1000*60); // Every 1 minutes
};