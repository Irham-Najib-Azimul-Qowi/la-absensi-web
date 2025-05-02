const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('absensi');
        const collection = database.collection('attendance');
        const data = req.body;
        data.createdAt = new Date();
        await collection.insertOne(data);
        res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        res.status(500).json({ error: 'Failed to save data' });
    } finally {
        await client.close();
    }
};