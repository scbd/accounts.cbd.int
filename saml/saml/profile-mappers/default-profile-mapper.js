import { uid, email, givenname as firstName, surname as lastName, } from "../constants/claims.js"
import { unspecified } from "../constants/name-identifer-formats.js"

const FieldClaimMapping = {
    uid,
    email,
    firstName,
    lastName,
}

export default class DefaultProfileMapper {

  constructor(u) {

    if(!u)
      throw new Error("No user provided");

    this.user = u;
  }

  /**
   * Return user claims
   */
  getClaims() {

    const claims     = { };
    const user       = this.user;
    const keys       = Object.keys(user);
    const mappedKeys = keys.filter(key => !!FieldClaimMapping[key]);

    mappedKeys.forEach((key) => { 
      const claim = FieldClaimMapping[key];
      claims[claim.id] = user[key];
    })
  
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
