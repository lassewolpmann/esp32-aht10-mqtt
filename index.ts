import { PrismaClient } from "@prisma/client"
import { connect } from "mqtt";

interface TempHumidityDate {
    temp: number,
    humidity: number
}

const prisma = new PrismaClient();

const protocol = 'mqtt';
const host = 'temphumidity.lan';
const port = '1883';
const clientId = 'DBClient';

const connectUrl = `${protocol}://${host}:${port}`;

const client = connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 15000,
    username: 'lasse',
    password: 'lasse',
    reconnectPeriod: 1000
})

async function main() {
    client.on('connect', () => {
        console.log('Connected to MQTT Broker.');
        const topic = ['temphumidity'];
        client.subscribe(topic, (err) => {
            console.log(`Subscribed to ${topic}`);
        });
    })

    client.on('message', async (topic, payload) => {
        const dataString = payload.toString();
        const dataJson: TempHumidityDate = JSON.parse(dataString);

        await prisma.tempHumidityData.create({
            data: {
                temp: dataJson.temp,
                humidity: dataJson.humidity
            }
        })
    })

    const tempHumidityData = await prisma.tempHumidityData.findMany()
    console.log(tempHumidityData)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })