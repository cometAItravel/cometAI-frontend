import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://cometai-backend.onrender.com";
const GOLD = "#c9a84c";
const GOLD_DARK = "#8B6914";
const GRAD = "linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)";

const INDIA_IATA = new Set([
  'BLR','BOM','DEL','MAA','HYD','CCU','GOI','PNQ','COK','AMD','JAI','LKO',
  'VNS','PAT','IXC','GAU','BBI','CBE','IXM','IXE','MYQ','TRV','VTZ','IXR',
  'BHO','SXR','IXJ','NAG','IDR','IXL','IXZ','ATQ','UDR','JDH','AGR','STV',
  'HBX','IXG','TIR','VGA','CCJ','TRZ','DED','SLV','RPR',
]);

// ── FLIGHT CITIES ──────────────────────────────────────────────────────────────
const FLIGHT_CITIES = [
  {code:"BLR",name:"Bangalore",full:"Kempegowda International",country:"India",top:true},
  {code:"BOM",name:"Mumbai",full:"Chhatrapati Shivaji Intl",country:"India",top:true},
  {code:"DEL",name:"Delhi",full:"Indira Gandhi International",country:"India",top:true},
  {code:"MAA",name:"Chennai",full:"Chennai International",country:"India",top:true},
  {code:"HYD",name:"Hyderabad",full:"Rajiv Gandhi International",country:"India",top:true},
  {code:"CCU",name:"Kolkata",full:"Netaji Subhas Chandra Bose Intl",country:"India",top:true},
  {code:"GOI",name:"Goa",full:"Dabolim / Mopa Airport",country:"India",top:true},
  {code:"PNQ",name:"Pune",full:"Pune Airport",country:"India",top:true},
  {code:"COK",name:"Kochi",full:"Cochin International",country:"India",top:true},
  {code:"AMD",name:"Ahmedabad",full:"Sardar Vallabhbhai Patel Intl",country:"India",top:true},
  {code:"JAI",name:"Jaipur",full:"Jaipur International",country:"India",top:true},
  {code:"LKO",name:"Lucknow",full:"Chaudhary Charan Singh Intl",country:"India"},
  {code:"VNS",name:"Varanasi",full:"Lal Bahadur Shastri Airport",country:"India"},
  {code:"PAT",name:"Patna",full:"Jay Prakash Narayan Airport",country:"India"},
  {code:"IXC",name:"Chandigarh",full:"Chandigarh Airport",country:"India"},
  {code:"GAU",name:"Guwahati",full:"Lokpriya Gopinath Bordoloi Intl",country:"India"},
  {code:"BBI",name:"Bhubaneswar",full:"Biju Patnaik International",country:"India"},
  {code:"CBE",name:"Coimbatore",full:"Coimbatore International",country:"India"},
  {code:"IXM",name:"Madurai",full:"Madurai Airport",country:"India"},
  {code:"IXE",name:"Mangalore",full:"Mangalore International",country:"India"},
  {code:"MYQ",name:"Mysore",full:"Mysore Airport",country:"India"},
  {code:"TRV",name:"Trivandrum",full:"Trivandrum International",country:"India"},
  {code:"VTZ",name:"Visakhapatnam",full:"Visakhapatnam Airport",country:"India"},
  {code:"IXR",name:"Ranchi",full:"Birsa Munda Airport",country:"India"},
  {code:"BHO",name:"Bhopal",full:"Raja Bhoj Airport",country:"India"},
  {code:"SXR",name:"Srinagar",full:"Sheikh ul-Alam Airport",country:"India"},
  {code:"IXJ",name:"Jammu",full:"Jammu Airport",country:"India"},
  {code:"NAG",name:"Nagpur",full:"Dr. Babasaheb Ambedkar Intl",country:"India"},
  {code:"IDR",name:"Indore",full:"Devi Ahilyabai Holkar Airport",country:"India"},
  {code:"IXL",name:"Leh",full:"Kushok Bakula Rimpochee Airport",country:"India"},
  {code:"IXZ",name:"Port Blair",full:"Veer Savarkar International",country:"India"},
  {code:"ATQ",name:"Amritsar",full:"Sri Guru Ram Dass Jee Intl",country:"India"},
  {code:"UDR",name:"Udaipur",full:"Maharana Pratap Airport",country:"India"},
  {code:"JDH",name:"Jodhpur",full:"Jodhpur Airport",country:"India"},
  {code:"AGR",name:"Agra",full:"Agra Airport",country:"India"},
  {code:"HBX",name:"Hubli",full:"Hubballi Airport",country:"India"},
  {code:"IXG",name:"Belgaum",full:"Belagavi Airport",country:"India"},
  {code:"TIR",name:"Tirupati",full:"Tirupati Airport",country:"India"},
  {code:"VGA",name:"Vijayawada",full:"Vijayawada International",country:"India"},
  {code:"CCJ",name:"Kozhikode",full:"Calicut International",country:"India"},
  {code:"TRZ",name:"Trichy",full:"Tiruchirappalli International",country:"India"},
  {code:"DED",name:"Dehradun",full:"Jolly Grant Airport",country:"India"},
  {code:"STV",name:"Surat",full:"Surat Airport",country:"India"},
  {code:"DXB",name:"Dubai",full:"Dubai International",country:"UAE",top:true},
  {code:"SIN",name:"Singapore",full:"Changi Airport",country:"Singapore",top:true},
  {code:"BKK",name:"Bangkok",full:"Suvarnabhumi Airport",country:"Thailand",top:true},
  {code:"LHR",name:"London",full:"Heathrow Airport",country:"UK",top:true},
  {code:"JFK",name:"New York",full:"JFK International",country:"USA",top:true},
  {code:"KUL",name:"Kuala Lumpur",full:"KLIA Airport",country:"Malaysia",top:true},
  {code:"CMB",name:"Colombo",full:"Bandaranaike International",country:"Sri Lanka"},
  {code:"CDG",name:"Paris",full:"Charles de Gaulle",country:"France"},
  {code:"NRT",name:"Tokyo",full:"Narita International",country:"Japan"},
  {code:"SYD",name:"Sydney",full:"Kingsford Smith",country:"Australia"},
  {code:"FRA",name:"Frankfurt",full:"Frankfurt Airport",country:"Germany"},
  {code:"AMS",name:"Amsterdam",full:"Schiphol Airport",country:"Netherlands"},
  {code:"YYZ",name:"Toronto",full:"Pearson International",country:"Canada"},
  {code:"LAX",name:"Los Angeles",full:"LAX Airport",country:"USA"},
  {code:"HKG",name:"Hong Kong",full:"Hong Kong International",country:"Hong Kong"},
  {code:"DOH",name:"Doha",full:"Hamad International",country:"Qatar"},
  {code:"AUH",name:"Abu Dhabi",full:"Zayed International",country:"UAE"},
  {code:"IST",name:"Istanbul",full:"Istanbul Airport",country:"Turkey"},
  {code:"DPS",name:"Bali",full:"Ngurah Rai International",country:"Indonesia"},
  {code:"KTM",name:"Kathmandu",full:"Tribhuvan International",country:"Nepal"},
  {code:"MLE",name:"Maldives",full:"Velana International",country:"Maldives"},
  {code:"HKT",name:"Phuket",full:"Phuket International",country:"Thailand"},
  {code:"ICN",name:"Seoul",full:"Incheon International",country:"South Korea"},
  {code:"MEL",name:"Melbourne",full:"Melbourne Airport",country:"Australia"},
  {code:"MCT",name:"Muscat",full:"Muscat International",country:"Oman"},
];

