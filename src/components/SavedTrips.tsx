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
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto text-center">
        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Trips Yet</h3>
        <p className="text-gray-600">Create your first Tamil Nadu adventure to see it here!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Saved Trips</h2>
      <div className="grid gap-4">
        {trips.map(trip => (
          <div key={trip.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{trip.destination}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{trip.duration} days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{trip.travelers} travelers</span>
                  </div>
                  <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                    {trip.budget.charAt(0).toUpperCase() + trip.budget.slice(1)}
                  </div>
                </div>
                <p className="text-gray-500 text-xs">
                  Created: {new Date(trip.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onViewTrip(trip)}
                  className="p-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all"
                  title="View trip"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteTrip(trip.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="Delete trip"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
