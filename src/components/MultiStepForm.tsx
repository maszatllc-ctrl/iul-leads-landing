'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftIcon, LockClosedIcon, CheckIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface FormData {
  zipCode: string;
  ageRange: string;
  name: string;
  phone: string;
}

interface MultiStepFormProps {
  onBack: () => void;
}

const ageRanges = [
  { value: '<35', label: 'Menor de 35 años' },
  { value: '35-45', label: '35 - 45 años' },
  { value: '46-55', label: '46 - 55 años' },
  { value: '56+', label: '56 años o más' },
];

// ZIP to State mapping (first 3 digits)
const ZIP_TO_STATE: Record<string, string> = {
  '005': 'NY', '006': 'PR', '007': 'PR', '008': 'PR', '009': 'PR',
  '010': 'MA', '011': 'MA', '012': 'MA', '013': 'MA', '014': 'MA', '015': 'MA', '016': 'MA', '017': 'MA', '018': 'MA', '019': 'MA',
  '020': 'MA', '021': 'MA', '022': 'MA', '023': 'MA', '024': 'MA', '025': 'MA', '026': 'MA', '027': 'MA',
  '028': 'RI', '029': 'RI',
  '030': 'NH', '031': 'NH', '032': 'NH', '033': 'NH', '034': 'NH', '035': 'NH', '036': 'NH', '037': 'NH', '038': 'NH',
  '039': 'ME', '040': 'ME', '041': 'ME', '042': 'ME', '043': 'ME', '044': 'ME', '045': 'ME', '046': 'ME', '047': 'ME', '048': 'ME', '049': 'ME',
  '050': 'VT', '051': 'VT', '052': 'VT', '053': 'VT', '054': 'VT', '055': 'VT', '056': 'VT', '057': 'VT', '058': 'VT', '059': 'VT',
  '060': 'CT', '061': 'CT', '062': 'CT', '063': 'CT', '064': 'CT', '065': 'CT', '066': 'CT', '067': 'CT', '068': 'CT', '069': 'CT',
  '070': 'NJ', '071': 'NJ', '072': 'NJ', '073': 'NJ', '074': 'NJ', '075': 'NJ', '076': 'NJ', '077': 'NJ', '078': 'NJ', '079': 'NJ',
  '080': 'NJ', '081': 'NJ', '082': 'NJ', '083': 'NJ', '084': 'NJ', '085': 'NJ', '086': 'NJ', '087': 'NJ', '088': 'NJ', '089': 'NJ',
  '100': 'NY', '101': 'NY', '102': 'NY', '103': 'NY', '104': 'NY', '105': 'NY', '106': 'NY', '107': 'NY', '108': 'NY', '109': 'NY',
  '110': 'NY', '111': 'NY', '112': 'NY', '113': 'NY', '114': 'NY', '115': 'NY', '116': 'NY', '117': 'NY', '118': 'NY', '119': 'NY',
  '120': 'NY', '121': 'NY', '122': 'NY', '123': 'NY', '124': 'NY', '125': 'NY', '126': 'NY', '127': 'NY', '128': 'NY', '129': 'NY',
  '130': 'NY', '131': 'NY', '132': 'NY', '133': 'NY', '134': 'NY', '135': 'NY', '136': 'NY', '137': 'NY', '138': 'NY', '139': 'NY',
  '140': 'NY', '141': 'NY', '142': 'NY', '143': 'NY', '144': 'NY', '145': 'NY', '146': 'NY', '147': 'NY', '148': 'NY', '149': 'NY',
  '150': 'PA', '151': 'PA', '152': 'PA', '153': 'PA', '154': 'PA', '155': 'PA', '156': 'PA', '157': 'PA', '158': 'PA', '159': 'PA',
  '160': 'PA', '161': 'PA', '162': 'PA', '163': 'PA', '164': 'PA', '165': 'PA', '166': 'PA', '167': 'PA', '168': 'PA', '169': 'PA',
  '170': 'PA', '171': 'PA', '172': 'PA', '173': 'PA', '174': 'PA', '175': 'PA', '176': 'PA', '177': 'PA', '178': 'PA', '179': 'PA',
  '180': 'PA', '181': 'PA', '182': 'PA', '183': 'PA', '184': 'PA', '185': 'PA', '186': 'PA', '187': 'PA', '188': 'PA', '189': 'PA',
  '190': 'PA', '191': 'PA', '192': 'PA', '193': 'PA', '194': 'PA', '195': 'PA', '196': 'PA',
  '197': 'DE', '198': 'DE', '199': 'DE',
  '200': 'DC', '201': 'VA', '202': 'DC', '203': 'DC', '204': 'DC', '205': 'DC',
  '206': 'MD', '207': 'MD', '208': 'MD', '209': 'MD', '210': 'MD', '211': 'MD', '212': 'MD', '214': 'MD', '215': 'MD', '216': 'MD', '217': 'MD', '218': 'MD', '219': 'MD',
  '220': 'VA', '221': 'VA', '222': 'VA', '223': 'VA', '224': 'VA', '225': 'VA', '226': 'VA', '227': 'VA', '228': 'VA', '229': 'VA',
  '230': 'VA', '231': 'VA', '232': 'VA', '233': 'VA', '234': 'VA', '235': 'VA', '236': 'VA', '237': 'VA', '238': 'VA', '239': 'VA',
  '240': 'VA', '241': 'VA', '242': 'VA', '243': 'VA', '244': 'VA', '245': 'VA', '246': 'VA',
  '247': 'WV', '248': 'WV', '249': 'WV', '250': 'WV', '251': 'WV', '252': 'WV', '253': 'WV', '254': 'WV', '255': 'WV', '256': 'WV', '257': 'WV', '258': 'WV', '259': 'WV', '260': 'WV', '261': 'WV', '262': 'WV', '263': 'WV', '264': 'WV', '265': 'WV', '266': 'WV', '267': 'WV', '268': 'WV',
  '270': 'NC', '271': 'NC', '272': 'NC', '273': 'NC', '274': 'NC', '275': 'NC', '276': 'NC', '277': 'NC', '278': 'NC', '279': 'NC',
  '280': 'NC', '281': 'NC', '282': 'NC', '283': 'NC', '284': 'NC', '285': 'NC', '286': 'NC', '287': 'NC', '288': 'NC', '289': 'NC',
  '290': 'SC', '291': 'SC', '292': 'SC', '293': 'SC', '294': 'SC', '295': 'SC', '296': 'SC', '297': 'SC', '298': 'SC', '299': 'SC',
  '300': 'GA', '301': 'GA', '302': 'GA', '303': 'GA', '304': 'GA', '305': 'GA', '306': 'GA', '307': 'GA', '308': 'GA', '309': 'GA',
  '310': 'GA', '311': 'GA', '312': 'GA', '313': 'GA', '314': 'GA', '315': 'GA', '316': 'GA', '317': 'GA', '318': 'GA', '319': 'GA',
  '320': 'FL', '321': 'FL', '322': 'FL', '323': 'FL', '324': 'FL', '325': 'FL', '326': 'FL', '327': 'FL', '328': 'FL', '329': 'FL',
  '330': 'FL', '331': 'FL', '332': 'FL', '333': 'FL', '334': 'FL', '335': 'FL', '336': 'FL', '337': 'FL', '338': 'FL', '339': 'FL',
  '340': 'FL', '341': 'FL', '342': 'FL', '344': 'FL', '346': 'FL', '347': 'FL', '349': 'FL',
  '350': 'AL', '351': 'AL', '352': 'AL', '354': 'AL', '355': 'AL', '356': 'AL', '357': 'AL', '358': 'AL', '359': 'AL',
  '360': 'AL', '361': 'AL', '362': 'AL', '363': 'AL', '364': 'AL', '365': 'AL', '366': 'AL', '367': 'AL', '368': 'AL', '369': 'AL',
  '370': 'TN', '371': 'TN', '372': 'TN', '373': 'TN', '374': 'TN', '375': 'TN', '376': 'TN', '377': 'TN', '378': 'TN', '379': 'TN',
  '380': 'TN', '381': 'TN', '382': 'TN', '383': 'TN', '384': 'TN', '385': 'TN',
  '386': 'MS', '387': 'MS', '388': 'MS', '389': 'MS', '390': 'MS', '391': 'MS', '392': 'MS', '393': 'MS', '394': 'MS', '395': 'MS', '396': 'MS', '397': 'MS',
  '400': 'KY', '401': 'KY', '402': 'KY', '403': 'KY', '404': 'KY', '405': 'KY', '406': 'KY', '407': 'KY', '408': 'KY', '409': 'KY',
  '410': 'KY', '411': 'KY', '412': 'KY', '413': 'KY', '414': 'KY', '415': 'KY', '416': 'KY', '417': 'KY', '418': 'KY',
  '420': 'KY', '421': 'KY', '422': 'KY', '423': 'KY', '424': 'KY', '425': 'KY', '426': 'KY', '427': 'KY',
  '430': 'OH', '431': 'OH', '432': 'OH', '433': 'OH', '434': 'OH', '435': 'OH', '436': 'OH', '437': 'OH', '438': 'OH', '439': 'OH',
  '440': 'OH', '441': 'OH', '442': 'OH', '443': 'OH', '444': 'OH', '445': 'OH', '446': 'OH', '447': 'OH', '448': 'OH', '449': 'OH',
  '450': 'OH', '451': 'OH', '452': 'OH', '453': 'OH', '454': 'OH', '455': 'OH', '456': 'OH', '457': 'OH', '458': 'OH',
  '460': 'IN', '461': 'IN', '462': 'IN', '463': 'IN', '464': 'IN', '465': 'IN', '466': 'IN', '467': 'IN', '468': 'IN', '469': 'IN',
  '470': 'IN', '471': 'IN', '472': 'IN', '473': 'IN', '474': 'IN', '475': 'IN', '476': 'IN', '477': 'IN', '478': 'IN', '479': 'IN',
  '480': 'MI', '481': 'MI', '482': 'MI', '483': 'MI', '484': 'MI', '485': 'MI', '486': 'MI', '487': 'MI', '488': 'MI', '489': 'MI',
  '490': 'MI', '491': 'MI', '492': 'MI', '493': 'MI', '494': 'MI', '495': 'MI', '496': 'MI', '497': 'MI', '498': 'MI', '499': 'MI',
  '500': 'IA', '501': 'IA', '502': 'IA', '503': 'IA', '504': 'IA', '505': 'IA', '506': 'IA', '507': 'IA', '508': 'IA', '509': 'IA',
  '510': 'IA', '511': 'IA', '512': 'IA', '513': 'IA', '514': 'IA', '515': 'IA', '516': 'IA',
  '520': 'IA', '521': 'IA', '522': 'IA', '523': 'IA', '524': 'IA', '525': 'IA', '526': 'IA', '527': 'IA', '528': 'IA',
  '530': 'WI', '531': 'WI', '532': 'WI', '534': 'WI', '535': 'WI', '537': 'WI', '538': 'WI', '539': 'WI',
  '540': 'WI', '541': 'WI', '542': 'WI', '543': 'WI', '544': 'WI', '545': 'WI', '546': 'WI', '547': 'WI', '548': 'WI', '549': 'WI',
  '550': 'MN', '551': 'MN', '553': 'MN', '554': 'MN', '555': 'MN', '556': 'MN', '557': 'MN', '558': 'MN', '559': 'MN',
  '560': 'MN', '561': 'MN', '562': 'MN', '563': 'MN', '564': 'MN', '565': 'MN', '566': 'MN', '567': 'MN',
  '570': 'SD', '571': 'SD', '572': 'SD', '573': 'SD', '574': 'SD', '575': 'SD', '576': 'SD', '577': 'SD',
  '580': 'ND', '581': 'ND', '582': 'ND', '583': 'ND', '584': 'ND', '585': 'ND', '586': 'ND', '587': 'ND', '588': 'ND',
  '590': 'MT', '591': 'MT', '592': 'MT', '593': 'MT', '594': 'MT', '595': 'MT', '596': 'MT', '597': 'MT', '598': 'MT', '599': 'MT',
  '600': 'IL', '601': 'IL', '602': 'IL', '603': 'IL', '604': 'IL', '605': 'IL', '606': 'IL', '607': 'IL', '608': 'IL', '609': 'IL',
  '610': 'IL', '611': 'IL', '612': 'IL', '613': 'IL', '614': 'IL', '615': 'IL', '616': 'IL', '617': 'IL', '618': 'IL', '619': 'IL',
  '620': 'IL', '622': 'IL', '623': 'IL', '624': 'IL', '625': 'IL', '626': 'IL', '627': 'IL', '628': 'IL', '629': 'IL',
  '630': 'MO', '631': 'MO', '633': 'MO', '634': 'MO', '635': 'MO', '636': 'MO', '637': 'MO', '638': 'MO', '639': 'MO',
  '640': 'MO', '641': 'MO', '644': 'MO', '645': 'MO', '646': 'MO', '647': 'MO', '648': 'MO', '649': 'MO',
  '650': 'MO', '651': 'MO', '652': 'MO', '653': 'MO', '654': 'MO', '655': 'MO', '656': 'MO', '657': 'MO', '658': 'MO',
  '660': 'KS', '661': 'KS', '662': 'KS', '664': 'KS', '665': 'KS', '666': 'KS', '667': 'KS', '668': 'KS', '669': 'KS',
  '670': 'KS', '671': 'KS', '672': 'KS', '673': 'KS', '674': 'KS', '675': 'KS', '676': 'KS', '677': 'KS', '678': 'KS', '679': 'KS',
  '680': 'NE', '681': 'NE', '683': 'NE', '684': 'NE', '685': 'NE', '686': 'NE', '687': 'NE', '688': 'NE', '689': 'NE',
  '690': 'NE', '691': 'NE', '692': 'NE', '693': 'NE',
  '700': 'LA', '701': 'LA', '703': 'LA', '704': 'LA', '705': 'LA', '706': 'LA', '707': 'LA', '708': 'LA',
  '710': 'LA', '711': 'LA', '712': 'LA', '713': 'LA', '714': 'LA',
  '716': 'AR', '717': 'AR', '718': 'AR', '719': 'AR', '720': 'AR', '721': 'AR', '722': 'AR', '723': 'AR', '724': 'AR', '725': 'AR', '726': 'AR', '727': 'AR', '728': 'AR', '729': 'AR',
  '730': 'OK', '731': 'OK', '734': 'OK', '735': 'OK', '736': 'OK', '737': 'OK', '738': 'OK', '739': 'OK',
  '740': 'OK', '741': 'OK', '743': 'OK', '744': 'OK', '745': 'OK', '746': 'OK', '747': 'OK', '748': 'OK', '749': 'OK',
  '750': 'TX', '751': 'TX', '752': 'TX', '753': 'TX', '754': 'TX', '755': 'TX', '756': 'TX', '757': 'TX', '758': 'TX', '759': 'TX',
  '760': 'TX', '761': 'TX', '762': 'TX', '763': 'TX', '764': 'TX', '765': 'TX', '766': 'TX', '767': 'TX', '768': 'TX', '769': 'TX',
  '770': 'TX', '772': 'TX', '773': 'TX', '774': 'TX', '775': 'TX', '776': 'TX', '777': 'TX', '778': 'TX', '779': 'TX',
  '780': 'TX', '781': 'TX', '782': 'TX', '783': 'TX', '784': 'TX', '785': 'TX', '786': 'TX', '787': 'TX', '788': 'TX', '789': 'TX',
  '790': 'TX', '791': 'TX', '792': 'TX', '793': 'TX', '794': 'TX', '795': 'TX', '796': 'TX', '797': 'TX', '798': 'TX', '799': 'TX',
  '800': 'CO', '801': 'CO', '802': 'CO', '803': 'CO', '804': 'CO', '805': 'CO', '806': 'CO', '807': 'CO', '808': 'CO', '809': 'CO',
  '810': 'CO', '811': 'CO', '812': 'CO', '813': 'CO', '814': 'CO', '815': 'CO', '816': 'CO',
  '820': 'WY', '821': 'WY', '822': 'WY', '823': 'WY', '824': 'WY', '825': 'WY', '826': 'WY', '827': 'WY', '828': 'WY', '829': 'WY', '830': 'WY', '831': 'WY',
  '832': 'ID', '833': 'ID', '834': 'ID', '835': 'ID', '836': 'ID', '837': 'ID', '838': 'ID',
  '840': 'UT', '841': 'UT', '842': 'UT', '843': 'UT', '844': 'UT', '845': 'UT', '846': 'UT', '847': 'UT',
  '850': 'AZ', '852': 'AZ', '853': 'AZ', '855': 'AZ', '856': 'AZ', '857': 'AZ', '859': 'AZ',
  '860': 'AZ', '863': 'AZ', '864': 'AZ', '865': 'AZ',
  '870': 'NM', '871': 'NM', '872': 'NM', '873': 'NM', '874': 'NM', '875': 'NM', '877': 'NM', '878': 'NM', '879': 'NM',
  '880': 'NM', '881': 'NM', '882': 'NM', '883': 'NM', '884': 'NM',
  '889': 'NV', '890': 'NV', '891': 'NV', '893': 'NV', '894': 'NV', '895': 'NV', '897': 'NV', '898': 'NV',
  '900': 'CA', '901': 'CA', '902': 'CA', '903': 'CA', '904': 'CA', '905': 'CA', '906': 'CA', '907': 'CA', '908': 'CA',
  '910': 'CA', '911': 'CA', '912': 'CA', '913': 'CA', '914': 'CA', '915': 'CA', '916': 'CA', '917': 'CA', '918': 'CA',
  '920': 'CA', '921': 'CA', '922': 'CA', '923': 'CA', '924': 'CA', '925': 'CA', '926': 'CA', '927': 'CA', '928': 'CA',
  '930': 'CA', '931': 'CA', '932': 'CA', '933': 'CA', '934': 'CA', '935': 'CA', '936': 'CA', '937': 'CA', '938': 'CA', '939': 'CA',
  '940': 'CA', '941': 'CA', '942': 'CA', '943': 'CA', '944': 'CA', '945': 'CA', '946': 'CA', '947': 'CA', '948': 'CA', '949': 'CA',
  '950': 'CA', '951': 'CA', '952': 'CA', '953': 'CA', '954': 'CA', '955': 'CA', '956': 'CA', '957': 'CA', '958': 'CA', '959': 'CA',
  '960': 'CA', '961': 'CA',
  '970': 'OR', '971': 'OR', '972': 'OR', '973': 'OR', '974': 'OR', '975': 'OR', '976': 'OR', '977': 'OR', '978': 'OR', '979': 'OR',
  '980': 'WA', '981': 'WA', '982': 'WA', '983': 'WA', '984': 'WA', '985': 'WA', '986': 'WA', '988': 'WA', '989': 'WA',
  '990': 'WA', '991': 'WA', '992': 'WA', '993': 'WA', '994': 'WA',
  '995': 'AK', '996': 'AK', '997': 'AK', '998': 'AK', '999': 'AK',
  '967': 'HI', '968': 'HI',
};

