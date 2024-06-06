const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ping = require('ping');
const dns = require('dns').promises;

const app = express();
const port = process.env.PORT || 11010;

app.use(cors());
app.use(express.json());

const websites = [
    'https://www.unpad.ac.id',
    'https://www.itb.ac.id',
    'https://www.upi.edu',
    'https://www.uinsgd.ac.id',
    'https://www.telkomuniversity.ac.id',
    'https://www.unpar.ac.id',
    'https://www.unpas.ac.id',
    'https://www.unikom.ac.id',
    'https://www.widyatama.ac.id',
    'https://www.unla.ac.id',
    'https://www.unjani.ac.id',
    'https://www.umbandung.ac.id',
    'https://www.unai.edu',
    'https://www.unisba.ac.id',
    'https://www.unfari.ac.id',
    'https://www.unsil.ac.id',
    'https://www.unsika.ac.id',
    'https://www.unsub.ac.id',
    'https://www.uniku.ac.id',
    'https://www.unma.ac.id',
    'https://www.unswagati.ac.id',
    'https://www.ucic.ac.id',
    'https://www.pelitabangsa.ac.id',
    'https://www.unpam.ac.id',
    'https://www.untara.ac.id',
    'https://www.binus.ac.id',
    'https://www.president.ac.id',
    'https://www.uph.edu',
    'https://www.upj.ac.id',
    'https://www.umn.ac.id',
    'https://www.unis.ac.id',
    'https://www.unma.ac.id',
    'https://www.unbaja.ac.id',
    'https://www.unsera.ac.id',
    'https://www.untirta.ac.id',
    'https://www.prasetiyamulya.ac.id',
    'https://www.mercubuana.ac.id',
    'https://www.untagcirebon.ac.id',
    'https://www.unas.ac.id',
    'https://www.pasim.ac.id',
    'https://www.unwim.ac.id',
    'https://www.ubharajaya.ac.id',
    'https://www.unnur.ac.id',
    'https://www.uninus.ac.id',
    'https://www.satyagama.ac.id'
];

async function getPing(url) {
    try {
        const hostname = new URL(url).hostname;
        const addresses = await dns.lookup(hostname);
        const pingResponse = await ping.promise.probe(addresses.address);
        return pingResponse.time;
    } catch (error) {
        console.error(`Error pinging ${url}:`, error);
        return 'N/A';
    }
}

app.get('/status', async (req, res) => {
    console.log('Received GET request for /status');
    const statusPromises = websites.map(async (url) => {
        try {
            await axios.get(url);
            const pingTime = await getPing(url);
            console.log(`Status for ${url}: up, Ping: ${pingTime} ms`);
            return { url, status: 'up', ping: pingTime };
        } catch (error) {
            const pingTime = await getPing(url);
            console.log(`Status for ${url}: down, Ping: ${pingTime} ms`);
            return { url, status: 'down', ping: pingTime };
        }
    });

    const statuses = await Promise.all(statusPromises);
    res.json(statuses);
});

app.post('/check-url', async (req, res) => {
    const { url } = req.body;
    console.log(`Received POST request for /check-url with URL: ${url}`);
    try {
        await axios.get(url);
        const pingTime = await getPing(url);
        console.log(`Status for ${url}: up, Ping: ${pingTime} ms`);
        res.json({ url, status: 'up', ping: pingTime });
    } catch (error) {
        const pingTime = await getPing(url);
        console.log(`Status for ${url}: down, Ping: ${pingTime} ms`);
        res.json({ url, status: 'down', ping: pingTime });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
