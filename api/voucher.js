const { createTallyXml } = require('./tallyXml');

function registerVoucherRoutes(app) {
  app.post('/api/voucher/preview', async (req, res) => {
    console.log('🔧 Generating Tally XML preview...');
    const extraction = req.body?.extraction;
    if (!extraction) return res.status(400).json({ error: 'extraction required' });
    const xml = createTallyXml(extraction);
    res.type('application/xml').send(xml);
  });

  app.post('/api/voucher/push', async (req, res) => {
    console.log('🔧 Generating Tally XML for push...');
    const extraction = req.body?.extraction;
    if (!extraction) return res.status(400).json({ error: 'extraction required' });
    const xml = createTallyXml(extraction);
    const result = { success: true, tallyResponseXml: xml };
    res.json(result);
  });
}

module.exports = { registerVoucherRoutes };
