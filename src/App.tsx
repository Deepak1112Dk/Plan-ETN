import { useState } from 'react';
import { MapPin, Sparkles, BookOpen } from 'lucide-react';
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
        images: data.images
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
      images: []
    });
    setView('trip');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl group-hover:shadow-lg transition-all">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Tamil Nadu Explorer
                </h1>
                <p className="text-xs text-gray-600">AI-Powered Trip Planner</p>
              </div>
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setView('form')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                New Trip
              </button>
              <button
                onClick={() => setView('saved')}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-orange-500 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Saved Trips
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'home' && (
          <div className="text-center py-20">
            <div className="mb-8 inline-block p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl">
              <MapPin className="w-20 h-20 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Discover Tamil Nadu
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore the soul, culture, and timeless beauty of incredible Tamil Nadu.
              Let AI craft your perfect journey through temples, beaches, hills, and heritage.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setView('form')}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Planning
              </button>
              <button
                onClick={() => setView('saved')}
                className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-orange-500 hover:shadow-lg transition-all flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                View Saved Trips
              </button>
            </div>

            <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">AI-Powered Planning</h3>
                <p className="text-gray-600 text-sm">Get personalized itineraries generated by advanced AI</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Rich Destinations</h3>
                <p className="text-gray-600 text-sm">Explore 20+ destinations across Tamil Nadu</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Save & Share</h3>
                <p className="text-gray-600 text-sm">Save your trips and share with friends</p>
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

      <footer className="bg-white/80 backdrop-blur-md mt-20 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            Powered by Gemini AI • Explore the incredible heritage of Tamil Nadu
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Experience temples, beaches, hill stations, and rich culture
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