// Get state from ZIP code
function getStateFromZip(zipCode: string): string | null {
  if (zipCode.length < 3) return null;
  const prefix = zipCode.substring(0, 3);
  return ZIP_TO_STATE[prefix] || null;
}

const steps = [
  { id: 1, name: 'Ubicación' },
  { id: 2, name: 'Edad' },
  { id: 3, name: 'Contacto' },
];

export default function MultiStepForm({ onBack }: MultiStepFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    zipCode: '',
    ageRange: '',
    name: '',
    phone: '',
  });

  // Scroll to top when component mounts or step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const validateStep = () => {
    setError('');

    if (step === 1) {
      const zipRegex = /^\d{5}$/;
      if (!zipRegex.test(formData.zipCode)) {
        setError('Por favor ingresa un código postal válido de 5 dígitos');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.ageRange) {
        setError('Por favor selecciona tu rango de edad');
        return false;
      }
    }

    if (step === 3) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        setError('Por favor ingresa tu nombre');
        return false;
      }
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        setError('Por favor ingresa un número de teléfono válido de 10 dígitos');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone.replace(/\D/g, ''),
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          pageUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el formulario');
      }

      // Track lead event in Facebook Pixel (client-side)
      if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
        (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'Lead', {
          content_name: 'IUL Lead Form',
          content_category: 'Insurance',
        });
      }

      setIsSuccess(true);
    } catch (err) {
      setError('Hubo un error. Por favor intenta de nuevo.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = isSuccess ? 100 : ((step - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Top Progress Bar - Hide on last step */}
      {step < 3 && !isSuccess && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-slate-200">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Header - Hide on last step */}
      {step < 3 && !isSuccess && (
        <header className="sticky top-1 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
          <div className="mx-auto max-w-2xl px-4 py-4">
            {/* Step Indicators - Centered */}
            <div className="flex items-center justify-center gap-2">
              {steps.map((s, index) => (
                <div key={s.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
                      step >= s.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step >= s.id ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      s.id
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                        step > s.id ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 animate-shake">
            {error}
          </div>
        )}

        {!isSuccess ? (
          <div className="animate-fadeIn">
            {/* Step 1: Zip Code */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-6 shadow-lg shadow-blue-500/30">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    ¿En qué área vives?
                  </h1>
                  <p className="mt-3 text-slate-600">
                    Esto nos ayuda a conectarte con un especialista en tu zona.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700 mb-2">
                      Código Postal (ZIP Code)
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      inputMode="numeric"
                      maxLength={5}
                      value={formData.zipCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, zipCode: value });
                        // Auto-advance when 5 digits entered
                        if (value.length === 5) {
                          setTimeout(() => setStep(2), 200);
                        }
                      }}
                      placeholder="Ej: 33101"
                      className="w-full rounded-2xl border-2 border-slate-200 px-6 py-4 text-xl text-center tracking-widest font-mono focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/40 transition-all active:scale-[0.98]"
                  >
                    Continuar
                  </button>

                  {/* Privacy Notice */}
                  <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-3">
                    <LockClosedIcon className="h-3.5 w-3.5 text-emerald-500" />
                    Tu información está protegida y nunca será compartida.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Age Range */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-6 shadow-lg shadow-blue-500/30">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    ¿Cuál es tu rango de edad?
                  </h1>
                  <p className="mt-3 text-slate-600">
                    Para personalizar tu análisis financiero.
                  </p>
                </div>

                <div className="space-y-3">
                  {ageRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setFormData({ ...formData, ageRange: range.value });
                        // Auto-advance after selection
                        setTimeout(() => setStep(3), 200);
                      }}
                      className={`w-full rounded-2xl border-2 px-6 py-4 text-left font-medium transition-all active:scale-[0.98] ${
                        formData.ageRange === range.value
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{range.label}</span>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.ageRange === range.value
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-slate-300'
                          }`}
                        >
                          {formData.ageRange === range.value && (
                            <CheckIcon className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Back button */}
                  <button
                    onClick={() => setStep(1)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all mt-4"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Atrás
                  </button>

                  {/* Privacy Notice */}
                  <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-3">
                    <LockClosedIcon className="h-3.5 w-3.5 text-emerald-500" />
                    Tu información está protegida y nunca será compartida.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Name & Phone */}
            {step === 3 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white mb-3 sm:mb-4 shadow-lg shadow-emerald-500/30">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    ¡Casi listo!
                  </h1>
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600">
                    ¿A dónde enviamos tu análisis gratuito?
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                      Tu Nombre
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: María García"
                        className="w-full rounded-xl border-2 border-slate-200 pl-10 pr-4 py-3 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                      Número de Teléfono
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="tel"
                        id="phone"
                        inputMode="tel"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="(555) 123-4567"
                        className="w-full rounded-xl border-2 border-slate-200 pl-10 pr-4 py-3 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 p-3">
                    <div className="flex items-start gap-2.5">
                      <img
                        src="/testimonial.webp"
                        alt="Cliente satisfecho"
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div>
                        <p className="text-xs sm:text-sm text-slate-600 italic leading-snug">
                          &ldquo;Nunca pensé que podría ahorrar para mi retiro sin pagar impuestos. ¡Muy recomendado!&rdquo;
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-700">
                          — Roberto M., {getStateFromZip(formData.zipCode) || 'TX'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      'Solicitar Análisis Gratis'
                    )}
                  </button>

                  {/* Privacy Notice */}
                  <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-3">
                    <LockClosedIcon className="h-3.5 w-3.5 text-emerald-500" />
                    Tu información está protegida y nunca será compartida.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Success State */
          <div className="text-center py-8 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 text-white mb-6 shadow-lg shadow-emerald-500/30">
              <CheckIcon className="h-10 w-10" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              ¡Gracias, {formData.name.split(' ')[0]}!
            </h1>

            <p className="mt-4 text-lg text-slate-600 max-w-md mx-auto">
              Un especialista bilingüe se comunicará contigo en las próximas <span className="font-semibold text-slate-900">24 horas</span> al número que proporcionaste.
            </p>

            <div className="mt-8 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 p-6">
              <h3 className="font-semibold text-slate-900 mb-2">¿Qué sigue?</h3>
              <p className="text-slate-600">
                Prepara cualquier pregunta que tengas sobre cómo hacer crecer tu dinero libre de impuestos. Nuestro especialista te explicará todo en detalle.
              </p>
            </div>
          </div>
        )}
      </main>

          </div>
  );
}
