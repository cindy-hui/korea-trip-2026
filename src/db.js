import { supabase } from './supabaseClient.js'
import { DEFAULT_QUICK_LINKS } from './constants.js'

// Default initial data
export const DEFAULT_ITINERARY = [
  {
    id: 'day1',
    day: 'Day 1',
    date: 'Monday, April 6',
    items: [
      {
        id: 11,
        text: '✈️ Arrive at Seoul Incheon Airport at 5.10 AM',
        mapQuery: 'Incheon Airport',
        tips: 'Buy a T-Money card at the convenience store and withdraw some KRW cash here.',
        time: '5:10 AM',
      },
      {
        id: 12,
        text: '🏠 Leena\'s 엄마 at Suwon & Lunch',
        mapQuery: 'Suwon Station',
        time: '',
      },
      {
        id: 13,
        text: 'Visit Hwaseong Fortress',
        mapQuery: 'Hwaseong Fortress Suwon',
        tips: 'Lots of walking! Wear comfortable shoes.',
        time: '',
      },
      {
        id: 14,
        text: 'Walk on the streets of Suwon & Cafes',
        mapQuery: 'Suwon Haenggung-dong',
        time: '',
      },
      {
        id: 15,
        text: '📍 Gyeonggadang (Hanok Cafe)',
        mapQuery: 'Gyeonggadang Suwon',
        time: '',
      },
      {
        id: 16,
        text: '🎨 Acorn Caricature',
        mapQuery: 'Acorn Caricature',
        tips: '~7,000 KRW for A5 size, ~12,000 KRW for A4 canvas. Great group memory!',
        time: '',
      },
      {
        id: 17,
        text: 'Suwon Starfield & London Bagel Museum',
        mapQuery: 'Starfield Suwon',
        tips: 'Expect a long queue for the bagels. Grab a queue number as soon as you arrive!',
        time: '',
      },
    ],
  },
  {
    id: 'day2',
    day: 'Day 2',
    date: 'Tuesday, April 7',
    items: [
      { id: 21, text: '🏠 Leena\'s 엄마 at Suwon', time: '' },
      {
        id: 22,
        text: '📝 Color Analysis',
        tips: 'Go bare-faced or with minimal makeup for the most accurate results!',
        time: '10:00 AM',
      },
      {
        id: 23,
        text: '🔍 Explore Seongsu (Jayeondo Salt Bread, Im Donut)',
        mapQuery: 'Seongsu-dong',
        time: '',
      },
      {
        id: 24,
        text: '☕ Cheonsang Gaok (Rooftop Cafe)',
        mapQuery: 'Cheonsang Gaok Seongsu',
        time: '',
      },
      {
        id: 25,
        text: '📸 Photobooth: WXCK Photo (Bathroom style)',
        mapQuery: 'WXCK Photo Seongsu',
        time: '',
      },
      {
        id: 26,
        text: '🛍️ Haus Nowhere Seoul & Blue Elephant Space',
        mapQuery: 'Haus Nowhere Seoul',
        time: '',
      },
    ],
  },
  {
    id: 'day3',
    day: 'Day 3',
    date: 'Wednesday, April 8',
    items: [
      { id: 31, text: '🏠 Leena\'s 엄마 at Suwon', time: '' },
      {
        id: 32,
        text: '🌸 Guri Flower Bed (sakura season)',
        mapQuery: 'Guri Flower Bed',
        tips: 'Amazing spot for cherry blossoms! Takes about 1 hour from Suwon.',
        time: '',
      },
      {
        id: 33,
        text: '🍽️ Jamsu Station Bridge Area',
        mapQuery: 'Jamsu Station',
        tips: 'Fun area for food and photos!',
        time: '',
      },
      {
        id: 34,
        text: 'Y зависимый блины (hotteok) at Jamsu',
        mapQuery: '',
        time: '',
      },
      {
        id: 35,
        text: 'Cafe with a nice view',
        mapQuery: '',
        time: '',
      },
    ],
  },
  {
    id: 'day4',
    day: 'Day 4',
    date: 'Thursday, April 9',
    items: [
      { id: 41, text: '🏠 Leena\'s 엄마 at Suwon', time: '' },
      {
        id: 42,
        text: 'Day trip to Busan?',
        tips: 'Consider KTX (~2 hours, ~60,000 KRW one-way)',
        time: '',
      },
      {
        id: 43,
        text: 'Haeundae Beach',
        mapQuery: 'Haeundae Beach Busan',
        time: '',
      },
      {
        id: 44,
        text: 'Gwangalli Beach & Diamond Bridge view',
        mapQuery: 'Gwangalli Beach',
        time: '',
      },
      {
        id: 45,
        text: 'Busan Cinema Street & Gamcheon Cultural Village',
        mapQuery: 'Gamcheon Cultural Village',
        time: '',
      },
      {
        id: 46,
        text: 'Jalgachi Market (if time)',
        mapQuery: 'Jalgachi Market',
        tips: 'Famous for raw fish and street food. Open until late.',
        time: '',
      },
    ],
  },
  {
    id: 'day5',
    day: 'Day 5',
    date: 'Friday, April 10',
    items: [
      { id: 51, text: '🏠 Leena\'s 엄마 at Suwon', time: '' },
      {
        id: 52,
        text: 'Namsan Seoul Tower & Loving Locks',
        mapQuery: 'N Seoul Tower',
        tips: 'Take cable car or hike up. Great views!',
        time: '',
      },
      {
        id: 53,
        text: 'Bukchon Hanok Village',
        mapQuery: 'Bukchon Hanok Village',
        tips: 'Traditional Korean houses, great for photos!',
        time: '',
      },
      {
        id: 54,
        text: 'Ikseon-dong Hanok Village',
        mapQuery: 'Ikseon-dong',
        tips: 'Cute alleys with shops and cafes.',
        time: '',
      },
      {
        id: 55,
        text: 'Insadong for traditional crafts & tea',
        mapQuery: 'Insadong',
        time: '',
      },
      {
        id: 56,
        text: 'Myeongdong for shopping & street food',
        mapQuery: 'Myeongdong',
        tips: 'Busy area with lots of shops and street food stalls.',
        time: '',
      },
    ],
  },
]