// ── BUS CITIES (comprehensive) ─────────────────────────────────────────────────
const BUS_CITIES = [
  // Karnataka
  "Bangalore","Mysore","Mangalore","Hubli","Dharwad","Belgaum","Bidar","Gulbarga",
  "Bellary","Shimoga","Tumkur","Hassan","Chikmagalur","Udupi","Davangere","Raichur",
  "Hospet","Hampi","Madikeri","Coorg","Chamarajanagar","Mandya","Ramanagara","Kolar",
  "Chintamani","Bagalkot","Gadag","Koppal","Haveri","Sirsi","Karwar","Hosur",
  "Yelahanka","Electronic City","Whitefield","Koramangala","Hebbal","Marathahalli",
  // Tamil Nadu
  "Chennai","Coimbatore","Madurai","Trichy","Salem","Tirunelveli","Vellore","Erode",
  "Thanjavur","Pondicherry","Ooty","Kodaikanal","Kumbakonam","Nagercoil","Kanyakumari",
  "Dindigul","Rajapalayam","Virudhunagar","Sivakasi","Theni","Pollachi","Palani",
  "Krishnagiri","Dharmapuri","Namakkal","Karur","Tirupur","Tiruvannamalai","Chidambaram",
  "Marthandam","Cuddalore","Villupuram","Pudukottai","Ramnad","Perambalur","Hosur",
  "Tenkasi","Tirunelveli","Ambur","Ranipet","Arkonam","Sriperumbudur",
  // Kerala
  "Kochi","Trivandrum","Kozhikode","Thrissur","Kollam","Varkala","Alleppey","Kottayam",
  "Munnar","Wayanad","Kannur","Kasaragod","Malappuram","Palakkad","Manjeri","Tirur",
  "Thalassery","Vadakara","Pathanamthitta","Idukki","Calicut","Pala","Changanacherry",
  "Thodupuzha","Angamaly","Perumbavoor","Muvattupuzha",
  // Andhra Pradesh / Telangana
  "Hyderabad","Visakhapatnam","Vijayawada","Tirupati","Warangal","Guntur","Nellore",
  "Kurnool","Rajahmundry","Kakinada","Eluru","Ongole","Nandyal","Anantapur","Kadapa",
  "Chittoor","Srikakulam","Vizianagaram","Bhimavaram","Tenali","Machilipatnam",
  "Karimnagar","Nizamabad","Khammam","Mahbubnagar","Adilabad","Suryapet","Miryalaguda",
  // Maharashtra
  "Mumbai","Pune","Nagpur","Nashik","Aurangabad","Kolhapur","Solapur","Sangli",
  "Satara","Ratnagiri","Thane","Navi Mumbai","Amravati","Akola","Latur","Osmanabad",
  "Nanded","Jalgaon","Dhule","Ahmednagar","Buldhana","Yavatmal","Beed","Parbhani",
  "Lonavala","Mahabaleshwar","Alibaug","Matheran","Sawantwadi",
  // Goa
  "Goa","Panaji","Mapusa","Margao","Vasco","Ponda","Calangute","Baga","Anjuna",
  // Delhi NCR
  "Delhi","Gurgaon","Noida","Faridabad","Ghaziabad","Dwarka","Rohini",
  // Rajasthan
  "Jaipur","Jodhpur","Udaipur","Ajmer","Pushkar","Bikaner","Kota","Alwar",
  "Bharatpur","Jaisalmer","Chittorgarh","Mount Abu","Sikar","Jhunjhunu","Tonk",
  // Uttar Pradesh
  "Lucknow","Agra","Varanasi","Allahabad","Prayagraj","Kanpur","Gorakhpur",
  "Mathura","Vrindavan","Meerut","Bareilly","Moradabad","Aligarh","Jhansi","Ayodhya",
  "Haridwar","Rishikesh","Dehradun","Mussoorie","Nainital","Almora",
  // Himachal / Uttarakhand
  "Shimla","Manali","Dharamshala","McLeod Ganj","Kasol","Kullu","Mandi","Spiti",
  // Punjab / Haryana
  "Chandigarh","Amritsar","Ludhiana","Jalandhar","Patiala","Ambala","Karnal",
  // Gujarat
  "Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Gandhinagar","Anand",
  "Bharuch","Navsari","Valsad","Daman","Dwarka","Somnath",
  // Madhya Pradesh
  "Indore","Bhopal","Gwalior","Jabalpur","Ujjain","Sagar","Ratlam","Dewas",
  "Satna","Rewa","Chhindwara","Khandwa","Khargone","Burhanpur",
  // Odisha
  "Bhubaneswar","Puri","Cuttack","Rourkela","Berhampur","Sambalpur","Balasore",
  // West Bengal
  "Kolkata","Darjeeling","Siliguri","Durgapur","Asansol","Howrah","Haldia",
  // Bihar / Jharkhand
  "Patna","Gaya","Ranchi","Jamshedpur","Dhanbad","Bokaro","Hazaribagh","Muzaffarpur",
  // Northeast
  "Guwahati","Shillong","Agartala","Imphal","Dibrugarh","Jorhat","Silchar",
];

// ── TRAIN CITIES ───────────────────────────────────────────────────────────────
const TRAIN_CITIES = [
  // South India
  {city:"Bangalore",code:"SBC"},{city:"Yeshwanthpur",code:"YPR"},{city:"Hosur",code:"HOS"},
  {city:"Chennai Central",code:"MAS"},{city:"Chennai Egmore",code:"MS"},
  {city:"Hyderabad Deccan",code:"HYB"},{city:"Secunderabad",code:"SC"},
  {city:"Kochi Ernakulam",code:"ERS"},{city:"Trivandrum",code:"TVC"},
  {city:"Coimbatore",code:"CBE"},{city:"Madurai",code:"MDU"},{city:"Mysore",code:"MYS"},
  {city:"Mangalore",code:"MAQ"},{city:"Visakhapatnam",code:"VSKP"},
  {city:"Vijayawada",code:"BZA"},{city:"Tirupati",code:"TPTY"},
  {city:"Kozhikode",code:"CLT"},{city:"Thrissur",code:"TCR"},{city:"Kollam",code:"QLN"},
  {city:"Nagercoil",code:"NCJ"},{city:"Kanyakumari",code:"CAPE"},
  {city:"Tirunelveli",code:"TEN"},{city:"Salem",code:"SA"},{city:"Erode",code:"ED"},
  {city:"Trichy",code:"TPJ"},{city:"Thanjavur",code:"TJ"},{city:"Vellore",code:"KPD"},
  {city:"Pondicherry",code:"PDY"},{city:"Warangal",code:"WL"},{city:"Guntur",code:"GNT"},
  {city:"Nellore",code:"NLR"},{city:"Kurnool",code:"KRNT"},{city:"Rajahmundry",code:"RJY"},
  {city:"Hubli",code:"UBL"},{city:"Belgaum",code:"BGM"},{city:"Marthandam",code:"MVK"},
  // North India
  {city:"Delhi New Delhi",code:"NDLS"},{city:"Delhi Hazrat Nizamuddin",code:"NZM"},
  {city:"Mumbai CSMT",code:"CSTM"},{city:"Mumbai Central",code:"BCT"},
  {city:"Kolkata Howrah",code:"HWH"},{city:"Kolkata Sealdah",code:"SDAH"},
  {city:"Ahmedabad",code:"ADI"},{city:"Pune",code:"PUNE"},{city:"Jaipur",code:"JP"},
  {city:"Lucknow",code:"LKO"},{city:"Varanasi",code:"BSB"},{city:"Patna",code:"PNBE"},
  {city:"Bhopal",code:"BPL"},{city:"Nagpur",code:"NGP"},{city:"Chandigarh",code:"CDG"},
  {city:"Guwahati",code:"GHY"},{city:"Amritsar",code:"ASR"},{city:"Indore",code:"INDB"},
  {city:"Agra Cantt",code:"AGC"},{city:"Mathura",code:"MTJ"},{city:"Prayagraj",code:"ALD"},
  {city:"Gorakhpur",code:"GKP"},{city:"Dehradun",code:"DDN"},{city:"Haridwar",code:"HW"},
  {city:"Ranchi",code:"RNC"},{city:"Bhubaneswar",code:"BBS"},{city:"Puri",code:"PURI"},
  {city:"Goa Madgaon",code:"MAO"},{city:"Nashik",code:"NK"},{city:"Surat",code:"ST"},
  {city:"Vadodara",code:"BRC"},{city:"Jodhpur",code:"JU"},{city:"Udaipur",code:"UDZ"},
  {city:"Kanpur",code:"CNB"},{city:"Kolhapur",code:"KOP"},{city:"Solapur",code:"SUR"},
  {city:"Jamshedpur",code:"TATA"},{city:"Dhanbad",code:"DHN"},{city:"Bokaro",code:"BKSC"},
  {city:"Darjeeling",code:"DJ"},{city:"Siliguri",code:"SGUJ"},{city:"Durgapur",code:"DGR"},
];

