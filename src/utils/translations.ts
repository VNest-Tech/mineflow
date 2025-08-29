export const translations: Record<string, Record<string, string>> = {
  // Navigation
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड' },
  trucks: { en: 'Trucks', hi: 'ट्रक', mr: 'ट्रक' },
  orders: { en: 'Orders', hi: 'ऑर्डर', mr: 'ऑर्डर' },
  dispatches: { en: 'Dispatches', hi: 'डिस्पैच', mr: 'डिस्पॅच' },
  materials: { en: 'Materials', hi: 'सामग्री', mr: 'साहित्य' },
  exceptions: { en: 'Exceptions', hi: 'अपवाद', mr: 'अपवाद' },
  reports: { en: 'Reports', hi: 'रिपोर्ट', mr: 'अहवाल' },
  
  // Dashboard KPIs
  total_trucks: { en: 'Total Trucks', hi: 'कुल ट्रक', mr: 'एकूण ट्रक' },
  total_orders: { en: 'Total Orders', hi: 'कुल ऑर्डर', mr: 'एकूण ऑर्डर' },
  royalty_compliance: { en: 'Royalty Compliance', hi: 'रॉयल्टी अनुपालन', mr: 'रॉयल्टी अनुपालन' },
  total_tonnage: { en: 'Total Tonnage', hi: 'कुल टनेज', mr: 'एकूण टनेज' },
  active_exceptions: { en: 'Active Exceptions', hi: 'सक्रिय अपवाद', mr: 'सक्रिय अपवाद' },
  
  // Truck related
  truck_no: { en: 'Truck Number', hi: 'वाहन संख्या', mr: 'वाहन क्रमांक' },
  gross_weight: { en: 'Gross Weight', hi: 'सकल वजन', mr: 'एकूण वजन' },
  tare_weight: { en: 'Tare Weight', hi: 'खाली वजन', mr: 'रिकामे वजन' },
  net_weight: { en: 'Net Weight', hi: 'शुद्ध वजन', mr: 'निव्वळ वजन' },
  arrival_time: { en: 'Arrival Time', hi: 'आगमन समय', mr: 'आगमन वेळ' },
  current_stage: { en: 'Current Stage', hi: 'वर्तमान चरण', mr: 'सध्याचा टप्पा' },
  royalty: { en: 'Royalty', hi: 'रॉयल्टी', mr: 'रॉयल्टी' },
  non_royalty: { en: 'Non-Royalty', hi: 'गैर-रॉयल्टी', mr: 'गैर-रॉयल्टी' },
  
  // Order related
  order_no: { en: 'Order No', hi: 'ऑर्डर नंबर', mr: 'ऑर्डर क्र.' },
  customer: { en: 'Customer', hi: 'ग्राहक', mr: 'ग्राहक' },
  material: { en: 'Material', hi: 'सामग्री', mr: 'साहित्य' },
  ordered_qty: { en: 'Ordered Qty', hi: 'ऑर्डर की गई मात्रा', mr: 'ऑर्डर केलेले प्रमाण' },
  delivered_qty: { en: 'Delivered Qty', hi: 'डिलीवर की गई मात्रा', mr: 'वितरित प्रमाण' },
  pending_qty: { en: 'Pending Qty', hi: 'लंबित मात्रा', mr: 'प्रलंबित प्रमाण' },
  advance: { en: 'Advance', hi: 'अग्रिम', mr: 'अग्रिम' },
  balance: { en: 'Balance', hi: 'शेष', mr: 'शिल्लक' },
  status: { en: 'Status', hi: 'स्थिति', mr: 'स्थिती' },
  
  // Dispatch related
  dispatch_id: { en: 'Dispatch ID', hi: 'डिस्पैच आईडी', mr: 'डिस्पॅच आयडी' },
  driver: { en: 'Driver', hi: 'ड्राइवर', mr: 'चालक' },
  delivery_address: { en: 'Delivery Address', hi: 'डिलीवरी पता', mr: 'डिलिव्हरी पत्ता' },
  contact_person: { en: 'Contact Person', hi: 'संपर्क व्यक्ति', mr: 'संपर्क व्यक्ती' },
  
  // Common actions
  add: { en: 'Add', hi: 'जोड़ें', mr: 'जोडा' },
  edit: { en: 'Edit', hi: 'संपादित करें', mr: 'संपादित करा' },
  delete: { en: 'Delete', hi: 'हटाएं', mr: 'हटवा' },
  save: { en: 'Save', hi: 'सेव करें', mr: 'सेव्ह करा' },
  cancel: { en: 'Cancel', hi: 'रद्द करें', mr: 'रद्द करा' },
  view: { en: 'View', hi: 'देखें', mr: 'पहा' },
  export: { en: 'Export', hi: 'निर्यात', mr: 'निर्यात' },
  
  // Status values
  pending: { en: 'Pending', hi: 'लंबित', mr: 'प्रलंबित' },
  completed: { en: 'Completed', hi: 'पूर्ण', mr: 'पूर्ण' },
  partial: { en: 'Partial', hi: 'आंशिक', mr: 'आंशिक' },
  cancelled: { en: 'Cancelled', hi: 'रद्द', mr: 'रद्द' },
  active: { en: 'Active', hi: 'सक्रिय', mr: 'सक्रिय' },
  inactive: { en: 'Inactive', hi: 'निष्क्रिय', mr: 'निष्क्रिय' },
  
  // Stages
  gate: { en: 'Gate', hi: 'गेट', mr: 'गेट' },
  loading: { en: 'Loading', hi: 'लोडिंग', mr: 'लोडिंग' },
  weigh_in: { en: 'Weigh In', hi: 'वेट इन', mr: 'तोलणे (इन)' },
  weigh_out: { en: 'Weigh Out', hi: 'वेट आउट', mr: 'तोलणे (आउट)' },
  departed: { en: 'Departed', hi: 'प्रस्थान', mr: 'निघालेले' },
  delivered: { en: 'Delivered', hi: 'डिलीवर', mr: 'वितरित' },
  
  // Exception types
  duplicate_pass: { en: 'Duplicate Pass', hi: 'डुप्लिकेट पास', mr: 'डुप्लिकेट पास' },
  expired_pass: { en: 'Expired Pass', hi: 'समाप्त पास', mr: 'कालबाह्य पास' },
  missing_media: { en: 'Missing Media', hi: 'मीडिया गुम', mr: 'मीडिया गहाळ' },
  abnormal_weight: { en: 'Abnormal Weight', hi: 'असामान्य वजन', mr: 'असामान्य वजन' },
  
  // Languages
  english: { en: 'English', hi: 'अंग्रेजी', mr: 'इंग्रजी' },
  hindi: { en: 'Hindi', hi: 'हिंदी', mr: 'हिंदी' },
  marathi: { en: 'Marathi', hi: 'मराठी', mr: 'मराठी' }
};