import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from '../types';

interface PdfLabels {
  title: string;
  date: string;
  billTo: string;
  item: string;
  quantity: string;
  price: string;
  total: string;
  subtotal: string;
  tax: string;
  grandTotal: string;
  invoiceNum: string;
}

export const PdfService = {
  generateInvoice: (invoice: Invoice, labels: PdfLabels, shopName: string) => {
    const doc = new jsPDF();

    // --- Header Section ---
    
    // Shop Name (Top Left)
    doc.setFontSize(24);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.setFont("helvetica", "bold");
    doc.text(shopName, 14, 20);

    // Invoice Title & Details (Top Right)
    doc.setFontSize(20);
    doc.setTextColor(0); // Black
    doc.text(labels.title, 140, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100); // Gray
    doc.setFont("helvetica", "normal");
    doc.text(`${labels.invoiceNum} ${invoice.invoiceNumber}`, 140, 28);
    doc.text(`${labels.date}: ${new Date(invoice.date).toLocaleDateString()}`, 140, 33);

    // --- Bill To Section ---
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(labels.billTo, 14, 45);
    
    doc.setFontSize(10);
    doc.setTextColor(80); // Dark Gray
    doc.setFont("helvetica", "normal");
    let yPos = 52;
    
    // Customer Name
    doc.text(invoice.customerName, 14, yPos);
    yPos += 5;

    // Customer Address
    if (invoice.customerAddress) {
      doc.text(invoice.customerAddress, 14, yPos);
      yPos += 5;
    }

    // Customer Phone
    if (invoice.customerPhone) {
      doc.text(`Ph: ${invoice.customerPhone}`, 14, yPos);
      yPos += 5;
    }
    
    // --- Items Table ---
    const tableColumn = [labels.item, labels.quantity, labels.price, labels.total];
    const tableRows = invoice.items.map(item => [
      item.productName,
      `${item.quantity} ${item.unit || ''}`,
      `Rs. ${item.price.toFixed(2)}`,
      `Rs. ${item.total.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: yPos + 10, // Dynamic start based on content height
      head: [tableColumn],
      body: tableRows,
      headStyles: { fillColor: [79, 70, 229] }, // Indigo 600
      styles: { font: "helvetica" },
      theme: 'grid'
    });

    // --- Totals Section ---
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY || 150;
    const rightMargin = 130;
    
    doc.setTextColor(0);
    doc.text(`${labels.subtotal}: Rs. ${invoice.subtotal.toFixed(2)}`, rightMargin, finalY + 10);
    doc.text(`${labels.tax}: Rs. ${invoice.taxAmount.toFixed(2)}`, rightMargin, finalY + 15);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229);
    doc.text(`${labels.grandTotal}: Rs. ${invoice.total.toFixed(2)}`, rightMargin, finalY + 25);

    // Footer message (optional)
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your business!", 14, finalY + 35);

    doc.save(`invoice_${invoice.invoiceNumber}.pdf`);
  }
};