function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function el(name, content, attrs) {
  const attrStr = attrs
    ? ' ' + Object.entries(attrs).map(([k, v]) => `${k}="${escapeXml(v)}"`).join(' ')
    : '';
  if (content === undefined) return `<${name}${attrStr}/>`;
  return `<${name}${attrStr}>${content}</${name}>`;
}

function createTallyXml(data) {
  console.log('🔧 Creating Tally XML...');
  console.log(`📊 Processing ${data.invoices?.length || 0} invoices`);
  
  let xml = '<?xml version="1.0" encoding="utf-8"?>';
  xml += '<ENVELOPE><BODY><IMPORTDATA><REQUESTDATA>';
  
  for (const inv of data.invoices) {
    console.log(`📄 Processing invoice: ${inv.invoiceNumber}`);
    
    xml += '<TALLYMESSAGE>';
    xml += `<VOUCHER VCHTYPE="${escapeXml(inv.type)}" ACTION="Create">`;
    xml += el('DATE', escapeXml(inv.date.replace(/-/g, '')));
    xml += el('PARTYLEDGERNAME', escapeXml(inv.partyName));
    xml += el('VOUCHERNUMBER', escapeXml(inv.invoiceNumber));
    
    // Add GSTIN if available
    if (inv.partyGSTIN) {
      xml += el('PARTYGSTIN', escapeXml(inv.partyGSTIN));
    }
    
    // Add line items
    for (const item of inv.items) {
      xml += '<ALLLEDGERENTRIES.LIST>';
      xml += el('LEDGERNAME', escapeXml(item.description));
      xml += el('ISDEEMEDPOSITIVE', 'No');
      xml += el('AMOUNT', Number(item.amount).toFixed(2));
      
      // Add HSN code if available
      if (item.hsnCode) {
        xml += el('HSNCODE', escapeXml(item.hsnCode));
      }
      
      // Add quantity and rate if available
      if (item.quantity) {
        xml += el('QUANTITY', Number(item.quantity).toFixed(2));
      }
      if (item.rate) {
        xml += el('RATE', Number(item.rate).toFixed(2));
      }
      
      xml += '</ALLLEDGERENTRIES.LIST>';
    }
    
    // Add tax entries
    if (inv.totals.cgst > 0) {
      xml += '<ALLLEDGERENTRIES.LIST>';
      xml += el('LEDGERNAME', 'CGST');
      xml += el('ISDEEMEDPOSITIVE', 'No');
      xml += el('AMOUNT', Number(inv.totals.cgst).toFixed(2));
      xml += '</ALLLEDGERENTRIES.LIST>';
    }
    
    if (inv.totals.sgst > 0) {
      xml += '<ALLLEDGERENTRIES.LIST>';
      xml += el('LEDGERNAME', 'SGST');
      xml += el('ISDEEMEDPOSITIVE', 'No');
      xml += el('AMOUNT', Number(inv.totals.sgst).toFixed(2));
      xml += '</ALLLEDGERENTRIES.LIST>';
    }
    
    if (inv.totals.igst > 0) {
      xml += '<ALLLEDGERENTRIES.LIST>';
      xml += el('LEDGERNAME', 'IGST');
      xml += el('ISDEEMEDPOSITIVE', 'No');
      xml += el('AMOUNT', Number(inv.totals.igst).toFixed(2));
      xml += '</ALLLEDGERENTRIES.LIST>';
    }
    
    // Add party ledger entry
    xml += '<LEDGERENTRIES.LIST>';
    xml += el('LEDGERNAME', escapeXml(inv.partyName));
    xml += el('ISDEEMEDPOSITIVE', inv.type === 'Purchase' ? 'Yes' : 'No');
    xml += el('AMOUNT', Number(inv.totals.grandTotal).toFixed(2));
    xml += '</LEDGERENTRIES.LIST>';
    
    xml += '</VOUCHER>';
    xml += '</TALLYMESSAGE>';
  }
  
  xml += '</REQUESTDATA></IMPORTDATA></BODY></ENVELOPE>';
  
  console.log('✅ Tally XML created successfully');
  console.log(`📏 XML length: ${xml.length} characters`);
  
  return xml;
}

module.exports = { createTallyXml };


