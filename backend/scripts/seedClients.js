require('dotenv').config();
const mongoose = require('mongoose');
const Client = require('../models/client.model');
const chalk = require('chalk');

const clients = [
  { name: 'Addfit',             logo: '/uploads/clients/ADDFIT.webp',             order: 1  },
  { name: 'Alto Furniture',     logo: '/uploads/clients/ALTO-FURNITURE.webp',     order: 2  },
  { name: 'Amr Hassan',         logo: '/uploads/clients/AMRHASSAN.webp',          order: 3  },
  { name: 'Be Pharmacists',     logo: '/uploads/clients/BE-PHARMACISTS.webp',     order: 4  },
  { name: 'Clear Water',        logo: '/uploads/clients/CLEAR-WATER.webp',        order: 5  },
  { name: 'Crunch Gym',         logo: '/uploads/clients/CRUNCH-GYM.webp',         order: 6  },
  { name: 'Egypt Chemical',     logo: '/uploads/clients/EGYPTCHEMICAL.webp',      order: 7  },
  { name: 'Fitness Time',       logo: '/uploads/clients/FITNESSTIME.webp',        order: 8  },
  { name: 'Hotelia',            logo: '/uploads/clients/HOTELIA.webp',            order: 9  },
  { name: 'HS Interior Design', logo: '/uploads/clients/HS.webp',                 order: 10 },
  { name: 'I-Book',             logo: '/uploads/clients/I-BOOK.webp',             order: 11 },
  { name: 'Join In',            logo: '/uploads/clients/JOININ.webp',             order: 12 },
  { name: 'Marmar',             logo: '/uploads/clients/MARMAR.webp',             order: 13 },
  { name: 'Marshmallow',        logo: '/uploads/clients/MARSHMALLOW.webp',        order: 14 },
  { name: 'M-Pools',            logo: '/uploads/clients/M-POOLS.webp',            order: 15 },
  { name: 'Nouri',              logo: '/uploads/clients/NOURI.webp',              order: 16 },
  { name: 'NS',                 logo: '/uploads/clients/NS.webp',                 order: 17 },
  { name: 'Padel Rise',         logo: '/uploads/clients/PADEL-RISE.webp',         order: 18 },
  { name: 'Quelqu\'un',         logo: '/uploads/clients/QUELQUUN.webp',           order: 19 },
  { name: 'RS Reels Studio',    logo: '/uploads/clients/RS.webp',                 order: 20 },
  { name: 'S-Square',           logo: '/uploads/clients/S-SQUARE.webp',           order: 21 },
  { name: 'Shawino',            logo: '/uploads/clients/SHAWINO.webp',            order: 22 },
  { name: 'Sky Card',           logo: '/uploads/clients/SKY-CARD.webp',           order: 23 },
  { name: 'SlimFit EMS',        logo: '/uploads/clients/SLIMFIT.webp',            order: 24 },
  { name: 'TabTabah',           logo: '/uploads/clients/TABTABAH.webp',           order: 25 },
  { name: 'Taurus',             logo: '/uploads/clients/TAURUS.webp',             order: 26 },
  { name: 'The Map',            logo: '/uploads/clients/THE-MAP.webp',            order: 27 },
  { name: 'Trading Champions',  logo: '/uploads/clients/TRADING-CHAMPIONS.webp', order: 28 },
  { name: 'Verona',             logo: '/uploads/clients/VERONA.webp',             order: 29 },
  { name: 'Warm Up',            logo: '/uploads/clients/WARMUP.webp',             order: 30 },
  { name: 'Way To Go',          logo: '/uploads/clients/WAY-TO-GO.webp',          order: 31 },
  { name: 'Woman Up Gym',       logo: '/uploads/clients/WOMANUP-GYM.webp',        order: 32 },
  { name: 'Woodcraft',          logo: '/uploads/clients/WOODCRAFT.webp',          order: 33 },
  { name: 'World Gym',          logo: '/uploads/clients/WORLDGYM.webp',           order: 34 },
  { name: 'Zayka',              logo: '/uploads/clients/ZAYKA.webp',              order: 35 },
  // 33.webp could not be identified (file too large) — add manually once identified
  // It is one of: Club Construction, Nada Fasil, or Wen
];

const seedClients = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/se_agency');
    console.log(chalk.cyan('Connected to MongoDB...'));

    const existing = await Client.countDocuments();
    if (existing > 0) {
      console.log(chalk.yellow(`Found ${existing} existing client(s). Clearing before re-seed...`));
      await Client.deleteMany({});
    }

    await Client.insertMany(clients);
    console.log(chalk.green.bold(`Seeded ${clients.length} clients successfully!`));
  } catch (error) {
    console.error(chalk.red.bold('Error seeding clients:'), error.message);
  } finally {
    await mongoose.connection.close();
    console.log(chalk.cyan('MongoDB connection closed.'));
  }
};

seedClients();
