var Event = require('./../models/events'),
	fs = require('fs');

exports.init = function(app){
	app.route('/event')

		.get(function(req,res){
			Event.find(function(err, events) {
				if (err){
					res.send(err).end();
				}else{
					res.json(events);
				}

			});
		})

		.post(function(req,res){
			var event = new Event(); 		
				event.name = req.body.name;
				event.hour = req.body.hour;
				event.min = req.body.min;
				event.command = req.body.command;
				event.recursive = req.body.recursive;
				event.activate = 1;

			event.save(function(err) {
				if (err){
					res.send(err).end();
				}else{
					res.json({response: 'Event created' });
				}

			});
		});

	app.route('/event/:id_event')

		.get(function(req,res){
			Event.findById(req.params.id_event, function(err, commands) {
				if (err){
					res.send(err).end();
				}else{
					res.json(commands);
				}

			});
		})

		.delete(function(req, res){
			Event.remove({_id: req.params.id_event}, function(err, commands) {
				if (err){
					res.send(err).end();
				}else{
					res.json({response: 'Successfully deleted' });
				}

			});
		});
};


exports.check = function(){
	var date,
		hour_now,
		min_now,
		i,
		l,
		http = require('http');

	setInterval(function(){
		date = new Date(),
		hour_now = date.getHours(),
		min_now = date.getMinutes();

		Event.find({hour : hour_now},function(err,data){
			if(err){
				throw err;
			}else{
				for(i=0,l = data.length; i<l; i++){
					if(min_now == data[i].min){

						// Call action
						http.get(data[i].command,function(res){ }).on('error', function(e) {
						  	console.log("Got error: " + e.message);
						});

						// Delete evenf if is not recursive
						if(data[i].recursive == 0){
							Event.remove({_id: data[i]._id}, function(err, commands) {
								if (err){
									throw err;
								}
							});
						}
					}
				}
			}
		});

	},1000*60); // Every 1 minutes
};