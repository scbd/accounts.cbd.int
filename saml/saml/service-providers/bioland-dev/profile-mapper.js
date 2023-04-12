import { uid, email, givenname as firstName, surname as lastName, } from "../../constants/claims.js"
import { unspecified } from "../../constants/name-identifer-formats.js"
import _ from "lodash"

const ZERO_WIDTH_JOINER = '\u200D';

export default class  {

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