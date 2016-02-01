'use strict';
const request = require('./requestService');

class HueService {
	constructor(hostname, username) {
		this.hostname = hostname;
		this.username = username;
		this.api = `http://${hostname}/api/${username}`;
	}

  // -----------------------------------------
  // Getters
  getHostname() {
  	return this.hostname;
  }

  getUsername() {
  	return this.username;
  }

  // -----------------------------------------
  // Lights API
  getLights() {
		return new Promise((resolve, reject) => {
			request.get(`${this.api}/lights`)
        .then(body => {
  				if (body) {
  					body = toArray(body);
  				}
  				resolve(body);
  			})
        .catch(err => reject(err));
		});
  }

  getLight(id) {
		return request.get(`${this.api}/lights/${id}`);
	}

	renameLight(id, name) {
		return request.put(`${this.api}/lights/${id}`, {name});
	}

	setLightState(id, body) {
		return request.put(`${this.api}/lights/${id}/state`, body);
	}

	switchLight(id, on) {
		return this.setLightState(id, {on});
	}

	// -----------------------------------------
  // Scenes API
  getScenes() {
		return new Promise((resolve, reject) => {
			request.get(`${this.api}/scenes`)
        .then(body => {
  				if (body) {
  					body = toArray(body);
  				}
  				resolve(body);
  			})
        .catch(err => reject(err));
		});
  }

  getScene(id) {
  	return request.get(`${this.api}/scenes/${id}`);
  }

  createScene(body) {
    return new Promise((resolve, reject) => {
      request.post(`${this.api}/scenes`, body)
        .then(body => {
          const id = extractId(body);
          resolve(id);
        })
        .catch(err => reject(err));
    });
  }

  setScene(id, body) {
  	return request.put(`${this.api}/scenes/${id}`, body);
  }

	setSceneLightStates(id, idLight, body) {
		return request.put(`${this.api}/scenes/${id}/lightstates/${idLight}`, body);
	}  

  deleteScene(id) {
  	return request.delete(`${this.api}/scenes/${id}`);
  }

  recallScene(id) {
  	return request.put(`${this.api}/groups/0/action`, {"scene": id});
  }

	// -----------------------------------------
  // Schedules API
	getSchedules() {
		return new Promise((resolve, reject) => {
			request.get(`${this.api}/schedules`)
        .then(body => {
  				if (body) {
  					body = toArray(body);
  				}
  				resolve(body);
  			})
        .catch(err => reject(err));
		});
  }

  getSchedule(id) {
  	return request.get(`${this.api}/schedules/${id}`);
  }

  createSchedule(body) {
  	return new Promise((resolve, reject) => {
  		request.post(`${this.api}/schedules`, body)
        .then(body => {
    			const id = extractId(body);
    			resolve(id);
    		})
        .catch(err => reject(err));
  	});
  }

  setSchedule(id, body) {
  	return request.put(`${this.api}/schedules/${id}`, body);
  }

  deleteSchedule(id) {
  	return request.delete(`${this.api}/schedules/${id}`);
  }

  startSchedule(id) {
  	return this.setSchedule(id, {"status": "enabled"});
  }

  stopSchedule(id) {
  	return this.setSchedule(id, {"status": "disabled"});
  }

  // -----------------------------------------
  // Rules API
	getRules() {
		return new Promise((resolve, reject) => {
			request.get(`${this.api}/rules`)
        .then(body => {
  				if (body) {
  					body = toArray(body);
  				}
  				resolve(body);
  			})
        .catch(err => reject(err));
		});
  }

  getRule(id) {
  	return request.get(`${this.api}/rules/${id}`);
  }

  createRule(body) {
  	return new Promise((resolve, reject) => {
  		request.post(`${this.api}/rules`, body)
        .then(body => {
    			const id = extractId(body);
    			resolve(id);
    		})
        .catch(err => reject(err));
  	});
  }

  setRule(id, body) {
  	return request.put(`${this.api}/rules/${id}`, body);
  }

  deleteRule(id) {
  	return request.delete(`${this.api}/rules/${id}`);
  }

  // -----------------------------------------
  // Sensors API
	getSensors() {
		return new Promise((resolve, reject) => {
			request.get(`${this.api}/sensors`)
        .then(body => {
  				if (body) {
  					body = toArray(body);
  				}
  				resolve(body);
  			})
        .catch(err => reject(err));
		});
  }

  getSensor(id) {
  	return request.get(`${this.api}/sensors/${id}`);
  }

  createSensor(body) {
  	return new Promise((resolve, reject) => {
  		request.post(`${this.api}/sensors`, body)
        .then(body => {
    			const id = extractId(body);
    			resolve(id);
    		})
        .catch(err => reject(err));
  	});
  }

  setSensor(id, body) {
  	return request.put(`${this.api}/sensors/${id}`, body);
  }

  setSensorConfig(id, body) {
  	return request.put(`${this.api}/sensors/${id}/config`, body);
  }

  setSensorState(id, body) {
  	return request.put(`${this.api}/sensors/${id}/state`, body);
  }

  deleteSensor(id) {
  	return request.delete(`${this.api}/sensors/${id}`);
  }
}

function toArray(jsonObject) {
  const ids = Object.keys(jsonObject);
  return ids.map(id => {
    let object = jsonObject[id];
    object._id = id;
    return object;
  });
}

function extractId(jsonArray) {
  return jsonArray[0].success.id;
}

module.exports = HueService;