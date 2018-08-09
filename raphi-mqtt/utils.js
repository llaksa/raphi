'use strict'

function parsePayload (payload) { // recibe el buffer o string
  if (payload instanceof Buffer) { // si el payload es buffer
    payload = payload.toString('utf8') // lo convierte a string
                                       // según codificación utf8
  }

  // hasta aquí, ya hay seguridad de que todo sea convertido a string

  try {
    // convierte de string a JSON
    payload = JSON.parse(payload) 
  } catch (e) {
    // si pasan una estructura malformada(un string q no sea JSON)
    // entonces se devuelve un objeto null
    payload = null
  }

  return payload
}

module.exports = {
  parsePayload
}
