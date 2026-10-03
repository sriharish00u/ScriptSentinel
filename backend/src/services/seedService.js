require('dotenv').config();
const connectDB = require('../config/db');
const RestrictedTerm = require('../models/RestrictedTerm');
const PlatformPolicy = require('../models/PlatformPolicy');
const PseoKeyword = require('../models/PseoKeyword');
const { restrictedTermsData, platformPoliciesData, pseoKeywordsData } = require('../data/seedData');

const seedDatabase = async () => {
  try {
    const conn = await connectDB();
    if (!conn) {
      console.warn('[Seed Engine] Skipping remote DB sync - proceeding with local memory fallback.');
      return;
    }

    console.log('[Seed Engine] Seeding Restricted Terms...');
    for (const item of restrictedTermsData) {
      await RestrictedTerm.findOneAndUpdate(
        { term: item.term },
        { ...item, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed Engine] Successfully seeded ${restrictedTermsData.length} restricted terms.`);

    console.log('[Seed Engine] Seeding Platform Policies...');
    for (const policy of platformPoliciesData) {
      await PlatformPolicy.findOneAndUpdate(
        { platform: policy.platform, industry: policy.industry },
        { ...policy },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed Engine] Successfully seeded ${platformPoliciesData.length} platform policies.`);

    console.log('[Seed Engine] Seeding pSEO Keywords...');
    for (const pseo of pseoKeywordsData) {
      await PseoKeyword.findOneAndUpdate(
        { slug: pseo.slug },
        { ...pseo },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed Engine] Successfully seeded ${pseoKeywordsData.length} pSEO keywords.`);

    console.log('[Seed Engine] Database initialization complete!');
  } catch (error) {
    console.error('[Seed Engine Error]', error);
  }
};

if (require.main === module) {
  seedDatabase().then(() => {
    console.log('[Seed Engine] Exiting seed process.');
    process.exit(0);
  });
}

module.exports = seedDatabase;
