import { jsPDF } from 'jspdf';
import { Property, Host } from '../types';
import { formatBDT } from './utils';

export interface PropertyPdfOptions {
  includeLandlordInfo?: boolean;
  includeRentalTerms?: boolean;
  includeNeighborhood?: boolean;
  includeAmenities?: boolean;
  includeVerificationSeal?: boolean;
  notes?: string;
}

export function generatePropertyPdf(
  property: Property,
  host: Host,
  landmarks: Array<{ name: string; type: string; distance: string }>,
  options: PropertyPdfOptions = {
    includeLandlordInfo: true,
    includeRentalTerms: true,
    includeNeighborhood: true,
    includeAmenities: true,
    includeVerificationSeal: true,
  }
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Color Palette Constants
  const COLOR_PRIMARY = [63, 53, 49]; // #3f3531 dark brown/charcoal
  const COLOR_SECONDARY = [92, 79, 74]; // #5c4f4a medium warm slate
  const COLOR_ACCENT = [201, 153, 107]; // #c9996b warm gold/bronze
  const COLOR_TEAL = [92, 118, 109]; // #5c766d sage teal
  const COLOR_BG_LIGHT = [245, 243, 241]; // #f5f3f1 soft warm card
  const COLOR_TEXT_DARK = [40, 35, 33];
  const COLOR_TEXT_MUTED = [110, 100, 95];
  const COLOR_BORDER = [220, 215, 210];

  let y = margin;

  // Helper for footer on every page
  const addPageFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(COLOR_BORDER[0], COLOR_BORDER[1], COLOR_BORDER[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
    doc.text(
      'Nestora Dhaka Premium Rentals • Verified Property Specification & Rental Terms Brief',
      margin,
      pageHeight - 7
    );
    doc.text(
      `Page ${pageNum} of ${totalPages} • Ref: NES-DHK-${property.id.toUpperCase()}`,
      pageWidth - margin,
      pageHeight - 7,
      { align: 'right' }
    );
  };

  // ================= PAGE 1 =================

  // Top Header Brand Bar
  doc.setFillColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.roundedRect(margin, y, contentWidth, 22, 2.5, 2.5, 'F');

  // Brand Name & Tagline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('NESTORA', margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
  doc.text('DHAKA RESIDENTIAL LUXURY & VERIFIED LEASING', margin + 6, y + 15);

  // Document Badge on Right
  doc.setFillColor(COLOR_SECONDARY[0], COLOR_SECONDARY[1], COLOR_SECONDARY[2]);
  doc.roundedRect(pageWidth - margin - 58, y + 4.5, 52, 13, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('PROPERTY SUMMARY REPORT', pageWidth - margin - 32, y + 9.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(220, 220, 220);
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  doc.text(`Issued: ${formattedDate} • Ref #${property.id.toUpperCase()}`, pageWidth - margin - 32, y + 14.5, {
    align: 'center',
  });

  y += 27;

  // Title & Location Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  
  // Wrap title if long
  const titleLines = doc.splitTextToSize(property.title, contentWidth - 48);
  doc.text(titleLines, margin, y + 5);
  const titleHeight = titleLines.length * 6;

  // Rent Price Badge (Top Right)
  const priceBoxWidth = 44;
  const priceBoxHeight = 18;
  doc.setFillColor(COLOR_BG_LIGHT[0], COLOR_BG_LIGHT[1], COLOR_BG_LIGHT[2]);
  doc.setDrawColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
  doc.setLineWidth(0.6);
  doc.roundedRect(pageWidth - margin - priceBoxWidth, y, priceBoxWidth, priceBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.text(formatBDT(property.price), pageWidth - margin - priceBoxWidth / 2, y + 7, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
  doc.text('Monthly Rent (Net)', pageWidth - margin - priceBoxWidth / 2, y + 12.5, { align: 'center' });

  y += Math.max(titleHeight + 2, priceBoxHeight + 2);

  // Sub-header: Location & Rating
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(COLOR_SECONDARY[0], COLOR_SECONDARY[1], COLOR_SECONDARY[2]);
  doc.text(`${property.location}, ${property.area}, Dhaka`, margin, y);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_TEAL[0], COLOR_TEAL[1], COLOR_TEAL[2]);
  doc.text(`★ ${property.rating} (${property.reviewCount} Reviews)  •  Status: ${property.availability}`, margin, y + 5);

  y += 10;

  // Key Specifications Pill Matrix
  const specBoxHeight = 16;
  const specCols = 4;
  const specColWidth = (contentWidth - 6) / specCols;

  const specs = [
    { label: 'Property Type', val: property.propertyType },
    { label: 'Floor Space', val: `${property.areaSqFt} Sq.Ft` },
    { label: 'Layout Specs', val: `${property.bedrooms} Beds / ${property.bathrooms} Baths` },
    { label: 'Furnishing', val: property.furnished },
  ];

  specs.forEach((spec, idx) => {
    const boxX = margin + idx * (specColWidth + 2);
    doc.setFillColor(COLOR_BG_LIGHT[0], COLOR_BG_LIGHT[1], COLOR_BG_LIGHT[2]);
    doc.setDrawColor(COLOR_BORDER[0], COLOR_BORDER[1], COLOR_BORDER[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(boxX, y, specColWidth, specBoxHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
    doc.text(spec.label.toUpperCase(), boxX + specColWidth / 2, y + 5.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text(spec.val, boxX + specColWidth / 2, y + 11.5, { align: 'center' });
  });

  y += specBoxHeight + 6;

  // SECTION 1: Rental Terms & Financial Schedule
  if (options.includeRentalTerms) {
    doc.setFillColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.rect(margin, y, 3, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text('1. RENTAL TERMS & FINANCIAL COMMITMENT', margin + 5, y + 4.8);

    y += 8;

    const termsBoxHeight = 44;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(COLOR_BORDER[0], COLOR_BORDER[1], COLOR_BORDER[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, termsBoxHeight, 2, 2, 'FD');

    // 2-column breakdown table inside
    const colW = contentWidth / 2;

    const termRowsLeft = [
      { label: 'Monthly Base Rent', value: formatBDT(property.price) },
      {
        label: 'Building Service Charge',
        value: property.serviceCharge ? `${formatBDT(property.serviceCharge)} / mo` : 'Included in Base Rent',
      },
      {
        label: 'Refundable Security Deposit',
        value: formatBDT(property.securityDeposit || property.price * 2) + ` (${((property.securityDeposit || property.price * 2) / property.price).toFixed(0)} months)`,
      },
      { label: 'Standard Lease Duration', value: '12 Months (Renewable)' },
    ];

    const termRowsRight = [
      { label: 'Payment Due Date', value: 'By 5th - 7th of each calendar month' },
      { label: 'Payment Channels', value: 'Bank Transfer / BEFTN / bKash / Cheque' },
      { label: 'Notice for Termination', value: '2 Months written advance notice' },
      { label: 'Electricity & Gas Meter', value: 'Individual prepaid meter (DESCO/DPDC/Titas)' },
    ];

    termRowsLeft.forEach((row, i) => {
      const rowY = y + 7 + i * 9;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
      doc.text(row.label, margin + 4, rowY);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
      doc.text(row.value, margin + colW - 6, rowY, { align: 'right' });
    });

    // Vertical separator
    doc.setDrawColor(COLOR_BORDER[0], COLOR_BORDER[1], COLOR_BORDER[2]);
    doc.setLineWidth(0.3);
    doc.line(margin + colW, y + 4, margin + colW, y + termsBoxHeight - 4);

    termRowsRight.forEach((row, i) => {
      const rowY = y + 7 + i * 9;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
      doc.text(row.label, margin + colW + 4, rowY);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
      doc.text(row.value, margin + contentWidth - 4, rowY, { align: 'right' });
    });

    y += termsBoxHeight + 6;
  }

  // SECTION 2: Verified Dhaka Engineering & Utility Amenities
  if (options.includeAmenities) {
    doc.setFillColor(COLOR_TEAL[0], COLOR_TEAL[1], COLOR_TEAL[2]);
    doc.rect(margin, y, 3, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text('2. VERIFIED DHAKA UTILITIES & AMENITY INFRASTRUCTURE', margin + 5, y + 4.8);

    y += 8;

    const amenBoxHeight = 36;
    doc.setFillColor(COLOR_BG_LIGHT[0], COLOR_BG_LIGHT[1], COLOR_BG_LIGHT[2]);
    doc.setDrawColor(COLOR_BORDER[0], COLOR_BORDER[1], COLOR_BORDER[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, amenBoxHeight, 2, 2, 'FD');

    // 3 Highlight Callouts: Generator, Gas Pipeline, Security & Water
    const calloutW = (contentWidth - 6) / 3;

    // 1. Generator
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + 2, y + 3, calloutW, 30, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9); // amber
    doc.text('⚡ Standby Generator', margin + 5, y + 9);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(COLOR_TEXT_DARK[0], COLOR_TEXT_DARK[1], COLOR_TEXT_DARK[2]);
    doc.text('• 100% Full Load Backup', margin + 5, y + 15);
    doc.text('• ACs, Lift & Pumps on Gen', margin + 5, y + 20);
    doc.text('• Auto Changeover (ATS)', margin + 5, y + 25);

    // 2. Gas & Water
    const c2X = margin + 2 + calloutW + 1;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(c2X, y + 3, calloutW, 30, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(194, 65, 12); // orange
    doc.text('🔥 Cooking Gas & Water', c2X + 3, y + 9);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(COLOR_TEXT_DARK[0], COLOR_TEXT_DARK[1], COLOR_TEXT_DARK[2]);
    doc.text('• Titas Gas Direct Pipeline', c2X + 3, y + 15);
    doc.text('• WASA + Deep Tube-well', c2X + 3, y + 20);
    doc.text('• Overhead Filtration Tanks', c2X + 3, y + 25);

    // 3. Security & Access
    const c3X = c2X + calloutW + 1;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(c3X, y + 3, calloutW, 30, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(16, 115, 80); // emerald
    doc.text('🛡 24/7 Security & Lifts', c3X + 3, y + 9);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(COLOR_TEXT_DARK[0], COLOR_TEXT_DARK[1], COLOR_TEXT_DARK[2]);
    doc.text('• Dual High-Speed Elevators', c3X + 3, y + 15);
    doc.text('• CCTV Perimeter Monitoring', c3X + 3, y + 20);
    doc.text('• Guarded Gated Access', c3X + 3, y + 25);

    y += amenBoxHeight + 6;

    // Full Checked Amenities Pill Strip
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_SECONDARY[0], COLOR_SECONDARY[1], COLOR_SECONDARY[2]);
    doc.text('Included Fixtures & Amenities:', margin, y + 3);

    const amenityList = property.amenities.join('   •   ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
    doc.text(amenityList, margin + 48, y + 3);

    y += 8;
  }

  // SECTION 3: Neighborhood & Proximity Highlights
  if (options.includeNeighborhood) {
    doc.setFillColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
    doc.rect(margin, y, 3, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text(`3. NEIGHBORHOOD PROFILE & LANDMARK PROXIMITY (${property.area.toUpperCase()})`, margin + 5, y + 4.8);

    y += 8;

    const neighBoxHeight = 36;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(COLOR_BORDER[0], COLOR_BORDER[1], COLOR_BORDER[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, neighBoxHeight, 2, 2, 'FD');

    // 2x2 Landmark Grid
    const halfW = contentWidth / 2;
    const lms = landmarks.slice(0, 4);

    lms.forEach((lm, idx) => {
      const isRight = idx % 2 === 1;
      const isBottom = idx >= 2;
      const lmX = margin + (isRight ? halfW + 4 : 4);
      const lmY = y + (isBottom ? 22 : 8);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
      doc.text(`📍 ${lm.name}`, lmX, lmY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(COLOR_TEAL[0], COLOR_TEAL[1], COLOR_TEAL[2]);
      doc.text(`${lm.type} — ${lm.distance}`, lmX + 4, lmY + 5);
    });

    y += neighBoxHeight + 6;
  }

  // SECTION 4: Landlord & Verification Seal
  if (options.includeLandlordInfo) {
    const contactBoxHeight = 24;
    doc.setFillColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.roundedRect(margin, y, contentWidth, contactBoxHeight, 2, 2, 'F');

    // Left host details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`Landlord / Verified Host: ${host.name}`, margin + 6, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(200, 200, 200);
    doc.text(
      `Hosting since ${host.joinedYear} • Superhost (${host.rating}★ rating, ${host.reviewCount} reviews) • Phone: ${host.phone} • Email: ${host.email}`,
      margin + 6,
      y + 13
    );
    doc.text(
      `Response time: ${host.responseTime} • Verified with National ID & Deed verification`,
      margin + 6,
      y + 19
    );

    // Right Verified Stamp Badge
    if (options.includeVerificationSeal) {
      doc.setFillColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
      doc.roundedRect(pageWidth - margin - 46, y + 4, 40, 16, 1.5, 1.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
      doc.text('NESTORA VERIFIED', pageWidth - margin - 26, y + 10, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.text('100% INSPECTED LEASE', pageWidth - margin - 26, y + 15, { align: 'center' });
    }

    y += contactBoxHeight + 4;
  }

  // Add Page 1 Footer
  addPageFooter(1, 1);

  return doc;
}
