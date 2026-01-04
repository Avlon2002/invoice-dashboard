'use client'

import React, { useEffect, useState, useRef } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { useReactToPrint } from 'react-to-print'
import { InvoiceTemplate } from '@/components/InvoiceTemplate'

// Updated Interface to match Supabase JSON columns
interface Invoice {
  id: string
  client_name: string
  amount: number
  status: string
  created_at: string
  items: { description: string; price: number }[] // The JSON column
  company_info: { name: string; address: string; city: string } // The JSON column
}

export default function Home() {
  // ---------------- STATE ----------------
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  // Form State: Company Info (Sender)
  const [myCompany, setMyCompany] = useState({
    name: 'My Tech Startup',
    address: '123 Code Lane',
    city: 'San Francisco, CA'
  })

  // Form State: Client & Items
  const [clientName, setClientName] = useState('')
  const [items, setItems] = useState([
    { description: 'Web Development Services', price: 0 }
  ])

  // Print State
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const componentRef = useRef<HTMLDivElement>(null)

  // ---------------- AUTH PROTECTION ----------------
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        // Optional: Redirect to login or handle differently
         window.location.href = '/login' 
      }
    }
    checkUser()
  }, [])

  // ---------------- HELPER FUNCTIONS ----------------
  const addItem = () => {
    setItems([...items, { description: '', price: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: 'description' | 'price', value: string | number) => {
    const newItems = [...items]
    // @ts-ignore
    newItems[index][field] = value
    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + Number(item.price || 0), 0)
  }

  // ---------------- FETCH ----------------
  const fetchInvoices = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Fetch error:', error)
    else setInvoices(data as Invoice[])
    
    setIsLoading(false)
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  // ---------------- CREATE ----------------
  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('You must be logged in')
        return
      }

      const totalAmount = calculateTotal()

      const { error } = await supabase.from('invoices').insert({
        client_name: clientName,
        amount: totalAmount, // We save the total for easy display
        items: items,        // We save the details for the PDF
        company_info: myCompany, // We save sender details
        status: 'Pending',
        user_id: user.id,
      })

      if (error) throw error

      // Reset Form
      setClientName('')
      setItems([{ description: '', price: 0 }])
      fetchInvoices()
      
    } catch (err) {
      console.error('Create error:', err)
      alert('Failed to create invoice')
    } finally {
      setIsCreating(false)
    }
  }

  // ---------------- PRINT ----------------
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  })

  const loadAndPrint = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    // Wait for state to update before printing
    setTimeout(() => handlePrint(), 200)
  }

  // ---------------- UI ----------------
  return (
    <main className="p-8 max-w-6xl mx-auto bg-gradient-to-b from-slate-50 to-white min-h-screen">
      
      {/* HEADER */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Invoice Dashboard
        </h1>
        <p className="text-gray-500">Create professional invoices in seconds.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: THE FORM */}
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-6 text-blue-900 border-b pb-2">
            ✏️ Create New Invoice
          </h2>

          <form onSubmit={createInvoice} className="space-y-6">
            
            {/* 1. Sender Info (My Company) */}
            <div className="bg-slate-50 p-4 rounded-lg space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase">My Company Details</label>
              <input 
                type="text" placeholder="Company Name" required
                value={myCompany.name} onChange={e => setMyCompany({...myCompany, name: e.target.value})}
                className="w-full p-2 text-sm border rounded focus:outline-blue-500 placeholder-gray-600 text-gray-900 font-medium"
              />
              <div className="flex gap-2">
                <input 
                  type="text" placeholder="Address" required
                  value={myCompany.address} onChange={e => setMyCompany({...myCompany, address: e.target.value})}
                  className="w-full p-2 text-sm border rounded focus:outline-blue-500 placeholder-gray-600 text-gray-900 font-medium"
                />
                <input 
                  type="text" placeholder="City, State" required
                  value={myCompany.city} onChange={e => setMyCompany({...myCompany, city: e.target.value})}
                  className="w-full p-2 text-sm border rounded focus:outline-blue-500 placeholder-gray-600 text-gray-900 font-medium"
                />
              </div>
            </div>

            {/* 2. Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <input
                type="text" placeholder="e.g. Acme Corp"
                value={clientName} onChange={(e) => setClientName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 placeholder-gray-600 text-gray-900 font-medium"
                required
              />
            </div>

            {/* 3. Dynamic Items List */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Items</label>
                <span className="text-xs text-gray-400">Add detailed services</span>
              </div>
              
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <input
                      type="text" placeholder="Description" required
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-100 placeholder-gray-600 text-gray-900 font-medium"
                    />
                    <input
                      type="number" placeholder="0.00" required
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', e.target.value)}
                      className="w-24 p-2 border rounded focus:ring-2 focus:ring-blue-100 placeholder-gray-600 text-gray-900 font-medium"
                    />
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(index)} className="p-2 text-red-400 hover:text-red-600">✕</button>
                    )}
                  </div>
                ))}
              </div>
              
              <button type="button" onClick={addItem} className="mt-2 text-sm text-blue-600 font-medium hover:underline">
                + Add Another Item
              </button>
            </div>

            {/* Total Calculation */}
            <div className="pt-4 border-t flex justify-between items-center">
              <span className="font-bold text-gray-600">Total Due:</span>
              <span className="text-2xl font-bold text-blue-600">${calculateTotal().toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {isCreating ? 'Generating...' : 'Save & Create Invoice'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: LIST */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">History</h2>
          
          {isLoading ? (
            <div className="text-center py-10 text-gray-400">Loading your invoices...</div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No invoices yet. Create your first one!</p>
            </div>
          ) : (
            invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{invoice.client_name}</h3>
                    <p className="text-xs text-gray-400">ID: {String(invoice.id).slice(0, 8)}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {invoice.status}
                  </span>
                </div>

                {/* Items Preview */}
                <div className="mb-4 space-y-1">
                  {invoice.items && invoice.items.slice(0, 2).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-gray-600">
                      <span>• {item.description}</span>
                      <span className="font-mono">${item.price}</span>
                    </div>
                  ))}
                  {invoice.items && invoice.items.length > 2 && <p className="text-xs text-gray-400 italic">...and {invoice.items.length - 2} more</p>}
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <span className="font-bold text-xl text-gray-800">${invoice.amount}</span>
                  <button
                    onClick={() => loadAndPrint(invoice)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    📄 Download PDF
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* HIDDEN PRINT TEMPLATE */}
      <div className="hidden">
        {selectedInvoice && (
          <InvoiceTemplate
            ref={componentRef}
            id={selectedInvoice.id}
            clientName={selectedInvoice.client_name}
            items={selectedInvoice.items} // Pass the list
            companyInfo={selectedInvoice.company_info} // Pass the sender info
            date={selectedInvoice.created_at}
          />
        )}
      </div>
    </main>
  )
}