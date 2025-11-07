import { useState } from 'react';
import { MapPin, Sparkles, BookOpen, Home } from 'lucide-react';
import TripForm, { TripFormData } from './components/TripForm';
import TripDisplay from './components/TripDisplay';
import SavedTrips from './components/SavedTrips';
import ChatBot from './components/ChatBot';
import { generateTrip } from './lib/gemini';

type View = 'home' | 'form' | 'trip' | 'saved';

interface SavedTrip {
  id: string;
  destination: string;
  duration: number;
  budget: string;
  travelers: number;
  itinerary: string;
  created_at: string;
}

function App() {
  const [view, setView] = useState<View>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<string | null>(null);
  const [currentTripData, setCurrentTripData] = useState<TripFormData | null>(null);

  const handleGenerateTrip = async (data: TripFormData) => {
    setIsLoading(true);
    try {
      const itinerary = await generateTrip({
        destination: data.destination,
        duration: data.duration,
        budget: data.budget,
        travelers: data.travelers,
        interests: data.interests,
        images: data.images,
        language: data.language
      });
      setCurrentTrip(itinerary);
      setCurrentTripData(data);
      setView('trip');
    } catch (error) {
      alert('Failed to generate trip. Please check if your Gemini API key is set correctly in the .env file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTrip = () => {
    if (!currentTrip || !currentTripData) return;

    const saved = localStorage.getItem('tamilnadu_trips');
    const trips = saved ? JSON.parse(saved) : [];

    const newTrip = {
      id: crypto.randomUUID(),
      destination: currentTripData.destination,
      duration: currentTripData.duration,
      budget: currentTripData.budget,
      travelers: currentTripData.travelers,
      itinerary: currentTrip,
      created_at: new Date().toISOString()
    };

    trips.push(newTrip);
    localStorage.setItem('tamilnadu_trips', JSON.stringify(trips));
    alert('Trip saved successfully!');
  };

  const handleViewSavedTrip = (trip: SavedTrip) => {
    setCurrentTrip(trip.itinerary);
    setCurrentTripData({
      destination: trip.destination,
      duration: trip.duration,
      budget: trip.budget,
      travelers: trip.travelers,
      interests: '',
      images: [],
      language: 'english'
    });
    setView('trip');
  };

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-black/90 backdrop-blur-md shadow-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 sm:gap-3 group cursor-pointer"
            >
              <img src="/logoo.png" alt="ETN Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#b415ff] to-[#df8908] bg-clip-text text-transparent">
                  ETN Trip Planner
                </h1>
                <p className="text-xs text-gray-400">AI-Powered Trip Planner</p>
              </div>
              <h1 className="sm:hidden text-lg font-bold bg-gradient-to-r from-[#b415ff] to-[#df8908] bg-clip-text text-transparent">
                ETN Trip Planner
              </h1>
            </button>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setView('form')}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#b415ff] to-[#df8908] text-white font-semibold rounded-xl hover:opacity-90 transition-all text-sm sm:text-base"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">New Trip</span>
              </button>
              <button
                onClick={() => setView('saved')}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-900 border-2 border-gray-800 text-white font-semibold rounded-xl hover:border-[#b415ff] transition-all text-sm sm:text-base"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Saved</span>
              </button>
              <a
                href="https://exploretamilagam.netlify.app/"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-900 border-2 border-gray-800 text-white font-semibold rounded-xl hover:border-[#df8908] transition-all text-sm sm:text-base"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {view === 'home' && (
          <div className="text-center py-10 sm:py-20">
            <div className="mb-8 inline-block">
              <img src="/logoo.png" alt="ETN Logo" className="w-32 h-32 sm:w-40 sm:h-40 object-contain" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 px-4">
              Discover Tamil Nadu
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto px-4">
              Explore the soul, culture, and timeless beauty of incredible Tamil Nadu.
              Let AI craft your perfect journey through temples, beaches, hills, and heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <button
                onClick={() => setView('form')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#b415ff] to-[#df8908] text-white font-bold rounded-xl hover:opacity-90 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Planning
              </button>
              <button
                onClick={() => setView('saved')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 border-2 border-gray-800 text-white font-bold rounded-xl hover:border-[#b415ff] transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                View Saved Trips
              </button>
            </div>

            <div className="mt-12 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-[#b415ff] transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-[#b415ff] to-[#df8908] rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">AI-Powered Planning</h3>
                <p className="text-gray-400 text-sm">Get personalized itineraries generated by advanced AI</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-[#df8908] transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-[#b415ff] to-[#df8908] rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Rich Destinations</h3>
                <p className="text-gray-400 text-sm">Explore 20+ destinations across Tamil Nadu</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-[#b415ff] transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-[#b415ff] to-[#df8908] rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Save & Share</h3>
                <p className="text-gray-400 text-sm">Save your trips and share with friends</p>
              </div>
            </div>
          </div>
        )}

        {view === 'form' && (
          <TripForm onSubmit={handleGenerateTrip} isLoading={isLoading} />
        )}

        {view === 'trip' && currentTrip && (
          <TripDisplay content={currentTrip} onSave={handleSaveTrip} />
        )}

        {view === 'saved' && (
          <SavedTrips onViewTrip={handleViewSavedTrip} />
        )}
      </main>

      <ChatBot />

      <footer className="bg-black/90 backdrop-blur-md mt-12 sm:mt-20 py-6 sm:py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            Explore the incredible heritage of Tamil Nadu
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Experience temples, beaches, hill stations, and rich culture
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
