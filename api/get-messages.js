const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('absensi');
        const collection = database.collection('attendance');

        const data = await collection.find({}).toArray();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    } finally {
        await client.close();
    }
};