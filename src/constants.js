// Constants for Seoul Trip App
import { DEFAULT_KRW_RATE } from './db';

export const FRIENDS = ['Cindy', 'Leena', 'Mel', 'Soobin'];

export const INITIAL_ITINERARY = [
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
      },
      {
        id: 12,
        text: '🏠 Leena\'s 엄마 at Suwon & Lunch',
        mapQuery: 'Suwon Station',
      },
      {
        id: 13,
        text: 'Visit Hwaseong Fortress',
        mapQuery: 'Hwaseong Fortress Suwon',
        tips: 'Lots of walking! Wear comfortable shoes.',
      },
      {
        id: 14,
        text: 'Walk on the streets of Suwon & Cafes',
        mapQuery: 'Suwon Haenggung-dong',
      },
      {
        id: 15,
        text: '📍 Gyeonggadang (Hanok Cafe)',
        mapQuery: 'Gyeonggadang Suwon',
      },
      {
        id: 16,
        text: '🎨 Acorn Caricature',
        mapQuery: 'Acorn Caricature',
        tips: '~7,000 KRW for A5 size, ~12,000 KRW for A4 canvas. Great group memory!',
      },
      {
        id: 17,
        text: 'Suwon Starfield & London Bagel Museum',
        mapQuery: 'Starfield Suwon',
        tips: 'Expect a long queue for the bagels. Grab a queue number as soon as you arrive!',
      },
    ],
  },
  {
    id: 'day2',
    day: 'Day 2',
    date: 'Tuesday, April 7',
    items: [
      { id: 21, text: '🏠 Leena\'s 엄마 at Suwon' },
      {
        id: 22,
        text: '📝 Color Analysis',
        tips: 'Go bare-faced or with minimal makeup for the most accurate results!',
      },
      {
        id: 23,
        text: '🔍 Explore Seongsu (Jayeondo Salt Bread, Im Donut)',
        mapQuery: 'Seongsu-dong',
      },
      {
        id: 24,
        text: '☕ Cheonsang Gaok (Rooftop Cafe)',
        mapQuery: 'Cheonsang Gaok Seongsu',
      },
      {
        id: 25,
        text: '📸 Photobooth: WXCK Photo (Bathroom style)',
        mapQuery: 'WXCK Photo Seongsu',
      },
      {
        id: 26,
        text: '🛍️ Haus Nowhere Seoul & Blue Elephant Space',
        mapQuery: 'Haus Nowhere Seoul',
      },
      {
        id: 27,
        text: '🔍 Explore Hannam-dong & Low Coffee',
        mapQuery: 'Low Coffee Hannam',
      },
      {
        id: 28,
        text: '🌉 Banpo Bridge Sunset & Night Picnic',
        mapQuery: 'Banpo Bridge',
        tips: 'Moonlight Rainbow Fountain Shows: 19:30, 20:00, 20:30, 21:00. Bring a mat and order fried chicken delivery!',
      },
    ],
  },
  {
    id: 'day3',
    day: 'Day 3',
    date: 'Wednesday, April 8',
    items: [
      {
        id: 31,
        text: '🏠 Golden City Hotel Dongdaemun',
        mapQuery: 'Golden City Hotel Dongdaemun',
      },
      {
        id: 32,
        text: '✈️ Leena leaves for Incheon (Flight at 3:25 PM)',
        tips: 'Leave hotel by 12:30 PM latest to be safe.',
      },
      {
        id: 33,
        text: '💆‍♀️ Head Spa / Hair Perm / Eyebrows',
        tips: 'Pre-book these services via Instagram or Kakao beforehand.',
      },
      {
        id: 34,
        text: '🔍 Explore Myeongdong & Ikseon-dong',
        mapQuery: 'Ikseon-dong Hanok Village',
      },
      {
        id: 35,
        text: '🛍️ Explore Gangnam (NYUNYU)',
        mapQuery: 'NYUNYU Gangnam',
      },
      {
        id: 36,
        text: '🍶 Honey comb makgeolli & Explore Garosugil',
        mapQuery: 'Garosugil',
      },
      {
        id: 37,
        text: '🌸 Yeouido Hangang Park Picnic',
        mapQuery: 'Yeouido Hangang Park',
        tips: 'Spring Flower Festival! Expect crowds but beautiful cherry blossoms.',
      },
      { id: 38, text: '🍸 Bar hop & Night Out' },
    ],
  },
  {
    id: 'day4',
    day: 'Day 4',
    date: 'Thursday, April 9',
    items: [
      {
        id: 41,
        text: '🌸 Seokchon Lake Cherry Blossom Festival',
        mapQuery: 'Seokchon Lake Park',
        tips: 'Peak bloom! Great photo ops with the Lotte Tower in the back.',
      },
      { id: 42, text: '🏠 Golden City Hotel Dongdaemun' },
      {
        id: 43,
        text: '🔍 Explore Hongdae & Itaewon',
        mapQuery: 'Hongdae Shopping Street',
      },
      {
        id: 44,
        text: '📸 Photobooth: Eternalog, Hongdae',
        mapQuery: 'Eternalog Hongdae',
      },
      {
        id: 45,
        text: '🍸 Bar hop & Night Spaces',
        mapQuery: 'Itaewon',
      },
    ],
  },
  {
    id: 'day5',
    day: 'Day 5',
    date: 'Friday, April 10',
    items: [
      { id: 51, text: '🔄 Repeat places we LOVE or missed!' },
      {
        id: 52,
        text: '✈️ Mel & Cindy Leave for Incheon at 12 AM (Flight 2:30 AM)',
        tips: 'Pack luggage beforehand and do tax refunds at the airport.',
      },
    ],
  },
  {
    id: 'extra',
    day: 'To-Do / Food Ideas',
    date: 'Backup Plans & Eats',
    items: [
      {
        id: 61,
        text: '💄 Le Labo Seoul (Bukchon)',
        mapQuery: '5 Bukchon-ro 5na-gil',
      },
      {
        id: 62,
        text: '🦀 Marinated Raw Crab',
        mapQuery: '서울 마포구 마포대로 186-6',
      },
      {
        id: 63,
        text: '🍜 Myeongdong Kyoja (Michelin)',
        mapQuery: 'Myeongdong Kyoja Main Restaurant',
      },
      {
        id: 64,
        text: '🍗 Kyochon Pilbang (Hidden Speakeasy)',
        mapQuery: '127 Bogwang-ro',
      },
      {
        id: 65,
        text: '🦀 Odarijip Ganjang Gejang',
        mapQuery: 'Odarijip Myeongdong',
      },
      {
        id: 66,
        text: '🍞 Mil Toast Ikseon',
        mapQuery: 'Mil Toast Ikseon',
      },
      {
        id: 67,
        text: '🥞 Samcheongdong Hotteok',
        mapQuery: 'Samcheongdong Hotteok',
      },
      { id: 68, text: "🐙 Live Octopus (Mel's Request!)" },
    ],
  },
];

export const INITIAL_PACKING_LIST = {
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
};

export const CATEGORY_PRESETS = ['Food', 'Transport', 'Shopping', 'Others'];

export const INITIAL_EXPENSE = {
  desc: '',
  amount: '',
  payer: FRIENDS[0],
  participants: [...FRIENDS],
  category: 'Food',
  categoryTags: ['Food'],
  currency: 'KRW',
  date: new Date().toISOString().split('T')[0],
  splitType: 'equal',
  splits: {},
};

export { DEFAULT_KRW_RATE };
