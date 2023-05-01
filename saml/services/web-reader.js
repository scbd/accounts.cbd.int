import superagent from 'superagent'

export default async function webread(url) {
    const { body, text, type } = await superagent.get(url);
    const   isText             = type.includes('text/');

    return isText? text : body.toString('utf-8');
}