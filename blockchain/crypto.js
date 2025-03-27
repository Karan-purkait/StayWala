const { Wallets } = require('fabric-network');
const fs = require('fs');

class CryptoService {
    constructor() {
        this.wallet = Wallets.newFileSystemWallet('./wallet');
    }

    async enrollUser(userId) {
        const cert = fs.readFileSync(`/crypto-config/${userId}-cert.pem`);
        const key = fs.readFileSync(`/crypto-config/${userId}-key.pem`);
        await this.wallet.put(userId, {
            credentials: { certificate: cert.toString(), privateKey: key.toString() },
            mspId: 'ReviewOrgMSP',
            type: 'X.509'
        });
    }
}

module.exports = new CryptoService();