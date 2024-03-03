const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Change port as needed

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/farming_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Mongoose schema
const farmSchema = new mongoose.Schema({
  farmName: String,
  location: String,
  farmSize: Number,
  soilType: String,
  irrigationSystem: String,
  cropRotationPlan: String,
  farmerName: String,
  phoneNumber: String,
});

// Create a Mongoose model
const Farm = mongoose.model('Farm', farmSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { errors: [], farmName: '', location: '', farmSize: '', soilType: '', irrigationSystem: '', cropRotationPlan: '', farmerName: '', phoneNumber: '' });
});

app.post('/addFarm', async (req, res) => {
  const {
    farmName,
    location,
    farmSize,
    soilType,
    irrigationSystem,
    cropRotationPlan,
    farmerName,
    phoneNumber,
  } = req.body;

  if (!validateFarmSize(farmSize)) {
    const errors = ['Invalid farm size'];
    return res.render('index', { errors, farmName, location, farmSize, soilType, irrigationSystem, cropRotationPlan, farmerName, phoneNumber });
  }

  if (!validatePhoneNumber(phoneNumber)) {
    const errors = ['Invalid phone number'];
    return res.render('index', { errors, farmName, location, farmSize, soilType, irrigationSystem, cropRotationPlan, farmerName, phoneNumber });
  }

  try {
    const farm = new Farm({
      farmName,
      location,
      farmSize,
      soilType,
      irrigationSystem,
      cropRotationPlan,
      farmerName,
      phoneNumber,
    });

    await farm.save();
    console.log('Data inserted into MongoDB');
    console.log(farm);
    res.redirect('/farms');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/farms', async (req, res) => {
  try {
    const farms = await Farm.find().sort({ _id: -1 }).limit(1);
    res.render('farms', { farms });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const validateFarmSize = (farmSize) => {
  const numericFarmSize = parseFloat(farmSize);
  return !isNaN(numericFarmSize) && numericFarmSize > 0;
};

const validatePhoneNumber = (phoneNumber) => {
  return /^\d{10}$/.test(phoneNumber);
};
