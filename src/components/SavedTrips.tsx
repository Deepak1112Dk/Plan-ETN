import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Trash2, Eye } from 'lucide-react';

interface SavedTrip {
  id: string;
  destination: string;
  duration: number;
  budget: string;
  travelers: number;
  itinerary: string;
  created_at: string;
}

interface SavedTripsProps {
  onViewTrip: (trip: SavedTrip) => void;
}

export default function SavedTrips({ onViewTrip }: SavedTripsProps) {
  const [trips, setTrips] = useState<SavedTrip[]>([]);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = () => {
    const saved = localStorage.getItem('tamilnadu_trips');
    if (saved) {
      setTrips(JSON.parse(saved));
    }
  };

  const deleteTrip = (id: string) => {
    const updated = trips.filter(t => t.id !== id);
    setTrips(updated);
    localStorage.setItem('tamilnadu_trips', JSON.stringify(updated));
  };

  if (trips.length === 0) {
    return (
      <div className="bg-gray-900 rounded-2xl shadow-xl shadow-purple-500/20 p-8 max-w-4xl mx-auto text-center border border-gray-800">
        <MapPin className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Saved Trips Yet</h3>
        <p className="text-gray-400">Create your first Tamil Nadu adventure to see it here!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Your Saved Trips</h2>
      <div className="grid gap-4">
        {trips.map(trip => (
          <div key={trip.id} className="bg-gray-900 rounded-2xl shadow-lg shadow-purple-500/10 p-4 sm:p-6 hover:shadow-xl hover:shadow-purple-500/20 transition-all border border-gray-800">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex-1 w-full">
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#b415ff] to-[#df8908] bg-clip-text text-transparent mb-3">{trip.destination}</h3>
                <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{trip.duration} days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{trip.travelers} travelers</span>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-[#b415ff]/20 to-[#df8908]/20 text-white rounded-full font-medium border border-[#b415ff]/30">
                    {trip.budget.charAt(0).toUpperCase() + trip.budget.slice(1)}
                  </div>
                </div>
                <p className="text-gray-500 text-xs">
                  Created: {new Date(trip.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onViewTrip(trip)}
                  className="flex-1 sm:flex-initial p-2 bg-gradient-to-r from-[#b415ff] to-[#df8908] text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  title="View trip"
                >
                  <Eye className="w-5 h-5 mx-auto" />
                </button>
                <button
                  onClick={() => deleteTrip(trip.id)}
                  className="flex-1 sm:flex-initial p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
                  title="Delete trip"
                >
                  <Trash2 className="w-5 h-5 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