// ── HOTEL CITIES ───────────────────────────────────────────────────────────────
const HOTEL_CITIES = [
  "Goa","Bangalore","Mumbai","Delhi","Chennai","Hyderabad","Kolkata","Jaipur",
  "Kochi","Agra","Varanasi","Udaipur","Manali","Shimla","Ooty","Kodaikanal",
  "Munnar","Varkala","Alleppey","Coorg","Pondicherry","Port Blair","Leh","Ladakh",
  "Dharamshala","McLeod Ganj","Rishikesh","Haridwar","Mussoorie","Nainital","Almora",
  "Pushkar","Jodhpur","Jaisalmer","Bikaner","Mount Abu","Mysore","Hampi",
  "Coimbatore","Trichy","Madurai","Rameshwaram","Tirupati","Pune","Aurangabad",
  "Nashik","Lonavala","Mahabaleshwar","Ahmedabad","Surat","Vadodara",
  "Chandigarh","Amritsar","Lucknow","Mathura","Vrindavan","Ayodhya",
  "Patna","Gaya","Bodh Gaya","Ranchi","Bhubaneswar","Puri","Darjeeling",
  "Gangtok","Shillong","Guwahati","Nagercoil","Kanyakumari","Marthandam",
  "Tirunelveli","Thrissur","Kozhikode","Kollam","Kottayam","Wayanad","Hosur",
  "Dubai","Singapore","Bangkok","London","Paris","Tokyo","Bali","Maldives",
  "Male","Phuket","Kuala Lumpur","Istanbul","Rome","Barcelona","Amsterdam",
  "Sydney","Melbourne","Colombo","Kathmandu","Doha","Abu Dhabi","Muscat",
  "Seoul","Osaka","Hong Kong","New York","Las Vegas","Toronto",
];

// ── LINK BUILDERS ──────────────────────────────────────────────────────────────
function buildFlightLink(fromCode, toCode, dateStr, passengers) {
  const isIndia = INDIA_IATA.has(fromCode) && INDIA_IATA.has(toCode);
  const base = isIndia ? "https://www.aviasales.in" : "https://www.aviasales.com";
  let ddmm = "";
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d)) ddmm = String(d.getDate()).padStart(2,"0") + String(d.getMonth()+1).padStart(2,"0");
  }
  return `${base}/search/${fromCode}${ddmm}${toCode}${passengers||1}?marker=714667&sub_id=alvryn_web`;
}

function buildBusLink(from, to, dateStr) {
  const f = (from||"").toLowerCase().replace(/\s+/g,"-");
  const t = (to||"").toLowerCase().replace(/\s+/g,"-");
  let url = `https://www.redbus.in/bus-tickets/${f}-to-${t}`;
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d)) {
      const dd = String(d.getDate()).padStart(2,"0");
      const mm = String(d.getMonth()+1).padStart(2,"0");
      const yyyy = d.getFullYear();
      url += `?doj=${dd}-${mm}-${yyyy}`;
    }
  }
  return url;
}

function buildTrainLink(fromCode, toCode, dateStr) {
  let url = `https://www.irctc.co.in/nget/train-search?fromStation=${fromCode}&toStation=${toCode}&isCallFromDpDown=true&quota=GN&class=SL`;
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d)) {
      const dd = String(d.getDate()).padStart(2,"0");
      const mm = String(d.getMonth()+1).padStart(2,"0");
      const yyyy = d.getFullYear();
      url += `&journeyDate=${dd}-${mm}-${yyyy}`;
    }
  }
  return url;
}

function buildHotelLink(city, checkIn, checkOut, guests, rooms) {
  let url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&group_adults=${guests||1}&no_rooms=${rooms||1}`;
  if (checkIn) {
    const d = new Date(checkIn);
    if (!isNaN(d)) url += `&checkin=${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }
  if (checkOut) {
    const d = new Date(checkOut);
    if (!isNaN(d)) url += `&checkout=${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }
  return url;
}

// ── SEARCH HELPERS ─────────────────────────────────────────────────────────────
function searchFlightCities(q) {
  if (!q) return FLIGHT_CITIES.filter(c => c.top);
  const ql = q.toLowerCase();
  return FLIGHT_CITIES.filter(c =>
    c.name.toLowerCase().includes(ql) ||
    c.code.toLowerCase().includes(ql) ||
    c.country.toLowerCase().includes(ql) ||
    c.full.toLowerCase().includes(ql)
  ).slice(0,12);
}
function searchBusCities(q) {
  if (!q) return BUS_CITIES.slice(0,24);
  const ql = q.toLowerCase();
  return BUS_CITIES.filter(c => c.toLowerCase().includes(ql)).slice(0,12);
}
function searchTrainCities(q) {
  if (!q) return TRAIN_CITIES.slice(0,20);
  const ql = q.toLowerCase();
  return TRAIN_CITIES.filter(c =>
    c.city.toLowerCase().includes(ql) || c.code.toLowerCase().includes(ql)
  ).slice(0,12);
}
function searchHotelCities(q) {
  if (!q) return HOTEL_CITIES.slice(0,20);
  const ql = q.toLowerCase();
  return HOTEL_CITIES.filter(c => c.toLowerCase().includes(ql)).slice(0,12);
}

// ── TABS CONFIG ────────────────────────────────────────────────────────────────
const TABS = [
  {id:"flight", label:"Flights",  icon:"✈️"},
  {id:"bus",    label:"Buses",    icon:"🚌"},
  {id:"hotel",  label:"Hotels",   icon:"🏨"},
  {id:"train",  label:"Trains",   icon:"🚂"},
  {id:"cab",    label:"Cabs",     icon:"🚖", soon:true},
];

const CLASSES = ["Economy","Premium Economy","Business","First Class"];


// ── ALVRYN ICON ────────────────────────────────────────────────────────────────
function AlvrynIcon({size=36}){
  const uid=`sp${size}`;
  return(
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{flexShrink:0}}>
      <defs><linearGradient id={`${uid}g`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c9a84c"/><stop offset="50%" stopColor="#f0d080"/>
        <stop offset="100%" stopColor="#8B6914"/>
      </linearGradient></defs>
      <circle cx="32" cy="32" r="30" stroke={`url(#${uid}g)`} strokeWidth="1.2" fill="none"/>
      <path d="M20 46 L28 18 L36 46" stroke={`url(#${uid}g)`} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M22.5 36 L33.5 36" stroke={`url(#${uid}g)`} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M26 46 L34 18 L42 46" stroke={`url(#${uid}g)`} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45"/>
    </svg>
  );
}

// ── CITY PICKER MODAL ──────────────────────────────────────────────────────────
function CityPickerModal({tabId, label, onSelect, onClose, exclude}){
  const [q, setQ] = useState("");
  const ref = useRef(null);
  useEffect(()=>{ setTimeout(()=>ref.current?.focus(),80); },[]);

  let results = [];
  if(tabId==="flight") results = searchFlightCities(q).filter(c=>c.code!==exclude);
  else if(tabId==="bus") results = searchBusCities(q).filter(c=>c!==exclude);
  else if(tabId==="train") results = searchTrainCities(q).filter(c=>c.city!==exclude);
  else if(tabId==="hotel") results = searchHotelCities(q).filter(c=>c!==exclude);

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:520,maxHeight:"80vh",background:"#fff",borderRadius:"24px 24px 0 0",boxShadow:"0 -20px 60px rgba(0,0,0,0.22)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"20px 20px 12px",borderBottom:"1px solid rgba(0,0,0,0.06)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:700,color:"#1a1410"}}>Select {label}</div>
            <button onClick={onClose} style={{background:"rgba(0,0,0,0.06)",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16,color:"#666",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(0,0,0,0.04)",borderRadius:12,padding:"10px 14px",border:"1.5px solid rgba(201,168,76,0.2)"}}>
            <span style={{opacity:0.4}}>🔍</span>
            <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search city or station..." style={{flex:1,background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#1a1410"}}/>
          </div>
        </div>
        {!q && <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#aaa",letterSpacing:"0.12em",padding:"10px 20px 4px",textTransform:"uppercase"}}>Popular</div>}
        <div style={{overflowY:"auto",flex:1,padding:"4px 12px 20px"}}>
          {results.map((item,i)=>{
            if(tabId==="flight") return(
              <div key={item.code} onClick={()=>onSelect(item)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 10px",borderRadius:12,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.08)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"#1a1410"}}>{item.name} {item.top&&<span style={{fontSize:9,background:"rgba(201,168,76,0.15)",color:"#8B6914",padding:"1px 6px",borderRadius:8,marginLeft:6,fontWeight:700}}>TOP</span>}</div>
                  <div style={{fontSize:11,color:"#888",marginTop:2}}>{item.full} · {item.country}</div>
                </div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:15,fontWeight:700,color:GOLD_DARK}}>{item.code}</div>
              </div>
            );
            if(tabId==="train") return(
              <div key={item.code} onClick={()=>onSelect(item)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 10px",borderRadius:12,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.08)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{fontSize:14,fontWeight:500,color:"#1a1410"}}>{item.city}</div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,fontWeight:700,color:GOLD_DARK}}>{item.code}</div>
              </div>
            );
            return(
              <div key={item} onClick={()=>onSelect(item)} style={{padding:"12px 10px",borderRadius:12,cursor:"pointer",fontSize:14,fontWeight:500,color:"#1a1410"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.08)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                {item}
              </div>
            );
          })}
          {results.length===0 && q && <div style={{textAlign:"center",padding:"32px 20px",color:"#aaa",fontSize:13}}>No results for "{q}"</div>}
        </div>
      </div>
    </div>
  );
}

