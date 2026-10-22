export type CountryOption = { name: string; code: string; region: string };

const groupedCountries: Array<[string, string]> = [
  ["North America", "AG:Antigua and Barbuda,BS:Bahamas,BB:Barbados,BZ:Belize,CA:Canada,CR:Costa Rica,CU:Cuba,DM:Dominica,DO:Dominican Republic,SV:El Salvador,GD:Grenada,GT:Guatemala,HT:Haiti,HN:Honduras,JM:Jamaica,MX:Mexico,NI:Nicaragua,PA:Panama,KN:Saint Kitts and Nevis,LC:Saint Lucia,VC:Saint Vincent and the Grenadines,TT:Trinidad and Tobago,US:United States,PM:Saint Pierre and Miquelon,GL:Greenland"],
  ["South America", "AR:Argentina,BO:Bolivia,BR:Brazil,CL:Chile,CO:Colombia,EC:Ecuador,GY:Guyana,PY:Paraguay,PE:Peru,SR:Suriname,UY:Uruguay,VE:Venezuela,GF:French Guiana"],
  ["Europe", "AL:Albania,AD:Andorra,AT:Austria,BY:Belarus,BE:Belgium,BA:Bosnia and Herzegovina,BG:Bulgaria,HR:Croatia,CY:Cyprus,CZ:Czechia,DK:Denmark,EE:Estonia,FI:Finland,FR:France,DE:Germany,GR:Greece,HU:Hungary,IS:Iceland,IE:Ireland,IT:Italy,XK:Kosovo,LV:Latvia,LI:Liechtenstein,LT:Lithuania,LU:Luxembourg,MT:Malta,MD:Moldova,MC:Monaco,ME:Montenegro,NL:Netherlands,MK:North Macedonia,NO:Norway,PL:Poland,PT:Portugal,RO:Romania,RU:Russia,SM:San Marino,RS:Serbia,SK:Slovakia,SI:Slovenia,ES:Spain,SE:Sweden,CH:Switzerland,UA:Ukraine,GB:United Kingdom,VA:Vatican City,FO:Faroe Islands,GI:Gibraltar"],
  ["Middle East", "BH:Bahrain,IR:Iran,IQ:Iraq,IL:Israel,JO:Jordan,KW:Kuwait,LB:Lebanon,OM:Oman,PS:Palestine,QA:Qatar,SA:Saudi Arabia,SY:Syria,TR:Türkiye,AE:United Arab Emirates,YE:Yemen"],
  ["Africa", "DZ:Algeria,AO:Angola,BJ:Benin,BW:Botswana,BF:Burkina Faso,BI:Burundi,CV:Cabo Verde,CM:Cameroon,CF:Central African Republic,TD:Chad,KM:Comoros,CG:Congo,CD:Democratic Republic of the Congo,CI:Côte d’Ivoire,DJ:Djibouti,EG:Egypt,GQ:Equatorial Guinea,ER:Eritrea,SZ:Eswatini,ET:Ethiopia,GA:Gabon,GM:Gambia,GH:Ghana,GN:Guinea,GW:Guinea-Bissau,KE:Kenya,LS:Lesotho,LR:Liberia,LY:Libya,MG:Madagascar,MW:Malawi,ML:Mali,MR:Mauritania,MU:Mauritius,MA:Morocco,MZ:Mozambique,NA:Namibia,NE:Niger,NG:Nigeria,RW:Rwanda,ST:Sao Tome and Principe,SN:Senegal,SC:Seychelles,SL:Sierra Leone,SO:Somalia,ZA:South Africa,SS:South Sudan,SD:Sudan,TZ:Tanzania,TG:Togo,TN:Tunisia,UG:Uganda,ZM:Zambia,ZW:Zimbabwe,RE:Réunion,YT:Mayotte"],
  ["Asia Pacific", "AF:Afghanistan,AM:Armenia,AZ:Azerbaijan,BD:Bangladesh,BT:Bhutan,BN:Brunei,KH:Cambodia,CN:China,GE:Georgia,IN:India,ID:Indonesia,JP:Japan,KZ:Kazakhstan,KG:Kyrgyzstan,LA:Laos,MY:Malaysia,MV:Maldives,MN:Mongolia,MM:Myanmar,NP:Nepal,KP:North Korea,PK:Pakistan,PH:Philippines,KR:South Korea,SG:Singapore,LK:Sri Lanka,TW:Taiwan,TJ:Tajikistan,TH:Thailand,TL:Timor-Leste,TM:Turkmenistan,UZ:Uzbekistan,VN:Vietnam,AU:Australia,FJ:Fiji,KI:Kiribati,MH:Marshall Islands,FM:Micronesia,NR:Nauru,NZ:New Zealand,PW:Palau,PG:Papua New Guinea,WS:Samoa,SB:Solomon Islands,TO:Tonga,TV:Tuvalu,VU:Vanuatu,NC:New Caledonia,PF:French Polynesia"],
];

export const countryOptions: CountryOption[] = groupedCountries.flatMap(([region, entries]) =>
  entries.split(",").map((entry) => {
    const separator = entry.indexOf(":");
    return { code: entry.slice(0, separator), name: entry.slice(separator + 1), region };
  }),
).sort((a, b) => a.name.localeCompare(b.name));
