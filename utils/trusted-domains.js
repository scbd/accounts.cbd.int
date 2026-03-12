export function parseTrustedDomains(raw) {
    return (raw || '').split(/[,;|]/).map(s => s.trim()).filter(Boolean).map(entry => {
        const schemeMatch = entry.match(/^(https?):\/\/(.+)$/);
        const scheme    = schemeMatch ? schemeMatch[1].toLowerCase() : 'https';
        const domainStr = (schemeMatch ? schemeMatch[2] : entry).toLowerCase();
        const prefix    = `^${scheme}:\\/\\/`;

        const regexStr = prefix + domainStr.replace(/\./g, '\\.').replace(/\*/g, '.+') + '$';

        return { domain: `${scheme}://${domainStr}`, regex: regexStr };
    });
}