// ── TAB SCENE ANIMATIONS ───────────────────────────────────────────────────────
// Pure CSS animations — premium, directionally correct, cream/gold palette
const TAB_SCENES_CSS = `
@keyframes sp_planefly {
  0%   { transform: translateX(-120px) translateY(0px) rotate(-5deg); opacity:0; }
  5%   { opacity:1; }
  50%  { transform: translateX(50vw) translateY(-30px) rotate(-5deg); opacity:1; }
  95%  { opacity:1; }
  100% { transform: translateX(calc(100vw + 120px)) translateY(-10px) rotate(-5deg); opacity:0; }
}
@keyframes sp_cloud1 {
  0%   { transform: translateX(110vw); }
  100% { transform: translateX(-300px); }
}
@keyframes sp_cloud2 {
  0%   { transform: translateX(110vw); }
  100% { transform: translateX(-200px); }
}
@keyframes sp_star { 0%,100%{opacity:0.3;} 50%{opacity:1;} }

@keyframes sp_bus_move {
  0%   { left:-160px; opacity:0; }
  5%   { opacity:1; }
  95%  { opacity:1; }
  100% { left:calc(100vw + 20px); opacity:0; }
}
@keyframes sp_road_dash {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-120px); }
}
@keyframes sp_tree_sway { 0%,100%{transform:rotate(-1.5deg);} 50%{transform:rotate(1.5deg);} }

@keyframes sp_win_blink {
  0%,88%,100%{opacity:0.15;}
  90%,98%{opacity:0.9;}
}
@keyframes sp_hotel_glow { 0%,100%{opacity:0.4;} 50%{opacity:0.7;} }
@keyframes sp_moon_float { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-6px);} }

@keyframes sp_train_move {
  0%   { right:-220px; opacity:0; }
  5%   { opacity:1; }
  95%  { opacity:1; }
  100% { right:calc(100vw + 20px); opacity:0; }
}
@keyframes sp_track_dash {
  0%   { transform:translateX(0); }
  100% { transform:translateX(80px); }
}
@keyframes sp_steam { 0%{opacity:0.6;transform:translateY(0) scale(1);} 100%{opacity:0;transform:translateY(-30px) scale(2);} }

@keyframes sp_cab_move {
  0%   { left:-120px; opacity:0; }
  5%   { opacity:1; }
  95%  { opacity:1; }
  100% { left:calc(100vw + 20px); opacity:0; }
}
@keyframes sp_city_light { 0%,100%{opacity:0.2;} 50%{opacity:0.6;} }
`;

function FlightScene() {
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0,
      background:"linear-gradient(180deg,#0d1b2e 0%,#1a3a5c 40%,#2d5a8c 70%,#1a3a5c 100%)"}}>
      {/* Stars */}
      {Array.from({length:35},(_,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:`${(i*137.5)%100}%`, top:`${(i*97.3)%60}%`,
          width:i%7===0?2.5:1.5, height:i%7===0?2.5:1.5,
          borderRadius:"50%", background:"rgba(255,255,255,0.85)",
          animation:`sp_star ${1.5+i%3}s ease-in-out ${i*0.18}s infinite`,
        }}/>
      ))}
      {/* Clouds */}
      <div style={{position:"absolute",top:"28%",width:180,height:40,borderRadius:40,
        background:"rgba(255,255,255,0.08)",
        animation:"sp_cloud1 22s linear infinite"}}/>
      <div style={{position:"absolute",top:"18%",width:120,height:28,borderRadius:30,
        background:"rgba(255,255,255,0.06)",
        animation:"sp_cloud2 30s linear 6s infinite"}}/>
      <div style={{position:"absolute",top:"45%",width:90,height:22,borderRadius:25,
        background:"rgba(255,255,255,0.05)",
        animation:"sp_cloud1 18s linear 10s infinite"}}/>
      {/* Horizon glow */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"35%",
        background:"linear-gradient(to top, rgba(201,168,76,0.12),transparent)"}}/>
      {/* Airplane — flies LEFT to RIGHT */}
      <div style={{position:"absolute",top:"38%",
        animation:"sp_planefly 9s cubic-bezier(0.4,0,0.6,1) 0.5s infinite"}}>
        <svg width="90" height="36" viewBox="0 0 90 36" fill="none">
          <path d="M0 18 L50 4 L80 18 L50 32 Z" fill={GOLD} opacity="0.9"/>
          <path d="M50 18 L90 14 L90 22 Z" fill={GOLD} opacity="0.9"/>
          <path d="M20 18 L42 8 L42 28 Z" fill={GOLD} opacity="0.7"/>
          <circle cx="68" cy="16" r="2" fill="rgba(255,255,255,0.8)"/>
          <circle cx="68" cy="20" r="2" fill="rgba(255,255,255,0.8)"/>
        </svg>
      </div>
      {/* Second plane smaller */}
      <div style={{position:"absolute",top:"58%",
        animation:"sp_planefly 14s cubic-bezier(0.4,0,0.6,1) 6s infinite",opacity:0.5}}>
        <svg width="55" height="22" viewBox="0 0 90 36" fill="none">
          <path d="M0 18 L50 4 L80 18 L50 32 Z" fill={GOLD}/>
          <path d="M50 18 L90 14 L90 22 Z" fill={GOLD}/>
        </svg>
      </div>
      {/* Gold trail */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.2}} viewBox="0 0 1000 280" preserveAspectRatio="none">
        <path d="M-50 200 Q 250 80 500 140 Q 750 200 1050 100" stroke={GOLD} strokeWidth="1.5" fill="none" strokeDasharray="10 6"/>
      </svg>
    </div>
  );
}

function BusScene() {
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0,
      background:"linear-gradient(180deg,#0a1f0d 0%,#0d2d12 40%,#143d1a 70%,#0a1f0d 100%)"}}>
      {/* Sky */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:"55%",
        background:"linear-gradient(180deg,#0a1a0d,#0d2810)"}}/>
      {/* Stars */}
      {Array.from({length:20},(_,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:`${(i*157)%100}%`, top:`${(i*83)%40}%`,
          width:1.5, height:1.5, borderRadius:"50%",
          background:"rgba(255,255,255,0.5)",
          animation:`sp_star ${2+i%3}s ease-in-out ${i*0.2}s infinite`,
        }}/>
      ))}
      {/* Road surface */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"38%",
        background:"linear-gradient(180deg,#1a2e1a,#0d1f0d)"}}/>
      {/* Road line */}
      <div style={{position:"absolute",bottom:"20%",left:0,right:0,height:3,
        background:`linear-gradient(90deg,transparent,${GOLD}55,transparent)`}}/>
      {/* Road dashes — scroll LEFT (road going behind = bus moving right) */}
      <div style={{position:"absolute",bottom:"15%",left:0,right:0,overflow:"hidden",height:4}}>
        <div style={{display:"flex",gap:56,animation:"sp_road_dash 1.8s linear infinite",width:"200%"}}>
          {Array.from({length:30},(_,i)=>(
            <div key={i} style={{width:36,height:3,background:GOLD,opacity:0.45,borderRadius:2,flexShrink:0}}/>
          ))}
        </div>
      </div>
      {/* Trees LEFT side (behind) */}
      {[8,22,38,54,68,82].map((left,i)=>(
        <div key={i} style={{position:"absolute",bottom:"36%",left:`${left}%`,
          animation:`sp_tree_sway ${2.5+i*0.4}s ease-in-out ${i*0.3}s infinite alternate`}}>
          <div style={{width:6,height:22,background:`rgba(30,80,30,0.7)`,margin:"0 auto",borderRadius:2}}/>
          <div style={{width:22,height:22,background:`rgba(40,140,50,0.35)`,borderRadius:"50%",marginTop:-8,marginLeft:-8}}/>
        </div>
      ))}
      {/* Bus — moves LEFT to RIGHT ✅ */}
      <div style={{position:"absolute",bottom:"37%",animation:"sp_bus_move 7s linear infinite"}}>
        <svg width="150" height="58" viewBox="0 0 130 50" fill="none">
          <rect x="4" y="8" width="118" height="30" rx="5" fill={GOLD} opacity="0.88"/>
          {/* Windows */}
          <rect x="12" y="13" width="18" height="13" rx="2" fill="rgba(255,255,255,0.55)"/>
          <rect x="34" y="13" width="18" height="13" rx="2" fill="rgba(255,255,255,0.55)"/>
          <rect x="56" y="13" width="18" height="13" rx="2" fill="rgba(255,255,255,0.55)"/>
          <rect x="78" y="13" width="18" height="13" rx="2" fill="rgba(255,255,255,0.55)"/>
          <rect x="100" y="13" width="16" height="13" rx="2" fill="rgba(255,180,0,0.6)"/>
          {/* Wheels */}
          <circle cx="28" cy="40" r="8" fill="#1a2a1a" stroke={GOLD} strokeWidth="1.5"/>
          <circle cx="28" cy="40" r="3" fill={GOLD} opacity="0.6"/>
          <circle cx="96" cy="40" r="8" fill="#1a2a1a" stroke={GOLD} strokeWidth="1.5"/>
          <circle cx="96" cy="40" r="3" fill={GOLD} opacity="0.6"/>
          {/* Headlight */}
          <rect x="4" y="16" width="6" height="8" rx="1" fill="rgba(255,240,180,0.8)"/>
        </svg>
      </div>
      {/* Road glow */}
      <div style={{position:"absolute",bottom:"8%",left:0,right:0,height:22,
        background:`linear-gradient(transparent,${GOLD}14,transparent)`}}/>
    </div>
  );
}

