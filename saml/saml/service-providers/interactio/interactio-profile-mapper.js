import { uid, email, givenname as firstName, surname as lastName, } from "../../constants/claims.js"
import { unspecified } from "../../constants/name-identifer-formats.js"
import _ from "lodash"

const ZERO_WIDTH_JOINER = '\u200D';

export default class InteractioProfileMapper {

  constructor(u) {

    if(!u)
      throw new Error("No user provided");

    this.user = u;
  }

  /**
   * Return user claims
   */
  getClaims() {

    const { user } = this;
    const { overrideReason, ...claims }  = user.claims || {};

    for(let key in claims) {
      if(_.isArray(claims[key]) && !claims[key].length)
        claims[key] = null; // force null of empty array
    }
    
    claims[uid.id]       = user.uid;
    claims[email.id]     = user.uid;
    claims[firstName.id] = user.firstName;
    claims[lastName.id]  = user.lastName;

    if(user.nameplate) {
      const [npLastName, npFirstName] = splitNameplate(user.nameplate);

      claims[firstName.id] = npFirstName;
      claims[lastName.id]  = npLastName;
    }

    claims[firstName.id] = (claims[firstName.id]||'').trim() || ZERO_WIDTH_JOINER; // Use zero-width invisible char to avoid asking for name;
    claims[lastName.id]  = (claims[lastName.id] ||'').trim() || ZERO_WIDTH_JOINER;

    return claims;
  }


  /**
   * get user ID metadata used in the metadata endpoint.
   */
  getNameIdentifier() {

    return { 
      nameIdentifier: this.getClaims()[uid.id],
      nameIdentifierFormat: unspecified
    };
  }

  /**
   * claims metadata used in the metadata endpoint.
   */
  get metadata() { 
    return  [
      uid,
      email,
      firstName,
      lastName,
    ];
  }
}

function splitNameplate(text) {

  const parts = text.split(" ").filter(o=>!!o);
  let breakPoint = 1; // Default break after 1st word (type for ORG: IGO, NGO, UN...)

  const partyIndicator = parts.find(o=>/\[/.test(o)); // if GOV nameplate ends with [...]
  
  if(partyIndicator) // break at [] for GOV: [], [C], [C/N], [Non-Party])
    breakPoint = parts.indexOf(partyIndicator); 
  return [
    parts.slice(0, breakPoint).join(' '),
    parts.slice(   breakPoint).join(' '),
  ];
}