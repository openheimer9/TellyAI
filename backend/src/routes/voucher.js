const { createTallyXml } = require('../services/tallyXml');

function registerVoucherRoutes(app) {
  app.post('/api/voucher/preview', async (req, res) => {
    const extraction = req.body?.extraction;
    if (!extraction) return res.status(400).json({ error: 'extraction required' });
    const xml = createTallyXml(extraction);
    res.type('application/xml').send(xml);
  });

  app.post('/api/voucher/push', async (req, res) => {
    const extraction = req.body?.extraction;
    if (!extraction) return res.status(400).json({ error: 'extraction required' });
    const xml = createTallyXml(extraction);
    const result = { success: true, tallyResponseXml: xml };
    res.json(result);
  });
}

module.exports = { registerVoucherRoutes };


