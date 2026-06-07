/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://cometai-backend.onrender.com";
const GOLD = "#c9a84c";
const GOLD_DARK = "#8B6914";
const GRAD = "linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)";

// ── INDIA IATA ─────────────────────────────────────────────────────────────────
const INDIA_IATA = new Set([
  "BLR","BOM","DEL","MAA","HYD","CCU","GOI","PNQ","COK","AMD","JAI","LKO",
  "VNS","PAT","IXC","GAU","BBI","CBE","IXM","IXE","MYQ","TRV","VTZ","IXR",
  "BHO","SXR","IXJ","NAG","IDR","IXL","IXZ","ATQ","UDR","JDH","AGR","STV",
  "HBX","IXG","TIR","VGA","CCJ","TRZ","DED","SLV","RPR",
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

const BUS_CITIES = [
  "Bangalore","Mysore","Mangalore","Hubli","Dharwad","Belgaum","Shimoga","Tumkur",
  "Hassan","Chikmagalur","Udupi","Davangere","Raichur","Hospet","Hampi","Madikeri",
  "Coorg","Chamarajanagar","Mandya","Ramanagara","Kolar","Chintamani","Gadag",
  "Haveri","Sirsi","Karwar","Hosur","Yelahanka","Whitefield","Koramangala",
  "Chennai","Coimbatore","Madurai","Trichy","Salem","Tirunelveli","Vellore","Erode",
  "Thanjavur","Pondicherry","Ooty","Kodaikanal","Kumbakonam","Nagercoil","Kanyakumari",
  "Dindigul","Pollachi","Krishnagiri","Dharmapuri","Namakkal","Karur","Tirupur",
  "Marthandam","Cuddalore","Villupuram","Tenkasi","Ambur","Ranipet","Sriperumbudur",
  "Kochi","Trivandrum","Kozhikode","Thrissur","Kollam","Varkala","Alleppey","Kottayam",
  "Munnar","Wayanad","Kannur","Kasaragod","Malappuram","Palakkad","Thalassery",
  "Calicut","Changanacherry","Thodupuzha","Angamaly","Perumbavoor",
  "Hyderabad","Visakhapatnam","Vijayawada","Tirupati","Warangal","Guntur","Nellore",
  "Kurnool","Rajahmundry","Kakinada","Eluru","Ongole","Nandyal","Anantapur","Kadapa",
  "Chittoor","Karimnagar","Nizamabad","Khammam","Mahbubnagar","Suryapet",
  "Mumbai","Pune","Nagpur","Nashik","Aurangabad","Kolhapur","Solapur","Sangli",
  "Satara","Ratnagiri","Thane","Navi Mumbai","Amravati","Akola","Latur",
  "Nanded","Jalgaon","Dhule","Lonavala","Mahabaleshwar","Alibaug",
  "Goa","Panaji","Mapusa","Margao","Vasco","Ponda","Calangute","Anjuna",
  "Delhi","Gurgaon","Noida","Faridabad","Ghaziabad",
  "Jaipur","Jodhpur","Udaipur","Ajmer","Pushkar","Bikaner","Kota","Alwar",
  "Bharatpur","Jaisalmer","Chittorgarh","Mount Abu","Sikar",
  "Lucknow","Agra","Varanasi","Allahabad","Prayagraj","Kanpur","Gorakhpur",
  "Mathura","Vrindavan","Meerut","Bareilly","Jhansi","Ayodhya",
  "Haridwar","Rishikesh","Dehradun","Mussoorie","Nainital",
  "Shimla","Manali","Dharamshala","McLeod Ganj","Kasol","Kullu","Mandi",
  "Chandigarh","Amritsar","Ludhiana","Jalandhar","Patiala",
  "Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Gandhinagar",
  "Indore","Bhopal","Gwalior","Jabalpur","Ujjain","Sagar","Ratlam",
  "Bhubaneswar","Puri","Cuttack","Rourkela","Berhampur",
  "Kolkata","Darjeeling","Siliguri","Durgapur","Asansol",
  "Patna","Gaya","Ranchi","Jamshedpur","Dhanbad",
  "Guwahati","Shillong","Agartala","Imphal",
];

const TRAIN_CITIES = [
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
  {city:"Delhi New Delhi",code:"NDLS"},{city:"Delhi Nizamuddin",code:"NZM"},
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
  {city:"Jamshedpur",code:"TATA"},{city:"Dhanbad",code:"DHN"},
  {city:"Darjeeling",code:"DJ"},{city:"Siliguri",code:"SGUJ"},
];

const HOTEL_CITIES = [
  "Goa","Bangalore","Mumbai","Delhi","Chennai","Hyderabad","Kolkata","Jaipur",
  "Kochi","Agra","Varanasi","Udaipur","Manali","Shimla","Ooty","Kodaikanal",
  "Munnar","Varkala","Alleppey","Coorg","Pondicherry","Port Blair","Leh",
  "Dharamshala","McLeod Ganj","Rishikesh","Haridwar","Mussoorie","Nainital",
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
function buildFlightLink(fromCode,toCode,dateStr,passengers,cabinClass,specialFare){
  const isIndia=INDIA_IATA.has(fromCode)&&INDIA_IATA.has(toCode);
  const base=isIndia?"https://www.aviasales.in":"https://www.aviasales.com";
  let ddmm="";
  if(dateStr){const d=new Date(dateStr);if(!isNaN(d))ddmm=String(d.getDate()).padStart(2,"0")+String(d.getMonth()+1).padStart(2,"0");}
  let url=`${base}/search/${fromCode}${ddmm}${toCode}${passengers||1}?marker=714667&sub_id=alvryn_web`;
  if(cabinClass&&cabinClass.toLowerCase().includes("business"))url+="&class=business";
  if(cabinClass&&cabinClass.toLowerCase().includes("first"))url+="&class=first";
  return url;
}
function buildBusLink(from,to,dateStr){
  const f=(from||"").toLowerCase().replace(/\s+/g,"-");
  const t=(to||"").toLowerCase().replace(/\s+/g,"-");
  let url=`https://www.redbus.in/bus-tickets/${f}-to-${t}`;
  if(dateStr){const d=new Date(dateStr);if(!isNaN(d)){const dd=String(d.getDate()).padStart(2,"0");const mm=String(d.getMonth()+1).padStart(2,"0");const yyyy=d.getFullYear();url+=`?doj=${dd}-${mm}-${yyyy}`;}}
  return url;
}
function buildTrainLink(from,to,dateStr){
  // RedBus railways — pays commission via Cuelinks
  const f=encodeURIComponent(from||"");
  const t=encodeURIComponent(to||"");
  let url=`https://www.redbus.in/railways/train-search?fromCity=${f}&toCity=${t}`;
  if(dateStr){const d=new Date(dateStr);if(!isNaN(d)){url+=`&doj=${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;}}
  return url;
}
function buildHotelLink(city,checkIn,checkOut,guests,rooms){
  let url=`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&group_adults=${guests||1}&no_rooms=${rooms||1}`;
  if(checkIn){const d=new Date(checkIn);if(!isNaN(d))url+=`&checkin=${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
  if(checkOut){const d=new Date(checkOut);if(!isNaN(d))url+=`&checkout=${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
  return url;
}

// ── SEARCH HELPERS ─────────────────────────────────────────────────────────────
function searchFlightCities(q){if(!q)return FLIGHT_CITIES.filter(c=>c.top);const ql=q.toLowerCase();return FLIGHT_CITIES.filter(c=>c.name.toLowerCase().includes(ql)||c.code.toLowerCase().includes(ql)||c.country.toLowerCase().includes(ql)||c.full.toLowerCase().includes(ql)).slice(0,12);}
function searchBusCities(q){if(!q)return BUS_CITIES.slice(0,24);const ql=q.toLowerCase();return BUS_CITIES.filter(c=>c.toLowerCase().includes(ql)).slice(0,12);}
function searchTrainCities(q){if(!q)return TRAIN_CITIES.slice(0,20);const ql=q.toLowerCase();return TRAIN_CITIES.filter(c=>c.city.toLowerCase().includes(ql)||c.code.toLowerCase().includes(ql)).slice(0,12);}
function searchHotelCities(q){if(!q)return HOTEL_CITIES.slice(0,20);const ql=q.toLowerCase();return HOTEL_CITIES.filter(c=>c.toLowerCase().includes(ql)).slice(0,12);}

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
function CityPickerModal({tabId,label,onSelect,onClose,exclude}){
  const [q,setQ]=useState("");
  const ref=useRef(null);
  useEffect(()=>{setTimeout(()=>ref.current?.focus(),80);},[]);
  let results=[];
  if(tabId==="flight")results=searchFlightCities(q).filter(c=>c.code!==exclude);
  else if(tabId==="bus")results=searchBusCities(q).filter(c=>c!==exclude);
  else if(tabId==="train")results=searchTrainCities(q).filter(c=>c.city!==exclude);
  else if(tabId==="hotel")results=searchHotelCities(q).filter(c=>c!==exclude);
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:540,maxHeight:"82vh",background:"#fff",borderRadius:"24px 24px 0 0",boxShadow:"0 -20px 60px rgba(0,0,0,0.22)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"20px 20px 12px",borderBottom:"1px solid rgba(0,0,0,0.06)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:700,color:"#1a1410"}}>Select {label}</div>
            <button onClick={onClose} style={{background:"rgba(0,0,0,0.06)",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:18,color:"#666",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"#f8f8f8",borderRadius:12,padding:"10px 14px",border:"1.5px solid rgba(201,168,76,0.25)"}}>
            <span style={{opacity:0.4}}>🔍</span>
            <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} placeholder={tabId==="flight"?"Search city, code or country...":"Search city or station..."} style={{flex:1,background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#1a1410"}}/>
          </div>
        </div>
        {!q&&<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#bbb",letterSpacing:"0.12em",padding:"10px 20px 4px",textTransform:"uppercase"}}>Popular</div>}
        <div style={{overflowY:"auto",flex:1,padding:"4px 12px 24px"}}>
          {results.map((item)=>{
            if(tabId==="flight")return(
              <div key={item.code} onClick={()=>onSelect(item)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 10px",borderRadius:12,cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.09)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"#1a1410"}}>{item.name}{item.top&&<span style={{fontSize:9,background:"rgba(201,168,76,0.15)",color:"#8B6914",padding:"1px 6px",borderRadius:8,marginLeft:6,fontWeight:700}}>TOP</span>}</div>
                  <div style={{fontSize:11,color:"#888",marginTop:2}}>{item.full} · {item.country}</div>
                </div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:15,fontWeight:700,color:GOLD_DARK}}>{item.code}</div>
              </div>
            );
            if(tabId==="train")return(
              <div key={item.code} onClick={()=>onSelect(item)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 10px",borderRadius:12,cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.09)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{fontSize:14,fontWeight:500,color:"#1a1410"}}>{item.city}</div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,fontWeight:700,color:GOLD_DARK}}>{item.code}</div>
              </div>
            );
            return(<div key={item} onClick={()=>onSelect(item)} style={{padding:"12px 10px",borderRadius:12,cursor:"pointer",fontSize:14,fontWeight:500,color:"#1a1410",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.09)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{item}</div>);
          })}
          {results.length===0&&q&&<div style={{textAlign:"center",padding:"32px 20px",color:"#aaa",fontSize:13}}>No results for "{q}"</div>}
        </div>
      </div>
    </div>
  );
}

// ── HERO BACKGROUNDS ───────────────────────────────────────────────────────────
const HERO_STYLES = {
  flight:{
    bg:"linear-gradient(160deg,#0f2044 0%,#1a3a6e 35%,#c9a84c 75%,#f0d080 100%)",
    overlay:"rgba(15,32,68,0.45)",
    label:"Flights",
    tagline:"Fly to 60+ destinations worldwide",
  },
  bus:{
    bg:"linear-gradient(160deg,#0d3320 0%,#1a5c38 40%,#c9a84c 78%,#f0e0a0 100%)",
    overlay:"rgba(13,51,32,0.42)",
    label:"Buses",
    tagline:"Comfortable buses across 300+ routes",
  },
  hotel:{
    bg:"linear-gradient(160deg,#2d1200 0%,#7a3800 35%,#c9a84c 70%,#ffe8b0 100%)",
    overlay:"rgba(45,18,0,0.42)",
    label:"Hotels",
    tagline:"Best stays from budget to luxury",
  },
  train:{
    bg:"linear-gradient(160deg,#150a38 0%,#2d1878 40%,#c9a84c 78%,#e0c8f8 100%)",
    overlay:"rgba(21,10,56,0.42)",
    label:"Trains",
    tagline:"Book trains with pre-filled routes",
  },
  cab:{
    bg:"linear-gradient(160deg,#0a0a0a 0%,#2a1800 40%,#c9a84c 78%,#ffe090 100%)",
    overlay:"rgba(10,10,10,0.45)",
    label:"Cabs",
    tagline:"Airport transfers & city rides",
  },
};

// ── ANIMATED SCENE ──────────────────────────────────────────────────────────────
function HeroScene({tab}){
  if(tab==="flight") return(
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {/* Stars */}
      {Array.from({length:28},(_,i)=>(
        <div key={i} style={{position:"absolute",left:`${(i*137)%100}%`,top:`${(i*79)%55}%`,
          width:i%6===0?2.5:1.5,height:i%6===0?2.5:1.5,borderRadius:"50%",
          background:"rgba(255,255,255,0.9)",
          animation:`hero_twinkle ${1.5+i%3}s ease-in-out ${i*0.2}s infinite alternate`}}/>
      ))}
      {/* Clouds */}
      {[{w:200,h:45,top:"22%",speed:28,delay:0},{w:140,h:32,top:"40%",speed:20,delay:8},{w:100,h:25,top:"55%",speed:35,delay:14}].map((c,i)=>(
        <div key={i} style={{position:"absolute",top:c.top,width:c.w,height:c.h,
          borderRadius:50,background:"rgba(255,255,255,0.12)",
          animation:`hero_cloud ${c.speed}s linear ${c.delay}s infinite`}}/>
      ))}
      {/* Main aircraft — proper SVG facing RIGHT */}
      <div style={{position:"absolute",top:"36%",animation:"hero_fly 10s ease-in-out infinite"}}>
        <svg width="120" height="48" viewBox="0 0 120 48" fill="none">
          {/* Fuselage */}
          <ellipse cx="58" cy="24" rx="52" ry="10" fill="#f5f0e8" opacity="0.95"/>
          {/* Nose */}
          <path d="M110 24 Q120 24 118 22 Q120 24 118 26 Z" fill="#f5f0e8" opacity="0.95"/>
          {/* Tail fin */}
          <path d="M6 22 L6 10 L18 22 Z" fill={GOLD} opacity="0.9"/>
          {/* Main wings — sweep backward */}
          <path d="M50 22 L10 6 L30 22 Z" fill={GOLD} opacity="0.9"/>
          <path d="M50 26 L10 42 L30 26 Z" fill={GOLD} opacity="0.9"/>
          {/* Small rear wings */}
          <path d="M20 22 L8 15 L16 22 Z" fill={GOLD} opacity="0.7"/>
          <path d="M20 26 L8 33 L16 26 Z" fill={GOLD} opacity="0.7"/>
          {/* Engines */}
          <ellipse cx="38" cy="18" rx="10" ry="4" fill="#e8e0d0" opacity="0.8"/>
          <ellipse cx="38" cy="30" rx="10" ry="4" fill="#e8e0d0" opacity="0.8"/>
          {/* Windows */}
          {[65,75,85,95].map(cx=>(
            <ellipse key={cx} cx={cx} cy="22" rx="3.5" ry="2.5" fill="rgba(200,230,255,0.7)"/>
          ))}
          {/* Engine glow */}
          <ellipse cx="28" cy="18" rx="3" ry="3" fill="rgba(255,200,100,0.7)"/>
          <ellipse cx="28" cy="30" rx="3" ry="3" fill="rgba(255,200,100,0.7)"/>
        </svg>
      </div>
      {/* Second smaller plane */}
      <div style={{position:"absolute",top:"62%",animation:"hero_fly2 16s ease-in-out 5s infinite",opacity:0.55}}>
        <svg width="70" height="28" viewBox="0 0 120 48" fill="none">
          <ellipse cx="58" cy="24" rx="52" ry="10" fill="#f5f0e8"/>
          <path d="M110 24 Q120 24 118 22 Q120 24 118 26 Z" fill="#f5f0e8"/>
          <path d="M6 22 L6 10 L18 22 Z" fill={GOLD}/>
          <path d="M50 22 L10 6 L30 22 Z" fill={GOLD}/>
          <path d="M50 26 L10 42 L30 26 Z" fill={GOLD}/>
        </svg>
      </div>
      {/* Gold dashed flight path */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.25}} viewBox="0 0 1000 400" preserveAspectRatio="none">
        <path d="M-50 300 Q200 180 400 220 Q600 260 800 140 Q900 80 1050 100" stroke={GOLD} strokeWidth="2" fill="none" strokeDasharray="12 8"/>
      </svg>
    </div>
  );

  if(tab==="bus") return(
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {/* Road — at bottom 30% */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"32%",
        background:"linear-gradient(180deg,rgba(20,60,30,0.5),rgba(10,30,15,0.8))"}}/>
      {/* Road surface */}
      <div style={{position:"absolute",bottom:"2%",left:0,right:0,height:"28%",
        background:"rgba(30,30,30,0.6)",borderTop:"2px solid rgba(201,168,76,0.4)"}}/>
      {/* Center line — dashes scroll from right to left = bus moves left→right */}
      <div style={{position:"absolute",bottom:"13%",left:0,right:0,overflow:"hidden",height:5}}>
        <div style={{display:"flex",gap:50,animation:"hero_road 1.4s linear infinite",width:"300%",transform:"translateX(0)"}}>
          {Array.from({length:60},(_,i)=>(
            <div key={i} style={{width:40,height:4,background:GOLD,opacity:0.55,borderRadius:2,flexShrink:0}}/>
          ))}
        </div>
      </div>
      {/* Trees */}
      {[5,18,32,46,60,74,88].map((l,i)=>(
        <div key={i} style={{position:"absolute",bottom:"29%",left:`${l}%`,
          animation:`hero_sway ${2.5+i*0.3}s ease-in-out ${i*0.2}s infinite alternate`,transformOrigin:"bottom center"}}>
          <div style={{width:5,height:20+i%3*5,background:"rgba(20,70,20,0.7)",margin:"0 auto",borderRadius:2}}/>
          <div style={{width:20+i%3*5,height:20+i%3*5,background:`rgba(30,${130+i*8},40,0.35)`,borderRadius:"50%",marginTop:-8,marginLeft:-(10+i%3*2.5)}}/>
        </div>
      ))}
      {/* BUS — proper SVG facing RIGHT, moves left→right on road */}
      <div style={{position:"absolute",bottom:"28%",animation:"hero_bus 8s linear infinite"}}>
        <svg width="180" height="72" viewBox="0 0 160 64" fill="none">
          {/* Body */}
          <rect x="4" y="10" width="148" height="38" rx="6" fill="#f5f0e0" opacity="0.95"/>
          {/* Roof */}
          <rect x="8" y="6" width="140" height="8" rx="3" fill={GOLD} opacity="0.9"/>
          {/* Front (right side) */}
          <path d="M152 10 L156 14 L156 44 L152 48 Z" fill="#e8d890" opacity="0.9"/>
          <rect x="150" y="18" width="6" height="12" rx="1" fill="rgba(255,240,180,0.9)"/>
          {/* Rear (left side) */}
          <rect x="4" y="14" width="6" height="10" rx="1" fill="rgba(200,50,50,0.6)"/>
          {/* Windows */}
          <rect x="18" y="16" width="20" height="16" rx="2" fill="rgba(180,220,255,0.6)"/>
          <rect x="44" y="16" width="20" height="16" rx="2" fill="rgba(180,220,255,0.6)"/>
          <rect x="70" y="16" width="20" height="16" rx="2" fill="rgba(180,220,255,0.6)"/>
          <rect x="96" y="16" width="20" height="16" rx="2" fill="rgba(180,220,255,0.6)"/>
          <rect x="122" y="16" width="20" height="16" rx="2" fill="rgba(180,220,255,0.6)"/>
          {/* ALVRYN text on bus */}
          <rect x="40" y="36" width="72" height="8" rx="2" fill={GOLD} opacity="0.7"/>
          {/* Wheels — proper position on road */}
          <circle cx="32" cy="52" r="10" fill="#222" stroke={GOLD} strokeWidth="2"/>
          <circle cx="32" cy="52" r="4" fill={GOLD} opacity="0.7"/>
          <circle cx="124" cy="52" r="10" fill="#222" stroke={GOLD} strokeWidth="2"/>
          <circle cx="124" cy="52" r="4" fill={GOLD} opacity="0.7"/>
          {/* Wheel shadow on road */}
          <ellipse cx="32" cy="62" rx="12" ry="3" fill="rgba(0,0,0,0.3)"/>
          <ellipse cx="124" cy="62" rx="12" ry="3" fill="rgba(0,0,0,0.3)"/>
        </svg>
      </div>
    </div>
  );

  if(tab==="hotel") return(
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {/* Night sky */}
      {Array.from({length:35},(_,i)=>(
        <div key={i} style={{position:"absolute",left:`${(i*113)%100}%`,top:`${(i*71)%50}%`,
          width:1.5,height:1.5,borderRadius:"50%",background:"rgba(255,255,255,0.85)",
          animation:`hero_twinkle ${1.2+i%4}s ease-in-out ${i*0.16}s infinite alternate`}}/>
      ))}
      {/* Moon */}
      <div style={{position:"absolute",top:"10%",right:"12%",width:38,height:38,borderRadius:"50%",
        background:"radial-gradient(circle at 35% 35%,rgba(255,230,120,0.4),rgba(255,210,80,0.1))",
        boxShadow:"0 0 30px rgba(255,210,80,0.2)",animation:"hero_moon 6s ease-in-out infinite"}}/>
      {/* Hotel building */}
      <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:160,height:"58%"}}>
        <svg width="160" height="100%" viewBox="0 0 160 220" fill="none" preserveAspectRatio="xMidYMax meet">
          {/* Main building */}
          <rect x="20" y="20" width="120" height="200" fill="rgba(30,25,50,0.95)"/>
          {/* Lobby entrance */}
          <rect x="55" y="170" width="50" height="50" fill="rgba(201,168,76,0.2)"/>
          <rect x="60" y="175" width="18" height="45" fill="rgba(180,220,255,0.3)"/>
          <rect x="82" y="175" width="18" height="45" fill="rgba(180,220,255,0.3)"/>
          {/* Gold trim */}
          <rect x="20" y="16" width="120" height="6" fill={GOLD} opacity="0.8"/>
          <rect x="20" y="80" width="120" height="3" fill={GOLD} opacity="0.4"/>
          <rect x="20" y="120" width="120" height="3" fill={GOLD} opacity="0.4"/>
          <rect x="20" y="160" width="120" height="3" fill={GOLD} opacity="0.4"/>
          {/* Windows row 1 */}
          {[30,55,80,105,130].map((x,i)=>(
            <rect key={i} x={x} y="30" width="14" height="20" rx="1" fill={`rgba(255,${180+i*10},${50+i*8},${0.2+Math.random()*0.7})`} style={{animation:`hero_win ${2+i}s ease-in-out ${i*0.4}s infinite alternate`}}/>
          ))}
          {/* Windows row 2 */}
          {[30,55,80,105,130].map((x,i)=>(
            <rect key={i} x={x} y="60" width="14" height="20" rx="1" fill={`rgba(255,${190+i*5},${60+i*5},${0.15+Math.random()*0.75})`} style={{animation:`hero_win ${3+i}s ease-in-out ${i*0.3}s infinite alternate`}}/>
          ))}
          {/* Windows row 3 */}
          {[30,55,80,105,130].map((x,i)=>(
            <rect key={i} x={x} y="90" width="14" height="20" rx="1" fill={`rgba(255,${200+i*4},${70+i*5},${0.1+Math.random()*0.8})`} style={{animation:`hero_win ${2.5+i}s ease-in-out ${i*0.5}s infinite alternate`}}/>
          ))}
          {/* Windows row 4 */}
          {[30,55,80,105,130].map((x,i)=>(
            <rect key={i} x={x} y="125" width="14" height="20" rx="1" fill={`rgba(255,${175+i*8},${45+i*6},${0.2+Math.random()*0.65})`} style={{animation:`hero_win ${1.8+i}s ease-in-out ${i*0.35}s infinite alternate`}}/>
          ))}
          {/* Rooftop sign */}
          <rect x="45" y="8" width="70" height="14" rx="3" fill={GOLD} opacity="0.6"/>
          <text x="80" y="19" textAnchor="middle" fontSize="8" fill="rgba(26,20,10,0.9)" fontFamily="monospace" fontWeight="bold">ALVRYN HOTEL</text>
        </svg>
      </div>
      {/* Side buildings */}
      <div style={{position:"absolute",bottom:0,left:"8%",width:70,height:"38%",background:"rgba(20,15,35,0.8)",borderTop:"3px solid rgba(201,168,76,0.3)"}}/>
      <div style={{position:"absolute",bottom:0,right:"8%",width:80,height:"45%",background:"rgba(20,15,35,0.85)",borderTop:"3px solid rgba(201,168,76,0.3)"}}/>
      {/* Ground glow */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:30,background:`linear-gradient(transparent,rgba(201,168,76,0.12))`}}/>
    </div>
  );

  if(tab==="train") return(
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {/* Stars */}
      {Array.from({length:25},(_,i)=>(
        <div key={i} style={{position:"absolute",left:`${(i*97)%100}%`,top:`${(i*83)%55}%`,
          width:1.5,height:1.5,borderRadius:"50%",background:"rgba(200,170,255,0.7)",
          animation:`hero_twinkle ${1.3+i%3}s ease-in-out ${i*0.18}s infinite alternate`}}/>
      ))}
      {/* Dual tracks */}
      <div style={{position:"absolute",bottom:"26%",left:0,right:0,height:4,background:`linear-gradient(90deg,transparent,rgba(201,168,76,0.5),transparent)`}}/>
      <div style={{position:"absolute",bottom:"23%",left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)`}}/>
      {/* Track sleepers moving right→left */}
      <div style={{position:"absolute",bottom:"22%",left:0,right:0,overflow:"hidden",height:8}}>
        <div style={{display:"flex",gap:24,animation:"hero_track 1.2s linear infinite",width:"300%"}}>
          {Array.from({length:80},(_,i)=>(
            <div key={i} style={{width:8,height:8,background:"rgba(160,120,220,0.45)",borderRadius:1,flexShrink:0}}/>
          ))}
        </div>
      </div>
      {/* TRAIN — SVG facing LEFT (moves right→left) */}
      <div style={{position:"absolute",bottom:"25%",animation:"hero_train 9s linear 1s infinite"}}>
        <svg width="280" height="68" viewBox="0 0 280 68" fill="none">
          {/* Engine (front = left side since moving left) */}
          <rect x="210" y="8" width="64" height="36" rx="5" fill="#f0ece0" opacity="0.95"/>
          {/* Engine nose */}
          <path d="M274 14 L280 20 L280 32 L274 44 Z" fill={GOLD} opacity="0.9"/>
          {/* Headlight */}
          <rect x="275" y="22" width="4" height="10" rx="1" fill="rgba(255,240,160,0.95)"/>
          {/* Engine window */}
          <rect x="218" y="14" width="18" height="14" rx="2" fill="rgba(180,220,255,0.7)"/>
          <rect x="242" y="14" width="18" height="14" rx="2" fill="rgba(180,220,255,0.7)"/>
          {/* Carriage 1 */}
          <rect x="140" y="8" width="66" height="36" rx="2" fill="#ece8d8" opacity="0.9"/>
          <rect x="148" y="14" width="15" height="12" rx="1.5" fill="rgba(180,220,255,0.6)"/>
          <rect x="168" y="14" width="15" height="12" rx="1.5" fill="rgba(180,220,255,0.6)"/>
          <rect x="188" y="14" width="15" height="12" rx="1.5" fill="rgba(180,220,255,0.6)"/>
          {/* Carriage 2 */}
          <rect x="70" y="8" width="66" height="36" rx="2" fill="#e8e4d4" opacity="0.85"/>
          <rect x="78" y="14" width="15" height="12" rx="1.5" fill="rgba(180,220,255,0.6)"/>
          <rect x="98" y="14" width="15" height="12" rx="1.5" fill="rgba(180,220,255,0.6)"/>
          <rect x="118" y="14" width="15" height="12" rx="1.5" fill="rgba(180,220,255,0.6)"/>
          {/* Carriage 3 */}
          <rect x="4" y="8" width="62" height="36" rx="2" fill="#e4e0d0" opacity="0.8"/>
          <rect x="12" y="14" width="13" height="12" rx="1.5" fill="rgba(180,220,255,0.6)"/>
          <rect x="30" y="14" width="13" height="12" rx="1.5" fill="rgba(180,220,255,0.6)"/>
          <rect x="48" y="14" width="13" height="12" rx="1.5" fill="rgba(180,220,255,0.6)"/>
          {/* All wheels on track */}
          {[22,50,92,118,162,188,228,252].map((cx,i)=>(
            <g key={i}>
              <circle cx={cx} cy="48" r="9" fill="#1a1430" stroke="rgba(160,120,220,0.8)" strokeWidth="1.5"/>
              <circle cx={cx} cy="48" r="3" fill="rgba(160,120,220,0.6)"/>
            </g>
          ))}
          {/* Gold stripe */}
          <rect x="4" y="28" width="276" height="3" fill={GOLD} opacity="0.5"/>
        </svg>
        {/* Steam from engine */}
        {[0,1,2].map(i=>(
          <div key={i} style={{position:"absolute",top:-14-i*8,right:12+i*10,
            width:14-i*3,height:14-i*3,borderRadius:"50%",
            background:"rgba(255,255,255,0.18)",
            animation:`hero_steam 1.8s ease-out ${i*0.6}s infinite`}}/>
        ))}
      </div>
    </div>
  );

  if(tab==="cab") return(
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {/* City skyline silhouette */}
      <svg style={{position:"absolute",bottom:0,left:0,right:0,width:"100%",opacity:0.3}} height="120" viewBox="0 0 1000 120" preserveAspectRatio="none">
        <rect x="0" y="60" width="60" height="60" fill="#c9a84c"/>
        <rect x="80" y="30" width="70" height="90" fill="#c9a84c"/>
        <rect x="170" y="50" width="50" height="70" fill="#c9a84c"/>
        <rect x="240" y="15" width="80" height="105" fill="#c9a84c"/>
        <rect x="340" y="45" width="60" height="75" fill="#c9a84c"/>
        <rect x="420" y="25" width="75" height="95" fill="#c9a84c"/>
        <rect x="515" y="55" width="55" height="65" fill="#c9a84c"/>
        <rect x="590" y="20" width="80" height="100" fill="#c9a84c"/>
        <rect x="690" y="40" width="60" height="80" fill="#c9a84c"/>
        <rect x="770" y="10" width="85" height="110" fill="#c9a84c"/>
        <rect x="875" y="50" width="60" height="70" fill="#c9a84c"/>
        <rect x="950" y="35" width="50" height="85" fill="#c9a84c"/>
      </svg>
      {/* Road */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"28%",background:"rgba(20,15,5,0.7)"}}/>
      <div style={{position:"absolute",bottom:"13%",left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${GOLD}55,transparent)`}}/>
      {/* Road dashes → scrolling left */}
      <div style={{position:"absolute",bottom:"10%",left:0,right:0,overflow:"hidden",height:5}}>
        <div style={{display:"flex",gap:50,animation:"hero_road 1.2s linear infinite",width:"300%"}}>
          {Array.from({length:60},(_,i)=>(
            <div key={i} style={{width:35,height:3,background:GOLD,opacity:0.45,borderRadius:2,flexShrink:0}}/>
          ))}
        </div>
      </div>
      {/* Street lights */}
      {[10,30,52,72,92].map((l,i)=>(
        <div key={i} style={{position:"absolute",bottom:"25%",left:`${l}%`}}>
          <div style={{width:3,height:40,background:"rgba(201,168,76,0.6)",margin:"0 auto"}}/>
          <div style={{width:20,height:3,background:GOLD,opacity:0.7,marginLeft:-8.5,borderRadius:2}}/>
          <div style={{width:6,height:6,borderRadius:"50%",background:"rgba(255,230,150,0.8)",marginLeft:-1.5,marginTop:-2,boxShadow:"0 0 10px rgba(255,220,100,0.6)"}}/>
        </div>
      ))}
      {/* CAB — proper SVG facing RIGHT */}
      <div style={{position:"absolute",bottom:"26%",animation:"hero_bus 9s linear 0.5s infinite"}}>
        <svg width="130" height="60" viewBox="0 0 130 60" fill="none">
          {/* Body */}
          <rect x="12" y="20" width="106" height="24" rx="3" fill="#f5d020" opacity="0.95"/>
          {/* Roof */}
          <path d="M20 20 L30 6 L100 6 L110 20 Z" fill="#e8c010" opacity="0.95"/>
          {/* Front windshield */}
          <path d="M100 8 L108 20 L100 20 Z" fill="rgba(180,220,255,0.7)"/>
          {/* Rear windshield */}
          <path d="M30 8 L22 20 L30 20 Z" fill="rgba(180,220,255,0.7)"/>
          {/* Side windows */}
          <rect x="36" y="9" width="20" height="14" rx="2" fill="rgba(180,220,255,0.65)"/>
          <rect x="62" y="9" width="20" height="14" rx="2" fill="rgba(180,220,255,0.65)"/>
          {/* Headlight */}
          <ellipse cx="118" cy="28" rx="6" ry="4" fill="rgba(255,240,160,0.9)"/>
          {/* Tail light */}
          <rect x="10" y="26" width="4" height="8" rx="1" fill="rgba(220,50,50,0.8)"/>
          {/* TAXI sign on roof */}
          <rect x="50" y="2" width="30" height="8" rx="2" fill="rgba(0,0,0,0.5)"/>
          <text x="65" y="9" textAnchor="middle" fontSize="5" fill="rgba(255,220,0,0.9)" fontFamily="monospace" fontWeight="bold">TAXI</text>
          {/* Wheels */}
          <circle cx="32" cy="46" r="10" fill="#1a1a1a" stroke={GOLD} strokeWidth="1.5"/>
          <circle cx="32" cy="46" r="4" fill={GOLD} opacity="0.7"/>
          <circle cx="96" cy="46" r="10" fill="#1a1a1a" stroke={GOLD} strokeWidth="1.5"/>
          <circle cx="96" cy="46" r="4" fill={GOLD} opacity="0.7"/>
          <ellipse cx="32" cy="56" rx="11" ry="2.5" fill="rgba(0,0,0,0.3)"/>
          <ellipse cx="96" cy="56" rx="11" ry="2.5" fill="rgba(0,0,0,0.3)"/>
        </svg>
      </div>
    </div>
  );
  return null;
}

// ── POPULAR ROUTES DATA ────────────────────────────────────────────────────────
const POPULAR_FLIGHTS=[
  {from:"BLR",to:"DEL",fromN:"Bangalore",toN:"Delhi",price:"₹2,899",dur:"2h 45m",icon:"✈️"},
  {from:"BLR",to:"BOM",fromN:"Bangalore",toN:"Mumbai",price:"₹1,899",dur:"1h 45m",icon:"✈️"},
  {from:"BLR",to:"GOI",fromN:"Bangalore",toN:"Goa",price:"₹2,299",dur:"1h 10m",icon:"✈️"},
  {from:"BLR",to:"DXB",fromN:"Bangalore",toN:"Dubai",price:"₹12,499",dur:"3h 30m",icon:"✈️"},
  {from:"DEL",to:"BOM",fromN:"Delhi",toN:"Mumbai",price:"₹2,499",dur:"2h 10m",icon:"✈️"},
  {from:"BOM",to:"GOI",fromN:"Mumbai",toN:"Goa",price:"₹1,599",dur:"1h",icon:"✈️"},
];
const POPULAR_BUSES=[
  {from:"Bangalore",to:"Chennai",price:"₹550",dur:"5h 30m",ops:"VRL / KSRTC"},
  {from:"Bangalore",to:"Goa",price:"₹900",dur:"9h",ops:"Neeta Tours"},
  {from:"Bangalore",to:"Hyderabad",price:"₹799",dur:"8h",ops:"SRS Travels"},
  {from:"Bangalore",to:"Mumbai",price:"₹1,399",dur:"16h",ops:"VRL Travels"},
  {from:"Chennai",to:"Bangalore",price:"₹630",dur:"5h 30m",ops:"VRL / TNSTC"},
  {from:"Hyderabad",to:"Vijayawada",price:"₹350",dur:"4h",ops:"TSRTC"},
];
const POPULAR_TRAINS=[
  {from:"SBC",to:"MAS",fromN:"Bangalore",toN:"Chennai",price:"₹225",dur:"5h",train:"Shatabdi"},
  {from:"NDLS",to:"CSTM",fromN:"Delhi",toN:"Mumbai",price:"₹450",dur:"16h",train:"Rajdhani"},
  {from:"SBC",to:"YPR",fromN:"Bangalore",toN:"Delhi",price:"₹650",dur:"32h",train:"Karnataka Exp"},
  {from:"SBC",to:"ERS",fromN:"Bangalore",toN:"Kochi",price:"₹280",dur:"11h",train:"Island Exp"},
  {from:"HWH",to:"MAS",fromN:"Kolkata",toN:"Chennai",price:"₹550",dur:"26h",train:"Coromandel"},
  {from:"CSTM",to:"PUNE",fromN:"Mumbai",toN:"Pune",price:"₹85",dur:"3h",train:"Deccan Queen"},
];
const POPULAR_HOTELS=[
  {city:"Goa",type:"Beach Resort",price:"₹2,200",rating:"4.5",img:"🏖️"},
  {city:"Manali",type:"Mountain Stay",price:"₹1,800",rating:"4.3",img:"🏔️"},
  {city:"Bangalore",type:"Business Hotel",price:"₹2,800",rating:"4.4",img:"🏙️"},
  {city:"Jaipur",type:"Heritage Hotel",price:"₹2,500",rating:"4.6",img:"🏰"},
  {city:"Kerala",type:"Backwater Resort",price:"₹3,200",rating:"4.7",img:"🌴"},
  {city:"Dubai",type:"Luxury Hotel",price:"₹8,500",rating:"4.8",img:"🌆"},
];

const TIPS=[
  {icon:"💡",title:"Book early, save big",desc:"Booking flights 3-6 weeks early saves up to 40% on most Indian routes."},
  {icon:"📅",title:"Best days to fly",desc:"Tuesday & Wednesday flights are typically 15-25% cheaper than weekends."},
  {icon:"🌙",title:"Overnight buses = savings",desc:"Take an overnight sleeper bus — saves one night of accommodation!"},
  {icon:"⚡",title:"Use Alvryn AI",desc:"Type naturally and let AI plan your complete door-to-door trip instantly."},
];

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function SearchPage(){
  const navigate=useNavigate();
  const today=new Date().toISOString().split("T")[0];
  const [tab,setTab]=useState("flight");
  // Flight
  const [fromCity,setFromCity]=useState(FLIGHT_CITIES[0]);
  const [toCity,setToCity]=useState(FLIGHT_CITIES[1]);
  const [date,setDate]=useState("");
  const [returnDate,setReturnDate]=useState("");
  const [tripType,setTripType]=useState("oneway");
  const [passengers,setPassengers]=useState(1);
  const [cabinClass,setCabinClass]=useState("Economy");
  const [specialFare,setSpecialFare]=useState("regular");
  // Bus
  const [busFrom,setBusFrom]=useState("Bangalore");
  const [busTo,setBusTo]=useState("Chennai");
  const [busDate,setBusDate]=useState("");
  // Train
  const [trainFrom,setTrainFrom]=useState(TRAIN_CITIES[0]);
  const [trainTo,setTrainTo]=useState(TRAIN_CITIES[1]);
  const [trainDate,setTrainDate]=useState("");
  // Hotel
  const [hotelCity,setHotelCity]=useState("Goa");
  const [checkIn,setCheckIn]=useState("");
  const [checkOut,setCheckOut]=useState("");
  const [hotelGuests,setHotelGuests]=useState(1);
  const [hotelRooms,setHotelRooms]=useState(1);
  // Pickers
  const [showFromP,setShowFromP]=useState(false);
  const [showToP,setShowToP]=useState(false);
  const [showBusFromP,setShowBusFromP]=useState(false);
  const [showBusToP,setShowBusToP]=useState(false);
  const [showTrainFromP,setShowTrainFromP]=useState(false);
  const [showTrainToP,setShowTrainToP]=useState(false);
  const [showHotelP,setShowHotelP]=useState(false);

  useEffect(()=>{fetch(`${API}/test`).catch(()=>{});const t=setInterval(()=>fetch(`${API}/test`).catch(()=>{}),14*60*1000);return()=>clearInterval(t);},[]);

  let user={};try{user=JSON.parse(localStorage.getItem("user")||"{}");}catch{}
  const H=HERO_STYLES[tab];

  const handleSearch=()=>{
    if(tab==="flight"){window.open(buildFlightLink(fromCity.code,toCity.code,date,passengers,cabinClass,specialFare),"_blank","noopener,noreferrer");}
    else if(tab==="bus"){window.open(buildBusLink(busFrom,busTo,busDate),"_blank","noopener,noreferrer");}
    else if(tab==="train"){window.open(buildTrainLink(trainFrom.city,trainTo.city,trainDate),"_blank","noopener,noreferrer");}
    else if(tab==="hotel"){window.open(buildHotelLink(hotelCity,checkIn,checkOut,hotelGuests,hotelRooms),"_blank","noopener,noreferrer");}
  };

  const CountBtn=({val,set,min=1,max=9})=>(
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <button onClick={()=>set(v=>Math.max(min,v-1))} style={{width:30,height:30,borderRadius:"50%",background:"rgba(201,168,76,0.15)",border:`1.5px solid ${GOLD}`,color:GOLD_DARK,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,lineHeight:1}}>−</button>
      <span style={{fontFamily:"'Space Mono',monospace",fontSize:18,fontWeight:700,color:"#1a1410",minWidth:22,textAlign:"center"}}>{val}</span>
      <button onClick={()=>set(v=>Math.min(max,v+1))} style={{width:30,height:30,borderRadius:"50%",background:"rgba(201,168,76,0.15)",border:`1.5px solid ${GOLD}`,color:GOLD_DARK,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,lineHeight:1}}>+</button>
    </div>
  );

  const SPECIAL_FARES=[
    {id:"regular",label:"Regular",desc:"Regular fares"},
    {id:"student",label:"Student",desc:"Extra discounts"},
    {id:"senior",label:"Senior Citizen",desc:"Up to ₹600 off"},
    {id:"armed",label:"Armed Forces",desc:"Up to ₹600 off"},
    {id:"doctor",label:"Doctor / Nurse",desc:"Up to ₹600 off"},
  ];

  const inp={background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#1a1410",width:"100%",cursor:"pointer"};
  const box={background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",border:"1px solid rgba(201,168,76,0.25)",borderRadius:12,padding:"12px 16px",transition:"border-color 0.2s"};

  return(
    <div style={{minHeight:"100vh",background:"#faf8f4",fontFamily:"'DM Sans',sans-serif",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;600;700&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.4);border-radius:2px;}
        @keyframes hero_twinkle{from{opacity:0.2;transform:scale(0.7);}to{opacity:1;transform:scale(1.2);}}
        @keyframes hero_cloud{0%{left:110%;}100%{left:-300px;}}
        @keyframes hero_fly{0%{left:-140px;top:36%;opacity:0;}5%{opacity:1;}50%{top:28%;}95%{opacity:1;}100%{left:calc(100vw+140px);top:36%;opacity:0;}}
        @keyframes hero_fly2{0%{left:-90px;opacity:0;}5%{opacity:1;}100%{left:calc(100vw+90px);opacity:0;}}
        @keyframes hero_road{0%{transform:translateX(0);}100%{transform:translateX(-180px);}}
        @keyframes hero_track{0%{transform:translateX(0);}100%{transform:translateX(96px);}}
        @keyframes hero_sway{0%{transform:rotate(-2deg);}100%{transform:rotate(2deg);}}
        @keyframes hero_bus{0%{left:-200px;opacity:0;}5%{opacity:1;}95%{opacity:1;}100%{left:calc(100vw+20px);opacity:0;}}
        @keyframes hero_train{0%{right:-300px;opacity:0;}5%{opacity:1;}95%{opacity:1;}100%{right:calc(100vw+20px);opacity:0;}}
        @keyframes hero_steam{0%{opacity:0.6;transform:translateY(0) scale(1);}100%{opacity:0;transform:translateY(-35px) scale(2.5);}}
        @keyframes hero_moon{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        @keyframes hero_win{from{opacity:0.15;}to{opacity:0.95;}}
        @keyframes hero_gradShift{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
        @keyframes hero_fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes hero_float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        @keyframes hero_pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0);}50%{box-shadow:0 0 0 8px rgba(201,168,76,0.15);}}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.4) sepia(1) saturate(3) hue-rotate(5deg);cursor:pointer;}
        .sp_tab_btn{transition:all 0.2s;cursor:pointer;border:none;background:transparent;}
        .sp_tab_btn:hover{background:rgba(201,168,76,0.15)!important;}
        .sp_city_btn:hover{border-color:rgba(201,168,76,0.6)!important;background:rgba(201,168,76,0.08)!important;}
        .sp_route_card:hover{transform:translateY(-4px)!important;box-shadow:0 12px 32px rgba(0,0,0,0.12)!important;}
        .sp_search_btn:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(201,168,76,0.55)!important;}
      `}</style>

      {/* PICKERS */}
      {showFromP&&<CityPickerModal tabId="flight" label="Departure City" exclude={toCity.code} onSelect={c=>{setFromCity(c);setShowFromP(false);}} onClose={()=>setShowFromP(false)}/>}
      {showToP&&<CityPickerModal tabId="flight" label="Destination City" exclude={fromCity.code} onSelect={c=>{setToCity(c);setShowToP(false);}} onClose={()=>setShowToP(false)}/>}
      {showBusFromP&&<CityPickerModal tabId="bus" label="Departure City" exclude={busTo} onSelect={c=>{setBusFrom(c);setShowBusFromP(false);}} onClose={()=>setShowBusFromP(false)}/>}
      {showBusToP&&<CityPickerModal tabId="bus" label="Destination City" exclude={busFrom} onSelect={c=>{setBusTo(c);setShowBusToP(false);}} onClose={()=>setShowBusToP(false)}/>}
      {showTrainFromP&&<CityPickerModal tabId="train" label="From Station" exclude={trainTo.city} onSelect={c=>{setTrainFrom(c);setShowTrainFromP(false);}} onClose={()=>setShowTrainFromP(false)}/>}
      {showTrainToP&&<CityPickerModal tabId="train" label="To Station" exclude={trainFrom.city} onSelect={c=>{setTrainTo(c);setShowTrainToP(false);}} onClose={()=>setShowTrainToP(false)}/>}
      {showHotelP&&<CityPickerModal tabId="hotel" label="City / Destination" onSelect={c=>{setHotelCity(c);setShowHotelP(false);}} onClose={()=>setShowHotelP(false)}/>}

      {/* ══ HERO SECTION ══ */}
      <div style={{position:"relative",minHeight:"92vh",background:H.bg,backgroundSize:"200% 200%",animation:"hero_gradShift 8s ease infinite",overflow:"hidden",transition:"background 0.8s ease"}}>
        <HeroScene tab={tab}/>
        {/* Overlay */}
        <div style={{position:"absolute",inset:0,background:H.overlay,transition:"background 0.6s ease"}}/>
        {/* Bottom fade to cream */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:"linear-gradient(transparent,#faf8f4)"}}/>

        {/* NAV */}
        <nav style={{position:"relative",zIndex:10,padding:"16px 5%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>navigate("/")}>
            <div style={{animation:"hero_float 4s ease-in-out infinite"}}><AlvrynIcon size={38}/></div>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:"#fff",letterSpacing:"0.12em",textShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>ALVRYN</div>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:GOLD,letterSpacing:"0.2em"}}>TRAVEL BEYOND</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>navigate("/ai")} style={{padding:"8px 16px",background:"rgba(201,168,76,0.22)",border:"1.5px solid rgba(201,168,76,0.5)",borderRadius:10,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer",backdropFilter:"blur(8px)"}}>🤖 AI Chat</button>
            <button onClick={()=>navigate("/profile")} style={{padding:"8px 14px",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:10,color:"rgba(255,255,255,0.9)",fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer",backdropFilter:"blur(8px)"}}>Profile</button>
            <button onClick={()=>{localStorage.removeItem("token");localStorage.removeItem("user");navigate("/login");}} style={{padding:"8px 14px",background:"rgba(220,50,50,0.15)",border:"1px solid rgba(220,80,80,0.3)",borderRadius:10,color:"rgba(255,150,150,0.9)",fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer",backdropFilter:"blur(8px)"}}>Sign Out</button>
          </div>
        </nav>

        {/* HERO TEXT */}
        <div style={{position:"relative",zIndex:2,padding:"20px 5% 0",animation:"hero_fadeUp 0.6s both"}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:GOLD,letterSpacing:"0.22em",marginBottom:6,textShadow:"0 1px 4px rgba(0,0,0,0.5)"}}>✦ SEARCH TRAVEL</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:"clamp(28px,5vw,56px)",color:"#fff",marginBottom:4,textShadow:"0 2px 12px rgba(0,0,0,0.4)",lineHeight:1.1}}>
            Hey {user.name?.split(" ")[0]||"Traveller"} 👋
          </h1>
          <p style={{fontSize:16,color:"rgba(255,255,255,0.7)",marginBottom:6}}>{H.tagline}</p>
        </div>

        {/* SEARCH CARD */}
        <div style={{position:"relative",zIndex:2,maxWidth:900,margin:"16px auto 0",padding:"0 5%"}}>

          {/* TAB BAR */}
          <div style={{display:"flex",background:"rgba(255,255,255,0.18)",backdropFilter:"blur(12px)",borderRadius:"16px 16px 0 0",overflow:"hidden",border:"1px solid rgba(255,255,255,0.2)",borderBottom:"none"}}>
            {[
              {id:"flight",icon:"✈️",label:"Flights"},
              {id:"bus",icon:"🚌",label:"Buses"},
              {id:"hotel",icon:"🏨",label:"Hotels"},
              {id:"train",icon:"🚂",label:"Trains"},
              {id:"cab",icon:"🚖",label:"Cabs",soon:true},
            ].map((t,i)=>(
              <button key={t.id} className="sp_tab_btn" onClick={()=>setTab(t.id)}
                style={{flex:1,padding:"13px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                  borderRadius:0,
                  background:tab===t.id?"rgba(255,255,255,0.95)":"transparent",
                  borderBottom:tab===t.id?`3px solid ${GOLD}`:"3px solid transparent",
                  color:tab===t.id?GOLD_DARK:"rgba(255,255,255,0.8)",
                  fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,
                  transition:"all 0.2s",whiteSpace:"nowrap"}}>
                <span style={{fontSize:20,transition:"transform 0.2s",transform:tab===t.id?"scale(1.15)":"scale(1)"}}>{t.icon}</span>
                <span>{t.label}</span>
                {t.soon&&<span style={{fontSize:7,background:"rgba(201,168,76,0.2)",color:GOLD,padding:"1px 5px",borderRadius:6,border:`1px solid ${GOLD}55`}}>SOON</span>}
              </button>
            ))}
          </div>

          {/* FORM CARD */}
          <div style={{background:"rgba(255,255,255,0.97)",backdropFilter:"blur(20px)",borderRadius:"0 0 20px 20px",padding:"24px 22px",boxShadow:"0 16px 48px rgba(0,0,0,0.14)",border:"1px solid rgba(201,168,76,0.15)",borderTop:"none"}}>

            {/* ── FLIGHT FORM ── */}
            {tab==="flight"&&(<>
              <div style={{display:"flex",gap:6,marginBottom:18,background:"rgba(201,168,76,0.08)",borderRadius:10,padding:4}}>
                {["oneway","roundtrip"].map(t=>(
                  <button key={t} onClick={()=>setTripType(t)} style={{flex:1,padding:"8px",border:"none",borderRadius:7,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:500,cursor:"pointer",transition:"all 0.2s",background:tripType===t?"#fff":"transparent",color:tripType===t?GOLD_DARK:"#888",boxShadow:tripType===t?"0 2px 8px rgba(0,0,0,0.08)":"none"}}>
                    {t==="oneway"?"One Way":"Round Trip"}
                  </button>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"center",marginBottom:14}}>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>From</div>
                  <div className="sp_city_btn" onClick={()=>setShowFromP(true)} style={{...box,cursor:"pointer"}}>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:26,fontWeight:700,color:"#1a1410",lineHeight:1}}>{fromCity.code}</div>
                    <div style={{fontSize:12,color:"#888",marginTop:3}}>{fromCity.name}</div>
                    <div style={{fontSize:10,color:"#bbb",marginTop:1}}>{fromCity.full}</div>
                  </div>
                </div>
                <button onClick={()=>{const t=fromCity;setFromCity(toCity);setToCity(t);}} style={{width:38,height:38,borderRadius:"50%",background:GRAD,border:"none",color:"#1a1410",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 12px rgba(201,168,76,0.4)`,marginTop:20,transition:"transform 0.3s"}} onMouseEnter={e=>e.currentTarget.style.transform="rotate(180deg)"} onMouseLeave={e=>e.currentTarget.style.transform="rotate(0)"}>⇄</button>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>To</div>
                  <div className="sp_city_btn" onClick={()=>setShowToP(true)} style={{...box,cursor:"pointer"}}>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:26,fontWeight:700,color:"#1a1410",lineHeight:1}}>{toCity.code}</div>
                    <div style={{fontSize:12,color:"#888",marginTop:3}}>{toCity.name}</div>
                    <div style={{fontSize:10,color:"#bbb",marginTop:1}}>{toCity.full}</div>
                  </div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:tripType==="roundtrip"?"1fr 1fr 1fr 1fr":"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Departure *</div>
                  <div style={box}><input type="date" value={date} min={today} onChange={e=>setDate(e.target.value)} style={inp}/></div>
                </div>
                {tripType==="roundtrip"&&<div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Return</div>
                  <div style={box}><input type="date" value={returnDate} min={date||today} onChange={e=>setReturnDate(e.target.value)} style={inp}/></div>
                </div>}
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Travellers</div>
                  <div style={box}><CountBtn val={passengers} set={setPassengers}/></div>
                </div>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Class</div>
                  <div style={box}>
                    <select value={cabinClass} onChange={e=>setCabinClass(e.target.value)} style={{...inp,color:"#1a1410"}}>
                      {["Economy","Premium Economy","Business","First Class"].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              {/* Special Fares */}
              <div style={{marginBottom:18}}>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:8,textTransform:"uppercase"}}>Special Fares</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {SPECIAL_FARES.map(sf=>(
                    <button key={sf.id} onClick={()=>setSpecialFare(sf.id)} style={{padding:"8px 14px",borderRadius:10,fontSize:12,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",border:specialFare===sf.id?`1.5px solid ${GOLD}`:"1.5px solid rgba(0,0,0,0.1)",background:specialFare===sf.id?`rgba(201,168,76,0.12)`:"#fafaf8",color:specialFare===sf.id?GOLD_DARK:"#555",transition:"all 0.18s",fontWeight:specialFare===sf.id?600:400}}>
                      <div>{sf.label}</div>
                      <div style={{fontSize:10,color:specialFare===sf.id?GOLD:"#aaa",marginTop:2}}>{sf.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <button className="sp_search_btn" onClick={handleSearch} style={{width:"100%",padding:"16px",borderRadius:13,fontSize:16,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",color:"#1a1410",border:"none",cursor:"pointer",background:GRAD,backgroundSize:"200% 200%",animation:"hero_gradShift 4s ease infinite",boxShadow:`0 8px 28px rgba(201,168,76,0.42)`,transition:"transform 0.2s,box-shadow 0.2s"}}>
                Search Flights ✈
              </button>
              <p style={{textAlign:"center",fontSize:11,color:"#bbb",marginTop:10}}>Best fares on our partner site · Prices may vary</p>
            </>)}

            {/* ── BUS FORM ── */}
            {tab==="bus"&&(<>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"center",marginBottom:14}}>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>From</div>
                  <div className="sp_city_btn" onClick={()=>setShowBusFromP(true)} style={{...box,cursor:"pointer"}}>
                    <div style={{fontSize:18,fontWeight:700,color:"#1a1410"}}>{busFrom}</div>
                    <div style={{fontSize:11,color:"#bbb",marginTop:3}}>Tap to change</div>
                  </div>
                </div>
                <button onClick={()=>{const t=busFrom;setBusFrom(busTo);setBusTo(t);}} style={{width:38,height:38,borderRadius:"50%",background:GRAD,border:"none",color:"#1a1410",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 12px rgba(201,168,76,0.4)`,marginTop:20,transition:"transform 0.3s"}} onMouseEnter={e=>e.currentTarget.style.transform="rotate(180deg)"} onMouseLeave={e=>e.currentTarget.style.transform="rotate(0)"}>⇄</button>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>To</div>
                  <div className="sp_city_btn" onClick={()=>setShowBusToP(true)} style={{...box,cursor:"pointer"}}>
                    <div style={{fontSize:18,fontWeight:700,color:"#1a1410"}}>{busTo}</div>
                    <div style={{fontSize:11,color:"#bbb",marginTop:3}}>Tap to change</div>
                  </div>
                </div>
              </div>
              <div style={{marginBottom:18}}>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Date of Journey *</div>
                <div style={box}><input type="date" value={busDate} min={today} onChange={e=>setBusDate(e.target.value)} style={{...inp,fontSize:15}}/></div>
              </div>
              <button className="sp_search_btn" onClick={handleSearch} style={{width:"100%",padding:"16px",borderRadius:13,fontSize:16,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",color:"#1a1410",border:"none",cursor:"pointer",background:GRAD,backgroundSize:"200% 200%",animation:"hero_gradShift 4s ease infinite",boxShadow:`0 8px 28px rgba(201,168,76,0.42)`,transition:"transform 0.2s,box-shadow 0.2s"}}>
                Search Buses 🚌
              </button>
              <p style={{textAlign:"center",fontSize:11,color:"#bbb",marginTop:10}}>Live seats & prices on RedBus</p>
            </>)}

            {/* ── HOTEL FORM ── */}
            {tab==="hotel"&&(<>
              <div style={{marginBottom:14}}>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Destination</div>
                <div className="sp_city_btn" onClick={()=>setShowHotelP(true)} style={{...box,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:22}}>🏨</span>
                    <div>
                      <div style={{fontSize:17,fontWeight:700,color:"#1a1410"}}>{hotelCity}</div>
                      <div style={{fontSize:11,color:"#bbb",marginTop:2}}>Tap to change city</div>
                    </div>
                  </div>
                  <span style={{color:"#bbb",fontSize:18}}>›</span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Check-In *</div>
                  <div style={box}><input type="date" value={checkIn} min={today} onChange={e=>setCheckIn(e.target.value)} style={{...inp,fontSize:14}}/></div>
                </div>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Check-Out</div>
                  <div style={box}><input type="date" value={checkOut} min={checkIn||today} onChange={e=>setCheckOut(e.target.value)} style={{...inp,fontSize:14}}/></div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Guests</div>
                  <div style={box}><CountBtn val={hotelGuests} set={setHotelGuests} max={10}/></div>
                </div>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Rooms</div>
                  <div style={box}><CountBtn val={hotelRooms} set={setHotelRooms} max={10}/></div>
                </div>
              </div>
              <button className="sp_search_btn" onClick={handleSearch} style={{width:"100%",padding:"16px",borderRadius:13,fontSize:16,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",color:"#1a1410",border:"none",cursor:"pointer",background:GRAD,backgroundSize:"200% 200%",animation:"hero_gradShift 4s ease infinite",boxShadow:`0 8px 28px rgba(201,168,76,0.42)`,transition:"transform 0.2s,box-shadow 0.2s"}}>
                Search Hotels 🏨
              </button>
              <p style={{textAlign:"center",fontSize:11,color:"#bbb",marginTop:10}}>Best prices on Booking.com</p>
            </>)}

            {/* ── TRAIN FORM ── */}
            {tab==="train"&&(<>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"center",marginBottom:14}}>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>From Station</div>
                  <div className="sp_city_btn" onClick={()=>setShowTrainFromP(true)} style={{...box,cursor:"pointer"}}>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:18,fontWeight:700,color:"#1a1410"}}>{trainFrom.code}</div>
                    <div style={{fontSize:12,color:"#888",marginTop:3}}>{trainFrom.city}</div>
                  </div>
                </div>
                <button onClick={()=>{const t=trainFrom;setTrainFrom(trainTo);setTrainTo(t);}} style={{width:38,height:38,borderRadius:"50%",background:GRAD,border:"none",color:"#1a1410",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 12px rgba(201,168,76,0.4)`,marginTop:20,transition:"transform 0.3s"}} onMouseEnter={e=>e.currentTarget.style.transform="rotate(180deg)"} onMouseLeave={e=>e.currentTarget.style.transform="rotate(0)"}>⇄</button>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>To Station</div>
                  <div className="sp_city_btn" onClick={()=>setShowTrainToP(true)} style={{...box,cursor:"pointer"}}>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:18,fontWeight:700,color:"#1a1410"}}>{trainTo.code}</div>
                    <div style={{fontSize:12,color:"#888",marginTop:3}}>{trainTo.city}</div>
                  </div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Journey Date</div>
                  <div style={box}><input type="date" value={trainDate} min={today} onChange={e=>setTrainDate(e.target.value)} style={{...inp,fontSize:14}}/></div>
                </div>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#888",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Class</div>
                  <div style={box}>
                    <select style={{...inp,color:"#1a1410"}}>
                      <option>SL - Sleeper</option>
                      <option>3A - AC 3 Tier</option>
                      <option>2A - AC 2 Tier</option>
                      <option>1A - AC First Class</option>
                      <option>CC - Chair Car</option>
                    </select>
                  </div>
                </div>
              </div>
              <button className="sp_search_btn" onClick={handleSearch} style={{width:"100%",padding:"16px",borderRadius:13,fontSize:16,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",color:"#1a1410",border:"none",cursor:"pointer",background:GRAD,backgroundSize:"200% 200%",animation:"hero_gradShift 4s ease infinite",boxShadow:`0 8px 28px rgba(201,168,76,0.42)`,transition:"transform 0.2s,box-shadow 0.2s"}}>
                Search Trains 🚂
              </button>
              <p style={{textAlign:"center",fontSize:11,color:"#bbb",marginTop:10}}>Via RedBus Railways · IRCTC authorised partner</p>
            </>)}

            {/* ── CAB ── */}
            {tab==="cab"&&(
              <div style={{textAlign:"center",padding:"40px 20px"}}>
                <div style={{fontSize:52,marginBottom:14,animation:"hero_float 3s ease-in-out infinite"}}>🚖</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:"#1a1410",marginBottom:8}}>Cab Booking</div>
                <div style={{fontSize:14,color:"#888",lineHeight:1.7,maxWidth:320,margin:"0 auto 20px"}}>Airport transfers and intercity cabs — coming very soon!</div>
                <div style={{display:"inline-block",background:`rgba(201,168,76,0.1)`,border:`1px solid ${GOLD}55`,color:GOLD_DARK,padding:"8px 20px",borderRadius:20,fontSize:12,fontFamily:"'Space Mono',monospace",letterSpacing:"0.8px"}}>✦ Coming Soon</div>
                <div style={{marginTop:16,fontSize:13,color:"#aaa"}}>Meanwhile, use <span style={{color:GOLD_DARK,cursor:"pointer",fontWeight:600}} onClick={()=>navigate("/ai")}>Alvryn AI</span> to plan your complete door-to-door trip!</div>
              </div>
            )}
          </div>
        </div>

        {/* AI BANNER */}
        <div style={{position:"relative",zIndex:2,maxWidth:900,margin:"16px auto 0",padding:"0 5%",paddingBottom:40}}>
          <div onClick={()=>navigate("/ai")} style={{background:"rgba(255,255,255,0.15)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:14,padding:"14px 20px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.22)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.15)"}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:22}}>🤖</span>
              <div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#fff"}}>Plan with Alvryn AI — Complete door-to-door trip planning</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.65)",marginTop:2}}>Any language · Any destination worldwide · Understands everything you say</div>
              </div>
            </div>
            <span style={{color:GOLD,fontSize:14,fontWeight:600,whiteSpace:"nowrap",marginLeft:12}}>Chat now →</span>
          </div>
        </div>
      </div>

      {/* ══ BELOW FOLD — SCROLLABLE CONTENT ══ */}
      <div style={{background:"#faf8f4",padding:"48px 5% 80px",maxWidth:1100,margin:"0 auto"}}>

        {/* POPULAR ROUTES SECTION */}
        <div style={{marginBottom:52}}>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:20}}>
            <div>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:GOLD_DARK,letterSpacing:"0.2em",marginBottom:6}}>
                {tab==="flight"?"✈️ TRENDING FLIGHTS":tab==="bus"?"🚌 POPULAR BUS ROUTES":tab==="train"?"🚂 POPULAR TRAINS":"🏨 TOP DESTINATIONS"}
              </div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:"clamp(20px,3vw,32px)",color:"#1a1410"}}>
                {tab==="flight"?"Popular Flights This Week":tab==="bus"?"Top Bus Routes":tab==="train"?"Trending Train Routes":"Top Hotel Destinations"}
              </h2>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
            {(tab==="flight"?POPULAR_FLIGHTS:tab==="bus"?POPULAR_BUSES:tab==="train"?POPULAR_TRAINS:POPULAR_HOTELS).map((r,i)=>(
              <div key={i} className="sp_route_card" onClick={()=>{
                if(tab==="flight"){setFromCity(FLIGHT_CITIES.find(c=>c.code===r.from)||FLIGHT_CITIES[0]);setToCity(FLIGHT_CITIES.find(c=>c.code===r.to)||FLIGHT_CITIES[1]);window.scrollTo({top:0,behavior:"smooth"});}
                else if(tab==="bus"){setBusFrom(r.from);setBusTo(r.to);window.scrollTo({top:0,behavior:"smooth"});}
                else if(tab==="train"){setTrainFrom(TRAIN_CITIES.find(c=>c.code===r.from)||TRAIN_CITIES[0]);setTrainTo(TRAIN_CITIES.find(c=>c.code===r.to)||TRAIN_CITIES[1]);window.scrollTo({top:0,behavior:"smooth"});}
                else{setHotelCity(r.city);window.scrollTo({top:0,behavior:"smooth"});}
              }}
                style={{background:"#fff",borderRadius:16,padding:"18px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.07)",border:"1px solid rgba(201,168,76,0.12)",cursor:"pointer",transition:"transform 0.2s,box-shadow 0.2s"}}>
                {tab==="hotel"?(
                  <>
                    <div style={{fontSize:28,marginBottom:10}}>{r.img}</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:"#1a1410",marginBottom:4}}>{r.city}</div>
                    <div style={{fontSize:12,color:"#888",marginBottom:8}}>{r.type}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:GOLD_DARK}}>from {r.price}<span style={{fontSize:11,color:"#aaa",fontFamily:"'DM Sans',sans-serif"}}>/night</span></div>
                      <div style={{fontSize:12,color:"#22c55e",fontWeight:600}}>⭐ {r.rating}</div>
                    </div>
                  </>
                ):(
                  <>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:"#1a1410"}}>{r.fromN||r.from}</div>
                        <div style={{fontSize:11,color:"#bbb",marginTop:1}}>→ {r.toN||r.to}</div>
                      </div>
                      <div style={{fontSize:20}}>{tab==="flight"?"✈️":tab==="bus"?"🚌":"🚂"}</div>
                    </div>
                    {(r.train||r.ops)&&<div style={{fontSize:11,color:"#888",marginBottom:8}}>{r.train||r.ops}</div>}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:GOLD_DARK}}>from {r.price}</div>
                      <div style={{fontSize:11,color:"#888"}}>{r.dur}</div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TRAVEL TIPS */}
        <div style={{marginBottom:52}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:GOLD_DARK,letterSpacing:"0.2em",marginBottom:6}}>💡 SMART TRAVEL</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:"clamp(20px,3vw,32px)",color:"#1a1410",marginBottom:20}}>Tips to Save More</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
            {TIPS.map((t,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:16,padding:"20px 18px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:"1px solid rgba(201,168,76,0.1)"}}>
                <div style={{fontSize:28,marginBottom:12}}>{t.icon}</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:15,color:"#1a1410",marginBottom:8}}>{t.title}</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#666",lineHeight:1.65}}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* WHY ALVRYN */}
        <div style={{background:"linear-gradient(135deg,#1a1205,#2d1e08)",borderRadius:24,padding:"40px 36px",marginBottom:32,boxShadow:"0 8px 32px rgba(0,0,0,0.15)"}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:GOLD,letterSpacing:"0.22em",marginBottom:10}}>WHY ALVRYN</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:"clamp(22px,3.5vw,40px)",color:"#fff",marginBottom:8}}>Travel smarter with AI</h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"rgba(255,255,255,0.55)",maxWidth:460,margin:"0 auto"}}>Alvryn combines intelligent search with AI trip planning — no other platform does both.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16}}>
            {[
              {icon:"🤖",title:"AI Trip Planner",desc:"Complete door-to-door plans in seconds — any language, any destination."},
              {icon:"✈️",title:"60+ Destinations",desc:"Flights to major Indian cities and international destinations."},
              {icon:"🛡️",title:"Safety Insights",desc:"Proactive safety info for every destination you mention."},
              {icon:"💰",title:"Best Fares",desc:"Trusted partner prices — no hidden fees, no markup from Alvryn."},
              {icon:"🚌",title:"300+ Bus Routes",desc:"AC sleeper and seater buses across India via RedBus."},
              {icon:"🔒",title:"Secure Booking",desc:"All payments on official partner sites — 256-bit SSL secured."},
            ].map((f,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.06)",backdropFilter:"blur(8px)",borderRadius:14,padding:"18px 16px",border:"1px solid rgba(201,168,76,0.18)"}}>
                <div style={{fontSize:26,marginBottom:10}}>{f.icon}</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,color:"#fff",marginBottom:6}}>{f.title}</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>{f.desc}</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:28}}>
            <button onClick={()=>navigate("/ai")} style={{padding:"14px 36px",borderRadius:13,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",color:"#1a1410",border:"none",cursor:"pointer",background:GRAD,backgroundSize:"200% 200%",animation:"hero_gradShift 4s ease infinite",boxShadow:`0 8px 28px rgba(201,168,76,0.45)`}}>
              Try Alvryn AI Free →
            </button>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <div style={{textAlign:"center",fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#bbb",lineHeight:1.7}}>
          Alvryn is a travel discovery platform. We may earn a commission from partner links at no extra cost to you.<br/>
          Flights via Aviasales · Buses & Trains via RedBus · Hotels via Booking.com
        </div>
      </div>
    </div>
  );
}
