import superagent from "superagent"

export default async function webread(url) {
    const response = await superagent.get(url); 
    return response.body.toString('utf-8');
}