function HotelScene() {
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0,
      background:"linear-gradient(180deg,#0a0c1a 0%,#0e1225 40%,#1a1f3a 80%,#0e1225 100%)"}}>
      {/* Stars */}
      {Array.from({length:30},(_,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:`${(i*113)%100}%`, top:`${(i*71)%45}%`,
          width:1.5, height:1.5, borderRadius:"50%",
          background:"rgba(255,255,255,0.7)",
          animation:`sp_star ${1.2+i%4}s ease-in-out ${i*0.15}s infinite`,
        }}/>
      ))}
      {/* Moon */}
      <div style={{position:"absolute",top:"12%",right:"14%",width:34,height:34,borderRadius:"50%",
        background:"rgba(255,230,120,0.18)",boxShadow:"0 0 22px rgba(255,210,80,0.15)",
        animation:"sp_moon_float 5s ease-in-out infinite"}}/>
      {/* City skyline */}
      <svg style={{position:"absolute",bottom:0,left:0,right:0,width:"100%"}} height="160" viewBox="0 0 1000 160" preserveAspectRatio="none">
        <rect x="30"  y="70" width="55" height="90" rx="3" fill="rgba(25,30,60,0.95)"/>
        <rect x="40"  y="50" width="35" height="22" rx="2" fill="rgba(25,30,60,0.95)"/>
        <rect x="110" y="35" width="80" height="125" rx="3" fill="rgba(25,30,60,0.95)"/>
        <rect x="130" y="15" width="40" height="22" rx="2" fill="rgba(25,30,60,0.95)"/>
        <rect x="215" y="65" width="55" height="95" rx="3" fill="rgba(25,30,60,0.9)"/>
        <rect x="295" y="22" width="90" height="138" rx="3" fill="rgba(20,25,55,0.95)"/>
        <rect x="320" y="5"  width="40" height="20" rx="2" fill="rgba(20,25,55,0.95)"/>
        <rect x="410" y="40" width="65" height="120" rx="3" fill="rgba(25,30,60,0.95)"/>
        <rect x="500" y="28" width="60" height="132" rx="3" fill="rgba(20,25,55,0.95)"/>
        <rect x="515" y="8"  width="30" height="22" rx="2" fill="rgba(20,25,55,0.95)"/>
        <rect x="585" y="60" width="60" height="100" rx="3" fill="rgba(25,30,60,0.9)"/>
        <rect x="670" y="20" width="85" height="140" rx="3" fill="rgba(20,25,55,0.95)"/>
        <rect x="695" y="5"  width="35" height="18" rx="2" fill="rgba(20,25,55,0.95)"/>
        <rect x="780" y="48" width="65" height="112" rx="3" fill="rgba(25,30,60,0.95)"/>
        <rect x="870" y="35" width="75" height="125" rx="3" fill="rgba(25,30,60,0.95)"/>
        <rect x="890" y="15" width="35" height="22" rx="2" fill="rgba(25,30,60,0.95)"/>
      </svg>
      {/* Building windows — blinking amber lights */}
      {[
        {x:"12%",y:"52%"},{x:"16%",y:"62%"},{x:"13%",y:"70%"},
        {x:"24%",y:"40%"},{x:"28%",y:"50%"},{x:"31%",y:"58%"},{x:"26%",y:"66%"},
        {x:"44%",y:"46%"},{x:"48%",y:"56%"},{x:"41%",y:"64%"},
        {x:"55%",y:"35%"},{x:"59%",y:"44%"},{x:"52%",y:"52%"},{x:"56%",y:"60%"},
        {x:"67%",y:"42%"},{x:"72%",y:"52%"},{x:"70%",y:"62%"},
        {x:"81%",y:"54%"},{x:"86%",y:"44%"},{x:"84%",y:"62%"},
        {x:"91%",y:"40%"},{x:"95%",y:"50%"},{x:"93%",y:"62%"},
      ].map((w,i)=>(
        <div key={i} style={{
          position:"absolute",left:w.x,top:w.y,
          width:7,height:7,borderRadius:1,
          background:`rgba(255,${180+i*3},${50+i*2},0.85)`,
          boxShadow:`0 0 6px rgba(255,180,50,0.5)`,
          animation:`sp_win_blink ${2.5+i%4}s ease-in-out ${i*0.35}s infinite`,
        }}/>
      ))}
      {/* Hotel sign glow */}
      <div style={{position:"absolute",bottom:"58%",left:"50%",transform:"translateX(-50%)",
        padding:"3px 14px",background:"rgba(201,168,76,0.12)",borderRadius:4,
        animation:"sp_hotel_glow 2.5s ease-in-out infinite",
        border:"1px solid rgba(201,168,76,0.3)"}}>
        <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"rgba(201,168,76,0.7)",letterSpacing:"2px"}}>HOTEL</span>
      </div>
      {/* Ground glow */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:24,
        background:`linear-gradient(transparent,rgba(201,168,76,0.08))`}}/>
    </div>
  );
}

