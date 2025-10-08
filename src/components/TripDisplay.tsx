import { Calendar, MapPin, Hotel, Utensils, Lightbulb, Save, Share2 } from 'lucide-react';

interface TripDisplayProps {
  content: string;
  onSave?: () => void;
  isSaving?: boolean;
}

export default function TripDisplay({ content, onSave, isSaving }: TripDisplayProps) {
  const formatText = (text: string): string => {
    let html = text;

    html = html.replace(/### (.*?)(\n|$)/g, '<h3 class="text-xl font-bold bg-gradient-to-r from-[#b415ff] to-[#df8908] bg-clip-text text-transparent mt-6 mb-3">$1</h3>');
    html = html.replace(/## (.*?)(\n|$)/g, '<h2 class="text-2xl font-bold bg-gradient-to-r from-[#b415ff] to-[#df8908] bg-clip-text text-transparent mt-8 mb-4">$1</h2>');
    html = html.replace(/# (.*?)(\n|$)/g, '<h1 class="text-3xl font-bold bg-gradient-to-r from-[#b415ff] to-[#df8908] bg-clip-text text-transparent mt-8 mb-4">$1</h1>');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    html = html.replace(/`([^`]+)`/g, '<code class="px-2 py-1 bg-black border border-gray-700 rounded text-sm font-mono">$1</code>');

    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-black border border-gray-700 p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>');

    const lines = html.split('\n');
    let inList = false;
    let listType = '';
    let formatted = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.match(/^[-*]\s/)) {
        if (!inList || listType !== 'ul') {
          if (inList) formatted.push(`</${listType}>`);
          formatted.push('<ul class="list-disc list-inside space-y-2 ml-4 my-3">');
          inList = true;
          listType = 'ul';
        }
        formatted.push('<li class="text-gray-300">' + line.replace(/^[-*]\s/, '') + '</li>');
      } else if (line.match(/^\d+\.\s/)) {
        if (!inList || listType !== 'ol') {
          if (inList) formatted.push(`</${listType}>`);
          formatted.push('<ol class="list-decimal list-inside space-y-2 ml-4 my-3">');
          inList = true;
          listType = 'ol';
        }
        formatted.push('<li class="text-gray-300">' + line.replace(/^\d+\.\s/, '') + '</li>');
      } else {
        if (inList) {
          formatted.push(`</${listType}>`);
          inList = false;
          listType = '';
        }
        if (line && !line.startsWith('<h') && !line.startsWith('<pre')) {
          formatted.push('<p class="text-gray-300 leading-relaxed my-3">' + line + '</p>');
        } else if (line) {
          formatted.push(line);
        }
      }
    }

    if (inList) {
      formatted.push(`</${listType}>`);
    }

    return formatted.join('');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Tamil Nadu Trip Plan',
          text: 'Check out my trip plan for Tamil Nadu!',
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      alert('Sharing is not supported on this browser');
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-xl shadow-purple-500/20 p-4 sm:p-6 md:p-8 max-w-4xl mx-auto border border-gray-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#b415ff] to-[#df8908] rounded-xl">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Your Tamil Nadu Journey</h2>
            <p className="text-gray-400 text-xs sm:text-sm">AI-Generated Personalized Itinerary</p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleShare}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors border border-gray-700"
            title="Share trip"
          >
            <Share2 className="w-5 h-5 text-gray-300" />
          </button>
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#b415ff] to-[#df8908] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 flex-1 sm:flex-initial justify-center"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Trip'}
            </button>
          )}
        </div>
      </div>

      <div className="prose max-w-none">
        <div
          className="trip-content"
          dangerouslySetInnerHTML={{ __html: formatText(content) }}
        />
      </div>

      <div className="mt-8 p-4 sm:p-6 bg-gradient-to-br from-[#b415ff]/10 to-[#df8908]/10 rounded-xl border-2 border-[#b415ff]/30">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-[#df8908] flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-white mb-2 text-sm sm:text-base">Pro Tips for Tamil Nadu Travel</h3>
            <ul className="space-y-1 text-xs sm:text-sm text-gray-300">
              <li>• Best time to visit: October to March for pleasant weather</li>
              <li>• Try authentic Tamil cuisine - idli, dosa, chettinad chicken, filter coffee</li>
              <li>• Dress modestly when visiting temples</li>
              <li>• Learn a few basic Tamil phrases - locals appreciate it!</li>
              <li>• Book accommodations in advance during peak season</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
        <div className="p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded-xl text-center hover:border-[#b415ff] transition-all">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#b415ff] mx-auto mb-2" />
          <p className="text-xs text-gray-300 font-semibold">Plan Ahead</p>
        </div>
        <div className="p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded-xl text-center hover:border-[#df8908] transition-all">
          <Hotel className="w-5 h-5 sm:w-6 sm:h-6 text-[#df8908] mx-auto mb-2" />
          <p className="text-xs text-gray-300 font-semibold">Book Early</p>
        </div>
        <div className="p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded-xl text-center hover:border-[#b415ff] transition-all">
          <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-[#b415ff] mx-auto mb-2" />
          <p className="text-xs text-gray-300 font-semibold">Try Local Food</p>
        </div>
      </div>
    </div>
  );
}
