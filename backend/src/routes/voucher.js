import { Router } from 'express';
import { generateTallyXML, validateTallyXML } from '../services/tallyXml.js';

const router = Router();

router.post('/preview', async (req, res) => {
  try {
    const { transactions } = req.body;
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: 'Invalid transactions data' });
    }

    const xml = generateTallyXML(transactions);
    if (!validateTallyXML(xml)) {
      return res.status(400).json({ error: 'Generated XML is invalid' });
    }

    res.type('application/xml').send(xml);
  } catch (error) {
    console.error('❌ XML generation error:', error);
    res.status(500).json({ error: 'Failed to generate Tally XML' });
  }
});

router.post('/push', async (req, res) => {
  try {
    const { transactions } = req.body;
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: 'Invalid transactions data' });
    }

    const xml = generateTallyXML(transactions);
    if (!validateTallyXML(xml)) {
      return res.status(400).json({ error: 'Generated XML is invalid' });
    }

    res.json({
      success: true,
      tallyResponseXml: xml
    });
  } catch (error) {
    console.error('❌ XML processing error:', error);
    res.status(500).json({ error: 'Failed to process Tally XML' });
  }
});

export default router;


