import { create } from 'xmlbuilder2';
import { ClaudeExtraction } from '../types/claude.js';

export function createTallyXml(data: ClaudeExtraction): string {
  const root = create({ version: '1.0', encoding: 'utf-8' }).ele('ENVELOPE');
  const body = root.ele('BODY').ele('IMPORTDATA').ele('REQUESTDATA');

  for (const inv of data.invoices) {
    const tallyMessage = body.ele('TALLYMESSAGE');
    const voucher = tallyMessage.ele('VOUCHER', { VCHTYPE: inv.type, ACTION: 'Create' });
    voucher.ele('DATE').txt(inv.date.replace(/-/g, ''));
    voucher.ele('PARTYLEDGERNAME').txt(inv.partyName);
    voucher.ele('VOUCHERNUMBER').txt(inv.invoiceNumber);

    for (const item of inv.items) {
      const allLedger = voucher.ele('ALLLEDGERENTRIES.LIST');
      allLedger.ele('LEDGERNAME').txt(item.description);
      allLedger.ele('ISDEEMEDPOSITIVE').txt('No');
      allLedger.ele('AMOUNT').txt(item.amount.toFixed(2));
    }

    voucher.ele('LEDGERENTRIES.LIST').ele('AMOUNT').txt(inv.totals.grandTotal.toFixed(2));
  }

  return root.end({ prettyPrint: true });
}


