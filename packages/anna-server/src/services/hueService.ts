import fetch from 'node-fetch';
import { findAll, findRoomId } from 'modules/hue-light/hueLight';
import { HueLigthBody } from 'modules/scene/action';

const HUE_IP = process.env.HUE_IP;
const HUE_TOKEN = process.env.HUE_TOKEN;
const api = `http://${HUE_IP}/api/${HUE_TOKEN}`;

const toArray = jsonObject =>
  Object.keys(jsonObject).map(id => ({ ...jsonObject[id], id }));

export async function getLights() {
  const [body, rooms] = await Promise.all([
    fetch(`${api}/lights`).then(res => res.json()),
    findAll(),
  ]);

  let correctedBody = body;

  if (body) {
    rooms.forEach(({ roomId, lightId }) => {
      if (body.hasOwnProperty(lightId)) {
        body[lightId].roomId = roomId;
      }
    });

    correctedBody = toArray(body);
  }

  return correctedBody;
}

export async function getLight(lightId: number) {
  const [body, roomId] = await Promise.all([
    fetch(`${api}/lights/${lightId}`).then(res => res.json()),
    findRoomId(lightId),
  ]);

  return { ...body, ...roomId };
}

export async function renameLight(id: number, name: string): Promise<void> {
  const res = await fetch(`${api}/lights/${id}`, {
    method: 'put',
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function setLightState(
  id: string,
  body: Partial<HueLigthBody>,
): Promise<void> {
  const res = await fetch(`${api}/lights/${id}/state`, {
    method: 'put',
    body: JSON.stringify(body),
  });
  return res.json();
}