function TrainScene() {
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0,
      background:"linear-gradient(180deg,#0d0a1e 0%,#160d30 40%,#1e1040 70%,#0d0a1e 100%)"}}>
      {/* Stars */}
      {Array.from({length:32},(_,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:`${(i*97)%100}%`, top:`${(i*83)%60}%`,
          width:1.5, height:1.5, borderRadius:"50%",
          background:"rgba(200,170,255,0.6)",
          animation:`sp_star ${1.3+i%3}s ease-in-out ${i*0.14}s infinite`,
        }}/>
      ))}
      {/* Track bed */}
      <div style={{position:"absolute",bottom:"22%",left:0,right:0,height:3,
        background:`linear-gradient(90deg,transparent,rgba(160,110,255,0.35),transparent)`}}/>
      <div style={{position:"absolute",bottom:"26%",left:0,right:0,height:2,
        background:`linear-gradient(90deg,transparent,rgba(160,110,255,0.3),transparent)`}}/>
      {/* Track sleepers — scroll RIGHT to LEFT (train moving right to left) */}
      <div style={{position:"absolute",bottom:"21%",left:0,right:0,overflow:"hidden",height:7}}>
        <div style={{display:"flex",gap:28,animation:"sp_track_dash 1.6s linear infinite",width:"200%"}}>
          {Array.from({length:50},(_,i)=>(
            <div key={i} style={{width:8,height:7,background:"rgba(130,90,200,0.4)",borderRadius:1,flexShrink:0}}/>
          ))}
        </div>
      </div>
      {/* TRAIN — moves RIGHT to LEFT ✅ (scaleX(-1) flips emoji) */}
      <div style={{position:"absolute",bottom:"24%",animation:"sp_train_move 8s linear 1s infinite"}}>
        <svg width="240" height="52" viewBox="0 0 210 48" fill="none">
          {/* Engine */}
          <rect x="4"   y="6" width="60" height="28" rx="4" fill={GOLD} opacity="0.9"/>
          <path d="M4 6 Q 12 2 22 6" stroke={GOLD} strokeWidth="1.5" fill="none" opacity="0.7"/>
          {/* Carriages */}
          <rect x="62"  y="6" width="46" height="28" rx="2" fill={GOLD} opacity="0.82"/>
          <rect x="106" y="6" width="46" height="28" rx="2" fill={GOLD} opacity="0.75"/>
          <rect x="150" y="6" width="44" height="28" rx="2" fill={GOLD} opacity="0.68"/>
          {/* Windows - engine */}
          <rect x="10"  y="11" width="14" height="10" rx="1.5" fill="rgba(255,255,255,0.6)"/>
          <rect x="28"  y="11" width="14" height="10" rx="1.5" fill="rgba(255,255,255,0.6)"/>
          <rect x="46"  y="11" width="12" height="10" rx="1.5" fill="rgba(255,220,0,0.55)"/>
          {/* Windows - carriages */}
          <rect x="68"  y="11" width="12" height="10" rx="1.5" fill="rgba(255,255,255,0.5)"/>
          <rect x="86"  y="11" width="12" height="10" rx="1.5" fill="rgba(255,255,255,0.5)"/>
          <rect x="112" y="11" width="12" height="10" rx="1.5" fill="rgba(255,255,255,0.5)"/>
          <rect x="130" y="11" width="12" height="10" rx="1.5" fill="rgba(255,255,255,0.5)"/>
          {/* Wheels */}
          {[20,44,74,98,120,144,162,186].map((cx,i)=>(
            <g key={i}>
              <circle cx={cx} cy="38" r="7" fill="#0d0a1e" stroke="rgba(160,110,255,0.7)" strokeWidth="1.5"/>
              <circle cx={cx} cy="38" r="2.5" fill="rgba(160,110,255,0.5)"/>
            </g>
          ))}
          {/* Headlight (on left since going left) */}
          <rect x="192" y="14" width="6" height="10" rx="1" fill="rgba(255,240,180,0.9)"/>
        </svg>
        {/* Steam puffs */}
        {[0,1,2].map(i=>(
          <div key={i} style={{
            position:"absolute",top:-18-i*8,right:50+i*12,
            width:16-i*4,height:16-i*4,borderRadius:"50%",
            background:"rgba(255,255,255,0.15)",
            animation:`sp_steam 1.5s ease-out ${i*0.5}s infinite`,
          }}/>
        ))}
      </div>
    </div>
  );
}

function CabScene() {
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0,
      background:"linear-gradient(180deg,#0a0c08 0%,#141a0a 40%,#1e2510 70%,#0a0c08 100%)"}}>
      {/* City lights in distance */}
      {Array.from({length:22},(_,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:`${(i*137)%100}%`, top:`${28+(i*61)%38}%`,
          width:2, height:4+i%7,
          background:`rgba(255,${140+i*5},${30+i*3},0.35)`,
          animation:`sp_city_light ${1.2+i%3}s ease-in-out ${i*0.22}s infinite`,
        }}/>
      ))}
      {/* Road */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"38%",
        background:"linear-gradient(180deg,#141a0a,#0a0c08)"}}/>
      <div style={{position:"absolute",bottom:"20%",left:0,right:0,height:3,
        background:`linear-gradient(90deg,transparent,${GOLD}44,transparent)`}}/>
      {/* Road dashes — LEFT (cab moving right) */}
      <div style={{position:"absolute",bottom:"14%",left:0,right:0,overflow:"hidden",height:4}}>
        <div style={{display:"flex",gap:52,animation:"sp_road_dash 1.6s linear infinite",width:"200%"}}>
          {Array.from({length:28},(_,i)=>(
            <div key={i} style={{width:30,height:3,background:GOLD,opacity:0.4,borderRadius:2,flexShrink:0}}/>
          ))}
        </div>
      </div>
      {/* CAB — moves LEFT to RIGHT ✅ */}
      <div style={{position:"absolute",bottom:"37%",animation:"sp_cab_move 8s linear 0.5s infinite"}}>
        <svg width="110" height="48" viewBox="0 0 96 42" fill="none">
          <rect x="10" y="18" width="76" height="18" rx="3" fill={GOLD} opacity="0.88"/>
          <path d="M16 18 L24 8 L72 8 L80 18Z" fill={GOLD} opacity="0.88"/>
          {/* Windows */}
          <rect x="28" y="10" width="14" height="10" rx="1.5" fill="rgba(200,230,255,0.55)"/>
          <rect x="46" y="10" width="14" height="10" rx="1.5" fill="rgba(200,230,255,0.55)"/>
          <rect x="64" y="10" width="10" height="10" rx="1.5" fill="rgba(200,230,255,0.55)"/>
          {/* Wheels */}
          <circle cx="24" cy="38" r="7" fill="#0a0c08" stroke={GOLD} strokeWidth="1.5"/>
          <circle cx="24" cy="38" r="2.5" fill={GOLD} opacity="0.6"/>
          <circle cx="70" cy="38" r="7" fill="#0a0c08" stroke={GOLD} strokeWidth="1.5"/>
          <circle cx="70" cy="38" r="2.5" fill={GOLD} opacity="0.6"/>
          {/* Headlights */}
          <ellipse cx="12" cy="24" rx="5" ry="3.5" fill="rgba(255,240,150,0.7)"/>
          {/* Taxi sign */}
          <rect x="38" y="5" width="20" height="6" rx="2" fill="rgba(255,200,0,0.6)"/>
        </svg>
      </div>
    </div>
  );
}

