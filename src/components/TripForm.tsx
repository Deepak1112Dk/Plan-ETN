import { useState } from 'react';
import { MapPin, Calendar, DollarSign, Users, Sparkles, Mic, Image as ImageIcon } from 'lucide-react';

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading: boolean;
}

export interface TripFormData {
  destination: string;
  duration: number;
  budget: string;
  travelers: number;
  interests: string;
  images: Array<{ data: string; mimeType: string; url: string }>;
}

export default function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    duration: 3,
    budget: 'moderate',
    travelers: 2,
    interests: '',
    images: []
  });

  const [isRecording, setIsRecording] = useState(false);

  const tamilNaduDestinations = [
    { district: 'Chennai', places: ['Marina Beach', 'Kapaleeshwarar Temple', 'Fort St. George', 'Government Museum', 'Valluvar Kottam', 'Parthasarathy Temple'] },
    { district: 'Madurai', places: ['Meenakshi Amman Temple', 'Thirumalai Nayak Palace', 'Gandhi Memorial Museum', 'Alagar Kovil', 'Vandiyur Mariamman Teppakulam'] },
    { district: 'Coimbatore', places: ['Marudamalai Temple', 'Dhyanalinga Temple', 'VOC Park', 'Kovai Kutralam Falls', 'Siruvani Waterfalls', 'Gedee Car Museum'] },
    { district: 'Tiruchirappalli', places: ['Rockfort Temple', 'Sri Ranganathaswamy Temple', 'Jambukeswarar Temple', 'Kallanai Dam', 'Ucchi Pillayar Temple'] },
    { district: 'Salem', places: ['Yercaud', 'Kiliyur Falls', 'Pagoda Point', 'Lady\'s Seat', 'Servaroyan Temple', 'Botanical Garden'] },
    { district: 'Tirunelveli', places: ['Nellaiappar Temple', 'Courtallam Falls', 'Manimuthar Falls', 'Papanasam', 'Tenkasi'] },
    { district: 'Kanyakumari', places: ['Vivekananda Rock Memorial', 'Thiruvalluvar Statue', 'Kanyakumari Beach', 'Suchindram Temple', 'Padmanabhapuram Palace'] },
    { district: 'Nilgiris', places: ['Ooty', 'Botanical Gardens', 'Doddabetta Peak', 'Ooty Lake', 'Coonoor', 'Pykara Falls', 'Avalanche Lake'] },
    { district: 'Dindigul', places: ['Kodaikanal', 'Berijam Lake', 'Coaker\'s Walk', 'Bryant Park', 'Pillar Rocks', 'Silver Cascade Falls', 'Palani Murugan Temple'] },
    { district: 'Ramanathapuram', places: ['Rameswaram Temple', 'Pamban Bridge', 'Dhanushkodi', 'APJ Abdul Kalam Memorial', 'Ramanathaswamy Temple'] },
    { district: 'Thanjavur', places: ['Brihadeeswarar Temple', 'Thanjavur Palace', 'Saraswathi Mahal Library', 'Schwartz Church', 'Sivaganga Park'] },
    { district: 'Puducherry', places: ['Auroville', 'Promenade Beach', 'Aurobindo Ashram', 'Paradise Beach', 'Basilica of the Sacred Heart', 'French Quarter'] },
    { district: 'Chengalpattu', places: ['Mahabalipuram', 'Shore Temple', 'Pancha Rathas', 'Arjuna\'s Penance', 'Crocodile Bank', 'Tiger Cave'] },
    { district: 'Kanchipuram', places: ['Kailasanathar Temple', 'Ekambareswarar Temple', 'Kamakshi Amman Temple', 'Varadharaja Perumal Temple', 'Silk Weaving Centers'] },
    { district: 'Vellore', places: ['Vellore Fort', 'Golden Temple', 'Jalakandeswarar Temple', 'Yelagiri', 'Jalagamparai Waterfalls'] },
    { district: 'Erode', places: ['Bhavani Sangameshwarar Temple', 'Vellode Bird Sanctuary', 'Bannari Amman Temple', 'Kodiveri Dam'] },
    { district: 'Karur', places: ['Kalyana Pasupatheeswarar Temple', 'Karur Amaravathi Dam', 'Pasupathieswarar Temple'] },
    { district: 'Namakkal', places: ['Namakkal Anjaneyar Temple', 'Kolli Hills', 'Agaya Gangai Waterfalls', 'Siddhar Caves'] },
    { district: 'Tiruvallur', places: ['Pulicat Lake', 'Puzhal Lake', 'Vadapalani Murugan Temple', 'Thiruvallur Temple'] },
    { district: 'Tiruvannamalai', places: ['Arunachaleswarar Temple', 'Skandashramam', 'Virupaksha Cave', 'Sathanur Dam', 'Gingee Fort'] },
    { district: 'Cuddalore', places: ['Pichavaram Mangrove Forest', 'Silver Beach', 'Thiruvanthipuram Temple', 'Padaleeswarar Temple'] },
    { district: 'Villupuram', places: ['Gingee Fort', 'Thirukovilur Temple', 'Thiruvakkarai Temple'] },
    { district: 'Nagapattinam', places: ['Velankanni Church', 'Sikkal Singaravelar Temple', 'Nagore Dargah', 'Kodikkarai Wildlife Sanctuary'] },
    { district: 'Tiruvarur', places: ['Thyagaraja Temple', 'Muthupet Lagoon', 'Valangaiman'] },
    { district: 'Mayiladuthurai', places: ['Mayuranathaswami Temple', 'Dharasuram Airavatesvara Temple', 'Sirkazhi'] },
    { district: 'Ariyalur', places: ['Gangaikonda Cholapuram', 'Ariyalur Fossils', 'Thirumanur'] },
    { district: 'Perambalur', places: ['Koraiyar Dam', 'Kunnandarkoil Cave Temple', 'Vayalur Murugan Temple'] },
    { district: 'Pudukkottai', places: ['Sittanavasal Cave', 'Thirumayam Fort', 'Avudayarkoil Temple', 'Kudumiyamalai'] },
    { district: 'Sivaganga', places: ['Chettinad Heritage Mansions', 'Pillayarpatti Temple', 'Karaikudi', 'Thiruppathur'] },
    { district: 'Ramanathapuram', places: ['Rameswaram', 'Dhanushkodi', 'Erwadi Dargah', 'Devipattinam'] },
    { district: 'Virudhunagar', places: ['Ayyanar Falls', 'Rajapalayam', 'Srivilliputhur Temple', 'Arulmigu Andal Temple'] },
    { district: 'Theni', places: ['Megamalai', 'Suruli Falls', 'Kumbakkarai Falls', 'Vaigai Dam', 'Sothuparai Dam'] },
    { district: 'Tenkasi', places: ['Courtallam Falls', 'Kutralam Waterfalls', 'Tenkasi Kasi Viswanathar Temple', 'Papanasam'] },
    { district: 'Thoothukudi', places: ['Thiruchendur Murugan Temple', 'Manapad Church', 'Hare Island', 'Tuticorin Beach'] },
    { district: 'Tiruppur', places: ['Amaravathi Dam', 'Noyyal River', 'Thirumoorthy Hills', 'Arulmigu Avinashi Temple'] },
    { district: 'Krishnagiri', places: ['Hogenakkal Falls', 'Krishnagiri Dam', 'Rayakottai Fort', 'Shree Parshwa Padmavathi Shaktipeeth'] },
    { district: 'Dharmapuri', places: ['Hogenakkal Falls', 'Theerthamalai Temple', 'Adhiyamankottai', 'Chenraya Perumal Temple'] },
    { district: 'Ranipet', places: ['Javvadhu Hills', 'Arani Temple', 'Sholinganallur Murugan Temple'] },
    { district: 'Tirupattur', places: ['Ambur Fort', 'Vaniyambadi Fort', 'Vellimalai Murugan Temple'] },
    { district: 'Kallakurichi', places: ['Gomuki Dam', 'Melmalayanur Temple', 'Ulundurpet'] },
    { district: 'Chengalpattu', places: ['Vedanthangal Bird Sanctuary', 'Mahabalipuram', 'Sadras Fort', 'Karikili Bird Sanctuary'] },
    { district: 'Kancheepuram', places: ['Kailasanathar Temple', 'Kamakshi Temple', 'Varadharaja Temple', 'Ekambareswarar Temple'] },
    { district: 'Tiruvallur', places: ['Pulicat Lake', 'Puzhal Lake', 'Thiruvallur Veeraraghava Temple'] }
  ];

  const allDestinations = tamilNaduDestinations.flatMap(d => [d.district, ...d.places]).sort();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.destination && formData.duration > 0) {
      onSubmit(formData);
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFormData({ ...formData, interests: transcript });
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      alert('Voice recognition is not supported in your browser.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, {
                data: result.split(',')[1],
                mimeType: file.type,
                url: result
              }]
            }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-xl shadow-purple-500/20 p-4 sm:p-6 md:p-8 max-w-2xl mx-auto border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#b415ff] to-[#df8908] rounded-xl">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Plan Your Tamil Nadu Adventure</h2>
          <p className="text-gray-400 text-xs sm:text-sm">Discover the soul, culture, and timeless beauty</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <MapPin className="w-4 h-4" />
            Destination in Tamil Nadu
          </label>
          <select
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            className="w-full px-4 py-3 bg-black border-2 border-gray-700 text-white rounded-xl focus:border-[#b415ff] focus:outline-none transition-colors"
            required
          >
            <option value="">Select a destination</option>
            {tamilNaduDestinations.map(item => (
              <optgroup key={item.district} label={item.district}>
                <option value={item.district}>{item.district} (District)</option>
                {item.places.map(place => (
                  <option key={place} value={place}>  {place}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <Calendar className="w-4 h-4" />
              Duration (Days)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-black border-2 border-gray-700 text-white rounded-xl focus:border-[#df8908] focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <Users className="w-4 h-4" />
              Travelers
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.travelers}
              onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-black border-2 border-gray-700 text-white rounded-xl focus:border-[#df8908] focus:outline-none transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <DollarSign className="w-4 h-4" />
            Budget
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {['budget', 'moderate', 'luxury'].map(budget => (
              <button
                key={budget}
                type="button"
                onClick={() => setFormData({ ...formData, budget })}
                className={`px-3 sm:px-4 py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                  formData.budget === budget
                    ? 'bg-gradient-to-br from-[#b415ff] to-[#df8908] text-white shadow-lg shadow-purple-500/50'
                    : 'bg-black border border-gray-700 text-gray-300 hover:bg-gray-800'
                }`}
              >
                {budget.charAt(0).toUpperCase() + budget.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            Interests & Preferences
          </label>
          <div className="relative">
            <textarea
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              placeholder="E.g., temples, beaches, adventure, food tours, wildlife..."
              className="w-full px-4 py-3 bg-black border-2 border-gray-700 text-white placeholder-gray-500 rounded-xl focus:border-[#b415ff] focus:outline-none transition-colors resize-none"
              rows={3}
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute bottom-3 right-3 p-2 rounded-lg transition-colors ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <ImageIcon className="w-4 h-4" />
            Reference Images (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-700 rounded-xl hover:border-[#df8908] cursor-pointer transition-colors"
          >
            <ImageIcon className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm sm:text-base">Upload images for inspiration</span>
          </label>

          {formData.images.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {formData.images.map((img, index) => (
                <div key={index} className="relative group">
                  <img src={img.url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#b415ff] to-[#df8908] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Your Trip...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Trip Plan
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
