import React, { useEffect, useState } from 'react';
import { Thermometer, Clock } from 'lucide-react'; // Cambiamos Sun por Thermometer y Clock

interface WeatherData {
  times: string[];
  temperatures: number[];
}

const WeatherCard = () => {
  const [weather, setWeather] = useState<WeatherData>({
    times: [],
    temperatures: []
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/weather')
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error cargando el clima:", err));

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div className="text-white text-center mt-10 font-serif">Cargando datos de Madrid...</div>;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[url('https://images.squarespace-cdn.com/content/v1/5a86b05bcf81e0af04936cc7/1692730317450-NGEBGYRFT3ASQ1CT6WDX/que-hacer-en-madrid-ae.jpg')] bg-cover bg-center bg-fixed">
      
      <div className="w-full max-w-4xl p-8 rounded-[20px] border-[5px] border-white/20 shadow-2xl bg-slate-200/80 backdrop-blur-md">
        
        {/* Header con Termómetro en lugar de Sol */}
        <div className="flex flex-col items-center mb-12">
          <div className="animate-pulse text-orange-600 mb-4">
            <Thermometer size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 font-serif">Temperatura en Madrid</h1>
          <p className="text-gray-600 italic">Pronóstico próximas 12 horas</p>
        </div>

        {/* Grid de Temperaturas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {weather?.times?.map((time, index) => (
            <div 
              key={`${time}-${index}`} 
              className="group bg-white/40 p-4 rounded-xl flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 border border-white/20"
            >
              <span className="text-gray-500 text-sm font-medium flex items-center gap-1">
                <Clock size={12} /> {time}
              </span>
              <span className="text-4xl font-bold text-gray-800 mt-2">
                {Math.round(weather.temperatures[index])}°
              </span>
              <div className="text-orange-500/50 mt-2">
                <Thermometer size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm border-t border-gray-300/50 pt-4">
          <p className="flex items-center justify-center gap-2">
            <Clock size={14} /> Última actualización: <span className="font-semibold">{currentTime}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;