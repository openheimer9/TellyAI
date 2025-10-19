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

export function generateTallyXML(transactions) {
  console.log('🔧 Creating Tally XML...');
  console.log(`📊 Processing ${transactions?.length || 0} transactions`);
  
  let xml = '<?xml version="1.0" encoding="utf-8"?>';
  xml += '<ENVELOPE><BODY><IMPORTDATA><REQUESTDATA>';
  
  for (const tx of transactions) {
    console.log(`📄 Processing transaction: ${tx.description}`);
    
    xml += '<TALLYMESSAGE>';
    xml += `<VOUCHER VCHTYPE="${escapeXml(tx.type)}" ACTION="Create">`;
    xml += el('DATE', escapeXml(tx.date.replace(/-/g, '')));
    xml += el('VOUCHERNUMBER', escapeXml(tx.reference || ''));
    xml += el('NARRATION', escapeXml(tx.description));
    
    // Add ledger entries
    xml += '<ALLLEDGERENTRIES.LIST>';
    xml += el('LEDGERNAME', escapeXml(tx.account));
    xml += el('ISDEEMEDPOSITIVE', tx.type === 'debit' ? 'Yes' : 'No');
    xml += el('AMOUNT', Number(tx.amount).toFixed(2));
    xml += '</ALLLEDGERENTRIES.LIST>';
    
    // Add contra entry
    xml += '<LEDGERENTRIES.LIST>';
    xml += el('LEDGERNAME', escapeXml(tx.contraAccount));
    xml += el('ISDEEMEDPOSITIVE', tx.type === 'debit' ? 'No' : 'Yes');
    xml += el('AMOUNT', Number(tx.amount).toFixed(2));
    xml += '</LEDGERENTRIES.LIST>';
    
    xml += '</VOUCHER>';
    xml += '</TALLYMESSAGE>';
  }
  
  xml += '</REQUESTDATA></IMPORTDATA></BODY></ENVELOPE>';
  
  console.log('✅ Tally XML created successfully');
  console.log(`📏 XML length: ${xml.length} characters`);
  
  return xml;
}

export function validateTallyXML(xml) {
  if (!xml || typeof xml !== 'string') return false;
  
  // Basic structure validation
  const requiredElements = [
    '<?xml',
    '<ENVELOPE>',
    '<BODY>',
    '<IMPORTDATA>',
    '<REQUESTDATA>',
    '<TALLYMESSAGE>',
    '<VOUCHER',
    '</VOUCHER>',
    '</TALLYMESSAGE>',
    '</REQUESTDATA>',
    '</IMPORTDATA>',
    '</BODY>',
    '</ENVELOPE>'
  ];
  
  return requiredElements.every(el => xml.includes(el));
}