// ── MAIN SEARCH PAGE ───────────────────────────────────────────────────────────
export default function SearchPage(){
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flight");
  const today = new Date().toISOString().split("T")[0];

  // Flight state
  const [fromCity, setFromCity] = useState(FLIGHT_CITIES[0]);
  const [toCity,   setToCity]   = useState(FLIGHT_CITIES[1]);
  const [date,     setDate]     = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState("oneway");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState("Economy");

  // Bus state
  const [busFrom, setBusFrom] = useState("Bangalore");
  const [busTo,   setBusTo]   = useState("Chennai");
  const [busDate, setBusDate] = useState("");

  // Train state
  const [trainFrom, setTrainFrom] = useState(TRAIN_CITIES[0]);
  const [trainTo,   setTrainTo]   = useState(TRAIN_CITIES[1]);
  const [trainDate, setTrainDate] = useState("");

  // Hotel state
  const [hotelCity,   setHotelCity]   = useState("Goa");
  const [checkIn,     setCheckIn]     = useState("");
  const [checkOut,    setCheckOut]    = useState("");
  const [hotelGuests, setHotelGuests] = useState(1);
  const [hotelRooms,  setHotelRooms]  = useState(1);

  // Pickers
  const [showFromPicker,  setShowFromPicker]  = useState(false);
  const [showToPicker,    setShowToPicker]    = useState(false);
  const [showBusFromP,    setShowBusFromP]    = useState(false);
  const [showBusToP,      setShowBusToP]      = useState(false);
  const [showTrainFromP,  setShowTrainFromP]  = useState(false);
  const [showTrainToP,    setShowTrainToP]    = useState(false);
  const [showHotelP,      setShowHotelP]      = useState(false);


  // Keep backend alive
  useEffect(()=>{
    fetch(`${API}/test`).catch(()=>{});
    const t=setInterval(()=>fetch(`${API}/test`).catch(()=>{}),14*60*1000);
    return()=>clearInterval(t);
  },[]);

  let user={};
  try{user=JSON.parse(localStorage.getItem("user")||"{}");}catch{}

  // ── SEARCH HANDLERS ────────────────────────────────────────────────────────
  const handleFlightSearch = () => {
    const link = buildFlightLink(fromCity.code, toCity.code, date||null, passengers);
    window.open(link,"_blank","noopener,noreferrer");
  };
  const handleBusSearch = () => {
    const link = buildBusLink(busFrom, busTo, busDate||null);
    window.open(link,"_blank","noopener,noreferrer");
  };
  const handleTrainSearch = () => {
    const link = buildTrainLink(trainFrom.code, trainTo.code, trainDate||null);
    window.open(link,"_blank","noopener,noreferrer");
  };
  const handleHotelSearch = () => {
    const link = buildHotelLink(hotelCity, checkIn||null, checkOut||null, hotelGuests, hotelRooms);
    window.open(link,"_blank","noopener,noreferrer");
  };

  // ── STYLES ─────────────────────────────────────────────────────────────────
  const lbl = {fontFamily:"'DM Sans',sans-serif",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.45)",marginBottom:6,display:"block"};
  const cityBtn = {background:"rgba(255,255,255,0.07)",border:"1px solid rgba(201,168,76,0.25)",borderRadius:14,padding:"14px 16px",cursor:"pointer",textAlign:"left",transition:"all 0.2s"};
  const dateBox = {background:"rgba(255,255,255,0.06)",border:"1px solid rgba(201,168,76,0.18)",borderRadius:12,padding:"12px 14px"};

  const TabBgMap = {flight:<FlightScene/>,bus:<BusScene/>,hotel:<HotelScene/>,train:<TrainScene/>,cab:<CabScene/>};

  const SearchBtn = ({onClick,label})=>(
    <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:12,color:"#1a1410",fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:700,cursor:"pointer",background:GRAD,backgroundSize:"200% 200%",boxShadow:`0 8px 28px rgba(201,168,76,0.38)`,transition:"transform 0.2s,box-shadow 0.2s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(201,168,76,0.5)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 8px 28px rgba(201,168,76,0.38)";}}>
      {label}
    </button>
  );

  const CounterBtn = ({val,set,min=1,max=9})=>(
    <div style={{display:"flex",alignItems:"center",gap:10,marginTop:4}}>
      <button onClick={()=>set(v=>Math.max(min,v-1))} style={{width:28,height:28,borderRadius:"50%",background:"rgba(201,168,76,0.15)",border:"1px solid rgba(201,168,76,0.35)",color:GOLD,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>−</button>
      <span style={{fontFamily:"'Space Mono',monospace",fontSize:18,fontWeight:700,color:"#fff",minWidth:22,textAlign:"center"}}>{val}</span>
      <button onClick={()=>set(v=>Math.min(max,v+1))} style={{width:28,height:28,borderRadius:"50%",background:"rgba(201,168,76,0.15)",border:"1px solid rgba(201,168,76,0.35)",color:GOLD,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>+</button>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#0a0a0a",fontFamily:"'DM Sans',sans-serif",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;600;700&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.4);border-radius:2px;}
        @keyframes sp_gradShift{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
        @keyframes sp_floatUD{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        @keyframes sp_fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes sp_spin{to{transform:rotate(360deg);}}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(1);opacity:0.4;cursor:pointer;}
        ${TAB_SCENES_CSS}
        .sp_citybtn:hover{border-color:rgba(201,168,76,0.55)!important;background:rgba(201,168,76,0.08)!important;}
        .sp_tab:hover{background:rgba(201,168,76,0.08)!important;}
      `}</style>

      {/* PICKERS */}
      {showFromPicker&&<CityPickerModal tabId="flight" label="Departure City" exclude={toCity.code} onSelect={c=>{setFromCity(c);setShowFromPicker(false);}} onClose={()=>setShowFromPicker(false)}/>}
      {showToPicker&&<CityPickerModal tabId="flight" label="Destination City" exclude={fromCity.code} onSelect={c=>{setToCity(c);setShowToPicker(false);}} onClose={()=>setShowToPicker(false)}/>}
      {showBusFromP&&<CityPickerModal tabId="bus" label="Departure City" exclude={busTo} onSelect={c=>{setBusFrom(c);setShowBusFromP(false);}} onClose={()=>setShowBusFromP(false)}/>}
      {showBusToP&&<CityPickerModal tabId="bus" label="Destination City" exclude={busFrom} onSelect={c=>{setBusTo(c);setShowBusToP(false);}} onClose={()=>setShowBusToP(false)}/>}
      {showTrainFromP&&<CityPickerModal tabId="train" label="From Station" exclude={trainTo.city} onSelect={c=>{setTrainFrom(c);setShowTrainFromP(false);}} onClose={()=>setShowTrainFromP(false)}/>}
      {showTrainToP&&<CityPickerModal tabId="train" label="To Station" exclude={trainFrom.city} onSelect={c=>{setTrainTo(c);setShowTrainToP(false);}} onClose={()=>setShowTrainToP(false)}/>}
      {showHotelP&&<CityPickerModal tabId="hotel" label="City / Destination" onSelect={c=>{setHotelCity(c);setShowHotelP(false);}} onClose={()=>setShowHotelP(false)}/>}

      {/* ── HERO SECTION ── */}
      <div style={{minHeight:"100vh",position:"relative",overflow:"hidden"}}>
        {/* Background scene */}
        {TabBgMap[activeTab]}
        {/* Dark overlay — just enough for readability */}
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.38)",zIndex:1}}/>

        {/* NAV */}
        <nav style={{position:"relative",zIndex:10,height:62,padding:"0 5%",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>navigate("/")}>
            <div style={{animation:"sp_floatUD 4s ease-in-out infinite"}}><AlvrynIcon size={36}/></div>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,color:"#fff",letterSpacing:"0.12em"}}>ALVRYN</div>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:GOLD,letterSpacing:"0.18em"}}>TRAVEL BEYOND</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>navigate("/ai")} style={{padding:"7px 14px",background:"rgba(201,168,76,0.15)",border:"1px solid rgba(201,168,76,0.35)",borderRadius:9,color:GOLD,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>🤖 AI Chat</button>
            <button onClick={()=>navigate("/profile")} style={{padding:"7px 14px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:9,color:"rgba(255,255,255,0.75)",fontFamily:"'DM Sans',sans-serif",fontSize:12,cursor:"pointer"}}>Profile</button>
            <button onClick={()=>{localStorage.removeItem("token");localStorage.removeItem("user");navigate("/login");}} style={{padding:"7px 14px",background:"rgba(255,50,50,0.08)",border:"1px solid rgba(255,50,50,0.2)",borderRadius:9,color:"rgba(255,100,100,0.75)",fontFamily:"'DM Sans',sans-serif",fontSize:12,cursor:"pointer"}}>Sign Out</button>
          </div>
        </nav>

        {/* CONTENT */}
        <div style={{position:"relative",zIndex:2,maxWidth:680,margin:"0 auto",padding:"28px 5% 60px"}}>

          {/* GREETING */}
          <div style={{marginBottom:24,animation:"sp_fadeUp 0.5s both"}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:GOLD,letterSpacing:"0.22em",marginBottom:8}}>✦ SEARCH TRAVEL</div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(20px,4vw,30px)",fontWeight:700,color:"#fff",letterSpacing:"-0.3px",marginBottom:4}}>
              Hey {user.name?.split(" ")[0]||"Traveller"} 👋
            </div>
            <div style={{fontSize:14,color:"rgba(255,255,255,0.45)",fontWeight:300}}>Where do you want to go today?</div>
          </div>

          {/* AI BANNER */}
          <div onClick={()=>navigate("/ai")} style={{background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.28)",borderRadius:14,padding:"12px 18px",marginBottom:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.16)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(201,168,76,0.1)"}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>🤖</span>
              <div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#fff"}}>Plan with Alvryn AI</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:1}}>Complete door-to-door trip planning · Any destination worldwide</div>
              </div>
            </div>
            <span style={{color:GOLD,fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>Chat now →</span>
          </div>

          {/* TAB BAR */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom:20,background:"rgba(0,0,0,0.4)",borderRadius:14,padding:5,backdropFilter:"blur(10px)"}}>
            {TABS.map(t=>(
              <button key={t.id} className="sp_tab" onClick={()=>setActiveTab(t.id)}
                style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"10px 6px",borderRadius:9,cursor:"pointer",border:"none",
                  background:activeTab===t.id?`rgba(201,168,76,0.2)`:"transparent",
                  outline:activeTab===t.id?`1px solid rgba(201,168,76,0.4)`:"none",
                  color:activeTab===t.id?GOLD:"rgba(255,255,255,0.4)",
                  fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,transition:"all 0.2s",whiteSpace:"nowrap"}}>
                <span style={{fontSize:20,transition:"transform 0.2s",transform:activeTab===t.id?"scale(1.18)":"scale(1)"}}>{t.icon}</span>
                <span>{t.label}</span>
                {t.soon&&<span style={{fontSize:7,background:"rgba(201,168,76,0.15)",border:"1px solid rgba(201,168,76,0.3)",color:GOLD,padding:"1px 5px",borderRadius:6}}>SOON</span>}
              </button>
            ))}
          </div>

          {/* ── SEARCH FORM PANEL ── */}
          <div style={{background:"rgba(0,0,0,0.5)",backdropFilter:"blur(20px)",borderRadius:20,padding:"clamp(16px,4vw,24px)",border:"1px solid rgba(201,168,76,0.18)",animation:"sp_fadeUp 0.4s both"}}>

            {/* ── FLIGHT ── */}
            {activeTab==="flight"&&(
              <>
                <div style={{display:"flex",gap:6,marginBottom:16,background:"rgba(255,255,255,0.05)",borderRadius:10,padding:4}}>
                  {["oneway","roundtrip"].map(t=>(
                    <button key={t} onClick={()=>setTripType(t)} style={{flex:1,padding:"7px",border:"none",borderRadius:7,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:500,cursor:"pointer",transition:"all 0.2s",background:tripType===t?"rgba(201,168,76,0.18)":"transparent",color:tripType===t?GOLD:"rgba(255,255,255,0.35)"}}>
                      {t==="oneway"?"One Way":"Round Trip"}
                    </button>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center",marginBottom:12}}>
                  <button className="sp_citybtn" onClick={()=>setShowFromPicker(true)} style={cityBtn}>
                    <span style={lbl}>FROM</span>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:24,fontWeight:700,color:"#fff"}}>{fromCity.code}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fromCity.name}</div>
                  </button>
                  <button onClick={()=>{const t=fromCity;setFromCity(toCity);setToCity(t);}} style={{width:36,height:36,borderRadius:"50%",background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.35)",color:GOLD,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.3s"}} onMouseEnter={e=>e.currentTarget.style.transform="rotate(180deg)"} onMouseLeave={e=>e.currentTarget.style.transform="rotate(0)"}>⇄</button>
                  <button className="sp_citybtn" onClick={()=>setShowToPicker(true)} style={cityBtn}>
                    <span style={lbl}>TO</span>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:24,fontWeight:700,color:"#fff"}}>{toCity.code}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{toCity.name}</div>
                  </button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:tripType==="roundtrip"?"1fr 1fr 1fr 1fr":"1fr 1fr 1fr",gap:8,marginBottom:14}}>
                  <div style={dateBox}>
                    <span style={lbl}>DEPARTURE *</span>
                    <input type="date" value={date} min={today} onChange={e=>setDate(e.target.value)} style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:13,width:"100%",cursor:"pointer"}}/>
                  </div>
                  {tripType==="roundtrip"&&<div style={dateBox}><span style={lbl}>RETURN</span><input type="date" value={returnDate} min={date||today} onChange={e=>setReturnDate(e.target.value)} style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:13,width:"100%",cursor:"pointer"}}/></div>}
                  <div style={dateBox}><span style={lbl}>TRAVELLERS</span><CounterBtn val={passengers} set={setPassengers}/></div>
                  <div style={dateBox}><span style={lbl}>CLASS</span><select value={cabinClass} onChange={e=>setCabinClass(e.target.value)} style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:13,width:"100%",cursor:"pointer",marginTop:4}}>{CLASSES.map(c=><option key={c} style={{color:"#1a1410"}}>{c}</option>)}</select></div>
                </div>
                <SearchBtn onClick={handleFlightSearch} label="Search Flights ✈"/>
                <p style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.22)",marginTop:10}}>Best fares on our trusted partner site</p>
              </>
            )}

            {/* ── BUS ── */}
            {activeTab==="bus"&&(
              <>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center",marginBottom:12}}>
                  <button className="sp_citybtn" onClick={()=>setShowBusFromP(true)} style={cityBtn}>
                    <span style={lbl}>FROM</span>
                    <div style={{fontSize:17,fontWeight:700,color:"#fff",marginTop:2}}>{busFrom}</div>
                  </button>
                  <button onClick={()=>{const t=busFrom;setBusFrom(busTo);setBusTo(t);}} style={{width:36,height:36,borderRadius:"50%",background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.35)",color:GOLD,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.3s"}} onMouseEnter={e=>e.currentTarget.style.transform="rotate(180deg)"} onMouseLeave={e=>e.currentTarget.style.transform="rotate(0)"}>⇄</button>
                  <button className="sp_citybtn" onClick={()=>setShowBusToP(true)} style={cityBtn}>
                    <span style={lbl}>TO</span>
                    <div style={{fontSize:17,fontWeight:700,color:"#fff",marginTop:2}}>{busTo}</div>
                  </button>
                </div>
                <div style={{...dateBox,marginBottom:14}}>
                  <span style={lbl}>DATE OF JOURNEY *</span>
                  <input type="date" value={busDate} min={today} onChange={e=>setBusDate(e.target.value)} style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:14,width:"100%",cursor:"pointer"}}/>
                </div>
                <SearchBtn onClick={handleBusSearch} label="Search Buses 🚌"/>
                <p style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.22)",marginTop:10}}>Live seats & prices on RedBus</p>
              </>
            )}

            {/* ── HOTEL ── */}
            {activeTab==="hotel"&&(
              <>
                <div style={{marginBottom:12}}>
                  <span style={lbl}>DESTINATION</span>
                  <button className="sp_citybtn" onClick={()=>setShowHotelP(true)} style={{...cityBtn,width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:20}}>🏨</span>
                      <div>
                        <div style={{fontSize:16,fontWeight:600,color:"#fff"}}>{hotelCity}</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:2}}>Tap to change</div>
                      </div>
                    </div>
                    <span style={{color:"rgba(255,255,255,0.3)",fontSize:18}}>›</span>
                  </button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  <div style={dateBox}><span style={lbl}>CHECK-IN *</span><input type="date" value={checkIn} min={today} onChange={e=>setCheckIn(e.target.value)} style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:13,width:"100%",cursor:"pointer"}}/></div>
                  <div style={dateBox}><span style={lbl}>CHECK-OUT</span><input type="date" value={checkOut} min={checkIn||today} onChange={e=>setCheckOut(e.target.value)} style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:13,width:"100%",cursor:"pointer"}}/></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                  <div style={dateBox}><span style={lbl}>GUESTS</span><CounterBtn val={hotelGuests} set={setHotelGuests} max={10}/></div>
                  <div style={dateBox}><span style={lbl}>ROOMS</span><CounterBtn val={hotelRooms} set={setHotelRooms} max={10}/></div>
                </div>
                <SearchBtn onClick={handleHotelSearch} label="Search Hotels 🏨"/>
                <p style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.22)",marginTop:10}}>Best prices on Booking.com</p>
              </>
            )}

            {/* ── TRAIN ── */}
            {activeTab==="train"&&(
              <>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center",marginBottom:12}}>
                  <button className="sp_citybtn" onClick={()=>setShowTrainFromP(true)} style={cityBtn}>
                    <span style={lbl}>FROM</span>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:17,fontWeight:700,color:"#fff",marginTop:2}}>{trainFrom.code}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{trainFrom.city}</div>
                  </button>
                  <button onClick={()=>{const t=trainFrom;setTrainFrom(trainTo);setTrainTo(t);}} style={{width:36,height:36,borderRadius:"50%",background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.35)",color:GOLD,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.3s"}} onMouseEnter={e=>e.currentTarget.style.transform="rotate(180deg)"} onMouseLeave={e=>e.currentTarget.style.transform="rotate(0)"}>⇄</button>
                  <button className="sp_citybtn" onClick={()=>setShowTrainToP(true)} style={cityBtn}>
                    <span style={lbl}>TO</span>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:17,fontWeight:700,color:"#fff",marginTop:2}}>{trainTo.code}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{trainTo.city}</div>
                  </button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                  <div style={dateBox}><span style={lbl}>JOURNEY DATE</span><input type="date" value={trainDate} min={today} onChange={e=>setTrainDate(e.target.value)} style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:13,width:"100%",cursor:"pointer"}}/></div>
                  <div style={dateBox}><span style={lbl}>CLASS</span><select style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:13,width:"100%",cursor:"pointer",marginTop:4}}><option style={{color:"#1a1410"}}>SL - Sleeper</option><option style={{color:"#1a1410"}}>3A - AC 3 Tier</option><option style={{color:"#1a1410"}}>2A - AC 2 Tier</option><option style={{color:"#1a1410"}}>1A - AC First</option><option style={{color:"#1a1410"}}>CC - Chair Car</option></select></div>
                </div>
                <SearchBtn onClick={handleTrainSearch} label="Search Trains 🚂"/>
                <p style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.22)",marginTop:10}}>Opens IRCTC with route pre-filled</p>
              </>
            )}

            {/* ── CAB (SOON) ── */}
            {activeTab==="cab"&&(
              <div style={{textAlign:"center",padding:"44px 20px"}}>
                <div style={{fontSize:48,marginBottom:14}}>🚖</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,fontWeight:700,color:"#fff",marginBottom:8}}>Cab Booking</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.35)",lineHeight:1.7,maxWidth:280,margin:"0 auto 20px"}}>Airport transfers and intercity cabs — coming very soon!</div>
                <div style={{display:"inline-block",background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.28)",color:GOLD,padding:"6px 16px",borderRadius:20,fontSize:11,letterSpacing:"0.8px",fontFamily:"'Space Mono',monospace"}}>✦ Coming Soon</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