export const DEFAULT_PACKING_LIST = {
  'Day 1 outfits': [
    { id: 1, name: 'Day 1 outfit', checked: false },
    { id: 2, name: 'Comfortable walking shoes', checked: false },
  ],
  'Day 2 outfits': [
    { id: 3, name: 'Day 2 outfit', checked: false },
    { id: 4, name: 'Light jacket', checked: false },
  ],
  'Day 3 outfits': [{ id: 5, name: 'Day 3 outfit', checked: false }],
  'Day 4 outfits': [{ id: 6, name: 'Day 4 outfit', checked: false }],
  'Day 5 outfits': [
    { id: 7, name: 'Day 5 comfy travel clothes', checked: false },
  ],
  Essentials: [
    { id: 8, name: 'Passport (Check expiry!)', checked: false },
    { id: 9, name: 'K-ETA (If required for your passport)', checked: false },
    { id: 10, name: 'T-Money Card (If you kept one from before)', checked: false },
    { id: 11, name: 'Cash (KRW) & Travel Cards (YouTrip/Wowpass)', checked: false },
  ],
  Electronics: [
    {
      id: 12,
      name: 'Universal Adapter (Korea uses Type C/F 220V)',
      checked: false,
    },
    { id: 13, name: 'Powerbank (Vital for long days out)', checked: false },
    { id: 14, name: 'E-SIM / Portable Wifi', checked: false },
    { id: 15, name: 'Phone/Camera Chargers', checked: false },
  ],
}

export const DEFAULT_KRW_RATE = 0.0052

