// Fixed, fictional purchasing records for the public walkthrough.
// No document upload, external service, or workspace access is involved.
export const SAMPLES = {
  quantity: { label: 'A quantity discrepancy', supplier: 'Northwind Packaging', invoice: 'INV-10517', po: 'PO-84733', receipt: 'GRN-30925', item: 'Shipping cartons', invoiceQuantity: 120, orderedQuantity: 100, receivedQuantity: 100, invoiceUnitPrice: 104, orderedUnitPrice: 104, declaredSubtotal: 12480, earlierInvoices: [] },
  matching: { label: 'Matching records', supplier: 'Harbor Industrial Supply', invoice: 'INV-10482', po: 'PO-84721', receipt: 'GRN-30918', item: 'Hydraulic fitting kits', invoiceQuantity: 100, orderedQuantity: 100, receivedQuantity: 100, invoiceUnitPrice: 104, orderedUnitPrice: 104, declaredSubtotal: 10400, earlierInvoices: [] },
  duplicate: { label: 'A possible duplicate', supplier: 'Harbor Industrial Supply', invoice: 'INV-10482', po: 'PO-84721', receipt: 'GRN-30918', item: 'Hydraulic fitting kits', invoiceQuantity: 100, orderedQuantity: 100, receivedQuantity: 100, invoiceUnitPrice: 104, orderedUnitPrice: 104, declaredSubtotal: 10400, earlierInvoices: [{ invoice: 'INV-10482', supplier: 'Harbor Industrial Supply' }] },
};

export function checkSample(sample) {
  const overQuantity = Math.max(0, sample.invoiceQuantity - sample.receivedQuantity);
  const calculatedSubtotal = Math.round(sample.invoiceQuantity * sample.invoiceUnitPrice * 100) / 100;
  const priceMatches = sample.invoiceUnitPrice === sample.orderedUnitPrice;
  const arithmeticMatches = calculatedSubtotal === sample.declaredSubtotal;
  const duplicate = sample.earlierInvoices.some(previous => previous.invoice === sample.invoice && previous.supplier === sample.supplier);
  const findings = [];
  if (!arithmeticMatches) findings.push({ title: 'The printed subtotal differs', detail: 'The line quantity multiplied by its unit price does not equal the printed subtotal.', source: sample.invoice });
  if (!priceMatches) findings.push({ title: 'The unit price differs', detail: 'The invoice unit price does not match the purchase order price.', source: `${sample.invoice} / ${sample.po}` });
  if (overQuantity) findings.push({ title: `${overQuantity} units require review`, detail: `The invoice bills ${sample.invoiceQuantity} units. The receipt records ${sample.receivedQuantity}. Check whether a further delivery or missing receipt explains the difference.`, source: `${sample.invoice} / ${sample.receipt}` });
  if (duplicate) findings.push({ title: 'A possible duplicate requires review', detail: 'An earlier record has the same supplier and invoice number. Verify the original record before deciding whether this is a duplicate.', source: `${sample.invoice} / invoice history` });
  return { findings, overQuantity, calculatedSubtotal, arithmeticMatches, priceMatches, duplicate };
}
