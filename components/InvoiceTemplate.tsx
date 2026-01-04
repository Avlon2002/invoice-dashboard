'use client'

import React, { forwardRef } from 'react'

// 1. Define what a single item looks like
interface InvoiceItem {
  description: string
  price: number
}

// 2. Define what company info looks like
interface CompanyInfo {
  name: string
  address: string
  city: string
}

// 3. Update the main Props to accept the new complex data
interface InvoiceProps {
  clientName: string
  items: InvoiceItem[]     // Replaces 'amount' with a list of items
  companyInfo: CompanyInfo // New: Dynamic company details
  date: string
  id: string
}

const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceProps>((props, ref) => {
  
  // Logic: Calculate Total dynamically from the items array
  // We use .reduce() to add up all the prices in the list
  const total = props.items?.reduce((sum, item) => sum + Number(item.price), 0) || 0

  // Logic: Fallback defaults just in case companyInfo is missing
  const company = props.companyInfo || {
    name: "My Company Inc.",
    address: "123 Tech Street",
    city: "Silicon Valley, CA"
  }

  return (
    // A4 page: exactly 1 page
    <div ref={ref} className="bg-white text-black" style={{ width: '210mm', padding: '15mm', margin: '0', boxSizing: 'border-box', fontSize: '13px', lineHeight: '1.4' }}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4" style={{ borderBottom: '2px solid #1e40af', paddingBottom: '8px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#1e40af' }}>INVOICE</h1>
          <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>ID: {props.id ? String(props.id).slice(0, 6) : '000'}</p>
        </div>
        
        {/* Company Info */}
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 3px 0', fontWeight: 'bold', fontSize: '13px', color: '#1e40af' }}>{company.name}</p>
          <p style={{ margin: '0', color: '#666', fontSize: '11px' }}>{company.address}</p>
          <p style={{ margin: '0', color: '#666', fontSize: '11px' }}>{company.city}</p>
        </div>
      </div>

      {/* Bill To */}
      <div style={{ marginBottom: '5mm' }}>
        <p style={{ margin: '0 0 3px 0', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold', color: '#1e40af' }}>Bill To:</p>
        <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', fontSize: '13px', color: '#333' }}>{props.clientName}</p>
        <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>Date: {new Date(props.date).toLocaleDateString()}</p>
      </div>

      {/* Table */}
      <table style={{ width: '100%', marginBottom: '5mm', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #1e40af' }}>
            <th style={{ textAlign: 'left', padding: '4px 6px', fontSize: '12px', fontWeight: 'bold', color: '#1e40af' }}>Description</th>
            <th style={{ textAlign: 'right', padding: '4px 6px', fontSize: '12px', fontWeight: 'bold', color: '#1e40af' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {props.items?.map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '3px 6px', color: '#333', fontSize: '12px' }}>{item.description}</td>
              <td style={{ padding: '3px 6px', textAlign: 'right', fontFamily: 'monospace', fontSize: '12px', fontWeight: '500' }}>${Number(item.price).toFixed(2)}</td>
            </tr>
          ))}
          {(!props.items || props.items.length === 0) && (
            <tr>
              <td style={{ padding: '3px 6px', color: '#999', fontSize: '12px' }}>-</td>
              <td style={{ padding: '3px 6px', textAlign: 'right' }}>-</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5mm' }}>
        <div style={{ width: '50%' }}>
          <div style={{ borderTop: '2px solid #1e40af', paddingTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#333', fontSize: '13px', fontWeight: 'bold' }}>Total Due:</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af' }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', color: '#999', fontSize: '11px', borderTop: '1px solid #e5e7eb', paddingTop: '4mm', marginTop: '4mm' }}>
        <p style={{ margin: '0' }}>Thank you for your business!</p>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate'

export { InvoiceTemplate }