// Database operations
export const db = {
  // Load all data from database
  async loadAll() {
    try {
      // Check if supabase is available
      if (!supabase || typeof supabase.from !== 'function') {
        console.warn('⚠️ Supabase client not available, using default data')
        return {
          itinerary: DEFAULT_ITINERARY,
          packingList: DEFAULT_PACKING_LIST,
          expenses: [],
          krwRate: DEFAULT_KRW_RATE,
        }
      }

      console.log('📥 Loading data from Supabase...')

      // Load itinerary
      const { data: itineraryData, error: itineraryError } = await supabase
        .from('itinerary')
        .select('*')
        .limit(1)
        .maybeSingle()

      console.log('📥 Itinerary query result:', { itineraryData, itineraryError })

      // Load packing list
      const { data: packingData, error: packingError } = await supabase
        .from('packing_list')
        .select('*')
        .limit(1)
        .maybeSingle()

      console.log('📥 Packing query result:', { packingData, packingError })

      // Load expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .limit(1)
        .maybeSingle()

      console.log('📥 Expenses query result:', {
        expensesData,
        expensesError,
        type: typeof expensesData,
        keys: expensesData ? Object.keys(expensesData) : null
      })

      // Load KRW rate
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'krw_rate')
        .limit(1)
        .maybeSingle()

      console.log('📥 Settings query result:', { settingsData, settingsError })

      // Load quick links
      const { data: quickLinksData, error: quickLinksError } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'quick_links')
        .limit(1)
        .maybeSingle()

      console.log('📥 Quick links query result:', { quickLinksData, quickLinksError })

      // Check for errors (but don't fail if quick_links doesn't exist yet)
      const hasCriticalError = itineraryError || packingError || expensesError
      if (hasCriticalError) {
        console.error('❌ Database load errors:', {
          itineraryError,
          packingError,
          expensesError,
          settingsError
        })
        // Return defaults if any table doesn't exist yet or query fails
        return {
          itinerary: DEFAULT_ITINERARY,
          packingList: DEFAULT_PACKING_LIST,
          expenses: [],
          krwRate: DEFAULT_KRW_RATE,
          quickLinks: DEFAULT_QUICK_LINKS,
        }
      }

      let quickLinks = DEFAULT_QUICK_LINKS
      if (quickLinksData && !quickLinksError) {
        try {
          quickLinks = JSON.parse(quickLinksData.value)
          console.log('✅ Loaded quick links:', quickLinks)
        } catch (e) {
          console.error('❌ Failed to parse quick links:', e)
        }
      }

      const result = {
        itinerary: itineraryData?.data || DEFAULT_ITINERARY,
        packingList: packingData?.data || DEFAULT_PACKING_LIST,
        expenses: expensesData ? (expensesData.data || [expensesData]) : [],
        krwRate: settingsData ? parseFloat(settingsData.value) : DEFAULT_KRW_RATE,
        quickLinks,
      }

      console.log('📥 Loaded data summary:', {
        itineraryCount: result.itinerary.length,
        packingKeys: Object.keys(result.packingList).length,
        expensesCount: result.expenses.length,
        krwRate: result.krwRate
      })

      return result
    } catch (error) {
      console.error('❌ Failed to load data from database:', error)
      // Return defaults on any error (network, CORS, etc.)
      return {
        itinerary: DEFAULT_ITINERARY,
        packingList: DEFAULT_PACKING_LIST,
        expenses: [],
        krwRate: DEFAULT_KRW_RATE,
        quickLinks: DEFAULT_QUICK_LINKS,
      }
    }
  },

  // Save itinerary to database
  async saveItinerary(itinerary) {
    try {
      // Check if supabase is available
      if (!supabase || typeof supabase.from !== 'function') {
        console.warn('⚠️ Supabase client not available, skipping save')
        return { success: true, skipped: true }
      }

      const { error } = await supabase
        .from('itinerary')
        .upsert({ id: 'main', data: itinerary }, { onConflict: 'id' })

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Failed to save itinerary:', error)
      return { success: false, error }
    }
  },

  // Save packing list to database
  async savePackingList(packingList) {
    try {
      if (!supabase || typeof supabase.from !== 'function') {
        console.warn('⚠️ Supabase client not available, skipping save')
        return { success: true, skipped: true }
      }

      const { error } = await supabase
        .from('packing_list')
        .upsert({ id: 'main', data: packingList }, { onConflict: 'id' })

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Failed to save packing list:', error)
      return { success: false, error }
    }
  },

  // Save expenses to database
  async saveExpenses(expenses) {
    try {
      if (!supabase || typeof supabase.from !== 'function') {
        console.warn('⚠️ Supabase client not available, skipping save')
        return { success: true, skipped: true }
      }

      console.log('📤 Saving expenses to Supabase:', expenses)
      const { data, error } = await supabase
        .from('expenses')
        .upsert({ id: 'main', data: expenses }, { onConflict: 'id' })
        .select()

      console.log('📤 Supabase response:', { data, error })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('❌ Failed to save expenses:', error)
      return { success: false, error }
    }
  },

  // Save KRW rate to database
  async saveKrwRate(krwRate) {
    try {
      if (!supabase || typeof supabase.from !== 'function') {
        console.warn('⚠️ Supabase client not available, skipping save')
        return { success: true, skipped: true }
      }

      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'krw_rate', value: krwRate.toString() }, { onConflict: 'key' })

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Failed to save KRW rate:', error)
      return { success: false, error }
    }
  },

  // Load quick links from database
  async loadQuickLinks() {
    try {
      if (!supabase || typeof supabase.from !== 'function') {
        console.warn('⚠️ Supabase client not available, using default quick links')
        return DEFAULT_QUICK_LINKS
      }

      console.log('📥 Loading quick links from Supabase...')
      const { data: quickLinksData, error: quickLinksError } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'quick_links')
        .limit(1)
        .maybeSingle()

      console.log('📥 Quick links query result:', { quickLinksData, quickLinksError })

      if (quickLinksError || !quickLinksData) {
        console.warn('⚠️ Quick links not found, using defaults')
        return DEFAULT_QUICK_LINKS
      }

      try {
        const quickLinks = JSON.parse(quickLinksData.value)
        console.log('✅ Loaded quick links:', quickLinks)
        return quickLinks
      } catch (parseError) {
        console.error('❌ Failed to parse quick links:', parseError)
        return DEFAULT_QUICK_LINKS
      }
    } catch (error) {
      console.error('❌ Failed to load quick links from database:', error)
      return DEFAULT_QUICK_LINKS
    }
  },

  // Save quick links to database
  async saveQuickLinks(quickLinks) {
    try {
      if (!supabase || typeof supabase.from !== 'function') {
        console.warn('⚠️ Supabase client not available, skipping save')
        return { success: true, skipped: true }
      }

      console.log('📤 Saving quick links to Supabase:', quickLinks)
      const serialized = JSON.stringify(quickLinks)
      console.log('📤 Serialized value:', serialized)
      const { data, error } = await supabase
        .from('settings')
        .upsert({ key: 'quick_links', value: serialized }, { onConflict: 'key' })
        .select()

      console.log('📤 Upsert response:', { data, error })
      if (error) throw error
      console.log('✅ Quick links saved successfully')
      return { success: true, data }
    } catch (error) {
      console.error('❌ Failed to save quick links:', error)
      console.error('   Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      return { success: false, error }
    }
  },

  // Save all data at once
  async saveAll(itinerary, packingList, expenses, krwRate, quickLinks) {
    try {
      // Use Promise.all to save all concurrently
      const [itineraryResult, packingResult, expensesResult, krwResult, quickLinksResult] = await Promise.allSettled([
        this.saveItinerary(itinerary),
        this.savePackingList(packingList),
        this.saveExpenses(expenses),
        this.saveKrwRate(krwRate),
        this.saveQuickLinks(quickLinks),
      ])

      const errors = []
      if (itineraryResult.status === 'rejected') errors.push('itinerary')
      if (packingResult.status === 'rejected') errors.push('packing')
      if (expensesResult.status === 'rejected') errors.push('expenses')
      if (krwResult.status === 'rejected') errors.push('krw_rate')
      if (quickLinksResult.status === 'rejected') errors.push('quick_links')

      if (errors.length > 0) {
        return { success: false, errors }
      }
      return { success: true }
    } catch (error) {
      console.error('Failed to save all data:', error)
      return { success: false, error }
    }
  },
}
